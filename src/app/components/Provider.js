'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Provider({ children }) {
 
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools default close rahenge */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}