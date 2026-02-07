import React, { useState } from 'react';

// 1. DATASET WITH COORDINATES
const indianCities = [
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Thane", lat: 19.2183, lng: 72.9781 }
];

// 2. MATH FORMULA: Haversine Distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth Radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c); 
}

function TripPlannerPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [carModel, setCarModel] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(80);
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Real world ranges
  const carModels = [
    { name: 'Tesla Model 3', range: 450 },
    { name: 'Tata Nexon EV', range: 312 },
    { name: 'MG ZS EV', range: 419 },
    { name: 'Hyundai Kona', range: 452 },
    { name: 'Mahindra XUV400', range: 375 },
    { name: 'Kia EV6', range: 500 }
  ];

  const handlePlanTrip = () => {
    const startCity = indianCities.find(c => c.name === source);
    const endCity = indianCities.find(c => c.name === destination);
    const selectedCar = carModels.find(car => car.name === carModel);

    if (!startCity || !endCity || !selectedCar) {
      alert('Please select valid cities and car model.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      // --- THE NEW "DRIVE TILL EMPTY" ALGORITHM ---
      
      const straightDist = getDistance(startCity.lat, startCity.lng, endCity.lat, endCity.lng);
      const totalDist = Math.round(straightDist * 1.2); // Add 20% for road curvature
      
      const maxRange = selectedCar.range;
      let currentRange = (maxRange * batteryLevel) / 100; // Range available right now
      
      let distanceCovered = 0;
      const stops = [];

      // Loop: While we cannot reach the destination with current charge
      while ((distanceCovered + currentRange) < totalDist) {
        
        // 1. Drive until we have 10% battery left (Safety Buffer)
        const safeDrivable = currentRange - (maxRange * 0.1); 
        
        // 2. We stop at this distance
        distanceCovered += safeDrivable;

        // 3. Add this stop to our list
        stops.push({
          id: stops.length + 1,
          name: `Indian Fuel (Highway Stop ${stops.length + 1})`,
          location: `${Math.round(distanceCovered)} km from start`,
          type: 'DC Fast Charger',
          estimatedTime: '40 mins (to 80%)',
          availability: Math.floor(Math.random() * 3) + 1,
          price: `₹${(18 + Math.random() * 2).toFixed(2)}/kWh`
        });

        // 4. Refill: We charge back to 80% at the station (Standard Fast Charge)
        currentRange = maxRange * 0.8; 
      }

      setTripPlan({
        source,
        destination,
        distance: totalDist,
        estimatedTime: `${Math.floor(totalDist / 60) + stops.length}h ${totalDist % 60}m`,
        chargingStops: stops,
        totalChargingTime: `${stops.length * 40} minutes`,
        estimatedCost: `₹${(totalDist * 1.5).toFixed(0)}`
      });
      
      setLoading(false);
    }, 1500);
  };

  // --- STYLES ---
  const containerStyle = { padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' };
  const headerStyle = { textAlign: 'center', marginBottom: '2rem', color: '#007bff' };
  const formStyle = { backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
  const formGroupStyle = { marginBottom: '1.5rem' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' };
  const inputStyle = { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' };
  const selectStyle = { ...inputStyle, cursor: 'pointer' };
  const buttonStyle = { width: '100%', padding: '1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold' };
  const buttonDisabledStyle = { ...buttonStyle, backgroundColor: '#ccc', cursor: 'not-allowed' };
  
  const tripPlanStyle = { backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '12px', padding: '2rem', marginTop: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
  const tripDetailsStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' };
  const detailCardStyle = { backgroundColor: '#e3f2fd', padding: '1rem', borderRadius: '8px', textAlign: 'center' };
  const stopCardStyle = { backgroundColor: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>🚗 EV Trip Planner</h1>
      
      <div style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Starting Location:</label>
          <input list="cities" value={source} onChange={(e) => setSource(e.target.value)} style={inputStyle} placeholder="Select Start City" />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Destination:</label>
          <input list="cities" value={destination} onChange={(e) => setDestination(e.target.value)} style={inputStyle} placeholder="Select Destination" />
          <datalist id="cities">
            {indianCities.map((city, i) => <option key={i} value={city.name} />)}
          </datalist>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Your EV Model:</label>
          <select value={carModel} onChange={(e) => setCarModel(e.target.value)} style={selectStyle}>
            <option value="">Select your car</option>
            {carModels.map(car => (
              <option key={car.name} value={car.name}>{car.name} ({car.range} km range)</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>
            Current Battery: <span style={{color: batteryLevel < 20 ? 'red' : 'green'}}>{batteryLevel}%</span>
          </label>
          <input type="range" min="10" max="100" value={batteryLevel} onChange={(e) => setBatteryLevel(parseInt(e.target.value))} style={{ width: '100%', marginTop: '0.5rem', cursor: 'pointer' }} />
        </div>

        <button onClick={handlePlanTrip} disabled={loading || !source || !destination || !carModel} style={loading || !source || !destination || !carModel ? buttonDisabledStyle : buttonStyle}>
          {loading ? 'Simulating Trip...' : 'Plan My Trip'}
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h3>🔄 Simulating drive & checking battery...</h3>
        </div>
      )}

      {tripPlan && !loading && (
        <div style={tripPlanStyle}>
          <div style={{ borderBottom: '2px solid #28a745', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0 }}>Trip: {tripPlan.source} ➝ {tripPlan.destination}</h2>
          </div>

          <div style={tripDetailsStyle}>
            <div style={detailCardStyle}>
              <small>Total Distance</small>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{tripPlan.distance} km</div>
            </div>
            <div style={detailCardStyle}>
              <small>Est. Time</small>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{tripPlan.estimatedTime}</div>
            </div>
            <div style={detailCardStyle}>
              <small>Est. Cost</small>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{tripPlan.estimatedCost}</div>
            </div>
          </div>

          {tripPlan.chargingStops.length > 0 ? (
            <div>
              <h3 style={{color: '#e65100'}}>⚠ Charging Required ({tripPlan.chargingStops.length} Stops)</h3>
              <p style={{fontSize:'0.9rem', color:'#666', marginBottom:'15px'}}>
                We added stops exactly when your battery hits <b>10%</b>.
              </p>
              {tripPlan.chargingStops.map((stop, index) => (
                <div key={stop.id} style={stopCardStyle}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Stop {index + 1}: {stop.name}
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    📍 <b>{stop.location}</b> • 🔋 Battery low!
                    <br/>
                    ⏳ {stop.estimatedTime} • 💰 {stop.price}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', background: '#e8f5e9', borderRadius: '8px' }}>
              <h3 style={{color: '#2e7d32'}}>🎉 Non-stop Trip!</h3>
              <p>Your {carModel} can make this {tripPlan.distance}km trip on a single charge.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TripPlannerPage;