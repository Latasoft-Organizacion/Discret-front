import { useState } from 'react';

import {
  Bed,
  Search,
  Plus,
  FileText,
  Pencil,
  Circle,
} from 'lucide-react';

import AdminSidebar from '../components/AdminSidebar';

import '../styles/adminSidebar.css';
import '../styles/adminReservations.css';

function AdminReservationsPage() {
  /* ========================================
      CONTROL VISUALIZACION TABLA
  ======================================== */

  const [itemsPerPage, setItemsPerPage] = useState(5);

  /* ========================================
      DATOS SIMULADOS RESERVAS
  ======================================== */

  const reservations = [
    {
      id: 1004,
      client: 'María López',
      room: 'Hab. 105',
      entry: '2024-05-24 16:00',
      exit: '2024-05-24 18:00',
      status: 'Confirmada',
      payment: 'Tarjeta',
    },
    {
      id: 1003,
      client: 'María López',
      room: 'Hab. 105',
      entry: '2024-05-24 16:00',
      exit: '2024-05-24 18:00',
      status: 'Ocupada',
      payment: 'Tarjeta',
    },
    {
      id: 1002,
      client: 'Carlos R.',
      room: 'Hab. 107',
      entry: '2024-05-24 18:00',
      exit: '2024-05-24 18:00',
      status: 'Pendiente',
      payment: 'Tarjeta',
    },
    {
      id: 1001,
      client: 'María López',
      room: 'Hab. 102',
      entry: '2024-05-24 16:00',
      exit: '2024-05-24 18:00',
      status: 'Confirmada',
      payment: 'Tarjeta',
    },
    {
      id: 1000,
      client: 'Carlos R.',
      room: 'Hab. 103',
      entry: '2024-05-24 18:00',
      exit: '2024-05-24 18:00',
      status: 'Pendiente',
      payment: 'Tarjeta',
    },
  ];

  /* ========================================
      RESERVAS VISIBLES TABLA
  ======================================== */

  const visibleReservations = reservations.slice(0, itemsPerPage);

  /* ========================================
      RESERVAS RECIENTES
  ======================================== */

  const recentReservations = reservations.slice(0, 4);

  return (
    <main className="admin-reservations-layout">
      {/* ========================================
          SIDEBAR ADMIN REUTILIZABLE
      ======================================== */}

      <AdminSidebar active="reservas" />

      {/* ========================================
          CONTENIDO PRINCIPAL
      ======================================== */}

      <section className="admin-reservations-main">
        {/* HEADER */}
        <header className="admin-reservations-header">
          <div>
            <h1>Gestión de Reservas</h1>
            <p>Historial y nuevas reservas</p>
          </div>

          {/* BUSCADOR + BOTON */}
          <div className="admin-reservations-actions">
            <div className="admin-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar reserva..."
              />
            </div>

            <button type="button">
              <Plus size={18} />
              Nueva Reserva
            </button>
          </div>
        </header>

        {/* ========================================
            TARJETAS RESUMEN
        ======================================== */}

        <section className="admin-reservations-summary">
          {/* CONFIRMADAS */}
          <article>
            <div className="summary-icon green">
              <Circle size={18} fill="currentColor" />
            </div>

            <div>
              <strong>3</strong>
              <p>Confirmadas (3)</p>
            </div>
          </article>

          {/* PENDIENTES */}
          <article>
            <div className="summary-icon yellow">
              <Circle size={18} fill="currentColor" />
            </div>

            <div>
              <strong>1</strong>
              <p>Pendientes (1)</p>
            </div>
          </article>

          {/* TOTAL */}
          <article>
            <div className="summary-icon pink">
              <Bed size={24} />
            </div>

            <div>
              <strong>4</strong>
              <p>Total Reservas (4)</p>
            </div>
          </article>
        </section>

        {/* ========================================
            CONTROL TABLA
        ======================================== */}

        <div className="table-limit-control">
          <span>Mostrar</span>

          <select
            value={itemsPerPage}
            onChange={(event) => setItemsPerPage(Number(event.target.value))}
          >
            <option value={5}>5 reservas</option>
            <option value={10}>10 reservas</option>
          </select>
        </div>

        {/* ========================================
            TABLA RESERVAS
        ======================================== */}

        <section className="admin-reservations-table">
          <div className="table-header">
            <span>ID Reserva</span>
            <span>Cliente</span>
            <span>Habitación</span>
            <span>Fecha de Entrada</span>
            <span>Fecha de Salida</span>
            <span>Estado</span>
            <span>Tipo de Pago</span>
            <span>Acciones</span>
          </div>

          {visibleReservations.map((reservation) => (
            <div className="table-row" key={reservation.id}>
              <span>{reservation.id}</span>
              <span>{reservation.client}</span>
              <span className="room-link">{reservation.room}</span>
              <span>{reservation.entry}</span>
              <span>{reservation.exit}</span>

              <span className={`status ${reservation.status.toLowerCase()}`}>
                {reservation.status}
              </span>

              <span>{reservation.payment}</span>

              <div className="table-actions">
                <button type="button">
                  <FileText size={17} />
                  Ver detalle
                </button>

                <button type="button">
                  <Pencil size={17} />
                  Modificar
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* ========================================
            RESERVAS RECIENTES
        ======================================== */}

        <section className="admin-recent-reservations">
          <div className="recent-header">
            <h2>Reservas recientes</h2>

            <button type="button">
              Ver todas
            </button>
          </div>

          <div className="recent-list">
            {recentReservations.map((reservation) => (
              <article key={reservation.id}>
                <div>
                  <strong>{reservation.room}</strong>
                  <p>{reservation.client}</p>
                </div>

                <div>
                  <span>{reservation.entry}</span>
                  <p>{reservation.status}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AdminReservationsPage;