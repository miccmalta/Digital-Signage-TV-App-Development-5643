import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMonitor, FiLock, FiUser, FiKey, FiEye, FiEyeOff } = FiIcons;

function LoginScreen({ onLogin, isTV = false }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    deviceCode: ''
  });
  const [loginType, setLoginType] = useState(isTV ? 'device' : 'admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (loginType === 'admin') {
        // Admin login validation
        if (credentials.username === 'admin' && credentials.password === 'signage2024') {
          onLogin({ type: 'admin', username: credentials.username });
        } else {
          setError('Invalid admin credentials');
        }
      } else {
        // Device code validation
        const validCodes = ['TV001', 'TV002', 'TV003', 'DEMO123'];
        if (validCodes.includes(credentials.deviceCode.toUpperCase())) {
          onLogin({ 
            type: 'device', 
            deviceCode: credentials.deviceCode.toUpperCase(),
            deviceId: Date.now().toString()
          });
        } else {
          setError('Invalid device code');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
            <SafeIcon icon={FiMonitor} className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Digital Signage</h1>
          <p className="text-slate-400">
            {isTV ? 'Enter device code to connect' : 'Sign in to manage your displays'}
          </p>
        </div>

        {/* Login Type Toggle */}
        {!isTV && (
          <div className="flex mb-6 bg-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'admin' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Admin Panel
            </button>
            <button
              type="button"
              onClick={() => setLoginType('device')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginType === 'device' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              TV Display
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === 'admin' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <SafeIcon icon={showPassword ? FiEyeOff : FiEye} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Device Code
              </label>
              <div className="relative">
                <SafeIcon icon={FiKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="deviceCode"
                  value={credentials.deviceCode}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest uppercase"
                  placeholder="ENTER CODE"
                  maxLength="10"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Contact your administrator for the device code
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-medium disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Demo Credentials:</h3>
          <div className="text-xs text-slate-400 space-y-1">
            <div>Admin: username=<span className="text-blue-400">admin</span>, password=<span className="text-blue-400">signage2024</span></div>
            <div>Device codes: <span className="text-green-400">TV001, TV002, TV003, DEMO123</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginScreen;