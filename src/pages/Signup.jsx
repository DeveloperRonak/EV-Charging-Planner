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
      
      console.log('Registration data:', { name, email, password });
      const response = await authService.register(email, password, name);
      console.log('Registration response:', response);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
