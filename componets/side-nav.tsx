import React, { useEffect, useState } from "react";
import { logoutUser } from "../api/services/base-url";

const SideNav = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role");
      setRole(storedRole);
    }
  }, []);

  if (role === null) {
    return null;
  }

  return (
    <nav className="bg-[#f7f7f8] h-screen fixed top-0 left-0 min-w-[250px] py-6 px-4">
      <div className="relative">
        <a href="/">
          <img
            src="https://readymadeui.com/readymadeui.svg"
            alt="logo"
            className="w-[150px]"
          />
        </a>

        <div className="absolute -right-6 top-1 h-6 w-6 p-[6px] cursor-pointer bg-[#007bff] flex items-center justify-center rounded-full">
          {/* Collapse button can be added here */}
        </div>
      </div>

      <div className="overflow-auto py-6 h-full mt-4">
        <ul className="space-y-2">
          <li>
            <a
              href="/"
              className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
            >
              <span>Dashboard</span>
            </a>
          </li>

          {(role === "HR" || role === "ADMIN") && (
            <li>
              <a
                href="/employees"
                className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
              >
                <span>Employees</span>
              </a>
            </li>
          )}

          {(role === "SALES" || role === "ADMIN") && (
            <>
              <li>
                <a
                  href="/products"
                  className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
                >
                  <span>Products</span>
                </a>
              </li>
              <li>
                <a
                  href="/sales"
                  className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
                >
                  <span>Sales</span>
                </a>
              </li>
            </>
          )}

          {(role === "FINANCE" || role === "ADMIN") && (
            <>
              <li>
                <a
                  href="/finance"
                  className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
                >
                  <span>Finance</span>
                </a>
              </li>
              <li>
                <a
                  href="/payroll"
                  className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
                >
                  <span>Salary</span>
                </a>
              </li>
            </>
          )}

          {/* HR also sees Salary if not already shown via Finance */}
          {role === "HR" && (
            <li>
              <a
                href="/payroll"
                className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
              >
                <span>Salary</span>
              </a>
            </li>
          )}

          <li>
            <a
              href="/profile"
              className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
            >
              <span>Profile</span>
            </a>
          </li>

          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                logoutUser();
              }}
              className="text-slate-800 font-medium hover:text-slate-900 hover:bg-gray-200 text-[15px] flex items-center rounded px-4 py-2 transition-all"
            >
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SideNav;
