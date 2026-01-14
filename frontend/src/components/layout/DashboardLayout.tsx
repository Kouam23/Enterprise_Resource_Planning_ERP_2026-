import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-slate-700">ERP System</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="block py-2 px-4 rounded hover:bg-slate-700">Dashboard</Link>
                    <Link to="/courses" className="block py-2 px-4 rounded hover:bg-slate-700">Courses</Link>
                    <Link to="/students" className="block py-2 px-4 rounded hover:bg-slate-700">Students</Link>
                    <Link to="/finance" className="block py-2 px-4 rounded hover:bg-slate-700">Finance</Link>
                    <Link to="/hr" className="block py-2 px-4 rounded hover:bg-slate-700">HR</Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button onClick={logout} className="w-full py-2 bg-red-600 rounded hover:bg-red-700">Logout</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Welcome, {user?.full_name || 'User'}</h2>
                    <div className="flex items-center space-x-4">
                        {/* Notification Icon etc */}
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
