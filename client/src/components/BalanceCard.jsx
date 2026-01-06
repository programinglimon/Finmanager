import React from 'react';
import { FaWallet } from 'react-icons/fa';

import API_URL from '../config';

const BalanceCard = () => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const res = await fetch(`${API_URL}/api/business/balance`);
                const data = await res.json();
                setBalance(data.grandTotal);
                setLoading(false);
            } catch (err) { console.error(err); setLoading(false); }
        };
        fetchBalance();
    }, []);

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            boxShadow: '0 10px 20px rgba(30, 60, 114, 0.2)',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', opacity: 0.8 }}>
                    <FaWallet style={{ marginRight: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Business Total Balance</span>
                </div>
                <h2 style={{ fontSize: '32px', fontWeight: '700', margin: 0 }}>
                    {loading ? '...' : `৳ ${balance.toLocaleString()}`}
                </h2>
                <div style={{ marginTop: '12px', fontSize: '12px', opacity: 0.7 }}>
                    <span>Updated just now</span>
                </div>
            </div>

            {/* Decorative circles */}
            <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
            }} />
        </div>
    );
};

export default BalanceCard;
