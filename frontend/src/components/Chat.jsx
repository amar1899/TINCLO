import { useState, useEffect, useRef } from 'react';
import SocketService from '../services/SocketService';

const SAMPLE_CONTACTS = [
  { id: 'recruiter-1', name: 'Priya Sharma', role: 'Recruiter at Infosys',   avatar: 'P', online: true,  lastMsg: 'We reviewed your application...' },
  { id: 'recruiter-2', name: 'Rahul Mehta',  role: 'HR at TCS',              avatar: 'R', online: false, lastMsg: 'Thank you for applying!' },
  { id: 'recruiter-3', name: 'Anita Patel',  role: 'Talent at Google India', avatar: 'A', online: true,  lastMsg: 'Can we schedule a call?' },
];

const INITIAL_MESSAGES = {
  'recruiter-1': [
    { id: 1, from: 'recruiter-1', text: 'Hi! We reviewed your application for Full Stack Developer.', time: '10:30 AM' },
    { id: 2, from: 'me',          text: 'Thank you! I am very interested in the role.',               time: '10:32 AM' },
    { id: 3, from: 'recruiter-1', text: 'Great! Can you share your availability for an interview?',   time: '10:35 AM' },
  ],
  'recruiter-2': [
    { id: 1, from: 'recruiter-2', text: 'Thank you for applying to Data Scientist role at TCS.', time: '9:00 AM' },
    { id: 2, from: 'me',          text: 'I look forward to hearing from you.',                    time: '9:05 AM' },
  ],
  'recruiter-3': [
    { id: 1, from: 'recruiter-3', text: 'Can we schedule a call to discuss the ML Engineer role?', time: 'Yesterday' },
  ],
};

const CHAT_STORAGE_KEY = 'tinclo_chat_messages';
const loadMessages = () => {
  try { const s = localStorage.getItem(CHAT_STORAGE_KEY); if (s) return JSON.parse(s); } catch (e) { /* ignore */ }
  return INITIAL_MESSAGES;
};
const saveMessages = (msgs) => {
  try { localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(msgs)); } catch (e) { /* ignore */ }
};

const Chat = ({ onClose, currentUser }) => {
  const [selectedContact, setSelectedContact] = useState(SAMPLE_CONTACTS[0]);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, selectedContact]);
  useEffect(() => { saveMessages(messages); }, [messages]);

  useEffect(() => {
    const socket = SocketService.getSocket();
    if (socket?.connected) setSocketConnected(true);
    const handleIncoming = (msgData) => {
      const contactId = msgData.fromUser?.id || msgData.fromUser || selectedContact.id;
      const newMsg = {
        id: msgData.id || Date.now(), from: contactId,
        text: msgData.text || msgData.message,
        time: msgData.timestamp
          ? new Date(msgData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => ({ ...prev, [contactId]: [...(prev[contactId] || []), newMsg] }));
    };
    if (socket) {
      socket.on('chat:message', handleIncoming);
      socket.on('connect', () => setSocketConnected(true));
      socket.on('disconnect', () => setSocketConnected(false));
    }
    return () => {
      if (socket) { socket.off('chat:message', handleIncoming); socket.off('connect'); socket.off('disconnect'); }
    };
  }, [selectedContact.id]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), from: 'me', text: input.trim(), time: now };
    setMessages(prev => ({ ...prev, [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg] }));
    const socket = SocketService.getSocket();
    if (socket?.connected && currentUser) {
      socket.emit('chat:message', { toUserId: selectedContact.id, message: { id: newMsg.id, text: newMsg.text }, fromUser: { id: currentUser.id, name: currentUser.name } });
    } else {
      setTimeout(() => {
        const replies = ['Thanks for your message! We will get back to you shortly.', 'That sounds great! Let me check with the team.', 'Perfect! I will send you the interview details.', 'We appreciate your interest in joining us.', 'Could you share your resume for our records?'];
        const reply = { id: Date.now() + 1, from: selectedContact.id, text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => ({ ...prev, [selectedContact.id]: [...(prev[selectedContact.id] || []), reply] }));
      }, 1200 + Math.random() * 800);
    }
    setInput('');
  };

  const currentMessages = messages[selectedContact.id] || [];

  return (
    /* chat-overlay */
    <div className="fixed inset-0 bg-black/50 z-[600] flex items-end justify-end p-5 backdrop-blur-sm" onClick={onClose}>
      {/* chat-container */}
      <div className="w-[700px] h-[520px] bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.3)] flex overflow-hidden animate-slide-up max-sm:w-full max-sm:h-full max-sm:rounded-none"
        onClick={e => e.stopPropagation()}>

        {/* Sidebar */}
        <div className="w-[240px] border-r border-gray-200 flex flex-col bg-gray-50 max-sm:w-[200px]">
          {/* Sidebar header */}
          <div className="px-4 py-4 flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
            <h3 className="text-white text-[15px] font-extrabold m-0">Messages</h3>
            <button className="bg-white/20 border-none text-white w-[26px] h-[26px] rounded-full text-base cursor-pointer flex items-center justify-center" onClick={onClose}>×</button>
          </div>

          {/* Contacts */}
          <div className="overflow-y-auto flex-1">
            {SAMPLE_CONTACTS.map(contact => (
              <div key={contact.id}
                className={`flex gap-2.5 px-3.5 py-3 cursor-pointer border-b border-gray-200 transition-colors ${selectedContact.id === contact.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[15px] font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                    {contact.avatar}
                  </div>
                  {contact.online && <div className="absolute bottom-px right-px w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-gray-900">{contact.name}</div>
                  <div className="text-[11px] text-gray-500 my-px">{contact.role}</div>
                  <div className="text-[11px] text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
                    {messages[contact.id]?.slice(-1)[0]?.text || contact.lastMsg}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {socketConnected && (
            <div className="px-3.5 py-2 text-[11px] font-semibold text-green-600 bg-green-50 border-t border-gray-200 text-center">
              🟢 Live chat active
            </div>
          )}
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col">
          {/* Window header */}
          <div className="px-[18px] py-3.5 border-b border-gray-200 flex items-center gap-3 bg-white">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
              {selectedContact.avatar}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{selectedContact.name}</div>
              <div className="text-xs text-gray-500">{selectedContact.online ? '🟢 Online' : '⚫ Offline'} · {selectedContact.role}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-gray-50">
            {currentMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col max-w-[75%] ${msg.from === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed break-words ${
                  msg.from === 'me'
                    ? 'text-white rounded-br-[4px]'
                    : 'bg-white text-gray-700 border border-gray-200 rounded-bl-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]'
                }`}
                  style={msg.from === 'me' ? { background: 'linear-gradient(135deg, #667eea, #764ba2)' } : {}}>
                  {msg.text}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{msg.time}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form className="px-4 py-3 border-t border-gray-200 flex gap-2.5 bg-white" onSubmit={sendMessage}>
            <input
              type="text"
              className="flex-1 px-3.5 py-2.5 border-2 border-gray-200 rounded-full text-[13px] outline-none transition-colors font-[inherit] focus:border-indigo-400"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit"
              className="w-10 h-10 rounded-full text-white border-none text-base cursor-pointer flex items-center justify-center transition-all flex-shrink-0 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              disabled={!input.trim()}>
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
