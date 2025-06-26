"use client";
import React, { useState } from "react";
import { loginUser } from "../../api/services/login/login";
import { useRouter } from "next/navigation";


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
      const data = await loginUser(username, password);
      console.log("Login successful:", data);
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || "Login failed.");
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
          </div>

          <div className="max-md:mt-8">
            <img
              src="login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="login"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
