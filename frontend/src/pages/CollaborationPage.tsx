import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
    MessageSquare, Send, User,
    Calendar, Megaphone, Plus, Hash,
    Video, Lock
} from 'lucide-react';

interface Notice {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
}

interface ForumPost {
    id: number;
    title: string;
    content: string;
    topic: string;
    created_at: string;
    comments: any[];
}

export const CollaborationPage: React.FC = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [activeTab, setActiveTab] = useState<'notices' | 'forum' | 'messages'>('notices');
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [meetingLink, setMeetingLink] = useState<{ link: string, password: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        if (activeTab === 'messages') {
            fetchMessages();
        }
    }, [activeTab]);

    const fetchData = async () => {
        try {
            const [nRes, pRes] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/communication/notices'),
                axios.get('http://localhost:8000/api/v1/communication/forum')
            ]);
            setNotices(nRes.data);
            setPosts(pRes.data);
        } catch (error) {
            console.error('Error fetching communication data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        try {
            // Simulated user IDs for demo
            const res = await axios.get('http://localhost:8000/api/v1/communication/messages/1?other_id=2');
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            await axios.post('http://localhost:8000/api/v1/communication/messages', {
                sender_id: 1,
                receiver_id: 2,
                content: newMessage,
                is_encrypted: isEncrypted
            });
            setNewMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleGenerateMeeting = async () => {
        try {
            const res = await axios.post('http://localhost:8000/api/v1/communication/meeting-link?topic=General Discussion');
            setMeetingLink(res.data);
        } catch (error) {
            console.error('Error generating meeting link:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Collaboration Hub</h1>
                        <p className="text-slate-500 font-medium">Institutional updates and academic community forums.</p>
                    </div>
                    <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        {['notices', 'forum', 'messages'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t as any)}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-200 capitalize ${activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {activeTab === 'notices' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-slate-800 flex items-center">
                                        <Megaphone className="w-6 h-6 mr-2 text-indigo-500" /> Official Notices
                                    </h3>
                                    <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center">
                                        <Plus className="w-4 h-4 mr-2" /> Post Notice
                                    </button>
                                </div>
                                {notices.map(notice => (
                                    <div key={notice.id} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors group">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-indigo-100">
                                                {notice.category}
                                            </span>
                                            <span className="text-slate-400 text-xs font-medium flex items-center">
                                                <Calendar className="w-3.5 h-3.5 mr-1" /> {new Date(notice.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{notice.title}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{notice.content}</p>
                                    </div>
                                ))}
                                {notices.length === 0 && <p className="text-center py-12 text-slate-400 italic font-bold">No official notices posted yet.</p>}
                            </div>
                        )}

                        {activeTab === 'forum' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-black text-slate-800 flex items-center">
                                        <MessageSquare className="w-6 h-6 mr-2 text-emerald-500" /> Academic Forum
                                    </h3>
                                    <button className="bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center">
                                        <Send className="w-4 h-4 mr-2" /> Start Discussion
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {posts.map(post => (
                                        <div key={post.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <Hash className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{post.topic}</span>
                                                </div>
                                                <h4 className="text-lg font-black text-slate-900 mb-2">{post.title}</h4>
                                                <p className="text-slate-500 text-sm font-medium line-clamp-2">{post.content}</p>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">Anonymous</span>
                                                </div>
                                                <div className="flex items-center space-x-1 text-slate-400">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span className="text-xs font-black">{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {posts.length === 0 && <p className="text-center py-12 text-slate-400 italic font-bold">The forum is currently quiet. Start the conversation!</p>}
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="bg-white rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden flex flex-col h-[600px]">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">Direct Messages</h3>
                                            <p className="text-xs font-bold text-indigo-500 uppercase tracking-tighter">Connected to Faculty Support</p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleGenerateMeeting}
                                            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all"
                                        >
                                            <Video className="w-4 h-4 text-emerald-500" />
                                            <span>Start Meeting</span>
                                        </button>
                                    </div>
                                </div>

                                {meetingLink && (
                                    <div className="mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center animate-in fade-in slide-in-from-top-4">
                                        <div>
                                            <p className="text-xs font-black text-emerald-800 uppercase mb-1">Live Meeting Created</p>
                                            <a href={meetingLink.link} target="_blank" rel="noreferrer" className="text-sm font-bold text-emerald-600 underline">Join Zoom Session</a>
                                        </div>
                                        <button onClick={() => setMeetingLink(null)} className="text-emerald-400 hover:text-emerald-600">
                                            <Plus className="w-4 h-4 rotate-45" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                    {messages.map((m: any) => (
                                        <div key={m.id} className={`flex ${m.sender_id === 1 ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-5 rounded-[24px] font-medium shadow-sm relative ${m.sender_id === 1
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-slate-100 text-slate-800 rounded-tl-none'
                                                }`}>
                                                {m.is_encrypted && (
                                                    <div className="flex items-center space-x-1 mb-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                                                        <Lock className="w-3 h-3" />
                                                        <span>End-to-End Encrypted</span>
                                                    </div>
                                                )}
                                                {m.content}
                                                <div className={`text-[10px] mt-2 opacity-50 ${m.sender_id === 1 ? 'text-right' : 'text-left'}`}>
                                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                                            <MessageSquare className="w-12 h-12 opacity-20" />
                                            <p className="font-black italic">Start a new conversation...</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 border-t border-slate-100 bg-white">
                                    <div className="flex space-x-3 items-center mb-4">
                                        <button
                                            onClick={() => setIsEncrypted(!isEncrypted)}
                                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isEncrypted ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                                                }`}
                                        >
                                            <Lock className={`w-3 h-3 ${isEncrypted ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            <span>Encryption: {isEncrypted ? 'ON' : 'OFF'}</span>
                                        </button>
                                    </div>
                                    <div className="flex space-x-3 items-center bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-400 px-4"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-slate-900 transition-colors shadow-lg"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
