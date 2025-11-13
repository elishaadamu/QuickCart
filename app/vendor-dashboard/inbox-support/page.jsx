"use client";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_CONFIG, apiUrl } from "@/configs/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InboxPage = () => {
  const { userData, authLoading } = useAppContext();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [composeOpen, setComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    message: "",
  });

  // Mock data - replace with actual API calls
  const mockMessages = [
    {
      id: 1,
      from: "Support Team",
      fromEmail: "support@deliveryapp.com",
      subject: "Weekly Update: New Features Available",
      preview:
        "We've released new features to help you manage deliveries more efficiently...",
      body: "Dear Delivery Partner,\n\nWe're excited to announce new features in our platform:\n\n• Real-time delivery tracking enhancements\n• Improved route optimization\n• New earning reports dashboard\n\nLog in to explore these updates!\n\nBest regards,\nSupport Team",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      folder: "inbox",
      priority: "high",
    },
    {
      id: 2,
      from: "Payment Department",
      fromEmail: "payments@deliveryapp.com",
      subject: "Payment Processed for Week 45",
      preview: "Your payment for delivery services has been processed...",
      body: "Hello,\n\nWe've processed your payment for Week 45. The amount of ₦45,200 has been transferred to your registered account.\n\nThank you for your service!\n\nPayment Department",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      folder: "inbox",
      priority: "medium",
    },
    {
      id: 3,
      from: "System Notification",
      fromEmail: "noreply@deliveryapp.com",
      subject: "Delivery Assignment: #DR-7842",
      preview: "You have been assigned a new delivery request...",
      body: "New delivery assignment:\n\nRequest ID: #DR-7842\nPickup: Lagos Mainland\nDelivery: Victoria Island\nEstimated Earnings: ₦8,500\n\nPlease check your assignments page for details.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      read: true,
      folder: "inbox",
      priority: "high",
    },
    {
      id: 4,
      from: "Training Department",
      fromEmail: "training@deliveryapp.com",
      subject: "Upcoming Safety Webinar",
      preview: "Join our safety webinar this Friday at 2 PM...",
      body: "Dear Partner,\n\nWe're hosting a safety webinar covering:\n\n• Road safety best practices\n• Customer interaction guidelines\n• Emergency procedures\n\nDate: Friday, 3 PM\nPlatform: Zoom\n\nRegistration is mandatory.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: false,
      folder: "inbox",
      priority: "medium",
    },
  ];

  useEffect(() => {
    const fetchMessages = async () => {
      if (authLoading) return;

      if (!userData) {
        router.push("/delivery-signin");
        return;
      }

      try {
        // Replace with actual API call
        // const response = await axios.get(apiUrl(API_CONFIG.ENDPOINTS.MESSAGES.GET_ALL));
        // setMessages(response.data);

        // Using mock data for now
        setMessages(mockMessages);
      } catch (error) {
        toast.error("Failed to load messages");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userData, authLoading, router]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Replace with actual API call
      // await axios.post(apiUrl(API_CONFIG.ENDPOINTS.MESSAGES.SEND), newMessage);

      toast.success("Message sent successfully!");
      setNewMessage({ to: "", subject: "", message: "" });
      setComposeOpen(false);
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );

    if (selectedMessage?.id === messageId) {
      setSelectedMessage((prev) => ({ ...prev, read: true }));
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast.success("Message deleted");
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-100 border-red-200",
      medium: "text-yellow-600 bg-yellow-100 border-yellow-200",
      low: "text-green-600 bg-green-100 border-green-200",
    };
    return colors[priority] || colors.low;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;

    if (diff < 1000 * 60 * 60) {
      // Less than 1 hour
      return `${Math.floor(diff / (1000 * 60))}m ago`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      // Less than 1 day
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 h-screen flex flex-col">
      <ToastContainer />

      {/* Header */}
      <div className="relative mb-6">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-green-100 rounded-full opacity-50 blur-xl"></div>

        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
              <p className="text-gray-600">
                Manage your messages and notifications
              </p>
            </div>
            <button
              onClick={() => setComposeOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors duration-200 shadow-sm flex items-center gap-2"
            >
              <span>📝</span>
              Compose
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
          <div className="space-y-2">
            {[
              {
                id: "inbox",
                label: "Inbox",
                icon: "📥",
                count: messages.filter((m) => m.folder === "inbox" && !m.read)
                  .length,
              },
              { id: "sent", label: "Sent", icon: "📤", count: 0 },
              { id: "drafts", label: "Drafts", icon: "📝", count: 0 },
              { id: "archived", label: "Archived", icon: "📁", count: 0 },
            ].map((folder) => (
              <button
                key={folder.id}
                onClick={() => setActiveFolder(folder.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-colors ${
                  activeFolder === folder.id
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{folder.icon}</span>
                  <span className="font-medium">{folder.label}</span>
                </div>
                {folder.count > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full min-w-6 text-center">
                    {folder.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Message List */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {activeFolder} (
                {messages.filter((m) => m.folder === activeFolder).length})
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {messages.filter((m) => m.folder === activeFolder).length ===
              0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-medium mb-2">No messages</h3>
                  <p>Your {activeFolder} is empty</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {messages
                    .filter((m) => m.folder === activeFolder)
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((message) => (
                      <div
                        key={message.id}
                        onClick={() => {
                          setSelectedMessage(message);
                          handleMarkAsRead(message.id);
                        }}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedMessage?.id === message.id
                            ? "bg-blue-50 border-r-4 border-blue-600"
                            : ""
                        } ${!message.read ? "bg-blue-50/50" : ""}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-blue-600 font-semibold">
                            {message.from.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 truncate">
                                {message.from}
                              </span>
                              {message.priority === "high" && (
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                                    message.priority
                                  )}`}
                                >
                                  Important
                                </span>
                              )}
                            </div>

                            <h3
                              className={`font-medium mb-1 truncate ${
                                !message.read
                                  ? "text-gray-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {message.subject}
                            </h3>

                            <p className="text-sm text-gray-500 truncate">
                              {message.preview}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatTime(message.timestamp)}
                            </span>
                            {!message.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          {selectedMessage ? (
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedMessage.subject}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center text-blue-600 font-semibold text-lg">
                    {selectedMessage.from.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {selectedMessage.from}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedMessage.fromEmail}
                    </div>
                    <div className="text-sm text-gray-400">
                      {selectedMessage.timestamp.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none">
                  {selectedMessage.body.split("\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-4 text-gray-700 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-colors">
                    Reply
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-2xl transition-colors">
                    Forward
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500 p-8">
                <div className="text-6xl mb-4">📨</div>
                <h3 className="text-lg font-medium mb-2">Select a message</h3>
                <p>Choose a message from your inbox to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {composeOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">New Message</h3>
                <button
                  onClick={() => setComposeOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="email"
                  value={newMessage.to}
                  onChange={(e) =>
                    setNewMessage((prev) => ({ ...prev, to: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Message subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.message}
                  onChange={(e) =>
                    setNewMessage((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-2xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxPage;
