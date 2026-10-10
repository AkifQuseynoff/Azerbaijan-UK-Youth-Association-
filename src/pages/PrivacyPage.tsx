import { SITE } from "../config/site";
import FlagDivider from "../components/ui/FlagDivider";

export default function PrivacyPage() {
  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Privacy Policy</h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-5 text-gray-600 leading-relaxed">
        <p>The Azerbaijan UK Youth Association collects membership details so we can run a community organisation in the United Kingdom. We store your name, email, date of birth, city, and optional profile fields you choose to share, and your event bookings (which events you registered for and your ticket codes).</p>
        <p>We use this information to administer membership, send newsletters you opt into, and manage event bookings. Staff running an event can see the names and email addresses of the people registered for it. We do not sell personal data.</p>
        <p>You can update your profile while signed in. To request a copy of your data or deletion of your account, {SITE.contact.email ? <>email {SITE.contact.email}</> : "contact the Association through the Help page"}.</p>
        <p>If you are 16 or 17, please review this notice with a parent or guardian before registering.</p>
        <p>This page is a working draft for the new website and should be reviewed by the Association before public launch.</p>
      </div>
    </div>
  );
}
