import React from 'react';
import { BookOpen, Star, Calendar, Award, Zap } from 'lucide-react';

export const InstructorProfile: React.FC = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                            <BookOpen className="w-5 h-5 mr-3 text-purple-500" /> Teaching Load
                        </h3>
                        <div className="space-y-6">
                            {[
                                { name: 'Advanced AI', students: 45, progress: 85 },
                                { name: 'Data Ethics', students: 32, progress: 60 }
                            ].map((course, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm font-bold text-slate-600 mb-2">
                                        <span>{course.name}</span>
                                        <span>{course.students} Students</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                            <Star className="w-5 h-5 mr-3 text-amber-500" /> Student Engagement
                        </h3>
                        <div className="flex items-end justify-between h-24 mb-4">
                            {[60, 85, 75, 95, 80, 70].map((h, i) => (
                                <div key={i} className="w-6 bg-amber-50 rounded-t-lg relative group">
                                    <div className="absolute bottom-0 w-full bg-amber-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-slate-500 text-center font-medium">Weekly Forum Interaction Rate</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <Zap className="w-5 h-5 mr-3 text-indigo-500" /> Faculty Milestones
                    </h3>
                    <div className="space-y-6">
                        {[
                            { title: 'Curriculum Approved', detail: 'New Module: Ethical AI in ERP', time: '1 week ago', icon: '📜', color: 'bg-indigo-50' },
                            { title: 'Research Grant', detail: 'Distinction in Distributed Learning', time: '2 weeks ago', icon: '🔬', color: 'bg-emerald-50' },
                            { title: 'Workshop Led', detail: 'Spring Pedagogy Summit 2026', time: '1 month ago', icon: '🏫', color: 'bg-blue-50' }
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
                        <Calendar className="w-5 h-5 mr-3 text-indigo-500" /> Academic Calendar
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Grade Submission', date: 'Jan 28', urgent: true },
                            { name: 'Faculty Mixer', date: 'Feb 05', urgent: false },
                            { name: 'Board Review', date: 'Feb 12', urgent: false }
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
                        <Award className="w-5 h-5 mr-3 text-amber-400" /> Professional Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 group hover:border-amber-500 transition-colors">
                                <span className="text-2xl group-hover:scale-125 transition-transform">🎖️</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-xs text-slate-400 font-bold mt-6 cursor-pointer hover:text-white transition-colors uppercase">View Accreditation</p>
                </div>
            </div>
        </div>
    );
};
