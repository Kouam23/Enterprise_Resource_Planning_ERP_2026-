import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
    Shield, Lock, Eye, Clock,
    User, Database, AlertCircle
} from 'lucide-react';

interface AuditLog {
    id: number;
    user_id: number;
    action: string;
    target_table: string;
    target_id: number;
    changes: any;
    timestamp: string;
    ip_address: string;
}

export const SecurityDashboard: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/audit/logs');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center space-x-2 text-rose-600 mb-1">
                            <Shield className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">Security & Compliance</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Hub</h1>
                        <p className="text-slate-500 font-medium">Real-time monitoring of sensitive administrative actions and data mutations.</p>
                    </div>
                    <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 flex items-center">
                        <Lock className="w-4 h-4 text-rose-500 mr-2" />
                        <span className="text-xs font-black text-rose-600 uppercase">Tamper-Proof Logging Active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operator</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payload</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-xs font-bold text-slate-500">
                                                    <Clock className="w-3.5 h-3.5 mr-2 opacity-30" />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                                        <User className="w-3 h-3 text-slate-400" />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-900">User #{log.user_id || 'System'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase ${log.action === 'DELETE' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm font-bold text-slate-600">
                                                    <Database className="w-4 h-4 mr-2 text-slate-300" />
                                                    {log.target_table} <span className="mx-1 opacity-30">ID:</span> {log.target_id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => alert(JSON.stringify(log.changes, null, 2))}
                                                    className="flex items-center text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase"
                                                >
                                                    <Eye className="w-4 h-4 mr-1.5" /> View Changes
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                <p className="text-slate-400 font-black italic">No audit events recorded for this period.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
