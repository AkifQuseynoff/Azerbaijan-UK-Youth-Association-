import { Link } from "react-router-dom";
import { useSite } from "../features/site/SiteContext";
import LegalLayout, { LegalSection } from "./LegalLayout";

const UPDATED = "13 October 2026";

export default function PrivacyPage() {
  const { settings } = useSite();
  const contact = settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> : <Link to="/help">the Help page</Link>;

  return (
    <LegalLayout
      title="Privacy policy"
      updated={UPDATED}
      intro="What we collect when you join the Association or book an event, why, who sees it, and the choices you have."
    >
      <LegalSection title="Who we are">
        <p>
          This website is run by the Azerbaijan UK Youth Association (&ldquo;the Association&rdquo;, &ldquo;we&rdquo;). We decide what personal data we collect and how it is used, which makes us the
          &ldquo;controller&rdquo; under UK data protection law (the UK GDPR and the Data Protection Act 2018).
          {settings.charityNumber ? ` We are a registered charity in England and Wales, number ${settings.charityNumber}.` : ""}
        </p>
        <p>Questions about your data, or requests to use your rights, can be sent to {contact}.</p>
      </LegalSection>

      <LegalSection title="What we collect">
        <ul>
          <li><strong>Your membership details:</strong> first and last name, email address, date of birth, and city. You may also give a phone number, occupation, university, your interests, and how you heard about us.</li>
          <li><strong>Your password.</strong> It is handled by our sign-in provider and stored in a scrambled (hashed) form. We cannot read it.</li>
          <li><strong>Your choices and when you made them:</strong> that you accepted the Terms of Membership, and whether you asked for our newsletter.</li>
          <li><strong>Your event bookings:</strong> which events you registered for or joined the waitlist for, the status of each booking, your ticket code, and whether you were checked in.</li>
          <li><strong>Technical information:</strong> when you visit, our hosting provider receives standard connection details such as your IP address and browser type. We keep a sign-in session in your browser so you stay logged in.</li>
        </ul>
        <p>We do not use advertising or analytics cookies, and we do not track you across other websites.</p>
      </LegalSection>

      <LegalSection title="Why we use your data">
        <ul>
          <li><strong>To run your membership and your event bookings</strong> (confirm places, manage waitlists, send tickets and reminders). This is needed to provide the service you asked for.</li>
          <li><strong>To email you about your account and bookings</strong>, such as confirming your address, resetting your password, and telling you if an event changes. We send these because they are needed to run the service.</li>
          <li><strong>To send our newsletter</strong>, only if you ticked the box. This is based on your consent, and you can withdraw it at any time under Your membership.</li>
          <li><strong>To run the Association safely and fairly</strong>, for example to enforce the Terms of Membership and keep the community welcoming. We do this because it is in the legitimate interests of the Association and its members.</li>
          <li><strong>To meet legal duties</strong>, where the law requires us to keep or share information.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Who can see your data">
        <p>
          <strong>Our team.</strong> Volunteers with an editor or admin role can see the names, email addresses and phone numbers of people registered for the events they run, and can download an attendee list. Admins can also manage member accounts. Access is limited to what their role needs, and attendee lists should be deleted once an event is over.
        </p>
        <p><strong>Other members cannot see your details.</strong> The site has no member directory and no way for members to message each other.</p>
        <p><strong>Companies that help us run the site (our &ldquo;processors&rdquo;):</strong></p>
        <ul>
          <li>Supabase: our database, sign-in and file storage. Our project is hosted in London.</li>
          <li>Vercel: hosts the website.</li>
          <li>Resend: sends our emails.</li>
          <li>Cloudflare: manages our domain name.</li>
        </ul>
        <p>They may only use your data to provide their service to us. Some of them process data outside the UK, for example in the United States. Where they do, we rely on safeguards that UK law recognises.</p>
        <p>
          <strong>Embedded players.</strong> Podcast and article pages can show players or videos from YouTube, Vimeo, Spotify, Apple Podcasts or SoundCloud. When you press play, that company receives your data and may set cookies under its own privacy policy. YouTube videos load from YouTube&apos;s privacy-enhanced address, which does not set tracking cookies until you press play.
        </p>
        <p>We do not sell your personal data and we do not share it for advertising.</p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <ul>
          <li>We keep your membership details while you are a member.</li>
          <li>If you ask us to delete your account, we delete your details and bookings within one month, unless the law requires us to keep something.</li>
          <li>Attendee lists downloaded for an event are for that event only and should be deleted afterwards.</li>
          <li>Copies in our providers&apos; backups are removed when those backups expire.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what data we hold about you and give you a copy;</li>
          <li>correct anything that is wrong (you can edit most details yourself under <Link to="/account">Your membership</Link>);</li>
          <li>delete your data and close your account;</li>
          <li>limit how we use your data, or object to a particular use;</li>
          <li>send your data to you in a portable format;</li>
          <li>stop sending you the newsletter (untick the box under Your membership, or ask us).</li>
        </ul>
        <p>Write to {contact} and we will reply within one month. If you are unhappy with how we handle your data, you can complain to the Information Commissioner&apos;s Office at <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a>. We would appreciate the chance to put things right first.</p>
      </LegalSection>

      <LegalSection title="Members aged 16 and 17">
        <p>You must be 16 or over to join. If you are 16 or 17, please read this policy with a parent or guardian. We collect only what we need to run your membership and bookings.</p>
      </LegalSection>

      <LegalSection title="Keeping your data safe">
        <p>Connections to the site are encrypted, passwords are stored hashed, and staff access depends on role. No online service is perfectly secure, so please choose a strong password and tell us straight away if you think your account has been misused.</p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>If we change this policy in a way that matters, we will update the date at the top and, where appropriate, tell members by email.</p>
      </LegalSection>
    </LegalLayout>
  );
}
