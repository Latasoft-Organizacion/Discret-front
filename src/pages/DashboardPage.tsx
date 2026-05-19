import {
  Bed,
  CalendarDays,
  ChartColumn,
  Clock3,
  Lock,
  MessageCircle,
  Unlock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '../components/AdminSidebar';

import '../styles/adminSidebar.css';
import '../styles/dashboard.css';

function DashboardPage() {
  const navigate = useNavigate();

  // Datos simulados de habitaciones
  const rooms = [
    { number: 101, status: 'Disponible' },
    { number: 102, status: 'Ocupada' },
    { number: 103, status: 'Disponible' },
    { number: 104, status: 'Ocupada' },
    { number: 105, status: 'Disponible' },
    { number: 106, status: 'Disponible' },
    { number: 107, status: 'Ocupada' },
    { number: 108, status: 'Disponible' },
  ];

  // Datos simulados de agenda
  const agenda = [
    { hour: '14:00', type: 'Reserva', room: 'Hab. 102', client: 'Juan Pérez', status: 'Ocupada' },
    { hour: '16:00', type: 'Reserva', room: 'Hab. 105', client: 'María López', status: 'Confirmada' },
    { hour: '18:00', type: 'Reserva', room: 'Hab. 107', client: 'Carlos R.', status: 'Confirmada' },
    { hour: '20:30', type: 'Limpieza', room: 'Hab. 103', client: 'Programada', status: 'Pendiente' },
  ];

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
          {rooms.map((room) => (
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
              onClick={() => navigate('/reservas-admin')}
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

            <button type="button" onClick={() => navigate('/habitaciones')}>
              <Lock size={20} />
              Bloquear habitación
            </button>

            <button type="button" onClick={() => navigate('/reservas-admin')}>
              <CalendarDays size={20} />
              Nueva reserva
            </button>

            <button type="button" onClick={() => navigate('/reportes')}>
              <ChartColumn size={20} />
              Reporte diario
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default DashboardPage;
