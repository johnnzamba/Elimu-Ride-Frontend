"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'waku';

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
};

function StatCard({ title, value, delta, color, colors }: { title: string; value: string; delta?: string; color?: string; colors: Colors }) {
  return (
    <div style={{ background: colors.cardBg, borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 12, color: colors.textMuted }}>{title}</div>
      <div style={{ height: 6 }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontSize: 28, fontWeight: 900 }}>{value}</div>
        {delta && (
          <span style={{ fontSize: 12, fontWeight: 700, color: color ?? '#2E7D32' }}>{delta}</span>
        )}
      </div>
    </div>
  );
}

function SimpleBarChart({ values, labels, color = '#2E7D32', colors }: { values: number[]; labels: string[]; color?: string; colors: Colors }) {
  const max = Math.max(1, ...values);
  return (
    <div style={{ background: colors.cardBg, borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ fontWeight: 800 }}>Weekly Trips</div>
      <div style={{ height: 10 }} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${values.length}, 1fr)`, gap: 10, alignItems: 'end', height: 160 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateRows: '1fr auto', alignItems: 'end', gap: 8 }}>
            <div style={{ background: color, borderRadius: 8, height: `${(v / max) * 100}%`, transition: 'height 300ms ease' }} />
            <div style={{ fontSize: 12, textAlign: 'center', color: colors.textMuted }}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleDonut({ segments, colors }: { segments: { label: string; value: number; color: string }[]; colors: Colors }) {
  const total = useMemo(() => segments.reduce((s, x) => s + x.value, 0), [segments]);
  const angles = useMemo(() => {
    let start = 0;
    return segments.map((s) => {
      const angle = (s.value / total) * 2 * Math.PI;
      const a = { start, end: start + angle };
      start += angle;
      return { ...a, color: s.color };
    });
  }, [segments, total]);

  const R = 60;
  const C = 2 * Math.PI * R;
  return (
    <div style={{ background: colors.cardBg, borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <svg width="140" height="140" viewBox="0 0 160 160">
          <g transform="translate(80,80)">
            {angles.map((a, i) => {
              const length = (a.end - a.start) * R;
              return (
                <circle key={i} r={R} fill="transparent" stroke={a.color} strokeWidth={20} strokeDasharray={`${length} ${C - length}`} transform={`rotate(${(a.start * 180) / Math.PI})`} />
              );
            })}
            <circle r={R - 18} fill={colors.cardBg} />
          </g>
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Occupancy</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {segments.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
              <span style={{ fontSize: 14 }}>{s.label}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DrawerItem({ active, label, icon, colors, onClick, open }: { active?: boolean; label: string; icon: React.ReactNode; colors: Colors; onClick?: () => void; open?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10,
        background: active ? (colors === undefined ? 'rgba(46,125,50,0.12)' : 'rgba(46,125,50,0.12)') : 'transparent',
        color: active ? '#2E7D32' : colors.textPrimary,
        fontWeight: active ? 800 : 600,
        cursor: 'pointer',
        justifyContent: open ? 'flex-start' : 'center',
      }}
    >
      <span aria-hidden>{icon}</span>
      {open && <span>{label}</span>}
    </div>
  );
}

export default function LandingPage() {
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const colors: Colors = theme === 'light'
    ? { bgGradient: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)', cardBg: '#fff', textPrimary: '#1f2a24', textMuted: 'rgba(0,0,0,0.6)', border: 'rgba(0,0,0,0.08)' }
    : { bgGradient: '#0B1712', cardBg: '#142019', textPrimary: '#E7F5EC', textMuted: 'rgba(231,245,236,0.7)', border: 'rgba(255,255,255,0.12)' };
  const trips = [32, 44, 40, 48, 62, 55, 70];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const segments = [
    { label: 'Full', value: 62, color: '#2E7D32' },
    { label: 'Partial', value: 28, color: '#81C784' },
    { label: 'Empty', value: 10, color: '#C8E6C9' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: colors.bgGradient, color: colors.textPrimary }}>
      <title>Elimu Ride • Dashboard</title>
      <div style={{ display: 'grid', gridTemplateColumns: open ? '240px 1fr' : '72px 1fr', transition: 'grid-template-columns 200ms ease' }}>
        <aside style={{ position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', padding: 16, background: theme === 'light' ? '#FFFFFFAA' : '#0E1A13', backdropFilter: theme === 'light' ? 'blur(6px)' : undefined, borderRight: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 10 }}>
            <img src="/images/logo.png" alt="logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            {open && <strong>Elimu Ride</strong>}
            <button onClick={() => setOpen((v) => !v)} style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: colors.textPrimary }}>{open ? '⟨' : '⟩'}</button>
          </div>
          <div style={{ height: 10 }} />
          <nav style={{ display: 'grid', gap: 6 }}>
            <DrawerItem colors={colors} active label="Dashboard" icon={<span>📊</span>} open={open} />
            <DrawerItem colors={colors} label="Students" icon={<span>🎒</span>} open={open} />
            <DrawerItem 
              colors={colors} 
              label="Buses" 
              icon={<span>🚌</span>} 
              onClick={() => window.location.href = '/buses'}
              open={open}
            />
            <DrawerItem colors={colors} label="Routes" icon={<span>🗺️</span>} open={open} />
            <DrawerItem colors={colors} label="Pickups & Drop-offs" icon={<span>📍</span>} open={open} />
            <DrawerItem colors={colors} label="Drivers" icon={<span>👨‍✈️</span>} open={open} />
            <DrawerItem colors={colors} label="Attendance" icon={<span>🧾</span>} open={open} />
            <DrawerItem colors={colors} label="Alerts" icon={<span>🔔</span>} open={open} />
            <DrawerItem colors={colors} label="Settings" icon={<span>⚙️</span>} open={open} />
          </nav>
        </aside>
        <main style={{ padding: 18 }}>
          <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/images/logo.png" alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              <div>
                <div style={{ fontWeight: 900 }}>Welcome back</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Smart. Safe. Simple.</div>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                style={{ height: 36, width: 36, display: 'grid', placeItems: 'center', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.cardBg, cursor: 'pointer' }}
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                <img src="https://img.icons8.com/pastel-glyph/128/light--v1.png" alt="toggle theme" width={18} height={18} style={{ filter: theme === 'dark' ? 'invert(1)' : 'none' }} />
              </button>
              <input placeholder="Search..." style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.cardBg, color: colors.textPrimary }} />
              <button style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.cardBg, color: colors.textPrimary }}>New</button>
              <button
                title="Log out"
                onClick={() => {
                  try {
                    localStorage.removeItem('auth_token');
                  } catch {}
                  try {
                    sessionStorage.removeItem('auth_token');
                  } catch {}
                  window.location.assign('/');
                }}
                style={{
                  height: 36,
                  width: 36,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  cursor: 'pointer',
                }}
                aria-label="Log out"
              >
                <i className="fa-solid fa-right-from-bracket" style={{ color: '#2E7D32', fontSize: 16, lineHeight: '1' }}></i>
              </button>
            </div>
          </header>
          <div style={{ height: 14 }} />

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
            <StatCard colors={colors} title="Active Buses" value="12" delta="+2 today" />
            <StatCard colors={colors} title="Students Riding" value="384" delta="+18" />
            <StatCard colors={colors} title="On-time Rate" value="96%" delta="+1.2%" />
            <StatCard colors={colors} title="Alerts" value="3" color="#E53935" delta="-1" />
          </section>

          <div style={{ height: 14 }} />

          <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <SimpleBarChart colors={colors} values={trips} labels={labels} />
            <SimpleDonut colors={colors} segments={segments} />
          </section>

          <div style={{ height: 14 }} />

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: colors.cardBg, borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', minHeight: 180 }}>
              <div style={{ fontWeight: 800 }}>Live Fleet Preview</div>
              <div style={{ height: 8 }} />
              <img src="https://trackntrace.co.ke/wp-content/uploads/2024/10/What-is-smart-school-bus.png" alt="fleet" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10 }} />
            </div>
            <div style={{ background: colors.cardBg, borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', minHeight: 180 }}>
              <div style={{ fontWeight: 800 }}>Upcoming Pickups</div>
              <div style={{ height: 8 }} />
              <ul style={{ display: 'grid', gap: 8, paddingLeft: 18 }}>
                <li>St. Mary’s Primary — Route A — 06:30</li>
                <li>St. Anne’s High — Route C — 06:45</li>
                <li>Greenwood Academy — Route B — 06:55</li>
                <li>Valley Prep — Route D — 07:00</li>
              </ul>
            </div>
          </section>

          <div style={{ height: 18 }} />

          <footer style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/" className="underline">Return home</Link>
            <span style={{ marginLeft: 'auto', opacity: 0.65 }}>© {new Date().getFullYear()} Elimu Ride</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
