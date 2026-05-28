import { useEffect, useState } from 'react';

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

import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { AdminSkeleton } from '../components/AdminLoading';
import AdminToast from '../components/AdminToast';
import AdminSidebar from '../components/AdminSidebar';
import { ApiError, api, type EstadoHabitacionApi, type Habitacion, type TipoHabitacion } from '../services/api';

import '../styles/adminSidebar.css';
import '../styles/rooms.css';

type Room = {
  id?: number;
  typeId: number;
  number: number;
  type: string;
  status: 'Disponible' | 'Ocupada' | 'Limpieza';
  price: string;
};

type RoomFilter = 'Todas' | Room['status'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);

const mapRoomStatus = (status: Habitacion['estado']): Room['status'] => {
  if (status === 'ocupada') {
    return 'Ocupada';
  }

  if (status === 'limpieza' || status === 'mantenimiento') {
    return 'Limpieza';
  }

  return 'Disponible';
};

const mapApiRoom = (room: Habitacion): Room => ({
  id: room.id,
  typeId: room.tipo_habitacion_id,
  number: Number(room.numero),
  type: room.descripcion || room.tipo_habitacion?.nombre || room.nombre,
  status: mapRoomStatus(room.estado),
  price: formatCurrency(room.precio),
});

const mapRoomStatusToApi = (status: Room['status']): EstadoHabitacionApi => {
  if (status === 'Ocupada') {
    return 'ocupada';
  }

  if (status === 'Limpieza') {
    return 'limpieza';
  }

  return 'disponible';
};

const parseCurrency = (value: string) => {
  const parsedValue = Number(value.replace(/[^\d]/g, ''));

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

function RoomsPage() {
  // Estado para mostrar u ocultar el modal
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<RoomFilter>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [loadMessage, setLoadMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [roomTypes, setRoomTypes] = useState<TipoHabitacion[]>([]);
  const [newRoom, setNewRoom] = useState<Room>({
    typeId: 1,
    number: 109,
    type: '',
    status: 'Disponible',
    price: '',
  });
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      setIsLoading(true);
      setLoadMessage('');

      try {
        const [habitaciones, tiposHabitacion] = await Promise.all([
          api.listarHabitaciones(),
          api.listarTiposHabitacion(),
        ]);

        if (!isMounted) {
          return;
        }

        setRoomTypes(tiposHabitacion);
        setRooms(habitaciones.map(mapApiRoom));
        setNewRoom((room) => ({
          ...room,
          typeId: tiposHabitacion[0]?.id ?? room.typeId,
          number: habitaciones.length
            ? Math.max(...habitaciones.map((habitacion) => Number(habitacion.numero))) + 1
            : room.number,
        }));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        const message = error instanceof ApiError
          ? error.message
          : 'No se pudo conectar con Laravel para cargar las habitaciones.';

        setLoadMessage(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  const roomFilters: Array<{ label: string; value: RoomFilter }> = [
    { label: 'Todas', value: 'Todas' },
    { label: 'Disponibles', value: 'Disponible' },
    { label: 'Ocupadas', value: 'Ocupada' },
    { label: 'Limpieza', value: 'Limpieza' },
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesFilter = activeFilter === 'Todas' || room.status === activeFilter;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch
      || String(room.number).includes(normalizedSearch)
      || room.type.toLowerCase().includes(normalizedSearch)
      || room.status.toLowerCase().includes(normalizedSearch);

    return matchesFilter && matchesSearch;
  });

  const availableRooms = rooms.filter((room) => room.status === 'Disponible').length;
  const occupiedRooms = rooms.filter((room) => room.status === 'Ocupada').length;
  const cleaningRooms = rooms.filter((room) => room.status === 'Limpieza').length;

  const handleUpdateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingRoom || !editingRoom.id || isSaving) {
      return;
    }

    if (!editingRoom.number || !editingRoom.typeId || !editingRoom.price || !editingRoom.status) {
      setModalMessage('Completa todos los campos de la habitación antes de guardar.');
      return;
    }

    setIsSaving(true);

    try {
      const selectedType = roomTypes.find((type) => type.id === editingRoom.typeId);
      const updatedRoom = await api.actualizarHabitacion(editingRoom.id, {
        tipo_habitacion_id: editingRoom.typeId,
        numero: String(editingRoom.number),
        nombre: `Habitación ${editingRoom.number}`,
        descripcion: selectedType?.nombre ?? editingRoom.type,
        precio: parseCurrency(editingRoom.price),
        estado: mapRoomStatusToApi(editingRoom.status),
        activa: true,
      });

      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === editingRoom.id ? mapApiRoom(updatedRoom) : room
        )
      );

      setEditingRoom(null);
      setModalMessage('');
      setToastMessage(`Habitación ${editingRoom.number} actualizada correctamente.`);
    } catch (error) {
      const message = error instanceof ApiError
        ? Object.values(error.errors ?? {}).flat()[0] ?? error.message
        : 'No se pudo actualizar la habitación en Laravel.';

      setModalMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    if (!newRoom.number || !newRoom.typeId || !newRoom.price || !newRoom.status) {
      setModalMessage('Completa número, tipo, precio y estado para crear la habitación.');
      return;
    }

    if (rooms.some((room) => room.number === newRoom.number)) {
      setModalMessage('Ya existe una habitación con ese número.');
      return;
    }

    setIsSaving(true);

    try {
      const selectedType = roomTypes.find((type) => type.id === newRoom.typeId);
      const createdRoom = await api.crearHabitacion({
        tipo_habitacion_id: newRoom.typeId,
        numero: String(newRoom.number),
        nombre: `Habitación ${newRoom.number}`,
        descripcion: selectedType?.nombre ?? newRoom.type,
        precio: parseCurrency(newRoom.price),
        estado: mapRoomStatusToApi(newRoom.status),
        activa: true,
      });

      setRooms((currentRooms) => [...currentRooms, mapApiRoom(createdRoom)]);
      setNewRoom({
        typeId: roomTypes[0]?.id ?? newRoom.typeId,
        number: newRoom.number + 1,
        type: '',
        status: 'Disponible',
        price: '',
      });
      setModalMessage('');
      setShowModal(false);
      setToastMessage(`Habitación ${newRoom.number} creada correctamente.`);
    } catch (error) {
      const message = error instanceof ApiError
        ? Object.values(error.errors ?? {}).flat()[0] ?? error.message
        : 'No se pudo crear la habitación en Laravel.';

      setModalMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="rooms-admin-layout">
      {/* Sidebar reutilizable */}
      <AdminSidebar active="habitaciones" />

      {/* Contenido principal */}
      <section className="rooms-admin-main">
        <header className="rooms-top">
          <div>
            <AdminBreadcrumb current="Habitaciones" />
            <h1>Habitaciones</h1>
            <p>Gestión y estado actual de habitaciones</p>
          </div>

          <div className="rooms-top-actions">
            <div className="rooms-search">
              <Search size={18} />
              <input
                type="text"
                aria-label="Buscar habitación"
                placeholder="Buscar habitación..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <button type="button" aria-label="Crear nueva habitación" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Nueva habitación
            </button>
          </div>
        </header>

        {loadMessage && (
          <div className="admin-empty-state" role="alert">
            <div>
              <strong>No se pudieron cargar las habitaciones</strong>
              <p>{loadMessage}</p>
            </div>
          </div>
        )}

        {/* Resumen rápido superior */}
        {isLoading ? (
          <AdminSkeleton variant="summary" count={4} label="Cargando resumen de habitaciones" />
        ) : (
        <>
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
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </section>
        </>
        )}

        {/* Listado de habitaciones */}
        <section className="rooms-list" aria-busy={isLoading}>
          {isLoading && (
            <AdminSkeleton variant="card" count={4} label="Cargando habitaciones" />
          )}

          {!isLoading && filteredRooms.map((room) => (
            <article
              className={`room-detail-card ${room.status.toLowerCase()}`}
              key={room.id ?? room.number}
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
                  }}
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  type="button"
                  aria-label={`Ver detalle de habitación ${room.number}`}
                  onClick={() => setDetailRoom(room)}
                >
                  <Eye size={16} />
                  Ver detalle
                </button>
              </div>
            </article>
          ))}

          {!isLoading && filteredRooms.length === 0 && (
            <div className="admin-empty-state">
              <div>
                <strong>No hay habitaciones para mostrar</strong>
                <p>
                  Ajusta el filtro o prueba con otro número, tipo o estado de habitación.
                </p>
              </div>
            </div>
          )}
        </section>
      </section>

      {/* Modal nueva habitación */}
      {showModal && (
        <div
          className="room-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-create-title"
        >
          <div className="room-modal">
            <div className="room-modal-header">
              <div>
                <h2 id="room-create-title">Nueva habitación</h2>
                <p>Registra una nueva habitación en el sistema.</p>
              </div>

              <button
                type="button"
                aria-label="Cerrar modal de nueva habitación"
                onClick={() => {
                  setModalMessage('');
                  setShowModal(false);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="room-modal-form" onSubmit={handleCreateRoom}>
              {modalMessage && <p className="admin-modal-message">{modalMessage}</p>}

              <label>
                Número habitación
                <input
                  type="number"
                  placeholder="Ej: 109"
                  value={newRoom.number}
                  onChange={(event) =>
                    setNewRoom((room) => ({ ...room, number: Number(event.target.value) }))
                  }
                />
              </label>

              <label>
                Tipo habitación
                <select
                  value={newRoom.typeId}
                  onChange={(event) => {
                    const typeId = Number(event.target.value);
                    const selectedType = roomTypes.find((type) => type.id === typeId);

                    setNewRoom((room) => ({
                      ...room,
                      typeId,
                      type: selectedType?.nombre ?? room.type,
                      price: selectedType ? formatCurrency(selectedType.precio_base) : room.price,
                    }));
                  }}
                >
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Precio
                <input
                  type="text"
                  placeholder="$35.000"
                  value={newRoom.price}
                  onChange={(event) =>
                    setNewRoom((room) => ({ ...room, price: event.target.value }))
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={newRoom.status}
                  onChange={(event) =>
                    setNewRoom((room) => ({
                      ...room,
                      status: event.target.value as Room['status'],
                    }))
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
                    setModalMessage('');
                    setShowModal(false);
                  }}
                >
                  Cancelar
                </button>

                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar habitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingRoom && (
        <div
          className="room-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-edit-title"
        >
          <div className="room-modal">
            <div className="room-modal-header">
              <div>
                <h2 id="room-edit-title">Editar habitación</h2>
                <p>Actualiza los datos principales de la habitación.</p>
              </div>

              <button
                type="button"
                aria-label="Cerrar modal de edición de habitación"
                onClick={() => {
                  setEditingRoom(null);
                  setModalMessage('');
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="room-modal-form" onSubmit={handleUpdateRoom}>
              {modalMessage && <p className="admin-modal-message">{modalMessage}</p>}

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
                <select
                  value={editingRoom.typeId}
                  onChange={(event) => {
                    const typeId = Number(event.target.value);
                    const selectedType = roomTypes.find((type) => type.id === typeId);

                    setEditingRoom((room) =>
                      room
                        ? {
                            ...room,
                            typeId,
                            type: selectedType?.nombre ?? room.type,
                            price: selectedType ? formatCurrency(selectedType.precio_base) : room.price,
                          }
                        : room
                    );
                  }}
                >
                  {roomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.nombre}
                    </option>
                  ))}
                </select>
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
                    setModalMessage('');
                  }}
                >
                  Cancelar
                </button>

                <button type="submit" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailRoom && (
        <div
          className="room-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="room-detail-title"
        >
          <div className="room-modal">
            <div className="room-modal-header">
              <div>
                <h2 id="room-detail-title">Detalle habitación</h2>
                <p>Información operativa de la habitación seleccionada.</p>
              </div>

              <button
                type="button"
                aria-label="Cerrar detalle de habitación"
                onClick={() => setDetailRoom(null)}
              >
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

      <AdminToast
        message={toastMessage}
        onClose={() => setToastMessage('')}
      />
    </main>
  );
}

export default RoomsPage;
