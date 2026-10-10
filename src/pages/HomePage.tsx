import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewsCard from "../features/news/NewsCard";
import FlagDivider from "../components/ui/FlagDivider";
import { listLatestPublished } from "../features/news/api";
import type { Article } from "../types";

export default function HomePage() {
  const [latest, setLatest] = useState<Article[]>([]);

  useEffect(() => {
    void listLatestPublished(3).then(setLatest);
  }, []);

  return (
    <div className="page-transition">
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0D1B2A]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1654356813524-2dd96f479a1b?w=1600&h=900&fit=crop&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#002060]/90 via-[#0D1B2A]/70 to-[#001830]/80" />
        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col">
          <div className="flex-1 bg-[#003580]" />
          <div className="flex-1 bg-[#CC2229]" />
          <div className="flex-1 bg-[#00997A]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h1
              className="text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Connecting
              <br />
              <span className="text-[#CC2229]">Azerbaijani</span>
              <br />
              Youth in the{" "}
              <span className="text-[#00997A]">UK</span>
            </h1>
            <p className="text-blue-200 text-lg leading-relaxed mb-10 max-w-lg">
              The Azerbaijan UK Youth Association brings together over 3,200 young people of Azerbaijani heritage across the United Kingdom — sharing culture, building careers, and shaping the future together.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-[#CC2229] hover:bg-[#e83038] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Join the Association
              </Link>
              <Link
                to="/news"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Read Latest News →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "3,200+", label: "Members across the UK", color: "border-[#003580]" },
              { value: "18+", label: "Years serving our community", color: "border-[#CC2229]" },
              { value: "120+", label: "Events held each year", color: "border-[#00997A]" },
              { value: "5", label: "City chapters: London, Manchester, Birmingham, Edinburgh, Cardiff", color: "border-[#003580]" },
            ].map((stat) => (
              <div
                key={stat.value}
                className={`bg-white/8 backdrop-blur-sm border-t-2 ${stat.color} rounded-2xl p-6 hover:bg-white/12 transition-colors`}
              >
                <p className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {stat.value}
                </p>
                <p className="text-blue-200 text-sm leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FlagDivider />

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
            <h2 className="text-4xl md:text-5xl text-[#0D1B2A] mb-6 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              A bridge between two nations, one generation at a time
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              The Azerbaijan UK Youth Association was founded by a group of Azerbaijani students at University College London. What began as a small student society has grown into the leading organisation representing young Azerbaijanis across the United Kingdom.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We champion cultural exchange, educational access, professional development, and civic engagement — ensuring that the Azerbaijani diaspora remains connected to its roots while thriving in British society.
            </p>
            <div className="flex gap-6">
              <Link
                to="/register"
                className="px-6 py-3 bg-[#003580] hover:bg-[#002060] text-white font-semibold rounded-xl transition-colors"
              >
                Become a member
              </Link>
              <Link to="/help" className="px-6 py-3 text-[#003580] font-semibold hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1650222833514-bd19bc2f8665?w=700&h=500&fit=crop&auto=format"
                alt="Azerbaijan UK Youth Association community members at a gathering"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F4F6FB] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#003580] font-semibold text-sm uppercase tracking-wider mb-3">What We Do</p>
            <h2 className="text-4xl text-[#0D1B2A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Three pillars of our mission
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎭",
                color: "bg-[#003580]",
                title: "Culture & Heritage",
                desc: "Celebrating Azerbaijani traditions through festivals, music, art exhibitions, and language programmes — keeping our culture alive in the diaspora.",
              },
              {
                icon: "🎓",
                color: "bg-[#CC2229]",
                title: "Education & Careers",
                desc: "Scholarships, mentorship, career networking nights, and university guidance — helping Azerbaijani youth reach their professional ambitions.",
              },
              {
                icon: "🤝",
                color: "bg-[#00997A]",
                title: "Community & Belonging",
                desc: "A welcoming home for every Azerbaijani in the UK — new arrivals, long-term residents, and second-generation community members alike.",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0D1B2A] mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-2">Latest</p>
              <h2 className="text-4xl text-[#0D1B2A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Community news
              </h2>
            </div>
            <Link to="/news" className="text-[#003580] font-semibold hover:underline hidden sm:block">
              View all news →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 sm:hidden text-center">
            <Link to="/news" className="text-[#003580] font-semibold hover:underline">
              View all news →
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#002060] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl text-white mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to be part of the community?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Membership is free. Join 3,200+ young Azerbaijanis across the UK today.
          </p>
          <Link
            to="/register"
            className="inline-block px-10 py-4 bg-[#CC2229] hover:bg-[#e83038] text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Register for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
