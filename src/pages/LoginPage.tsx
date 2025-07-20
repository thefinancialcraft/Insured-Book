import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email aur password required hai.");
      return;
    }
    setError("");
    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

    const handleSubmitAuth = (e: React.FormEvent) => {
   
    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col items-center mb-7">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-2">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="5" y="3" width="14" height="18" rx="3" strokeWidth="2"/><path strokeWidth="2" d="M9 7h6M9 11h6M9 15h2"/></svg>
          </span>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 tracking-tight">Sign in</h2>
          <p className="text-gray-400 text-sm">to continue to Insured Book</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-2 text-center text-sm border border-red-100">{error}</div>}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition"
              required
            />
          </div>
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition text-base">Login</button>
          <div className="flex items-center my-3">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 mb-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition font-medium text-gray-700 text-sm"
            onClick={handleSubmitAuth}
          >
            
            Continue with Google
          </button>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition font-medium text-sm"
             onClick={handleSubmitAuth}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            Continue with Facebook
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
