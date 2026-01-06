import React, { useEffect, useState } from 'react';

const ItemList = ({ items, onItemDeleted }) => {
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/items/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onItemDeleted(id);
            } else {
                console.error('Failed to delete item');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h3>Item List</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {items.map((item) => (
                    <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                        <div>
                            <strong>{item.name}</strong>
                            <p style={{ margin: '5px 0 0', color: '#666', fontSize: '0.9em' }}>{item.description}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(item._id)}
                            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {items.length === 0 && <p>No items found.</p>}
        </div>
    );
};

export default ItemList;
