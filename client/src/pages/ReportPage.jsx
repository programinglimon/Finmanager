import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaChartPie, FaChartBar, FaCalendarCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const ReportPage = () => {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState({
        daily: {}, weekly: {}, monthly: {}, yearly: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch(`${API_URL}/api/reports/dashboard`);
                const result = await res.json();
                setReportData(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    if (!data) return <div style={{ padding: '20px' }}>Loading Reports...</div>;

    const sections = [
        { title: 'Today', data: data.daily, color: '#2196F3' },
        { title: 'Last 7 Days', data: data.weekly, color: '#FF9800' },
        { title: 'This Month', data: data.monthly, color: '#4CAF50' },
        { title: 'This Year', data: data.yearly, color: '#9C27B0' },
    ];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px', paddingBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}>
                    <FaArrowLeft />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>Business Reports</h1>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {sections.map((section, idx) => (
                    <div key={idx} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', borderBottom: `2px solid ${section.color}`, paddingBottom: '8px' }}>
                            <FaCalendarCheck style={{ color: section.color, marginRight: '8px' }} />
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{section.title}</h3>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {/* Sales */}
                            <div style={{ backgroundColor: '#E3F2FD', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#1565C0', marginBottom: '4px' }}>Sales</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1565C0' }}>৳ {section.data.totalSales.toLocaleString()}</div>
                            </div>

                            {/* Profit */}
                            <div style={{ backgroundColor: '#E8F5E9', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#2E7D32', marginBottom: '4px' }}>Profit</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2E7D32' }}>৳ {section.data.totalProfit.toLocaleString()}</div>
                            </div>

                            {/* Due Given */}
                            <div style={{ backgroundColor: '#FFEBEE', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#C62828', marginBottom: '4px' }}>Due Given</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#C62828' }}>৳ {section.data.totalDueGiven.toLocaleString()}</div>
                            </div>

                            {/* Deposit Received */}
                            <div style={{ backgroundColor: '#FFF3E0', padding: '12px', borderRadius: '8px' }}>
                                <div style={{ fontSize: '12px', color: '#EF6C00', marginBottom: '4px' }}>Collected</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#EF6C00' }}>৳ {section.data.totalDepositReceived.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReportPage;
