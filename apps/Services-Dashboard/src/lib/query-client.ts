import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // data won't refetch when window is focused
            retry: 1, // retry failed requests once
            staleTime: 1000 * 60 * 5, // query data is fresh for 5 minutes
        },
    },
});
