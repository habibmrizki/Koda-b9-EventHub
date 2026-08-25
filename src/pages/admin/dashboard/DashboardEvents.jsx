import eventsData from "../../../data/Events.json";

export default function DashboardEvents() {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {eventsData.map((evt) => {
          const isFull =
            evt.tickets?.is_full ||
            evt.tickets?.registered >= evt.tickets?.capacity;

          return (
            <div
              key={evt.id}
              className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={evt.media?.thumbnail_url}
                  alt={evt.title}
                  className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDate(evt.schedule?.date)} • {evt.location?.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-xs font-medium text-gray-500">
                  {evt.tickets?.registered}/{evt.tickets?.capacity}
                </span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                    isFull
                      ? "bg-rose-50 text-rose-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {isFull ? "Full" : "Active"}
                </span>

                <button className="text-gray-400 hover:text-gray-600 text-xs">
                  •••
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
