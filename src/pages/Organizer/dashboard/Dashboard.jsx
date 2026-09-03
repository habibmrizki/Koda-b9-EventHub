import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Plus,
  Pencil,
  UserCheck,
  BarChart2,
} from "lucide-react";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const events = useSelector((state) => state.events?.items || []);

  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Hitung Indeks & Potong Data Event
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

  // Hitung Total Halaman
  const totalPages = Math.ceil(events.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getEventData = (event) => {
    const registered = event.tickets?.registered ?? event.attendees ?? 0;
    const capacity = event.tickets?.capacity ?? event.capacity ?? 100;
    const image =
      event.media?.thumbnail_url ||
      event.image ||
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5";

    let dateLoc = event.dateLocation;
    if (!dateLoc && event.schedule?.date) {
      const city = event.location?.city || "WIB";
      dateLoc = `${event.schedule.date} · ${city}`;
    }

    return { registered, capacity, image, dateLoc };
  };

  const stats = [
    {
      title: "TOTAL EVENTS",
      value: events.length.toString(),
      subtext: "All time",
      icon: Calendar,
    },
    {
      title: "TOTAL ATTENDEES",
      value: events
        .reduce((acc, curr) => acc + getEventData(curr).registered, 0)
        .toLocaleString(),
      subtext: "Across all events",
      icon: Users,
    },
    {
      title: "AVG FILL RATE",
      value: "57%",
      subtext: "Capacity utilization",
      icon: TrendingUp,
    },
    {
      title: "EVENT VIEWS",
      value: "3,241",
      subtext: "Last 30 days",
      icon: Eye,
    },
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const chartData = [
      { month: "Mar", value: 21 },
      { month: "Apr", value: 38 },
      { month: "May", value: 34 },
      { month: "Jun", value: 56, active: true },
      { month: "Jul", value: 29 },
      { month: "Aug", value: 48 },
    ];

    const ctx = chartRef.current.getContext("2d");

    const topLabelsPlugin = {
      id: "topLabels",
      afterDraw(chart) {
        const { ctx } = chart;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, index) => {
            const value = dataset.data[index];
            ctx.save();
            ctx.fillStyle = "#4b5563";
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(value, bar.x, chart.chartArea.top - 8);
            ctx.restore();
          });
        });
      },
    };

    const initialColors = chartData.map((d) =>
      d.active ? "#ff5522" : "#fccab5",
    );
    const initialHoverColors = chartData.map((d) =>
      d.active ? "#e04818" : "#fbba9f",
    );

    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      plugins: [topLabelsPlugin],
      data: {
        labels: chartData.map((d) => d.month),
        datasets: [
          {
            label: "Registrations",
            data: chartData.map((d) => d.value),
            backgroundColor: initialColors,
            hoverBackgroundColor: initialHoverColors,
            borderRadius: {
              topLeft: 8,
              topRight: 8,
              bottomLeft: 0,
              bottomRight: 0,
            },
            borderSkipped: false,
            categoryPercentage: 0.7,
            barPercentage: 0.85,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 300,
          easing: "easeOutQuart",
        },
        layout: {
          padding: { top: 25 },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const clickedIndex = elements[0].index;
            const chart = chartInstanceRef.current;

            const newColors = chartData.map((_, idx) =>
              idx === clickedIndex ? "#ff5522" : "#fccab5",
            );
            const newHoverColors = chartData.map((_, idx) =>
              idx === clickedIndex ? "#e04818" : "#fbba9f",
            );

            chart.data.datasets[0].backgroundColor = newColors;
            chart.data.datasets[0].hoverBackgroundColor = newHoverColors;

            chart.update();
          }
        },
        onHover: (event, chartElement) => {
          event.native.target.style.cursor = chartElement[0]
            ? "pointer"
            : "default";
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#1f2937",
            padding: 8,
            titleFont: { size: 11 },
            bodyFont: { size: 11 },
            displayColors: false,
            callbacks: {
              label: (item) => `${item.formattedValue} registrations`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: "#9ca3af",
              font: { size: 11, weight: "500" },
            },
            border: { display: false },
          },
          y: {
            min: 0,
            max: 60,
            ticks: {
              stepSize: 20,
              color: "#9ca3af",
              font: { size: 11 },
            },
            grid: {
              color: "#f3f4f6",
              drawTicks: false,
            },
            border: { display: false },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen py-5 px-8 md:px-16 lg:px-20 bg-gray-50/50 p-6 font-sans text-gray-800">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Organizer Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Manage your events and track performance.
          </p>
        </div>
        <button
          onClick={() => navigate("/organizer/create-event")}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-gray-400 tracking-wider">
                  {stat.title}
                </span>
                <Icon className="text-gray-400" size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400">{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Your Events</h2>

          {events.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-400 text-xs">
              Belum ada event yang dibuat. Silakan klik "Create Event" di atas.
            </div>
          ) : (
            currentEvents.map((event) => {
              const { registered, capacity, dateLoc } = getEventData(event);
              const percentage = Math.round((registered / capacity) * 100);

              return (
                <div
                  key={event.id}
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={
                          event.image ||
                          event.media?.thumbnail_url ||
                          event.media?.cover_url
                        }
                        alt={event.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {event.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{dateLoc}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {registered} attendees
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {event.status || "Active"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-end text-xs text-gray-500 font-medium">
                      {capacity} capacity
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() =>
                        navigate(`/organizer/edit-event/${event.id}`)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors cursor-pointer"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors cursor-pointer">
                      <UserCheck size={13} />
                      {registered} attendees
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* PINDAHKAN CONTROL PAGINATION KE SINI  */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-200 gap-3">
              <p className="text-xs text-gray-600">
                Showing{" "}
                <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, events.length)}
                </span>{" "}
                of <span className="font-medium">{events.length}</span> events
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 text-xs border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 bg-white"
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2.5 py-1 text-xs border rounded-md ${
                      currentPage === page
                        ? "bg-orange-500 text-white border-orange-500 font-medium"
                        : "hover:bg-gray-100 bg-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 text-xs border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="text-gray-400" size={18} />
              <h3 className="font-semibold text-gray-800 text-sm">
                Registrations (6 months)
              </h3>
            </div>

            <div className="h-44">
              <canvas ref={chartRef} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">
              Quick Actions
            </h3>
            <button
              onClick={() => navigate("/organizer/create-event")}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              Create New Event
            </button>
            <button
              onClick={() => navigate("/preview")}
              className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors border border-gray-100 cursor-pointer"
            >
              <Eye size={16} />
              Preview as Attendee
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-800 text-sm">
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {events.slice(0, 5).map((event) => {
                const { registered, capacity, dateLoc } = getEventData(event);
                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex gap-2 items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {event.title}
                        </p>
                        <p className="text-gray-400">
                          {dateLoc?.split("·")[0]?.trim() || "TBD"}
                        </p>
                      </div>
                    </div>
                    <span className="text-gray-500 font-medium">
                      {registered}/{capacity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
