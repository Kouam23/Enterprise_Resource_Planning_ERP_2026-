import React from 'react';
import { Briefcase, PieChart, CheckSquare, Calendar, ShieldCheck } from 'lucide-react';

export const StaffProfile: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                            <Briefcase className="w-5 h-5 mr-3 text-emerald-500" /> Operational KPIs
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Tasks Resolved', count: 124, target: 150 },
                                { name: 'Inventory Accuracy', count: 98, target: 100 }
                            ].map((kpi, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                                        <span>{kpi.name}</span>
                                        <span>{kpi.count}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(kpi.count / kpi.target) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                            <PieChart className="w-5 h-5 mr-3 text-indigo-500" /> Resource Management
                        </h3>
                        <div className="flex items-end justify-between h-24 mb-4">
                            {[70, 40, 85, 55, 90, 65].map((h, i) => (
                                <div key={i} className="w-6 bg-indigo-50 rounded-t-lg relative group">
                                    <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 text-center font-medium">Monthly Procurement Activity</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <CheckSquare className="w-5 h-5 mr-3 text-emerald-500" /> Operational Feed
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Asset Requisition', detail: 'ID #8829 - Approved', time: '3 hours ago', icon: '📦', color: 'bg-emerald-50' },
                            { title: 'HR Audit Complete', detail: 'Departmental Compliance - Verified', time: 'Yesterday', icon: '📋', color: 'bg-blue-50' },
                            { title: 'New Stock Alert', detail: 'Office Supplies - Restocked', time: '2 days ago', icon: '🏢', color: 'bg-slate-50' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center text-lg`}>
                                    {item.icon}
                                </div>
                                <div className="flex-1 border-b border-slate-50 pb-4">
                                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                                    <p className="text-sm text-slate-500 font-medium">{item.detail}</p>
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 block">{item.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> Operational Deadlines
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Stock Audit', date: 'Jan 27', urgent: true },
                            { name: 'Finance Review', date: 'Feb 02', urgent: false },
                            { name: 'Safety Training', date: 'Feb 10', urgent: false }
                        ].map((d, i) => (
                            <div key={i} className={`p-4 rounded-2xl border ${d.urgent ? 'border-red-100 bg-red-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-slate-700">{d.name}</span>
                                    <span className={`text-xs font-black uppercase ${d.urgent ? 'text-red-500' : 'text-slate-500'}`}>{d.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-8 text-white">
                    <h3 className="text-lg font-bold mb-6 flex items-center">
                        <ShieldCheck className="w-5 h-5 mr-3 text-emerald-400" /> Skill Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group hover:border-emerald-500 transition-colors">
                                <span className="text-2xl group-hover:scale-125 transition-transform">🏅</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-400 font-bold mt-6 cursor-pointer hover:text-white transition-colors uppercase">View Certifications</p>
                </div>
            </div>
        </div>
    );
};
