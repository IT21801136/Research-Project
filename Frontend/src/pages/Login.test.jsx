import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import RestService from '../services/RestService';

// Mock the RestService
jest.mock('../services/RestService');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

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

const LoginWrapper = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
);

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
    window.location.href = '';
  });

  test('renders login form elements correctly', () => {
    render(<LoginWrapper />);
    
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Register Now')).toBeInTheDocument();
  });

  test('renders SignLens logo and slogan', () => {
    render(<LoginWrapper />);
    
    expect(screen.getByAltText('SignLens')).toBeInTheDocument();
    expect(screen.getByText('Unlocking Sign Language Proficiency with SignLens')).toBeInTheDocument();
  });

  test('updates username and password state on input change', () => {
    render(<LoginWrapper />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error toast when username or password is empty', async () => {
    const { toast } = require('react-toastify');
    render(<LoginWrapper />);
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.click(loginButton);
    
    expect(toast.error).toHaveBeenCalledWith(
      'Inputs cannot be empty!!',
      expect.objectContaining({
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      })
    );
  });

  test('calls RestService.authenticateUser with correct credentials', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        userDto: {
          name: 'John Doe',
          email: 'john@example.com',
          userRole: 1,
          username: 'johndoe',
          userId: 1
        }
      }
    };
    
    RestService.authenticateUser.mockResolvedValue(mockResponse);
    
    render(<LoginWrapper />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(RestService.authenticateUser).toHaveBeenCalledWith('johndoe', 'password123');
    });
  });

  test('stores user data in sessionStorage on successful login', async () => {
    const mockResponse = {
      data: {
        token: 'fake-jwt-token',
        userDto: {
          name: 'John Doe',
          email: 'john@example.com',
          userRole: 1,
          username: 'johndoe',
          userId: 1
        }
      }
    };
    
    RestService.authenticateUser.mockResolvedValue(mockResponse);
    
    render(<LoginWrapper />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockSessionStorage.getItem('token')).toBe('fake-jwt-token');
      expect(mockSessionStorage.getItem('isLogged')).toBe('true');
      expect(mockSessionStorage.getItem('name')).toBe('John Doe');
      expect(mockSessionStorage.getItem('email')).toBe('john@example.com');
      expect(mockSessionStorage.getItem('username')).toBe('johndoe');
      expect(mockSessionStorage.getItem('userId')).toBe('1');
      expect(window.location.href).toBe('/');
    });
  });

  test('shows error toast on failed login', async () => {
    const { toast } = require('react-toastify');
    RestService.authenticateUser.mockRejectedValue(new Error('Invalid credentials'));
    
    render(<LoginWrapper />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Login failed!! Please try again.',
        expect.objectContaining({
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        })
      );
    });
  });

  test('register link navigates to register page', () => {
    render(<LoginWrapper />);
    
    const registerLink = screen.getByText('Register Now');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('handles null token response', async () => {
    const mockResponse = {
      data: {
        token: null
      }
    };
    
    RestService.authenticateUser.mockResolvedValue(mockResponse);
    // Mock window.alert
    window.alert = jest.fn();
    
    render(<LoginWrapper />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed Login');
    });
  });
});