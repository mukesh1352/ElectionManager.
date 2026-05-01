import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VoterProfile } from '../components/VoterProfile';
import { ProgressTracker } from '../components/ProgressTracker';
import { ELECTION_STEPS } from '../types';

describe('Decision Logic UI Tests', () => {
  it('renders VoterProfile with extracted entities correctly', () => {
    const userContext = { age: 17, location: 'California', isRegistered: false };
    render(<VoterProfile userContext={userContext} />);
    
    // Verifies that the extracted logic is passed down and rendered
    expect(screen.getByText('17')).toBeDefined();
    expect(screen.getByText('California')).toBeDefined();
    expect(screen.getByText('Unregistered')).toBeDefined();
  });

  it('renders ProgressTracker correctly based on active step', () => {
    const steps = [
      { id: 1, label: 'Eligibility' },
      { id: 2, label: 'Registration' }
    ];
    // If the user's intent puts them on step 2
    render(<ProgressTracker activeStep={2} steps={steps} />);
    
    // Step 1 should show a checkmark (✓) because activeStep > 1
    const checkmark = screen.getByText('✓');
    expect(checkmark).toBeDefined();
  });
});
