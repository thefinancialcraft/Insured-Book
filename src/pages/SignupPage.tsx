import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, CheckCircle } from "lucide-react";

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await signUp(formData.email, formData.password);

    if (error) {
      setError(error.message || "Signup failed. Please try again.");
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md p-6 md:p-8 bg-white/90 rounded-2xl shadow-xl border border-white/50">
        <div className="flex flex-col items-center mb-7">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-2">
            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </span>
          <h2 className="text-2xl font-semibold text-gray-800 mb-1 tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm">Join Insured Book today</p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-sm mb-4">
                We've sent a verification link to <strong>{formData.email}</strong>
              </p>
              <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm border border-blue-100">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Click the verification link in your email</li>
                      <li>Complete your profile details</li>
                      <li>Wait for approval (24-72 hours)</li>
                      <li>Get your Employee ID and access dashboard</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition text-base"
              >
                Back to Login
              </button>

              <p className="text-gray-500 text-xs">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  try again
                </button>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded mb-2 text-center text-sm border border-red-100">{error}</div>}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition"
                required
                autoFocus
                disabled={loading}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-1">Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition"
                required
                disabled={loading}
                placeholder="Enter password (min 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-500 mb-1">Confirm Password *</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-gray-700 text-sm transition"
                required
                disabled={loading}
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-sm transition text-base disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage; 