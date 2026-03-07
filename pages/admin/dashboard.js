import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  BeakerIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  TruckIcon,
  PhotoIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Dynamic imports with fallbacks
import dynamic from 'next/dynamic';

// Dynamically import chart components with SSR disabled
const ChartComponents = dynamic(
  () => import('@/components/ChartComponents'),
  { ssr: false, loading: () => <ChartFallback /> }
);

import { format, subDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

import MdImageUpload from "@/components/MdImageUpload";
import HeroImageUpload from "@/components/HeroImageUpload";

// Fallback component for charts
function ChartFallback() {
  return (
    <div className="h-[300px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400">Loading charts...</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // After mounting, we can show theme
  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Generate mock data for charts
  const generateAppointmentData = () => {
    const today = new Date();
    const dates = eachDayOfInterval({
      start: subDays(today, 6),
      end: today
    });
    
    return {
      labels: dates.map(date => format(date, 'EEE')),
      values: dates.map(() => Math.floor(Math.random() * 50) + 20)
    };
  };

  const appointmentData = generateAppointmentData();

  const chartData = {
    labels: appointmentData.labels,
    datasets: [
      {
        label: 'Appointments',
        data: appointmentData.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        titleColor: darkMode ? '#f3f4f6' : '#111827',
        bodyColor: darkMode ? '#d1d5db' : '#4b5563',
        borderColor: darkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? '#374151' : '#f3f4f6',
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: darkMode ? '#9ca3af' : '#6b7280',
        }
      }
    }
  };

  const departmentDistribution = {
    labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General'],
    datasets: [
      {
        data: [30, 20, 25, 15, 35],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderWidth: 0,
        borderRadius: 8,
        spacing: 4,
      }
    ]
  };

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`);
      const result = await res.json();
      setData(result);
      
      // Generate notifications based on data
      const newNotifications = [];
      if (result.appointmentsToday > 30) {
        newNotifications.push({
          id: 1,
          type: 'warning',
          message: `High appointment volume today: ${result.appointmentsToday} appointments`,
          time: new Date()
        });
      }
      if (result.recentDoctors?.length === 0) {
        newNotifications.push({
          id: 2,
          type: 'info',
          message: 'No recent doctor additions. Consider updating department records.',
          time: new Date()
        });
      }
      setNotifications(newNotifications);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      if (showRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => fetchDashboardData(true), 300000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
              Loading dashboard...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium animate-pulse">
              Loading dashboard data...
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 shadow-2xl"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  Welcome back, Admin
                </h1>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm lg:text-base max-w-2xl">
                Here's what's happening with your hospital today. 
                {data?.appointmentsToday > 0 && ` You have ${data.appointmentsToday} appointments scheduled.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Time Range Selector */}
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm transition-all duration-200"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm transition-all duration-200 relative"
                >
                  <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full text-[8px] sm:text-[10px] flex items-center justify-center text-white font-bold">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div key={notif.id} className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-start gap-2 sm:gap-3">
                                {notif.type === 'warning' ? (
                                  <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">{notif.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {format(notif.time, 'hh:mm a')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                            No new notifications
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Refresh Button */}
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg sm:rounded-xl transition-all duration-200 disabled:opacity-50"
              >
                <ArrowPathIcon className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Quick Stats Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total Revenue', value: '$124.5K', change: '+12.3%', icon: CurrencyDollarIcon },
              { label: 'Patient Satisfaction', value: '94%', change: '+2.1%', icon: ChartBarIcon },
              { label: 'Bed Occupancy', value: '78%', change: '-3.2%', icon: BuildingOfficeIcon },
              { label: 'Avg Wait Time', value: '12 min', change: '-2 min', icon: ClockIcon },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-white/70 text-xs">{stat.label}</p>
                <p className="text-white font-bold text-base sm:text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Image Upload Section - Compact for dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl">
                <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base lg:text-lg">Hero Slider Management</h2>
                <p className="text-purple-100 text-xs sm:text-sm">Manage homepage carousel images</p>
              </div>
            </div>
            <div className="p-3 sm:p-4 lg:p-6">
              {/* Dashboard-optimized HeroImageUpload with reduced height */}
              <div className="dashboard-hero-wrapper">
                <HeroImageUpload isAdmin={true} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* MD Image Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-6 lg:mb-8"
        >
          <MdImageUpload isAdmin={true} />
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8"
        >
          <StatCard 
            title="Total Doctors" 
            value={data?.doctors || 0} 
            icon={<UserGroupIcon />} 
            color="blue"
            trend="+5.2%"
            trendUp={true}
          />
          <StatCard 
            title="Appointments Today" 
            value={data?.appointmentsToday || 0} 
            icon={<CalendarDaysIcon />} 
            color="purple"
            trend="-2.1%"
            trendUp={false}
          />
          <StatCard 
            title="Active Patients" 
            value={data?.activePatients || 0} 
            icon={<UserGroupIcon />} 
            color="cyan"
            trend="+8.3%"
            trendUp={true}
          />
          <StatCard 
            title="Total Staffs" 
            value={data?.totalStaffs || 0} 
            icon={<ShieldCheckIcon />} 
            color="green"
            trend="+3.7%"
            trendUp={true}
          />
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4 lg:gap-6">

          {/* Charts Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-4 sm:space-y-4 lg:space-y-6"
          >
            {/* Appointment Trends Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Appointment Trends</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Last 7 days vs previous period</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    <ArrowUpIcon className="w-3 h-3" />
                    +12.5%
                  </span>
                </div>
              </div>
              <div className="h-[200px] sm:h-[250px] lg:h-[300px]">
                <ChartComponents 
                  type="line"
                  data={chartData}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* Recent Doctors Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg lg:text-xl">Recent Doctors</h3>
                    <p className="text-blue-100 text-xs sm:text-sm mt-1">Latest additions to your team</p>
                  </div>
                  <Link 
                    href="/admin/doctors" 
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm text-center"
                  >
                    View All
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table
                  headers={["Doctor", "Specialization", "Department", "Experience", "Status"]}
                  rows={(data?.recentDoctors || []).map((d) => [
                    <div key="name" className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                        {d.name?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">{d.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {d.id || 'DOC001'}</p>
                      </div>
                    </div>,
                    <span className="text-xs sm:text-sm">{d.specialization}</span>,
                    <span className="text-xs sm:text-sm">{d.department || "General"}</span>,
                    <span className="text-xs sm:text-sm">{d.experience_years ? `${d.experience_years} years` : "N/A"}</span>,
                    <span key="status" className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                      Active
                    </span>
                  ])}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4 sm:space-y-4 lg:space-y-6"
          >
            {/* Department Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white mb-3 sm:mb-4">Department Distribution</h3>
              <div className="h-[150px] sm:h-[180px] lg:h-[200px]">
                <ChartComponents 
                  type="doughnut"
                  data={departmentDistribution}
                  options={{
                    cutout: '70%',
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
                {departmentDistribution.labels.map((label, idx) => (
                  <div key={label} className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: departmentDistribution.datasets[0].backgroundColor[idx] }}></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-900 to-gray-900 text-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-xl">
              <h3 className="font-bold text-sm sm:text-base lg:text-lg flex items-center gap-2 mb-3 sm:mb-4">
                <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                <QuickLink href="/admin/doctors" label="Add New Doctor" icon={<BeakerIcon />} />
                <QuickLink href="/admin/departments" label="Manage Departments" icon={<BuildingOfficeIcon />} />
                <QuickLink href="/admin/services" label="Update Services" icon={<ClipboardDocumentListIcon />} />
                <QuickLink href="/admin/reports" label="Generate Reports" icon={<DocumentTextIcon />} />
              </div>
            </div>

            {/* Top Doctors */}
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <h3 className="font-bold text-sm sm:text-base lg:text-lg">Top Doctors</h3>
                <p className="text-blue-100 text-xs sm:text-sm">Based on patient ratings</p>
              </div>

              <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                {(data?.topDoctors || []).map((doc, idx) => (
                  <Doctor 
                    key={doc.id} 
                    name={doc.name} 
                    specialty={doc.specialization}
                    rating={4.5 + Math.random() * 0.5}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full -ml-10 -mb-10"></div>
              
              <div className="relative">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg sm:rounded-xl">
                    <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base lg:text-lg">Emergency</h3>
                    <p className="text-red-100 text-xs sm:text-sm">24/7 Available</p>
                  </div>
                </div>
                
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">+8809610-818888</p>
                <p className="text-red-100 text-xs sm:text-sm">Avg response: 8 min</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, icon, color, trend, trendUp }) {
  const colors = {
    blue: "from-blue-500 to-blue-600 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    cyan: "from-cyan-500 to-cyan-600 bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    purple: "from-purple-500 to-purple-600 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green: "from-green-500 to-green-600 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-1 sm:gap-2 mt-1 sm:mt-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{value}</h2>
            {trend && (
              <span className={`flex items-center text-xs font-medium ${trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trendUp ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                {trend}
              </span>
            )}
          </div>
        </div>

        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br ${colors[color].split(' ')[0]} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-3 sm:mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.random() * 40 + 60}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full rounded-full bg-gradient-to-r ${colors[color].split(' ')[0]}`}
        />
      </div>
    </motion.div>
  );
}

function Table({ headers, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="p-6 sm:p-8 lg:p-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-3 sm:mb-4">
          <DocumentTextIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">No data available</p>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-700/50">
            {headers.map((h, idx) => (
              <th key={idx} className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, i) => (
            <motion.tr 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Doctor({ name, specialty, rating, rank }) {
  return (
    <motion.div 
      whileHover={{ x: 2 }}
      className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
            {name?.split(' ').map(n => n?.[0]).join('') || 'DR'}
          </div>
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-gray-900 border-2 border-white dark:border-gray-800">
            #{rank}
          </span>
        </div>
        <div>
          <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{specialty}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{rating?.toFixed(1)}</span>
          <span className="text-yellow-400 text-xs">★</span>
        </div>
        <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
}

function QuickLink({ href, label, icon }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="flex-1 text-xs sm:text-sm group-hover:translate-x-1 transition-transform">{label}</span>
      <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-all rotate-45" />
    </Link>
  );
}