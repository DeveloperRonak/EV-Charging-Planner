import React, { useState } from 'react';

const AlertPage = () => {
  // Start with NO alerts
  const [alerts, setAlerts] = useState([]);
  
  // State for the Service Form
  const [serviceDate, setServiceDate] = useState('');
  const [serviceType, setServiceType] = useState('General Service');

  // Logic to add the reminder
  const handleAddReminder = () => {
    if (!serviceDate) {
      alert("Please select a date first!");
      return;
    }

    // 1. Calculate Date + 3 Months
    const date = new Date(serviceDate);
    date.setMonth(date.getMonth() + 3);
    const nextDueDate = date.toLocaleDateString();

    // 2. Create a new "Reminder" Object
    const newReminder = {
      id: Date.now(),
      priority: 'future', 
      title: `📅 Service Reminder Set`,
      // UPDATED: Removed the email text below
      message: `Reminder scheduled for ${nextDueDate} (${serviceType}).`,
      time: 'Just now',
      type: 'reminder'
    };

    // 3. Add to the list
    setAlerts([newReminder, ...alerts]);
  };

  return (
    <div style={{ background: '#f4f6f8', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. MAINTENANCE TRACKER BOX (Top) */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
        borderTop: '5px solid #28a745'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#28a745', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🔧 Schedule Next Service
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '15px' }}>
          Enter your last service date. We will auto-schedule a reminder for 3 months later.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          
          {/* Service Dropdown */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>SERVICE TYPE</label>
            <select 
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#f9f9f9' }}
            >
              <option>General Service</option>
              <option>Oil Change</option>
              <option>Tire Rotation</option>
              <option>Battery Checkup</option>
            </select>
          </div>

          {/* Date Picker */}
          <div style={{ flex: 1, minWidth: '150px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#555', display: 'block', marginBottom: '5px' }}>LAST SERVICE DATE</label>
            <input 
              type="date" 
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #ccc', background: '#f9f9f9' }} 
            />
          </div>

          {/* Action Button */}
          <button 
            onClick={handleAddReminder}
            style={{ 
              padding: '10px 20px', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              height: '40px'
            }}
          >
            Set Reminder
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATIONS SECTION (Bottom) */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>🔔 Notifications</h2>
          {alerts.length > 0 && (
            <button onClick={() => setAlerts([])} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              Clear All
            </button>
          )}
        </div>

        {/* Empty State */}
        {alerts.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#aaa', 
            background: 'white', 
            borderRadius: '12px',
            border: '2px dashed #ddd'
          }}>
            <p style={{ margin: 0 }}>No active reminders.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={{ 
                background: '#e3f2fd',
                padding: '15px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                display: 'flex',
                gap: '15px',
                borderLeft: '4px solid #007bff'
              }}>
                <div style={{ fontSize: '1.5rem', marginTop: '2px' }}>📅</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: '#333' }}>{alert.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>{alert.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AlertPage;