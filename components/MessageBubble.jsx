export default function MessageBubble({ 
  message, 
  isOwnMessage, 
  senderName,
  isLastMessage = false 
}) {
  const formatTime = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'} ${isLastMessage ? 'mb-10' : ''}`}>
      <div className={`max-w-[70%] rounded-lg px-4 py-2 shadow-sm ${
        isOwnMessage 
          ? 'bg-blue-500 text-white rounded-br-none' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
      }`}>
        <div className="text-sm">{message.content}</div>
        <div className={`text-xs mt-1 text-right ${
          isOwnMessage ? 'text-blue-100' : 'text-gray-400'
        }`}>
          {formatTime(message.created_at)}
        </div>
      </div>
    </div>
  )
}