import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SideNavBar from './SideNavBar';

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

const SideNavBarWrapper = () => (
  <BrowserRouter>
    <SideNavBar />
  </BrowserRouter>
);

describe('SideNavBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
    window.location.href = '';
  });

  test('renders sidebar with user data from sessionStorage', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('token', 'fake-token');
    mockSessionStorage.setItem('username', 'testuser');
    mockSessionStorage.setItem('name', 'Test User');
    mockSessionStorage.setItem('userId', '1');
    
    render(<SideNavBarWrapper />);
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('SignLens')).toBeInTheDocument();
  });

  test('renders all navigation links correctly', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    // Check navigation links (Sinhala text)
    expect(screen.getByText('wOHhkh')).toBeInTheDocument(); // Learning Dashboard
    expect(screen.getByText('ix{d Yídofldaih')).toBeInTheDocument(); // Text to Sign Dictionary
    expect(screen.getByText('Yío mßj¾:lh')).toBeInTheDocument(); // Audio Translator
    expect(screen.getByText('ix{d y÷kd.ekSu')).toBeInTheDocument(); // Sign Detection
    expect(screen.getByText('jdÑl mqyqKqj')).toBeInTheDocument(); // Vocal Training
  });

  test('navigation links have correct href attributes', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    const learningLink = screen.getByText('wOHhkh').closest('a');
    const textToSignLink = screen.getByText('ix{d Yídofldaih').closest('a');
    const audioToSignLink = screen.getByText('Yío mßj¾:lh').closest('a');
    const signDetectionLink = screen.getByText('ix{d y÷kd.ekSu').closest('a');
    const vocalTrainingLink = screen.getByText('jdÑl mqyqKqj').closest('a');
    
    expect(learningLink).toHaveAttribute('href', '/');
    expect(textToSignLink).toHaveAttribute('href', '/text-to-sign');
    expect(audioToSignLink).toHaveAttribute('href', '/audio-to-sign');
    expect(signDetectionLink).toHaveAttribute('href', '/sign-detection');
    expect(vocalTrainingLink).toHaveAttribute('href', '/vocal-training');
  });

  test('renders dropdown menu for user actions', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    const userButton = screen.getByText('Test User');
    expect(userButton).toHaveClass('dropdown-toggle');
    
    // Check if logout button exists in dropdown
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  test('handleLogout clears sessionStorage and redirects to login', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('token', 'fake-token');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    // Check that sessionStorage is cleared
    expect(mockSessionStorage.getItem('isLogged')).toBeNull();
    expect(mockSessionStorage.getItem('token')).toBeNull();
    expect(mockSessionStorage.getItem('name')).toBeNull();
    
    // Check redirection
    expect(window.location.href).toBe('/login');
  });

  test('logo links to home page', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    const logoLink = screen.getByAltText('SignLens').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  test('renders with correct CSS classes', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    const navLinks = screen.getAllByRole('link');
    const mainNavLinks = navLinks.filter(link => 
      link.classList.contains('main-nav-link')
    );
    
    expect(mainNavLinks.length).toBeGreaterThan(0);
  });

  test('handles missing user data gracefully', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    // Don't set name
    
    render(<SideNavBarWrapper />);
    
    // Should still render the dropdown button even without name
    const userButton = screen.getByRole('button', { expanded: false });
    expect(userButton).toBeInTheDocument();
  });

  test('user dropdown button has correct attributes', () => {
    mockSessionStorage.setItem('isLogged', 'true');
    mockSessionStorage.setItem('name', 'Test User');
    
    render(<SideNavBarWrapper />);
    
    const userButton = screen.getByText('Test User');
    expect(userButton).toHaveAttribute('data-toggle', 'dropdown');
    expect(userButton).toHaveAttribute('aria-haspopup', 'true');
    expect(userButton).toHaveAttribute('aria-expanded', 'false');
  });
});