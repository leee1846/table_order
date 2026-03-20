import { QueryClient, QueryClientProvider } from '@repo/api/tanstack-query';
import { isNetworkErrorWithGetRequest } from '@repo/api/globalErrorHandler';
import { useState, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) =>
              failureCount < 3 && isNetworkErrorWithGetRequest(error),
            networkMode: 'always',
          },
          mutations: {
            retry: 0,
            networkMode: 'always',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
