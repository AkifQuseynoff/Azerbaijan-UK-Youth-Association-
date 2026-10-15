import { Link } from "react-router-dom";
import { useSite } from "../features/site/SiteContext";
import LegalLayout, { LegalSection } from "./LegalLayout";

const UPDATED = "15 October 2026";

export default function TermsPage() {
  const { settings } = useSite();
  const contact = settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> : <Link to="/help">the Help page</Link>;

  return (
    <LegalLayout
      title="Terms of membership"
      updated={UPDATED}
      intro="The simple rules for being part of the Association and using this website."
    >
      <LegalSection title="Who can join">
        <p>
          Membership of the Azerbaijan UK Youth Association is free. It is open to people aged 16 or over who live in the United Kingdom and who are of Azerbaijani heritage or have a genuine interest in Azerbaijani culture and community. By creating an account you confirm that you meet these conditions and that you accept these terms and our <Link to="/privacy">privacy policy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Your account">
        <ul>
          <li>Give accurate details and keep them up to date.</li>
          <li>Keep one account for yourself. Keep your password private. You are responsible for what happens under your account.</li>
          <li>Tell us if you think someone else has used your account.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we expect everyone to behave">
        <p>Be respectful to other members, volunteers and speakers, at events and online. We do not allow harassment, discrimination, abuse, or pretending to be someone else or to speak for the Association. Do not misuse the website, try to get into parts of it that are not meant for you, or interfere with how it works.</p>
      </LegalSection>

      <LegalSection title="Events and bookings">
        <ul>
          <li>Registering for an event reserves a place if one is available. Some events have a waitlist, and places are offered in the order people joined.</li>
          <li>Your ticket code is personal to you. Please do not share it.</li>
          <li>If you can no longer come, cancel your booking so someone else can take the place.</li>
          <li>We may change, move or cancel an event, for example because of speaker availability or safety. We will update the website and email people registered when we can.</li>
          <li>Events run by volunteers may have their own rules, such as age limits or venue requirements. We will say so on the event page.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Content on this website">
        <p>The text, logo, pictures and design of this website belong to the Association or are used with permission. News and articles are published by the Association as its own content. Having an account does not give you the right to have your own views published as official Association news. Please do not copy or reuse our material without asking, except for personal use or to share a link.</p>
        <p>The podcast and some pages use players from other companies. Their own terms apply to those players.</p>
        <p>
          Links to other websites, and the university societies listed in our directory, are there for your convenience. The societies are independent student groups run by their own committees, and a listing does not mean we run, endorse or answer for them, their events or their websites.
        </p>
      </LegalSection>

      <LegalSection title="Suspending or closing an account">
        <p>If someone breaks these terms, we may warn them, remove content, or suspend or close their account, with or without notice where there is a risk to others. You can close your account at any time by contacting us at {contact}.</p>
      </LegalSection>

      <LegalSection title="Our responsibility">
        <p>The Association is run by volunteers, and we do our best to keep the website and events running well. We cannot promise the website will always be available or free of errors, and the information on it is for general guidance. Nothing in these terms limits any right you have under the law that cannot be limited, including for death or personal injury caused by negligence.</p>
      </LegalSection>

      <LegalSection title="Which law applies">
        <p>These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you may also bring proceedings in your local courts.</p>
      </LegalSection>
      <LegalSection title="Changes">
        <p>We may update these terms as the Association grows. When we make an important change, we will update the date above and, where appropriate, tell members by email. Using the website after a change means you accept the new terms.</p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>Questions about these terms? Write to {contact}.</p>
      </LegalSection>
    </LegalLayout>
  );
}
