/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({ email: "", password: "" });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignin = async () => {
    try {
      setLoading(true);

      // API call with proper headers and cookies enabled
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        user,
        { withCredentials: true } // Include cookies if the server sets any
      );
      
      if (response.status === 200){
        toast.success(response.data.message || "Login successful!");
        router.push("/"); // Navigate to the home page
      }
     
      
    } catch (error: any) {
      console.error("Login failed", error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Enable the login button only when both fields are filled
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center text-4xl font-extrabold text-gray-900">
          Welcome Back!
        </h1>
        <p className="text-center text-lg text-gray-600">
          Sign in to your account to continue shopping.
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
              className={`mt-2 px-4 py-2 border w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                user.email && !validateEmail(user.email) ? "border-red-500" : "border-gray-300"
              }`}
              aria-label="Email"
            />
            {user.email && !validateEmail(user.email) && (
              <p className="text-red-500 text-sm mt-1">Invalid email format</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
              className="mt-2 px-4 py-2 border w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              aria-label="Password"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onSignin}
              disabled={buttonDisabled || loading}
              className={`w-full py-2 px-4 rounded-md text-white text-lg font-semibold transition-colors duration-300 ${
                buttonDisabled || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              aria-busy={loading}
            >
              {loading ? (
                <span className="loader inline-block w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
                Signup here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
