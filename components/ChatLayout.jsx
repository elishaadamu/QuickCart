'use client'

export default function ChatLayout({ children, sidebar }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (optional) */}
      {sidebar && (
        <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
          {sidebar}
        </div>
      )}
      
      {/* Main chat area - fills remaining space */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}