'use client'

import { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { supabase } from '@/lib/supabase'

export default function ChatWindowFixed({ conversationId, currentUser, otherParty }) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true)
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      
      if (data) setMessages(data)
      setLoading(false)
    }

    loadMessages()

    // Real-time subscription for messages
    const channel = supabase
      .channel(`conv-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = async () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || sending || !conversationId) return
    
    setSending(true)

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUser.id,
        sender_type: currentUser.type,
        content: trimmedMessage
      })

    if (!error) {
      setMessage('')
    }
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#dbeafe', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <span style={{ color: '#2563eb', fontWeight: '600' }}>
              {otherParty.name.charAt(0)}
            </span>
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{otherParty.name}</h2>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              {otherParty.type === 'vendor' ? 'Vendor' : 'Customer'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '16px', 
        backgroundColor: '#f9fafb',
        paddingBottom: '120px' // THIS CREATES THE SPACE
      }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div>Loading...</div>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <span style={{ fontSize: '24px', color: '#9ca3af' }}>💬</span>
              </div>
              <p style={{ color: '#6b7280' }}>No messages yet</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: '12px' }}>
                <MessageBubble
                  message={msg}
                  isOwnMessage={msg.sender_id === currentUser.id}
                  senderName={msg.sender_id === currentUser.id ? currentUser.name : otherParty.name}
                />
              </div>
            ))}
            <div ref={messagesEndRef} style={{ height: '1px' }} />
          </>
        )}
      </div>

      {/* Input area */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #e5e7eb', 
        backgroundColor: 'white',
        position: 'sticky',
        bottom: 0
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{
              flex: 1,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px 16px',
              outline: 'none'
            }}
            disabled={sending}
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || sending}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '8px',
              fontWeight: '500',
              opacity: (!message.trim() || sending) ? 0.5 : 1,
              cursor: (!message.trim() || sending) ? 'not-allowed' : 'pointer'
            }}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}