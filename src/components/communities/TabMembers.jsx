export default function TabMembers({ members }) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-xs font-inter">
        No members in this community yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-inter">
      {members.map((member) => (
        <div
          key={member.id}
          className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-xs hover:shadow-md transition"
        >
          <img
            src={member.avatar || "https://i.pravatar.cc/150"}
            alt={member.name}
            className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200 shrink-0"
          />
          <div>
            <h4 className="font-bold text-xs text-gray-900">{member.name}</h4>
            <p className="text-[10px] text-gray-500 font-medium">{member.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
