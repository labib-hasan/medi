import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLogin() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showSuperadminSignup, setShowSuperadminSignup] = useState(false);
  const [hasSuperadmin, setHasSuperadmin] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if superadmin exists
    checkSuperadmin();
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const checkSuperadmin = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-superadmin`);
      const data = await response.json();
      setHasSuperadmin(data.hasSuperadmin);
      if (!data.hasSuperadmin) {
        setShowSuperadminSignup(true);
        setIsLoginMode(false);
      }
    } catch (err) {
      console.error('Error checking superadmin:', err);
      setHasSuperadmin(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuperadminSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup-superadmin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Superadmin account created! Redirecting to login...');
        setHasSuperadmin(true);
        setShowSuperadminSignup(false);
        setIsLoginMode(true);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen admin-login-wrapper">
      {/* Animated Background */}
      <div className="login-bg">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="login-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={showSuperadminSignup ? 'signup-superadmin' : (isLoginMode ? 'login' : 'login')}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="login-card"
          >
            {/* Logo & Header */}
            <div className="login-header">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="logo-container"
              >
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="login-title"
              >
                Health Journal
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="login-subtitle"
              >
                {showSuperadminSignup ? 'Create Superadmin Account' : (isLoginMode ? 'Admin Portal Access' : 'Admin Login')}
              </motion.p>
            </div>

            {/* Form */}
            <form onSubmit={showSuperadminSignup ? handleSuperadminSignup : handleLogin} className="login-form">
              {showSuperadminSignup && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="form-group"
                >
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-input"
                      placeholder="Enter your full name"
                      required={showSuperadminSignup}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: showSuperadminSignup ? 0.35 : 0.4 }}
                className="form-group"
              >
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6C2 4.89543 2.89543 4 4 4Z"/>
                      <path d="M22 6L12 13L2 6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    placeholder="admin@healthjournal.com"
                    required
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: showSuperadminSignup ? 0.4 : 0.5 }}
                className="form-group"
              >
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder={showSuperadminSignup ? "Create a password" : "Enter your password"}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </motion.div>

              {showSuperadminSignup && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="form-group"
                >
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-input"
                      placeholder="Confirm your password"
                      required={showSuperadminSignup}
                    />
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="error-message"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="success-message"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: showSuperadminSignup ? 0.5 : 0.6 }}
                className={`submit-btn ${isLoading ? 'loading' : ''}`}
              >
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    {showSuperadminSignup ? 'Create Superadmin' : 'Sign In'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12H19"/>
                      <path d="M12 5L19 12L12 19"/>
                    </svg>
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle Mode - Only show when not in superadmin signup mode */}
            {!showSuperadminSignup && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="toggle-mode"
              >
                <p>Need to login? <button type="button" onClick={() => router.push('/admin/login')}>Sign In</button></p>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="login-footer"
            >
              <a href="/" className="back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5"/>
                  <path d="M12 19L5 12L12 5"/>
                </svg>
                Back to Website
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="login-decorations">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
          <div className="decoration-circle decoration-3"></div>
        </div>
      </div>

      <style jsx global>{`
        /* Login Page Styles */
        .admin-login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
        }

        /* Animated Background */
        .login-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .bg-shape {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
        }

        .bg-shape-1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          top: -200px;
          right: -200px;
          animation: floatShape1 15s ease-in-out infinite;
        }

        .bg-shape-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          bottom: -150px;
          left: -150px;
          animation: floatShape2 12s ease-in-out infinite;
        }

        .bg-shape-3 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #8b5cf6, #ec4899);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: floatShape3 18s ease-in-out infinite;
        }

        @keyframes floatShape1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 50px) scale(1.1); }
        }

        @keyframes floatShape2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(0.9); }
        }

        @keyframes floatShape3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }

        /* Particles */
        .bg-particles {
          position: absolute;
          inset: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-30px) scale(1.5); 
            opacity: 1;
          }
        }

        /* Container */
        .login-container {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          padding: 20px;
        }

        /* Login Card */
        .login-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 32px;
          padding: 48px 40px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        /* Header */
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-container {
          display: inline-block;
          margin-bottom: 16px;
        }

        .logo-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 
            0 10px 30px rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .logo-icon svg {
          width: 36px;
          height: 36px;
          color: white;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .login-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
          letter-spacing: 0.02em;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          transition: color 0.3s;
        }

        .input-wrapper:focus-within .input-icon {
          color: #3b82f6;
        }

        .form-input {
          width: 100%;
          padding: 16px 50px 16px 48px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          font-size: 15px;
          color: #ffffff;
          outline: none;
          transition: all 0.3s;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.1);
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.4);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s;
        }

        .password-toggle:hover {
          color: rgba(255, 255, 255, 0.7);
        }

        /* Error Message */
        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          color: #fca5a5;
          font-size: 13px;
        }

        .error-message svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* Success Message */
        .success-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          color: #86efac;
          font-size: 13px;
        }

        .success-message svg {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        /* Submit Button */
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 18px 24px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .submit-btn svg {
          width: 20px;
          height: 20px;
        }

        .submit-btn.loading {
          background: linear-gradient(135deg, #64748b, #475569);
        }

        /* Loader */
        .loader {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Toggle Mode */
        .toggle-mode {
          text-align: center;
          margin-top: 24px;
        }

        .toggle-mode p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          margin: 0;
        }

        .toggle-mode button {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          transition: color 0.3s;
        }

        .toggle-mode button:hover {
          color: #8b5cf6;
        }

        /* Footer */
        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s;
        }

        .back-link:hover {
          color: #ffffff;
        }

        .back-link svg {
          width: 18px;
          height: 18px;
        }

        /* Decorative Elements */
        .login-decorations {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .decoration-circle {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .decoration-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          left: 5%;
          animation: rotateSlow 30s linear infinite;
        }

        .decoration-2 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          right: 10%;
          animation: rotateSlow 25s linear infinite reverse;
        }

        .decoration-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          left: 15%;
          animation: rotateSlow 20s linear infinite;
        }

        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 540px) {
          .login-card {
            padding: 36px 24px;
          }

          .login-title {
            font-size: 24px;
          }

          .logo-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
          }

          .logo-icon svg {
            width: 30px;
            height: 30px;
          }

          .form-input {
            padding: 14px 46px 14px 44px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

