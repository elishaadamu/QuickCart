'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ConversationList({ 
  currentUserId, 
  currentUserType, 
  activeConversationId 
}) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  // Determine which column to filter by - moved outside useEffect
  const column = currentUserType === 'user' ? 'user_id' : 'vendor_id'

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq(column, currentUserId)
        .order('last_message_at', { ascending: false, nullsFirst: false })

      if (!error && data) {
        setConversations(data)
      }
      setLoading(false)
    }

    fetchConversations()

    // Subscribe to conversation updates
    const channel = supabase
      .channel(`user-conversations-${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `${column}=eq.${currentUserId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConversations(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setConversations(prev => 
              prev.map(conv => 
                conv.id === payload.new.id 
                  ? { ...conv, ...payload.new }
                  : conv
              ).sort((a, b) => {
                const aTime = a.last_message_at ? new Date(a.last_message_at).getTime() : 0
                const bTime = b.last_message_at ? new Date(b.last_message_at).getTime() : 0
                return bTime - aTime
              })
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, currentUserType, column]) // Add column to dependencies

  // Rest of the component remains the same...
  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getDisplayName = (conversation) => {
    return currentUserType === 'user' 
      ? conversation.vendor_name 
      : conversation.user_name
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
        <p className="text-sm text-gray-500">
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-gray-400">💬</span>
            </div>
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-sm text-gray-400 mt-1">Start a chat from a vendor profile</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId
            const displayName = getDisplayName(conversation)
            
            return (
              <Link
                key={conversation.id}
                href={`/chat/${conversation.id}`}
                className={`block border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-blue-50' : ''
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-gray-900 truncate">
                          {displayName}
                        </p>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(conversation.last_message_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message || 'No messages yet'}
                      </p>

                      {/* Unread badge */}
                      {conversation.unread_count > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}