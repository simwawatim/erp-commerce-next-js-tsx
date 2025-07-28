"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("https://uat.pythonanywhere.com/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw { response: { data: errorData } };
      }

      const data = await response.json();

      // Save tokens to localStorage
      if (data.access) localStorage.setItem("token", data.access);
      if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
      if (data.user?.role) {
        const role = data.user.role.toUpperCase();
        localStorage.setItem("role", role);
      }


      const role = data?.user?.role?.toUpperCase() || "UNKNOWN";

      console.log("Login successful. Role:", role);

      switch (role) {
      case "UNKNOWN":
        router.push("/customer/dashboard");
        break;
      default:
        router.push("/");
        break;
    }

    } catch (error: any) {
      setErrorMsg(error?.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-md max-md:mx-auto">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">Sign in</h3>
                <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                  Sign in to your account
                </p>
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your password"
                />
              </div>

              {errorMsg && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}

              <div className="flex justify-between text-sm">
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Forgot your password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="text-center text-sm mt-4 text-slate-600 space-y-2">
              <p>
                Don't have an account?{" "}
                <a href="/customer/register" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </a>
              </p>
              <p>
                Or just want to{" "}
                <a href="/customer/dashboard" className="text-blue-600 hover:underline font-medium">
                  Shop
                </a>{" "}
                without signing up
              </p>
            </div>
          </div>

         <div className="relative max-md:mt-8 w-full max-md:w-4/5 mx-auto">

            <div className="max-md:mt-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to iLap Electronics</h2>
            <img
              src="login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="login"
            />
          </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginForm;
