import { useState } from "react";
import FlagDivider from "../components/FlagDivider";
import { FAQ } from "../data/faq";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#00997A] font-semibold text-sm uppercase tracking-wider mb-3">Support</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Help & Resources
          </h1>
          <p className="text-blue-200 mt-3 text-lg max-w-xl">
            Everything you need to make the most of your membership.
          </p>
        </div>
      </div>
      <FlagDivider />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { icon: "🎓", title: "Scholarships", desc: "Funding for Azerbaijani students at UK universities.", color: "border-[#003580]" },
            { icon: "🤝", title: "Mentorship", desc: "Connect with professionals who can guide your career.", color: "border-[#CC2229]" },
            { icon: "📋", title: "Volunteer", desc: "Give back by joining our volunteer network.", color: "border-[#00997A]" },
            { icon: "🆘", title: "Welfare Support", desc: "Guidance on housing, legal aid, and welfare rights.", color: "border-[#003580]" },
          ].map((item) => (
            <div key={item.title} className={`bg-white rounded-2xl p-6 border-t-4 ${item.color} shadow-sm`}>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          <div>
            <h2 className="text-3xl text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between text-left px-6 py-5 hover:bg-gray-50"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-[#0D1B2A] text-base pr-4">{item.q}</span>
                    <svg className={`w-5 h-5 text-[#003580] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <div className="h-px bg-gray-100 mb-4" />
                      <p className="text-gray-600 leading-relaxed text-sm">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#002060] rounded-2xl p-7 text-white">
              <h3 className="text-2xl mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Contact us</h3>
              <div className="space-y-4 text-sm">
                {[
                  { label: "Email", value: "info@aukya.org.uk" },
                  { label: "Address", value: "Azerbaijan UK Youth Association, 14 Cavaye Place, London SW10 9PT" },
                  { label: "Phone", value: "+44 20 7946 0000" },
                  { label: "Hours", value: "Mon–Fri, 10:00–18:00 GMT" },
                ].map((c) => (
                  <div key={c.label}>
                    <p className="text-blue-300 text-xs">{c.label}</p>
                    <p className="text-white">{c.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400">The contact form will send email once the association mailbox is connected. For now, use the address above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
