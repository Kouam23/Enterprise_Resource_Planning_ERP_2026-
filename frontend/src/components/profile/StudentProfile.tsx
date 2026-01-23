import React from 'react';
import { Book, BarChart, Activity, Calendar, Shield, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfile: React.FC = () => {
    const { user } = useAuth();

    // Fallback data for demonstration if not provided by backend yet
    const student = user as any;
    const creditsEarned = student?.total_credits_earned || 142;
    const cgpa = student?.cumulative_gpa || 3.72;
    const matricule = student?.matricule || 'ICTU2023001';

    const progressTowardDegree = (creditsEarned / 180) * 100;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Academic Status</h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Matricule: {matricule}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center text-indigo-600 font-black text-2xl">
                            <Award className="w-6 h-6 mr-2" /> {cgpa.toFixed(2)}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cumulative GPA</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                            <Book className="w-5 h-5 mr-3 text-indigo-500" /> Bachelor's Progress
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                                    <span>Degree Completion (BMD)</span>
                                    <span>{creditsEarned} / 180 Credits</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progressTowardDegree}%` }}></div>
                                </div>
                            </div>
                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Graduation Forecast</p>
                                <p className="text-sm font-bold text-slate-700">On track for Graduation in Spring 2027</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                            <BarChart className="w-5 h-5 mr-3 text-indigo-500" /> Semester Performance
                        </h3>
                        <div className="flex items-end justify-between h-24 mb-4">
                            {[4.0, 3.8, 3.5, 3.9, 3.7, 3.2].map((gpa, i) => (
                                <div key={i} className="w-6 bg-slate-50 rounded-t-lg relative group h-full">
                                    <div className="absolute bottom-0 w-full bg-indigo-400 rounded-t-lg transition-all duration-500" style={{ height: `${(gpa / 4.0) * 100}%` }}></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                        {gpa.toFixed(1)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 text-center font-bold uppercase tracking-widest">GPA Trend per Semester</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <Activity className="w-5 h-5 mr-3 text-indigo-500" /> Academic Activity
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Assignment Submitted', detail: 'Advanced Mathematics UI/UX', time: '2 hours ago', icon: '📝', color: 'bg-blue-50' },
                            { title: 'Joined Discussion', detail: 'Group A - Project Research', time: 'Yesterday', icon: '💬', color: 'bg-indigo-50' },
                            { title: 'Grade Received', detail: 'Intro to Algorithms - 85% (A)', time: '2 days ago', icon: '⭐', color: 'bg-yellow-50' }
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
                        <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> Registration & Exams
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50">
                            <div className="flex justify-between items-center">
                                <span className="font-black text-emerald-700 text-xs uppercase tracking-widest">Resit Period</span>
                                <span className="text-xs font-black text-emerald-500">FEB 15 - 20</span>
                            </div>
                        </div>
                        {[
                            { name: 'Physics Quiz', date: 'Jan 25', urgent: true },
                            { name: 'History Essay', date: 'Jan 28', urgent: false },
                            { name: 'Lab Report', date: 'Feb 02', urgent: false }
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

                <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center">
                        <Shield className="w-5 h-5 mr-3 text-indigo-400" /> Academic Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-square bg-slate-800/50 rounded-2xl flex items-center justify-center border border-slate-700 group hover:border-indigo-500 transition-colors">
                                <span className="text-2xl group-hover:scale-125 transition-transform">🏆</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-xs font-black uppercase tracking-widest">Request Official Transcript</button>
                </div>
            </div>
        </div>
    );
};
