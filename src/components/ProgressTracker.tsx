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
      {steps.map((step) => (
        <div key={step.id} className={`${styles.progressStep} ${step.id <= activeStep ? styles.active : ''}`}>
          <div className={styles.progressIcon} aria-label={`Step ${step.id}: ${step.label}`}>
            {step.id < activeStep ? '✓' : step.id}
          </div>
          <span aria-hidden="true">{step.label}</span>
        </div>
      ))}
    </div>
  );
};
