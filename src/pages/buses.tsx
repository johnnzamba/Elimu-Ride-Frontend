"use client";

import React, { useEffect, useState } from 'react';
import { Link } from 'waku';
import ManageDropdown from '../components/AssetActions';
import StatusDisplay from '../components/StatusDisplay';
import AssetValueLineChart from '../components/AssetValueLineChart';

type Bus = {
  asset_no: string;
  bus_no: string;
  item_code: string;
  company: string;
  purchase_date: string;
  available_for_use_date: string;
  purchase_amount: number;
  gross_purchase_amount: number;
  asset_quantity: number;
  policy_number: string;
  insurer: string;
  insured_value: string;
  maintenance_scheduled: boolean;
  docstatus: number;
  image: string;
  image_url: string;
};

type BusDetails = {
  asset_no: string;
  bus_no: string;
  item_code: string;
  company: string;
  purchase_date: string;
  available_for_use_date: string;
  purchase_amount: number;
  gross_purchase_amount: number;
  asset_quantity: number;
  policy_number: string;
  insurer: string;
  insured_value: string;
  status: string;
  maintenance_scheduled: boolean;
  docstatus: number;
  image: string;
  image_url: string;
};

type ApiResponse = {
  message: {
    status: number;
    message: string;
    result: Bus[];
  };
};

type BusDetailsApiResponse = {
  message: {
    status: number;
    message: string;
    result: BusDetails;
  };
};

type ActivityItem = {
  date: string;
  user: string;
  user_full_name: string;
  subject: string;
};

type ActivityApiResponse = {
  message: {
    status: number;
    message: string;
    result: ActivityItem[];
  };
};

function getApiBase(): string {
  if (typeof window === 'undefined') return 'http://elimu.com:8000';
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocal ? '' : 'http://elimu.com:8000';
}

function BusCard({ bus, onClick }: { bus: Bus; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: '1px solid rgba(46,125,50,0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(46,125,50,0.15)';
        e.currentTarget.style.borderColor = 'rgba(46,125,50,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = 'rgba(46,125,50,0.1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Bus Image */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src={bus.image_url}
            alt={`Bus ${bus.bus_no}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiM0M0EwNDciLz4KPHN2ZyB4PSIyMiIgeT0iMjIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJTNi40OCAyMiAxMiAyMlMyMiAxNy41MiAyMiAxMlMxNy41MiAyIDEyIDJaTTEyIDIwQzcuNTkgMjAgNCAxNi40MSA0IDEyUzcuNTkgNCAxMiA0UzIwIDcuNTkgMjAgMTJTMTYuNDEgMjAgMTIgMjBaTTEyIDZDMTAuMzQgNiA5IDcuMzQgOSA5UzEwLjM0IDEyIDEyIDEyUzE1IDEwLjY2IDE1IDlTMTMuNjYgNiAxMiA2WiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4KPC9zdmc+';
            }}
          />
        </div>

        {/* Bus Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1f2a24', margin: 0 }}>
              {bus.asset_no}
            </h3>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#2E7D32',
                background: 'rgba(46,125,50,0.1)',
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              {bus.bus_no}
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14 }}>
            <div style={{ color: '#666' }}>
              <strong>Company:</strong> {bus.company}
            </div>
            <div style={{ color: '#666' }}>
              <strong>Insurer:</strong> {bus.insurer}
            </div>
          </div>
          
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: bus.maintenance_scheduled ? '#2E7D32' : '#E53935',
                background: bus.maintenance_scheduled 
                  ? 'rgba(46,125,50,0.1)' 
                  : 'rgba(229,57,53,0.1)',
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              {bus.maintenance_scheduled ? '✓ Scheduled Maintence' : '⚠ No Scheduled Maintence'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/buses?asset_no=${bus.asset_no}`;
            }}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg, #43A047, #66BB6A)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #2E7D32, #43A047)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #43A047, #66BB6A)';
            }}
          >
            View
          </button>
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement edit functionality
              alert('Edit functionality coming soon!');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #2E7D32',
              background: 'transparent',
              color: '#2E7D32',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 12,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(46,125,50,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Edit
          </button> */}
        </div>
      </div>
    </div>
  );
}

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
  bgSecondary: string;
};

function DrawerItem({ active, label, icon, colors, onClick, open }: { active?: boolean; label: string; icon: React.ReactNode; colors: Colors; onClick?: () => void; open?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10,
        background: active ? 'rgba(46,125,50,0.12)' : 'transparent',
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


function ActivityNode({ activity, colors, isLatest, position }: { 
  activity: ActivityItem; 
  colors: Colors; 
  isLatest: boolean;
  position: { x: number; y: number };
}) {
  const getActivityColor = (subject: string) => {
    if (subject.toLowerCase().includes('created')) return '#43A047';
    if (subject.toLowerCase().includes('transferred')) return '#2196F3';
    if (subject.toLowerCase().includes('submitted')) return '#FF9800';
    if (subject.toLowerCase().includes('scrapped')) return '#F44336';
    if (subject.toLowerCase().includes('restored')) return '#4CAF50';
    if (subject.toLowerCase().includes('repair')) return '#FF5722';
    if (subject.toLowerCase().includes('out of order')) return '#E91E63';
    return '#9E9E9E';
  };

  const getActivityLabel = (subject: string) => {
    if (subject.toLowerCase().includes('created')) return 'Created';
    if (subject.toLowerCase().includes('transferred')) return 'Transferred';
    if (subject.toLowerCase().includes('submitted')) return 'Submitted';
    if (subject.toLowerCase().includes('scrapped')) return 'Scrapped';
    if (subject.toLowerCase().includes('restored')) return 'Restored';
    if (subject.toLowerCase().includes('repair')) return 'Repair';
    if (subject.toLowerCase().includes('out of order')) return 'Out of Order';
    return 'Activity';
  };

  const activityColor = getActivityColor(activity.subject);
  const label = getActivityLabel(activity.subject);
            
            return (
    <div 
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        zIndex: isLatest ? 10 : 5,
      }}
      className="activity-node"
    >
      {/* Node Circle */}
        <div style={{
          width: 28, // Smaller for mobile
          height: 28, // Smaller for mobile
          borderRadius: '50%',
          background: isLatest 
            ? `linear-gradient(135deg, ${activityColor}, ${activityColor}CC)` 
            : '#F5F5F5',
          border: `2px solid ${isLatest ? activityColor : '#E0E0E0'}`, // Thinner border
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 12, // Smaller font
          fontWeight: 800,
          color: isLatest ? '#fff' : '#666',
          boxShadow: isLatest 
            ? `0 4px 15px ${activityColor}50, 0 2px 6px rgba(0,0,0,0.1)` 
            : '0 3px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
        }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.3)';
        e.currentTarget.style.boxShadow = isLatest 
          ? `0 8px 25px ${activityColor}70, 0 4px 15px rgba(0,0,0,0.15)` 
          : '0 6px 20px rgba(67,160,71,0.3), 0 2px 10px rgba(0,0,0,0.1)';
        e.currentTarget.style.background = isLatest 
          ? `linear-gradient(135deg, ${activityColor}, ${activityColor}DD)` 
          : 'linear-gradient(135deg, #E8F5E8, #F0F8F0)';
        e.currentTarget.style.borderColor = isLatest ? activityColor : '#66BB6A';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = isLatest 
          ? `0 6px 20px ${activityColor}50, 0 2px 8px rgba(0,0,0,0.1)` 
          : '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.background = isLatest 
          ? `linear-gradient(135deg, ${activityColor}, ${activityColor}CC)` 
          : '#F5F5F5';
        e.currentTarget.style.borderColor = isLatest ? activityColor : '#E0E0E0';
      }}>
        {isLatest ? '●' : '○'}
        
        {/* Hover glow effect */}
                <div style={{
                  position: 'absolute',
          top: -4,
          left: -4,
          right: -4,
          bottom: -4,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${activityColor}20 0%, transparent 70%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
        }} className="node-glow" />
      </div>

      {/* Activity Label */}
        <div style={{
          position: 'absolute',
          top: -45, // Adjusted for smaller node
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10, // Smaller font
          fontWeight: 700,
          color: isLatest ? activityColor : colors.textPrimary,
          background: isLatest 
            ? `linear-gradient(135deg, ${activityColor}15, ${activityColor}08)` 
            : colors.cardBg,
          padding: '3px 6px', // Smaller padding
          borderRadius: 6, // Smaller border radius
          border: `1px solid ${isLatest ? activityColor : colors.border}`,
          boxShadow: isLatest 
            ? `0 3px 10px ${activityColor}30, 0 1px 5px rgba(0,0,0,0.1)` 
            : '0 2px 6px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
          maxWidth: 80, // Smaller max width
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minWidth: 60, // Smaller min width
        }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
        e.currentTarget.style.boxShadow = isLatest 
          ? `0 6px 20px ${activityColor}40, 0 3px 12px rgba(0,0,0,0.15)` 
          : '0 5px 15px rgba(67,160,71,0.25), 0 2px 8px rgba(0,0,0,0.1)';
        e.currentTarget.style.background = isLatest 
          ? `linear-gradient(135deg, ${activityColor}25, ${activityColor}15)` 
          : 'linear-gradient(135deg, #E8F5E8, #F0F8F0)';
        e.currentTarget.style.borderColor = isLatest ? activityColor : '#66BB6A';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        e.currentTarget.style.boxShadow = isLatest 
          ? `0 4px 15px ${activityColor}30, 0 2px 8px rgba(0,0,0,0.1)` 
          : '0 3px 10px rgba(0,0,0,0.08)';
        e.currentTarget.style.background = isLatest 
          ? `linear-gradient(135deg, ${activityColor}15, ${activityColor}08)` 
          : colors.cardBg;
        e.currentTarget.style.borderColor = isLatest ? activityColor : colors.border;
      }}>
        {label}
      </div>

      {/* Date Display */}
        <div style={{
          position: 'absolute',
          top: -25, // Adjusted for smaller node and label
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 8, // Smaller font
          fontWeight: 600,
          color: colors.textMuted,
          background: colors.cardBg,
          padding: '2px 4px', // Smaller padding
          borderRadius: 4, // Smaller border radius
          border: `1px solid ${colors.border}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          whiteSpace: 'nowrap',
          maxWidth: 120, // Smaller max width
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          opacity: 0.9,
        }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1';
        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.background = '#F8FBF8';
        e.currentTarget.style.borderColor = '#66BB6A';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.9';
        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)';
        e.currentTarget.style.background = colors.cardBg;
        e.currentTarget.style.borderColor = colors.border;
      }}>
        📅 {activity.date}
      </div>

      {/* Enhanced Tooltip */}
      <div style={{
        position: 'absolute',
          top: -150,
        left: '50%',
        transform: 'translateX(-50%)',
        background: `linear-gradient(135deg, ${colors.cardBg}, #F8FBF8)`,
        padding: '16px 20px',
        borderRadius: 16,
        border: `2px solid ${activityColor}30`,
        boxShadow: `0 12px 30px rgba(0,0,0,0.2), 0 6px 20px ${activityColor}20`,
        fontSize: 14,
        color: colors.textPrimary,
        whiteSpace: 'nowrap',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
        zIndex: 30,
        minWidth: 250,
        textAlign: 'center',
      }}
      className="activity-tooltip">
        <div style={{ 
          fontWeight: 800, 
          marginBottom: 8,
          color: activityColor,
          fontSize: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </div>
        <div style={{ 
          fontWeight: 700, 
          marginBottom: 6,
          color: colors.textPrimary,
          fontSize: 15,
        }}>
          👤 {activity.user_full_name}
        </div>
        <div style={{ 
          color: colors.textMuted,
          fontSize: 13,
          marginBottom: 8,
          fontWeight: 600,
        }}>
          📅 {activity.date}
        </div>
        <div style={{
          fontSize: 12,
          color: colors.textMuted,
          fontStyle: 'italic',
          maxWidth: 220,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          background: `${activityColor}08`,
          padding: '8px 12px',
          borderRadius: 8,
          border: `1px solid ${activityColor}20`,
        }}>
          📝 {activity.subject}
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline({ activities, colors }: { activities: ActivityItem[]; colors: Colors }) {
  // Calculate node positions with dynamic spacing
  const getNodePositions = (activities: ActivityItem[]) => {
    const positions: { x: number; y: number }[] = [];
    const containerHeight = 150; // Reduced height for better mobile experience
    const minNodeSpacing = 120; // Reduced spacing for mobile
    const nodeWidth = 100; // Width needed for each node including labels
    
    // Calculate total width needed
    const totalWidth = Math.max(600, activities.length * minNodeSpacing + 120);
    
    activities.forEach((_, index) => {
      // Create a horizontal tagging pattern from newest to oldest (left to right)
      const baseX = 80 + (index * minNodeSpacing);
      const baseY = containerHeight / 2;
      
      // Add some vertical variation for visual interest
      const variation = Math.sin(index * 0.8) * 15;
      const x = baseX;
      const y = baseY + variation;
      
      positions.push({ x, y });
    });
    
    return { positions, totalWidth };
  };

  const { positions: nodePositions, totalWidth } = getNodePositions(activities);

  // Generate connection lines between nodes
  const generateConnectionLines = () => {
    const lines: React.ReactElement[] = [];
    
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];
      
      if (!current || !next) continue;
      
      // Calculate line path
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      
      // Create a curved line for horizontal flow
      const controlPointX = (current.x + next.x) / 2;
      const controlPointY = Math.min(current.y, next.y) - 15;
      
      lines.push(
        <svg
          key={`line-${i}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id={`gradient-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#66BB6A" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#43A047" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            d={`M ${current.x} ${current.y} Q ${controlPointX} ${controlPointY} ${next.x} ${next.y}`}
            stroke={`url(#gradient-${i})`}
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            opacity={0.7}
          />
        </svg>
      );
    }
    
    return lines;
  };

  return (
    <div style={{
      background: colors.cardBg,
      borderRadius: 20,
      padding: 32,
      boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
      border: `1px solid ${colors.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
        background: 'linear-gradient(135deg, rgba(67,160,71,0.02) 0%, rgba(102,187,106,0.02) 100%)',
                    pointerEvents: 'none',
                  }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
              Activity Timeline
            </h3>
            <p style={{ fontSize: 14, color: colors.textMuted, margin: '4px 0 0 0' }}>
              Recent asset activity and status changes
            </p>
              </div>
        </div>

        {/* Scrollable Timeline Container */}
        <div style={{
          width: '100%',
          height: 150,
          background: 'linear-gradient(135deg, rgba(67,160,71,0.03) 0%, rgba(102,187,106,0.02) 50%, rgba(67,160,71,0.01) 100%)',
          borderRadius: 16,
          border: `2px solid ${colors.border}`,
          overflow: 'auto',
          boxShadow: 'inset 0 2px 8px rgba(67,160,71,0.1)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#43A047 transparent',
        }}>
          {/* Timeline Content */}
          <div style={{
            position: 'relative',
            width: totalWidth,
            height: '100%',
            minHeight: 150,
          }}>
            {/* Background Grid Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(67,160,71,0.05) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, rgba(102,187,106,0.03) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              opacity: 0.3,
              pointerEvents: 'none',
            }} />
            
            {/* Connection Lines */}
            {generateConnectionLines()}
            
            {/* Activity Nodes */}
            {activities.map((activity, index) => {
              const position = nodePositions[index];
              if (!position) return null;
              
              return (
                <ActivityNode
                  key={index}
                  activity={activity}
                  colors={colors}
                  isLatest={index === 0}
                  position={position}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced CSS for hover effects */}
      <style>{`
        .activity-tooltip {
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%) translateY(10px);
        }
        .activity-node:hover .activity-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0px);
        }
        
        .node-glow {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .activity-node:hover .node-glow {
          opacity: 1;
        }
        
        /* Enhanced hover animations */
        @keyframes pulse-glow {
          0% { transform: scale(1); box-shadow: 0 8px 25px rgba(67,160,71,0.3); }
          50% { transform: scale(1.02); box-shadow: 0 12px 35px rgba(67,160,71,0.5); }
          100% { transform: scale(1); box-shadow: 0 8px 25px rgba(67,160,71,0.3); }
        }
        
        .activity-node:hover {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </div>
  );
}

function DetailCard({ title, value, icon, colors }: { title: string; value: string | number; icon: string; colors: Colors }) {
  return (
    <div style={{
      background: colors.cardBg,
      borderRadius: 8,
      padding: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      border: `1px solid ${colors.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <h3 style={{ fontSize: 10, fontWeight: 600, color: colors.textMuted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </h3>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary }}>
        {value}
      </div>
    </div>
  );
}

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    bus_no: '',
    purchase_date: '',
    purchase_amount: '',
    schedule_maintenance: true,
    insurer_company_name: '',
    policy_number: '',
    insured_value: '',
    bus_image: null as File | null,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  
  // Bus details state
  const [selectedBus, setSelectedBus] = useState<BusDetails | null>(null);
  const [busDetailsLoading, setBusDetailsLoading] = useState(false);
  const [busDetailsError, setBusDetailsError] = useState<string | null>(null);
  const [showBusDetails, setShowBusDetails] = useState(false);
  
  // Activity state
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  
  // Document counts state
  const [documentCounts, setDocumentCounts] = useState<Record<string, number>>({});
  const [documentCountsLoading, setDocumentCountsLoading] = useState(false);
  const [documentCountsError, setDocumentCountsError] = useState<string | null>(null);
  const [connectionsExpanded, setConnectionsExpanded] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  // Handle URL parameters for bus details
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const assetNo = urlParams.get('asset_no');
    
    if (assetNo) {
      fetchBusDetails(assetNo);
    } else {
      setShowBusDetails(false);
      setSelectedBus(null);
    }
  }, []);

  const fetchBusDetails = async (assetNo: string) => {
    try {
      setBusDetailsLoading(true);
      setBusDetailsError(null);
      
      // Get the authorization token
      let token = '';
      try {
        token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
      } catch {
        // Ignore storage errors
      }
      
      if (!token) {
        window.location.href = '/';
        return;
      }

      const base = getApiBase();
      const url = `${base}/api/method/eagles_apis.apis.assets.get_bus_details`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_name: assetNo
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
          } catch {
            // Ignore storage errors
          }
          window.location.href = '/';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BusDetailsApiResponse = await response.json();
      
      if (data.message.status === 200) {
        setSelectedBus(data.message.result);
        setShowBusDetails(true);
        // Fetch activities for this asset
        fetchActivities(assetNo);
        fetchDocumentCounts(assetNo);
      } else {
        throw new Error(data.message.message || 'Failed to fetch bus details');
      }
    } catch (err) {
      console.error('Error fetching bus details:', err);
      setBusDetailsError(err instanceof Error ? err.message : 'Failed to fetch bus details');
    } finally {
      setBusDetailsLoading(false);
    }
  };

  const fetchActivities = async (assetNo: string) => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      
      // Get the authorization token
      let token = '';
      try {
        token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
      } catch {
        // Ignore storage errors
      }
      
      if (!token) {
        return;
      }

      const base = getApiBase();
      const url = `${base}/api/method/eagles_apis.apis.assets.get_asset_activity`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          asset_no: assetNo
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
          } catch {
            // Ignore storage errors
          }
          window.location.href = '/';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ActivityApiResponse = await response.json();
      
      if (data.message.status === 200) {
        setActivities(data.message.result);
      } else {
        throw new Error(data.message.message || 'Failed to fetch activities');
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      setActivitiesError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fetch document counts
  const fetchDocumentCounts = async (assetNo: string) => {
    try {
      setDocumentCountsLoading(true);
      setDocumentCountsError(null);
      
      let token = '';
      try {
        token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
      } catch {
        // Ignore storage errors
      }
      
      if (!token) {
        return;
      }

      const base = getApiBase();
      const response = await fetch(`${base}/api/method/eagles_apis.apis.assets.get_asset_document_counts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ asset_no: assetNo }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
          } catch {
            // Ignore storage errors
          }
          window.location.href = '/';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message && data.message.status === 200 && data.message.result) {
        setDocumentCounts(data.message.result.counts || {});
      } else {
        throw new Error(data.message?.message || 'Failed to fetch document counts');
      }
    } catch (err) {
      console.error('Error fetching document counts:', err);
      setDocumentCountsError(err instanceof Error ? err.message : 'Failed to fetch document counts');
    } finally {
      setDocumentCountsLoading(false);
    }
  };

  const colors: Colors = theme === 'light'
    ? { bgGradient: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)', cardBg: '#fff', textPrimary: '#1f2a24', textMuted: 'rgba(0,0,0,0.6)', border: 'rgba(0,0,0,0.08)', bgSecondary: '#f8f9fa' }
    : { bgGradient: '#0B1712', cardBg: '#142019', textPrimary: '#E7F5EC', textMuted: 'rgba(231,245,236,0.7)', border: 'rgba(255,255,255,0.12)', bgSecondary: '#1a2520' };

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        
        // Get the authorization token from localStorage or sessionStorage
        let token = '';
        try {
          token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
        } catch {
          // Ignore storage errors
        }
        
        if (!token) {
          // Redirect to login page if no token found
          window.location.href = '/';
          return;
        }
        
        const base = getApiBase();
        const url = `${base}/api/method/eagles_apis.apis.assets.get_registered_buses`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Clear stored tokens and redirect to login
            try {
              localStorage.removeItem('auth_token');
              sessionStorage.removeItem('auth_token');
            } catch {
              // Ignore storage errors
            }
            window.location.href = '/';
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        
        if (data.message.status === 200) {
          setBuses(data.message.result);
        } else {
          throw new Error(data.message.message || 'Failed to fetch buses');
        }
      } catch (err) {
        console.error('Error fetching buses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch buses');
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleBusClick = (bus: Bus) => {
    window.location.href = `/buses?asset_no=${bus.asset_no}`;
  };


  const handleBackToList = () => {
    window.location.href = '/buses';
  };

  const handleFormSubmit = async () => {
    try {
      setFormLoading(true);
      
      // Get the authorization token
      let token = '';
      try {
        token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token') || '';
      } catch {
        // Ignore storage errors
      }
      
      if (!token) {
        window.location.href = '/';
        return;
      }

      const base = getApiBase();
      const url = `${base}/api/method/eagles_apis.apis.assets.register_school_bus`;
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('bus_no', formData.bus_no);
      formDataToSend.append('purchase_date', formData.purchase_date);
      formDataToSend.append('purchase_amount', formData.purchase_amount);
      formDataToSend.append('schedule_maintenance', formData.schedule_maintenance ? '1' : '0');
      formDataToSend.append('insurer_company_name', formData.insurer_company_name);
      formDataToSend.append('policy_number', formData.policy_number);
      formDataToSend.append('insured_value', formData.insured_value);
      
      if (formData.bus_image) {
        formDataToSend.append('bus_image', formData.bus_image);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        if (response.status === 401) {
          try {
            localStorage.removeItem('auth_token');
            sessionStorage.removeItem('auth_token');
          } catch {
            // Ignore storage errors
          }
          window.location.href = '/';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.message.status === 200) {
        setSuccessMessage(data.message.message);
        setShowAddDialog(false);
        setShowSuccessDialog(true);
        
        // Reset form
          setFormData({
            bus_no: '',
            purchase_date: '',
            purchase_amount: '',
            schedule_maintenance: true,
            insurer_company_name: '',
            policy_number: '',
            insured_value: '',
            bus_image: null,
          });
          if (fileInputRef) {
            fileInputRef.value = '';
          }
        
        // Refresh buses list
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.message.message || 'Failed to register bus');
      }
    } catch (err) {
      console.error('Error registering bus:', err);
      alert(err instanceof Error ? err.message : 'Failed to register bus');
    } finally {
      setFormLoading(false);
    }
  };

  // Bus details loading state
  if (busDetailsLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.bgGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
      }}>
        <title>Elimu Ride • Bus Details</title>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '4px solid rgba(46,125,50,0.2)',
            borderTopColor: '#2E7D32',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 600, color: '#2E7D32' }}>
          Loading bus details...
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Bus details error state
  if (busDetailsError) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.bgGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
      }}>
        <title>Elimu Ride • Bus Details</title>
        <div style={{
          background: colors.cardBg,
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: 400,
          border: `1px solid ${colors.border}`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#E53935', marginBottom: 12 }}>
            Error Loading Bus Details
          </h2>
          <p style={{ color: colors.textMuted, marginBottom: 20 }}>
            {busDetailsError}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={handleBackToList}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: `1px solid #2E7D32`,
                background: 'transparent',
                color: '#2E7D32',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Back to Buses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show bus details if selected
  if (showBusDetails && selectedBus) {

    return (
      <div style={{ 
        minHeight: '100vh', 
        background: colors.bgGradient, 
        color: colors.textPrimary,
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}>
        <title>Elimu Ride • {selectedBus.bus_no}</title>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: open ? 'minmax(200px, 240px) 1fr' : '60px 1fr', 
          transition: 'grid-template-columns 200ms ease',
          width: '100%',
          maxWidth: '100vw'
        }}>
          <aside style={{ 
            position: 'sticky', 
            top: 0, 
            alignSelf: 'start', 
            height: '100vh', 
            padding: '12px', 
            background: theme === 'light' ? '#FFFFFFAA' : '#0E1A13', 
            backdropFilter: theme === 'light' ? 'blur(6px)' : undefined, 
            borderRight: `1px solid ${colors.border}`,
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', borderRadius: 8 }}>
              <img src="/images/logo.png" alt="logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
              {open && <strong style={{ fontSize: 14 }}>Elimu Ride</strong>}
              <button 
                onClick={() => setOpen((v) => !v)} 
                style={{ 
                  marginLeft: 'auto', 
                  background: 'transparent', 
                  border: `1px solid ${colors.border}`, 
                  borderRadius: 6, 
                  padding: '4px 6px', 
                  cursor: 'pointer', 
                  color: colors.textPrimary,
                  fontSize: 12
                }}
              >
                {open ? '⟨' : '⟩'}
              </button>
            </div>
            <div style={{ height: 8 }} />
            <nav style={{ display: 'grid', gap: 4 }}>
              <DrawerItem colors={colors} label="Dashboard" icon={<span>📊</span>} onClick={() => window.location.href = '/home'} open={open} />
              <DrawerItem colors={colors} label="Students" icon={<span>🎒</span>} open={open} />
              <DrawerItem colors={colors} active label="Buses" icon={<span>🚌</span>} onClick={handleBackToList} open={open} />
              <DrawerItem colors={colors} label="Routes" icon={<span>🗺️</span>} open={open} />
              <DrawerItem colors={colors} label="Pickups & Drop-offs" icon={<span>📍</span>} open={open} />
              <DrawerItem colors={colors} label="Drivers" icon={<span>👨‍✈️</span>} open={open} />
              <DrawerItem colors={colors} label="Attendance" icon={<span>🧾</span>} open={open} />
              <DrawerItem colors={colors} label="Alerts" icon={<span>🔔</span>} open={open} />
              <DrawerItem colors={colors} label="Settings" icon={<span>⚙️</span>} open={open} />
            </nav>
          </aside>
          <main style={{ 
            padding: '12px',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}>
            <div style={{ 
              maxWidth: '100%', 
              margin: '0 auto',
              width: '100%'
            }}>
              {/* Header */}
              <div style={{
                background: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: `1px solid ${colors.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <button
                      onClick={handleBackToList}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: `1px solid #2E7D32`,
                        background: 'transparent',
                        color: '#2E7D32',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      ← Back to Buses
                    </button>
                    <div>
                      <h1 style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                        {selectedBus.bus_no}
                      </h1>
                      <p style={{ fontSize: 12, color: colors.textMuted, margin: '2px 0 0 0' }}>
                        Asset: {selectedBus.asset_no}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: selectedBus.maintenance_scheduled ? '#2E7D32' : '#E53935',
                        background: selectedBus.maintenance_scheduled 
                          ? 'rgba(46,125,50,0.1)' 
                          : 'rgba(229,57,53,0.1)',
                        padding: '4px 8px',
                        borderRadius: 6,
                      }}
                    >
                      {selectedBus.maintenance_scheduled ? '✓ Scheduled' : '⚠ Required'}
                    </span>
                    <StatusDisplay status={selectedBus.status} colors={colors} />
                    <ManageDropdown 
                      colors={colors} 
                      assetNo={selectedBus.asset_no}
                      status={selectedBus.status}
                      onActionComplete={() => {
                        // This will be called after successful action
                        // The page will refresh automatically
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Chart and Activity Timeline - Vertical Layout */}
            <div style={{ marginBottom: 16 }}>
              {/* Asset Value Line Chart - Full Width */}
              <div style={{ marginBottom: 16 }}>
                <AssetValueLineChart assetNo={selectedBus.asset_no} colors={colors} />
              </div>
              
              {/* Activity Timeline - Full Width */}
              <div>
                {activitiesLoading ? (
                  <div style={{
                    background: colors.cardBg,
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 16,
                  }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '3px solid rgba(46,125,50,0.2)',
                      borderTopColor: '#2E7D32',
                      animation: 'spin 1s linear infinite',
                    }} />
                    <div style={{ fontSize: 16, fontWeight: 600, color: colors.textMuted }}>
                      Loading activities...
                    </div>
                  </div>
                ) : activitiesError ? (
                  <div style={{
                    background: colors.cardBg,
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                    border: `1px solid ${colors.border}`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#E53935', marginBottom: 8 }}>
                      Error Loading Activities
                    </h3>
                    <p style={{ color: colors.textMuted, fontSize: 14 }}>
                      {activitiesError}
                    </p>
                  </div>
                ) : activities.length > 0 ? (
                  <ActivityTimeline activities={activities} colors={colors} />
                ) : (
                  <div style={{
                    background: colors.cardBg,
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                    border: `1px solid ${colors.border}`,
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, marginBottom: 8 }}>
                      No Activities Found
                    </h3>
                    <p style={{ color: colors.textMuted, fontSize: 14 }}>
                      No recent activity recorded for this asset.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {/* Bus Image */}
              <div style={{
                background: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: `1px solid ${colors.border}`,
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>
                  Bus Image
                </h2>
                <div style={{
                  width: '100%',
                  height: 180,
                  borderRadius: 8,
                  overflow: 'hidden',
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={selectedBus.image_url}
                    alt={`Bus ${selectedBus.bus_no}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgMTAwSDIwMFYyMDBIMTAwVjEwMFoiIGZpbGw9IiM0M0EwNDciLz4KPHN2ZyB4PSIxMTAiIHk9IjExMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMlM2LjQ4IDIyIDEyIDIyUzIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMloiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+Cjwvc3ZnPg==';
                    }}
                  />
                </div>
              </div>

              {/* Bus Details */}
              <div style={{
                background: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: `1px solid ${colors.border}`,
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 12 }}>
                  Bus Information
                </h2>
                
                <div style={{ display: 'grid', gap: 10 }}>
                  <DetailCard title="Asset Number" value={selectedBus.asset_no} icon="🏷️" colors={colors} />
                  <DetailCard title="Bus Number" value={selectedBus.bus_no} icon="🚌" colors={colors} />
                  <DetailCard title="Item Code" value={selectedBus.item_code} icon="📋" colors={colors} />
                  <DetailCard title="Company" value={selectedBus.company} icon="🏢" colors={colors} />
                  <DetailCard title="Insurer" value={selectedBus.insurer} icon="🛡️" colors={colors} />
                  <DetailCard title="Policy Number" value={selectedBus.policy_number} icon="📄" colors={colors} />
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div style={{ marginTop: 24 }}>
              <div style={{
                background: colors.cardBg,
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                border: `1px solid ${colors.border}`,
              }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary, marginBottom: 20 }}>
                  Financial & Maintenance Details
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                  <DetailCard 
                    title="Purchase Amount" 
                    value={`KSh ${selectedBus.purchase_amount.toLocaleString()}`} 
                    icon="💰" 
                    colors={colors}
                  />
                  <DetailCard 
                    title="Gross Purchase Amount" 
                    value={`KSh ${selectedBus.gross_purchase_amount.toLocaleString()}`} 
                    icon="💵" 
                    colors={colors}
                  />
                  <DetailCard 
                    title="Insured Value" 
                    value={`KSh ${selectedBus.insured_value.toLocaleString()}`} 
                    icon="🛡️" 
                    colors={colors}
                  />
                  <DetailCard 
                    title="Asset Quantity" 
                    value={selectedBus.asset_quantity} 
                    icon="📦" 
                    colors={colors}
                  />
                  <DetailCard 
                    title="Purchase Date" 
                    value={new Date(selectedBus.purchase_date).toLocaleDateString()} 
                    icon="📅" 
                    colors={colors}
                  />
                  <DetailCard 
                    title="Available Date" 
                    value={new Date(selectedBus.available_for_use_date).toLocaleDateString()} 
                    icon="✅" 
                    colors={colors}
                  />
                </div>
              </div>

              {/* Connections Section */}
              <div style={{
                background: colors.cardBg,
                borderRadius: 12,
                padding: 16,
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                border: `1px solid ${colors.border}`,
                marginTop: 16,
              }}>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    marginBottom: connectionsExpanded ? 16 : 0,
                  }}
                  onClick={() => setConnectionsExpanded(!connectionsExpanded)}
                >
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
                    Connections
                  </h2>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: connectionsExpanded 
                      ? 'linear-gradient(135deg, #43A047, #66BB6A)' 
                      : 'linear-gradient(135deg, #43A047, #66BB6A)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(67,160,71,0.3)',
                    border: '1px solid rgba(67,160,71,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(67,160,71,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(67,160,71,0.3)';
                  }}>
                    {connectionsExpanded ? '▲' : '▼'}
                  </div>
                </div>
                
                {connectionsExpanded && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {/* Column 1 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Movement
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['Asset Movement'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Movement
                            </span>
                          </div>
                          
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Value
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['Asset Value Adjustment'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Value Adjustment
                            </span>
                          </div>
                          
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Journal Entry
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['Journal Entry'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Journal Entry
                            </span>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Maintenance
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['Asset Maintenance'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Maintenance
                            </span>
                          </div>
                          
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Depreciation
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              0
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Depreciation Schedule
                            </span>
                          </div>
                          
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Asset Capitalization
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              0
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Capitalization
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Repair
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['Asset Repair'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Repair
                            </span>
                          </div>
                          
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Activity
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['Asset Activity'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              Asset Activity
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          School Trip Manifest
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            background: colors.bgSecondary,
                            borderRadius: 8,
                            border: `1px solid ${colors.border}`,
                            flex: 1,
                          }}>
                            <div style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              background: '#43A047',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 600,
                            }}>
                              {documentCounts['School Trip Manifest'] || 0}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>
                              School Trip Manifest
                            </span>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
      }}>
        <title>Elimu Ride • Buses</title>
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '4px solid rgba(46,125,50,0.2)',
            borderTopColor: '#2E7D32',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 600, color: '#2E7D32' }}>
          Loading buses...
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E7F5EC 0%, #F8FBF8 50%, #F1FFF6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
        padding: 20,
      }}>
        <title>Elimu Ride • Buses</title>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          textAlign: 'center',
          maxWidth: 400,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#E53935', marginBottom: 12 }}>
            Error Loading Buses
          </h2>
          <p style={{ color: '#666', marginBottom: 20 }}>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: 'linear-gradient(90deg, #43A047, #66BB6A)',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bgGradient, color: colors.textPrimary }}>
      <title>Elimu Ride • Buses</title>
      <div style={{ display: 'grid', gridTemplateColumns: open ? '240px 1fr' : '72px 1fr', transition: 'grid-template-columns 200ms ease' }}>
        <aside style={{ position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', padding: 16, background: theme === 'light' ? '#FFFFFFAA' : '#0E1A13', backdropFilter: theme === 'light' ? 'blur(6px)' : undefined, borderRight: `1px solid ${colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', borderRadius: 10 }}>
            <img src="/images/logo.png" alt="logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
            {open && <strong>Elimu Ride</strong>}
            <button onClick={() => setOpen((v) => !v)} style={{ marginLeft: 'auto', background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: colors.textPrimary }}>{open ? '⟨' : '⟩'}</button>
          </div>
          <div style={{ height: 10 }} />
          <nav style={{ display: 'grid', gap: 6 }}>
            <DrawerItem colors={colors} label="Dashboard" icon={<span>📊</span>} onClick={() => window.location.href = '/home'} open={open} />
            <DrawerItem colors={colors} label="Students" icon={<span>🎒</span>} open={open} />
            <DrawerItem colors={colors} active label="Buses" icon={<span>🚌</span>} open={open} />
            <DrawerItem colors={colors} label="Routes" icon={<span>🗺️</span>} open={open} />
            <DrawerItem colors={colors} label="Pickups & Drop-offs" icon={<span>📍</span>} open={open} />
            <DrawerItem colors={colors} label="Drivers" icon={<span>👨‍✈️</span>} open={open} />
            <DrawerItem colors={colors} label="Attendance" icon={<span>🧾</span>} open={open} />
            <DrawerItem colors={colors} label="Alerts" icon={<span>🔔</span>} open={open} />
            <DrawerItem colors={colors} label="Settings" icon={<span>⚙️</span>} open={open} />
          </nav>
        </aside>
        <main style={{ padding: 18 }}>
          {/* Header */}
          <div style={{
            background: colors.cardBg,
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: colors.textPrimary, margin: 0 }}>
                  🚌 Bus Fleet
                </h1>
                <p style={{ fontSize: 16, color: colors.textMuted, margin: '8px 0 0 0' }}>
                  Manage and monitor your school bus fleet
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#2E7D32',
                  background: 'rgba(46,125,50,0.1)',
                  padding: '8px 16px',
                  borderRadius: 8,
                }}>
                  {buses.length} Bus{buses.length !== 1 ? 'es' : ''}
                </span>
                <button
                  onClick={() => setShowAddDialog(true)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(90deg, #43A047, #66BB6A)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #2E7D32, #43A047)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #43A047, #66BB6A)';
                  }}
                >
                  ➕ Add a new Fleet
                </button>
                <Link
                  to="/home"
                  style={{
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: `1px solid #2E7D32`,
                    background: 'transparent',
                    color: '#2E7D32',
                    fontWeight: 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(46,125,50,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
          {/* Buses Grid */}
          {buses.length === 0 ? (
            <div style={{
              background: colors.cardBg,
              borderRadius: 16,
              padding: 48,
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🚌</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: colors.textPrimary, marginBottom: 8 }}>
                No Buses Found
              </h3>
              <p style={{ color: colors.textMuted }}>
                There are currently no buses registered in the system.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: 20,
            }}>
              {buses.map((bus) => (
                <BusCard
                  key={bus.asset_no}
                  bus={bus}
                  onClick={() => handleBusClick(bus)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add Fleet Dialog */}
      {showAddDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 50,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddDialog(false);
            }
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              maxHeight: '90vh',
              overflow: 'auto',
              background: colors.cardBg,
              borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              padding: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                🚌 Add New Fleet
              </h2>
              <button
                onClick={() => setShowAddDialog(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  border: 'none',
                  background: colors.border,
                  color: colors.textPrimary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Bus Number *
                </label>
                <input
                  type="text"
                  value={formData.bus_no}
                  onChange={(e) => setFormData({ ...formData, bus_no: e.target.value })}
                  placeholder="e.g., KCX 502T"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              {/* <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  School/Organization *
                </label>
                <input
                  type="text"
                  value={formData.tied_to_school}
                  onChange={(e) => setFormData({ ...formData, tied_to_school: e.target.value })}
                  placeholder="e.g., Government of Kenya"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div> */}

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Purchase Date *
                </label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Purchase Amount *
                </label>
                <input
                  type="number"
                  value={formData.purchase_amount}
                  onChange={(e) => setFormData({ ...formData, purchase_amount: e.target.value })}
                  placeholder="e.g., 750000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Insurer Company *
                </label>
                <input
                  type="text"
                  value={formData.insurer_company_name}
                  onChange={(e) => setFormData({ ...formData, insurer_company_name: e.target.value })}
                  placeholder="e.g., Sanlam General Insurance"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Policy Number *
                </label>
                <input
                  type="text"
                  value={formData.policy_number}
                  onChange={(e) => setFormData({ ...formData, policy_number: e.target.value })}
                  placeholder="e.g., SGI9018AH1Ax"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Insured Value *
                </label>
                <input
                  type="number"
                  value={formData.insured_value}
                  onChange={(e) => setFormData({ ...formData, insured_value: e.target.value })}
                  placeholder="e.g., 45000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                  Schedule Maintenance
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={formData.schedule_maintenance}
                    onChange={(e) => setFormData({ ...formData, schedule_maintenance: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: colors.textMuted }}>
                    Enable scheduled maintenance
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>
                Bus Image
              </label>
              {formData.bus_image ? (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>📷</span>
                    <span style={{ fontSize: 14, color: colors.textPrimary }}>
                      {formData.bus_image.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, bus_image: null });
                      if (fileInputRef) {
                        fileInputRef.value = '';
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: 'none',
                      background: '#E53935',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <input
                  ref={setFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormData({ ...formData, bus_image: file });
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `1px solid ${colors.border}`,
                    background: colors.cardBg,
                    color: colors.textPrimary,
                    fontSize: 14,
                  }}
                />
              )}
              <p style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                Upload a photo of the bus or take a picture
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddDialog(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  background: 'transparent',
                  color: colors.textPrimary,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={formLoading || !formData.bus_no || !formData.purchase_date || !formData.purchase_amount || !formData.insurer_company_name || !formData.policy_number || !formData.insured_value}
                style={{
                  padding: '12px 24px',
                  borderRadius: 8,
                  border: 'none',
                  background: formLoading ? colors.border : 'linear-gradient(90deg, #43A047, #66BB6A)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.6 : 1,
                }}
              >
                {formLoading ? 'Adding Fleet...' : 'Add Fleet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
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
              background: colors.cardBg,
              borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              padding: 32,
              textAlign: 'center',
            }}
          >
            <div style={{ 
              display: 'inline-grid', 
              placeItems: 'center', 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: 'rgba(46,125,50,0.12)', 
              margin: '0 auto',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
                ✓
              </div>
            </div>
            <div style={{ height: 20 }} />
            <h2 style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary, marginBottom: 12 }}>
              Fleet Added Successfully!
            </h2>
            <p style={{ color: colors.textMuted, marginBottom: 24 }}>
              {successMessage}
            </p>
            <button
              onClick={() => setShowSuccessDialog(false)}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'linear-gradient(90deg, #43A047, #66BB6A)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
