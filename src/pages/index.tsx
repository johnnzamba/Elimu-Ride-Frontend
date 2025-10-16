"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';

type ApiResponse = {
  status?: string;
  message?: string;
  data?: { authorization_token?: string } | null;
};

function getApiBase(): string {
  if (typeof window === 'undefined') return 'http://elimu.com:8000';
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // Use Vite proxy in dev to avoid CORS; in prod hit server directly
  return isLocal ? '' : 'http://elimu.com:8000';
}

function useIsWide(breakpoint = 900): boolean {
  const [isWide, setIsWide] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoint;
  });

  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isWide;
}

function DecorativeCircle({ size, opacity = 0.08, color = '#2E7D32' }: { size: number; opacity?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity,
      }}
    />
  );
}

function GradientHoverButton({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  const isEnabled = !disabled && !!onClick;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 12,
        cursor: isEnabled ? 'pointer' : 'not-allowed',
        boxShadow: isEnabled && hover ? '0 4px 14px rgba(0,0,0,0.15)' : 'none',
        background: isEnabled
          ? (hover
              ? 'linear-gradient(90deg, #2E7D32, #43A047)'
              : 'linear-gradient(90deg, #43A047, #66BB6A)')
          : '#E0E0E0',
        transition: 'box-shadow 160ms linear, transform 160ms ease',
      }}
      onClick={() => isEnabled && onClick && onClick()}
    >
      <div style={{ height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800 }}>
        {children}
      </div>
    </div>
  );
}

function SuccessModal({ message, onContinue }: { message: string; onContinue: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          padding: 22,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-grid', placeItems: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(46,125,50,0.12)', margin: '0 auto' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10Z" fill="#2E7D32" opacity="0.12"/>
            <path d="M16.5 9.5l-5.25 5.25L7.5 11" stroke="#2E7D32" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ height: 14 }} />
        <div style={{ fontSize: 20, fontWeight: 900 }}>Login successful</div>
        <div style={{ height: 8 }} />
        <div style={{ opacity: 0.8 }}>{message}</div>
        <div style={{ height: 16 }} />
        <button
          type="button"
          onClick={onContinue}
          style={{
            height: 46,
            padding: '0 18px',
            borderRadius: 12,
            border: 'none',
            color: '#fff',
            fontWeight: 800,
            cursor: 'pointer',
            background: 'linear-gradient(90deg, #66BB6A, #81C784)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: (message: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [obscure, setObscure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const emailValid = useMemo(() => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()), [email]);
  const passwordValid = useMemo(() => password.length >= 4, [password]);
  const formValid = emailValid && passwordValid;

  const submit = useCallback(async () => {
    if (!formValid || loading) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    const base = getApiBase();
    const url = `${base}/api/method/eagles_apis.apis.accounts.login`;

    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      let json: ApiResponse | null = null;
      try {
        json = (await resp.json()) as ApiResponse;
      } catch {
        throw new Error('Invalid response from server');
      }

      const status = (json?.status ?? '').toString().toLowerCase();
      const msg = (json?.message ?? 'Unexpected response').toString();

      if (resp.ok && status === 'success') {
        const token = json?.data?.authorization_token ?? '';
        if (token) {
          try {
            if (remember) localStorage.setItem('auth_token', token);
            else sessionStorage.setItem('auth_token', token);
          } catch {
            /* ignore storage errors */
          }
        }
        setMessage(msg);
        setLoading(false);
        onSuccess(msg);
      } else {
        setLoading(false);
        setError(msg);
      }
    } catch (e: any) {
      setLoading(false);
      setError((e?.message as string) ?? 'Network error');
    }
  }, [email, password, remember, formValid, loading, onSuccess]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Email</span>
        <div style={{ position: 'relative' }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${email.length === 0 || emailValid ? '#E0E0E0' : '#E57373'}`,
              outline: 'none',
            }}
            required
          />
        </div>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Password</span>
        <div style={{ position: 'relative' }}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={obscure ? 'password' : 'text'}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px 44px 12px 14px',
              borderRadius: 10,
              border: `1px solid ${password.length === 0 || passwordValid ? '#E0E0E0' : '#E57373'}`,
              outline: 'none',
            }}
            required
            minLength={4}
          />
          <button
            type="button"
            onClick={() => setObscure((v) => !v)}
            aria-label={obscure ? 'Show password' : 'Hide password'}
            style={{
              position: 'absolute',
              right: 8,
              top: 0,
              bottom: 0,
              margin: 'auto',
              height: 32,
              padding: '0 8px',
              borderRadius: 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#555',
            }}
          >
            {obscure ? 'Show' : 'Hide'}
          </button>
        </div>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input id="remember" type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <label htmlFor="remember" style={{ userSelect: 'none' }}>Remember me</label>
        <div style={{ flex: 1 }} />
        <button type="button" style={{ background: 'none', border: 'none', color: '#2E7D32', cursor: 'pointer' }}>Forgot?</button>
      </div>

      <GradientHoverButton disabled={!formValid || loading} onClick={submit}>
        {loading ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span>Signing in…</span>
          </div>
        ) : (
          <span>Sign in</span>
        )}
      </GradientHoverButton>

      <button type="button" style={{ marginTop: 2, background: 'transparent', border: 'none', color: '#2E7D32', fontWeight: 600, cursor: 'pointer' }}>Create an account</button>

      {message && (
        <div role="status" style={{ marginTop: 4, padding: '10px 12px', borderRadius: 10, background: '#E8F5E9', color: '#1B5E20', fontSize: 14 }}>{message}</div>
      )}
      {error && (
        <div role="alert" style={{ marginTop: 4, padding: '10px 12px', borderRadius: 10, background: '#FFEBEE', color: '#B71C1C', fontSize: 14 }}>{error}</div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

export default function IndexPage() {
  const isWide = useIsWide(900);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        window.location.assign('/home');
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)'
      }}>
        <title>Elimu Ride • Sign in</title>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)',
      }}
    >
      <title>Elimu Ride • Sign in</title>
      <div
        style={{
          width: '100%',
          maxWidth: isWide ? 1100 : 520,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.07)',
          background: '#fff',
          display: 'flex',
          flexDirection: isWide ? 'row' : 'column',
        }}
      >
        {isWide && (
          <div
            style={{
              flex: 5,
              padding: 28,
              position: 'relative',
              background: '#EAF9EF',
            }}
          >
            <div style={{ position: 'absolute', right: -40, top: -40 }}>
              <DecorativeCircle size={220} opacity={0.08} />
            </div>
            <div style={{ position: 'absolute', left: -30, bottom: -30 }}>
              <DecorativeCircle size={160} opacity={0.06} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 8px 18px rgba(0,0,0,0.06)',
                }}
              >
                <img
                  src="/images/logo.png"
                  alt="Elimu Ride logo"
                  style={{ width: 44, height: 44, objectFit: 'contain' }}
                  onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = '/images/favicon.png'; }}
                />
              </div>
              <div style={{ fontSize: 28, fontWeight: 900 }}>Elimu Ride</div>
            </div>
            <div style={{ height: 18 }} />
            <div style={{ fontSize: 22, fontWeight: 800 }}>Smart. Safe. Simple.</div>
            <div style={{ height: 12 }} />
            <div style={{ lineHeight: 1.45, color: '#2b2b2b' }}>
              Manage school rides, monitor routes and keep parents informed. Secure pickups and drop-offs with a single platform tailored for schools.
            </div>
            <div style={{ height: 22 }} />
            <button
              type="button"
              style={{
                height: 44,
                minWidth: 140,
                padding: '0 16px',
                borderRadius: 10,
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#fff',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Learn more
            </button>
          </div>
        )}

        <div style={{ flex: 6, padding: 28 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 26, fontWeight: 900 }}>Welcome back</div>
            <div style={{ height: 6 }} />
            <div style={{ opacity: 0.75 }}>Sign in to your Elimu Ride account</div>
          </div>

          <div
            style={{
              borderRadius: 14,
              padding: 18,
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.04)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <LoginForm
              onSuccess={(msg) => {
                setSuccessMsg(msg || 'Welcome back!');
                // auto-redirect shortly after showing the modal
                setTimeout(() => {
                  window.location.assign('/home');
                }, 900);
              }}
            />
          </div>

          <div style={{ height: 14 }} />
          <div style={{ textAlign: 'center', opacity: 0.65, fontSize: 12 }}>
            By continuing you agree to our Terms and Privacy.
          </div>
        </div>
      </div>
      {successMsg && (
        <SuccessModal message={successMsg} onContinue={() => window.location.assign('/home')} />
      )}
    </div>
  );
}
