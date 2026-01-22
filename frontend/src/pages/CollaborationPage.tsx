import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
    MessageSquare, Send, User,
    Calendar, Megaphone, Plus, Hash,
    Video, Lock, ShieldCheck, Users
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
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const isStudent = userRole === 'Student';

    // Personalize hub names
    const hubName = isStudent ? 'Student Community Hub' :
        userRole === 'Instructor' ? 'Instructor Lounge' :
            userRole === 'Staff' ? 'Operations Center' : 'Admin Command Hub';

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
        if (activeTab === 'messages' && user?.id) {
            fetchMessages();
        }
    }, [activeTab, user?.id]);

    const fetchData = async () => {
        try {
            const [nRes, pRes] = await Promise.all([
                api.get('/communication/notices'),
                api.get('/communication/forum')
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
        if (!user?.id) return;
        try {
            // Demo fallback for message history
            const res = await api.get(`/communication/messages/${user.id}?other_id=${user.id === 1 ? 2 : 1}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !user?.id) return;
        try {
            await api.post('/communication/messages', {
                receiver_id: user.id === 1 ? 2 : 1,
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
            const res = await api.post(`/communication/meeting-link?topic=${hubName} Live Group Session`);
            setMeetingLink(res.data);
        } catch (error) {
            console.error('Error generating meeting link:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-widest mb-2">
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Verified Professional Space
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{hubName}</h1>
                        <p className="text-slate-500 font-medium">Connect and collaborate with matched {userRole.toLowerCase()} peers.</p>
                    </div>
                    <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto overflow-x-auto">
                        {[
                            { id: 'notices', label: 'Bulletin', icon: Megaphone },
                            { id: 'forum', label: 'Community Forum', icon: MessageSquare },
                            { id: 'messages', label: 'Direct Messages', icon: Send }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setActiveTab(t.id as any)}
                                className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap ${activeTab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                <t.icon className="w-4 h-4 mr-2" />
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-24 bg-white rounded-[40px] border border-slate-100">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'notices' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
                                        <Megaphone className="w-7 h-7 mr-3 text-indigo-500" /> Professional Bulletin
                                    </h3>
                                    {(userRole === 'Super Admin' || userRole === 'Administrator') && (
                                        <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center hover:scale-[1.02] transition-transform shadow-lg shadow-slate-200">
                                            <Plus className="w-4 h-4 mr-2" /> Post Announcement
                                        </button>
                                    )}
                                </div>
                                <div className="grid gap-6">
                                    {notices.map(notice => (
                                        <div key={notice.id} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-indigo-100">
                                                    {notice.category}
                                                </span>
                                                <span className="text-slate-400 text-xs font-bold flex items-center">
                                                    <Calendar className="w-3.5 h-3.5 mr-2" /> {new Date(notice.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{notice.title}</h4>
                                            <p className="text-slate-500 font-medium leading-relaxed text-lg">{notice.content}</p>
                                        </div>
                                    ))}
                                    {notices.length === 0 && (
                                        <div className="p-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                                            <Megaphone className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold">No announcements for your community cycle yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'forum' && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
                                        <Users className="w-7 h-7 mr-3 text-indigo-500" /> {userRole} Community Forum
                                    </h3>
                                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase flex items-center hover:scale-[1.02] transition-transform shadow-lg shadow-indigo-100">
                                        <Send className="w-4 h-4 mr-2" /> Discourse with Peers
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {posts.map(post => (
                                        <div key={post.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                                                        <Hash className="w-4 h-4 text-indigo-500" />
                                                    </div>
                                                    <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{post.topic}</span>
                                                </div>
                                                <h4 className="text-xl font-black text-slate-900 leading-tight">"{post.title}"</h4>
                                                <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed">{post.content}</p>
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-700">Anonymous {userRole}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">{new Date(post.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-full text-slate-400">
                                                    <MessageSquare className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-black">{post.comments?.length || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {posts.length === 0 && (
                                        <div className="col-span-full p-20 text-center bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
                                            <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-bold italic">The {userRole.toLowerCase()} lounge is quiet. Lead the discourse.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'messages' && (
                            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden flex flex-col h-[650px] animate-in slide-in-from-right-4">
                                <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row gap-4 justify-between md:items-center">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                                            <User className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Direct Support</h3>
                                            <div className="flex items-center text-xs font-bold text-indigo-500 uppercase tracking-tight">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                                                Matched with {isStudent ? 'Academic Advisor' : 'Department Head'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleGenerateMeeting}
                                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all shadow-sm active:scale-95"
                                    >
                                        <Video className="w-4 h-4 text-emerald-500" />
                                        <span>Start Zoom Meeting</span>
                                    </button>
                                </div>

                                {meetingLink && (
                                    <div className="mx-8 mt-6 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex justify-between items-center animate-in fade-in slide-in-from-top-4">
                                        <div className="flex items-center">
                                            <div className="p-3 bg-white rounded-2xl mr-4 shadow-sm">
                                                <Video className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-1">Live Professional Meeting</p>
                                                <a href={meetingLink.link} target="_blank" rel="noreferrer" className="text-lg font-black text-emerald-600 hover:underline">Click to Join Session →</a>
                                            </div>
                                        </div>
                                        <button onClick={() => setMeetingLink(null)} className="p-2 text-emerald-400 hover:text-emerald-100 hover:bg-emerald-600 rounded-xl transition-all">
                                            <XIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                                    {messages.map((m: any) => (
                                        <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] p-6 rounded-[32px] font-bold shadow-sm relative leading-relaxed ${m.sender_id === user?.id
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100'
                                                }`}>
                                                {m.is_encrypted && (
                                                    <div className="flex items-center space-x-1.5 mb-3 text-[10px] font-black uppercase tracking-widest opacity-60">
                                                        <Lock className="w-3.5 h-3.5" />
                                                        <span>E2EE Professional Grade</span>
                                                    </div>
                                                )}
                                                {m.content}
                                                <div className={`text-[10px] mt-4 font-black uppercase tracking-widest opacity-40 ${m.sender_id === user?.id ? 'text-right' : 'text-left'}`}>
                                                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-full text-slate-200">
                                            <MessageSquare className="w-20 h-20 opacity-10 mb-6" />
                                            <p className="font-black text-slate-300 italic">Initiate encrypted discourse...</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8 border-t border-slate-50 bg-white">
                                    <div className="flex space-x-4 items-center mb-6">
                                        <button
                                            onClick={() => setIsEncrypted(!isEncrypted)}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${isEncrypted ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'
                                                }`}
                                        >
                                            <Lock className={`w-3.5 h-3.5 ${isEncrypted ? 'text-indigo-600' : 'text-slate-300'}`} />
                                            <span>Encryption: {isEncrypted ? 'Secured' : 'Safety Off'}</span>
                                        </button>
                                    </div>
                                    <div className="flex space-x-4 items-center bg-slate-50 p-2.5 rounded-[28px] border border-slate-100 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Type message..."
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 font-bold placeholder:text-slate-300 px-6 text-lg"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="bg-indigo-600 text-white p-4 rounded-[20px] hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                                        >
                                            <Send className="w-6 h-6" />
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

// Helper for X icon since Lucide sometimes uses different names or to avoid missing import
const XIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
