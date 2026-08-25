import { useState } from "react";

export default function TabDiscussion({ discussions = [], onAddDiscussion }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (onAddDiscussion) {
      onAddDiscussion(inputText);
    }
    setInputText("");
  };

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
          alt="Current User Avatar"
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Start a discussion..."
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-4 pr-10 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600 font-bold p-1 transition cursor-pointer"
          >
            &#10148;
          </button>
        </div>
      </form>

      {/* Discussion List */}
      <div className="space-y-3">
        {discussions.map((item, index) => (
          <div key={item.id || index} className="flex items-start gap-3">
            <img
              src={
                item.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  item.author || "User",
                )}`
              }
              alt={item.author}
              className="w-9 h-9 rounded-full object-cover shrink-0 mt-1"
            />
            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-900">
                  {item.author}
                </span>
                <span className="text-xs text-gray-400">{item.timeAgo}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
