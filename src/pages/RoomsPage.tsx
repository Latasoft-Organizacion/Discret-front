import { useState } from 'react';

import {
  Bed,
  Search,
  Plus,
  Circle,
  Pencil,
  Eye,
  X,
} from 'lucide-react';

import AdminSidebar from '../components/AdminSidebar';

import '../styles/adminSidebar.css';
import '../styles/rooms.css';

function RoomsPage() {
  // Estado para mostrar u ocultar el modal
  const [showModal, setShowModal] = useState(false);

  // Datos simulados de habitaciones
  const rooms = [
    { number: 101, type: 'Suite estándar', status: 'Disponible', price: '$25.000' },
    { number: 102, type: 'Suite premium', status: 'Ocupada', price: '$35.000' },
    { number: 103, type: 'Suite jacuzzi', status: 'Limpieza', price: '$45.000' },
    { number: 104, type: 'Suite estándar', status: 'Disponible', price: '$25.000' },
  ];

  return (
    <main className="rooms-admin-layout">
      {/* Sidebar reutilizable */}
      <AdminSidebar active="habitaciones" />

      {/* Contenido principal */}
      <section className="rooms-admin-main">
        <header className="rooms-top">
          <div>
            <h1>Habitaciones</h1>
            <p>Gestión y estado actual de habitaciones</p>
          </div>

          <div className="rooms-top-actions">
            <div className="rooms-search">
              <Search size={18} />
              <input type="text" placeholder="Buscar habitación..." />
            </div>

            <button type="button" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Nueva habitación
            </button>
          </div>
        </header>

        {/* Resumen rápido superior */}
        <section className="rooms-summary">
          <article>
            <div className="rooms-summary-icon green">
              <Circle size={18} fill="currentColor" />
            </div>

            <div>
              <strong>2</strong>
              <p>Disponibles</p>
            </div>
          </article>

          <article>
            <div className="rooms-summary-icon pink">
              <Circle size={18} fill="currentColor" />
            </div>

            <div>
              <strong>1</strong>
              <p>Ocupadas</p>
            </div>
          </article>

          <article>
            <div className="rooms-summary-icon yellow">
              <Circle size={18} fill="currentColor" />
            </div>

            <div>
              <strong>1</strong>
              <p>En limpieza</p>
            </div>
          </article>

          <article>
            <div className="rooms-summary-icon">
              <Bed size={24} />
            </div>

            <div>
              <strong>4</strong>
              <p>Total habitaciones</p>
            </div>
          </article>
        </section>

        {/* Filtros rápidos */}
        <section className="rooms-filters">
          <button className="active">Todas</button>
          <button>Disponibles</button>
          <button>Ocupadas</button>
          <button>Limpieza</button>
        </section>

        {/* Listado de habitaciones */}
        <section className="rooms-list">
          {rooms.map((room) => (
            <article
              className={`room-detail-card ${room.status.toLowerCase()}`}
              key={room.number}
            >
              <div className="room-image">
                <Bed size={28} />
              </div>

              <div className="room-info">
                <h2>Habitación {room.number}</h2>
                <p>{room.type}</p>
                <strong>{room.price}</strong>
              </div>

              <span className={`room-status ${room.status.toLowerCase()}`}>
                {room.status}
              </span>

              <div className="room-actions">
                <button type="button">
                  <Pencil size={16} />
                  Editar
                </button>

                <button type="button">
                  <Eye size={16} />
                  Ver detalle
                </button>
              </div>
            </article>
          ))}
        </section>
      </section>

      {/* Modal nueva habitación */}
      {showModal && (
        <div className="room-modal-overlay">
          <div className="room-modal">
            <div className="room-modal-header">
              <div>
                <h2>Nueva habitación</h2>
                <p>Registra una nueva habitación en el sistema.</p>
              </div>

              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form className="room-modal-form">
              <label>
                Número habitación
                <input type="text" placeholder="Ej: 109" />
              </label>

              <label>
                Tipo habitación
                <input type="text" placeholder="Ej: Suite premium" />
              </label>

              <label>
                Precio
                <input type="text" placeholder="$35.000" />
              </label>

              <label>
                Estado
                <select defaultValue="Disponible">
                  <option>Disponible</option>
                  <option>Ocupada</option>
                  <option>Limpieza</option>
                </select>
              </label>

              <div className="room-modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>

                <button type="submit">
                  Guardar habitación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default RoomsPage;