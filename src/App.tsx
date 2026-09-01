import { useState, useRef } from "react";

type Page = "home" | "news" | "events" | "register" | "help";
type NewsCategory = "All" | "Culture" | "Events" | "Community" | "Announcements";

interface NewsArticle {
  id: number;
  title: string;
  date: string;
  category: NewsCategory;
  image: string;
  excerpt: string;
  author: string;
  readTime: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  spots: number;
  spotsLeft: number;
  type: string;
}

const NEWS: NewsArticle[] = [
  {
    id: 1,
    title: "Azerbaijan UK Youth Association Annual Cultural Festival Returns to London This October",
    date: "28 Aug 2026",
    category: "Events",
    image: "https://images.unsplash.com/photo-1612779361237-966485682855?w=800&h=500&fit=crop&auto=format",
    excerpt: "We are proud to announce the return of our Annual Cultural Festival, celebrating the rich heritage of Azerbaijan in the heart of London. Join thousands of community members for music, dance, art, and traditional cuisine.",
    author: "Association Communications",
    readTime: "3 min read",
  },
  {
    id: 2,
    title: "Azerbaijan UK Youth Association Launches New Mentorship Programme for Young Professionals",
    date: "15 Aug 2026",
    category: "Community",
    image: "https://images.unsplash.com/photo-1662714201492-710fd1126949?w=800&h=500&fit=crop&auto=format",
    excerpt: "Applications are now open for our flagship mentorship programme connecting young Azerbaijani professionals in the UK with experienced industry leaders across finance, law, medicine, and technology.",
    author: "Dr. Leyla Hasanova",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Official Partnership Signed with the British Council",
    date: "5 Aug 2026",
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1654356813524-2dd96f479a1b?w=800&h=500&fit=crop&auto=format",
    excerpt: "The Association has signed a landmark cultural partnership with the British Council to promote language exchange, educational opportunities, and cross-cultural dialogue between Azerbaijan and the United Kingdom.",
    author: "Association Executive Board",
    readTime: "2 min read",
  },
  {
    id: 4,
    title: "Novruz Celebrations Draw Record Attendance at Wembley",
    date: "21 Mar 2026",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1746774191590-f46dafc02796?w=800&h=500&fit=crop&auto=format",
    excerpt: "Over 2,400 community members gathered at Wembley Arena for our Novruz spring celebration — the largest gathering of the Azerbaijani diaspora in UK history. Traditional bonfire jumping, music, and festive tables marked the spring equinox.",
    author: "Farid Mammadov",
    readTime: "5 min read",
  },
  {
    id: 5,
    title: "New Scholarship Fund Opens for Azerbaijani Students at UK Universities",
    date: "10 Mar 2026",
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1650222833514-bd19bc2f8665?w=800&h=500&fit=crop&auto=format",
    excerpt: "The Association, in partnership with the Heydar Aliyev Foundation, announces a new scholarship fund offering up to £5,000 per year for eligible Azerbaijani students enrolled in UK universities.",
    author: "Association Communications",
    readTime: "3 min read",
  },
  {
    id: 6,
    title: "Photography Workshop: Documenting Our Diaspora Story",
    date: "1 Feb 2026",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1612779361237-966485682855?w=800&h=500&fit=crop&auto=format",
    excerpt: "Award-winning photographer Aysel Alekberova leads a weekend workshop exploring diaspora identity through the lens. Limited to 20 participants — all equipment provided.",
    author: "Aysel Alekberova",
    readTime: "2 min read",
  },
];

const EVENTS: Event[] = [
  {
    id: 1,
    title: "Cultural Festival 2026",
    date: "18 Oct 2026",
    time: "12:00 – 20:00",
    location: "Southbank Centre, London",
    description: "Our flagship annual event celebrating Azerbaijani culture through music, dance, traditional crafts, and authentic cuisine. Live performances from artists flown in from Baku.",
    spots: 800,
    spotsLeft: 234,
    type: "Culture",
  },
  {
    id: 2,
    title: "Azerbaijani Language Classes — Autumn Term",
    date: "6 Sep 2026",
    time: "10:00 – 12:00, every Saturday",
    location: "Camden Community Centre, London",
    description: "Free weekly Azerbaijani language classes for all levels, from complete beginners to advanced speakers. Taught by certified language tutors.",
    spots: 30,
    spotsLeft: 8,
    type: "Education",
  },
  {
    id: 3,
    title: "Career Networking Night — Finance & Law",
    date: "25 Sep 2026",
    time: "18:30 – 21:00",
    location: "The Gherkin, 30 St Mary Axe, London",
    description: "An exclusive evening connecting Azerbaijani professionals in the City. Keynote from a senior partner at a top-5 law firm followed by structured networking.",
    spots: 120,
    spotsLeft: 42,
    type: "Networking",
  },
  {
    id: 4,
    title: "Youth Leadership Summit 2026",
    date: "11 Oct 2026",
    time: "09:00 – 17:00",
    location: "King's College London, Strand Campus",
    description: "A full-day summit for young Azerbaijani leaders aged 18–30. Panel discussions, workshops on civic engagement, and a closing address from the Azerbaijani Ambassador to the UK.",
    spots: 200,
    spotsLeft: 67,
    type: "Leadership",
  },
  {
    id: 5,
    title: "Mugham Music Evening",
    date: "4 Oct 2026",
    time: "19:00 – 21:30",
    location: "Barbican Silk Street, London",
    description: "An intimate evening of traditional Azerbaijani mugham music performed by the Qarabağ Ensemble. Post-concert reception included.",
    spots: 150,
    spotsLeft: 15,
    type: "Culture",
  },
];

const FAQ = [
  {
    q: "Who can join the Association?",
    a: "The Azerbaijan UK Youth Association welcomes all young people of Azerbaijani heritage living in the United Kingdom, as well as UK citizens who have a genuine interest in Azerbaijani culture and community. Membership is open to those aged 16–35.",
  },
  {
    q: "Is membership free?",
    a: "Yes, membership is entirely free and open to all eligible young people of Azerbaijani heritage in the UK.",
  },
  {
    q: "How do I register for events?",
    a: "Once you are a registered member, you can book event tickets through your member dashboard. Some events are open to non-members — these are clearly marked on the Events page.",
  },
  {
    q: "I am a student in the UK — can I access the scholarship fund?",
    a: "Yes. Undergraduate and postgraduate students of Azerbaijani origin enrolled at any UK university can apply. Scholarship applications open each January. See our Help resources for the application pack.",
  },
  {
    q: "How can I volunteer or contribute?",
    a: "We are always looking for volunteers — from event coordination and social media management to mentoring and legal support. Fill in the Volunteer Interest form on the Help page or email us directly.",
  },
  {
    q: "Where are you based?",
    a: "Our secretariat is in London, but we have active local chapters in Manchester, Birmingham, Edinburgh, and Cardiff. Reach out via the contact form and we will connect you with your nearest chapter.",
  },
];

const categoryColors: Record<string, string> = {
  Culture: "bg-teal-600 text-white",
  Events: "bg-blue-700 text-white",
  Community: "bg-purple-600 text-white",
  Announcements: "bg-red-600 text-white",
  Education: "bg-emerald-600 text-white",
  Networking: "bg-indigo-600 text-white",
  Leadership: "bg-amber-600 text-white",
};

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 bg-[#003580]" />
          <div className="flex-1 bg-[#CC2229]" />
          <div className="flex-1 bg-[#00997A]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-xs tracking-tighter leading-none" style={{ fontFamily: "'DM Serif Display', serif" }}>AZ</span>
        </div>
      </div>
      <div className="leading-tight">
        <p className="text-white font-bold text-base tracking-wide leading-none">Az Youth UK</p>
        <p className="text-blue-200 text-[10px] tracking-wider uppercase leading-none mt-0.5">Azerbaijan UK Youth Association</p>
      </div>
    </div>
  );
}

function NavBar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks: { label: string; page: Page }[] = [
    { label: "Home", page: "home" },
    { label: "News", page: "news" },
    { label: "Events", page: "events" },
    { label: "Help", page: "help" },
    { label: "Register", page: "register" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#002060] border-b border-[#003580]/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setPage("home")} className="focus:outline-none">
          <Logo />
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.page === "register" ? (
              <button
                key={link.page}
                onClick={() => setPage(link.page)}
                className="ml-4 px-5 py-2 rounded-full bg-[#CC2229] hover:bg-[#e83038] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Join Us
              </button>
            ) : (
              <button
                key={link.page}
                onClick={() => setPage(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page === link.page
                    ? "bg-white/15 text-white"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            )
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#002060] border-t border-[#003580]/40 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => { setPage(link.page); setMobileOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                page === link.page
                  ? "bg-white/15 text-white"
                  : "text-blue-200 hover:text-white hover:bg-white/10"
              } ${link.page === "register" ? "mt-2 bg-[#CC2229] text-white text-center" : ""}`}
            >
              {link.page === "register" ? "Join Us Free" : link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0D1B2A]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1654356813524-2dd96f479a1b?w=1600&h=900&fit=crop&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#002060]/90 via-[#0D1B2A]/70 to-[#001830]/80" />

        {/* Decorative vertical flag strip */}
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
              <button
                onClick={() => setPage("register")}
                className="px-8 py-4 bg-[#CC2229] hover:bg-[#e83038] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Join the Association
              </button>
              <button
                onClick={() => setPage("news")}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm"
              >
                Read Latest News →
              </button>
            </div>
          </div>

          {/* Stats */}
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

      {/* Flag divider */}
      <div className="h-1.5 flex">
        <div className="flex-1 bg-[#003580]" />
        <div className="flex-1 bg-[#CC2229]" />
        <div className="flex-1 bg-[#00997A]" />
      </div>

      {/* About */}
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
              <button
                onClick={() => setPage("register")}
                className="px-6 py-3 bg-[#003580] hover:bg-[#002060] text-white font-semibold rounded-xl transition-colors"
              >
                Become a member
              </button>
              <button
                onClick={() => setPage("help")}
                className="px-6 py-3 text-[#003580] font-semibold hover:underline"
              >
                Learn more →
              </button>
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

      {/* Pillars */}
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

      {/* Latest news preview */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-2">Latest</p>
              <h2 className="text-4xl text-[#0D1B2A]" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Community news
              </h2>
            </div>
            <button onClick={() => setPage("news")} className="text-[#003580] font-semibold hover:underline hidden sm:block">
              View all news →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {NEWS.slice(0, 3).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-8 sm:hidden text-center">
            <button onClick={() => setPage("news")} className="text-[#003580] font-semibold hover:underline">
              View all news →
            </button>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-[#002060] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl text-white mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Ready to be part of the community?
          </h2>
          <p className="text-blue-200 text-lg mb-8">
            Membership is free. Join 3,200+ young Azerbaijanis across the UK today.
          </p>
          <button
            onClick={() => setPage("register")}
            className="px-10 py-4 bg-[#CC2229] hover:bg-[#e83038] text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Register for Free
          </button>
        </div>
      </section>
    </div>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer">
      <div className="aspect-[16/9] overflow-hidden bg-gray-100">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-200"}`}>
            {article.category}
          </span>
          <span className="text-gray-400 text-xs">{article.readTime}</span>
        </div>
        <h3 className="text-lg font-bold text-[#0D1B2A] leading-snug mb-2 group-hover:text-[#003580] transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </article>
  );
}

function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("All");
  const categories: NewsCategory[] = ["All", "Culture", "Events", "Community", "Announcements"];
  const filtered = activeCategory === "All" ? NEWS : NEWS.filter((a) => a.category === activeCategory);

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      {/* Header */}
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">Community News</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Stories from our community
          </h1>
        </div>
      </div>

      <div className="h-1 flex">
        <div className="flex-1 bg-[#003580]" />
        <div className="flex-1 bg-[#CC2229]" />
        <div className="flex-1 bg-[#00997A]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#003580] text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-20 text-gray-400">No articles in this category yet.</p>
        )}
      </div>
    </div>
  );
}

function EventsPage({ setPage }: { setPage: (p: Page) => void }) {
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
      <div className="h-1 flex">
        <div className="flex-1 bg-[#003580]" />
        <div className="flex-1 bg-[#CC2229]" />
        <div className="flex-1 bg-[#00997A]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {types.map((t) => (
            <button
              key={t}
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
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#003580]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {event.date} · {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#CC2229]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-xs">
                      <div
                        className="h-2 rounded-full bg-[#003580] transition-all"
                        style={{ width: `${pctFull}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{event.spotsLeft} spots left</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    onClick={() => setPage("register")}
                    className="px-6 py-3 bg-[#003580] hover:bg-[#002060] text-white font-semibold rounded-xl transition-colors whitespace-nowrap shadow"
                  >
                    Book a spot
                  </button>
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

function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    city: "",
    occupation: "",
    university: "",
    memberType: "standard",
    interests: [] as string[],
    heardFrom: "",
    newsletter: true,
    terms: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const interestOptions = [
    "Cultural events", "Language classes", "Career networking", "Scholarship opportunities",
    "Mentorship", "Volunteering", "Sports & recreation", "Arts & music",
  ];

  const handleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-transition min-h-screen bg-[#F4F6FB] flex items-center justify-center px-6 py-24">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-[#00997A]/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#00997A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl text-[#0D1B2A] mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Welcome, {form.firstName}!
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            Your membership application has been received. Check your inbox at <strong>{form.email}</strong> for a confirmation email with next steps.
          </p>
          <div className="h-1 flex rounded-full overflow-hidden mb-8">
            <div className="flex-1 bg-[#003580]" />
            <div className="flex-1 bg-[#CC2229]" />
            <div className="flex-1 bg-[#00997A]" />
          </div>
          <p className="text-gray-400 text-sm">We look forward to seeing you at our next event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">Membership</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Join our community
          </h1>
          <p className="text-blue-200 mt-3 text-lg">Free membership · Takes 3 minutes</p>
        </div>
      </div>
      <div className="h-1 flex">
        <div className="flex-1 bg-[#003580]" />
        <div className="flex-1 bg-[#CC2229]" />
        <div className="flex-1 bg-[#00997A]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s ? "bg-[#003580] text-white shadow-md" :
                step > s ? "bg-[#00997A] text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step > s ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-[#003580]" : "text-gray-400"} hidden sm:block`}>
                {s === 1 ? "Personal details" : s === 2 ? "Your interests" : "Confirm"}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 w-10 ${step > s ? "bg-[#00997A]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Personal details
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First name *</label>
                    <input
                      required
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                      placeholder="Aysel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name *</label>
                    <input
                      required
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                      placeholder="Mammadova"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                      placeholder="aysel@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth *</label>
                    <input
                      required
                      type="date"
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City in the UK *</label>
                    <select
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors bg-white"
                    >
                      <option value="">Select city</option>
                      <option>London</option>
                      <option>Manchester</option>
                      <option>Birmingham</option>
                      <option>Edinburgh</option>
                      <option>Cardiff</option>
                      <option>Leeds</option>
                      <option>Glasgow</option>
                      <option>Bristol</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                    <input
                      type="text"
                      value={form.occupation}
                      onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                      placeholder="Student / Software Engineer / etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">University (if applicable)</label>
                    <input
                      type="text"
                      value={form.university}
                      onChange={(e) => setForm({ ...form, university: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                      placeholder="University College London"
                    />
                  </div>
                </div>

              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Your interests
                </h2>
                <p className="text-gray-500 text-sm mb-6">Select all that apply — helps us tailor what we send you.</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {interestOptions.map((interest) => (
                    <label
                      key={interest}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.interests.includes(interest) ? "border-[#00997A] bg-teal-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        form.interests.includes(interest) ? "bg-[#00997A] border-[#00997A]" : "border-gray-300"
                      }`} onClick={() => handleInterest(interest)}>
                        {form.interests.includes(interest) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">How did you hear about us?</label>
                  <select
                    value={form.heardFrom}
                    onChange={(e) => setForm({ ...form, heardFrom: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors bg-white"
                  >
                    <option value="">Select an option</option>
                    <option>Friend or family member</option>
                    <option>Social media (Instagram)</option>
                    <option>Social media (Facebook)</option>
                    <option>University / college</option>
                    <option>Google search</option>
                    <option>Attended an event</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Confirm your registration
                </h2>
                <div className="bg-[#F4F6FB] rounded-xl p-6 mb-6 space-y-3">
                  {[
                    { label: "Name", value: `${form.firstName} ${form.lastName}` },
                    { label: "Email", value: form.email },
                    { label: "City", value: form.city },
                    { label: "Membership", value: "Standard Member (Free)" },
                    { label: "Interests", value: form.interests.length > 0 ? form.interests.join(", ") : "None selected" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 text-sm">
                      <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
                      <span className="text-[#0D1B2A] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.newsletter}
                      onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
                      className="mt-0.5 accent-[#003580]"
                    />
                    <span className="text-sm text-gray-600">
                      Send me our newsletter with events, news, and opportunities (max once per week).
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={form.terms}
                      onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                      className="mt-0.5 accent-[#003580]"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the <span className="text-[#003580] underline cursor-pointer">Terms of Membership</span> and{" "}
                      <span className="text-[#003580] underline cursor-pointer">Privacy Policy</span>.{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
              >
                ← Back
              </button>
            ) : <div />}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="px-8 py-3 bg-[#003580] hover:bg-[#002060] text-white font-semibold rounded-xl transition-colors shadow"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-[#CC2229] hover:bg-[#e83038] text-white font-semibold rounded-xl transition-colors shadow-lg"
              >
                Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function HelpPage() {
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
      <div className="h-1 flex">
        <div className="flex-1 bg-[#003580]" />
        <div className="flex-1 bg-[#CC2229]" />
        <div className="flex-1 bg-[#00997A]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Quick links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {[
            { icon: "🎓", title: "Scholarships", desc: "Funding for Azerbaijani students at UK universities.", color: "border-[#003580]" },
            { icon: "🤝", title: "Mentorship", desc: "Connect with professionals who can guide your career.", color: "border-[#CC2229]" },
            { icon: "📋", title: "Volunteer", desc: "Give back by joining our volunteer network.", color: "border-[#00997A]" },
            { icon: "🆘", title: "Welfare Support", desc: "Guidance on housing, legal aid, and welfare rights.", color: "border-[#003580]" },
          ].map((item) => (
            <div
              key={item.title}
              className={`bg-white rounded-2xl p-6 border-t-4 ${item.color} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* FAQ */}
          <div>
            <h2 className="text-3xl text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <button
                    className="w-full flex items-center justify-between text-left px-6 py-5 hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-semibold text-[#0D1B2A] text-base pr-4">{item.q}</span>
                    <svg
                      className={`w-5 h-5 text-[#003580] flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
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

          {/* Contact */}
          <div className="space-y-5">
            <div className="bg-[#002060] rounded-2xl p-7 text-white">
              <h3 className="text-2xl mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Contact us</h3>
              <div className="space-y-4 text-sm">
                {[
                  { icon: "✉️", label: "Email", value: "info@aukya.org.uk" },
                  { icon: "📍", label: "Address", value: "Azerbaijan UK Youth Association, 14 Cavaye Place, London SW10 9PT" },
                  { icon: "📞", label: "Phone", value: "+44 20 7946 0000" },
                  { icon: "🕒", label: "Hours", value: "Mon–Fri, 10:00–18:00 GMT" },
                ].map((c) => (
                  <div key={c.label} className="flex gap-3">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <p className="text-blue-300 text-xs">{c.label}</p>
                      <p className="text-white">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#0D1B2A] mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Send a message
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors"
                />
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-[#003580] transition-colors resize-none"
                />
                <button className="w-full py-3 bg-[#003580] hover:bg-[#002060] text-white font-semibold rounded-xl transition-colors">
                  Send message
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0D1B2A] mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Follow us
              </h3>
              <div className="flex gap-3">
                {["Instagram", "Facebook", "Twitter", "LinkedIn"].map((s) => (
                  <div
                    key={s}
                    className="flex-1 bg-[#F4F6FB] hover:bg-[#003580] text-gray-600 hover:text-white rounded-xl py-2.5 text-xs font-semibold text-center transition-all cursor-pointer"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer className="bg-[#0D1B2A] text-white">
      <div className="h-1 flex">
        <div className="flex-1 bg-[#003580]" />
        <div className="flex-1 bg-[#CC2229]" />
        <div className="flex-1 bg-[#00997A]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-gray-400 mt-5 leading-relaxed text-sm max-w-xs">
            The leading organisation representing young people of Azerbaijani heritage across the United Kingdom.
          </p>
          <p className="text-gray-500 text-xs mt-6">
            Registered charity in England and Wales · No. 1162847
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-5">Navigate</h4>
          <ul className="space-y-3">
            {(["home", "news", "events", "register", "help"] as Page[]).map((p) => (
              <li key={p}>
                <button
                  onClick={() => setPage(p)}
                  className="text-gray-300 hover:text-white text-sm capitalize transition-colors"
                >
                  {p === "register" ? "Join Us" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-5">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            {["Scholarships", "Mentorship Programme", "Volunteer Network", "Language Classes", "Privacy Policy", "Contact"].map((r) => (
              <li key={r}>
                <span className="hover:text-white cursor-pointer transition-colors">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500 px-6">
        © 2026 Azerbaijan UK Youth Association. All rights reserved. · Designed with pride in London 🇦🇿 🇬🇧
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const handleSetPage = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-full flex flex-col">
      <NavBar page={page} setPage={handleSetPage} />
      <main className="flex-1 pt-16">
        {page === "home" && <HomePage setPage={handleSetPage} />}
        {page === "news" && <NewsPage />}
        {page === "events" && <EventsPage setPage={handleSetPage} />}
        {page === "register" && <RegisterPage />}
        {page === "help" && <HelpPage />}
      </main>
      <Footer setPage={handleSetPage} />
    </div>
  );
}
