"use client";

import React, { useState, useEffect } from 'react';

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
};

type AdjustAssetValueDialogProps = {
  colors: Colors;
  assetNo: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

type AdjustFormData = {
  adjusted_on: string;
  new_asset_value: string;
  difference_account: string;
};

function AdjustAssetValueDialog({ colors, assetNo, isOpen, onClose, onSuccess, onError }: AdjustAssetValueDialogProps) {
  const [formData, setFormData] = useState<AdjustFormData>({
    adjusted_on: '',
    new_asset_value: '',
    difference_account: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState<string | null>(null);

  const getApiBase = (): string => {
    if (typeof window === 'undefined') return 'http://elimu.com:8000';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? '' : 'http://elimu.com:8000';
  };

  const playSuccessSound = () => {
    try {
      const audio = new Audio('/success.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch {
      // Ignore audio errors
    }
  };

  const playErrorSound = () => {
    try {
      const audio = new Audio('/error.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch {
      // Ignore audio errors
    }
  };

  // Fetch accounts when dialog opens
  useEffect(() => {
    if (isOpen && accounts.length === 0) {
      fetchAccounts();
    }
  }, [isOpen]);

  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      setAccountsError(null);
      
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
      const url = `${base}/api/method/eagles_apis.apis.assets.get_accounts_by_school`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
        setAccounts(data.message.result);
        
        // Set default account to "Depreciation - GOK" if available
        const defaultAccount = data.message.result.find((account: string) => 
          account.toLowerCase().includes('depreciation')
        );
        if (defaultAccount) {
          setFormData(prev => ({ ...prev, difference_account: defaultAccount }));
        }
      } else {
        throw new Error(data.message.message || 'Failed to fetch accounts');
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setAccountsError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
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
      const url = `${base}/api/method/eagles_apis.apis.assets.adjust_asset_value`;
      
      const requestBody = {
        asset_name: assetNo,
        adjusted_on: formData.adjusted_on,
        new_asset_value: formData.new_asset_value,
        difference_account: formData.difference_account || undefined, // Optional parameter
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
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
        playSuccessSound();
        onSuccess(data.message.message);
        onClose();
        
        // Reset form
        setFormData({
          adjusted_on: '',
          new_asset_value: '',
          difference_account: '',
        });
      } else {
        throw new Error(data.message.message || 'Failed to adjust asset value');
      }
    } catch (err) {
      console.error('Error adjusting asset value:', err);
      playErrorSound();
      onError(err instanceof Error ? err.message : 'Failed to adjust asset value');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 100,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
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
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          padding: 32,
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #43A047, #66BB6A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#fff',
              boxShadow: '0 8px 20px rgba(67,160,71,0.3)',
            }}>
              📊
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                Adjust Asset Value
              </h2>
              <p style={{ fontSize: 16, color: colors.textMuted, margin: '4px 0 0 0' }}>
                Update asset value for {assetNo}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: 'none',
              background: colors.border,
              color: colors.textPrimary,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              opacity: loading ? 0.5 : 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <div style={{ display: 'grid', gap: 24 }}>
          {/* Basic Information Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 16, 
                fontWeight: 700, 
                color: colors.textPrimary, 
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                📅 Adjusted On *
              </label>
              <input
                type="date"
                value={formData.adjusted_on}
                onChange={(e) => setFormData({ ...formData, adjusted_on: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: `2px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#43A047';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,160,71,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: 16, 
                fontWeight: 700, 
                color: colors.textPrimary, 
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                💰 New Asset Value *
              </label>
              <input
                type="number"
                value={formData.new_asset_value}
                onChange={(e) => setFormData({ ...formData, new_asset_value: e.target.value })}
                placeholder="e.g., 600000"
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: `2px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#43A047';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,160,71,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>
          </div>

          {/* Account Selection */}
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: 16, 
              fontWeight: 700, 
              color: colors.textPrimary, 
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              🏦 Difference Account
              <span style={{ 
                fontSize: 12, 
                fontWeight: 500, 
                color: colors.textMuted,
                background: 'rgba(67,160,71,0.1)',
                padding: '2px 8px',
                borderRadius: 6,
              }}>
                Optional
              </span>
            </label>
            
            {accountsLoading ? (
              <div style={{
                padding: '14px 18px',
                borderRadius: 12,
                border: `2px solid ${colors.border}`,
                background: colors.cardBg,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: colors.textMuted,
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  border: `2px solid ${colors.border}`,
                  borderTopColor: '#43A047',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                Loading accounts...
              </div>
            ) : accountsError ? (
              <div style={{
                padding: '14px 18px',
                borderRadius: 12,
                border: `2px solid #E53935`,
                background: 'rgba(229,57,53,0.05)',
                color: '#E53935',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                ⚠️ {accountsError}
                <button
                  onClick={fetchAccounts}
                  style={{
                    marginLeft: 'auto',
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid #E53935',
                    background: 'transparent',
                    color: '#E53935',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <select
                value={formData.difference_account}
                onChange={(e) => setFormData({ ...formData, difference_account: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  borderRadius: 12,
                  border: `2px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#43A047';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,160,71,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">Select an account (optional)</option>
                {accounts.map((account, index) => (
                  <option key={index} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            )}
            
            <p style={{ 
              fontSize: 12, 
              color: colors.textMuted, 
              marginTop: 8,
              fontStyle: 'italic',
            }}>
              💡 Default: "Depreciation - GOK" (if available)
            </p>
          </div>

          {/* Information Card */}
          <div style={{
            padding: 20,
            background: 'rgba(67,160,71,0.05)',
            borderRadius: 16,
            border: `2px solid rgba(67,160,71,0.1)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #43A047, #66BB6A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: '#fff',
              }}>
                ℹ️
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
                Asset Value Adjustment
              </h3>
            </div>
            <p style={{ 
              fontSize: 14, 
              color: colors.textMuted, 
              margin: 0,
              lineHeight: 1.5,
            }}>
              This will create a new asset value adjustment record. The difference between the current and new value will be recorded in the selected account. If no account is selected, the system will use the default depreciation account.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 32 }}>
          <button
            onClick={handleClose}
            disabled={loading}
            style={{
              padding: '14px 28px',
              borderRadius: 12,
              border: `2px solid ${colors.border}`,
              background: 'transparent',
              color: colors.textPrimary,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 16,
              opacity: loading ? 0.5 : 1,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'rgba(67,160,71,0.1)';
                e.currentTarget.style.borderColor = '#43A047';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = colors.border;
              }
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.adjusted_on || !formData.new_asset_value}
            style={{
              padding: '14px 28px',
              borderRadius: 12,
              border: 'none',
              background: loading ? colors.border : 'linear-gradient(135deg, #43A047, #66BB6A)',
              color: '#fff',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 16,
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 8px 20px rgba(67,160,71,0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(67,160,71,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(67,160,71,0.3)';
              }
            }}
          >
            {loading ? 'Adjusting Value...' : 'Adjust Asset Value'}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdjustAssetValueDialog;
