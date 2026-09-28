import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Konfirmasi',
  confirmVariant = 'primary', // 'primary', 'emerald', 'warning', 'danger'
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (confirmVariant) {
      case 'emerald':
        return {
          bg: 'linear-gradient(135deg, #10b981, #047857)',
          shadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          iconColor: '#10b981'
        };
      case 'warning':
        return {
          bg: 'linear-gradient(135deg, #f59e0b, #d97706)',
          shadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
          iconColor: '#f59e0b'
        };
      case 'danger':
        return {
          bg: 'linear-gradient(135deg, #ef4444, #dc2626)',
          shadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
          iconColor: '#ef4444'
        };
      default:
        return {
          bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          shadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
          iconColor: '#2563eb'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
            <AlertCircle size={20} style={{ color: styles.iconColor }} />
            <span>{title}</span>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
          {message}
        </div>

        {/* Modal Actions Footer */}
        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Batal
          </button>

          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '0.55rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              background: styles.bg,
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: styles.shadow,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
