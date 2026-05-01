import React from 'react';
import styles from '../app/page.module.css';
import type { TimelineEvent } from '../types';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className={styles.timelineCard} aria-label="Important Deadlines Timeline">
      <h3 className={styles.profileTitle}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        Key Deadlines
      </h3>
      {events.map((item, idx) => (
        <div key={idx} className={styles.timelineItem} role="listitem">
          <div className={styles.timelineDate}>{item.date}</div>
          <div className={styles.timelineEvent}>{item.event}</div>
        </div>
      ))}
    </div>
  );
};
