"use client";

import React, { useState } from 'react';
import RepairAssetDialog from './RepairAssetDialog';
import AdjustAssetValueDialog from './AdjustAssetValueDialog';

type Colors = {
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  border: string;
};

type AssetActionsProps = {
  colors: Colors;
  assetNo: string;
  status: string;
  onActionComplete: () => void;
};

type SuccessDialogProps = {
  colors: Colors;
  message: string;
  onClose: () => void;
};

function SuccessDialog({ colors, message, onClose }: SuccessDialogProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

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
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: colors.cardBg,
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          padding: 40,
          textAlign: 'center',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ 
          display: 'inline-grid', 
          placeItems: 'center', 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, rgba(46,125,50,0.15), rgba(67,160,71,0.1))', 
          margin: '0 auto 24px',
          animation: 'success-pulse 2s infinite'
        }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2E7D32, #43A047)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
            boxShadow: '0 8px 20px rgba(46,125,50,0.3)',
            animation: 'success-check 0.6s ease-in-out',
          }}>
            ✓
          </div>
        </div>
        
        <h2 style={{ 
          fontSize: 28, 
          fontWeight: 800, 
          color: colors.textPrimary, 
          marginBottom: 16,
          background: 'linear-gradient(135deg, #2E7D32, #43A047)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Success!
        </h2>
        
        <p style={{ 
          color: colors.textMuted, 
          marginBottom: 32,
          fontSize: 16,
          lineHeight: 1.5,
        }}>
          {message}
        </p>
        
        <button
          onClick={handleClose}
          style={{
            padding: '14px 32px',
            borderRadius: 12,
            border: 'none',
            background: 'linear-gradient(135deg, #43A047, #66BB6A)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: 16,
            boxShadow: '0 8px 20px rgba(67,160,71,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(67,160,71,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(67,160,71,0.3)';
          }}
        >
          Continue
        </button>
      </div>

      <style>{`
        @keyframes success-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes success-check {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ManageDropdown({ colors, assetNo, status, onActionComplete }: AssetActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showRepairDialog, setShowRepairDialog] = useState(false);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  
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

  const handleScrapAsset = async () => {
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
      const url = `${base}/api/method/eagles_apis.apis.assets.scrap_asset`;
      
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

      const data = await response.json();
      
      if (data.message.status === 200) {
        setSuccessMessage(data.message.message);
        setShowSuccess(true);
        playSuccessSound();
        
        // Refresh the page after a delay to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(data.message.message || 'Failed to scrap asset');
      }
    } catch (err) {
      console.error('Error scraping asset:', err);
      alert(err instanceof Error ? err.message : 'Failed to scrap asset');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleRestoreAsset = async () => {
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
      const url = `${base}/api/method/eagles_apis.apis.assets.restore_asset?asset_name=${assetNo}`;
      
      const response = await fetch(url, {
        method: 'POST',
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
        setSuccessMessage(data.message.message);
        setShowSuccess(true);
        playSuccessSound();
        
        // Refresh the page after a delay to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(data.message.message || 'Failed to restore asset');
      }
    } catch (err) {
      console.error('Error restoring asset:', err);
      alert(err instanceof Error ? err.message : 'Failed to restore asset');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleRepairSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    onActionComplete();
  };

  const handleRepairError = (message: string) => {
    alert(message);
  };

  const handleAdjustSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    onActionComplete();
  };

  const handleAdjustError = (message: string) => {
    alert(message);
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'Scrap Asset':
        handleScrapAsset();
        break;
      case 'Restore Asset':
        handleRestoreAsset();
        break;
      case 'Repair Asset':
        setShowRepairDialog(true);
        setIsOpen(false);
        break;
      case 'Adjust Asset Value':
        setShowAdjustDialog(true);
        setIsOpen(false);
        break;
      default:
        alert(`${action} functionality coming soon!`);
        setIsOpen(false);
        break;
    }
  };

  // Filter actions based on status
  const getAvailableActions = () => {
    const allActions = [
      { label: 'Restore Asset', icon: '🔄' },
      { label: 'Scrap Asset', icon: '🗑️' },
      { label: 'Maintain Asset', icon: '🔧' },
      { label: 'Repair Asset', icon: '🛠️' },
      { label: 'Adjust Asset Value', icon: '📊' },
    ];

    // If status is "Scrapped", hide "Scrap Asset" and show all others including "Restore Asset"
    // If status is not "Scrapped", hide "Restore Asset" and show all others including "Scrap Asset"
    if (status === 'Scrapped') {
      return allActions.filter(action => action.label !== 'Scrap Asset');
    } else {
      return allActions.filter(action => action.label !== 'Restore Asset');
    }
  };

  const availableActions = getAvailableActions();

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
          style={{
            padding: '12px 20px',
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            background: colors.cardBg,
            color: colors.textPrimary,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 0.2s ease',
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'rgba(46,125,50,0.1)';
              e.currentTarget.style.borderColor = '#2E7D32';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = colors.cardBg;
              e.currentTarget.style.borderColor = colors.border;
            }
          }}
        >
          {loading ? 'Processing...' : 'Manage'}
          <span style={{ fontSize: 12 }}>{isOpen ? '▲' : '▼'}</span>
        </button>
        
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              background: colors.cardBg,
              borderRadius: 12,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              border: `1px solid ${colors.border}`,
              minWidth: 200,
              zIndex: 50,
            }}
          >
            {availableActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action.label)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  background: 'transparent',
                  color: colors.textPrimary,
                  textAlign: 'left',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  borderRadius: index === 0 ? '12px 12px 0 0' : index === availableActions.length - 1 ? '0 0 12px 12px' : '0',
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'rgba(46,125,50,0.1)';
                    e.currentTarget.style.color = '#2E7D32';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = colors.textPrimary;
                  }
                }}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {showSuccess && (
        <SuccessDialog
          colors={colors}
          message={successMessage}
          onClose={() => setShowSuccess(false)}
        />
      )}

      {showRepairDialog && (
        <RepairAssetDialog
          colors={colors}
          assetNo={assetNo}
          isOpen={showRepairDialog}
          onClose={() => setShowRepairDialog(false)}
          onSuccess={handleRepairSuccess}
          onError={handleRepairError}
        />
      )}

      {showAdjustDialog && (
        <AdjustAssetValueDialog
          colors={colors}
          assetNo={assetNo}
          isOpen={showAdjustDialog}
          onClose={() => setShowAdjustDialog(false)}
          onSuccess={handleAdjustSuccess}
          onError={handleAdjustError}
        />
      )}
    </>
  );
}

export default ManageDropdown;
