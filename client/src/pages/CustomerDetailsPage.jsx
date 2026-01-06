import API_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPhone, FaMapMarkerAlt, FaPlus, FaMinus, FaTrash, FaPen } from 'react-icons/fa';

const CustomerDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [modal, setModal] = useState({ show: false, type: '' }); // type: 'GIVE' | 'TAKE'
    const [formData, setFormData] = useState({ amount: '', note: '', date: new Date().toISOString().split('T')[0] });

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await fetch(`${API_URL}/api/customers/${id}`);
            const data = await res.json();
            setCustomer(data.customer);
            // The original API endpoint `http://localhost:5000/api/customers/${id}` returns both customer and transactions.
            // The instruction implies a separate call for transactions, but the current backend structure might not support it directly.
            // Assuming the existing endpoint still returns transactions along with customer data.
            // If the backend changes to separate endpoints, this part would need adjustment.
            setTransactions(data.transactions);
        } catch (err) { console.error(err); }
    };

    const handleTransaction = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/customers/${id}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: modal.type })
            });
            if (res.ok) {
                setModal({ show: false, type: '' });
                setFormData({ amount: '', note: '', date: new Date().toISOString().split('T')[0] });
                fetchDetails();
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteTransaction = async (txnId) => {
        if (!window.confirm('Delete this transaction? Balance will be reverted.')) return;
        try {
            const res = await fetch(`${API_URL}/api/customers/${id}/transactions/${txnId}`, {
                method: 'DELETE'
            });
            if (res.ok) fetchDetails();
        } catch (err) { console.error(err); }
    };

    if (!customer) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/due')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '8px', marginRight: '8px', color: '#333' }}>
                    <FaArrowLeft />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1a1a1a' }}>{customer.name}</h1>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {customer.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaPhone /> {customer.phone}</span>}
                        {customer.address && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaMapMarkerAlt /> {customer.address}</span>}
                    </div>
                </div>
            </div>

            {/* Current Balance Card */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Current Balance</div>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: customer.balance >= 0 ? '#F44336' : '#4CAF50' }}>
                    {customer.balance >= 0 ? `To Pay: ৳ ${customer.balance}` : `Advance: ৳ ${Math.abs(customer.balance)}`}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    {customer.balance >= 0 ? '(You will get)' : '(You owe)'}
                </div>
            </div>

            {/* Transaction List */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>Transaction History</h3>
                {transactions.map(txn => (
                    <div key={txn._id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: txn.type === 'GIVE' ? '#F44336' : '#4CAF50' }}>
                                {txn.type === 'GIVE' ? 'Given (Due)' : 'Received (Deposit)'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                {new Date(txn.date).toLocaleDateString()} {txn.note && `• ${txn.note}`}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>৳ {txn.amount}</div>
                            <button onClick={() => handleDelete(txn._id)} style={{ padding: '4px', color: '#ccc', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}><FaTrash size={12} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons (Footer) */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px', backgroundColor: 'white', boxShadow: '0 -4px 12px rgba(0,0,0,0.05)', display: 'flex', gap: '12px' }}>
                <button
                    onClick={() => setModal({ show: true, type: 'GIVE' })}
                    style={{ flex: 1, padding: '16px', backgroundColor: '#FFEBEE', color: '#D32F2F', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <FaMinus /> GIVEN (DUE)
                </button>
                <button
                    onClick={() => setModal({ show: true, type: 'TAKE' })}
                    style={{ flex: 1, padding: '16px', backgroundColor: '#E8F5E9', color: '#388E3C', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <FaPlus /> RECEIVED
                </button>
            </div>

            {/* Transaction Modal */}
            {modal.show && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '414px', margin: '0 auto', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px', animation: 'slideUp 0.3s ease-out' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', color: modal.type === 'GIVE' ? '#D32F2F' : '#388E3C' }}>
                                {modal.type === 'GIVE' ? 'Add Due Entry' : 'Add Deposit Entry'}
                            </h2>
                        </div>
                        <form onSubmit={handleTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required autoFocus style={{ padding: '16px', fontSize: '24px', borderRadius: '12px', border: '1px solid #ddd', textAlign: 'center' }} />
                            <input type="text" placeholder="Note (Optional)" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }} />
                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ padding: '12px', borderRadius: '12px', border: '1px solid #ddd' }} />

                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={() => setModal({ show: false, type: '' })} style={{ flex: 1, padding: '16px', backgroundColor: '#f5f5f5', color: '#666', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '16px', backgroundColor: modal.type === 'GIVE' ? '#F44336' : '#4CAF50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDetailsPage;
