import { NavLink, Outlet } from "react-router-dom";
import { LuShield, LuUsers, LuCalendar, LuUserCheck } from "react-icons/lu";

export default function DashboardLayout() {
  const tabs = [
    { name: "Overview", path: "/dashboard/overview", icon: LuShield },
    { name: "Users", path: "/dashboard/users", icon: LuUsers },
    { name: "Events", path: "/dashboard/events", icon: LuCalendar },
    { name: "Communities", path: "/dashboard/communities", icon: LuUserCheck },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-inter text-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* Header Admin Dashboard */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
            <LuShield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">
              Platform management and moderation
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Dashboard Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `shrink-0 border-b-2 py-3 px-1 text-xs font-semibold transition flex items-center gap-2 ${
                      isActive
                        ? "border-orange-500 text-orange-600"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />

                  <span>{tab.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Content Sub-route Dashboard */}
        <div className="mt-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
