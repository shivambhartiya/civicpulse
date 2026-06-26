'use client';
import React from 'react';
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> { state = { hasError: false }; static getDerivedStateFromError() { return { hasError: true }; } render() { if (this.state.hasError) return <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">Something went wrong.</div>; return this.props.children; } }
