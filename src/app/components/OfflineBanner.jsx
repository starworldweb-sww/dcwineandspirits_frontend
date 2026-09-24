// app/components/OfflineScreen.jsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// Yahan se text badal sakte ho
const TEXT = {
  offlineTitle: "You're offline",
  offlineBody:
    'Check your Wi-Fi or mobile data. This screen goes away on its own once your connection is back.',
  retry: 'Try again',
  checking: 'Checking…',
  stillOffline: 'Still no connection. Check Wi-Fi or mobile data, then try again.',
  backTitle: 'Back online',
  backBody: 'Taking you back to the app.',
};

const HIDE_DELAY = 1800; // "Back online" kitni der dikhe (ms)
const CHECK_TIMEOUT = 6000; // retry check ka timeout (ms)
const PING_URL = 'https://www.gstatic.com/generate_204'; // chhota, fast, internet check ke liye

export default function OfflineScreen() {
  const [status, setStatus] = useState('online'); // 'online' | 'offline' | 'reconnected'
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  const hideTimer = useRef(null);
  const wasOffline = useRef(false);
  const retryBtn = useRef(null);

  const goOffline = useCallback(() => {
    clearTimeout(hideTimer.current);
    wasOffline.current = true;
    setFailed(false);
    setStatus('offline');
  }, []);

  const goOnline = useCallback(() => {
    // Agar pehle offline hua hi nahi tha to screen mat dikhao
    if (!wasOffline.current) return;
    wasOffline.current = false;
    clearTimeout(hideTimer.current);
    setFailed(false);
    setStatus('reconnected');
    hideTimer.current = setTimeout(() => setStatus('online'), HIDE_DELAY);
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!navigator.onLine) goOffline();

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
      clearTimeout(hideTimer.current);
    };
  }, [goOffline, goOnline]);

  const visible = mounted && status !== 'online';
  const isOffline = status === 'offline';

  // Offline screen aate hi focus retry button par
  useEffect(() => {
    if (isOffline) retryBtn.current?.focus({ preventScroll: true });
  }, [isOffline]);

  // Screen dikh rahi ho to peeche ka page scroll na ho
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  // navigator.onLine kabhi kabhi galat hota hai (Wi-Fi hai par internet nahi),
  // isliye button dabane par asli request bhejkar check karte hain.
  const retry = async () => {
    if (checking) return;
    setChecking(true);
    setFailed(false);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT);
    try {
      // Apni hi site par check karoge to localhost par hamesha pass ho jayega,
      // isliye bahar ke server ko ping karte hain. 'no-cors' mein response
      // padh nahi sakte, par network fail ho to fetch error deta hai — humein bas yahi chahiye.
      await fetch(`${PING_URL}?_=${Date.now()}`, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      goOnline(); // response aaya matlab internet chal raha hai
    } catch {
      setFailed(true);
    } finally {
      clearTimeout(timeout);
      setChecking(false);
    }
  };

  return (
    <div
      className={`ofp ${visible ? 'ofp--on' : ''}`}
      role="alertdialog"
      aria-modal="true"
      aria-hidden={!visible}
      aria-labelledby="ofp-title"
      aria-describedby="ofp-body"
    >
      <style>{css}</style>

      <div className="ofp-inner">
        <SignalIcon ok={!isOffline} />

        <h1 id="ofp-title" className="ofp-title">
          {isOffline ? TEXT.offlineTitle : TEXT.backTitle}
        </h1>
        <p id="ofp-body" className="ofp-body">
          {isOffline ? TEXT.offlineBody : TEXT.backBody}
        </p>

        <div className="ofp-actions" aria-live="polite">
          {isOffline && (
            <>
              <button
                ref={retryBtn}
                type="button"
                className="ofp-btn"
                onClick={retry}
                disabled={checking}
              >
                {checking ? TEXT.checking : TEXT.retry}
              </button>
              {failed && <p className="ofp-hint">{TEXT.stillOffline}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SignalIcon({ ok }) {
  return (
    <svg
      className={`ofp-icon ${ok ? 'ofp-icon--ok' : ''}`}
      viewBox="0 24 120 80"
      width="120"
      height="80"
      fill="none"
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path className="ofp-arc ofp-arc-3" d="M13.33 49.33A66 66 0 0 1 106.67 49.33" />
      <path className="ofp-arc ofp-arc-2" d="M28.89 64.89A44 44 0 0 1 91.11 64.89" />
      <path className="ofp-arc ofp-arc-1" d="M44.44 80.44A22 22 0 0 1 75.56 80.44" />
      <circle cx="60" cy="96" r="4.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const css = `
.ofp {
  --bg: #eef2f7;
  --ink: #15233b;
  --muted: #566780;
  --accent: #d9821a;
  --ok: #24895f;
  --btn-bg: #15233b;
  --btn-ink: #ffffff;
  --focus: #2b6cdf;

  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
  background: var(--bg);
  color: var(--ink);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;

  opacity: 0;
  visibility: hidden;
  transition: opacity 280ms ease, visibility 0s linear 280ms;
}
@media (prefers-color-scheme: dark) {
  .ofp {
    --bg: #0f1a2e;
    --ink: #e8eef7;
    --muted: #9aa9bf;
    --accent: #f2a33a;
    --ok: #4cc38a;
    --btn-bg: #e8eef7;
    --btn-ink: #0f1a2e;
    --focus: #7aa7ff;
  }
}
.ofp--on {
  opacity: 1;
  visibility: visible;
  transition: opacity 280ms ease, visibility 0s;
}

.ofp-inner {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.ofp-icon {
  color: var(--accent);
  margin-bottom: 36px;
  transition: color 250ms ease;
}
.ofp-icon--ok { color: var(--ok); }

/* Signal arcs ek ke baad ek jalte hain = "connection dhoondh raha hai" */
.ofp-arc { opacity: 0.22; animation: ofp-search 1.8s ease-in-out infinite; }
.ofp-arc-1 { animation-delay: 0s; }
.ofp-arc-2 { animation-delay: 0.25s; }
.ofp-arc-3 { animation-delay: 0.5s; }
.ofp-icon--ok .ofp-arc { animation: none; opacity: 1; }

@keyframes ofp-search {
  0%, 100% { opacity: 0.22; }
  30%, 60% { opacity: 1; }
}

.ofp-title {
  margin: 0 0 12px;
  font-size: clamp(28px, 6vw, 38px);
  line-height: 1.1;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.ofp-body {
  margin: 0;
  max-width: 34ch;
  font-size: 16px;
  line-height: 1.55;
  color: var(--muted);
}

.ofp-actions {
  min-height: 96px; /* layout jump na ho jab button gayab ho */
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.ofp-btn {
  appearance: none;
  border: 0;
  border-radius: 10px;
  padding: 12px 26px;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  color: var(--btn-ink);
  background: var(--btn-bg);
  cursor: pointer;
  transition: opacity 150ms ease, transform 150ms ease;
}
.ofp-btn:hover:not(:disabled) { opacity: 0.9; }
.ofp-btn:active:not(:disabled) { transform: scale(0.98); }
.ofp-btn:disabled { opacity: 0.6; cursor: progress; }
.ofp-btn:focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; }

.ofp-hint {
  margin: 0;
  max-width: 32ch;
  font-size: 14px;
  line-height: 1.5;
  color: var(--muted);
}

@media (prefers-reduced-motion: reduce) {
  .ofp, .ofp--on { transition: none; }
  .ofp-arc { animation: none; opacity: 1; }
  .ofp-btn { transition: none; }
}
`;