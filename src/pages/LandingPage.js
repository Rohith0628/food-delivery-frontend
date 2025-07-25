import React from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ These paths assume your components are in 'src/components'
import CircularText from '../components/CircularText';
import '../styles.css';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">      
      <div className="landing-content">
        <h1 className="landing-title">Welcome to FoodApp</h1>
        <p className="landing-subtitle">Your next favorite meal is just a click away!</p>
        
        <div className="circular-text-wrapper" onClick={() => navigate('/home')}>
          <CircularText text="Explore-Restaurants-Now-"/>
          <span className="arrow-icon">→</span>
        </div>
      </div>
    </div>
  );
}