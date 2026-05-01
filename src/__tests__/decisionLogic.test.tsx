import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VoterProfile } from '../components/VoterProfile';
import { ProgressTracker } from '../components/ProgressTracker';
import { Timeline } from '../components/Timeline';
import { ELECTION_STEPS } from '../types';

// ─────────────────────────────────────────────────────────
// VoterProfile Component Tests
// ─────────────────────────────────────────────────────────

describe('VoterProfile', () => {
  it('renders extracted entities (age, location, status) correctly', () => {
    const ctx = { age: 17, location: 'California', isRegistered: false };
    render(<VoterProfile userContext={ctx} />);

    expect(screen.getByText('17')).toBeDefined();
    expect(screen.getByText('California')).toBeDefined();
    expect(screen.getByText('Unregistered')).toBeDefined();
  });

  it('shows "Unknown" for all fields when no data is extracted yet', () => {
    const ctx = { age: null, location: null, isRegistered: null };
    render(<VoterProfile userContext={ctx} />);

    // All three fields should show "Unknown"
    const unknowns = screen.getAllByText('Unknown');
    expect(unknowns.length).toBe(3);
  });

  it('shows "Registered" when isRegistered is true', () => {
    const ctx = { age: 25, location: 'Texas', isRegistered: true };
    render(<VoterProfile userContext={ctx} />);

    expect(screen.getByText('Registered')).toBeDefined();
    expect(screen.getByText('25')).toBeDefined();
    expect(screen.getByText('Texas')).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────
// ProgressTracker Component Tests
// ─────────────────────────────────────────────────────────

describe('ProgressTracker', () => {
  it('shows checkmark for completed steps', () => {
    const { container } = render(<ProgressTracker activeStep={3} steps={ELECTION_STEPS} />);

    // Steps 1 and 2 should show the checkmark SVG (polyline)
    const polylines = container.querySelectorAll('polyline');
    expect(polylines.length).toBe(2);
  });

  it('shows step number for current and future steps', () => {
    render(<ProgressTracker activeStep={2} steps={ELECTION_STEPS} />);

    // Step 2 is current, so it shows "2"
    expect(screen.getByText('2')).toBeDefined();
    // Steps 3, 4, 5 should show their numbers
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });

  it('shows all step labels', () => {
    render(<ProgressTracker activeStep={1} steps={ELECTION_STEPS} />);

    expect(screen.getByText('Eligibility')).toBeDefined();
    expect(screen.getByText('Registration')).toBeDefined();
    expect(screen.getByText('Deadlines')).toBeDefined();
    expect(screen.getByText('Documents')).toBeDefined();
    expect(screen.getByText('Voting')).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────
// Timeline Component Tests
// ─────────────────────────────────────────────────────────

describe('Timeline', () => {
  it('renders timeline events when provided', () => {
    const events = [
      { date: 'Oct 15, 2026', event: 'Registration Deadline' },
      { date: 'Nov 3, 2026', event: 'Election Day' },
    ];
    render(<Timeline events={events} />);

    expect(screen.getByText('Oct 15, 2026')).toBeDefined();
    expect(screen.getByText('Registration Deadline')).toBeDefined();
    expect(screen.getByText('Nov 3, 2026')).toBeDefined();
    expect(screen.getByText('Election Day')).toBeDefined();
  });

  it('renders placeholder when events array is empty', () => {
    render(<Timeline events={[]} />);
    expect(screen.getByText(/Share your location/i)).toBeDefined();
  });
});

// ─────────────────────────────────────────────────────────
// API Input Validation Tests (unit-level)
// ─────────────────────────────────────────────────────────

describe('API Input Validation Logic', () => {
  const validate = (message: unknown) => {
    if (!message || typeof message !== 'string' || (message as string).length > 1000) {
      return { valid: false, error: 'Invalid message' };
    }
    return { valid: true };
  };

  it('rejects empty messages', () => {
    expect(validate('')).toEqual({ valid: false, error: 'Invalid message' });
    expect(validate(null)).toEqual({ valid: false, error: 'Invalid message' });
    expect(validate(undefined)).toEqual({ valid: false, error: 'Invalid message' });
  });

  it('rejects non-string messages', () => {
    expect(validate(123)).toEqual({ valid: false, error: 'Invalid message' });
    expect(validate({ text: 'hi' })).toEqual({ valid: false, error: 'Invalid message' });
  });

  it('rejects messages over 1000 characters', () => {
    const longMsg = 'a'.repeat(1001);
    expect(validate(longMsg)).toEqual({ valid: false, error: 'Invalid message' });
  });

  it('accepts valid messages', () => {
    expect(validate('Can I vote?')).toEqual({ valid: true });
    expect(validate('a'.repeat(1000))).toEqual({ valid: true });
  });
});
