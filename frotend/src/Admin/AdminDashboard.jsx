import React, { useEffect, useState } from "react";
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
  AlertCircle
} from "lucide-react";
import { fetchBookings } from "./Admin";

// Modern color palette for statuses
const getStatusStyles = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-emerald-500/20";
    case "failed":
      return "bg-red-50 text-red-700 border border-red-200 ring-red-500/20";
    case "pending":
      return "bg-amber-50 text-amber-700 border border-amber-200 ring-amber-500/20";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const limit = 10;

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, bookings]);

  async function loadBookings() {
    try {
      setLoading(true);
      const res = await fetchBookings({ page, limit });
      setBookings(res.data || []);
      setFiltered(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Error loading bookings:", err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    if (!search.trim()) {
      setFiltered(bookings);
      return;
    }

    const q = search.toLowerCase();
    const result = bookings.filter((b) =>
      [
        b.full_name,
        b.email,
        b.phone,
        b.razorpay_order_id,
        b.payment_id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );

    setFiltered(result);
  }

  function handleLogout() {
    if(window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("admin_token");
      navigate("/login");
    }
  }

  // Calculate some quick stats for the UI (Optional enhancement)
  const totalRevenueOnPage = filtered.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* TOP NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Admin Console
            </h1>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Page Revenue</p>
                <h3 className="text-2xl font-bold">₹{totalRevenueOnPage.toLocaleString()}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold">{total}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-full">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Current Page</p>
                <h3 className="text-2xl font-bold">{page}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* TABLE HEADER & SEARCH */}
          <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p>Syncing data...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                <AlertCircle size={48} className="mb-3 opacity-50" />
                <p className="text-lg font-medium">No bookings found</p>
                <p className="text-sm">Try adjusting your search filters.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Order Details</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Customer Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                             {b.full_name ? b.full_name.charAt(0).toUpperCase() : <User size={16}/>}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{b.full_name}</p>
                            <p className="text-xs text-gray-500">{b.email}</p>
                            <p className="text-xs text-gray-500">{b.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          <span>{new Date(b.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-xs text-gray-400 pl-6 mt-1">
                           {new Date(b.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>

                      {/* Order IDs Column */}
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-medium text-gray-400 w-12">Order:</span>
                           <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 select-all">
                             {b.razorpay_order_id || "N/A"}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-xs font-medium text-gray-400 w-12">Pay ID:</span>
                           <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700 select-all">
                             {b.payment_id || "N/A"}
                           </span>
                        </div>
                      </td>

                      {/* Amount Column */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-800 text-base">
                          ₹{Number(b.amount).toLocaleString()}
                        </span>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ring-1 ring-inset ${getStatusStyles(b.payment_status)}`}>
                          {b.payment_status?.toUpperCase() || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION FOOTER */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Showing page <span className="font-semibold text-gray-900">{page}</span> of <span className="font-semibold text-gray-900">{Math.max(1, Math.ceil(total / limit))}</span>
            </span>

            <div className="flex gap-2">
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <button
                disabled={page * limit >= total || loading}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}