import { useSelector } from "react-redux";

export default function DashboardEvents() {
  const events = useSelector((state) => state.events?.items || []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100">
        {events.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-400">
            Belum ada event.
          </div>
        ) : (
          events.map((evt) => {
            const isFull =
              evt.tickets?.is_full ||
              evt.tickets?.registered >= evt.tickets?.capacity;

            const thumbnail =
              evt.coverImage ||
              evt.image ||
              evt.media?.thumbnail_url ||
              "https://images.unsplash.com/photo-1518770660439-4636190af475";

            return (
              <div
                key={evt.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={thumbnail}
                    alt={evt.title}
                    className="w-10 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDate(evt.schedule?.date || evt.eventDate)} •{" "}
                      {evt.location?.city || evt.location || "Online"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-xs font-medium text-gray-500">
                    {evt.tickets?.registered || 0}/
                    {evt.tickets?.capacity || evt.capacity || 100}
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
          })
        )}
      </div>
    </div>
  );
}
