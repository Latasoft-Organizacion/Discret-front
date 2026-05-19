import { useState } from 'react';
import { Search } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminSidebar.css';
import '../styles/agenda.css';

function AgendaPage() {

  // Estado modal nuevo evento
  const [showModal, setShowModal] = useState(false);

  // Datos simulados de agenda
  const agenda = [
    { id: 1, hour: '14:00', type: 'Reserva', room: 'Hab. 102', client: 'Juan Pérez', status: 'Ocupada' },
    { id: 2, hour: '16:00', type: 'Reserva', room: 'Hab. 105', client: 'María López', status: 'Confirmada' },
    { id: 3, hour: '18:00', type: 'Reserva', room: 'Hab. 107', client: 'Carlos Rojas', status: 'Confirmada' },
    { id: 4, hour: '20:30', type: 'Limpieza', room: 'Hab. 103', client: 'Personal limpieza', status: 'Pendiente' },
  ];

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
          <span>📅</span>

          <div>
            <strong>4</strong>
            <p>Eventos hoy</p>
          </div>
        </article>

        <article>
          <span>✅</span>

          <div>
            <strong>2</strong>
            <p>Confirmados</p>
          </div>
        </article>

        <article>
          <span>🧹</span>

          <div>
            <strong>1</strong>
            <p>Limpieza</p>
          </div>
        </article>

        <article>
          <span>⏳</span>

          <div>
            <strong>1</strong>
            <p>Pendientes</p>
          </div>
        </article>

      </section>

      {/* Filtros */}
      <section className="agenda-filters">

        <button className="active">Hoy</button>
        <button>Reservas</button>
        <button>Limpieza</button>
        <button>Pendientes</button>

      </section>

      {/* Listado agenda */}
      <section className="agenda-list">

        {agenda.map((item) => (

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
