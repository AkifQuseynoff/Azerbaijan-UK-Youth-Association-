import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
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
            <li><Link to="/" className="text-gray-300 hover:text-white text-sm transition-colors">Home</Link></li>
            <li><Link to="/news" className="text-gray-300 hover:text-white text-sm transition-colors">News</Link></li>
            <li><Link to="/events" className="text-gray-300 hover:text-white text-sm transition-colors">Events</Link></li>
            <li><Link to="/podcast" className="text-gray-300 hover:text-white text-sm transition-colors">Podcast</Link></li>
            <li><Link to="/register" className="text-gray-300 hover:text-white text-sm transition-colors">Join Us</Link></li>
            <li><Link to="/help" className="text-gray-300 hover:text-white text-sm transition-colors">Help</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-5">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li><Link to="/help" className="hover:text-white transition-colors">Scholarships</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Mentorship Programme</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Volunteer Network</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Membership</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500 px-6">
        © 2026 Azerbaijan UK Youth Association. All rights reserved. · Designed with pride in London
      </div>
    </footer>
  );
}
