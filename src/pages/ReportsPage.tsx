import { useState } from 'react';
import { BarChart3, CalendarDays, FileText, Search, WalletCards } from 'lucide-react';
import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { AdminSkeleton } from '../components/AdminLoading';
import AdminToast from '../components/AdminToast';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminSidebar.css';
import '../styles/reports.css';

function ReportsPage() {
  // Estado para abrir o cerrar el modal de generar reporte
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const isLoading = false;

  // Estados del formulario del modal
  const [reportType, setReportType] = useState('');
  const [reportFormat, setReportFormat] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Datos simulados de reportes
  const reports = [
    { id: 1, title: 'Reporte diario', date: '24/05/2026', amount: '$180.000', reservations: 6, status: 'Generado' },
    { id: 2, title: 'Reporte semanal', date: '20/05/2026', amount: '$940.000', reservations: 28, status: 'Pendiente' },
    { id: 3, title: 'Reporte mensual', date: '01/05/2026', amount: '$3.850.000', reservations: 112, status: 'Generado' },
  ];

  const reportFilters = ['Todos', 'Diarios', 'Semanales', 'Mensuales'];

  const filteredReports = reports.filter((report) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch
      || report.title.toLowerCase().includes(normalizedSearch)
      || report.date.toLowerCase().includes(normalizedSearch)
      || report.amount.toLowerCase().includes(normalizedSearch)
      || report.status.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    if (activeFilter === 'Todos') {
      return true;
    }

    return report.title.toLowerCase().includes(activeFilter.slice(0, -1).toLowerCase());
  });

  // Limpia los campos del formulario
  const resetForm = () => {
    setReportType('');
    setReportFormat('');
    setStartDate('');
    setEndDate('');
    setModalMessage('');
  };

  // Cierra el modal y reinicia el formulario
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Simula la generación del reporte
  const handleGenerateReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setModalMessage('');
    setShowModal(false);
    resetForm();
    setToastMessage('Reporte generado correctamente.');
  };

  return (
    <>
    <AdminSidebar active="reportes" />
    <main className="reports-page">

      {/* Header superior */}
      <header className="reports-top">
        <div>
          <AdminBreadcrumb current="Reportes" />
          <h1>Reportes</h1>
          <p>Resumen de ingresos, reservas y actividad del motel</p>
        </div>

        <div className="reports-top-actions">
          <div className="reports-search">
            <Search size={18} strokeWidth={2.4} />
            <input
              type="text"
              placeholder="Buscar reporte..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setModalMessage('');
              setShowModal(true);
            }}
          >
            ＋ Generar reporte
          </button>
        </div>
      </header>

      {/* Resumen superior */}
      {isLoading ? (
        <AdminSkeleton variant="summary" count={4} label="Cargando resumen de reportes" />
      ) : (
      <>
      <section className="reports-summary">
        <article>
          <span className="reports-summary-icon pink">
            <WalletCards size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>$3.850.000</strong>
            <p>Ingresos del mes</p>
          </div>
        </article>

        <article>
          <span className="reports-summary-icon blue">
            <CalendarDays size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>112</strong>
            <p>Reservas del mes</p>
          </div>
        </article>

        <article>
          <span className="reports-summary-icon soft">
            <BarChart3 size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>78%</strong>
            <p>Ocupación promedio</p>
          </div>
        </article>

        <article>
          <span className="reports-summary-icon green">
            <FileText size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>3</strong>
            <p>Reportes generados</p>
          </div>
        </article>
      </section>

      {/* Filtros rápidos */}
      <section className="reports-filters">
        {reportFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? 'active' : ''}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>
      </>
      )}

      {/* Listado de reportes */}
      <section className="reports-list" aria-busy={isLoading}>
        {isLoading && (
          <AdminSkeleton variant="card" count={3} label="Cargando reportes" />
        )}

        {!isLoading && filteredReports.map((report) => (
          <article
            className={`report-card ${report.status.toLowerCase()}`}
            key={report.id}
          >
            <div className="report-icon">
              <FileText size={22} strokeWidth={2.4} />
            </div>

            <div className="report-info">
              <h2>{report.title}</h2>
              <p>Fecha: {report.date}</p>
            </div>

            <div>
              <strong>{report.amount}</strong>
              <p>Ingresos</p>
            </div>

            <div>
              <strong>{report.reservations}</strong>
              <p>Reservas</p>
            </div>

            <span className={`report-status ${report.status.toLowerCase()}`}>
              {report.status}
            </span>

            <div className="report-actions">
              <button type="button">Ver</button>
              <button type="button">Descargar</button>
            </div>
          </article>
        ))}

        {!isLoading && filteredReports.length === 0 && (
          <div className="admin-empty-state">
            <div>
              <strong>No hay reportes para mostrar</strong>
              <p>Prueba con otro tipo de reporte, fecha, estado o monto.</p>
            </div>
          </div>
        )}
      </section>

      {/* Modal para generar reporte */}
      {showModal && (
        <div className="report-modal-overlay">
          <div className="report-modal">
            <button
              type="button"
              className="report-modal-close"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <h2>Generar reporte</h2>
            <p>Selecciona los datos para crear un nuevo reporte.</p>

            <form onSubmit={handleGenerateReport}>
              {modalMessage && (
                <p className="admin-modal-message">
                  {modalMessage}
                </p>
              )}

              <label>
                Tipo de reporte
                <select
                  required
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccionar tipo de reporte
                  </option>
                  <option value="diario">Reporte diario</option>
                  <option value="semanal">Reporte semanal</option>
                  <option value="mensual">Reporte mensual</option>
                  <option value="ocupacion">Ocupación</option>
                  <option value="ingresos">Ingresos</option>
                </select>
              </label>

              <label>
                Fecha de inicio
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>

              <label>
                Fecha de término
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>

              <label>
                Formato
                <select
                  required
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccionar formato
                  </option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </select>
              </label>

              <div className="report-modal-actions">
                <button type="button" onClick={handleCloseModal}>
                  Cancelar
                </button>

                <button type="submit">
                  Generar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AdminToast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />

    </main>
    </>
  );
}

export default ReportsPage;
