import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  User,
  LayoutDashboard,
  TrendingUp,
  AlertCircle,
  Tag,
  School,
  Menu,
  X
} from "lucide-react";

// Import the functions from your Admin.js file
import { fetchBookings, adminLogout } from "./Admin";

const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
    case "success":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const limit = 10;

  // LOAD DATA FROM ADMIN.JS
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // We pass the current page and limit to your fetchBookings function
      const res = await fetchBookings({ page, limit });
      setBookings(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Dashboard Load Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // LOGOUT HANDLER
  async function handleLogout() {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await adminLogout();
        navigate("/login");
      } catch (err) {
        alert("Logout failed: " + err.message);
      }
    }
  }

  // Client-side search filter for the current page records
  const filteredBookings = bookings.filter((b) =>
    [b.full_name, b.email, b.razorpay_order_id]
      .some(val => val?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalRevenueOnPage = filteredBookings.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-red-500 rounded-lg text-white shadow-lg shadow-orange-500/20">
              <LayoutDashboard size={22} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">Admin Console</h1>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight sm:hidden">Admin</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button
              onClick={handleLogout}
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all border border-red-100"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-xl p-4 animate-in slide-in-from-top-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-100"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-xl"><CreditCard size={28} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Page Revenue</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">₹{totalRevenueOnPage.toLocaleString()}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={28} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Entries</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{total}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-50 text-green-600 rounded-xl"><Calendar size={28} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Current Page</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{page}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <User size={20} className="text-gray-400" />
              Booking Records
            </h2>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm w-full sm:w-80 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="w-full">
            {loading ? (
              <div className="p-20 text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Fetching records...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-20 text-center text-gray-400">
                <AlertCircle size={64} className="mx-auto mb-4 opacity-10" />
                <p className="text-lg font-medium">No records found matching your criteria.</p>
              </div>
            ) : (
              <>
                {/* Desktop View - Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Education</th>
                        <th className="px-6 py-4">Transaction Details</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-700 font-bold uppercase text-xs shadow-sm ring-2 ring-white">
                                {b.full_name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{b.full_name}</p>
                                <p className="text-xs text-gray-500">{b.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                                <Tag size={12} className="text-orange-400" />
                                <span>{b.ticket_type || "General"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                <School size={12} />
                                <span className="truncate max-w-[150px]" title={b.college}>{b.college || "N/A"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-[10px] uppercase font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded w-fit">OD: {b.razorpay_order_id}</p>
                              <p className="text-[10px] uppercase font-mono text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded w-fit">ID: {b.payment_id || '---'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-800">₹{b.amount}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(b.payment_status)}`}>
                              {b.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View - Cards */}
                <div className="md:hidden flex flex-col gap-4 p-4 bg-gray-50/50">
                  {filteredBookings.map((b) => (
                    <div key={b.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">

                      {/* Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-orange-700 font-bold uppercase text-xs shadow-sm">
                            {b.full_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{b.full_name}</p>
                            <p className="text-xs text-gray-500">{b.email}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyles(b.payment_status)}`}>
                          {b.payment_status}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 font-medium">Ticket Type</p>
                          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                            <Tag size={14} className="text-orange-400" />
                            {b.ticket_type || "General"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-400 font-medium">Amount</p>
                          <p className="font-bold text-gray-900">₹{b.amount}</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <p className="text-xs text-gray-400 font-medium">College</p>
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <School size={14} />
                            {b.college || "N/A"}
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-gray-50 text-[10px] font-mono text-gray-400 flex flex-col gap-1">
                        <div className="flex justify-between">
                          <span>ORDER:</span>
                          <span>{b.razorpay_order_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PAYMENT:</span>
                          <span>{b.payment_id || '---'}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              Showing page <span className="font-bold text-gray-900">{page}</span> of {Math.ceil(total / limit) || 1}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border bg-white rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              ><ChevronLeft size={18} /></button>
              <button
                disabled={page * limit >= total || loading}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border bg-white rounded-lg hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
              ><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
