import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaMoneyBillWave, FaPlus, FaMinus, FaHistory, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const CashPage = () => {
    const navigate = useNavigate();
    const [cashAccount, setCashAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [transType, setTransType] = useState('IN'); // 'IN', 'OUT', 'UPDATE'
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    // Expense History State
    const [range, setRange] = useState('daily');
    const [expenseData, setExpenseData] = useState({ total: 0, history: [] });

    useEffect(() => {
        fetchCashAccount();
        fetchExpenses();
    }, [range]); // Refresh expenses when range changes

    const fetchCashAccount = async () => {
        try {
            const res = await fetch(`${API_URL}/api/accounts?type=Cash`);
            const accounts = await res.json();
            if (accounts.length > 0) setCashAccount(accounts[0]);
            else createDefaultCashAccount();
            setLoading(false);
        } catch (err) { console.error(err); setLoading(false); }
    };

    const fetchExpenses = async () => {
        try {
            const res = await fetch(`${API_URL}/api/expenses?range=${range}`);
            setExpenseData(await res.json());
        } catch (err) { console.error(err); }
    };

    const createDefaultCashAccount = async () => {
        try {
            const res = await fetch(`${API_URL}/api/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Main Cash Drawer', type: 'Cash', balance: 0 })
            });
            setCashAccount(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        if (!cashAccount) return;

        let action, body;

        if (transType === 'UPDATE') {
            action = 'DAILY_UPDATE';
            body = { action, newBalance: amount };
        } else {
            action = transType === 'IN' ? 'CASH_IN' : 'CASH_OUT';
            body = { action, amount: Number(amount), note };
        }

        try {
            const res = await fetch(`${API_URL}/api/accounts/${cashAccount._id}/transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                setAmount('');
                setNote('');
                fetchCashAccount();
                fetchExpenses(); // Refresh lists
            }
        } catch (err) { console.error(err); }
    };

    const filters = [
        { label: 'Today', value: 'daily' },
        { label: 'This Week', value: 'weekly' },
        { label: 'This Month', value: 'monthly' },
        { label: 'This Year', value: 'yearly' },
    ];

    if (loading) return <div style={{ padding: '20px' }}>Loading Cash Account...</div>;

    const modalTitle = transType === 'IN' ? 'Add Income' : transType === 'OUT' ? 'Add Expense' : 'Update Balance';
    const modalColor = transType === 'IN' ? '#00BCD4' : transType === 'OUT' ? '#F44336' : '#FF9800';

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#fafafa', padding: '20px', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}>
                    <FaArrowLeft />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>Cash & Expenses</h1>
                </div>
            </div>

            {/* Cash Card */}
            <div style={{
                background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
                borderRadius: '20px', padding: '32px', color: 'white', textAlign: 'center',
                boxShadow: '0 8px 16px rgba(0, 188, 212, 0.3)', marginBottom: '32px', position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>Current Cash in Hand</div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '16px' }}>৳ {cashAccount?.balance.toLocaleString()}</div>

                <button
                    onClick={() => { setTransType('UPDATE'); setShowModal(true); setAmount(cashAccount?.balance); }}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.4)',
                        borderRadius: '20px', padding: '8px 16px', fontSize: '14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px', backdropFilter: 'blur(5px)'
                    }}
                >
                    <FaEdit /> Daily Update
                </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <button
                    onClick={() => { setTransType('IN'); setShowModal(true); setAmount(''); }}
                    style={{ flex: 1, padding: '16px', backgroundColor: '#E0F7FA', color: '#006064', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <FaPlus /> Income
                </button>
                <button
                    onClick={() => { setTransType('OUT'); setShowModal(true); setAmount(''); }}
                    style={{ flex: 1, padding: '16px', backgroundColor: '#FFEBEE', color: '#C62828', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <FaMinus /> Expense
                </button>
            </div>

            {/* Expense History Section */}
            <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaHistory style={{ color: '#666', marginRight: '8px' }} />
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Expense History</h3>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px' }}>
                    {filters.map(f => (
                        <button
                            key={f.value}
                            onClick={() => setRange(f.value)}
                            style={{
                                padding: '8px 16px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap',
                                backgroundColor: range === f.value ? '#F44336' : '#e0e0e0',
                                color: range === f.value ? 'white' : '#333',
                                fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Total Expense Summary */}
                <div style={{ backgroundColor: '#FFEBEE', padding: '16px', borderRadius: '12px', marginBottom: '16px', borderLeft: '4px solid #D32F2F' }}>
                    <div style={{ fontSize: '14px', color: '#D32F2F' }}>Total Expense ({filters.find(f => f.value === range)?.label})</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D32F2F' }}>৳ {expenseData.total.toLocaleString()}</div>
                </div>

                {/* Expense List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {expenseData.history.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No expenses found</div>
                    ) : (
                        expenseData.history.map(item => (
                            <div key={item._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#333' }}>{item.description || 'Expense'}</div>
                                    <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{new Date(item.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontWeight: 'bold', color: '#F44336' }}>- ৳ {item.amount.toLocaleString()}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', margin: '0 auto', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slideUp 0.3s ease-out' }}>
                        <h2 style={{ margin: '0 0 24px', fontSize: '20px', color: modalColor }}>
                            {modalTitle}
                        </h2>
                        <form onSubmit={handleTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input
                                type="number"
                                placeholder={transType === 'UPDATE' ? "Enter New Balance" : "Amount"}
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                style={{ padding: '16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '18px' }}
                                autoFocus
                            />
                            {transType !== 'UPDATE' && (
                                <input
                                    placeholder={transType === 'IN' ? "Source (e.g., Opening Balance)" : "Purpose (e.g., Shop Rent, Food)"}
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                    required
                                    style={{ padding: '16px', borderRadius: '12px', border: '1px solid #ddd' }}
                                />
                            )}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '16px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '16px', backgroundColor: modalColor, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{transType === 'UPDATE' ? 'Update Balance' : 'Confirm'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashPage;
