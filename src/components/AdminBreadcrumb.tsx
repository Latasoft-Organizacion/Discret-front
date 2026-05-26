type AdminBreadcrumbProps = {
  current: string;
};

function AdminBreadcrumb({ current }: AdminBreadcrumbProps) {
  return (
    <nav className="admin-breadcrumb" aria-label="Ruta de navegación">
      <span>Panel admin</span>
      <span>/</span>
      <strong>{current}</strong>
    </nav>
  );
}

export default AdminBreadcrumb;
