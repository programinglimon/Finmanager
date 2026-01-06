import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaSearch, FaUser, FaPhone, FaHandHoldingUsd, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const DuePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('DUE'); // 'DUE' or 'DEPOSIT'
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', initialBalance: '' });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/customers`);
            setCustomers(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Logic: If adding in DEPOSIT tab, balance should be negative (Advance)
            // If adding in DUE tab, balance should be positive (Due)
            let balance = 0;
            if (formData.initialBalance) {
                if (activeTab === 'DEPOSIT') {
                    // Start as negative for 'Deposit/Advance'
                    balance = -Math.abs(Number(formData.initialBalance));
                } else {
                    // Start as positive for 'Due'
                    balance = Math.abs(Number(formData.initialBalance));
                }
            }

            const res = await fetch(`${API_URL}/api/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, initialBalance: balance })
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({ name: '', phone: '', address: '', initialBalance: '' });
                fetchCustomers();
            }
        } catch (err) { console.error(err); }
    };

    // Filter customers based on balance
    // Due Tab: Balance >= 0 (Positive means they owe us)
    // Deposit Tab: Balance < 0 (Negative means we owe them/advance)
    const filteredCustomers = customers.filter(c => {
        if (activeTab === 'DUE') return c.balance >= 0;
        return c.balance < 0;
    });

    const totalAmount = filteredCustomers.reduce((sum, c) => sum + Math.abs(c.balance), 0);

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fafafa', position: 'relative' }}>
            <div style={{ padding: '20px', paddingBottom: '80px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}>
                        <FaArrowLeft />
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>Due & Deposit</h1>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', backgroundColor: '#e0e0e0', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setActiveTab('DUE')}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'DUE' ? 'white' : 'transparent', fontWeight: '600', color: activeTab === 'DUE' ? '#F44336' : '#666', boxShadow: activeTab === 'DUE' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Due List
                    </button>
                    <button
                        onClick={() => setActiveTab('DEPOSIT')}
                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'DEPOSIT' ? 'white' : 'transparent', fontWeight: '600', color: activeTab === 'DEPOSIT' ? '#4CAF50' : '#666', boxShadow: activeTab === 'DEPOSIT' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                        Deposit List
                    </button>
                </div>

                {/* Total Summary Card */}
                <div style={{
                    backgroundColor: activeTab === 'DUE' ? '#FFEBEE' : '#E8F5E9',
                    color: activeTab === 'DUE' ? '#D32F2F' : '#388E3C',
                    padding: '24px', borderRadius: '16px', marginBottom: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Total {activeTab === 'DUE' ? 'You Get (Due)' : 'You Owe (Advance)'}</div>
                        <div style={{ fontSize: '36px', fontWeight: 'bold' }}>৳ {totalAmount.toLocaleString()}</div>
                    </div>
                    <div style={{ fontSize: '40px', opacity: 0.2 }}>
                        {activeTab === 'DUE' ? <FaHandHoldingUsd /> : <FaMoneyBillWave />}
                    </div>
                </div>

                {/* Customer List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredCustomers.map(customer => (
                        <div
                            key={customer._id}
                            onClick={() => navigate(`/due/${customer._id}`)}
                            style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                        >
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '20px', marginRight: '16px' }}>
                                <FaUser />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '16px', color: '#1a1a1a' }}>{customer.name}</h3>
                                {customer.phone && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><FaPhone size={10} /> {customer.phone}</div>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: customer.balance >= 0 ? '#F44336' : '#4CAF50' }}>৳ {Math.abs(customer.balance)}</div>
                                <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{customer.balance >= 0 ? 'Due' : 'Adv'}</div>
                            </div>
                        </div>
                    ))}
                    {filteredCustomers.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#999', marginTop: '40px', padding: '20px' }}>
                            <p>No customers in {activeTab === 'DUE' ? 'Due' : 'Deposit'} list.</p>
                        </div>
                    )}
                </div>

                {/* FAB */}
                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        position: 'fixed', bottom: '24px', right: '50%', transform: 'translateX(180px)', // Centered container logic
                        width: '56px', height: '56px', borderRadius: '50%',
                        backgroundColor: activeTab === 'DUE' ? '#F44336' : '#4CAF50', color: 'white', border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer', zIndex: 100
                    }}
                >
                    <FaPlus />
                </button>
                {/* Mobile fallback for FAB if screen is small */}
                <style>{`
                    @media (max-width: 480px) {
                        button[style*="transform: translateX(180px)"] {
                            right: 24px !important;
                            transform: none !important;
                        }
                    }
                `}</style>


                {/* Add Customer Modal */}
                {showModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
                        <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', margin: '0 auto', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slideUp 0.3s ease-out' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{ margin: 0, fontSize: '20px', color: activeTab === 'DUE' ? '#F44336' : '#4CAF50' }}>
                                    {activeTab === 'DUE' ? 'Add Due Customer' : 'Add Deposit Customer'}
                                </h2>
                            </div>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input placeholder="Customer Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input placeholder="Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                <input type="number" placeholder="Initial Balance (Optional)" value={formData.initialBalance} onChange={e => setFormData({ ...formData, initialBalance: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />

                                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                                    <button type="submit" style={{ flex: 1, padding: '16px', backgroundColor: activeTab === 'DUE' ? '#F44336' : '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Add Customer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DuePage;
