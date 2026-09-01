import { useState } from "react";
import { Link } from "react-router-dom";
import FlagDivider from "../components/FlagDivider";
import { EVENTS } from "../data/events";
import { categoryColors } from "../types";

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState("All");
  const types = ["All", "Culture", "Education", "Networking", "Leadership"];
  const filtered = selectedType === "All" ? EVENTS : EVENTS.filter((e) => e.type === selectedType);

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#00997A] font-semibold text-sm uppercase tracking-wider mb-3">Calendar</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Upcoming events
          </h1>
        </div>
      </div>
      <FlagDivider />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedType === t
                  ? "bg-[#00997A] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          {filtered.map((event) => {
            const soldOutSoon = event.spotsLeft <= 20;
            const pctFull = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);
            return (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-100 grid md:grid-cols-[1fr_auto] gap-6 items-start"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[event.type] || "bg-gray-200 text-gray-700"}`}>
                      {event.type}
                    </span>
                    {soldOutSoon && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                        Almost full
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0D1B2A] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-4">
                    <span>{event.date} · {event.time}</span>
                    <span>{event.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-xs">
                      <div className="h-2 rounded-full bg-[#003580]" style={{ width: `${pctFull}%` }} />
                    </div>
                    <span className="text-xs text-gray-400">{event.spotsLeft} spots left</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Link
                    to="/register"
                    className="px-6 py-3 bg-[#003580] hover:bg-[#002060] text-white font-semibold rounded-xl transition-colors whitespace-nowrap shadow"
                  >
                    Book a spot
                  </Link>
                  <span className="text-xs text-gray-400">Free for members</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
