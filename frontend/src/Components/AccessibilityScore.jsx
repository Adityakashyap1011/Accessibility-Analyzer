import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const AccessibilityScore = ({ score }) => {
  return (
    <div style={{ width: 120, margin: '20px auto', textAlign: 'center' }}>
      <CircularProgressbar value={score} text={`${score}/100`}
        styles={
            buildStyles(
                {
                    pathColor: score >= 80 ? '#00c851' : score >= 50 ? '#ffbb33' : '#ff4444',
                    textColor: '#fff',
                    trailColor: 'rgba(255,255,255,0.1)',
                    backgroundColor: '#000',
                    textSize: '16px',
                    pathTransitionDuration: 1.5,
                })}
      />
      <div style={{ marginTop: '10px', color: '#ccc', fontWeight: 'bold' }}>
        Accessibility Score
      </div>
    </div>
  );
};

export default AccessibilityScore;