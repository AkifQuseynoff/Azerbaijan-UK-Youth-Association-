import { useSite } from "../features/site/SiteContext";
import PageHeader from "../components/ui/PageHeader";

export default function PrivacyPage() {
  const { settings } = useSite();
  return (
    <div className="page-transition">
      <PageHeader title="Privacy Policy" width="max-w-3xl" />
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-10 leading-relaxed text-mute sm:px-8">
        <p>The Azerbaijan UK Youth Association collects membership details so we can run a community organisation in the United Kingdom. We store your name, email, date of birth, city, and optional profile fields you choose to share, and your event bookings (which events you registered for and your ticket codes).</p>
        <p>We use this information to administer membership, send newsletters you opt into, and manage event bookings. Staff running an event can see the names and email addresses of the people registered for it. We do not sell personal data.</p>
        <p>You can update your profile while signed in. To request a copy of your data or deletion of your account, {settings.contactEmail ? <>email {settings.contactEmail}</> : "contact the Association through the Help page"}.</p>
        <p>If you are 16 or 17, please review this notice with a parent or guardian before registering.</p>
        <p>This page is a working draft for the new website and should be reviewed by the Association before public launch.</p>
      </div>
    </div>
  );
}
