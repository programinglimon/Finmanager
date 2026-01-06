import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const ProfitPage = () => {
    const navigate = useNavigate();
    const [profitData, setProfitData] = useState({ total: 0, breakdown: [] });
    const [range, setRange] = useState('daily');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfit = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/profit/report?range=${range}`);
                setProfitData(await res.json());
            } catch (err) { console.error(err); } finally {
                setLoading(false);
            }
        };
        fetchProfit();
    }, [range]);

    const filters = [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'All', value: 'all' },
    ];

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fafafa', padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}>
                    <FaArrowLeft />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>Profit Report</h1>
                </div>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
                {filters.map(f => (
                    <button
                        key={f.value}
                        onClick={() => setRange(f.value)}
                        style={{
                            padding: '8px 16px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap',
                            backgroundColor: range === f.value ? '#2196F3' : '#e0e0e0',
                            color: range === f.value ? 'white' : '#333',
                            fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Total Profit Card */}
            <div style={{ backgroundColor: '#2196F3', color: 'white', padding: '24px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)' }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Total Profit ({range})</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold' }}>৳ {data.total.toLocaleString()}</div>
            </div>

            {/* Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>SIM</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#FF9800' }}>{data.sim}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Inventory</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4CAF50' }}>{data.inventory}</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Account</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#9C27B0' }}>{data.account}</div>
                </div>
            </div>

            {/* History List */}
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }}>History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.history.map(item => (
                    <div key={item._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            backgroundColor: item.source === 'SIM' ? '#FFF3E0' : item.source === 'INVENTORY' ? '#E8F5E9' : '#F3E5F5',
                            color: item.source === 'SIM' ? '#FF9800' : item.source === 'INVENTORY' ? '#4CAF50' : '#9C27B0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'
                        }}>
                            <FaChartLine />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>{item.description || item.source}</div>
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{new Date(item.date).toLocaleDateString()}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#4CAF50' }}>+ ৳ {item.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfitPage;
