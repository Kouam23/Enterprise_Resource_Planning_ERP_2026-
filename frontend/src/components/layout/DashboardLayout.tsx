import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, CreditCard, Award, GraduationCap, Megaphone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Courses', href: '/courses', icon: BookOpen },
        { name: 'Programs', href: '/programs', icon: GraduationCap },
        { name: 'Grades', href: '/grades', icon: Award },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Marketing', href: '/marketing', icon: Megaphone },
        { name: 'Finance', href: '/finance', icon: CreditCard },
        { name: 'HR', href: '/hr', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-black tracking-tighter border-b border-slate-800 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg"></div>
                    <span>ERP Core</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center space-x-3 py-2.5 px-4 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full py-2.5 bg-slate-800 text-red-400 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">
                        {navigation.find(n => n.href === location.pathname)?.name || 'Welcome'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <div className="text-right mr-4 hidden md:block">
                            <p className="text-sm font-bold text-slate-900">{user?.full_name || 'Administrator'}</p>
                            <p className="text-xs text-slate-500">System Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                            {user?.full_name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto bg-slate-50">
                    {children}
                </main>
            </div>
        </div>
    );
};
