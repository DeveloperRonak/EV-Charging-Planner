import React from 'react';
import { useNavigate } from 'react-router-dom';

const cardStyle = {
  flex: '1 1 30%',
  margin: '1rem',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'transform 0.3s ease',
};

const iconStyle = {
  fontSize: '4rem',
  marginBottom: '1rem',
  color: '#007bff',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'stretch',
  flexWrap: 'wrap',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const titleStyle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  marginBottom: '1rem',
  color: '#333',
};

const descriptionStyle = {
  fontSize: '1rem',
  color: '#666',
};

function Homepage() {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      title: 'Charging Status',
      description: 'View real-time status of nearby charging stations.',
      icon: '⚡',
      route: '/map',
    },
    {
      id: 2,
      title: 'Trip Planner',
      description: 'Plan your EV trips with optimal charging stops.',
      icon: '🗺️',
      route: '/planner',
    },
    {
      id: 3,
      title: 'Alerts',
      description: 'Get notified about important EV charging alerts.',
      icon: '🚨',
      route: '/alerts',
    },
  ];

  return (
    <>
      <h1 style={{ textAlign: 'center', margin: '2rem 0', color: '#1976d2' }}>
        EV Charging Planner Dashboard
      </h1>
      <div style={containerStyle}>
        {cards.map((card) => (
          <div
            key={card.id}
            style={cardStyle}
            onClick={() => navigate(card.route)}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(card.route); }}
            role="button"
            tabIndex={0}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
          >
            <div style={iconStyle}>{card.icon}</div>
            <div style={titleStyle}>{card.title}</div>
            <div style={descriptionStyle}>{card.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Homepage;
