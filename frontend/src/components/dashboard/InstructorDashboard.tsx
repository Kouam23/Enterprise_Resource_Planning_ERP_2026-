import React from 'react';
import { Users, GraduationCap, ClipboardCheck, Calendar, ChevronRight, Star } from 'lucide-react';

interface InstructorDashboardProps {
    stats: {
        total_students: number;
        total_courses: number;
    };
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({ stats }) => {
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Academic Headline Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">My Students</p>
                        <p className="text-4xl font-black text-slate-900">{Math.floor(stats.total_students / 5)}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                        <Users className="w-8 h-8" />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">Active Classes</p>
                        <p className="text-4xl font-black text-slate-900">4</p>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase mb-1 tracking-widest">Grading Pending</p>
                        <p className="text-4xl font-black text-rose-500">12</p>
                    </div>
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
                        <ClipboardCheck className="w-8 h-8" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Grading Queue & Course Management */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Your Active Courses</h2>
                            <button className="text-indigo-600 text-sm font-bold flex items-center">Manage All <ChevronRight className="w-4 h-4 ml-1" /></button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Advanced Quantum Physics', students: 42, engagement: 88, next_class: 'Tomorrow, 10 AM' },
                                { name: 'Statistical Mechanics', students: 28, engagement: 72, next_class: 'Friday, 2 PM' },
                                { name: 'Introduction to Optics', students: 56, engagement: 94, next_class: 'Closed for Grading' }
                            ].map((course, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{course.name}</h4>
                                            <p className="text-xs font-bold text-slate-400 mt-1">{course.students} Enrolled • Next: <span className="text-indigo-500">{course.next_class}</span></p>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement</p>
                                                <div className="flex items-center">
                                                    <span className="text-sm font-black text-slate-800">{course.engagement}%</span>
                                                    <div className="w-20 h-1.5 bg-slate-200 rounded-full ml-2 overflow-hidden">
                                                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.engagement}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="p-2 bg-white text-slate-400 rounded-lg hover:text-indigo-600 shadow-sm"><Star className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pedagogy Support / Student Inquiries */}
                <div className="space-y-8">
                    <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-4 tracking-tighter">Student Inquiries</h3>
                            <div className="space-y-4">
                                {[
                                    { user: 'Marc L.', topic: 'Quiz clarification', time: '10m ago' },
                                    { user: 'Sonia K.', topic: 'Submission extension', time: '1h ago' },
                                    { user: 'Arthur P.', topic: 'Resource request', time: '3h ago' }
                                ].map((msg, i) => (
                                    <div key={i} className="bg-white/10 p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer capitalize">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black">{msg.user}</span>
                                            <span className="text-[10px] font-medium opacity-60">{msg.time}</span>
                                        </div>
                                        <p className="text-sm font-bold truncate">{msg.topic}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 bg-white text-indigo-600 text-sm font-black rounded-xl hover:bg-slate-100 transition-colors shadow-lg shadow-indigo-800/20">Go to Inbox</button>
                        </div>
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 uppercase mb-6 tracking-widest flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                            Office Hours
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 border-l-4 border-indigo-500 rounded-xl">
                                <p className="text-xs font-black text-slate-400">TODAY - 4:00 PM</p>
                                <p className="text-sm font-bold text-slate-800">Room 302 or Online Zoom</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
