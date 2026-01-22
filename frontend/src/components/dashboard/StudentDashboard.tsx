import React from 'react';
import { Book, Target, PlayCircle, Clock, Zap, Flame, Trophy } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
    return (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
            {/* Learning Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h2 className="text-3xl font-black mb-2 tracking-tighter">Keep it up, Champ! 🚀</h2>
                            <p className="text-indigo-100 font-medium">You are in the top 5% of your class this week.</p>
                        </div>
                        <div className="mt-12 flex items-center space-x-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Overall GPA</span>
                                <span className="text-4xl font-black italic">3.85</span>
                            </div>
                            <div className="flex flex-col border-l border-white/20 pl-8">
                                <span className="text-[10px] font-black uppercase text-indigo-200 tracking-widest mb-1">Learning Streak</span>
                                <div className="flex items-center text-4xl font-black">
                                    <Flame className="w-8 h-8 text-orange-400 mr-2 fill-orange-400" />
                                    14 Days
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <button className="px-6 py-3 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-100 transition-transform active:scale-95 shadow-xl flex items-center">
                                <PlayCircle className="w-5 h-5 mr-2" />
                                Continue: Modern UI Design
                            </button>
                        </div>
                    </div>
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-1000"></div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Achievement Progress</h3>
                        <Trophy className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 space-y-8">
                        {[
                            { label: 'Calculus Wizard', progress: 85, icon: Zap, color: 'indigo' },
                            { label: 'Library Guru', progress: 40, icon: Book, color: 'emerald' },
                            { label: 'Creative Spark', progress: 62, icon: Target, color: 'rose' }
                        ].map((ach, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 bg-${ach.color}-50 text-${ach.color}-500 rounded-lg`}>
                                            <ach.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-black text-slate-700">{ach.label}</span>
                                    </div>
                                    <span className="text-xs font-black text-slate-400">{ach.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full bg-${ach.color}-500 rounded-full`} style={{ width: `${ach.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Daily Roadmap & Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    <h2 className="text-xl font-black text-slate-800 flex items-center uppercase tracking-tighter">
                        <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                        Today's Learning Roadmap
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { time: '09:00 AM', title: 'Data Structures Lab', room: 'Lab 04', type: 'Laboratory' },
                            { time: '11:30 AM', title: 'Corporate Finance', room: 'Hall B', type: 'Lecture' },
                            { time: '02:00 PM', title: 'Soft Skills Workshop', room: 'Digital Studio', type: 'Workshop' },
                            { time: '04:30 PM', title: 'Group Study Session', room: 'Library Pod 4', type: 'Social' }
                        ].map((slot, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-lg transition-all cursor-pointer group hover:border-indigo-100">
                                <div className="flex items-center space-x-4">
                                    <div className="shrink-0 w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-50 group-hover:bg-indigo-50 transition-colors">
                                        <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1 group-hover:text-indigo-400">At</span>
                                        <span className="text-xs font-black text-slate-800 leading-none group-hover:text-indigo-600">{slot.time.split(' ')[0]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-slate-800 text-lg leading-tight mb-1">{slot.title}</h4>
                                        <div className="flex items-center text-xs font-bold text-slate-400">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 mr-2 uppercase tracking-widest text-[8px]">{slot.type}</span>
                                            <span>📍 {slot.room}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-black text-slate-800 flex items-center uppercase tracking-tighter">
                        <Zap className="w-5 h-5 mr-3 text-rose-500 fill-rose-500" />
                        Urgent Tasks
                    </h2>
                    <div className="space-y-4">
                        {[
                            { task: 'Physics Assignment', dead: 'IN 2 HOURS', color: 'rose' },
                            { task: 'Register for Seminar', dead: 'BY MIDNIGHT', color: 'indigo' },
                            { task: 'Math Quiz Review', dead: 'IN 1 DAY', color: 'amber' }
                        ].map((task, i) => (
                            <div key={i} className={`p-5 bg-${task.color}-50 border border-${task.color}-100 rounded-3xl`}>
                                <p className="text-sm font-black text-slate-800">{task.task}</p>
                                <p className={`text-[10px] font-black text-${task.color}-600 mt-1 uppercase tracking-widest`}>Due {task.dead}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 bg-slate-900 rounded-[32px] text-white">
                        <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest">Global Ranking</h4>
                        <div className="text-2xl font-black italic">#42 / 1,200</div>
                        <p className="text-xs mt-2 text-slate-400 font-medium">Keep pushing to reach the Top 10!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
