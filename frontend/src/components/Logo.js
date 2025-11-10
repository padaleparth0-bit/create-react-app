import { useState, useEffect } from 'react';

export const Logo = ({ size = 'large' }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const logoSize = size === 'large' ? '80px' : '50px';
  const fontSize = size === 'large' ? '48px' : '28px';

  return (
    <div className="logo-container" style={{width: logoSize, height: logoSize}}>
      <div className={`logo-wrapper ${isAnimating ? 'logo-animate' : ''}`}>
        <div className="logo-coin">
          <div className="coin-front">
            <span style={{fontSize}}>$</span>
          </div>
          <div className="coin-back">
            <span style={{fontSize}}>💰</span>
          </div>
        </div>
        <div className="logo-sparkles">
          <span className="sparkle sparkle-1">✨</span>
          <span className="sparkle sparkle-2">✨</span>
          <span className="sparkle sparkle-3">✨</span>
        </div>
      </div>
    </div>
  );
};