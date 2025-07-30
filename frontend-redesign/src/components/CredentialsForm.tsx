import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface Credentials {
  chatgpt_email?: string;
  chatgpt_password?: string;
  gmail_email?: string;
  gmail_password?: string;
  outlook_email?: string;
  outlook_password?: string;
  linkedin_email?: string;
  linkedin_password?: string;
}

interface CredentialsFormProps {
  onSubmit: (credentials: Credentials) => void;
  services?: ('chatgpt' | 'gmail' | 'outlook' | 'linkedin')[];
}

export function CredentialsForm({ onSubmit, services = ['chatgpt', 'gmail'] }: CredentialsFormProps) {
  const [credentials, setCredentials] = useState<Credentials>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const serviceConfig = {
    chatgpt: {
      name: 'ChatGPT',
      icon: '🤖',
      emailPlaceholder: 'your.email@example.com',
      description: 'Used for generating personalized messages'
    },
    gmail: {
      name: 'Gmail',
      icon: '📧',
      emailPlaceholder: 'your.email@gmail.com',
      description: 'Used for sending emails'
    },
    outlook: {
      name: 'Outlook',
      icon: '📮',
      emailPlaceholder: 'your.email@outlook.com',
      description: 'Used for sending emails'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      emailPlaceholder: 'your.email@example.com',
      description: 'Used for finding contacts and sending messages'
    }
  };

  const handleInputChange = (field: keyof Credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    services.forEach(service => {
      const emailField = `${service}_email` as keyof Credentials;
      const passwordField = `${service}_password` as keyof Credentials;
      
      if (!credentials[emailField]) {
        newErrors[emailField] = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials[emailField]!)) {
        newErrors[emailField] = 'Invalid email format';
      }
      
      if (!credentials[passwordField]) {
        newErrors[passwordField] = 'Password is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(credentials);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Security Notice</p>
            <p className="text-sm text-amber-700 mt-1">
              Credentials are stored securely in your session and never saved permanently. 
              They will be cleared when you close the application.
            </p>
          </div>
        </div>
      </div>

      {services.map(service => {
        const config = serviceConfig[service];
        const emailField = `${service}_email` as keyof Credentials;
        const passwordField = `${service}_password` as keyof Credentials;
        
        return (
          <div key={service} className="space-y-4 p-5 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h3 className="font-medium text-gray-900">{config.name}</h3>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
            </div>
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={credentials[emailField] || ''}
                  onChange={(e) => handleInputChange(emailField, e.target.value)}
                  placeholder={config.emailPlaceholder}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150 ${
                    errors[emailField] ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'
                  }`}
                />
              </div>
              {errors[emailField] && (
                <p className="mt-1 text-sm text-red-600">{errors[emailField]}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPasswords[passwordField] ? 'text' : 'password'}
                  value={credentials[passwordField] || ''}
                  onChange={(e) => handleInputChange(passwordField, e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-150 ${
                    errors[passwordField] ? 'border-red-300' : 'border-gray-200 focus:border-blue-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility(passwordField)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords[passwordField] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors[passwordField] && (
                <p className="mt-1 text-sm text-red-600">{errors[passwordField]}</p>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-150"
      >
        Save Credentials
      </button>
    </form>
  );
}