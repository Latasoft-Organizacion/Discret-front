import { useState } from 'react';

import {
  Bed,
  Search,
  Plus,
  CheckCircle2,
  Sparkles,
  LockKeyhole,
  Pencil,
  Eye,
  X,
} from 'lucide-react';

import AdminSidebar from '../components/AdminSidebar';

import '../styles/adminSidebar.css';
import '../styles/rooms.css';

type Room = {
  number: number;
  type: string;
  status: 'Disponible' | 'Ocupada' | 'Limpieza';
  price: string;
};

type RoomFilter = 'Todas' | Room['status'];

function RoomsPage() {
  // Estado para mostrar u ocultar el modal
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<RoomFilter>('Todas');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingRoomNumber, setEditingRoomNumber] = useState<number | null>(null);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);

  // Datos simulados de habitaciones
  const [rooms, setRooms] = useState<Room[]>([
    { number: 101, type: 'Suite estándar', status: 'Disponible', price: '$25.000' },
    { number: 102, type: 'Suite premium', status: 'Ocupada', price: '$35.000' },
    { number: 103, type: 'Suite jacuzzi', status: 'Limpieza', price: '$45.000' },
    { number: 104, type: 'Suite estándar', status: 'Disponible', price: '$25.000' },
  ]);

  const roomFilters: Array<{ label: string; value: RoomFilter }> = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Disponibles', value: 'Disponible' },
    { label: 'Ocupadas', value: 'Ocupada' },
    { label: 'Limpieza', value: 'Limpieza' },
  ];

  const filteredRooms =
    activeFilter === 'Todas'
      ? rooms
      : rooms.filter((room) => room.status === activeFilter);

  const availableRooms = rooms.filter((room) => room.status === 'Disponible').length;
  const occupiedRooms = rooms.filter((room) => room.status === 'Ocupada').length;
  const cleaningRooms = rooms.filter((room) => room.status === 'Limpieza').length;

  const handleUpdateRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingRoom) {
      return;
    }

    if (!editingRoom.number || !editingRoom.type || !editingRoom.price || !editingRoom.status) {
      alert('Completa todos los campos de la habitación.');
      return;
    }

    setRooms((currentRooms) =>
      currentRooms.map((room) =>
        room.number === editingRoomNumber ? editingRoom : room
      )
    );

    setEditingRoom(null);
    setEditingRoomNumber(null);
  };

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
              <CheckCircle2 size={22} strokeWidth={2.4} />
            </div>

            <div>
              <strong>{availableRooms}</strong>
              <p>Disponibles</p>
            </div>
          </article>

          <article>
            <div className="rooms-summary-icon pink">
              <LockKeyhole size={22} strokeWidth={2.4} />
            </div>

            <div>
              <strong>{occupiedRooms}</strong>
              <p>Ocupadas</p>
            </div>
          </article>

          <article>
            <div className="rooms-summary-icon soft">
              <Sparkles size={22} strokeWidth={2.4} />
            </div>

            <div>
              <strong>{cleaningRooms}</strong>
              <p>En limpieza</p>
            </div>
          </article>

          <article>
            <div className="rooms-summary-icon blue">
              <Bed size={24} strokeWidth={2.4} />
            </div>

            <div>
              <strong>{rooms.length}</strong>
              <p>Total habitaciones</p>
            </div>
          </article>
        </section>

        {/* Filtros rápidos */}
        <section className="rooms-filters">
          {roomFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={activeFilter === filter.value ? 'active' : ''}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </section>

        {/* Listado de habitaciones */}
        <section className="rooms-list">
          {filteredRooms.map((room) => (
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
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(room);
                    setEditingRoomNumber(room.number);
                  }}
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button type="button" onClick={() => setDetailRoom(room)}>
                  <Eye size={16} />
                  Ver detalle
                </button>
              </div>
            </article>
          ))}

          {filteredRooms.length === 0 && (
            <div className="rooms-empty-state">
              No hay habitaciones para este estado.
            </div>
          )}
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

      {editingRoom && (
        <div className="room-modal-overlay">
          <div className="room-modal">
            <div className="room-modal-header">
              <div>
                <h2>Editar habitación</h2>
                <p>Actualiza los datos principales de la habitación.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingRoom(null);
                  setEditingRoomNumber(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="room-modal-form" onSubmit={handleUpdateRoom}>
              <label>
                Número habitación
                <input
                  type="number"
                  value={editingRoom.number}
                  onChange={(event) =>
                    setEditingRoom((room) =>
                      room ? { ...room, number: Number(event.target.value) } : room
                    )
                  }
                />
              </label>

              <label>
                Tipo habitación
                <input
                  type="text"
                  value={editingRoom.type}
                  onChange={(event) =>
                    setEditingRoom((room) =>
                      room ? { ...room, type: event.target.value } : room
                    )
                  }
                />
              </label>

              <label>
                Precio
                <input
                  type="text"
                  value={editingRoom.price}
                  onChange={(event) =>
                    setEditingRoom((room) =>
                      room ? { ...room, price: event.target.value } : room
                    )
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={editingRoom.status}
                  onChange={(event) =>
                    setEditingRoom((room) =>
                      room
                        ? { ...room, status: event.target.value as Room['status'] }
                        : room
                    )
                  }
                >
                  <option>Disponible</option>
                  <option>Ocupada</option>
                  <option>Limpieza</option>
                </select>
              </label>

              <div className="room-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRoom(null);
                    setEditingRoomNumber(null);
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

      {detailRoom && (
        <div className="room-modal-overlay">
          <div className="room-modal">
            <div className="room-modal-header">
              <div>
                <h2>Detalle habitación</h2>
                <p>Información operativa de la habitación seleccionada.</p>
              </div>

              <button type="button" onClick={() => setDetailRoom(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="room-detail-modal-card">
              <div className="room-detail-modal-icon">
                <Bed size={34} />
              </div>

              <div>
                <span>Habitación</span>
                <strong>{detailRoom.number}</strong>
              </div>

              <div>
                <span>Tipo</span>
                <strong>{detailRoom.type}</strong>
              </div>

              <div>
                <span>Precio</span>
                <strong>{detailRoom.price}</strong>
              </div>

              <div>
                <span>Estado</span>
                <strong>{detailRoom.status}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RoomsPage;
