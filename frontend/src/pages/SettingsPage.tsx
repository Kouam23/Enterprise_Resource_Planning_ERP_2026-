import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
    Settings as SettingsIcon, Globe, Calendar,
    Link as LinkIcon, RefreshCw,
    CheckCircle2, AlertCircle,
    Mail, MessageSquare, Lock
} from 'lucide-react';
import axios from 'axios';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const isConfigAdmin = ['Super Admin', 'Administrator'].includes(userRole);

    const [integrations, setIntegrations] = useState({
        google: false,
        microsoft: false,
        zoom: true
    });
    const [syncing, setSyncing] = useState<string | null>(null);

    const handleSync = async (provider: string) => {
        if (!isConfigAdmin) return;
        setSyncing(provider);
        try {
            await axios.post(`http://localhost:8000/api/v1/analytics/sync-calendar?provider=${provider}`);
            setIntegrations(prev => ({ ...prev, [provider]: true }));
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setTimeout(() => setSyncing(null), 1000);
        }
    };

    if (!isConfigAdmin) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Configuration Restricted</h1>
                    <p className="text-slate-500 max-w-md font-medium">
                        System-wide configuration and third-party integrations can only be managed by system administrators.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 max-w-5xl mx-auto">
                <div className="mb-12">
                    <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                        <SettingsIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Global Configuration</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-slate-500 font-medium">Manage third-party integrations, enterprise connectivity, and system preferences.</p>
                </div>

                <div className="grid gap-8">
                    {/* Integration Section */}
                    <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-800">Third-Party Integrations</h3>
                                <p className="text-sm font-medium text-slate-500">Connect your ERP to external productivity suites.</p>
                            </div>
                            <Globe className="w-8 h-8 text-slate-200" />
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Google Workspace */}
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900">Google Workspace</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">SSO & Calendar Sync</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSync('google')}
                                    disabled={syncing === 'google'}
                                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center space-x-2 ${integrations.google
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        : 'bg-slate-900 text-white hover:bg-indigo-600'
                                        }`}
                                >
                                    {syncing === 'google' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                                        integrations.google ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                                    <span>{integrations.google ? 'Connected' : 'Connect'}</span>
                                </button>
                            </div>

                            {/* Microsoft 365 */}
                            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900">Microsoft 365</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Outlook & Azure AD</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSync('microsoft')}
                                    disabled={syncing === 'microsoft'}
                                    className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center space-x-2 ${integrations.microsoft
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                        : 'bg-slate-900 text-white hover:bg-indigo-600'
                                        }`}
                                >
                                    {syncing === 'microsoft' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
                                        integrations.microsoft ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                                    <span>{integrations.microsoft ? 'Connected' : 'Connect'}</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Preferences */}
                    <section className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">System Preferences</h3>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 border border-slate-100 rounded-3xl">
                                <div className="flex items-center space-x-3 mb-4">
                                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                                    <span className="font-black text-slate-900">Communication</span>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={true} readOnly />
                                        <div className="block bg-indigo-600 w-10 h-6 rounded-full"></div>
                                        <div className="dot absolute left-5 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                                    </div>
                                    <div className="ml-3 text-slate-600 font-bold text-sm">Real-time Notifications</div>
                                </label>
                            </div>
                            <div className="p-6 border border-emerald-100 bg-emerald-50/30 rounded-3xl">
                                <div className="flex items-center space-x-3 mb-4">
                                    <AlertCircle className="w-5 h-5 text-emerald-500" />
                                    <span className="font-black text-slate-900">Security Audit</span>
                                </div>
                                <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                                    Detailed activity logging is globally enforced for compliance. Visit the <a href="/security" className="underline font-black">Security Audit Hub</a> to view logs.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};
