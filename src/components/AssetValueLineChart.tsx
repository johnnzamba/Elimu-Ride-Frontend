"use client";

import React, { useState, useEffect } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
};

type AssetValueSeriesData = {
  date: string;
  amount: number;
};

type AssetValueSeriesResponse = {
  message: {
    status: number;
    message: string;
    result: {
      asset_name: string;
      labels: string[];
      values: number[];
      series: AssetValueSeriesData[];
      count: number;
    };
  };
};

type AssetValueLineChartProps = {
  colors: Colors;
  assetNo: string;
};

function AssetValueLineChart({ colors, assetNo }: AssetValueLineChartProps) {
  const [chartData, setChartData] = useState<AssetValueSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getApiBase = (): string => {
    if (typeof window === 'undefined') return 'http://elimu.com:8000';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? '' : 'http://elimu.com:8000';
  };

  useEffect(() => {
    fetchAssetValueSeries();
  }, [assetNo]);

  const fetchAssetValueSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
      const url = `${base}/api/method/eagles_apis.apis.assets.get_asset_value_series`;
      
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

      const data: AssetValueSeriesResponse = await response.json();
      
      if (data.message.status === 200) {
        // Sort series by date to ensure proper line chart progression
        const sortedSeries = data.message.result.series.sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setChartData(sortedSeries);
      } else {
        throw new Error(data.message.message || 'Failed to fetch asset value series');
      }
    } catch (err) {
      console.error('Error fetching asset value series:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch asset value series');
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: `linear-gradient(135deg, ${colors.cardBg}, #F8FBF8)`,
          border: `2px solid #43A047`,
          borderRadius: 12,
          padding: 16,
          boxShadow: '0 8px 25px rgba(67,160,71,0.3), 0 4px 15px rgba(0,0,0,0.1)',
          animation: 'pulse-glow 0.6s ease-in-out',
        }}>
          <div style={{ 
            fontWeight: 800, 
            color: '#43A047', 
            fontSize: 16,
            marginBottom: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {new Date(label).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div style={{ 
            fontWeight: 700, 
            color: colors.textPrimary, 
            fontSize: 18,
            marginBottom: 4,
          }}>
            KSh {payload[0].value.toLocaleString()}
          </div>
          <div style={{ 
            fontSize: 12, 
            color: colors.textMuted,
            fontStyle: 'italic',
          }}>
            Asset Value
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        background: colors.cardBg,
        borderRadius: 20,
        padding: 32,
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        minHeight: 400,
      }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '4px solid rgba(46,125,50,0.2)',
          borderTopColor: '#2E7D32',
          animation: 'spin 1s linear infinite',
        }} />
        <div style={{ fontSize: 18, fontWeight: 600, color: colors.textMuted }}>
          Loading asset value series...
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: colors.cardBg,
        borderRadius: 20,
        padding: 32,
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#E53935', marginBottom: 8 }}>
          Error Loading Asset Value Series
        </h3>
        <p style={{ color: colors.textMuted, fontSize: 14 }}>
          {error}
        </p>
        <button
          onClick={fetchAssetValueSeries}
          style={{
            padding: '12px 24px',
            borderRadius: 8,
            border: 'none',
            background: 'linear-gradient(90deg, #43A047, #66BB6A)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{
        background: colors.cardBg,
        borderRadius: 20,
        padding: 32,
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        border: `1px solid ${colors.border}`,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.textPrimary, marginBottom: 8 }}>
          No Asset Value Data
        </h3>
        <p style={{ color: colors.textMuted, fontSize: 14 }}>
          No asset value series data available for this asset.
        </p>
      </div>
    );
  }

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
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #43A047, #66BB6A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(67,160,71,0.3)',
          }}>
            📈
          </div>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
              Asset Value Trend
            </h3>
            <p style={{ fontSize: 14, color: colors.textMuted, margin: '4px 0 0 0' }}>
              Asset value progression over time
            </p>
          </div>
        </div>

        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: colors.textPrimary, fontSize: 12 }}
                axisLine={{ stroke: colors.border }}
                tickLine={{ stroke: colors.border }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tick={{ fill: colors.textPrimary, fontSize: 12 }}
                axisLine={{ stroke: colors.border }}
                tickLine={{ stroke: colors.border }}
                tickFormatter={(value) => `KSh ${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#43A047"
                strokeWidth={3}
                dot={{ 
                  fill: '#43A047', 
                  strokeWidth: 2, 
                  stroke: '#fff',
                  r: 6,
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: '#43A047', 
                  strokeWidth: 2,
                  fill: '#fff',
                }}
                style={{
                  filter: 'drop-shadow(0 4px 8px rgba(67,160,71,0.3))',
                }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Info */}
        <div style={{
          marginTop: 24,
          padding: 16,
          background: 'rgba(67,160,71,0.05)',
          borderRadius: 12,
          border: '1px solid rgba(67,160,71,0.1)',
        }}>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #43A047, #66BB6A)',
              }} />
              <span style={{ fontSize: 14, color: colors.textMuted, fontWeight: 600 }}>
                Data Points
              </span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#43A047' }}>
              {chartData.length}
            </span>
          </div> */}
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0% { transform: scale(1); box-shadow: 0 8px 25px rgba(67,160,71,0.3); }
          50% { transform: scale(1.02); box-shadow: 0 12px 35px rgba(67,160,71,0.5); }
          100% { transform: scale(1); box-shadow: 0 8px 25px rgba(67,160,71,0.3); }
        }
      `}</style>
    </div>
  );
}

export default AssetValueLineChart;
