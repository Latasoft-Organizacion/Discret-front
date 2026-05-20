import { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock3, Search, Sparkles } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminSidebar.css';
import '../styles/agenda.css';

type AgendaFilter = 'Hoy' | 'Reservas' | 'Limpieza' | 'Pendientes';

function AgendaPage() {

  // Estado modal nuevo evento
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<AgendaFilter>('Hoy');

  // Datos simulados de agenda
  const agenda = [
    { id: 1, hour: '14:00', type: 'Reserva', room: 'Hab. 102', client: 'Juan Pérez', status: 'Ocupada' },
    { id: 2, hour: '16:00', type: 'Reserva', room: 'Hab. 105', client: 'María López', status: 'Confirmada' },
    { id: 3, hour: '18:00', type: 'Reserva', room: 'Hab. 107', client: 'Carlos Rojas', status: 'Confirmada' },
    { id: 4, hour: '20:30', type: 'Limpieza', room: 'Hab. 103', client: 'Personal limpieza', status: 'Pendiente' },
  ];

  const agendaFilters: AgendaFilter[] = ['Hoy', 'Reservas', 'Limpieza', 'Pendientes'];

  const filteredAgenda = agenda.filter((item) => {
    if (activeFilter === 'Hoy') {
      return true;
    }

    if (activeFilter === 'Reservas') {
      return item.type === 'Reserva';
    }

    if (activeFilter === 'Limpieza') {
      return item.type === 'Limpieza';
    }

    return item.status === 'Pendiente';
  });

  const confirmedCount = agenda.filter((item) => item.status === 'Confirmada').length;
  const cleaningCount = agenda.filter((item) => item.type === 'Limpieza').length;
  const pendingCount = agenda.filter((item) => item.status === 'Pendiente').length;

  return (
    <>
    <AdminSidebar active="agenda" />
    <main className="agenda-page">

      {/* Header superior */}
      <header className="agenda-top">

        <div>
          <h1>Agenda</h1>
          <p>Programación diaria de reservas y actividades</p>
        </div>

        <div className="agenda-top-actions">

          {/* Buscador */}
          <div className="agenda-search">
            <Search size={18} strokeWidth={2.4} />

            <input
              type="text"
              placeholder="Buscar en agenda..."
            />
          </div>

          {/* Botón nuevo evento */}
          <button
            type="button"
            onClick={() => setShowModal(true)}
          >
            ＋ Nuevo evento
          </button>

        </div>

      </header>

      {/* Resumen superior */}
      <section className="agenda-summary">

        <article>
          <span className="agenda-summary-icon pink">
            <CalendarDays size={22} strokeWidth={2.4} />
          </span>

          <div>
            <strong>{agenda.length}</strong>
            <p>Eventos hoy</p>
          </div>
        </article>

        <article>
          <span className="agenda-summary-icon green">
            <CheckCircle2 size={22} strokeWidth={2.4} />
          </span>

          <div>
            <strong>{confirmedCount}</strong>
            <p>Confirmados</p>
          </div>
        </article>

        <article>
          <span className="agenda-summary-icon soft">
            <Sparkles size={22} strokeWidth={2.4} />
          </span>

          <div>
            <strong>{cleaningCount}</strong>
            <p>Limpieza</p>
          </div>
        </article>

        <article>
          <span className="agenda-summary-icon blue">
            <Clock3 size={22} strokeWidth={2.4} />
          </span>

          <div>
            <strong>{pendingCount}</strong>
            <p>Pendientes</p>
          </div>
        </article>

      </section>

      {/* Filtros */}
      <section className="agenda-filters">

        {agendaFilters.map((filter) => (
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

      {/* Listado agenda */}
      <section className="agenda-list">

        {filteredAgenda.map((item) => (

          <article
            className={`agenda-card ${item.status.toLowerCase()}`}
            key={item.id}
          >

            {/* Hora evento */}
            <div className="agenda-hour">
              <strong>{item.hour}</strong>
              <p>{item.type}</p>
            </div>

            {/* Información evento */}
            <div className="agenda-info">
              <h2>{item.room}</h2>
              <p>{item.client}</p>
            </div>

            {/* Estado */}
            <span className={`agenda-status ${item.status.toLowerCase()}`}>
              {item.status}
            </span>

            {/* Acciones */}
            <div className="agenda-actions">
              <button type="button">Editar</button>
              <button type="button">Detalle</button>
            </div>

          </article>

        ))}

        {filteredAgenda.length === 0 && (
          <div className="agenda-empty-state">
            No hay eventos para este filtro.
          </div>
        )}

      </section>

      {/* Modal nuevo evento */}
      {showModal && (

        <div className="agenda-modal-overlay">

          <div className="agenda-modal">

            {/* Header modal */}
            <div className="agenda-modal-header">

              <div>
                <h2>Nuevo evento</h2>

                <p>
                  Registra una reserva, limpieza o actividad diaria.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>

            </div>

            {/* Formulario modal */}
            <form className="agenda-modal-form">

              <label>
                Hora
                <input type="time" />
              </label>

              <label>
                Tipo de evento

                <select defaultValue="Reserva">
                  <option>Reserva</option>
                  <option>Limpieza</option>
                  <option>Mantención</option>
                </select>

              </label>

              <label>
                Habitación
                <input type="text" placeholder="Ej: Hab. 105" />
              </label>

              <label>
                Cliente / Responsable
                <input type="text" placeholder="Ej: Juan Pérez" />
              </label>

              <label>
                Estado

                <select defaultValue="Pendiente">
                  <option>Pendiente</option>
                  <option>Confirmada</option>
                  <option>Ocupada</option>
                </select>

              </label>

              <label>
                Observación
                <input type="text" placeholder="Observación opcional" />
              </label>

              {/* Acciones modal */}
              <div className="agenda-modal-actions">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit">
                  Guardar evento
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </main>
    </>
  );
}

export default AgendaPage;
