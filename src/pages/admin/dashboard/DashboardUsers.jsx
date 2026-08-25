import { useState } from "react";

export default function DashboardUsers() {
  const [search, setSearch] = useState("");

  const users = [
    {
      id: 1,
      name: "Alex Kim",
      email: "alex.kim@example.com",
      role: "attendee",
      status: "active",
      joined: "Mar 2025",
    },
    {
      id: 2,
      name: "Rizky Pratama",
      email: "rizky@example.com",
      role: "organizer",
      status: "active",
      joined: "Jan 2025",
    },
    {
      id: 3,
      name: "Siti Rahayu",
      email: "siti@example.com",
      role: "attendee",
      status: "active",
      joined: "Apr 2025",
    },
    {
      id: 4,
      name: "Hendra Wijaya",
      email: "hendra@example.com",
      role: "organizer",
      status: "suspended",
      joined: "Feb 2025",
    },
    {
      id: 5,
      name: "Anisa Putri",
      email: "anisa@example.com",
      role: "attendee",
      status: "active",
      joined: "May 2025",
    },
  ];

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search Input Container */}
      <div className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full text-xs px-3 py-2 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>

      {/* Table Wrapper */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-400 font-semibold uppercase text-[10px] bg-gray-50/50 dark:bg-gray-800/50">
                <th className="py-3 px-6">USER</th>
                <th className="py-3 px-6">ROLE</th>
                <th className="py-3 px-6">STATUS</th>
                <th className="py-3 px-6">JOINED</th>
                <th className="py-3 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition"
                >
                  <td className="py-3 px-6">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">
                      {user.email}
                    </p>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        user.role === "organizer"
                          ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                        user.status === "active"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-gray-500 dark:text-gray-400">
                    {user.joined}
                  </td>
                  <td className="py-3 px-6 text-right text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                    •••
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
