import React, { useState, useEffect } from 'react';
import { FaUser, FaUserTie, FaArrowLeft, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const AccountPage = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState({
        Personal: { totalBalance: 0, totalDailyProfit: 0 },
        Agent: { totalBalance: 0, totalDailyProfit: 0 },
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${API_URL}/api/accounts/summary`);
                const data = await response.json();
                setSummary(data);
            } catch (error) {
                console.error('Error fetching account summary:', error);
            }
        };
        fetchSummary();
    }, []);


    const AccountCard = ({ title, icon, data, color, type, showManage }) => (
        <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        backgroundColor: `${color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                        fontSize: '24px'
                    }}>
                        {icon}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#333' }}>{title}</h3>
                </div>
                {showManage && (
                    <button
                        onClick={() => navigate(`/accounts/${type}`)}
                        style={{
                            backgroundColor: '#f0f0f0',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#666'
                        }}
                    >
                        <FaCog />
                    </button>
                )}
            </div>

            <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#666' }}>Total Balance</p>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#2c3e50' }}>
                    ৳ {data.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
            </div>

            <div style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '12px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#2e7d32' }}>Daily Profit</p>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#1b5e20' }}>
                    + ৳ {data.totalDailyProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '8px',
                        marginRight: '8px',
                        color: '#333'
                    }}
                >
                    <FaArrowLeft />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>Accounts</h1>
            </div>

            <AccountCard
                title="Personal Accounts"
                icon={<FaUser />}
                data={summary.Personal}
                color="#2196F3"
                type="Personal"
                showManage={true}
            />

            <AccountCard
                title="Agent Accounts"
                icon={<FaUserTie />}
                data={summary.Agent}
                color="#9C27B0"
                type="Agent"
                showManage={true}
            />
        </div>
    );
};

export default AccountPage;
