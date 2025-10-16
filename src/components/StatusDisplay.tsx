"use client";

import React from 'react';

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
};

type StatusDisplayProps = {
  status: string;
  colors: Colors;
};

function StatusDisplay({ status, colors }: StatusDisplayProps) {
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('scrapped')) {
      return {
        color: '#E53935',
        background: 'rgba(229,57,53,0.1)',
        border: 'rgba(229,57,53,0.2)'
      };
    }
    
    if (statusLower.includes('depreciated')) {
      return {
        color: '#FF9800',
        background: 'rgba(255,152,0,0.1)',
        border: 'rgba(255,152,0,0.2)'
      };
    }
    
    if (statusLower.includes('active')) {
      return {
        color: '#2E7D32',
        background: 'rgba(46,125,50,0.1)',
        border: 'rgba(46,125,50,0.2)'
      };
    }
    
    if (statusLower.includes('inactive')) {
      return {
        color: '#9E9E9E',
        background: 'rgba(158,158,158,0.1)',
        border: 'rgba(158,158,158,0.2)'
      };
    }
    
    if (statusLower.includes('maintenance')) {
      return {
        color: '#FF5722',
        background: 'rgba(255,87,34,0.1)',
        border: 'rgba(255,87,34,0.2)'
      };
    }
    
    if (statusLower.includes('repair')) {
      return {
        color: '#E91E63',
        background: 'rgba(233,30,99,0.1)',
        border: 'rgba(233,30,99,0.2)'
      };
    }
    
    // Default status
    return {
      color: '#2196F3',
      background: 'rgba(33,150,243,0.1)',
      border: 'rgba(33,150,243,0.2)'
    };
  };

  const statusStyle = getStatusColor(status);

  return (
    <span
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: statusStyle.color,
        background: statusStyle.background,
        border: `1px solid ${statusStyle.border}`,
        padding: '8px 16px',
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: `0 2px 8px ${statusStyle.color}20`,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${statusStyle.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = `0 2px 8px ${statusStyle.color}20`;
      }}
    >
      {/* <span style={{ fontSize: 16 }}>{statusStyle.icon}</span> */}
      {status}
    </span>
  );
}

export default StatusDisplay;
