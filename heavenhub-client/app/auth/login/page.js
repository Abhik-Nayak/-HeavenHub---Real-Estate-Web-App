"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import GoogleLogin from "./googleLogin";

export default function LogIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, token, user } = useSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false); // ✅ Prevent hydration mismatch
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setMounted(true); // ✅ Wait until client mounts
  }, []);

  useEffect(() => {
    if (mounted && user && token) {
      router.push("/"); // 🔐 Redirect to protected route
    }
  }, [mounted, user, token, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!mounted) return null; // ✅ Avoid rendering before hydration

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: "url('/LogInBGI.jpg')" }} // ✅ This is safe
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md transform transition-all duration-300 hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Sign In to Your Account
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {error && (
          <p className="text-red-500 text-center mt-4 animate-bounce">
            {error}
          </p>
        )}
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
        {/* Google Sign-In Button */}
        <GoogleLogin />
      </form>
    </div>
  );
}
