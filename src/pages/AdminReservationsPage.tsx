import { useEffect, useMemo, useState } from 'react';

import {
  Bed,
  Search,
  Plus,
  Eye,
  Pencil,
  CheckCircle2,
  Clock3,
  Trash2,
  X,
} from 'lucide-react';

import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { AdminSkeleton } from '../components/AdminLoading';
import AdminToast from '../components/AdminToast';
import AdminSidebar from '../components/AdminSidebar';
import {
  ApiError,
  api,
  type EstadoReservaApi,
  type Habitacion,
  type Reserva,
  type TipoPagoReservaApi,
} from '../services/api';

import '../styles/adminSidebar.css';
import '../styles/adminReservations.css';

type ReservationView = {
  id: number;
  code: string;
  client: string;
  room: string;
  roomId: number;
  entry: string;
  exit: string;
  status: string;
  statusApi: EstadoReservaApi;
  payment: string;
  paymentApi: TipoPagoReservaApi | null;
  phone: string;
  email: string;
  comment: string;
};

type ReservationFormState = {
  client: string;
  roomId: string;
  entry: string;
  exit: string;
  status: EstadoReservaApi;
  payment: TipoPagoReservaApi;
};

const statusLabels: Record<EstadoReservaApi, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  ocupada: 'Ocupada',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
};

const paymentLabels: Record<TipoPagoReservaApi, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  online: 'Pago digital',
};

const emptyReservationForm: ReservationFormState = {
  client: '',
  roomId: '',
  entry: '',
  exit: '',
  status: 'pendiente',
  payment: 'efectivo',
};

const formatDateTime = (value: string) => {
  if (!value) {
    return 'Sin fecha';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('es-CL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const toApiDateTime = (value: string) => value.replace('T', ' ');

const mapReservation = (reservation: Reserva): ReservationView => {
  const clientFromRelation = reservation.cliente
    ? `${reservation.cliente.nombre} ${reservation.cliente.apellido}`.trim()
    : '';
  const roomNumber = reservation.habitacion?.numero ?? String(reservation.habitacion_id);
  const roomName = reservation.habitacion?.tipo_habitacion?.nombre
    ?? reservation.habitacion?.nombre
    ?? 'Habitación';

  return {
    id: reservation.id,
    code: reservation.codigo_reserva,
    client: reservation.nombre_cliente ?? clientFromRelation ?? 'Cliente sin nombre',
    room: `${roomName} · Hab. ${roomNumber}`,
    roomId: reservation.habitacion_id,
    entry: formatDateTime(reservation.fecha_entrada),
    exit: formatDateTime(reservation.fecha_salida),
    status: statusLabels[reservation.estado],
    statusApi: reservation.estado,
    payment: reservation.tipo_pago ? paymentLabels[reservation.tipo_pago] : 'Pendiente',
    paymentApi: reservation.tipo_pago,
    phone: reservation.telefono_cliente ?? reservation.cliente?.telefono ?? 'Sin teléfono',
    email: reservation.correo_cliente ?? reservation.cliente?.correo ?? 'Sin correo',
    comment: reservation.comentario ?? 'Sin comentarios',
  };
};

function AdminReservationsPage() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reserva[]>([]);
  const [rooms, setRooms] = useState<Habitacion[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState<ReservationView | null>(null);
  const [detailReservation, setDetailReservation] = useState<ReservationView | null>(null);
  const [deleteReservation, setDeleteReservation] = useState<ReservationView | null>(null);
  const [newReservation, setNewReservation] = useState<ReservationFormState>(emptyReservationForm);

  const loadReservations = () => {
    setIsLoading(true);

    Promise.all([
      api.listarReservas(),
      api.listarHabitaciones(),
    ])
      .then(([reservationResponse, habitaciones]) => {
        setReservations(reservationResponse.data);
        setRooms(habitaciones.filter((habitacion) => habitacion.activa));
      })
      .catch(() => {
        setToastMessage('No se pudieron cargar las reservas desde la base de datos.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const reservationViews = useMemo(
    () => reservations.map(mapReservation),
    [reservations],
  );

  const filteredReservations = reservationViews.filter((reservation) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return true;
    }

    return (
      reservation.code.toLowerCase().includes(normalizedSearch)
      || reservation.client.toLowerCase().includes(normalizedSearch)
      || reservation.room.toLowerCase().includes(normalizedSearch)
      || reservation.status.toLowerCase().includes(normalizedSearch)
      || reservation.payment.toLowerCase().includes(normalizedSearch)
    );
  });

  const visibleReservations = filteredReservations.slice(0, itemsPerPage);
  const recentReservations = filteredReservations.slice(0, 4);
  const confirmedCount = reservationViews.filter((reservation) => reservation.statusApi === 'confirmada').length;
  const pendingCount = reservationViews.filter((reservation) => reservation.statusApi === 'pendiente').length;

  const handleCreateReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { client, roomId, entry, exit, status, payment } = newReservation;

    if (!client || !roomId || !entry || !exit || !status || !payment) {
      setModalMessage('Completa todos los campos para crear la reserva.');
      return;
    }

    try {
      const createdReservation = await api.crearReserva({
        habitacion_id: Number(roomId),
        nombre_cliente: client.trim(),
        cantidad_personas: 1,
        fecha_entrada: toApiDateTime(entry),
        fecha_salida: toApiDateTime(exit),
        estado: status,
        tipo_pago: payment,
      });

      setReservations((currentReservations) => [createdReservation, ...currentReservations]);
      setNewReservation(emptyReservationForm);
      setModalMessage('');
      setShowCreateModal(false);
      setToastMessage(`Reserva ${createdReservation.codigo_reserva} creada correctamente.`);
    } catch (error) {
      const message = error instanceof ApiError
        ? Object.values(error.errors ?? {}).flat()[0] ?? error.message
        : 'No se pudo crear la reserva.';

      setModalMessage(message);
    }
  };

  const handleUpdateReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingReservation) {
      return;
    }

    try {
      const updatedReservation = await api.actualizarReserva(editingReservation.id, {
        habitacion_id: editingReservation.roomId,
        nombre_cliente: editingReservation.client,
        estado: editingReservation.statusApi,
        tipo_pago: editingReservation.paymentApi ?? 'efectivo',
      });

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.id === updatedReservation.id ? updatedReservation : reservation
        )
      );
      setEditingReservation(null);
      setModalMessage('');
      setToastMessage(`Reserva ${updatedReservation.codigo_reserva} actualizada correctamente.`);
    } catch (error) {
      const message = error instanceof ApiError
        ? Object.values(error.errors ?? {}).flat()[0] ?? error.message
        : 'No se pudo actualizar la reserva.';

      setModalMessage(message);
    }
  };

  const handleDeleteReservation = async () => {
    if (!deleteReservation) {
      return;
    }

    try {
      await api.eliminarReserva(deleteReservation.id);

      setReservations((currentReservations) =>
        currentReservations.filter((reservation) => reservation.id !== deleteReservation.id)
      );
      setDeleteReservation(null);
      setToastMessage(`Reserva ${deleteReservation.code} eliminada correctamente.`);
    } catch (error) {
      const message = error instanceof ApiError
        ? error.message
        : 'No se pudo eliminar la reserva.';

      setToastMessage(message);
    }
  };

  return (
    <main className="admin-reservations-layout">
      <AdminSidebar active="reservas" />

      <section className="admin-reservations-main">
        <header className="admin-reservations-header">
          <div>
            <AdminBreadcrumb current="Reservas" />
            <h1>Gestión de Reservas</h1>
            <p>Historial y nuevas reservas</p>
          </div>

          <div className="admin-reservations-actions">
            <div className="admin-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Buscar reserva..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <button type="button" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} />
              Nueva Reserva
            </button>
          </div>
        </header>

        {isLoading ? (
          <AdminSkeleton variant="summary" count={3} label="Cargando resumen de reservas" />
        ) : (
          <>
            <section className="admin-reservations-summary">
              <article>
                <div className="summary-icon green">
                  <CheckCircle2 size={24} strokeWidth={2.4} />
                </div>

                <div>
                  <strong>{confirmedCount}</strong>
                  <p>Confirmadas ({confirmedCount})</p>
                </div>
              </article>

              <article>
                <div className="summary-icon yellow">
                  <Clock3 size={24} strokeWidth={2.4} />
                </div>

                <div>
                  <strong>{pendingCount}</strong>
                  <p>Pendientes ({pendingCount})</p>
                </div>
              </article>

              <article>
                <div className="summary-icon pink">
                  <Bed size={26} strokeWidth={2.4} />
                </div>

                <div>
                  <strong>{reservationViews.length}</strong>
                  <p>Total Reservas ({reservationViews.length})</p>
                </div>
              </article>
            </section>

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

            <section className="admin-reservations-table" aria-busy={isLoading}>
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
                  <span>{reservation.code}</span>
                  <span>{reservation.client}</span>
                  <span className="room-link">{reservation.room}</span>
                  <span>{reservation.entry}</span>
                  <span>{reservation.exit}</span>

                  <span className={`status ${reservation.statusApi}`}>
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

                    <button type="button" onClick={() => setDeleteReservation(reservation)}>
                      <Trash2 size={17} />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}

              {visibleReservations.length === 0 && (
                <div className="admin-empty-state admin-table-empty">
                  <div>
                    <strong>No hay reservas para mostrar</strong>
                    <p>
                      Cuando un cliente confirme una reserva desde el front,
                      aparecerá automáticamente en esta tabla.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        <section className="admin-recent-reservations">
          <div className="recent-header">
            <h2>Reservas recientes</h2>

            <button type="button" onClick={loadReservations}>
              Actualizar
            </button>
          </div>

          <div className="recent-list">
            {isLoading && (
              <AdminSkeleton variant="row" count={3} label="Cargando reservas recientes" />
            )}

            {!isLoading && recentReservations.map((reservation) => (
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

            {!isLoading && recentReservations.length === 0 && (
              <div className="admin-empty-state">
                <div>
                  <strong>No hay reservas recientes</strong>
                  <p>Cuando se registren reservas, aparecerán en este resumen.</p>
                </div>
              </div>
            )}
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

              <button
                type="button"
                onClick={() => {
                  setModalMessage('');
                  setShowCreateModal(false);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="admin-reservation-modal-form" onSubmit={handleCreateReservation}>
              {modalMessage && <p className="admin-modal-message">{modalMessage}</p>}

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
                    }))}
                />
              </label>

              <label>
                Habitación
                <select
                  value={newReservation.roomId}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      roomId: event.target.value,
                    }))}
                >
                  <option value="">Selecciona habitación</option>
                  {rooms.map((room) => (
                    <option value={room.id} key={room.id}>
                      Hab. {room.numero} · {room.tipo_habitacion?.nombre ?? room.nombre}
                    </option>
                  ))}
                </select>
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
                    }))}
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
                    }))}
                />
              </label>

              <label>
                Estado
                <select
                  value={newReservation.status}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      status: event.target.value as EstadoReservaApi,
                    }))}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                Tipo de pago
                <select
                  value={newReservation.payment}
                  onChange={(event) =>
                    setNewReservation((reservation) => ({
                      ...reservation,
                      payment: event.target.value as TipoPagoReservaApi,
                    }))}
                >
                  {Object.entries(paymentLabels).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              <div className="admin-reservation-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setModalMessage('');
                    setShowCreateModal(false);
                  }}
                >
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

              <button
                type="button"
                onClick={() => {
                  setModalMessage('');
                  setEditingReservation(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="admin-reservation-modal-form" onSubmit={handleUpdateReservation}>
              {modalMessage && <p className="admin-modal-message">{modalMessage}</p>}

              <label>
                Cliente
                <input
                  type="text"
                  value={editingReservation.client}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation ? { ...reservation, client: event.target.value } : reservation
                    )}
                />
              </label>

              <label>
                Estado
                <select
                  value={editingReservation.statusApi}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation
                        ? { ...reservation, statusApi: event.target.value as EstadoReservaApi }
                        : reservation
                    )}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              <label>
                Tipo de pago
                <select
                  value={editingReservation.paymentApi ?? 'efectivo'}
                  onChange={(event) =>
                    setEditingReservation((reservation) =>
                      reservation
                        ? { ...reservation, paymentApi: event.target.value as TipoPagoReservaApi }
                        : reservation
                    )}
                >
                  {Object.entries(paymentLabels).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </label>

              <div className="admin-reservation-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setModalMessage('');
                    setEditingReservation(null);
                  }}
                >
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
                <strong>{detailReservation.code}</strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>{detailReservation.client}</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>{detailReservation.phone}</strong>
              </div>

              <div>
                <span>Correo</span>
                <strong>{detailReservation.email}</strong>
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

              <div>
                <span>Comentario</span>
                <strong>{detailReservation.comment}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteReservation && (
        <div className="admin-reservation-modal-overlay">
          <div className="admin-reservation-modal admin-reservation-delete-modal">
            <div className="admin-reservation-modal-header">
              <div>
                <h2>Eliminar reserva</h2>
                <p>Esta acción cancelará la reserva en la base de datos.</p>
              </div>

              <button type="button" onClick={() => setDeleteReservation(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="admin-delete-reservation-summary">
              <div>
                <span>ID Reserva</span>
                <strong>{deleteReservation.code}</strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>{deleteReservation.client}</strong>
              </div>

              <div>
                <span>Habitación</span>
                <strong>{deleteReservation.room}</strong>
              </div>
            </div>

            <div className="admin-reservation-modal-actions">
              <button type="button" onClick={() => setDeleteReservation(null)}>
                Cancelar
              </button>

              <button type="button" className="danger" onClick={handleDeleteReservation}>
                Eliminar reserva
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminToast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </main>
  );
}

export default AdminReservationsPage;
