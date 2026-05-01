import React from 'react';
import styles from '../app/page.module.css';
import type { ElectionStep } from '../types';

interface ProgressTrackerProps {
  activeStep: number;
  steps: ElectionStep[];
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ activeStep, steps }) => {
  return (
    <div className={styles.progressContainer} role="progressbar" aria-valuenow={activeStep} aria-valuemin={1} aria-valuemax={steps.length}>
      {steps.map((step, index) => (
        <div key={step.id} className={`${styles.progressStep} ${step.id <= activeStep ? styles.active : ''}`}>
          <div className={styles.progressIcon} aria-label={`Step ${step.id}: ${step.label}`}>
            {step.id < activeStep ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : step.id}
          </div>
          <span aria-hidden="true">{step.label}</span>
        </div>
      ))}
    </div>
  );
};
