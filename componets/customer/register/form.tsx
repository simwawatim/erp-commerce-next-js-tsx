import React, { useState } from "react";
import Link from "next/link";

interface RegisterFormFields {
  username: string;
  email: string;
  password: string;
}

interface RegisterFormEvent extends React.FormEvent<HTMLFormElement> {}

const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: RegisterFormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const formData: RegisterFormFields = { username, email, password };
      console.log("Registering:", formData);
      // TODO: Replace with real API call & error handling
    } catch (error) {
      setErrorMsg("Registration failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
          <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-md max-md:mx-auto">
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="mb-12">
                <h3 className="text-slate-900 text-3xl font-semibold">Register</h3>
                <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                  Create a new account
                </p>
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Username</label>
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
                <label className="text-slate-800 text-sm font-medium mb-2 block">Email</label>
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-4 py-3 rounded-lg outline-blue-600"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-slate-800 text-sm font-medium mb-2 block">Password</label>
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

              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                {loading ? "Registering..." : "Register"}
              </button>

              <p className="text-center text-sm mt-4 text-slate-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </form>
          </div>

          <div className="max-md:mt-8">
            <img
              src="../login-image.webp"
              className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover"
              alt="register"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
