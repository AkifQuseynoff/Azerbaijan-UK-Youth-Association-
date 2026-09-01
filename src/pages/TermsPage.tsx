import FlagDivider from "../components/FlagDivider";

export default function TermsPage() {
  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Terms of Membership</h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-5 text-gray-600 leading-relaxed">
        <p>Membership of the Azerbaijan UK Youth Association is free and open to people aged 16–35 with a connection to the Azerbaijani community in the UK, and to others with a genuine interest in our work.</p>
        <p>Members agree to treat other members and staff with respect at events and online. The Association may deactivate an account that is used to harass others or misrepresent the organisation.</p>
        <p>Published news is editorial content of the Association. Members do not have a right to have personal views carried as official news.</p>
        <p>This page is a working draft and should be reviewed by the Association before public launch.</p>
      </div>
    </div>
  );
}
