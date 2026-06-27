import { randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { mockIssues, mockUsers } from '@/lib/mock-data';
import type { Issue, IssueComment, IssueStatus } from '@/lib/types/issue';
import type { UserProfile } from '@/lib/types/user';
import { ensureDataDirectory } from './paths';

const scrypt = promisify(scryptCallback);

interface StoredUser extends UserProfile {
  passwordHash?: string;
  passwordSalt?: string;
}

interface LocalDatabase {
  version: 1;
  issues: Issue[];
  users: StoredUser[];
}

let initialization: Promise<string> | null = null;
let mutationQueue: Promise<unknown> = Promise.resolve();

function cloneSeed<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function databasePath() {
  if (!initialization) {
    initialization = (async () => {
      const directory = await ensureDataDirectory();
      const file = path.join(directory, 'civicpulse.json');
      try {
        await readFile(file, 'utf8');
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
        const seed: LocalDatabase = {
          version: 1,
          issues: cloneSeed(mockIssues),
          users: cloneSeed(mockUsers),
        };
        await writeFile(file, JSON.stringify(seed, null, 2), 'utf8');
      }
      return file;
    })();
  }
  return initialization;
}

async function readDatabase(): Promise<LocalDatabase> {
  const file = await databasePath();
  return JSON.parse(await readFile(file, 'utf8')) as LocalDatabase;
}

async function mutate<T>(operation: (database: LocalDatabase) => T | Promise<T>): Promise<T> {
  const pending = mutationQueue.then(async () => {
    const file = await databasePath();
    const database = await readDatabase();
    const result = await operation(database);
    await writeFile(file, JSON.stringify(database, null, 2), 'utf8');
    return result;
  });
  mutationQueue = pending.then(() => undefined, () => undefined);
  return pending;
}

export async function listIssues(status?: string): Promise<Issue[]> {
  const database = await readDatabase();
  return database.issues
    .filter((issue) => !status || issue.status === status)
    .sort((a, b) => Date.parse(b.reportedAt) - Date.parse(a.reportedAt));
}

export async function getIssue(id: string): Promise<Issue | null> {
  const database = await readDatabase();
  return database.issues.find((issue) => issue.id === id) ?? null;
}

export async function createIssue(data: Omit<Issue, 'id'>): Promise<Issue> {
  return mutate((database) => {
    const issue = { id: `issue-${randomUUID()}`, ...data };
    database.issues.unshift(issue);
    return issue;
  });
}

export async function updateIssue(id: string, changes: Partial<Issue>): Promise<Issue | null> {
  return mutate((database) => {
    const index = database.issues.findIndex((issue) => issue.id === id);
    if (index === -1) return null;
    database.issues[index] = { ...database.issues[index], ...changes, id };
    return database.issues[index];
  });
}

export async function addIssueComment(
  issueId: string,
  author: Pick<UserProfile, 'id' | 'name'>,
  body: string,
): Promise<IssueComment | null> {
  return mutate((database) => {
    const issue = database.issues.find((item) => item.id === issueId);
    if (!issue) return null;
    const comment: IssueComment = {
      id: `comment-${randomUUID()}`,
      authorId: author.id,
      authorName: author.name,
      body,
      createdAt: new Date().toISOString(),
      sentiment: 0.5,
    };
    issue.comments.push(comment);
    return comment;
  });
}

export async function verifyIssue(issueId: string, userId: string): Promise<Issue | null> {
  return mutate((database) => {
    const issue = database.issues.find((item) => item.id === issueId);
    if (!issue) return null;
    if (!issue.verifiedBy.includes(userId)) issue.verifiedBy.push(userId);
    issue.verificationCount = issue.verifiedBy.length;
    if (issue.status === 'REPORTED' && issue.verificationCount >= 3) issue.status = 'VERIFIED';
    return issue;
  });
}

export async function setIssueStatus(
  issueId: string,
  status: IssueStatus,
  note: string,
  actor: string,
): Promise<Issue | null> {
  return mutate((database) => {
    const issue = database.issues.find((item) => item.id === issueId);
    if (!issue) return null;
    issue.status = status;
    issue.statusHistory.push({ status, at: new Date().toISOString(), by: actor, note });
    return issue;
  });
}

export async function listUsers(): Promise<UserProfile[]> {
  const database = await readDatabase();
  return database.users.map(stripCredentials);
}

export async function getUser(id: string): Promise<UserProfile | null> {
  const database = await readDatabase();
  const user = database.users.find((item) => item.id === id);
  return user ? stripCredentials(user) : null;
}

export async function getDemoUser(): Promise<UserProfile> {
  const users = await listUsers();
  return users[0];
}

export async function createUserAccount(input: {
  name: string;
  email: string;
  password: string;
  ward: string;
  phone?: string;
}): Promise<UserProfile> {
  const email = input.email.trim().toLowerCase();
  return mutate(async (database) => {
    if (database.users.some((user) => user.email.toLowerCase() === email)) {
      throw new Error('An account with this email already exists.');
    }
    const salt = randomUUID();
    const derivedKey = (await scrypt(input.password, salt, 64)) as Buffer;
    const hash = Buffer.from(derivedKey).toString('base64');
    const user: StoredUser = {
      id: `user-${randomUUID()}`,
      name: input.name.trim(),
      email,
      phone: input.phone?.trim() || undefined,
      ward: input.ward.trim(),
      role: 'citizen',
      points: 0,
      level: 1,
      badges: [],
      reportsFiled: 0,
      verifications: 0,
      resolvedHelp: 0,
      passwordSalt: salt,
      passwordHash: hash,
    };
    database.users.push(user);
    return stripCredentials(user);
  });
}

export async function authenticateUser(email: string, password: string): Promise<UserProfile | null> {
  const database = await readDatabase();
  const user = database.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
  if (!user?.passwordHash || !user.passwordSalt) return null;
  const actual = Buffer.from((await scrypt(password, user.passwordSalt, 64)) as Buffer);
  const expected = Buffer.from(user.passwordHash, 'base64');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  return stripCredentials(user);
}

function stripCredentials(user: StoredUser): UserProfile {
  const profile = { ...user };
  delete profile.passwordHash;
  delete profile.passwordSalt;
  return profile;
}
