import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';

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
                axios.get('http://localhost:8000/api/v1/students/'),
                axios.get('http://localhost:8000/api/v1/courses/'),
                axios.get('http://localhost:8000/api/v1/grades/')
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
        try {
            await axios.post('http://localhost:8000/api/v1/grades/', {
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
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Grade Management</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        {showAddForm ? 'Cancel' : '+ Record New Score'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">Record Assessment Score</h2>
                        <form onSubmit={handleAddGrade} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                                <select
                                    value={studentId} onChange={(e) => setStudentId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course</label>
                                <select
                                    value={courseId} onChange={(e) => setCourseId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Type</label>
                                <select
                                    value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="assignment">Assignment</option>
                                    <option value="quiz">Quiz</option>
                                    <option value="midterm">Midterm</option>
                                    <option value="final">Final Exam</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Score (out of 100)</label>
                                <input
                                    type="number" step="0.1" value={score} onChange={(e) => setScore(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (e.g. 0.2 for 20%)</label>
                                <input
                                    type="number" step="0.01" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Term/Semester</label>
                                <input
                                    type="text" value={term} onChange={(e) => setTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" required
                                />
                            </div>
                            <button type="submit" className="bg-purple-600 text-white p-3 rounded-lg font-bold hover:bg-purple-700 transition lg:col-span-3 mt-4">
                                Confirm Score Entry
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {grades.map((grade) => (
                                    <tr key={grade.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-900">{getStudentName(grade.student_id)}</td>
                                        <td className="px-6 py-4 text-slate-600 font-semibold">{getCourseCode(grade.course_id)}</td>
                                        <td className="px-6 py-4 text-slate-600 capitalize">{grade.assessment_type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${grade.score >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {grade.score}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{(grade.weight * 100).toFixed(0)}%</td>
                                        <td className="px-6 py-4">
                                            <button className="text-purple-600 hover:text-purple-900 font-medium">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                                {grades.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-medium">No grades recorded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
