"use client";

import React, { useState } from 'react';

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
};

type RepairAssetDialogProps = {
  colors: Colors;
  assetNo: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
};

type RepairFormData = {
  failure_date: string;
  repair_status: 'Pending' | 'Completed' | 'Cancelled';
  create_receipt: boolean;
  party_conducting_repair: string;
  specify_supplier_receipt_no: string;
  total_cost_incurred: string;
  failure_description: string;
  actions_undertaken: string;
};

function RepairAssetDialog({ colors, assetNo, isOpen, onClose, onSuccess, onError }: RepairAssetDialogProps) {
  const [formData, setFormData] = useState<RepairFormData>({
    failure_date: '',
    repair_status: 'Pending',
    create_receipt: false,
    party_conducting_repair: '',
    specify_supplier_receipt_no: '',
    total_cost_incurred: '',
    failure_description: '',
    actions_undertaken: '',
  });
  
  const [loading, setLoading] = useState(false);

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
      const url = `${base}/api/method/eagles_apis.apis.assets.create_asset_repair`;
      
      const requestBody = {
        asset: assetNo,
        failure_date: formData.failure_date,
        repair_status: formData.repair_status,
        create_receipt: formData.create_receipt ? "1" : "0",
        party_conducting_repair: formData.party_conducting_repair,
        specify_supplier_receipt_no: formData.specify_supplier_receipt_no,
        total_cost_incurred: formData.total_cost_incurred,
        failure_description: formData.failure_description,
        actions_undertaken: formData.actions_undertaken,
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
          failure_date: '',
          repair_status: 'Pending',
          create_receipt: false,
          party_conducting_repair: '',
          specify_supplier_receipt_no: '',
          total_cost_incurred: '',
          failure_description: '',
          actions_undertaken: '',
        });
      } else {
        throw new Error(data.message.message || 'Failed to create asset repair');
      }
    } catch (err) {
      console.error('Error creating asset repair:', err);
      playErrorSound();
      onError(err instanceof Error ? err.message : 'Failed to create asset repair');
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
          maxWidth: 700,
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
              🛠️
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, margin: 0 }}>
                Repair Asset
              </h2>
              <p style={{ fontSize: 16, color: colors.textMuted, margin: '4px 0 0 0' }}>
                Create repair record for {assetNo}
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
                📅 Failure Date *
              </label>
              <input
                type="date"
                value={formData.failure_date}
                onChange={(e) => setFormData({ ...formData, failure_date: e.target.value })}
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
                🔄 Repair Status *
              </label>
              <select
                value={formData.repair_status}
                onChange={(e) => setFormData({ ...formData, repair_status: e.target.value as RepairFormData['repair_status'] })}
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
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Receipt Section */}
          <div style={{
            padding: 20,
            background: 'rgba(67,160,71,0.05)',
            borderRadius: 16,
            border: `2px solid rgba(67,160,71,0.1)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <input
                type="checkbox"
                checked={formData.create_receipt}
                onChange={(e) => setFormData({ ...formData, create_receipt: e.target.checked })}
                style={{ width: 20, height: 20, cursor: 'pointer' }}
              />
              <label style={{ 
                fontSize: 18, 
                fontWeight: 700, 
                color: colors.textPrimary,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                🧾 Do you wish to create receipt?
              </label>
            </div>

            {formData.create_receipt && (
              <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: colors.textMuted, 
                      marginBottom: 8,
                    }}>
                      Name of Party Handling Repair *
                    </label>
                    <input
                      type="text"
                      value={formData.party_conducting_repair}
                      onChange={(e) => setFormData({ ...formData, party_conducting_repair: e.target.value })}
                      placeholder="e.g., Culture Joseph Hill"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: `1px solid ${colors.border}`,
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        fontSize: 14,
                        transition: 'all 0.3s ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#43A047';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,160,71,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required={formData.create_receipt}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: 14, 
                      fontWeight: 600, 
                      color: colors.textMuted, 
                      marginBottom: 8,
                    }}>
                      Receipt Number from Party *
                    </label>
                    <input
                      type="text"
                      value={formData.specify_supplier_receipt_no}
                      onChange={(e) => setFormData({ ...formData, specify_supplier_receipt_no: e.target.value })}
                      placeholder="e.g., CAK781HABA"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: `1px solid ${colors.border}`,
                        background: colors.cardBg,
                        color: colors.textPrimary,
                        fontSize: 14,
                        transition: 'all 0.3s ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#43A047';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,160,71,0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required={formData.create_receipt}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: 14, 
                    fontWeight: 600, 
                    color: colors.textMuted, 
                    marginBottom: 8,
                  }}>
                    Total Cost Incurred in Repair *
                  </label>
                  <input
                    type="number"
                    value={formData.total_cost_incurred}
                    onChange={(e) => setFormData({ ...formData, total_cost_incurred: e.target.value })}
                    placeholder="e.g., 21000"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: `1px solid ${colors.border}`,
                      background: colors.cardBg,
                      color: colors.textPrimary,
                      fontSize: 14,
                      transition: 'all 0.3s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#43A047';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(67,160,71,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = colors.border;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required={formData.create_receipt}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description Fields */}
          <div style={{ display: 'grid', gap: 20 }}>
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
                🔍 Failure Description *
              </label>
              <textarea
                value={formData.failure_description}
                onChange={(e) => setFormData({ ...formData, failure_description: e.target.value })}
                placeholder="Describe the failure in detail... What went wrong? When did it happen? What symptoms were observed?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: `2px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
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
                ⚡ Actions Undertaken *
              </label>
              <textarea
                value={formData.actions_undertaken}
                onChange={(e) => setFormData({ ...formData, actions_undertaken: e.target.value })}
                placeholder="Describe the repair actions taken... What was fixed? What parts were replaced? What procedures were followed?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 12,
                  border: `2px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  resize: 'vertical',
                  fontFamily: 'inherit',
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
            disabled={loading || !formData.failure_date || !formData.failure_description || !formData.actions_undertaken || (formData.create_receipt && (!formData.party_conducting_repair || !formData.specify_supplier_receipt_no || !formData.total_cost_incurred))}
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
            {loading ? 'Creating Repair Record...' : 'Create Repair Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RepairAssetDialog;
