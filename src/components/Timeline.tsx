import React from 'react';
import styles from '../app/page.module.css';
import type { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className={styles.timelineCard}>
      <h3 className={styles.profileTitle}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        Deadlines
      </h3>
      
      {events.length === 0 ? (
        <div className={styles.profileValue} style={{ opacity: 0.5, fontStyle: 'italic', fontWeight: 400, marginTop: '20px', textAlign: 'center' }}>
          Share your location to see registration deadlines.
        </div>
      ) : (
        <div style={{ marginTop: '10px' }}>
          {events.map((ev, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineDate}>{ev.date}</div>
              <div className={styles.timelineEvent}>{ev.event}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
