'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getQueryClient } from '@/libs/get-query-client'

export default function Provider({ children }) {

  // 1. new QueryClient() ki jagah ab getQueryClient() use ho raha hai -
  //    isse SSR hydration wale queryClient ke saath consistent staleTime
  //    aur dehydrate config match karta hai. Browser mein ye function
  //    khud hi singleton return karta hai (dobara render pe naya client
  //    nahi banega).
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools default close rahenge */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}