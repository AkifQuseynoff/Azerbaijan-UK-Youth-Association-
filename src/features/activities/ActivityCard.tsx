import CoverImage from "../../components/ui/CoverImage";
import { formatActivityDate } from "./api";
import type { Activity } from "./api";

/** One thing the association has done. If a link was added the whole card opens it. */
export default function ActivityCard({ activity }: { activity: Activity }) {
  const body = (
    <>
      <div className="aspect-[16/10] overflow-hidden bg-mist">
        <CoverImage src={activity.coverUrl} imgClassName="h-full w-full object-cover" />
      </div>
      <div className="p-6">
        {activity.happenedOn && <p className="eyebrow mb-2 !text-brand-green">{formatActivityDate(activity.happenedOn)}</p>}
        <h3 className="font-display text-[1.3rem] font-medium leading-snug tracking-tight">{activity.title}</h3>
        {activity.summary && <p className="mt-2 line-clamp-4 text-[0.95rem] text-mute">{activity.summary}</p>}
        {activity.linkUrl && <p className="mt-3 text-sm font-semibold text-brand-blue">Read more →</p>}
      </div>
    </>
  );
  return (
    <article className="card press overflow-hidden">
      {activity.linkUrl ? (
        <a href={activity.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
          {body}
        </a>
      ) : (
        body
      )}
    </article>
  );
}
