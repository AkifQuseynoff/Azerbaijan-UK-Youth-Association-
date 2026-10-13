import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { SITE } from "../../config/site";
import { EMPTY_SETTINGS, getSiteSettings } from "./api";
import type { SiteSettings } from "./api";

type Value = { settings: SiteSettings; reload: () => Promise<void> };
const Ctx = createContext<Value>({ settings: EMPTY_SETTINGS, reload: async () => undefined });

/** The shipped defaults in config/site.ts, overridden by whatever an admin has saved under Site details. */
function withDefaults(s: SiteSettings): SiteSettings {
  return {
    ...s,
    about: s.about || SITE.story || "",
    charityNumber: s.charityNumber || SITE.charityNumber || "",
    contactEmail: s.contactEmail || SITE.contact.email || "",
    contactPhone: s.contactPhone || SITE.contact.phone || "",
    contactAddress: s.contactAddress || SITE.contact.address || "",
    contactHours: s.contactHours || SITE.contact.hours || "",
  };
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(withDefaults(EMPTY_SETTINGS));

  const reload = useCallback(async () => {
    try {
      setSettings(withDefaults(await getSiteSettings()));
    } catch {
      /* keep the defaults; the site works without these details */
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const value = useMemo(() => ({ settings, reload }), [settings, reload]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
