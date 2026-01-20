import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Target, TrendingUp, ShipWheel, ChevronRight } from 'lucide-react';

interface Campaign {
    id: number;
    name: string;
    platform: string;
    budget: number;
    status: string;
}

interface Lead {
    id: number;
    full_name: string;
    email: string;
    status: string;
}

interface FunnelStats {
    [key: string]: number;
}

export const MarketingPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [funnel, setFunnel] = useState<FunnelStats>({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'campaigns' | 'leads' | 'funnel'>('funnel');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [cRes, lRes, fRes] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/marketing/campaigns'),
                axios.get('http://localhost:8000/api/v1/marketing/leads'),
                axios.get('http://localhost:8000/api/v1/finance/recruitment-funnel')
            ]);
            setCampaigns(cRes.data);
            setLeads(lRes.data);
            setFunnel(fRes.data);
        } catch (error) {
            console.error('Error fetching marketing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const stages = ["new", "contacted", "interested", "applicant", "admitted", "enrolled"];

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Marketing Center</h1>
                        <p className="text-slate-500 font-medium">Capture leads and visualize the recruitment funnel.</p>
                    </div>
                    <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        {['funnel', 'campaigns', 'leads'].map(t => (
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

                {activeTab === 'funnel' && (
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-200 relative overflow-hidden">
                            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center">
                                <ShipWheel className="w-6 h-6 mr-3 text-indigo-600" />
                                Recruitment Pipeline Velocity
                            </h3>
                            <div className="flex items-center justify-between space-x-4 overflow-x-auto pb-4">
                                {stages.map((stage, idx) => (
                                    <React.Fragment key={stage}>
                                        <div className="flex-1 min-w-[120px] bg-slate-50 p-6 rounded-[32px] border border-slate-100 relative group hover:bg-indigo-50 transition">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stage}</p>
                                            <p className="text-2xl font-black text-slate-900">{funnel[stage] || 0}</p>
                                            <div className="h-1 bg-slate-200 mt-4 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${Math.min(100, (funnel[stage] || 0) * 10)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        {idx < stages.length - 1 && (
                                            <ChevronRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-100">
                                <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                                <h4 className="text-2xl font-black mb-1">Conversion Potential</h4>
                                <p className="text-emerald-100 font-medium mb-6">You have {funnel['applicant'] || 0} applicants ready for admission vetting.</p>
                                <button className="bg-white text-emerald-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-emerald-50 transition">
                                    Start Batch Review
                                </button>
                            </div>
                            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl">
                                <Target className="w-8 h-8 mb-4 opacity-50 text-indigo-400" />
                                <h4 className="text-2xl font-black mb-1">Campaign ROI</h4>
                                <p className="text-slate-400 font-medium mb-6">{campaigns.length} campaigns are active across 4 platforms.</p>
                                <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-700 transition">
                                    View Performance Map
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {loading && activeTab !== 'funnel' ? (
                    <div className="flex justify-center p-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : activeTab !== 'funnel' && (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">
                                        {activeTab === 'campaigns' ? 'Campaign Name' : 'Lead Details'}
                                    </th>
                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status / Stage</th>
                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {activeTab === 'campaigns' ? campaigns.map(c => (
                                    <tr key={c.id} className="hover:bg-slate-50/30 transition">
                                        <td className="px-10 py-6 font-bold text-slate-800">{c.name}</td>
                                        <td className="px-10 py-6">
                                            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-black uppercase">{c.status}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right"><button className="text-indigo-600 font-bold">Edit</button></td>
                                    </tr>
                                )) : leads.map(l => (
                                    <tr key={l.id} className="hover:bg-slate-50/30 transition">
                                        <td className="px-10 py-6">
                                            <p className="font-bold text-slate-800">{l.full_name}</p>
                                            <p className="text-xs text-slate-500">{l.email}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase">{l.status}</span>
                                        </td>
                                        <td className="px-10 py-6 text-right"><button className="text-indigo-600 font-bold">Promote Stage</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
