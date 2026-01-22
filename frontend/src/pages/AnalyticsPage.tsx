import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useTranslation } from 'react-i18next';
import {
    AlertTriangle, ShieldCheck, TrendingDown,
    ArrowUpRight, Target, BrainCircuit, Activity
} from 'lucide-react';

interface Prediction {
    student_id: number;
    full_name: string;
    risk_score: number;
    status: string;
    gpa: number;
    recommendations: string[];
}

export const AnalyticsPage: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const canAccessAnalytics = ['Super Admin', 'Administrator'].includes(userRole);

    const [atRisk, setAtRisk] = useState<Prediction[]>([]);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && canAccessAnalytics) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user, canAccessAnalytics]);

    const fetchData = async () => {
        try {
            const [riskRes, recRes] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/analytics/at-risk-students'),
                axios.get('http://localhost:8000/api/v1/analytics/course-recommendations/1')
            ]);
            setAtRisk(riskRes.data);
            setRecommendations(recRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!canAccessAnalytics) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                        <BrainCircuit className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Advanced Intelligence Restricted</h1>
                    <p className="text-slate-500 max-w-md font-medium">
                        Predictive analytics and student risk profiling are restricted to senior administration for privacy and intervention planning.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center space-x-2 text-indigo-600 mb-1">
                            <BrainCircuit className="w-5 h-5 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest">AI Insights Engine</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('analytics.title')}</h1>
                        <p className="text-slate-500 font-medium">Early intervention system identifying students needing academic support.</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center">
                        <Activity className="w-5 h-5 text-emerald-500 mr-3" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase">System Status</p>
                            <p className="text-sm font-black text-slate-900">Predictive Model: Active</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Course Recommendations Section */}
                        <section>
                            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                                <Target className="w-6 h-6 mr-2 text-indigo-500" /> Personalized Course Recommendations
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {recommendations.map((rec, i) => (
                                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm hover:border-indigo-300 transition-all border-l-4 border-l-indigo-500">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Growth Path</span>
                                        </div>
                                        <p className="text-slate-900 font-black text-lg leading-tight">{rec}</p>
                                        <p className="text-slate-500 text-xs mt-3 font-medium">Based on current program requirements and performance trends.</p>
                                    </div>
                                ))}
                                {recommendations.length === 0 && (
                                    <p className="col-span-full text-slate-400 italic font-bold text-center py-8">Generate recommendations by selecting a student profile.</p>
                                )}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Summary Column */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                                    <TrendingDown className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
                                    <h3 className="text-lg font-bold mb-6 opacity-80">{t('analytics.atRisk')}</h3>
                                    <div className="text-6xl font-black mb-2">{atRisk.length}</div>
                                    <p className="text-sm font-medium opacity-80">Students identified as 'Moderate' or 'Critical' risk this term.</p>
                                </div>

                                <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
                                    <h4 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wider flex items-center">
                                        <Target className="w-5 h-5 mr-2 text-indigo-500" /> Model Confidence
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-slate-500">GPA Factor</span>
                                            <span className="text-xs font-black text-slate-900">High Impact</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-500 h-full w-[85%]" />
                                        </div>

                                        <div className="flex justify-between items-end">
                                            <span className="text-xs font-bold text-slate-500">Attendance Factor</span>
                                            <span className="text-xs font-black text-slate-900">Medium Impact</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-indigo-400 h-full w-[60%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* List Column */}
                            <div className="lg:col-span-2 space-y-4">
                                {atRisk.map((p: Prediction) => (
                                    <div key={p.student_id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:shadow-lg transition-all duration-300 group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${p.risk_score > 70 ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
                                                    }`}>
                                                    <AlertTriangle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{p.full_name}</h4>
                                                    <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                        <span>ID: #{p.student_id}</span>
                                                        <span>•</span>
                                                        <span>GPA: {p.gpa.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-slate-900 leading-none mb-1">{p.risk_score}%</div>
                                                <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${p.risk_score > 70 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {p.status}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                            <div className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">
                                                <BrainCircuit className="w-4 h-4 mr-2" /> {t('analytics.recommendations')}
                                            </div>
                                            <ul className="space-y-2">
                                                {p.recommendations.map((rec: string, i: number) => (
                                                    <li key={i} className="flex items-start text-sm text-slate-600 font-medium">
                                                        <ArrowUpRight className="w-4 h-4 mr-2 text-slate-300 flex-shrink-0 mt-0.5" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                                {atRisk.length === 0 && (
                                    <div className="text-center py-20 bg-emerald-50 rounded-[40px] border border-emerald-100">
                                        <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-black text-slate-900">System Healthy</h3>
                                        <p className="text-slate-500 font-medium max-w-xs mx-auto">No students currently meet the at-risk threshold. Academic performance is within normal parameters.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
