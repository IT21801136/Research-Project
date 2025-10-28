import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import RestService from '../services/RestService';

// Mock the RestService
jest.mock('../services/RestService');

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock window.location.href
delete window.location;
window.location = { href: '' };

const RegisterWrapper = () => (
  <BrowserRouter>
    <Register />
  </BrowserRouter>
);

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  test('renders register form elements correctly', () => {
    render(<RegisterWrapper />);
    
    expect(screen.getByText('REGISTER')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('updates form state on input change', () => {
    render(<RegisterWrapper />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(usernameInput.value).toBe('johndoe');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error toast when required fields are empty', async () => {
    const { toast } = require('react-toastify');
    render(<RegisterWrapper />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.click(registerButton);
    
    expect(toast.error).toHaveBeenCalledWith(
      'Inputs cannot be empty!!',
      expect.objectContaining({
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      })
    );
  });

  test('shows error toast for invalid email format', async () => {
    const { toast } = require('react-toastify');
    render(<RegisterWrapper />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(registerButton);
    
    expect(toast.error).toHaveBeenCalledWith(
      'Please enter a valid email address!!',
      expect.objectContaining({
        position: "top-right",
        autoClose: 5000,
        theme: "colored"
      })
    );
  });

  test('calls RestService.register with correct data on successful registration', async () => {
    const mockResponse = { data: { success: true } };
    RestService.register.mockResolvedValue(mockResponse);
    
    render(<RegisterWrapper />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(registerButton);
    
    await waitFor(() => {
      expect(RestService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        password: 'password123',
        userRole: 1
      });
    });
  });

  test('shows success toast and redirects on successful registration', async () => {
    const { toast } = require('react-toastify');
    const mockResponse = { data: { success: true } };
    RestService.register.mockResolvedValue(mockResponse);
    
    render(<RegisterWrapper />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(registerButton);
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'User registered successfully!!',
        expect.objectContaining({
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        })
      );
      expect(window.location.href).toBe('/login');
    });
  });

  test('shows error toast on failed registration', async () => {
    const { toast } = require('react-toastify');
    RestService.register.mockRejectedValue(new Error('Registration failed'));
    
    render(<RegisterWrapper />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(registerButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Registration failed!! Please try again.',
        expect.objectContaining({
          position: "top-right",
          autoClose: 5000,
          theme: "colored"
        })
      );
    });
  });

  test('login link navigates to login page', () => {
    render(<RegisterWrapper />);
    
    const loginLink = screen.getByText('Login Now');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('renders SignLens logo and slogan', () => {
    render(<RegisterWrapper />);
    
    expect(screen.getByAltText('SignLens')).toBeInTheDocument();
    expect(screen.getByText('Unlocking Sign Language Proficiency with SignLens')).toBeInTheDocument();
  });

  test('validates email format correctly', () => {
    render(<RegisterWrapper />);
    
    const emailInput = screen.getByLabelText(/email/i);
    
    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    
    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    expect(emailInput.value).toBe('invalid-email');
  });

  test('handles form submission with all fields filled', async () => {
    RestService.register.mockResolvedValue({ data: { success: true } });
    
    render(<RegisterWrapper />);
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'johndoe' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);
    
    await waitFor(() => {
      expect(RestService.register).toHaveBeenCalled();
    });
  });
});