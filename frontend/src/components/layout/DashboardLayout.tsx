import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, CreditCard, Award, GraduationCap, Megaphone, Package, BarChart3, Languages, MessageSquare, Shield, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const { t, i18n } = useTranslation();

    const navigation = [
        { name: t('common.dashboard'), href: '/dashboard', icon: LayoutDashboard, roles: ['Super Admin', 'Administrator', 'Instructor', 'Student', 'Staff'] },
        { name: t('common.courses'), href: '/courses', icon: BookOpen, roles: ['Super Admin', 'Administrator', 'Instructor', 'Student'] },
        { name: t('common.programs'), href: '/programs', icon: GraduationCap, roles: ['Super Admin', 'Administrator'] },
        { name: t('common.grades'), href: '/grades', icon: Award, roles: ['Super Admin', 'Administrator', 'Instructor', 'Student'] },
        { name: t('common.students'), href: '/students', icon: Users, roles: ['Super Admin', 'Administrator', 'Instructor'] },
        { name: t('common.marketing'), href: '/marketing', icon: Megaphone, roles: ['Super Admin', 'Administrator'] },
        { name: t('common.finance'), href: '/finance', icon: CreditCard, roles: ['Super Admin', 'Administrator', 'Staff'] },
        { name: t('common.hr'), href: '/hr', icon: Users, roles: ['Super Admin', 'Administrator', 'Staff'] },
        { name: t('common.assets'), href: '/assets', icon: Package, roles: ['Super Admin', 'Administrator', 'Staff'] },
        { name: t('common.analytics'), href: '/analytics', icon: BarChart3, roles: ['Super Admin', 'Administrator'] },
        { name: 'Collaboration', href: '/collaboration', icon: MessageSquare, roles: ['Super Admin', 'Administrator', 'Instructor', 'Student', 'Staff'] },
        { name: 'Security Audit', href: '/security', icon: Shield, roles: ['Super Admin'] },
        { name: 'Settings', href: '/settings', icon: Settings, roles: ['Super Admin'] },
    ];

    // Filtered navigation based on user role
    // For now, if role is not found or user is null, we default to minimal access
    const filteredNavigation = navigation.filter(item => {
        // We assume user object has a role property (e.g., from auth context)
        // If not, we might need to fetch it or check role_id mapping
        // For this implementation, we'll check user.role or a simulated role name
        const userRole = (user as any)?.role?.name || 'Student';
        return item.roles.includes(userRole) || userRole === 'Super Admin';
    });

    useEffect(() => {
        const activePage = navigation.find(n => n.href === location.pathname);
        document.title = `${activePage?.name || 'ERP'} | Academic Hub`;
    }, [location.pathname]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
                <div className="p-6 text-2xl font-black tracking-tighter border-b border-slate-800 flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg"></div>
                    <span>ERP Core</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {filteredNavigation.map((item) => {
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

                <div className="p-4 border-t border-slate-800 space-y-4">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800 rounded-xl">
                        <Languages className="w-4 h-4 text-slate-400" />
                        <select
                            onChange={(e) => changeLanguage(e.target.value)}
                            className="bg-transparent text-xs font-bold text-slate-400 focus:outline-none w-full cursor-pointer"
                            value={i18n.language}
                        >
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full py-2.5 bg-slate-800 text-red-400 font-semibold rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200"
                    >
                        {t('common.logout')}
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
                            <p className="text-xs text-indigo-500 font-black uppercase tracking-widest">{(user as any)?.role?.name || 'System User'}</p>
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
