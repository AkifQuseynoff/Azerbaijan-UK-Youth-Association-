import PageHeader from "../components/ui/PageHeader";

export default function TermsPage() {
  return (
    <div className="page-transition">
      <PageHeader title="Terms of Membership" width="max-w-3xl" />
      <div className="mx-auto max-w-3xl space-y-5 px-5 py-10 leading-relaxed text-mute sm:px-8">
        <p>Membership of the Azerbaijan UK Youth Association is free and open to people aged 16–35 with a connection to the Azerbaijani community in the UK, and to others with a genuine interest in our work.</p>
        <p>Members agree to treat other members and staff with respect at events and online. The Association may deactivate an account that is used to harass others or misrepresent the organisation.</p>
        <p>Published news is editorial content of the Association. Members do not have a right to have personal views carried as official news.</p>
        <p>This page is a working draft and should be reviewed by the Association before public launch.</p>
      </div>
    </div>
  );
}
