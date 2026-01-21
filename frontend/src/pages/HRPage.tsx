import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
    CreditCard, Calendar, Briefcase,
    MapPin, Fingerprint, Target, Star
} from 'lucide-react';

interface Employee {
    id: number;
    full_name: string;
    email: string;
    position: string;
    department: string;
    salary: number;
}

interface PayrollRecord {
    id: number;
    employee_id: number;
    month: number;
    year: number;
    net_pay: number;
    status: string;
}

interface LeaveRecord {
    id: number;
    employee_id: number;
    leave_type: string;
    start_date: string;
    end_date: string;
    status: string;
}

interface AttendanceRecord {
    id: number;
    employee_id: number;
    check_in: string;
    check_out?: string;
    status: string;
    location_name?: string;
}

interface OKR {
    id: number;
    objective: string;
    progress: number;
    status: string;
}

export const HRPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
    const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [okrs, setOkrs] = useState<OKR[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'employees' | 'payroll' | 'leaves' | 'attendance' | 'performance'>('employees');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eRes, pRes, lRes, aRes, oRes] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/hr/'),
                axios.get('http://localhost:8000/api/v1/hr-ext/payroll'),
                axios.get('http://localhost:8000/api/v1/hr-ext/leave'),
                axios.get('http://localhost:8000/api/v1/hr-ext/attendance'),
                axios.get('http://localhost:8000/api/v1/hr-ext/okrs')
            ]);
            setEmployees(eRes.data);
            setPayroll(pRes.data);
            setLeaves(lRes.data);
            setAttendance(aRes.data);
            setOkrs(oRes.data);
        } catch (error) {
            console.error('Error fetching HR data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (empId: number) => {
        try {
            await axios.post('http://localhost:8000/api/v1/hr-ext/attendance/check-in', {
                employee_id: empId,
                device_id: 'WEB-SIM-BIO-001',
                latitude: 40.7128,
                longitude: -74.0060,
                location_name: 'Main Campus (HQ)'
            });
            fetchData();
        } catch (error) {
            console.error('Check-in error:', error);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">HR Operations</h1>
                        <p className="text-slate-500 font-medium">Manage talent, payroll, biometric attendance, and OKRs.</p>
                    </div>
                    <div className="flex space-x-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto">
                        {['employees', 'payroll', 'leaves', 'attendance', 'performance'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t as any)}
                                className={`px-4 py-2.5 rounded-xl font-bold transition-all duration-200 capitalize whitespace-nowrap ${activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
                        {activeTab === 'employees' && (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Employee</th>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Position</th>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {employees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-indigo-50/30 transition">
                                            <td className="px-10 py-6">
                                                <p className="font-black text-slate-900">{emp.full_name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{emp.email}</p>
                                            </td>
                                            <td className="px-10 py-6 text-slate-600 font-bold">
                                                <div className="flex items-center">
                                                    <Briefcase className="w-4 h-4 mr-2 text-indigo-400" />
                                                    <span>{emp.position}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <button
                                                    onClick={() => handleCheckIn(emp.id)}
                                                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-indigo-100"
                                                >
                                                    Simulation: Check-In
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'attendance' && (
                            <div className="p-8">
                                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                                    <Fingerprint className="w-6 h-6 mr-2 text-indigo-500" /> Biometric Logs
                                </h3>
                                <div className="space-y-4">
                                    {attendance.map(a => (
                                        <div key={a.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 border border-slate-100 mr-4 shadow-sm">
                                                    <MapPin className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900">Staff #{a.employee_id}</p>
                                                    <p className="text-xs text-slate-500 font-bold">{a.location_name || 'Geofenced Location'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-slate-900">{new Date(a.check_in).toLocaleTimeString()}</p>
                                                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                                                    Biometric Verified
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {attendance.length === 0 && <p className="text-center py-12 text-slate-400 font-bold">No biometric data for today.</p>}
                                </div>
                            </div>
                        )}

                        {activeTab === 'performance' && (
                            <div className="p-8">
                                <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                                    <Target className="w-6 h-6 mr-2 text-rose-500" /> OKR Tracking
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {okrs.map(okr => (
                                        <div key={okr.id} className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="font-black text-slate-900 text-lg leading-tight">{okr.objective}</h4>
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${okr.status === 'active' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {okr.status}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${okr.progress}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                                <span>Progress</span>
                                                <span>{okr.progress}% Completed</span>
                                            </div>
                                        </div>
                                    ))}
                                    {okrs.length === 0 && (
                                        <div className="col-span-full py-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                                            <Star className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                            <p className="text-slate-500 font-bold">No OKRs defined for this cycle.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'payroll' && (
                            <div className="p-8">
                                <h3 className="text-xl font-black text-slate-800 mb-6">Payroll Cycle</h3>
                                {/* ... previous payroll code ... */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {payroll.map(p => (
                                        <div key={p.id} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 border border-slate-100 mr-4">
                                                    <CreditCard className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900">Staff #{p.employee_id}</p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{p.month}/{p.year}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-indigo-600">${p.net_pay.toLocaleString()}</p>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                    {p.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'leaves' && (
                            <div className="p-8">
                                <h3 className="text-xl font-black text-slate-800 mb-6">Leave Requests</h3>
                                <div className="space-y-3">
                                    {leaves.map(l => (
                                        <div key={l.id} className="border border-slate-100 p-6 rounded-3xl flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900">{l.leave_type}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{l.start_date} to {l.end_date}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase ${l.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {l.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
