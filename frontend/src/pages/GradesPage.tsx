import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Plus, X, GraduationCap, ClipboardCheck, Edit2 } from 'lucide-react';

interface Student {
    id: number;
    full_name: string;
}

interface Course {
    id: number;
    title: string;
    code: string;
}

interface Grade {
    id: number;
    student_id: number;
    course_id: number;
    assessment_type: 'CA' | 'Final';
    score: number;
    is_resit: boolean;
    term: string;
}

export const GradesPage: React.FC = () => {
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const isFaculty = userRole === 'Super Admin' || userRole === 'Administrator' || userRole === 'Instructor' || userRole === 'Staff';

    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [studentId, setStudentId] = useState<number | ''>('');
    const [courseId, setCourseId] = useState<number | ''>('');
    const [assessmentType, setAssessmentType] = useState('CA');
    const [score, setScore] = useState(0);
    const [isResit, setIsResit] = useState(false);
    const [term, setTerm] = useState('Fall 2026');
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [sRes, cRes, gRes] = await Promise.all([
                api.get('/students/'),
                api.get('/courses/'),
                api.get('/grades/')
            ]);
            setStudents(sRes.data);
            setCourses(cRes.data);
            setGrades(gRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleAddGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFaculty) return;

        try {
            await api.post('/grades/', {
                student_id: Number(studentId),
                course_id: Number(courseId),
                assessment_type: assessmentType,
                score: Number(score),
                is_resit: isResit,
                term
            });
            setScore(0);
            setIsResit(false);
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            console.error('Error adding grade:', error);
        }
    };

    const getStudentName = (id: number) => students.find(s => s.id === id)?.full_name || 'Unknown';
    const getStudentMatricule = (id: number) => (students.find(s => s.id === id) as any)?.matricule || 'Pending';
    const getCourseCode = (id: number) => courses.find(c => c.id === id)?.code || 'Unknown';

    // Grouping logic for 30/70 display
    const groupedGrades = grades.reduce((acc: any, grade) => {
        const key = `${grade.student_id}-${grade.course_id}`;
        if (!acc[key]) {
            acc[key] = { student_id: grade.student_id, course_id: grade.course_id, ca: [], final: null, resit: null };
        }
        if (grade.assessment_type === 'CA') acc[key].ca.push(grade);
        else if (grade.assessment_type === 'Final') {
            if (grade.is_resit) acc[key].resit = grade;
            else acc[key].final = grade;
        }
        return acc;
    }, {});

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center text-indigo-600 font-bold text-xs uppercase tracking-widest mb-2">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            ICT University • Academic Governance
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Academic Transcript & Grades</h1>
                        <p className="text-slate-500 font-medium">Monitoring 30/70 Split (CA vs Final) and GPA 4.0 status.</p>
                    </div>

                    {isFaculty && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className={`flex items-center px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${showAddForm
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                                }`}
                        >
                            {showAddForm ? (
                                <><X className="w-5 h-5 mr-2" /> Close</>
                            ) : (
                                <><Plus className="w-5 h-5 mr-2" /> Enter Assessment</>
                            )}
                        </button>
                    )}
                </div>

                {showAddForm && isFaculty && (
                    <div className="bg-white p-8 rounded-[32px] shadow-2xl mb-12 border border-slate-100 animate-in slide-in-from-top-4">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">New Score Entry</h2>
                        <form onSubmit={handleAddGrade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Student</label>
                                <select
                                    value={studentId} onChange={(e) => setStudentId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" required
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({(s as any).matricule})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course</label>
                                <select
                                    value={courseId} onChange={(e) => setCourseId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Role</label>
                                <select
                                    value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700"
                                >
                                    <option value="CA">Continuous Assessment (CA)</option>
                                    <option value="Final">Final Examination</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Score (out of 100)</label>
                                <input
                                    type="number" step="0.5" value={score} onChange={(e) => setScore(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700" required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Term</label>
                                <input
                                    type="text" value={term} onChange={(e) => setTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700"
                                />
                            </div>
                            <div className="flex items-center space-x-3 pt-8">
                                <input
                                    type="checkbox" id="isResit" checked={isResit} onChange={(e) => setIsResit(e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded-lg border-slate-200 focus:ring-indigo-500"
                                />
                                <label htmlFor="isResit" className="text-sm font-bold text-slate-600">This is a Resit Attempt</label>
                            </div>
                            <button type="submit" className="lg:col-span-3 w-full bg-indigo-600 text-white py-4 rounded-3xl font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all">
                                Validate & Record Score
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student / Matricule</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course Code</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CA (30%)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Final (70%)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Weighted Total</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Standing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold">
                            {Object.values(groupedGrades).map((data: any) => {
                                const caAvg = data.ca.length ? data.ca.reduce((t: number, g: any) => t + g.score, 0) / data.ca.length : 0;
                                const finalScore = data.resit ? data.resit.score : (data.final ? data.final.score : 0);
                                const total = (caAvg * 0.3) + (finalScore * 0.7);

                                return (
                                    <tr key={`${data.student_id}-${data.course_id}`} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="text-slate-900">{getStudentName(data.student_id)}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">{getStudentMatricule(data.student_id)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black">{getCourseCode(data.course_id)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500">{caAvg.toFixed(1)}%</td>
                                        <td className="px-8 py-6 text-slate-500">
                                            {finalScore.toFixed(1)}%
                                            {data.resit && <span className="ml-2 text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black uppercase">Resit</span>}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-lg font-black ${total >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>{total.toFixed(1)}%</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {total >= 50 ? (
                                                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl uppercase tracking-widest font-black">Passed</span>
                                            ) : total >= 40 ? (
                                                <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl uppercase tracking-widest font-black">Resit Recommended</span>
                                            ) : (
                                                <span className="text-[10px] bg-rose-50 text-rose-600 px-3 py-1.5 rounded-xl uppercase tracking-widest font-black">Carry-Over</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};
