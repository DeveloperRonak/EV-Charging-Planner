import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import stationService from '../services/stationService';

// 1. Fix Leaflet Default Icon Issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// 2. Create a Custom "Red Dot" Icon for the Fuel Station
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 3. Define Cities
const indianCities = [
  { id: 1, name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { id: 2, name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { id: 3, name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { id: 4, name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { id: 5, name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { id: 6, name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { id: 7, name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { id: 8, name: "Surat", lat: 21.1702, lng: 72.8311 },
  { id: 9, name: "Pune", lat: 18.5204, lng: 73.8567 },
  { id: 10, name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { id: 11, name: "Thane", lat: 19.2183, lng: 72.9781 }
];


// Helper: Calculate distance (Haversine Formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; 
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) { return deg * (Math.PI / 180); }

// 5. Routing Component (The "Pit Stop" Engine)
const RoutingMachine = ({ start, end, station, onRouteFound }) => {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    // Cleanup helper
    const cleanup = () => {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.setWaypoints([]);
          map.removeControl(routingControlRef.current);
        } catch (e) {}
        routingControlRef.current = null;
      }
    };

    if (!start || !end || !station) return;
    cleanup();

    try {
      // ---------------------------------------------------------
      // KEY CHANGE: We route Start -> Station -> End
      // ---------------------------------------------------------
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start.lat, start.lng),     // 1. Start
          L.latLng(station.lat, station.lng), // 2. Pit Stop (Red Dot)
          L.latLng(end.lat, end.lng)          // 3. Destination
        ],
        lineOptions: { styles: [{ color: '#007bff', weight: 5 }] },
        show: false,
        addWaypoints: false,
        routeWhileDragging: false,
        draggableWaypoints: false,
        createMarker: function(i, waypoint, n) {
          // Logic to color the markers differently
          
          // Marker 1: The Fuel Station (The Middle Point) -> RED DOT
          if (i === 1) {
            return L.marker(waypoint.latLng, { icon: redIcon })
              .bindPopup(`<b>🛑 Charging Stop:</b><br/>${station.name}`);
          }
          
          // Marker 2: The Destination -> Default Blue
          if (i === n - 1) {
             return L.marker(waypoint.latLng, { icon: new L.Icon.Default() })
               .bindPopup(`<b>🏁 Destination:</b><br/>${end.name}`);
          }

          // Marker 0: Start -> Default Blue
          return L.marker(waypoint.latLng, { icon: new L.Icon.Default() })
            .bindPopup(`<b>🏠 Start:</b><br/>${start.name}`);
        }
      });

      routingControl.addTo(map);
      routingControlRef.current = routingControl;

      // Hide container
      const container = routingControl.getContainer();
      if (container) container.style.display = 'none';

      routingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        if (onRouteFound) {
          onRouteFound({
            instructions: route.instructions,
            station: station
          });
        }
      });
    } catch (e) { console.error(e); }

    return cleanup;
  }, [start, end, station, map, onRouteFound]);

  return null;
};

// 6. Main Page Component
const Mappage = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [routeConfig, setRouteConfig] = useState(null); // Holds Start, End, and Station data
  const [routeData, setRouteData] = useState({ instructions: [], station: null });
  const [evChargingStations, setEvStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await stationService.getAllStations();
        const formattedStations = data.map(s => ({
          id: s._id,
          name: s.name,
          address: s.address,
          type: s.chargerType,
          price: `₹${s.price}/kWh`,
          lat: s.latitude,
          lng: s.longitude
        }));
        setEvStations(formattedStations);
      } catch (error) {
        console.error("Failed to fetch stations", error);
      }
    };
    fetchStations();
  }, []);

  const handleSearchRoute = () => {
    // 1. Find Cities
    const startCity = indianCities.find(c => c.name.toLowerCase() === startLocation.toLowerCase());
    const endCity = indianCities.find(c => c.name.toLowerCase() === endLocation.toLowerCase());
    
    if (!startCity || !endCity) {
      alert("Please select valid cities from the list.");
      return;
    }

    // 2. Logic: Find Nearest Fuel Station to the START point
    // (In a real app, you might check along the whole route, but closest to start is best for this demo)
    let nearestStation = null;
    let minDistance = Infinity;

    evChargingStations.forEach(station => {
      const dist = getDistanceFromLatLonInKm(startCity.lat, startCity.lng, station.lat, station.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestStation = station;
      }
    });

    if (nearestStation) {
      // 3. Set the Route Configuration: Start -> Station -> End
      setRouteConfig({
        start: startCity,
        end: endCity,
        station: nearestStation
      });
      setRouteData({ instructions: [], station: null }); // Clear old data
    } else {
      alert("No nearby Indian Fuel stations found.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Top Bar */}
      <div style={{ padding: '15px', background: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <h2 style={{ margin: '0 20px 0 0', fontSize: '1.2rem', color: '#007bff' }}>EV Trip Planner</h2>
        
        <input list="cities" placeholder="Start (e.g. Mumbai)" value={startLocation} onChange={e => setStartLocation(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        <span>➔</span>
        <input list="cities" placeholder="End (e.g. Surat)" value={endLocation} onChange={e => setEndLocation(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        
        <datalist id="cities">{indianCities.map(c => <option key={c.id} value={c.name} />)}</datalist>
        <button onClick={handleSearchRoute} style={{ padding: '8px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Plan Trip with Charge
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        
        {/* Left: Map */}
        <div style={{ flex: '0 0 70%', position: 'relative' }}>
          <MapContainer center={[19.0760, 72.8777]} zoom={9} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Show all stations faintly (optional, good for context) */}
            {evChargingStations.map(station => (
              <Marker key={station.id} position={[station.lat, station.lng]} opacity={0.6}>
                <Popup>{station.name}</Popup>
              </Marker>
            ))}

            {/* The Active Route */}
            {routeConfig && (
              <RoutingMachine 
                key={`${routeConfig.start.id}-${routeConfig.end.id}`} 
                start={routeConfig.start} 
                end={routeConfig.end}
                station={routeConfig.station}
                onRouteFound={setRouteData} 
              />
            )}
          </MapContainer>
        </div>

        {/* Right: Info Panel */}
        <div style={{ flex: '0 0 30%', background: 'white', borderLeft: '2px solid #ddd', overflowY: 'auto', padding: '20px' }}>
          
          {routeData.station ? (
            <>
              {/* Trip Summary Card */}
              <div style={{ background: '#f0f4c3', border: '1px solid #c0ca33', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
                <h3 style={{ marginTop: 0, color: '#827717' }}>🛑 Charging Stop Added</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="Red Dot" style={{height:'30px'}} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{routeData.station.name}</div>
                    <div style={{ fontSize: '0.9rem' }}>{routeData.station.address}</div>
                  </div>
                </div>
                <hr style={{ borderColor: '#dce775', margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span><b>Type:</b> {routeData.station.type}</span>
                   <span style={{ background: '#28a745', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>{routeData.station.price}</span>
                </div>
              </div>

              {/* Directions */}
              <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>🚗 Directions</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Total path: <b>{routeConfig.start.name}</b> ➔ <span style={{color:'red'}}>Station</span> ➔ <b>{routeConfig.end.name}</b>
              </p>

              <ol style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
                {routeData.instructions.map((step, i) => {
                  // Hack: Detect if we are switching from "To Station" to "To Destination"
                  // Usually the routing machine gives one big list, but the visual separation helps
                  return (
                    <li key={i} style={{ marginBottom: '8px', color: '#444' }}>
                      {step.text} <b style={{ color: '#007bff' }}>({Math.round(step.distance)}m)</b>
                      {step.text.includes('waypoint') && (
                        <div style={{ padding: '5px', background: '#ffebee', color: '#c62828', fontWeight: 'bold', margin: '5px 0' }}>
                          🛑 Arrived at Charging Station
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
              <h3>Ready to Plan?</h3>
              <p>Enter Start & Destination.<br/>We will automatically add the nearest charging station to your route.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Mappage;