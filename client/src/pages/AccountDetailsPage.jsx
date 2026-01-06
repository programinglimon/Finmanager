import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AccountDetailsPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [selectedTab, setSelectedTab] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [showTransModal, setShowTransModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        provider: 'Bkash',
        commission: '',
        balance: '',
        dailyProfit: 0
    });
    const [transData, setTransData] = useState({
        accountId: '',
        action: 'CASH_IN',
        amount: '',
        newBalance: '',
        newProfit: ''
    });
    const [editingId, setEditingId] = useState(null);

    const providers = ['Bkash', 'Nagad', 'Rocket', 'Mcash', 'Upay', 'Tap'];

    // Define Tabs based on type? Or generic?
    const tabs = ['All', 'Bkash', 'Nagad', 'Rocket', 'Mcash', 'Upay', 'Tap', 'Other'];

    // Conditional Actions based on Type
    const getActions = () => {
        if (type === 'Personal') {
            return [
                { label: 'Cash In', value: 'CASH_IN', color: '#4CAF50' },
                { label: 'Send Money', value: 'SEND_MONEY', color: '#F44336' },
                { label: 'Update', value: 'DAILY_UPDATE', color: '#9C27B0' },
            ];
        } else {
            return [
                { label: 'Cash In', value: 'CASH_IN', color: '#4CAF50' },
                { label: 'Cash Out', value: 'CASH_OUT', color: '#F44336' },
                { label: 'DSO In', value: 'DSO_IN', color: '#2196F3' },
                { label: 'DSO Out', value: 'DSO_OUT', color: '#FF9800' },
                { label: 'Update', value: 'DAILY_UPDATE', color: '#9C27B0' },
            ];
        }
    };

    const actions = getActions();

    useEffect(() => {
        fetchAccounts();
        setSelectedTab('All');
    }, [type]);

    useEffect(() => {
        if (selectedTab === 'All') {
            setFilteredAccounts(accounts);
        } else {
            setFilteredAccounts(accounts.filter(acc => acc.provider === selectedTab));
        }
    }, [accounts, selectedTab]);

    const fetchAccounts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/accounts?type=${type}`);
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTransChange = (e) => {
        setTransData({ ...transData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId
            ? `${API_URL}/api/accounts/${editingId}`
            : `${API_URL}/api/accounts`;

        const method = editingId ? 'PUT' : 'POST';
        const body = {
            ...formData,
            type,
            commission: Number(formData.commission) || 0,
            balance: Number(formData.balance) || 0
        };

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                setShowModal(false);
                setEditingId(null);
                setFormData({ name: '', number: '', provider: 'Bkash', commission: '', balance: '' });
                fetchAccounts();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error saving account:', error);
            alert('Failed to save account. Please try again.');
        }
    };

    const handleTransSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/accounts/${transData.accountId}/transaction`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transData),
            });

            if (response.ok) {
                setShowTransModal(false);
                setTransData({ accountId: '', action: 'CASH_IN', amount: '', newBalance: '', newProfit: '' });
                fetchAccounts();
            } else {
                const errorData = await response.json();
                alert(`Transaction failed: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error processing transaction:', error);
            alert('Transaction failed. Check console for details.');
        }
    };

    const handleEdit = (account) => {
        setEditingId(account._id);
        setFormData({
            name: account.name,
            number: account.number || '',
            provider: account.provider || 'Bkash',
            commission: account.commission || '',
            balance: account.balance
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        try {
            await fetch(`http://localhost:5000/api/accounts/${id}`, { method: 'DELETE' });
            fetchAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const openTransModal = (account, action = 'CASH_IN') => {
        setTransData({
            accountId: account._id,
            action,
            amount: '',
            newBalance: account.balance,
            newProfit: account.dailyProfit
        });
        setShowTransModal(true);
    };

    const totalBalance = filteredAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

    return (
        <div style={{
            padding: '20px',
            paddingBottom: '20px',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button
                    onClick={() => navigate('/accounts')}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>{type} Accounts</h1>
                    <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>Total: ৳ {totalBalance.toLocaleString()}</p>
                </div>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                marginBottom: '16px',
                paddingBottom: '8px',
                scrollbarWidth: 'none'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: 'none',
                            backgroundColor: selectedTab === tab ? '#2196F3' : '#f0f0f0',
                            color: selectedTab === tab ? 'white' : '#666',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {filteredAccounts.map(account => (
                    <div key={account._id} style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '16px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', color: '#333' }}>{account.provider}</span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>({account.number})</span>
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
                                    ৳ {account.balance.toLocaleString()}
                                </div>
                                {account.commission > 0 && (
                                    <div style={{ fontSize: '12px', color: '#4CAF50', marginTop: '2px' }}>
                                        Comm: {account.commission} per k
                                    </div>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEdit(account)} style={{ padding: '8px', border: 'none', background: '#e3f2fd', color: '#2196F3', borderRadius: '8px', cursor: 'pointer' }}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(account._id)} style={{ padding: '8px', border: 'none', background: '#ffebee', color: '#F44336', borderRadius: '8px', cursor: 'pointer' }}>
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {actions.map(action => (
                                <button
                                    key={action.value}
                                    onClick={() => openTransModal(account, action.value)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        fontSize: '12px',
                                        background: `${action.color}15`,
                                        color: action.color,
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {filteredAccounts.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>No accounts found for {selectedTab}.</p>}
            </div>

            {/* FAB */}
            <button
                onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', number: '', provider: 'Bkash', commission: '', balance: '' });
                    setShowModal(true);
                }}
                style={{
                    position: 'sticky',
                    bottom: '24px',
                    alignSelf: 'flex-end',
                    marginTop: 'auto',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 100
                }}
            >
                <FaPlus />
            </button>

            {/* Account Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        width: '100%',
                        maxWidth: '414px',
                        margin: '0 auto',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '24px',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px' }}>{editingId ? 'Edit Account' : 'Add New Account'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}><FaTimes /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input name="name" placeholder="Account Name" value={formData.name} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
                            <select name="provider" value={formData.provider} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: 'white' }}>
                                {providers.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <input name="number" placeholder="Phone Number" value={formData.number} onChange={handleInputChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
                            <input name="commission" type="number" step="0.01" placeholder="Commission (per 1000)" value={formData.commission} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />
                            <input name="balance" type="number" placeholder="Initial Balance" value={formData.balance} onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }} />

                            <button type="submit" style={{ padding: '16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', marginTop: '8px', cursor: 'pointer' }}>
                                {editingId ? 'Update Account' : 'Add Now'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Transaction Modal */}
            {showTransModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        width: '100%',
                        maxWidth: '414px',
                        margin: '0 auto',
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '24px',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px' }}>
                                {actions.find(a => a.value === transData.action)?.label}
                            </h2>
                            <button onClick={() => setShowTransModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}><FaTimes /></button>
                        </div>

                        <form onSubmit={handleTransSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Hidden input or just implicit state for action */}

                            {transData.action === 'DAILY_UPDATE' ? (
                                <>
                                    <input
                                        name="newBalance"
                                        type="number"
                                        placeholder="New Balance"
                                        value={transData.newBalance}
                                        onChange={handleTransChange}
                                        required
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                                    />
                                    <input
                                        name="newProfit"
                                        type="number"
                                        placeholder="New Daily Profit"
                                        value={transData.newProfit}
                                        onChange={handleTransChange}
                                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                                    />
                                </>
                            ) : (
                                <input
                                    name="amount"
                                    type="number"
                                    placeholder="Amount"
                                    value={transData.amount}
                                    onChange={handleTransChange}
                                    required
                                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                                />
                            )}

                            <button type="submit" style={{
                                padding: '16px',
                                backgroundColor: actions.find(a => a.value === transData.action)?.color,
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                marginTop: '8px',
                                cursor: 'pointer'
                            }}>
                                Confirm {actions.find(a => a.value === transData.action)?.label}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountDetailsPage;
