import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

// Component that throws an error for testing
const ThrowingComponent = () => {
  throw new Error('Test component error');
};

// Component that works normally
const WorkingComponent = () => <div>Component works fine</div>;

describe('App with ErrorBoundary integration', () => {
  // Suppress console.error for these tests since we expect errors
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });

  it('should catch errors and show fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please refresh the page to try again.')).toBeInTheDocument();
  });

  it('should render normally when no errors occur', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Component works fine')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});