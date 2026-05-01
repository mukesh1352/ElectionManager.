import React from 'react';
import styles from '../app/page.module.css';
import type { UserContext } from '../types';

interface VoterProfileProps {
  userContext: UserContext;
}

export const VoterProfile: React.FC<VoterProfileProps> = ({ userContext }) => {
  return (
    <div className={styles.profileCard} aria-label="Voter Profile Information">
      <h3 className={styles.profileTitle}>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        Voter Profile
      </h3>
      <div className={styles.profileItem}>
        <span className={styles.profileLabel}>Age</span>
        <span className={`${styles.profileValue} ${!userContext.age ? styles.unknown : ''}`}>{userContext.age || 'Unknown'}</span>
      </div>
      <div className={styles.profileItem}>
        <span className={styles.profileLabel}>Location</span>
        <span className={`${styles.profileValue} ${!userContext.location ? styles.unknown : ''}`}>{userContext.location || 'Unknown'}</span>
      </div>
      <div className={styles.profileItem}>
        <span className={styles.profileLabel}>Status</span>
        <span className={`${styles.profileValue} ${userContext.isRegistered === null ? styles.unknown : ''}`}>
          {userContext.isRegistered === null ? 'Unknown' : (userContext.isRegistered ? 'Registered' : 'Unregistered')}
        </span>
      </div>
    </div>
  );
};
