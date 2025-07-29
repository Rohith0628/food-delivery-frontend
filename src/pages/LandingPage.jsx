import React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularText from '../components/CircularText';
import '../styles.css';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <div className="background-image" />
      <div className="background-overlay" />

      <div className="landing-content">
        <h1 className="landing-title">Welcome to SwiftServe</h1>
        <p className="landing-subtitle">Your next favorite meal is just a click away!</p>

        <div className="circular-text-wrapper" onClick={() => navigate('/home')}>
          <CircularText text="Explore-Restaurants-Now-" />
          <span className="arrow-icon">→</span>
        </div>
      </div>
    </div>
  );
}
