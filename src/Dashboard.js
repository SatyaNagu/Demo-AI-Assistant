import React, { useState } from 'react';
import './Dashboard.css';
import AnimatedOrb from './components/AnimatedOrb';
import { usePolling } from './hooks/usePolling';

const userAvatar = process.env.PUBLIC_URL + '/Assets/userAvatar.png';
const videoThumb1 = process.env.PUBLIC_URL + '/Assets/videoThumb1.png';
const videoThumb2 = process.env.PUBLIC_URL + '/Assets/videoThumb2.png';
const mapImage = process.env.PUBLIC_URL + '/Assets/mapImage.png';
const notificationIcon = process.env.PUBLIC_URL + '/Assets/notificationIcon.png';
const moonIcon = process.env.PUBLIC_URL + '/Assets/moonIcon.png';
const micIcon = process.env.PUBLIC_URL + '/Assets/micIcon.png';
const playIcon = process.env.PUBLIC_URL + '/Assets/playIcon.png';

export default function Dashboard() {
  const statusData = usePolling('http://localhost:5000/status', 1000);
  let statusText = 'Hold RIGHT SHIFT anytime to speak.';
  if (statusData && statusData.status) {
    if (statusData.status === 'listening') statusText = 'Listening...';
    else if (statusData.status === 'thinking') statusText = 'Thinking...';
    else if (statusData.status === 'speaking') statusText = 'Speaking...';
    else statusText = 'Hold RIGHT SHIFT anytime to speak.';
  }

  return (
    <div className="dashboard-bg">
      <div className="main-card">
        <header className="dashboard-header">
          <div className="dashboard-title">
            <span className="ai-blue">AI</span> <span>Assitance</span>
          </div>
          <div className="dashboard-user">
            <img src={userAvatar} alt="User Avatar" className="user-avatar" />
            <span className="user-name">Roman Atwoods</span>
          </div>
          <div className="dashboard-header-icons">
            <div className="header-icon-circle">
              <img src={notificationIcon} alt="Notifications" className="header-icon-img" />
            </div>
            <div className="header-separator" />
            <div className="header-icon-circle">
              <img src={moonIcon} alt="Dark Mode" className="header-icon-img" />
            </div>
            <span className="premium">PREMIUM</span>
          </div>
        </header>
        <main className="dashboard-main">
          <section className="search-history">
            <h2>Previous Search History</h2>
            <div className="history-grid">
              {['WEATHER','MEDICAL EQUIPMENT','TRAFIC SIGNALS','PATH RECOGNITION','ALARM','FACTS','MOVIES','CARTOONS','RESTAURANTS','CLOTHS STORES'].map((item, i) => (
                <div className="history-card" key={item}>
                  <div className="history-title">{item}</div>
                  <div className="history-progress">
                    <div className="progress-bar"><div className="progress-fill" /></div>
                    <span className="progress-text">45%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="center-listen">
            <AnimatedOrb />
            <div className="listen-question">What's the price of hoverboard ....</div>
            <div className="listen-status" style={{ fontFamily: 'Turret Road, cursive', color: '#FBFBFB', fontSize: '2.2rem', marginTop: '1rem' }}>{statusText}</div>
            <div className="listen-mic">
              <img src={micIcon} alt="Mic Icon" className="mic-icon-img" />
            </div>
          </section>
          <section className="searched-command">
            <h2>Searched By Command</h2>
            <div className="command-details">
              <div><span className="command-label">Title</span><br /><span className="command-value">Hover Board</span></div>
              <div><span className="command-label">Category</span><br /><span className="command-value">Personal Transporter</span></div>
              <div><span className="command-label">Search Results</span><br /><span className="command-value blue">92.8%</span></div>
              <div className="command-links">
                <a href="#" className="command-link">View All</a>
                <a href="#" className="command-link">View Top Results</a>
              </div>
            </div>
            <div className="videos-title">Videos</div>
            <div className="command-videos">
              <div className="video-card">
                <img src={videoThumb1} alt="Video 1" className="video-thumb" />
                <div className="video-info">
                  <div className="video-title">Hover Board Review</div>
                  <div className="video-source">YOUTUBE</div>
                </div>
                <img src={playIcon} alt="Play Icon" className="play-icon-img" />
              </div>
              <div className="video-card">
                <img src={videoThumb2} alt="Video 2" className="video-thumb" />
                <div className="video-info">
                  <div className="video-title">Hover Board Unboxing</div>
                  <div className="video-source">YOUTUBE</div>
                </div>
                <img src={playIcon} alt="Play Icon" className="play-icon-img" />
              </div>
              <a href="#" className="view-all-link">View All</a>
            </div>
            <div className="nearest-stores-title">Nearest Stores</div>
            <div className="nearest-stores">
              <img src={mapImage} alt="Nearest Stores" className="map-image" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
} 