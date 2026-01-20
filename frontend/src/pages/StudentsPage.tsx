import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Student {
    id: number;
    full_name: string;
    email: string;
    enrollment_date: string;
    status: string;
    program_id?: number;
    cgpa?: number;
}

export const StudentsPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
    const [programId, setProgramId] = useState<number | ''>('');
    const [programs, setPrograms] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchPrograms();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/students/');
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };

    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/programs/');
            setPrograms(response.data);
        } catch (error) {
            console.error('Error fetching programs:', error);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/v1/students/', {
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

    const getProgramName = (id: number | undefined) => {
        if (id === undefined || id === null) return 'Not Assigned';
        const program = programs.find(p => p.id === id);
        return program ? program.name : 'Not Assigned';
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Student Directory</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                        {showAddForm ? 'Cancel' : '+ Enroll New Student'}
                    </button>
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
                                        <td className="px-6 py-4">
                                            <button className="text-emerald-600 hover:text-emerald-900 font-medium mr-3">Profile</button>
                                            <button className="text-red-600 hover:text-red-900 font-medium">Suspend</button>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500 font-medium">No students enrolled yet.</td>
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
