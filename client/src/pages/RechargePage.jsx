import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaTimes, FaSimCard, FaBox } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const RechargePage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('SIM');
    const [sims, setSims] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form Data
    const [simForm, setSimForm] = useState({ name: '', number: '', balance: '', commission: '' });
    const [invForm, setInvForm] = useState({ name: '', category: 'Grameenphone', quantity: '', buyPrice: '', sellPrice: '' });

    const categories = ['Grameenphone', 'Robi', 'Airtel', 'Banglalink', 'Teletalk', 'Skitto', 'Other'];

    const [transData, setTransData] = useState({ id: null, action: '', amount: '', newBalance: '' });
    const [showTransModal, setShowTransModal] = useState(false);

    useEffect(() => {
        if (activeTab === 'SIM') fetchSims();
        else fetchInventory();
    }, [activeTab]);

    const fetchSims = async () => {
        try {
            const res = await fetch(`${API_URL}/api/recharge/sims`);
            setSims(await res.json());
        } catch (err) { console.error(err); }
    };

    const fetchInventory = async () => {
        try {
            const res = await fetch(`${API_URL}/api/recharge/inventory`);
            setInventory(await res.json());
        } catch (err) { console.error(err); }
    };

    const handleTransSubmit = async (e) => {
        e.preventDefault();
        try {
            const isSim = activeTab === 'SIM';
            const endpoint = isSim
                ? `sims/${transData.id}/transaction`
                : `inventory/${transData.id}/transaction`;

            const body = { action: transData.action };

            if (isSim) {
                if (transData.action === 'ADD_BALANCE') body.amount = transData.amount;
                if (transData.action === 'DAILY_UPDATE') body.newBalance = transData.newBalance;
            } else {
                if (transData.action === 'ADD_STOCK') body.quantity = transData.amount;
                if (transData.action === 'DAILY_UPDATE') body.newQuantity = transData.newBalance;
            }

            const res = await fetch(`${API_URL}/api/recharge/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowTransModal(false);
                isSim ? fetchSims() : fetchInventory();
            } else {
                const err = await res.json();
                alert(`Transaction Failed: ${err.message}`);
            }
        } catch (err) { console.error(err); }
    };

    const openTransModal = (sim, action) => {
        setTransData({ id: sim._id, action, amount: '', newBalance: '' });
        setShowTransModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isSim = activeTab === 'SIM';
        const endpoint = isSim ? 'sims' : 'inventory';
        const url = editingId
            ? `${API_URL}/api/recharge/${endpoint}/${editingId}`
            : `${API_URL}/api/recharge/${endpoint}`;

        const method = editingId ? 'PUT' : 'POST';
        const body = isSim
            ? { ...simForm, balance: Number(simForm.balance), commission: Number(simForm.commission) }
            : { ...invForm, quantity: Number(invForm.quantity), buyPrice: Number(invForm.buyPrice), sellPrice: Number(invForm.sellPrice) };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setShowModal(false);
                setEditingId(null);
                setSimForm({ name: '', number: '', balance: '', commission: '' });
                setInvForm({ name: '', category: 'Grameenphone', quantity: '', buyPrice: '', sellPrice: '' });
                isSim ? fetchSims() : fetchInventory();
            } else {
                alert('Failed to save');
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        const endpoint = activeTab === 'SIM' ? 'sims' : 'inventory';
        try {
            await fetch(`http://localhost:5000/api/recharge/${endpoint}/${id}`, { method: 'DELETE' });
            activeTab === 'SIM' ? fetchSims() : fetchInventory();
        } catch (err) { console.error(err); }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        if (activeTab === 'SIM') {
            setSimForm({ name: item.name, number: item.number, balance: item.balance, commission: item.commission || '' });
        } else {
            setInvForm({ name: item.name, quantity: item.quantity, buyPrice: item.buyPrice, sellPrice: item.sellPrice });
        }
        setShowModal(true);
    };

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
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}>
                    <FaArrowLeft />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a1a1a' }}>Recharge & Inventory</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#f0f0f0', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                {/* ... existing tabs code ... */}
                <button
                    onClick={() => setActiveTab('SIM')}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'SIM' ? 'white' : 'transparent', fontWeight: '600', color: activeTab === 'SIM' ? '#2196F3' : '#666', boxShadow: activeTab === 'SIM' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                >
                    SIM Balance
                </button>
                <button
                    onClick={() => setActiveTab('INVENTORY')}
                    style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'INVENTORY' ? 'white' : 'transparent', fontWeight: '600', color: activeTab === 'INVENTORY' ? '#2196F3' : '#666', boxShadow: activeTab === 'INVENTORY' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                >
                    Inventory
                </button>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {activeTab === 'SIM' ? (
                    <>
                        <div style={{ backgroundColor: '#2196F3', color: 'white', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)' }}>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Total Balance</div>
                            <div style={{ fontSize: '32px', fontWeight: 'bold' }}>৳ {sims.reduce((sum, sim) => sum + (sim.balance || 0), 0).toLocaleString()}</div>
                        </div>
                        {sims.map(sim => (
                            <div key={sim._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2196F3' }}><FaSimCard /></div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{sim.name}</h3>
                                            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>{sim.number}</p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>৳ {sim.balance}</div>
                                        <div style={{ fontSize: '12px', color: '#4CAF50' }}>Profit: {sim.dailyProfit ? sim.dailyProfit.toFixed(2) : 0}</div>
                                        {sim.commission > 0 && <div style={{ fontSize: '12px', color: '#666' }}>Comm: {sim.commission}/k</div>}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                    <button onClick={() => openTransModal(sim, 'ADD_BALANCE')} style={{ flex: 1, padding: '8px', backgroundColor: '#E3F2FD', color: '#1976D2', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add Balance</button>
                                    <button onClick={() => openTransModal(sim, 'DAILY_UPDATE')} style={{ flex: 1, padding: '8px', backgroundColor: '#E8F5E9', color: '#388E3C', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Daily Update</button>
                                    <button onClick={() => handleEdit(sim)} style={{ padding: '8px', color: '#666', background: 'none', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                                    <button onClick={() => handleDelete(sim._id)} style={{ padding: '8px', color: '#F44336', background: 'none', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    inventory.map(item => (
                        <div key={item._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#fff3e0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9800' }}><FaBox /></div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{item.name}</h3>
                                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#666' }}>qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: 'bold' }}>Profit: {item.dailyProfit ? item.dailyProfit.toFixed(2) : 0}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                <button onClick={() => openTransModal(item, 'ADD_STOCK')} style={{ flex: 1, padding: '8px', backgroundColor: '#FFF3E0', color: '#FF9800', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Add Stock</button>
                                <button onClick={() => openTransModal(item, 'DAILY_UPDATE')} style={{ flex: 1, padding: '8px', backgroundColor: '#E8F5E9', color: '#388E3C', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Daily Update</button>
                                <button onClick={() => handleEdit(item)} style={{ padding: '8px', color: '#666', background: 'none', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}><FaEdit /></button>
                                <button onClick={() => handleDelete(item._id)} style={{ padding: '8px', color: '#F44336', background: 'none', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' }}><FaTrash /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => { setEditingId(null); setSimForm({ name: '', number: '', balance: '', commission: '' }); setInvForm({ name: '', quantity: '', buyPrice: '', sellPrice: '' }); setShowModal(true); }}
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

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '414px', margin: '0 auto', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a1a' }}>{editingId ? 'Edit' : 'Add'} {activeTab === 'SIM' ? 'SIM' : 'Item'}</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f5f5f5', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#666', cursor: 'pointer' }}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {activeTab === 'SIM' ? (
                                <>
                                    <input placeholder="SIM Name" value={simForm.name} onChange={e => setSimForm({ ...simForm, name: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input placeholder="Number" value={simForm.number} onChange={e => setSimForm({ ...simForm, number: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="number" placeholder="Balance" value={simForm.balance} onChange={e => setSimForm({ ...simForm, balance: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    <input type="number" placeholder="Commission (per 1000)" value={simForm.commission} onChange={e => setSimForm({ ...simForm, commission: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                </>
                            ) : (
                                <>
                                    <input placeholder="Product Name" value={invForm.name} onChange={e => setInvForm({ ...invForm, name: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />

                                    <select value={invForm.category} onChange={e => setInvForm({ ...invForm, category: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' }}>
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>

                                    <input type="number" placeholder="Total Stock" value={invForm.quantity} onChange={e => setInvForm({ ...invForm, quantity: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input type="number" placeholder="Buy Price" value={invForm.buyPrice} onChange={e => setInvForm({ ...invForm, buyPrice: e.target.value })} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                        <input type="number" placeholder="Sell Price" value={invForm.sellPrice} onChange={e => setInvForm({ ...invForm, sellPrice: e.target.value })} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                                    </div>
                                </>
                            )}
                            <button type="submit" style={{ padding: '16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '8px' }}>Save</button>
                        </form>
                    </div>
                </div>
            )}
            {/* Transaction Modal */}
            {showTransModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '414px', margin: '0 auto', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a1a' }}>
                                {(transData.action === 'ADD_BALANCE' || transData.action === 'ADD_STOCK') ? 'Add Amount/Stock' : 'Daily Update'}
                            </h2>
                            <button onClick={() => setShowTransModal(false)} style={{ background: '#f5f5f5', border: 'none', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#666', cursor: 'pointer' }}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleTransSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(transData.action === 'ADD_BALANCE' || transData.action === 'ADD_STOCK') ? (
                                <input type="number" placeholder={transData.action === 'ADD_STOCK' ? "Enter Quantity" : "Enter Amount"} value={transData.amount} onChange={e => setTransData({ ...transData, amount: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            ) : (
                                <input type="number" placeholder={transData.action === 'ADD_STOCK' ? "Enter Closing Stock" : "Enter Closing Balance"} value={transData.newBalance} onChange={e => setTransData({ ...transData, newBalance: e.target.value })} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                            )}
                            <button type="submit" style={{ padding: '16px', backgroundColor: (transData.action === 'ADD_BALANCE' || transData.action === 'ADD_STOCK') ? '#2196F3' : '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', marginTop: '8px' }}>
                                Confirm
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RechargePage;
