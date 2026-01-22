import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { User, Mail, Shield, Camera, Edit2, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

// Role-based components
import { StudentProfile } from '../components/profile/StudentProfile';
import { InstructorProfile } from '../components/profile/InstructorProfile';
import { StaffProfile } from '../components/profile/StaffProfile';
import { AdminProfile } from '../components/profile/AdminProfile';

export const ProfilePage: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const userRole = (user as any)?.role?.name || 'Student';

    const [formData, setFormData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        password: '',
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            await api.put('/auth/me', formData);
            await refreshUser();
            setIsEditing(false);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setIsLoading(true);
        try {
            const response = await api.post('/media/upload/profile-pic', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const profilePictureUrl = response.data.url;

            await api.put('/auth/me', { profile_picture_url: profilePictureUrl });
            await refreshUser();
            setMessage({ type: 'success', text: 'Profile picture updated!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload profile picture.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderRoleProfile = () => {
        switch (userRole) {
            case 'Super Admin':
            case 'Administrator':
                return <AdminProfile />;
            case 'Instructor':
                return <InstructorProfile />;
            case 'Staff':
                return <StaffProfile />;
            default:
                return <StudentProfile />;
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-[40px] p-10 mb-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] -ml-24 -mb-24"></div>

                    <div className="relative flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[40px] bg-white/5 backdrop-blur-xl border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                                {user?.profile_picture_url ? (
                                    <img
                                        src={user.profile_picture_url.startsWith('http') ? user.profile_picture_url : `http://localhost:8000${user.profile_picture_url}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-20 h-20 text-white/20" />
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-2xl shadow-xl hover:bg-white hover:text-indigo-600 hover:scale-110 transition-all duration-300 cursor-pointer border-4 border-slate-900"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-5xl font-black tracking-tighter mb-2">{user?.full_name}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className="px-4 py-1.5 bg-indigo-500/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-[0.2em] border border-white/10 text-indigo-200">
                                    {userRole}
                                </span>
                                <span className="px-4 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-[0.2em] border border-white/10 text-emerald-200 flex items-center">
                                    <Shield className="w-3.5 h-3.5 mr-2" /> Verified Profile
                                </span>
                            </div>
                            <p className="text-white/40 font-bold flex items-center justify-center md:justify-start mt-6 text-sm">
                                <Mail className="w-4 h-4 mr-2" /> {user?.email}
                            </p>
                        </div>

                        <div className="md:ml-auto">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`px-8 py-4 rounded-2xl font-black text-sm transition-all duration-300 flex items-center shadow-2xl active:scale-95 ${isEditing
                                        ? 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
                                    }`}
                            >
                                <Edit2 className="w-4 h-4 mr-3" /> {isEditing ? 'Cancel Edit' : 'Edit Professional Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                {message && (
                    <div className={`mb-12 p-6 rounded-3xl flex items-center space-x-4 animate-in slide-in-from-top-4 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-lg shadow-emerald-100/20'
                            : 'bg-red-50 text-red-700 border border-red-100 shadow-lg shadow-red-100/20'
                        }`}>
                        <div className={`p-2 rounded-xl ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <span className="font-black text-sm uppercase tracking-wide">{message.text}</span>
                    </div>
                )}

                <div className="animate-in slide-in-from-bottom-8 duration-700">
                    {isEditing ? (
                        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-12 max-w-3xl mx-auto relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
                            <div className="relative">
                                <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter flex items-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mr-4">
                                        <User className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    Identity Settings
                                </h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                                            <input
                                                type="text"
                                                value={formData.full_name}
                                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Update Security Key (Password)</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                                            placeholder="••••••••••••"
                                        />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight ml-1">Leave blank to maintain current credentials</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all active:scale-[0.98] disabled:opacity-50 text-lg tracking-tight"
                                    >
                                        {isLoading ? 'Verifying & Saving...' : 'Confirm Profile Update'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        renderRoleProfile()
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
