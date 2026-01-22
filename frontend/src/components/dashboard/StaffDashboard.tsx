import React from 'react';
import { Users, Package, FileText, CheckCircle2, AlertCircle, ArrowUpRight, Wallet } from 'lucide-react';

interface StaffDashboardProps {
    stats: {
        total_employees: number;
        balance: number;
    };
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ stats }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Operational Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:border-indigo-100 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Treasury Balance</p>
                    <p className="text-3xl font-black text-slate-900">${stats.balance.toLocaleString()}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:border-blue-100 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Users className="w-6 h-6" />
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Handled Personnel</p>
                    <p className="text-3xl font-black text-slate-900">{stats.total_employees}</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 group hover:border-amber-100 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                            <Package className="w-6 h-6" />
                        </div>
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Asset Requests</p>
                    <p className="text-3xl font-black text-slate-900">8 Pending</p>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter mb-1">Operational Health</p>
                        <p className="text-2xl font-black">EXCELLENT</p>
                    </div>
                    <div className="mt-4 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[94%]"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Admin Tasks & Requisitions */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-black text-slate-800 flex items-center uppercase tracking-tighter">
                            <FileText className="w-5 h-5 mr-3 text-indigo-500" />
                            Pending Requisitions
                        </h2>
                        <button className="px-4 py-2 bg-slate-50 text-slate-500 text-xs font-black rounded-xl hover:bg-slate-100 transition-colors">View Archive</button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { id: '#REQ-402', title: 'Office Supplies Restock', amt: '$420', status: 'Verifying', color: 'amber' },
                            { id: '#REQ-398', title: 'New Faculty Workstation', amt: '$1,290', status: 'Pending Approval', color: 'indigo' },
                            { id: '#REQ-395', title: 'Library Book Import', amt: '$3,800', status: 'High Priority', color: 'rose' },
                            { id: '#REQ-390', title: 'Janitorial Services Pmt', amt: '$900', status: 'Scheduled', color: 'emerald' }
                        ].map((req, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 bg-${req.color}-100 text-${req.color}-600 rounded-2xl flex items-center justify-center font-black text-xs`}>
                                        {req.id.split('-')[1]}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800">{req.title}</h4>
                                        <p className="text-xs font-bold text-slate-400">{req.id} • Amount: <span className="text-slate-900">{req.amt}</span></p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 bg-${req.color}-50 text-${req.color}-600 text-[10px] font-black rounded-full uppercase tracking-widest`}>
                                    {req.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Staff Quick Hub */}
                <div className="space-y-8">
                    <div className="bg-indigo-600 text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden">
                        <h3 className="text-lg font-black mb-6 tracking-tighter flex items-center">
                            <CheckCircle2 className="w-5 h-5 mr-3 text-indigo-200" />
                            HR Quick Tasks
                        </h3>
                        <div className="space-y-4">
                            {[
                                'Approve Leave: Dr. Wilson',
                                'Review 2 New Hires',
                                'Update Salary Structures',
                                'Faculty Meeting Minutes'
                            ].map((task, i) => (
                                <div key={i} className="flex items-center space-x-3 text-sm font-bold opacity-80 hover:opacity-100 cursor-pointer transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                    <span>{task}</span>
                                </div>
                            ))}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
                        <h3 className="text-xs font-black text-slate-800 uppercase mb-6 tracking-widest">Recent Activity</h3>
                        <div className="flex flex-col space-y-6">
                            {[
                                { user: 'Admin', act: 'Updated budget', time: '2h ago' },
                                { user: 'System', act: 'Auto-sync assets', time: '5h ago' }
                            ].map((act, i) => (
                                <div key={i} className="flex space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                        {act.user.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-700">{act.act}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">{act.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
