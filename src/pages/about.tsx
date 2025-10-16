"use client";

import React, { useMemo, useState } from 'react';
import { Link } from 'waku';

function StatCard({ title, value, delta, color }: { title: string; value: string; delta?: string; color?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
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

function SimpleBarChart({ values, labels, color = '#2E7D32' }: { values: number[]; labels: string[]; color?: string }) {
  const max = Math.max(1, ...values);
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ fontWeight: 800 }}>Weekly Trips</div>
      <div style={{ height: 10 }} />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${values.length}, 1fr)`, gap: 10, alignItems: 'end', height: 160 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateRows: '1fr auto', alignItems: 'end', gap: 8 }}>
            <div style={{ background: color, borderRadius: 8, height: `${(v / max) * 100}%`, transition: 'height 300ms ease' }} />
            <div style={{ fontSize: 12, textAlign: 'center', opacity: 0.7 }}>{labels[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleDonut({ segments }: { segments: { label: string; value: number; color: string }[] }) {
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
    <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16 }}>
      <div style={{ display: 'grid', placeItems: 'center' }}>
        <svg width="140" height="140" viewBox="0 0 160 160">
          <g transform="translate(80,80)">
            {angles.map((a, i) => {
              const length = (a.end - a.start) * R;
              return (
                <circle key={i} r={R} fill="transparent" stroke={a.color} strokeWidth={20} strokeDasharray={`${length} ${C - length}`} transform={`rotate(${(a.start * 180) / Math.PI})`} />
              );
            })}
            <circle r={R - 18} fill="#fff" />
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

function DrawerItem({ active, label, icon }: { active?: boolean; label: string; icon: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10,
        background: active ? 'rgba(46,125,50,0.12)' : 'transparent',
        color: active ? '#2E7D32' : '#2b2b2b',
        fontWeight: active ? 800 : 600,
        cursor: 'pointer',
      }}
    >
      <span aria-hidden>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const [open, setOpen] = useState(true);
  const trips = [32, 44, 40, 48, 62, 55, 70];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const segments = [
    { label: 'Full', value: 62, color: '#2E7D32' },
    { label: 'Partial', value: 28, color: '#81C784' },
    { label: 'Empty', value: 10, color: '#C8E6C9' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)' }}>
      <title>Elimu Ride • Dashboard</title>
      <div style={{ display: 'grid', gridTemplateColumns: open ? '240px 1fr' : '72px 1fr', transition: 'grid-template-columns 200ms ease' }}>
        <aside style={{ position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', padding: 16, background: '#FFFFFFAA', backdropFilter: 'blur(6px)', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 10 }}>
            <img src="/images/logo.png" alt="logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            {open && <strong>Elimu Ride</strong>}
            <button onClick={() => setOpen((v) => !v)} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>{open ? '⟨' : '⟩'}</button>
          </div>
          <div style={{ height: 10 }} />
          <nav style={{ display: 'grid', gap: 6 }}>
            <DrawerItem active label="Dashboard" icon={<span>📊</span>} />
            <DrawerItem label="Students" icon={<span>🎒</span>} />
            <DrawerItem label="Buses" icon={<span>🚌</span>} />
            <DrawerItem label="Routes" icon={<span>🗺️</span>} />
            <DrawerItem label="Pickups & Drop-offs" icon={<span>📍</span>} />
            <DrawerItem label="Drivers" icon={<span>👨‍✈️</span>} />
            <DrawerItem label="Attendance" icon={<span>🧾</span>} />
            <DrawerItem label="Alerts" icon={<span>🔔</span>} />
            <DrawerItem label="Settings" icon={<span>⚙️</span>} />
          </nav>
        </aside>
        <main style={{ padding: 18 }}>
          <header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/images/logo.png" alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
    <div>
                <div style={{ fontWeight: 900 }}>Welcome back</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>Smart. Safe. Simple.</div>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <input placeholder="Search..." style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)' }} />
              <button style={{ height: 36, padding: '0 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)', background: '#fff' }}>New</button>
            </div>
          </header>
          <div style={{ height: 14 }} />

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 14 }}>
            <StatCard title="Active Buses" value="12" delta="+2 today" />
            <StatCard title="Students Riding" value="384" delta="+18" />
            <StatCard title="On-time Rate" value="96%" delta="+1.2%" />
            <StatCard title="Alerts" value="3" color="#E53935" delta="-1" />
          </section>

          <div style={{ height: 14 }} />

          <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <SimpleBarChart values={trips} labels={labels} />
            <SimpleDonut segments={segments} />
          </section>

          <div style={{ height: 14 }} />

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', minHeight: 180 }}>
              <div style={{ fontWeight: 800 }}>Live Fleet Preview</div>
              <div style={{ height: 8 }} />
              <img src="https://trackntrace.co.ke/wp-content/uploads/2024/10/What-is-smart-school-bus.png" alt="fleet" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 10 }} />
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 8px 20px rgba(0,0,0,0.05)', minHeight: 180 }}>
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
