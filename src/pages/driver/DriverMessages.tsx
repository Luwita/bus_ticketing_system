import React, { useState } from 'react';
import { MessageSquare, Send, Phone, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { format } from 'date-fns';

const DriverMessages: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('dispatch');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: 'dispatch',
      name: 'Dispatch Center',
      type: 'dispatch',
      lastMessage: 'Trip LUS-NDL-001 confirmed for 06:00 departure',
      timestamp: '2024-02-15T10:30:00Z',
      unread: 2,
      status: 'online'
    },
    {
      id: 'passenger1',
      name: 'Mutale Banda',
      type: 'passenger',
      lastMessage: 'What time will we arrive in Ndola?',
      timestamp: '2024-02-15T09:45:00Z',
      unread: 1,
      status: 'offline'
    },
    {
      id: 'support',
      name: 'Technical Support',
      type: 'support',
      lastMessage: 'GPS issue has been resolved',
      timestamp: '2024-02-15T08:20:00Z',
      unread: 0,
      status: 'online'
    },
    {
      id: 'passenger2',
      name: 'Joseph Mwanza',
      type: 'passenger',
      lastMessage: 'Thank you for the smooth ride!',
      timestamp: '2024-02-14T16:30:00Z',
      unread: 0,
      status: 'offline'
    }
  ];

  // Mock messages for selected conversation
  const messages = {
    dispatch: [
      {
        id: '1',
        sender: 'dispatch',
        content: 'Good morning! Your trip LUS-NDL-001 is confirmed for 06:00 departure.',
        timestamp: '2024-02-15T06:00:00Z',
        type: 'text'
      },
      {
        id: '2',
        sender: 'me',
        content: 'Received. Bus ACB 1234 is ready for departure.',
        timestamp: '2024-02-15T06:05:00Z',
        type: 'text'
      },
      {
        id: '3',
        sender: 'dispatch',
        content: 'All passengers have checked in. You are cleared for departure.',
        timestamp: '2024-02-15T06:15:00Z',
        type: 'text'
      },
      {
        id: '4',
        sender: 'me',
        content: 'Departing now. ETA Ndola 10:00 AM.',
        timestamp: '2024-02-15T06:20:00Z',
        type: 'text'
      },
      {
        id: '5',
        sender: 'dispatch',
        content: 'Safe travels! Please update when you reach Kabwe.',
        timestamp: '2024-02-15T06:25:00Z',
        type: 'text'
      }
    ],
    passenger1: [
      {
        id: '1',
        sender: 'passenger1',
        content: 'Hello, I have a booking for the 6 AM bus to Ndola. What time will we arrive?',
        timestamp: '2024-02-15T09:30:00Z',
        type: 'text'
      },
      {
        id: '2',
        sender: 'me',
        content: 'Good morning! We are scheduled to arrive in Ndola at 10:00 AM. Currently running on time.',
        timestamp: '2024-02-15T09:35:00Z',
        type: 'text'
      },
      {
        id: '3',
        sender: 'passenger1',
        content: 'Perfect, thank you! How is the traffic?',
        timestamp: '2024-02-15T09:45:00Z',
        type: 'text'
      }
    ]
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentMessages = messages[selectedConversation as keyof typeof messages] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic would go here
      setNewMessage('');
    }
  };

  const ConversationList = () => (
    <div className="space-y-2">
      {filteredConversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => setSelectedConversation(conversation.id)}
          className={`w-full p-4 rounded-lg text-left transition-colors ${
            selectedConversation === conversation.id
              ? 'bg-blue-50 border border-blue-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              <h3 className="font-medium text-gray-900">{conversation.name}</h3>
              {conversation.type === 'dispatch' && (
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  Dispatch
                </span>
              )}
              {conversation.type === 'support' && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                  Support
                </span>
              )}
            </div>
            {conversation.unread > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {conversation.unread}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
          <p className="text-xs text-gray-500 mt-1">
            {format(new Date(conversation.timestamp), 'HH:mm')}
          </p>
        </button>
      ))}
    </div>
  );

  const MessageBubble = ({ message }: { message: any }) => (
    <div className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'me'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <p className={`text-xs mt-1 ${
          message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with dispatch, support, and passengers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <ConversationList />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    selectedConv.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedConv.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedConv.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedConv.type === 'passenger' && (
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                  )}
                  {selectedConv.type === 'dispatch' && (
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {currentMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Contact Dispatch</h3>
          </div>
          <p className="text-gray-600 mb-4">Report trip status or request assistance</p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Send Message
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Emergency Alert</h3>
          </div>
          <p className="text-gray-600 mb-4">Send emergency notification to dispatch</p>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            Send Alert
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">Trip Update</h3>
          </div>
          <p className="text-gray-600 mb-4">Send status update to passengers</p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Send Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverMessages;