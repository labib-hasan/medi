import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { requireAdminRole, adminLogout, getStoredAdminUser } from "../utils/adminAuth";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const user = getStoredAdminUser();
    setCurrentUser(user);
    
    // Verify user has valid admin role
    const authorized = requireAdminRole(router);
    setIsAuthorized(authorized);
    setIsChecking(false);
  }, [router]);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "MD Message", path: "/admin/md-message" },
    { name: "Photo Gallery", path: "/admin/gallery" },
    { name: "Contact Info", path: "/admin/contact" },
    { name: "Doctors", path: "/admin/doctors" },
    { name: "Departments", path: "/admin/departments" },
    { name: "Services", path: "/admin/services" },
    { name: "News", path: "/admin/news" },
  ];

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FB]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authorized (will redirect)
  if (!isAuthorized) {
    return null;
  }

  const handleLogout = () => {
    adminLogout();z
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-xl font-bold text-blue-600">
          🏥 Health Journal
        </div>

        <nav className="space-y-2 px-4">
          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-lg text-sm font-medium
              ${
                router.pathname === item.path
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-100"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search doctor, patient..."
            className="text-black w-1/3 px-4 py-2 border rounded-lg text-sm focus:outline-none"
          />

          <div className="flex items-center gap-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
              {currentUser?.name || 'Admin'} ({currentUser?.role || 'Unknown'})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
