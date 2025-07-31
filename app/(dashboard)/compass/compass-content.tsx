'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VisionDisplay } from '@/components/compass/VisionDisplay'
import { ChatInterface } from '@/components/compass/ChatInterface'
import { VisionForm } from '@/components/compass/VisionForm'
import type { Database } from '@/lib/types/database'

type VisionDocument = Database['public']['Tables']['vision_documents']['Row']
type VisionChat = Database['public']['Tables']['vision_chats']['Row']

interface CompassContentProps {
  initialVision: VisionDocument | null
  initialChats: VisionChat[]
}

export function CompassContent({ initialVision, initialChats }: CompassContentProps) {
  const [vision, setVision] = useState<VisionDocument | null>(initialVision)
  const [chats, setChats] = useState<VisionChat[]>(initialChats)
  const [isCreating, setIsCreating] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const supabase = createClient()

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('compass-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vision_documents',
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setVision(payload.new as VisionDocument)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vision_chats',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setChats((current) => [payload.new as VisionChat, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setChats((current) =>
              current.map((chat) =>
                chat.id === payload.new.id ? (payload.new as VisionChat) : chat
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleVisionCreate = async (visionData: Partial<VisionDocument>) => {
    setIsCreating(false)
    // Real-time subscription will handle the update
  }

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || isProcessing) return
    
    setIsProcessing(true)

    try {
      // Create user message
      const { data: userMessage } = await supabase
        .from('vision_chats')
        .insert({
          message,
          role: 'user' as const,
        })
        .select()
        .single()

      // Call edge function for AI response
      const { data, error } = await supabase.functions.invoke('vision-chat', {
        body: { 
          message,
          visionDocument: vision,
          recentChats: chats.slice(0, 10),
        },
      })

      if (error) throw error

      // The AI response will be inserted via the edge function
    } catch (error) {
      console.error('Error processing chat:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">True North Compass</h1>
        <p className="text-muted text-lg">
          Chart your course with AI-guided clarity on what truly matters
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Vision Document Section */}
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="heading-3">Your Vision</h2>
            {!vision && !isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary"
              >
                🧭 Define Vision
              </button>
            )}
          </div>

          {isCreating ? (
            <VisionForm 
              onSubmit={handleVisionCreate}
              onCancel={() => setIsCreating(false)}
            />
          ) : vision ? (
            <VisionDisplay 
              vision={vision}
              onEdit={() => setIsCreating(true)}
            />
          ) : (
            <div className="card text-center py-12">
              <p className="text-muted mb-4">
                No vision document yet. Start by defining your north star.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="btn-ghost"
              >
                Begin Your Journey
              </button>
            </div>
          )}
        </div>

        {/* Chat Interface Section */}
        <div className="flex flex-col h-[600px]">
          <h2 className="heading-3 mb-4">Vision Navigator</h2>
          <ChatInterface 
            chats={chats}
            onSubmit={handleChatSubmit}
            isProcessing={isProcessing}
            hasVision={!!vision}
          />
        </div>
      </div>
    </div>
  )
}