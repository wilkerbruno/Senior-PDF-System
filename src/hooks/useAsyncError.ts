import { useCallback } from 'react';
import { toast } from 'sonner';

type ErrorHandler = (error: unknown, context?: string) => void;

interface UseAsyncErrorOptions {
  showToast?: boolean;
  logError?: boolean;
}

export function useAsyncError(options: UseAsyncErrorOptions = {}): ErrorHandler {
  const { showToast = true, logError = true } = options;

  return useCallback((error: unknown, context?: string) => {
    const message = error instanceof Error ? error.message : 'Um erro inesperado ocorreu';
    const contextMessage = context ? `${context}: ${message}` : message;

    if (logError) {
      console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
    }

    if (showToast) {
      toast.error('Erro', {
        description: contextMessage,
      });
    }
  }, [showToast, logError]);
}

// Utility function for wrapping async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  onError?: (error: unknown) => void,
  context?: string
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[Error${context ? ` - ${context}` : ''}]:`, message);
    }
    return null;
  }
}
