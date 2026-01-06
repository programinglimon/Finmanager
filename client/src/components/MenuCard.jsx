import React from 'react';

const MenuCard = ({ title, icon, color, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                height: '100%',
                aspectRatio: '1',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: `${color}15`, // 15% opacity of the color
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: color,
                fontSize: '24px'
            }}>
                {icon}
            </div>
            <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                textAlign: 'center'
            }}>
                {title}
            </span>
        </div>
    );
};

export default MenuCard;
