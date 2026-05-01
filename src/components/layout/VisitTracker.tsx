"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VID_KEY = "mub_vid";
const SID_KEY = "mub_sid";
const SID_TS_KEY = "mub_sid_ts";
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 min idle window

function uid(): string {
  // crypto.randomUUID exists in modern browsers; fall back to a short random.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreate(key: string, ttlDays: number): string {
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
  } catch {
    /* private mode */
  }
  const v = uid();
  try {
    localStorage.setItem(key, v);
    document.cookie = `${key}=${v}; Max-Age=${ttlDays * 24 * 60 * 60}; Path=/; SameSite=Lax`;
  } catch {
    /* ignore */
  }
  return v;
}

function getSessionId(): string {
  try {
    const ts = Number(sessionStorage.getItem(SID_TS_KEY) || 0);
    const id = sessionStorage.getItem(SID_KEY);
    if (id && ts && Date.now() - ts < SESSION_TTL_MS) {
      sessionStorage.setItem(SID_TS_KEY, String(Date.now()));
      return id;
    }
  } catch {
    /* ignore */
  }
  const v = uid();
  try {
    sessionStorage.setItem(SID_KEY, v);
    sessionStorage.setItem(SID_TS_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
  return v;
}

export default function VisitTracker({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/admin")) return; // never track admin views

    const visitorId = getOrCreate(VID_KEY, 365);
    const sessionId = getSessionId();
    const referrer = document.referrer || "";

    const body = JSON.stringify({
      path: pathname,
      locale,
      referrer,
      visitorId,
      sessionId,
    });

    const url = "/api/analytics/track";
    try {
      // sendBeacon survives navigations and doesn't block the UI.
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(url, blob)) return;
      }
    } catch {
      /* fall through */
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      /* ignore */
    });
  }, [pathname, locale]);

  return null;
}
