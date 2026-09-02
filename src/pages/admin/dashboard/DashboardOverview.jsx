import { useSelector } from "react-redux";
import { LuUsers, LuCalendar, LuFlag, LuUserCheck } from "react-icons/lu";

export default function DashboardOverview() {
  const registeredUsers = useSelector(
    (state) => state.users?.registeredUsers || [],
  );
  const events = useSelector((state) => state.events?.items || []);
  const communities = useSelector((state) => state.communities?.items || []);

  const totalUsers = registeredUsers.length;
  const totalEvents = events.length;
  const totalCommunities = communities.length;

  const avgFillRate = (() => {
    if (events.length === 0) return 0;

    let totalRegistered = 0;
    let totalCapacity = 0;

    events.forEach((evt) => {
      totalRegistered += evt.tickets?.registered || evt.attendees || 0;
      totalCapacity += evt.tickets?.capacity || evt.capacity || 100;
    });

    if (totalCapacity === 0) return 0;
    return Math.min(100, Math.round((totalRegistered / totalCapacity) * 100));
  })();

  const stats = [
    {
      title: "TOTAL USERS",
      value: totalUsers.toLocaleString(),
      desc: `+${totalUsers} registered`,
      icon: LuUsers,
    },
    {
      title: "TOTAL EVENTS",
      value: totalEvents.toString(),
      desc: `${events.filter((e) => !e.tickets?.is_full).length} active`,
      icon: LuCalendar,
    },
    {
      title: "COMMUNITIES",
      value: totalCommunities.toString(),
      desc: "All active",
      icon: LuUserCheck,
    },
    {
      title: "AVG FILL RATE",
      value: `${avgFillRate}%`,
      desc: "Across all events",
      icon: LuFlag,
    },
  ];

  const latestUser = registeredUsers[registeredUsers.length - 1];
  const latestEvent = events[0];

  const activities = [
    {
      id: 1,
      icon: LuUsers,
      color: "text-emerald-500",
      text: latestUser
        ? `${latestUser.fullName} baru saja mendaftar`
        : "Belum ada pendaftaran baru",
      time: " Terbaru",
    },
    {
      id: 2,
      icon: LuCalendar,
      color: "text-blue-500",
      text: latestEvent
        ? `"${latestEvent.title}" memiliki ${latestEvent.tickets?.registered || 0} pendaftar`
        : "Belum ada event aktif",
      time: "Terbaru",
    },
    {
      id: 3,
      icon: LuFlag,
      color: "text-orange-500",
      text: `${totalEvents} total event telah dibuat di platform`,
      time: "System",
    },
    {
      id: 4,
      icon: LuUserCheck,
      color: "text-emerald-500",
      text: `${totalCommunities} komunitas aktif terhubung`,
      time: "System",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Grid Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.title}
                </p>
                <Icon className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                {stat.value}
              </h3>
              <p className="text-xs text-gray-400 mt-1">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Activity List */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="text-sm font-bold text-gray-900 mb-4">
          Recent Platform Activity
        </h4>
        <div className="space-y-4">
          {activities.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${act.color}`} />
                  <span className="text-gray-700 font-medium">{act.text}</span>
                </div>
                <span className="text-gray-400 text-[11px]">{act.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
