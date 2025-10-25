
import React from 'react';
import { GoogleIcon } from './icons';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Invoicer</h1>
        <p className="text-lg text-secondary mb-8">Your AI-powered bill manager.</p>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Sign in to upload, analyze, and manage your bills effortlessly.
          </p>
          <button
            onClick={onLogin}
            className="w-full inline-flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-sm"
          >
            <GoogleIcon className="w-6 h-6" />
            Sign in with Google
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
