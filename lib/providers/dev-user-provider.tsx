'use client'

import { createContext, useContext, ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

const mockUser: User = {
  id: 'dev-user-123',
  email: 'dev@chartthecourse.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  confirmed_at: new Date().toISOString(),
  email_confirmed_at: new Date().toISOString(),
  phone: null,
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
}

interface DevUserContextType {
  user: User
  isDevMode: boolean
}

const DevUserContext = createContext<DevUserContextType>({
  user: mockUser,
  isDevMode: true,
})

export function DevUserProvider({ children }: { children: ReactNode }) {
  return (
    <DevUserContext.Provider value={{ user: mockUser, isDevMode: true }}>
      {children}
    </DevUserContext.Provider>
  )
}

export function useDevUser() {
  return useContext(DevUserContext)
}