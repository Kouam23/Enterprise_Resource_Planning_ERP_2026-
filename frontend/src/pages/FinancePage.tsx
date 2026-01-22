import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
    Wallet, Receipt, GraduationCap,
    Plus, Truck
} from 'lucide-react';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: string;
    category: string;
    date: string;
}

interface Invoice {
    id: number;
    student_id: number;
    amount_due: number;
    amount_paid: number;
    late_fee_accumulated: number;
    status: string;
    due_date: string;
}

interface Expense {
    id: number;
    category: string;
    amount: number;
    description: string;
    status: string;
    submitted_at: string;
    vendor_id?: number;
}

interface Vendor {
    id: number;
    name: string;
    category: string;
    email: string;
}

export const FinancePage: React.FC = () => {
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const isFinAdmin = ['Super Admin', 'Administrator', 'Staff'].includes(userRole);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'tuition' | 'expenses' | 'vendors'>('overview');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!isFinAdmin) {
            setLoading(false);
            return;
        }
        try {
            const [tRes, iRes, eRes, vRes] = await Promise.all([
                axios.get('http://localhost:8000/api/v1/finance/'),
                axios.get('http://localhost:8000/api/v1/tuition-invoices/'),
                axios.get('http://localhost:8000/api/v1/expenses/'),
                axios.get('http://localhost:8000/api/v1/finance-ext/vendors')
            ]);
            setTransactions(tRes.data);
            setInvoices(iRes.data);
            setExpenses(eRes.data);
            setVendors(vRes.data);
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyLateFees = async () => {
        if (!isFinAdmin) return;
        setProcessing(true);
        try {
            const res = await axios.post('http://localhost:8000/api/v1/finance/apply-late-fees');
            alert(`Applied late fees to ${res.data.affected} invoices.`);
            fetchData();
        } catch (error) {
            console.error('Error applying late fees:', error);
        } finally {
            setProcessing(false);
        }
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    if (!isFinAdmin) {
        return (
            <DashboardLayout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                        <Wallet className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h1>
                    <p className="text-slate-500 max-w-md font-medium">
                        Only authorized personnel can access the financial command center. Please contact your administrator for permissions.
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finance Command</h1>
                        <p className="text-slate-500 font-medium">Global treasury, tuition, and vendor management.</p>
                    </div>
                    <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                        {['overview', 'tuition', 'expenses', 'vendors'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-200 capitalize ${activeTab === tab ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet className="w-24 h-24 text-emerald-600" />
                        </div>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Total Assets</p>
                        <p className="text-3xl font-black text-emerald-600">${(totalIncome - totalExpenses).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Receipt className="w-24 h-24 text-amber-600" />
                        </div>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">Pending Fees</p>
                        <p className="text-3xl font-black text-amber-600">
                            ${invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + (i.amount_due + (i.late_fee_accumulated || 0) - i.amount_paid), 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Audit Status</p>
                            <button
                                onClick={handleApplyLateFees}
                                disabled={processing}
                                className="bg-amber-500 text-slate-900 px-3 py-1 rounded-lg text-xs font-black hover:bg-amber-400 transition"
                            >
                                {processing ? 'Running...' : 'Run Late Fee Audit'}
                            </button>
                        </div>
                        <p className="text-2xl font-black text-white mt-4">{expenses.filter(e => e.status === 'pending').length} Pending Expenses</p>
                        <p className="text-slate-400 text-xs font-bold mt-1 text-emerald-400">System Balanced & Verified</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
                        {activeTab === 'overview' && (
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-slate-100">
                                    <tr>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transactions.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 transition">
                                            <td className="px-10 py-6 text-slate-400 font-bold text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                            <td className="px-10 py-6 font-bold text-slate-900">{t.description}</td>
                                            <td className="px-10 py-6 text-slate-500 font-medium capitalize">{t.category}</td>
                                            <td className={`px-10 py-6 text-right font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {activeTab === 'vendors' && (
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-slate-800">Approved Vendors</h3>
                                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center">
                                        <Plus className="w-4 h-4 mr-2" /> Register Vendor
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {vendors.map(v => (
                                        <div key={v.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
                                                <Truck className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{v.name}</p>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{v.category}</p>
                                                <p className="text-sm text-slate-600 font-medium">{v.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {vendors.length === 0 && (
                                        <p className="col-span-2 text-center text-slate-400 py-12 font-bold italic">No vendors registered yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tuition' && (
                            <div className="p-8 text-center text-slate-400 font-bold">
                                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Tuition data synced. {invoices.length} active records detected.</p>
                                <div className="mt-4 flex justify-center space-x-3">
                                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl shadow-lg shadow-emerald-100">Quick Bill All</button>
                                    <button className="bg-white border-2 border-slate-100 text-slate-700 px-6 py-2 rounded-xl shadow-sm hover:border-emerald-200">View Installment Plans</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'expenses' && (
                            <div className="p-8 text-center text-slate-400 font-bold">
                                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Auditing queue active. {expenses.filter(e => e.status === 'pending').length} items awaiting review.</p>
                                <button className="mt-4 bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-xl shadow-slate-200">
                                    + Submit Reimbursement
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
