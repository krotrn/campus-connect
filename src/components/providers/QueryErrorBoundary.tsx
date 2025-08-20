'use client';

import React from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

interface QueryErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Default fallback component that displays when a React Query error occurs.
 *
 * This component provides a user-friendly error interface with the error message
 * and a retry button. It's styled with Tailwind CSS to show a red-themed error
 * state with proper spacing and typography. The component displays the actual
 * error message when available, or a generic fallback message.
 *
 * @param props - The component props
 * @param props.error - The error object containing details about what went wrong
 * @param props.resetErrorBoundary - Function to reset the error state and retry
 *
 * @returns A JSX element containing the error display and retry functionality
 *
 * @example
 * ```tsx
 * // Used automatically by QueryErrorBoundary when an error occurs
 * <QueryErrorFallback
 *   error={new Error("Failed to fetch data")}
 *   resetErrorBoundary={() => refetch()}
 * />
 * ```
 *
 */
function QueryErrorFallback({
  error,
  resetErrorBoundary,
}: QueryErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-lg font-semibold text-red-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-red-600 text-center mb-4">
        {error.message || 'An unexpected error occurred while loading data.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

interface QueryErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<QueryErrorFallbackProps>;
}

/**
 * Error boundary wrapper specifically designed for React Query error handling.
 *
 * This component combines TanStack Query's QueryErrorResetBoundary with
 * react-error-boundary's ErrorBoundary to provide comprehensive error handling
 * for React Query operations. It automatically catches errors that occur during
 * query execution and displays a fallback UI with retry functionality. The
 * component integrates with React Query's error recovery mechanisms to allow
 * seamless error recovery and query retrying.
 *
 * @param props - The component props
 * @param props.children - Child components to be protected by the error boundary
 * @param props.fallback - Optional custom error fallback component
 *
 * @returns A JSX element wrapping children with error boundary protection
 *
 * @see {@link QueryErrorFallback} for the default error display component
 * @see {@link QueryErrorResetBoundary} from TanStack Query for error reset functionality
 * @see {@link ErrorBoundary} from react-error-boundary for error catching
 */
export function QueryErrorBoundary({
  children,
  fallback,
}: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={fallback || QueryErrorFallback}
          onReset={reset}
          resetKeys={['query-error']}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
