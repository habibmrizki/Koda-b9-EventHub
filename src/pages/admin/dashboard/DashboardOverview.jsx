import { LuUsers, LuCalendar, LuFlag, LuUserCheck } from "react-icons/lu";

export default function DashboardOverview() {
  const stats = [
    {
      title: "TOTAL USERS",
      value: "12,841",
      desc: "+284 this month",
      icon: LuUsers,
    },
    {
      title: "TOTAL EVENTS",
      value: "12",
      desc: "8 upcoming",
      icon: LuCalendar,
    },
    {
      title: "COMMUNITIES",
      value: "8",
      desc: "All active",
      icon: LuUserCheck,
    },
    {
      title: "AVG FILL RATE",
      value: "74%",
      desc: "Across all events",
      icon: LuFlag,
    },
  ];

  const activities = [
    {
      id: 1,
      icon: LuUsers,
      color: "text-emerald-500",
      text: "284 new users registered this month",
      time: "Today",
    },
    {
      id: 2,
      icon: LuCalendar,
      color: "text-blue-500",
      text: '"AI Product Design Summit" reached 234 registrations',
      time: "2h ago",
    },
    {
      id: 3,
      icon: LuFlag,
      color: "text-orange-500",
      text: "3 new organizer applications received",
      time: "5h ago",
    },
    {
      id: 4,
      icon: LuUsers,
      color: "text-emerald-500",
      text: "Jakarta AI & ML Club crossed 2,000 members",
      time: "1d ago",
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
