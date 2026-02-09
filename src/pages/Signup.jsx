import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm';
import authService from '../services/authService';

function Signup() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (name, email, password, confirmPassword) => {
    setLoading(true);
    setError('');
    
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      await authService.register(email, password, name);
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Signup Page Error:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#007bff'
  };

  return (
    <div>
      <SignupForm 
        onSubmit={handleSignup}
        error={error}
        loading={loading}
      />
      
      <p style={linkStyle}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;
