import communitiesData from "../../../data/Communities.json";

export default function DashboardCommunities() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {communitiesData.map((comm) => (
          <div
            key={comm.id}
            className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={comm.cover_image}
                alt={comm.name}
                className="w-10 h-10 rounded-lg object-cover shrink-0"
              />
              <div>
                <h4 className="text-xs font-bold text-gray-900">{comm.name}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {comm.members_count.toLocaleString()} members •{" "}
                  {comm.upcoming_events_count} upcoming events
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600">
                Active
              </span>
              <button className="text-gray-400 hover:text-gray-600 text-xs">
                •••
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
