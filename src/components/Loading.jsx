export default function LoadingScreen({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      {/* Simple Minimal Spinner Ring */}
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTopColor: '#2563eb',
          animation: 'spin 0.75s linear infinite'
        }}
      />

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
