import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { InstructorDashboard } from '../components/dashboard/InstructorDashboard';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { StaffDashboard } from '../components/dashboard/StaffDashboard';
import { Sparkles } from 'lucide-react';

interface Stats {
    total_students: number;
    total_courses: number;
    total_employees: number;
    balance: number;
}

export const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<Stats>({
        total_students: 0,
        total_courses: 0,
        total_employees: 0,
        balance: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const userRole = (user as any)?.role?.name || 'Student';
    const userName = (user as any)?.full_name || 'User';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/analytics/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const renderDashboard = () => {
        switch (userRole) {
            case 'Super Admin':
            case 'Administrator':
                return <AdminDashboard stats={stats} />;
            case 'Instructor':
                return <InstructorDashboard stats={stats} />;
            case 'Staff':
                return <StaffDashboard stats={stats} />;
            case 'Student':
            default:
                return <StudentDashboard />;
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-[1600px] mx-auto">
                {/* Dynamic Welcome Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center text-indigo-600 font-black text-xs uppercase tracking-[0.2em] mb-2">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Empowering Education
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                            Welcome back, {userName.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">
                            Here is what's happening in your {userRole.toLowerCase()} portal today.
                        </p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Session</p>
                            <p className="text-sm font-bold text-slate-900 leading-none">Spring Semester 2026</p>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-200 hidden sm:block mx-4"></div>
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-black text-slate-600">
                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Intelligence...</p>
                    </div>
                ) : (
                    renderDashboard()
                )}
            </div>
        </DashboardLayout>
    );
};
