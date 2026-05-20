import { useState } from 'react';

import {
  Bed,
  Search,
  Plus,
  Eye,
  Pencil,
  CheckCircle2,
  Clock3,
  X,
} from 'lucide-react';

import AdminSidebar from '../components/AdminSidebar';

import '../styles/adminSidebar.css';
import '../styles/adminReservations.css';

function AdminReservationsPage() {
  /* ========================================
      CONTROL VISUALIZACION TABLA
  ======================================== */

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [detailReservation, setDetailReservation] = useState<Reservation | null>(null);
  const [newReservation, setNewReservation] = useState({
    client: '',
    room: '',
    entry: '',
    exit: '',
    status: 'Pendiente',
    payment: 'Efectivo',
  });

  type Reservation = {
    id: number;
    client: string;
    room: string;
    entry: string;
    exit: string;
    status: string;
    payment: string;
  };

  /* ========================================
      DATOS SIMULADOS RESERVAS
  ======================================== */

  const [reservations, setReservations] = useState<Reservation[]>([
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
  ]);

  const handleCreateReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { client, room, entry, exit, status, payment } = newReservation;

    if (!client || !room || !entry || !exit || !status || !payment) {
      alert('Completa todos los campos para crear la reserva.');
      return;
    }

    setReservations((currentReservations) => [
      {
        id: Math.max(...currentReservations.map((reservation) => reservation.id)) + 1,
        client,
        room,
        entry,
        exit,
        status,
        payment,
      },
      ...currentReservations,
    ]);

    setNewReservation({
      client: '',
      room: '',
      entry: '',
      exit: '',
      status: 'Pendiente',
      payment: 'Efectivo',
    });
    setShowCreateModal(false);
  };

  const handleUpdateReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingReservation) {
      return;
    }

    const { client, room, entry, exit, status, payment } = editingReservation;

    if (!client || !room || !entry || !exit || !status || !payment) {
      alert('Completa todos los campos para modificar la reserva.');
      return;
    }

    setReservations((currentReservations) =>
      currentReservations.map((reservation) =>
        reservation.id === editingReservation.id ? editingReservation : reservation
      )
    );

    setEditingReservation(null);
  };

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

            <button type="button" onClick={() => setShowCreateModal(true)}>
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
              <CheckCircle2 size={24} strokeWidth={2.4} />
            </div>

            <div>
              <strong>3</strong>
              <p>Confirmadas (3)</p>
            </div>
          </article>

          {/* PENDIENTES */}
          <article>
            <div className="summary-icon yellow">
              <Clock3 size={24} strokeWidth={2.4} />
            </div>

            <div>
              <strong>1</strong>
              <p>Pendientes (1)</p>
            </div>
          </article>

          {/* TOTAL */}
          <article>
            <div className="summary-icon pink">
              <Bed size={26} strokeWidth={2.4} />
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
                <button type="button" onClick={() => setDetailReservation(reservation)}>
                  <Eye size={17} />
                  Detalle
                </button>

                <button type="button" onClick={() => setEditingReservation(reservation)}>
                  <Pencil size={17} />
                  Editar
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

      {showCreateModal && (
        <div className="admin-reservation-modal-overlay">
          <div className="admin-reservation-modal">
            <div className="admin-reservation-modal-header">
              <div>
                <h2>Nueva reserva manual</h2>
                <p>Registra una reserva creada desde administración.</p>
              </div>

              <button type="button" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="admin-reservation-modal-form" onSubmit={handleCreateReservation}>
              <label>
                Cliente
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={newReservation.client}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      client: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Habitación
                <input
                  type="text"
                  placeholder="Ej: Hab. 105"
                  value={newReservation.room}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      room: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Fecha de entrada
                <input
                  type="datetime-local"
                  value={newReservation.entry}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      entry: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Fecha de salida
                <input
                  type="datetime-local"
                  value={newReservation.exit}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      exit: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={newReservation.status}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      status: event.target.value,
                    }))
                  }
                >
                  <option>Pendiente</option>
                  <option>Confirmada</option>
                  <option>Ocupada</option>
                </select>
              </label>

              <label>
                Tipo de pago
                <select
                  value={newReservation.payment}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      payment: event.target.value,
                    }))
                  }
                >
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                  <option>Pago digital</option>
                </select>
              </label>

              <div className="admin-reservation-modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>

                <button type="submit">
                  Crear reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingReservation && (
        <div className="admin-reservation-modal-overlay">
          <div className="admin-reservation-modal">
            <div className="admin-reservation-modal-header">
              <div>
                <h2>Editar reserva</h2>
                <p>Actualiza los datos de la reserva seleccionada.</p>
              </div>

              <button type="button" onClick={() => setEditingReservation(null)}>
                <X size={20} />
              </button>
            </div>

            <form className="admin-reservation-modal-form" onSubmit={handleUpdateReservation}>
              <label>
                Cliente
                <input
                  type="text"
                  value={editingReservation.client}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, client: event.target.value } : reservation
                    )
                  }
                />
              </label>

              <label>
                Habitación
                <input
                  type="text"
                  value={editingReservation.room}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, room: event.target.value } : reservation
                    )
                  }
                />
              </label>

              <label>
                Fecha de entrada
                <input
                  type="datetime-local"
                  value={editingReservation.entry}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, entry: event.target.value } : reservation
                    )
                  }
                />
              </label>

              <label>
                Fecha de salida
                <input
                  type="datetime-local"
                  value={editingReservation.exit}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, exit: event.target.value } : reservation
                    )
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={editingReservation.status}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, status: event.target.value } : reservation
                    )
                  }
                >
                  <option>Pendiente</option>
                  <option>Confirmada</option>
                  <option>Ocupada</option>
                </select>
              </label>

              <label>
                Tipo de pago
                <select
                  value={editingReservation.payment}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, payment: event.target.value } : reservation
                    )
                  }
                >
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Transferencia</option>
                  <option>Pago digital</option>
                </select>
              </label>

              <div className="admin-reservation-modal-actions">
                <button type="button" onClick={() => setEditingReservation(null)}>
                  Cancelar
                </button>

                <button type="submit">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailReservation && (
        <div className="admin-reservation-modal-overlay">
          <div className="admin-reservation-modal">
            <div className="admin-reservation-modal-header">
              <div>
                <h2>Detalle reserva</h2>
                <p>Información completa de la reserva seleccionada.</p>
              </div>

              <button type="button" onClick={() => setDetailReservation(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-reservation-detail-grid">
              <div>
                <span>ID Reserva</span>
                <strong>{detailReservation.id}</strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>{detailReservation.client}</strong>
              </div>

              <div>
                <span>Habitación</span>
                <strong>{detailReservation.room}</strong>
              </div>

              <div>
                <span>Fecha de entrada</span>
                <strong>{detailReservation.entry}</strong>
              </div>

              <div>
                <span>Fecha de salida</span>
                <strong>{detailReservation.exit}</strong>
              </div>

              <div>
                <span>Estado</span>
                <strong>{detailReservation.status}</strong>
              </div>

              <div>
                <span>Tipo de pago</span>
                <strong>{detailReservation.payment}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminReservationsPage;
