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
    assessment_type: string;
    score: number;
    weight: number;
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
    const [assessmentType, setAssessmentType] = useState('assignment');
    const [score, setScore] = useState(0);
    const [weight, setWeight] = useState(0.1);
    const [term, setTerm] = useState('Spring 2026');
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
                weight: Number(weight),
                term
            });
            setScore(0);
            setShowAddForm(false);
            fetchData();
        } catch (error) {
            console.error('Error adding grade:', error);
        }
    };

    const getStudentName = (id: number) => students.find(s => s.id === id)?.full_name || 'Unknown';
    const getCourseCode = (id: number) => courses.find(c => c.id === id)?.code || 'Unknown';

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <div className="flex items-center text-purple-600 font-black text-xs uppercase tracking-widest mb-2">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Academic Excellence
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Grade Management</h1>
                        <p className="text-slate-500 font-medium">
                            {isFaculty ? 'Record and monitor student performance across all courses.' : 'Monitor your personal academic performance and course progress.'}
                        </p>
                    </div>

                    {isFaculty && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className={`flex items-center px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${showAddForm
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
                                }`}
                        >
                            {showAddForm ? (
                                <><X className="w-5 h-5 mr-2" /> Cancel</>
                            ) : (
                                <><Plus className="w-5 h-5 mr-2" /> Record New Score</>
                            )}
                        </button>
                    )}
                </div>

                {showAddForm && isFaculty && (
                    <div className="bg-white p-8 rounded-[32px] shadow-xl mb-12 border border-slate-100 animate-in slide-in-from-top-4">
                        <div className="flex items-center mb-8">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mr-4">
                                <ClipboardCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Record Assessment Score</h2>
                        </div>

                        <form onSubmit={handleAddGrade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Student</label>
                                <select
                                    value={studentId} onChange={(e) => setStudentId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-bold text-slate-700" required
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Course</label>
                                <select
                                    value={courseId} onChange={(e) => setCourseId(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-bold text-slate-700" required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Type</label>
                                <select
                                    value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-bold text-slate-700"
                                >
                                    <option value="assignment">Assignment</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="midterm">Midterm</option>
                                    <option value="final">Final Exam</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Score (0-100)</label>
                                <input
                                    type="number" step="0.1" value={score} onChange={(e) => setScore(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-bold text-slate-700" required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Weight (e.g. 0.2)</label>
                                <input
                                    type="number" step="0.01" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-bold text-slate-700" required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Term/Semester</label>
                                <input
                                    type="text" value={term} onChange={(e) => setTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-bold text-slate-700" required
                                />
                            </div>
                            <div className="lg:col-span-3 pt-4">
                                <button type="submit" className="w-full bg-purple-600 text-white py-4 rounded-2xl font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-[0.98]">
                                    Confirm Score Entry
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center p-24 bg-white rounded-[40px] border border-slate-100">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Course</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Weight</th>
                                        {isFaculty && <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {grades.map((grade) => (
                                        <tr key={grade.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-800">{getStudentName(grade.student_id)}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-black">{getCourseCode(grade.course_id)}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-500 capitalize">{grade.assessment_type}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center">
                                                    <span className={`text-lg font-black mr-2 ${grade.score >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                        {grade.score}%
                                                    </span>
                                                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                                        <div className={`h-full rounded-full ${grade.score >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${grade.score}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-slate-400">{(grade.weight * 100).toFixed(0)}%</p>
                                            </td>
                                            {isFaculty && (
                                                <td className="px-8 py-6">
                                                    <button className="p-2 text-slate-300 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                                                        <Edit2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {grades.length === 0 && (
                                        <tr>
                                            <td colSpan={isFaculty ? 6 : 5} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <ClipboardCheck className="w-12 h-12 text-slate-200 mb-4" />
                                                    <p className="text-slate-400 font-bold">No academic records found in this cycle.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
