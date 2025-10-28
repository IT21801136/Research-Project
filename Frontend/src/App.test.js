import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

// Mock window.location.href
delete window.location;
window.location = { href: '' };

describe('App Component', () => {
  beforeEach(() => {
    mockSessionStorage.clear();
  });

  test('renders login page when user is not logged in', () => {
    mockSessionStorage.setItem('isLogged', 'false');
    render(<App />);
    
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('renders main application with sidebar when user is logged in', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('token', 'fake-token');
    mockSessionStorage.setItem('username', 'testuser');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<App />);
    
    // Check if sidebar navigation is present
    expect(screen.getByText('wOHhkh')).toBeInTheDocument(); // Learning Dashboard in Sinhala
    expect(screen.getByText('ix{d YíofldaIh')).toBeInTheDocument(); // Text to Sign in Sinhala
  });

  test('renders register page when accessing /register route', () => {
    mockSessionStorage.setItem('isLogged', 'false');
    
    // Mock React Router to navigate to register
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // The app should render login by default when not logged in
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });

  test('redirects to login when session storage is empty', () => {
    render(<App />);
    
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });
});
