import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';

interface Program {
    id: number;
    name: string;
    code: string;
    description: string;
    total_credits: number;
    version: string;
}

export const ProgramsPage: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState(120);
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/programs/');
            setPrograms(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching programs:', error);
            setLoading(false);
        }
    };

    const handleAddProgram = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/v1/programs/', {
                name,
                code,
                description,
                total_credits: credits,
                version: "1.0"
            });
            setName('');
            setCode('');
            setDescription('');
            setCredits(120);
            setShowAddForm(false);
            fetchPrograms();
        } catch (error) {
            console.error('Error adding program:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/programs/${id}`);
                fetchPrograms();
            } catch (error) {
                console.error('Error deleting program:', error);
            }
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Academic Programs</h1>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {showAddForm ? 'Cancel' : 'Add Program'}
                    </button>
                </div>

                {showAddForm && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">New Program Details</h2>
                        <form onSubmit={handleAddProgram} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text" placeholder="Program Name" value={name} onChange={(e) => setName(e.target.value)}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required
                            />
                            <input
                                type="text" placeholder="Program Code (e.g. CS101)" value={code} onChange={(e) => setCode(e.target.value)}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required
                            />
                            <input
                                type="number" placeholder="Total Credits" value={credits} onChange={(e) => setCredits(Number(e.target.value))}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" required
                            />
                            <textarea
                                placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2" rows={3}
                            />
                            <button type="submit" className="bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 transition md:col-span-2">
                                Save Program
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-10 text-center text-gray-500">Loading programs...</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Code</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Credits</th>
                                    <th className="px-6 py-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((program) => (
                                    <tr key={program.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4 font-mono text-sm text-blue-600">{program.code}</td>
                                        <td className="px-6 py-4 font-medium">{program.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{program.total_credits}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDelete(program.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {programs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No programs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};
