"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../customer/helpers/CartContext";

const dummyData = [
  "Apple",
  "Banana",
  "Cherry",
  "Date",
  "Elderberry",
  "Fig",
  "Grape",
  "Honeydew",
];

const CustomerDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(false);
  };

  const filteredResults = searchTerm
    ? dummyData.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dummyData;

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newHistory = [
      ...chatHistory,
      { sender: "user" as const, text: userMessage }
    ];
    setChatHistory(newHistory);
    setIsThinking(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const botReply = data.response || "Sorry, I couldn't understand that.";

      setChatHistory([...newHistory, { sender: "bot" as const, text: botReply }]);
    } catch (error) {
      setChatHistory([
        ...newHistory,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }

    setUserMessage("");
    setIsThinking(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <Link href="/customer/dashboard" className="block">
                  <img
                    className="h-12 w-auto object-contain rounded-md shadow-sm"
                    src="/logo.jpg"
                    alt="Company Logo"
                  />

                </Link>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Cart */}
              <Link href="/customer/cart" className="relative p-1 text-gray-400 hover:text-white">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold text-red-100 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              </Link>

              {/* Chatbot Toggle */}
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {showChatbot ? "Close Chat" : "Chatbot"}
              </button>

              {/* Login/Logout */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Optional Mobile Menu */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pt-2 pb-3">
            <a href="#" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Team</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Projects</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Calendar</a>
          </div>
        </div>
      </nav>

      {/* Chatbot Panel */}
      {showChatbot && (
        <div className="fixed bottom-4 right-4 w-80 max-w-full bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col h-[450px]">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b bg-gray-100 rounded-t-lg">
            <h3 className="text-sm font-semibold text-gray-700">💬 FAQ Chatbot</h3>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {chatHistory.length === 0 && (
              <div className="bg-gray-100 p-2 rounded text-gray-700 text-xs text-center">
                👋 Welcome! Ask me anything about your account or services.
              </div>
            )}

            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-xs italic">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 border-t bg-white">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your question..."
              className="w-full p-2 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={sendMessage}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerDashboard;
