"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("token");
    if (!access) {
      router.push("/login");
      return;
    }

    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role"));
    setProfileImage(localStorage.getItem("profilePictureUrl"));
  }, [router]);

  const defaultImage =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <header className="flex shadow-lg py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo and title */}
       <a href="/" className="flex items-center space-x-2">

         <div className="flex items-center">
           <img
              className="h-12 w-auto object-contain rounded-md shadow-sm"
              src="/logo.jpg"
              alt="Company Logo"
            />
          <span className="ml-2 text-xl font-semibold">Dashboard</span>
        </div>
       </a>

        {/* Welcome message and profile image */}
        <div className="flex items-center space-x-4">
          {username && role && (
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Welcome, {username}</p>
              <p className="text-xs text-gray-500">Role: {role}</p>
            </div>
          )}

          <div className="relative">
            <a href="/profile" className="block">
              <img
                src={profileImage || defaultImage}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
              />
            </a>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
