import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
    Wallet, Receipt, GraduationCap,
    Plus, Truck, CreditCard, DollarSign, X
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
    fee_structure_id?: number;
    amount_due: number;
    amount_paid: number;
    late_fee_accumulated: number;
    status: string;
    due_date: string;
    student?: {
        full_name: string;
        matricule?: string;
    };
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

interface Student {
    id: number;
    full_name: string;
    matricule?: string;
}

export const FinancePage: React.FC = () => {
    const { user } = useAuth();
    const userRole = (user as any)?.role?.name || 'Student';
    const isFinAdmin = ['Super Admin', 'Administrator', 'Staff'].includes(userRole);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'tuition' | 'expenses' | 'vendors'>('overview');
    const [processing, setProcessing] = useState(false);

    // Modals
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    // Form Data
    const [invoiceForm, setInvoiceForm] = useState({
        student_id: '',
        amount_due: '',
        due_date: new Date().toISOString().split('T')[0]
    });
    const [paymentAmount, setPaymentAmount] = useState('');

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        if (!isFinAdmin) {
            setLoading(false);
            return;
        }
        try {
            const [tRes, iRes, eRes, vRes, sRes] = await Promise.all([
                api.get('/finance/'),
                api.get('/tuition-invoices/'),
                api.get('/expenses/'),
                api.get('/finance-ext/vendors'),
                api.get('/students/')
            ]);
            setTransactions(tRes.data);
            setInvoices(iRes.data);
            setExpenses(eRes.data);
            setVendors(vRes.data);
            setStudents(sRes.data);
        } catch (error) {
            console.error('Error fetching finance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await api.post('/tuition-invoices/', {
                student_id: parseInt(invoiceForm.student_id),
                amount_due: parseFloat(invoiceForm.amount_due),
                due_date: invoiceForm.due_date,
                status: 'unpaid'
            });
            setShowInvoiceModal(false);
            setInvoiceForm({ student_id: '', amount_due: '', due_date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('Failed to create invoice');
        } finally {
            setProcessing(false);
        }
    };

    const handleRecordPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice) return;
        setProcessing(true);
        try {
            await api.post(`/tuition-invoices/${selectedInvoice.id}/pay`, null, {
                params: { amount: parseFloat(paymentAmount) }
            });
            setShowPaymentModal(false);
            setPaymentAmount('');
            setSelectedInvoice(null);
            fetchData();
        } catch (error) {
            console.error('Error recording payment:', error);
            alert('Failed to record payment');
        } finally {
            setProcessing(false);
        }
    };

    const handleApplyLateFees = async () => {
        if (!isFinAdmin) return;
        setProcessing(true);
        try {
            const res = await api.post('/finance/apply-late-fees');
            alert(`Applied late fees to ${res.data.affected} invoices.`);
            fetchData();
        } catch (error) {
            console.error('Error applying late fees:', error);
        } finally {
            setProcessing(false);
        }
    };

    const getStudentName = (id: number) => {
        const student = students.find(s => s.id === id);
        return student ? `${student.full_name} (${student.matricule || 'N/A'})` : `ID: ${id}`;
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
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
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

                        {activeTab === 'tuition' && (
                            <div className='p-6'>
                                <div className="flex justify-between items-center mb-6 px-4">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800">Tuition Invoices</h3>
                                        <p className="text-slate-500 text-sm">Manage student billing and payments</p>
                                    </div>
                                    <button
                                        onClick={() => setShowInvoiceModal(true)}
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center hover:bg-emerald-700 transition"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Create Invoice
                                    </button>
                                </div>

                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Due</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                                                <td className="px-6 py-4 font-mono text-xs text-slate-400">#INV-{inv.id}</td>
                                                <td className="px-6 py-4 font-bold text-slate-900">{getStudentName(inv.student_id)}</td>
                                                <td className="px-6 py-4 text-slate-600">{new Date(inv.due_date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-black text-slate-800">${(inv.amount_due + (inv.late_fee_accumulated || 0)).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-emerald-600 font-bold">${inv.amount_paid.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                            inv.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {inv.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {inv.status !== 'paid' && (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedInvoice(inv);
                                                                setPaymentAmount(String((inv.amount_due + (inv.late_fee_accumulated || 0) - inv.amount_paid)));
                                                                setShowPaymentModal(true);
                                                            }}
                                                            className="text-emerald-600 hover:text-emerald-800 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg"
                                                        >
                                                            Record Payment
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {invoices.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                                    No invoices found. Create one to get started.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Create Invoice Modal */}
                {showInvoiceModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-black text-slate-800">New Tuition Invoice</h3>
                                <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleCreateInvoice} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Student</label>
                                    <select
                                        className="w-full p-2 border border-slate-200 rounded-lg"
                                        value={invoiceForm.student_id}
                                        onChange={e => setInvoiceForm({ ...invoiceForm, student_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Student...</option>
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>{s.full_name} ({s.matricule || 'No ID'})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Amount Due ($)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-slate-200 rounded-lg"
                                        value={invoiceForm.amount_due}
                                        onChange={e => setInvoiceForm({ ...invoiceForm, amount_due: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-2 border border-slate-200 rounded-lg"
                                        value={invoiceForm.due_date}
                                        onChange={e => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition"
                                >
                                    {processing ? 'Creating...' : 'Issue Invoice'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Payment Modal */}
                {showPaymentModal && selectedInvoice && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-black text-slate-800">Record Payment</h3>
                                <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="mb-4 bg-slate-50 p-4 rounded-xl">
                                <p className="text-sm text-slate-500">Invoice #{selectedInvoice.id} for <span className="font-bold">{getStudentName(selectedInvoice.student_id)}</span></p>
                                <p className="text-sm text-slate-500">Total Outstanding: <span className="font-black text-slate-900">${(selectedInvoice.amount_due + (selectedInvoice.late_fee_accumulated || 0) - selectedInvoice.amount_paid).toLocaleString()}</span></p>
                            </div>
                            <form onSubmit={handleRecordPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Payment Amount ($)</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-slate-200 rounded-lg"
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition"
                                >
                                    {processing ? 'Processing...' : 'Confirm Payment'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
