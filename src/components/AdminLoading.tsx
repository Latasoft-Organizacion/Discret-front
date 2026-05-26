import '../styles/adminLoading.css';

type AdminSkeletonProps = {
  variant?: 'card' | 'row' | 'table' | 'summary';
  count?: number;
  label?: string;
};

function AdminSpinner({ label = 'Cargando datos' }: { label?: string }) {
  return (
    <div className="admin-loading-spinner" role="status" aria-live="polite">
      <span aria-hidden="true"></span>
      <p>{label}</p>
    </div>
  );
}

function AdminSkeleton({
  variant = 'card',
  count = 3,
  label = 'Cargando contenido',
}: AdminSkeletonProps) {
  return (
    <div className={`admin-skeleton admin-skeleton-${variant}`} role="status" aria-live="polite" aria-label={label}>
      {Array.from({ length: count }).map((_, index) => (
        <div className="admin-skeleton-item" key={index}>
          <span className="admin-skeleton-icon"></span>
          <div>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

export { AdminSkeleton, AdminSpinner };
