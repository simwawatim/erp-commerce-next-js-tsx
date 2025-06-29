"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-blue-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 
           18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.
           94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-
           2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 
           2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36
            2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
          </svg>
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
