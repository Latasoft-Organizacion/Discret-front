import {
  Bed,
  CalendarDays,
  ChartColumn,
  Clock3,
  Lock,
  MessageCircle,
  Unlock,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminBreadcrumb from '../components/AdminBreadcrumb';
import AdminToast from '../components/AdminToast';
import AdminSidebar from '../components/AdminSidebar';
import { ApiError, api, type EstadoHabitacionApi, type Habitacion } from '../services/api';

import '../styles/adminSidebar.css';
import '../styles/dashboard.css';

type DashboardRoom = {
  id: number;
  number: number;
  status: 'Disponible' | 'Ocupada' | 'Limpieza';
  apiStatus: EstadoHabitacionApi;
};

const mapDashboardRoomStatus = (status: EstadoHabitacionApi): DashboardRoom['status'] => {
  if (status === 'ocupada' || status === 'bloqueada') {
    return 'Ocupada';
  }

  if (status === 'limpieza' || status === 'mantenimiento') {
    return 'Limpieza';
  }

  return 'Disponible';
};

const mapDashboardRoom = (room: Habitacion): DashboardRoom => ({
  id: room.id,
  number: Number(room.numero),
  status: mapDashboardRoomStatus(room.estado),
  apiStatus: room.estado,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [quickReservationMessage, setQuickReservationMessage] = useState('');
  const [quickReservationModalMessage, setQuickReservationModalMessage] = useState('');
  const [dashboardLoadMessage, setDashboardLoadMessage] = useState('');
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isSavingRoom, setIsSavingRoom] = useState(false);
  const [showQuickReservationModal, setShowQuickReservationModal] = useState(false);
  const [showBlockRoomModal, setShowBlockRoomModal] = useState(false);
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);
  const [selectedBlockRoom, setSelectedBlockRoom] = useState('101');
  const [quickReservation, setQuickReservation] = useState({
    client: '',
    room: '101',
    entry: '',
    exit: '',
  });

  const [rooms, setRooms] = useState<DashboardRoom[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      setIsLoadingRooms(true);
      setDashboardLoadMessage('');

      try {
        const habitaciones = await api.listarHabitaciones();

        if (!isMounted) {
          return;
        }

        const mappedRooms = habitaciones.map(mapDashboardRoom);
        setRooms(mappedRooms);

        const firstRoom = mappedRooms[0];

        if (firstRoom) {
          const firstRoomNumber = String(firstRoom.number);
          setSelectedBlockRoom(firstRoomNumber);
          setQuickReservation((reservation) => ({
            ...reservation,
            room: reservation.room || firstRoomNumber,
          }));
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof ApiError
          ? error.message
          : 'No se pudieron cargar las habitaciones desde Laravel.';

        setDashboardLoadMessage(message);
      } finally {
        if (isMounted) {
          setIsLoadingRooms(false);
        }
      }
    };

    loadRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  // Datos simulados de agenda
  const [agenda, setAgenda] = useState([
    { hour: '14:00', type: 'Reserva', room: 'Hab. 102', client: 'Juan Pérez', status: 'Ocupada' },
    { hour: '16:00', type: 'Reserva', room: 'Hab. 105', client: 'María López', status: 'Confirmada' },
    { hour: '18:00', type: 'Reserva', room: 'Hab. 107', client: 'Carlos R.', status: 'Confirmada' },
    { hour: '20:30', type: 'Limpieza', room: 'Hab. 103', client: 'Programada', status: 'Pendiente' },
  ]);

  const createQuickReservation = () => {
    setQuickReservationModalMessage('');
    setShowQuickReservationModal(true);
  };

  const handleBlockRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSavingRoom) {
      return;
    }

    const roomToBlock = rooms.find((room) => room.number === Number(selectedBlockRoom));

    if (!roomToBlock) {
      setQuickReservationMessage('Selecciona una habitación válida para bloquear.');
      return;
    }

    setIsSavingRoom(true);

    try {
      const updatedRoom = await api.actualizarHabitacion(roomToBlock.id, {
        estado: 'bloqueada',
      });

      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === roomToBlock.id ? mapDashboardRoom(updatedRoom) : room
        )
      );

      setQuickReservationMessage(`Habitación ${selectedBlockRoom} bloqueada correctamente.`);
      setShowBlockRoomModal(false);
    } catch (error) {
      const message = error instanceof ApiError
        ? Object.values(error.errors ?? {}).flat()[0] ?? error.message
        : 'No se pudo bloquear la habitación en Laravel.';

      setQuickReservationMessage(message);
    } finally {
      setIsSavingRoom(false);
    }
  };

  const handleCreateQuickReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSavingRoom) {
      return;
    }

    if (!quickReservation.client || !quickReservation.room || !quickReservation.entry || !quickReservation.exit) {
      setQuickReservationModalMessage('Completa cliente, habitación, entrada y salida para crear la reserva rápida.');
      return;
    }

    const selectedRoom = rooms.find((room) => room.number === Number(quickReservation.room));

    if (!selectedRoom) {
      setQuickReservationModalMessage('Selecciona una habitación válida para crear la reserva.');
      return;
    }

    setIsSavingRoom(true);

    try {
      const updatedRoom = await api.actualizarHabitacion(selectedRoom.id, {
        estado: 'ocupada',
      });

    setAgenda((currentAgenda) => [
      ...currentAgenda,
      {
        hour: quickReservation.entry,
        type: 'Reserva',
        room: `Hab. ${quickReservation.room}`,
        client: quickReservation.client,
        status: 'Pendiente',
      },
    ]);

      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === selectedRoom.id ? mapDashboardRoom(updatedRoom) : room
        )
      );

    setQuickReservationMessage(
      `Reserva creada para ${quickReservation.client}, Hab. ${quickReservation.room}, ${quickReservation.entry} - ${quickReservation.exit}.`
    );
    setQuickReservation({
      client: '',
      room: rooms[0] ? String(rooms[0].number) : '',
      entry: '',
      exit: '',
    });
    setQuickReservationModalMessage('');
    setShowQuickReservationModal(false);
    } catch (error) {
      const message = error instanceof ApiError
        ? Object.values(error.errors ?? {}).flat()[0] ?? error.message
        : 'No se pudo crear la reserva rápida en Laravel.';

      setQuickReservationModalMessage(message);
    } finally {
      setIsSavingRoom(false);
    }
  };

  const closeQuickReservationModal = () => {
    setQuickReservationModalMessage('');
    setShowQuickReservationModal(false);
  };

  // Fecha actual
  const currentDate = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Hora actual
  const currentTime = new Date().toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="dashboard-layout">
      {/* Sidebar reutilizable */}
      <AdminSidebar active="dashboard" />

      {/* Contenido principal */}
      <section className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <AdminBreadcrumb current="Dashboard" />
            <h2>Bienvenido, Administrador 👋</h2>
            <p>Panel de administración</p>
          </div>

          <div className="header-actions">
            <span>
              <CalendarDays size={16} />
              {currentDate}
            </span>

            <span>
              <Clock3 size={16} />
              {currentTime}
            </span>
          </div>
        </header>

        {/* Estado de habitaciones */}
        <section className="rooms-header">
          <h3>Estado de habitaciones</h3>

          <div className="legend">
            <span><i className="green"></i> Disponible</span>
            <span><i className="pink"></i> Ocupada</span>
          </div>
        </section>

        <section className="rooms-grid">
          {isLoadingRooms && (
            <div className="dashboard-inline-state">Cargando habitaciones desde Laravel...</div>
          )}

          {!isLoadingRooms && dashboardLoadMessage && (
            <div className="dashboard-inline-state is-error">{dashboardLoadMessage}</div>
          )}

          {!isLoadingRooms && !dashboardLoadMessage && rooms.map((room) => (
            <article key={room.number} className="room-card">
              <div>
                <span className="bed-icon">
                  <Bed size={18} />
                </span>

                <strong>{room.number}</strong>

                <p className={room.status === 'Disponible' ? 'available' : 'occupied'}>
                  {room.status}
                </p>
              </div>

              <button className={room.status === 'Disponible' ? 'unlock' : 'lock'}>
                {room.status === 'Disponible' ? (
                  <Unlock size={18} />
                ) : (
                  <Lock size={18} />
                )}
              </button>
            </article>
          ))}
        </section>

        {/* Paneles inferiores */}
        <section className="dashboard-content">
          <article className="panel agenda-panel">
            <div className="panel-title">
              <h3>Agenda diaria</h3>

              <span>
                <CalendarDays size={15} />
                Viernes, 24 de Mayo
              </span>
            </div>

            <div className="agenda-list">
              {agenda.map((item, index) => (
                <div className="agenda-row" key={index}>
                  <span>{item.hour}</span>
                  <span className="pink-text">{item.type}</span>
                  <span>{item.room}</span>
                  <span>{item.client}</span>
                  <strong>{item.status}</strong>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="primary-action"
              onClick={createQuickReservation}
            >
              ＋ Nueva reserva rápida
            </button>

          </article>

          <article className="panel reservations-panel">
            <div className="panel-title horizontal">
              <h3>Reservas recientes</h3>
              <button type="button" onClick={() => navigate('/reservas-admin')}>
                Ver todas
              </button>
            </div>

            {agenda.map((item, index) => (
              <div className="reservation-row" key={index}>
                <div>
                  <strong>{item.room}</strong>
                  <p>{item.client}</p>
                </div>

                <div>
                  <span>24/05/2024</span>
                  <p>{item.hour} - 16:00</p>
                </div>

                <span className="confirmed">● Confirmada</span>

                <button>
                  <MessageCircle size={16} />
                </button>
              </div>
            ))}
          </article>
        </section>

        {/* Acciones rápidas */}
        <section className="quick-actions">
          <h3>Acciones rápidas</h3>

          <div>
            <button type="button" onClick={() => navigate('/habitaciones')}>
              <Bed size={20} />
              Ver habitaciones
            </button>

            <button type="button" onClick={() => setShowBlockRoomModal(true)}>
              <Lock size={20} />
              Bloquear habitación
            </button>

            <button type="button" onClick={createQuickReservation}>
              <CalendarDays size={20} />
              Nueva reserva
            </button>

            <button type="button" onClick={() => setShowDailyReportModal(true)}>
              <ChartColumn size={20} />
              Reporte diario
            </button>
          </div>
        </section>
      </section>

      {showQuickReservationModal && (
        <div className="dashboard-modal-overlay">
          <section className="dashboard-modal">
            <div className="dashboard-modal-header">
              <div>
                <h2>Nueva reserva rápida</h2>
                <p>Selecciona cliente, habitación y horario sin salir del dashboard.</p>
              </div>

              <button type="button" onClick={closeQuickReservationModal}>
                <X size={20} />
              </button>
            </div>

            <form className="dashboard-modal-form" onSubmit={handleCreateQuickReservation}>
              {quickReservationModalMessage && (
                <p className="admin-modal-message dashboard-modal-full">
                  {quickReservationModalMessage}
                </p>
              )}

              <label>
                Cliente
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={quickReservation.client}
                  onChange={(event) =>
                    setQuickReservation((reservation) => ({
                      ...reservation,
                      client: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Habitación
                <select
                  value={quickReservation.room}
                  onChange={(event) =>
                    setQuickReservation((reservation) => ({
                      ...reservation,
                      room: event.target.value,
                    }))
                  }
                >
                  {rooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Hab. {room.number} - {room.status}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Hora de entrada
                <input
                  type="time"
                  value={quickReservation.entry}
                  onChange={(event) =>
                    setQuickReservation((reservation) => ({
                      ...reservation,
                      entry: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Hora de salida
                <input
                  type="time"
                  value={quickReservation.exit}
                  onChange={(event) =>
                    setQuickReservation((reservation) => ({
                      ...reservation,
                      exit: event.target.value,
                    }))
                  }
                />
              </label>

              <div className="dashboard-modal-actions">
                <button type="button" onClick={closeQuickReservationModal}>
                  Cancelar
                </button>

                <button type="submit" disabled={isSavingRoom}>
                  {isSavingRoom ? 'Creando...' : 'Crear reserva'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showBlockRoomModal && (
        <div className="dashboard-modal-overlay">
          <section className="dashboard-modal dashboard-modal-small">
            <div className="dashboard-modal-header">
              <div>
                <h2>Bloquear habitación</h2>
                <p>Selecciona la habitación que quedará marcada como ocupada.</p>
              </div>

              <button type="button" onClick={() => setShowBlockRoomModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="dashboard-modal-form" onSubmit={handleBlockRoom}>
              <label className="dashboard-modal-full">
                Habitación
                <select
                  value={selectedBlockRoom}
                  onChange={(event) => setSelectedBlockRoom(event.target.value)}
                >
                  {rooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Hab. {room.number} - {room.status}
                    </option>
                  ))}
                </select>
              </label>

              <div className="dashboard-modal-actions">
                <button type="button" onClick={() => setShowBlockRoomModal(false)}>
                  Cancelar
                </button>

                <button type="submit" disabled={isSavingRoom}>
                  {isSavingRoom ? 'Bloqueando...' : 'Bloquear habitación'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {showDailyReportModal && (
        <div className="dashboard-modal-overlay">
          <section className="dashboard-modal dashboard-modal-small">
            <div className="dashboard-modal-header">
              <div>
                <h2>Reporte diario</h2>
                <p>Resumen operativo generado con la información actual del panel.</p>
              </div>

              <button type="button" onClick={() => setShowDailyReportModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="dashboard-report-grid">
              <div>
                <span>Reservas del día</span>
                <strong>{agenda.filter((item) => item.type === 'Reserva').length}</strong>
              </div>

              <div>
                <span>Habitaciones ocupadas</span>
                <strong>{rooms.filter((room) => room.status === 'Ocupada').length}</strong>
              </div>

              <div>
                <span>Habitaciones disponibles</span>
                <strong>{rooms.filter((room) => room.status === 'Disponible').length}</strong>
              </div>

              <div>
                <span>Actividades pendientes</span>
                <strong>{agenda.filter((item) => item.status === 'Pendiente').length}</strong>
              </div>
            </div>

            <div className="dashboard-modal-actions">
              <button type="button" onClick={() => navigate('/reportes')}>
                Ver reportes
              </button>

              <button type="button" onClick={() => setShowDailyReportModal(false)}>
                Entendido
              </button>
            </div>
          </section>
        </div>
      )}

      <AdminToast
        message={quickReservationMessage}
        onClose={() => setQuickReservationMessage('')}
      />
    </main>
  );
}

export default DashboardPage;
