import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Course {
    id: number;
    title: string;
    code: string;
    description: string;
    credits: number;
    is_mandatory: boolean;
    category: string;
    capacity: number;
    hours_per_week: number;
    prerequisites?: Course[];
}

export const CoursesPage: React.FC = () => {
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const canManageCourses = ['Super Admin', 'Administrator', 'Instructor'].includes(userRole);

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState(3);
    const [isMandatory, setIsMandatory] = useState(true);
    const [category, setCategory] = useState('core');
    const [capacity, setCapacity] = useState(30);
    const [hours, setHours] = useState(3);
    const [prerequisiteIds, setPrerequisiteIds] = useState<number[]>([]);
    const [corequisiteIds, setCorequisiteIds] = useState<number[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        if (user) fetchCourses();
    }, [user]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/courses/');
            setCourses(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setLoading(false);
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canManageCourses) return;
        try {
            await axios.post('http://localhost:8000/api/v1/courses/', {
                title,
                code,
                description,
                credits,
                is_mandatory: isMandatory,
                category,
                capacity,
                hours_per_week: hours,
                prerequisite_ids: prerequisiteIds,
                corequisite_ids: corequisiteIds
            });
            setTitle('');
            setCode('');
            setDescription('');
            setCredits(3);
            setIsMandatory(true);
            setCategory('core');
            setCapacity(30);
            setHours(3);
            setPrerequisiteIds([]);
            setCorequisiteIds([]);
            setShowAddForm(false);
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Courses Directory</h1>
                    {canManageCourses && (
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                        >
                            {showAddForm ? 'Cancel' : '+ Add New Course'}
                        </button>
                    )}
                </div>

                {showAddForm && canManageCourses && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-800">New Course Details</h2>
                        <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course Code</label>
                                <input
                                    type="text" placeholder="e.g. CS101" value={code} onChange={(e) => setCode(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                                <input
                                    type="text" placeholder="e.g. Introduction to Programming" value={title} onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Credits</label>
                                <input
                                    type="number" placeholder="Credits" value={credits} onChange={(e) => setCredits(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select
                                    value={category} onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="core">Core</option>
                                    <option value="elective">Elective</option>
                                    <option value="general">General</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                                <input
                                    type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hours per Week</label>
                                <input
                                    type="number" placeholder="Hours per Week" value={hours} onChange={(e) => setHours(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Prerequisites</label>
                                <select
                                    multiple
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                    value={prerequisiteIds.map(String)}
                                    onChange={(e) => setPrerequisiteIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                                >
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Co-requisites</label>
                                <select
                                    multiple
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                    value={corequisiteIds.map(String)}
                                    onChange={(e) => setCorequisiteIds(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                                >
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.code}</option>)}
                                </select>
                            </div>
                            <div className="flex items-center space-x-2 py-4">
                                <input
                                    type="checkbox" checked={isMandatory} onChange={(e) => setIsMandatory(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                />
                                <label className="text-slate-700 font-medium">Mandatory</label>
                            </div>
                            <div className="lg:col-span-3">
                                <p className="text-xs text-slate-500 italic mb-2">Hold Ctrl (Cmd on Mac) to select multiple courses.</p>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea
                                    placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" rows={3}
                                />
                            </div>
                            <button type="submit" className="bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition lg:col-span-3 mt-4">
                                Save Course Information
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Code</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Prereqs</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    {canManageCourses && <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {courses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-4 font-medium text-slate-900">{course.code}</td>
                                        <td className="px-6 py-4 text-slate-600">{course.title}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {course.prerequisites?.map(p => p.code).join(', ') || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{course.credits}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${course.is_mandatory ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                                                {course.is_mandatory ? 'Mandatory' : 'Elective'}
                                            </span>
                                        </td>
                                        {canManageCourses && (
                                            <td className="px-6 py-4">
                                                <button className="text-indigo-600 hover:text-indigo-900 mr-3 font-medium">Edit</button>
                                                <button className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-medium">No courses found in the system.</td>
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
