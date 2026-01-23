import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GraduationCap, BookOpen, AlertCircle, X } from 'lucide-react';

interface Student {
    id: number;
    matricule?: string;
    full_name: string;
    email: string;
    enrollment_date: string;
    status: string;
    program_id?: number;
    cgpa?: number;
}

interface Course {
    id: number;
    code: string;
    title: string;
    credits: number;
}

export const StudentsPage: React.FC = () => {
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const canManageStudents = ['Super Admin', 'Administrator', 'Instructor'].includes(userRole);

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
    const [programId, setProgramId] = useState<number | ''>('');
    const [programs, setPrograms] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    // Enrollment Modal State
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
    const [selectedTerm, setSelectedTerm] = useState('Fall 2024');
    const [enrollmentProcessing, setEnrollmentProcessing] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user && canManageStudents) {
            fetchStudents();
            fetchPrograms();
            fetchCourses();
        } else {
            setLoading(false);
        }
    }, [user, canManageStudents]);

    const fetchStudents = async () => {
        try {
            const response = await api.get('/students/');
            console.log("Students API Response:", response.data);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await api.get('/programs/');
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses/'); // Assuming /courses/ endpoint exists
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/students/', {
                full_name: fullName,
                email,
                enrollment_date: enrollmentDate,
                program_id: programId || null,
                status: "active"
            });
            setFullName('');
            setEmail('');
            setEnrollmentDate(new Date().toISOString().split('T')[0]);
            setProgramId('');
            setShowAddForm(false);
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    };

    const handleEnrollStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCourseId) return;

        setEnrollmentProcessing(true);
        setEnrollmentError(null);
        setEnrollmentSuccess(null);

        try {
            await api.post('/enrollments/', {
                student_id: selectedStudent.id,
                course_id: Number(selectedCourseId),
                term: selectedTerm,
                status: 'enrolled'
            });
            setEnrollmentSuccess(`Successfully enrolled ${selectedStudent.full_name} in course.`);
            setTimeout(() => {
                setShowEnrollModal(false);
                setEnrollmentSuccess(null);
                setSelectedStudent(null);
                setSelectedCourseId('');
            }, 2000);
        } catch (error: any) {
            console.error('Enrollment Error:', error);
            const msg = error.response?.data?.detail || "Enrollment failed.";
            setEnrollmentError(msg);
        } finally {
            setEnrollmentProcessing(false);
        }
    }

    const getProgramName = (id: number | undefined) => {
        if (id === undefined || id === null) return 'Not Assigned';
        const program = programs.find(p => p.id === id);
        return program ? program.name : 'Not Assigned';
    };

    const openEnrollModal = (student: Student) => {
        setSelectedStudent(student);
        setEnrollmentError(null);
        setEnrollmentSuccess(null);
        setShowEnrollModal(true);
    };

    if (!canManageStudents) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                        <GraduationCap className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Academic Portal Restricted</h1>
                    <p className="text-slate-500 max-w-md font-medium">
                        Academic records and student directories are only accessible to faculty and administrative personnel.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 relative">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
                    {canManageStudents && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                        >
                            {showAddForm ? 'Cancel' : '+ Enroll New Student'}
                        </button>
                    )}
                </div>

                {showAddForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">New Student Enrollment</h2>
                        <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input
                                    type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Enrollment Date</label>
                                <input
                                    type="date" value={enrollmentDate} onChange={(e) => setEnrollmentDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Academic Program</label>
                                <select
                                    value={programId} onChange={(e) => setProgramId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="">None / Undeclared</option>
                                    {programs.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="bg-emerald-600 text-white p-3 rounded-lg font-bold hover:bg-emerald-700 transition md:col-span-2 mt-4">
                                Complete Enrollment
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Matricule</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CGPA</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-mono text-sm text-slate-500">{student.matricule || 'Pending'}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{student.full_name}</td>
                                        <td className="px-6 py-4 text-slate-600">{student.email}</td>
                                        <td className="px-6 py-4 text-indigo-600 font-medium">{getProgramName(student.program_id)}</td>
                                        <td className="px-6 py-4 text-slate-600 font-bold">
                                            {typeof student.cgpa === 'number' ? student.cgpa.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex flex-col space-y-2 lg:block lg:space-y-0 text-right">
                                            <button
                                                onClick={() => openEnrollModal(student)}
                                                className="text-indigo-600 hover:text-indigo-900 font-bold text-xs bg-indigo-50 px-2 py-1 rounded mr-2"
                                            >
                                                + Register Course
                                            </button>
                                            <button className="text-emerald-600 hover:text-emerald-900 font-medium mr-3 text-sm">Profile</button>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-slate-500 font-medium">No students enrolled yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Course Registration Modal */}
                {showEnrollModal && selectedStudent && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Register Course</h3>
                                <button onClick={() => setShowEnrollModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <p className="text-sm text-slate-500">Student: <span className="font-bold text-slate-800">{selectedStudent.full_name}</span></p>
                                <p className="text-xs text-slate-400 font-mono mt-1">{selectedStudent.matricule}</p>
                            </div>

                            {enrollmentError && (
                                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start">
                                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    <span>{enrollmentError}</span>
                                </div>
                            )}

                            {enrollmentSuccess && (
                                <div className="mb-4 bg-emerald-50 text-emerald-600 p-3 rounded-lg text-center text-sm font-bold">
                                    {enrollmentSuccess}
                                </div>
                            )}

                            <form onSubmit={handleEnrollStudent} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Select Course</label>
                                    <select
                                        className="w-full p-2 border border-slate-200 rounded-lg"
                                        value={selectedCourseId}
                                        onChange={e => setSelectedCourseId(Number(e.target.value))}
                                        required
                                    >
                                        <option value="">-- Choose Course --</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.code} - {c.title} ({c.credits} cr)</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Academic Term</label>
                                    <select
                                        className="w-full p-2 border border-slate-200 rounded-lg"
                                        value={selectedTerm}
                                        onChange={e => setSelectedTerm(e.target.value)}
                                    >
                                        <option value="Fall 2024">Fall 2024</option>
                                        <option value="Spring 2025">Spring 2025</option>
                                        <option value="Summer 2025">Summer 2025</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={enrollmentProcessing}
                                    className={`w-full text-white font-bold py-3 rounded-xl transition ${enrollmentProcessing ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {enrollmentProcessing ? 'Verifying & Registering...' : 'Register Course'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
