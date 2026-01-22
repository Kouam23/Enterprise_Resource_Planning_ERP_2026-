import React from 'react';
import { Users, BookOpen, UserCheck, DollarSign, TrendingUp, BarChart3, Bell, Clock } from 'lucide-react';

interface AdminDashboardProps {
    stats: {
        total_students: number;
        total_courses: number;
        total_employees: number;
        balance: number;
    };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: stats.total_students, icon: Users, color: 'emerald', trend: '+12% this month' },
                    { label: 'Active Courses', value: stats.total_courses, icon: BookOpen, color: 'indigo', trend: '+4 new' },
                    { label: 'Total Staff', value: stats.total_employees, icon: UserCheck, color: 'blue', trend: 'Stable' },
                    { label: 'Net Revenue', value: `$${stats.balance.toLocaleString()}`, icon: DollarSign, color: 'amber', trend: '+8.5%' },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 bg-${item.color}-50 rounded-2xl text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{item.trend}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{item.label}</h3>
                        <p className="text-3xl font-black text-slate-900 mt-1">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Institutional Growth Chart Placeholder */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Institutional Growth</h2>
                            <p className="text-sm font-medium text-slate-400">Enrollment vs Revenue trends</p>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors">Weekly</button>
                            <button className="px-4 py-2 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl active">Monthly</button>
                        </div>
                    </div>
                    <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-400 italic">Predictive Analytics Engine Loading...</p>
                        </div>
                    </div>
                </div>

                {/* System Health / Recent Admin Actions */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
                    <h3 className="text-lg font-black mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-3 text-indigo-400" />
                        System Health
                    </h3>
                    <div className="space-y-6">
                        {[
                            { label: 'Server Load', value: '24%', color: 'bg-emerald-500' },
                            { label: 'Database Sync', value: '100%', color: 'bg-indigo-500' },
                            { label: 'API Latency', value: '45ms', color: 'bg-amber-500' }
                        ].map((health, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest opacity-60">
                                    <span>{health.label}</span>
                                    <span>{health.value}</span>
                                </div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className={`h-full ${health.color} rounded-full`} style={{ width: health.label === 'API Latency' ? '80%' : health.value }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="text-xs font-black uppercase text-indigo-400 mb-4 tracking-tighter">Critical Logs</h4>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Bell className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <p className="text-xs font-medium text-slate-300">Backup completed successfully at 03:00 AM</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                <p className="text-xs font-medium text-slate-300">Version 2.4.0 deployed to production</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
