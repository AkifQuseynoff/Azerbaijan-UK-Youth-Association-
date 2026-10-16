import { LEGAL } from "../config/site";

/** The company details UK law asks every business website to show. */
export default function CompanyNotice({ className = "", linkClassName = "underline underline-offset-2" }: { className?: string; linkClassName?: string }) {
  return (
    <p className={className}>
      {LEGAL.name} is a {LEGAL.kind} registered in {LEGAL.registeredIn}, company number{" "}
      <a href={LEGAL.companiesHouseUrl} target="_blank" rel="noopener noreferrer" className={linkClassName}>{LEGAL.number}</a>. Registered office: {LEGAL.office}.
    </p>
  );
}
