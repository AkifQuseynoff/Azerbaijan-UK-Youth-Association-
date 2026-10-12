import { useId, useRef, useState } from "react";
import { MarkdownBody } from "../markdown";
import { prepareImage, toVideoEmbed } from "../media";
import { coverPublicUrl, uploadCover } from "../api";
import { inputClass } from "../../../components/ui/Field";

type Panel = "image" | "video" | null;

/**
 * The article body box with a small toolbar: headings, bold, lists, pictures and videos, plus a preview.
 * Pictures are shrunk in the browser, uploaded to storage and inserted as a line of text at the cursor.
 */
export default function BodyEditor({ value, onChange, slug }: { value: string; onChange: (next: string) => void; slug: string }) {
  const id = useId();
  const area = useRef<HTMLTextAreaElement>(null);
  const [panel, setPanel] = useState<Panel>(null);
  const [preview, setPreview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [gallery, setGallery] = useState(false);
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const insert = (text: string, joinPrevious = false) => {
    const el = area.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const gap = !before ? "" : joinPrevious ? "\n" : before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const tail = after && !after.startsWith("\n") ? "\n\n" : "";
    const next = `${before}${gap}${text}${tail}${after}`;
    onChange(next);
    requestAnimationFrame(() => {
      el?.focus();
      const pos = (before + gap + text).length;
      el?.setSelectionRange(pos, pos);
    });
  };

  const wrapSelection = (left: string, right = left) => {
    const el = area.current;
    const start = el?.selectionStart ?? 0;
    const end = el?.selectionEnd ?? 0;
    const chosen = value.slice(start, end) || "text";
    onChange(`${value.slice(0, start)}${left}${chosen}${right}${value.slice(end)}`);
    requestAnimationFrame(() => el?.focus());
  };

  const reset = () => {
    setPanel(null);
    setFile(null);
    setAlt("");
    setCaption("");
    setGallery(false);
    setLink("");
    setError("");
  };

  const addImage = async () => {
    setError("");
    if (!file) return setError("Choose a picture first.");
    if (!alt.trim()) return setError("Describe the picture in a few words. It is read aloud to people who cannot see it.");
    setBusy(true);
    try {
      const ready = await prepareImage(file);
      const path = await uploadCover(ready, `${slug || "article"}-body`);
      const url = coverPublicUrl(path);
      const cleanAlt = alt.replace(/[\]\n]/g, " ").trim();
      const cleanCaption = caption.replace(/["\n]/g, " ").trim();
      insert(`![${cleanAlt}](${url}${cleanCaption ? ` "${cleanCaption}"` : ""})`, gallery);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload that picture.");
    } finally {
      setBusy(false);
    }
  };

  const addVideo = () => {
    setError("");
    const embed = toVideoEmbed(link);
    if (!embed) return setError("That link is not supported. Paste a YouTube or Vimeo link.");
    const cleanCaption = caption.replace(/["\n]/g, " ").trim();
    insert(`@[video](${link.trim()}${cleanCaption ? ` "${cleanCaption}"` : ""})`);
    reset();
  };

  const tool = "btn btn-outline btn-sm !h-9 !px-3.5";

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-ink">Body</label>
        <button type="button" onClick={() => setPreview((p) => !p)} aria-pressed={preview} className="text-sm font-semibold text-brand-blue underline underline-offset-4">
          {preview ? "Back to editing" : "Preview"}
        </button>
      </div>

      {!preview && (
        <div className="mb-2 flex flex-wrap gap-2" role="toolbar" aria-label="Formatting">
          <button type="button" className={tool} onClick={() => insert("## Heading")}>Heading</button>
          <button type="button" className={tool} onClick={() => wrapSelection("**")}><b>Bold</b></button>
          <button type="button" className={tool} onClick={() => insert("- First point\n- Second point")}>List</button>
          <button type="button" className={tool} aria-expanded={panel === "image"} onClick={() => { reset(); setPanel(panel === "image" ? null : "image"); }}>Add picture</button>
          <button type="button" className={tool} aria-expanded={panel === "video"} onClick={() => { reset(); setPanel(panel === "video" ? null : "video"); }}>Add video</button>
        </div>
      )}

      {!preview && panel === "image" && (
        <div className="mb-3 space-y-3 rounded-2xl bg-mist p-4">
          <div>
            <label htmlFor={`${id}-file`} className="mb-1 block text-sm font-semibold">Picture</label>
            <input id={`${id}-file`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm" />
            <p className="mt-1 text-xs text-mute">JPG, PNG or WebP. Large photos are shrunk automatically.</p>
          </div>
          <div>
            <label htmlFor={`${id}-alt`} className="mb-1 block text-sm font-semibold">Description *</label>
            <input id={`${id}-alt`} className={inputClass} value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Dancers in traditional dress on stage" />
          </div>
          <div>
            <label htmlFor={`${id}-cap`} className="mb-1 block text-sm font-semibold">Caption (optional)</label>
            <input id={`${id}-cap`} className={inputClass} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Shown under the picture" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={gallery} onChange={(e) => setGallery(e.target.checked)} className="accent-brand-blue" />
            Put it next to the previous picture (makes a gallery)
          </label>
          {error && <p role="alert" className="text-sm text-brand-red-dark">{error}</p>}
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => void addImage()} className="btn btn-blue btn-sm">{busy ? "Uploading…" : "Insert picture"}</button>
            <button type="button" onClick={reset} className="btn btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {!preview && panel === "video" && (
        <div className="mb-3 space-y-3 rounded-2xl bg-mist p-4">
          <div>
            <label htmlFor={`${id}-link`} className="mb-1 block text-sm font-semibold">Video link</label>
            <input id={`${id}-link`} className={inputClass} value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
            <p className="mt-1 text-xs text-mute">YouTube or Vimeo. The video stays on their site; visitors watch it here.</p>
          </div>
          <div>
            <label htmlFor={`${id}-vcap`} className="mb-1 block text-sm font-semibold">Caption (optional)</label>
            <input id={`${id}-vcap`} className={inputClass} value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          {error && <p role="alert" className="text-sm text-brand-red-dark">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={addVideo} className="btn btn-blue btn-sm">Insert video</button>
            <button type="button" onClick={reset} className="btn btn-outline btn-sm">Cancel</button>
          </div>
        </div>
      )}

      {preview ? (
        <div className="rounded-2xl border border-line p-5">{value.trim() ? <MarkdownBody source={value} /> : <p className="text-mute">Nothing to preview yet.</p>}</div>
      ) : (
        <textarea
          id={id}
          ref={area}
          rows={14}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} resize-y font-mono !text-sm`}
        />
      )}
      <p className="mt-1 text-xs text-mute">Pictures and videos are lines of text; you can move or delete them like any other line.</p>
    </div>
  );
}
