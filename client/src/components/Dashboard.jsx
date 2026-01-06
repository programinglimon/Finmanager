import React from 'react';
import { useNavigate } from 'react-router-dom';
import BalanceCard from './BalanceCard';
import MenuCard from './MenuCard';
import { FaWallet, FaUserFriends, FaHandHoldingUsd, FaHistory, FaCalculator, FaCog, FaMobileAlt, FaChartLine, FaFileAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const Dashboard = () => {
    const navigate = useNavigate();
    const menuItems = [
        { title: 'Profit', icon: <FaChartLine />, color: '#4CAF50', path: '/profit' },
        { title: 'Report', icon: <FaFileAlt />, color: '#2196F3', path: '/report' },
        { title: 'Account', icon: <FaUserFriends />, color: '#9C27B0', path: '/accounts' },
        { title: 'Recharge', icon: <FaMobileAlt />, color: '#FF9800', path: '/recharge' },
        { title: 'Cash', icon: <FaMoneyBillWave />, color: '#00BCD4', path: '/cash' },
        { title: 'Due Deposit', icon: <FaClock />, color: '#F44336', path: '/due' },
    ];

    return (
        <div style={{ padding: '20px', paddingBottom: '40px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>FinManager</h1>
                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>Welcome back,</p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0' }}></div>
            </div>

            <BalanceCard />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginTop: '10px'
            }}>
                {menuItems.map((item, index) => (
                    <MenuCard
                        key={index}
                        title={item.title}
                        icon={item.icon}
                        color={item.color}
                        onClick={() => item.path ? navigate(item.path) : console.log(`Clicked ${item.title} `)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
