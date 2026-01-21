import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import {
    Package, Wrench, Plus,
    QrCode, AlertTriangle
} from 'lucide-react';

interface Asset {
    id: number;
    name: string;
    code: string;
    category: string;
    status: string;
    next_maintenance_date?: string;
    qr_code_data?: string;
}

export const AssetsPage: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [scannedAsset, setScannedAsset] = useState<Asset | null>(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/hr-ext/assets');
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Assets</h1>
                        <p className="text-slate-500 font-medium">Tracking QR-tagged hardware and maintenance schedules.</p>
                    </div>
                    <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center shadow-xl">
                        <Plus className="w-5 h-5 mr-2" /> New Asset
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {assets.map(asset => (
                            <div key={asset.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-200 hover:border-indigo-200 transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-12 -mt-12 rounded-full group-hover:bg-indigo-50 transition-colors" />
                                <QrCode className="absolute top-4 right-4 w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors" />

                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                    <Package className="w-7 h-7" />
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-1">{asset.name}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{asset.code}</p>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center text-slate-500 font-medium">
                                            <Wrench className="w-4 h-4 mr-2" /> Maintenance
                                        </div>
                                        <span className={`font-bold ${asset.next_maintenance_date ? 'text-rose-500' : 'text-slate-400'
                                            }`}>
                                            {asset.next_maintenance_date ? new Date(asset.next_maintenance_date).toLocaleDateString() : 'Not set'}
                                        </span>
                                    </div>
                                    {asset.next_maintenance_date && (
                                        <div className="bg-rose-50 p-3 rounded-2xl flex items-center text-rose-600 text-[10px] font-black uppercase tracking-tighter">
                                            <AlertTriangle className="w-4 h-4 mr-2" /> Maintenance Overdue
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex space-x-2">
                                    <button
                                        onClick={() => setScannedAsset(asset)}
                                        className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition"
                                    >
                                        Scan QR Tag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* QR Scanner Simulation Modal */}
                {scannedAsset && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <div className="bg-white rounded-[48px] max-w-md w-full p-10 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                            <div className="w-32 h-32 mx-auto mb-8 bg-slate-50 rounded-3xl p-4 flex items-center justify-center border-2 border-indigo-100 relative">
                                <QrCode className="w-full h-full text-slate-900" />
                                <div className="absolute inset-0 border-2 border-indigo-500 rounded-3xl animate-pulse scale-105 opacity-20" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Tag Verified</h2>
                            <p className="text-slate-500 font-medium mb-8">Asset ID: {scannedAsset.qr_code_data || scannedAsset.code}</p>

                            <div className="bg-slate-50 p-6 rounded-[32px] text-left mb-8">
                                <div className="flex justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Item</span>
                                    <span className="text-sm font-black text-slate-900">{scannedAsset.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                                    <span className="text-xs font-black text-emerald-600 uppercase">Live Tracking Active</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setScannedAsset(null)}
                                className="w-full bg-slate-900 text-white py-4 rounded-[24px] font-black uppercase tracking-widest hover:bg-slate-800 transition"
                            >
                                Close Scanner
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
