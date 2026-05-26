import { useState } from 'react';
import {
  Users,
  Star,
  BadgePlus,
  PhoneCall,
  Search,
  UserRoundPlus,
  X,
} from 'lucide-react';
import AdminBreadcrumb from '../components/AdminBreadcrumb';
import { AdminSkeleton } from '../components/AdminLoading';
import AdminToast from '../components/AdminToast';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminSidebar.css';
import '../styles/clients.css';

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  frequentRoom: string;
  visits: number;
  lastVisit: string;
  status: 'Frecuente' | 'Nuevo';
}

type ClientFilter = 'Todos' | 'Frecuentes' | 'Nuevos' | 'Activos';

function ClientsPage() {
  // Página actual de la tabla
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<ClientFilter>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const isLoading = false;
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: '',
    frequentRoom: '',
    status: 'Nuevo' as Client['status'],
  });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);

  // Cantidad de clientes visibles por página
  const clientsPerPage = 10;

  // Datos simulados de clientes
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Juan Pérez', phone: '+56 9 1234 5678', email: 'juan@email.com', frequentRoom: 'Hab. 102', visits: 4, lastVisit: '24/05/2026', status: 'Frecuente' },
    { id: 2, name: 'María López', phone: '+56 9 8765 4321', email: 'maria@email.com', frequentRoom: 'Hab. 105', visits: 2, lastVisit: '20/05/2026', status: 'Nuevo' },
    { id: 3, name: 'Carlos Rojas', phone: '+56 9 5555 1111', email: 'carlos@email.com', frequentRoom: 'Hab. 107', visits: 6, lastVisit: '18/05/2026', status: 'Frecuente' },
  ]);

  const clientFilters: ClientFilter[] = ['Todos', 'Frecuentes', 'Nuevos', 'Activos'];

  const filteredClients = clients.filter((client) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch
      || client.name.toLowerCase().includes(normalizedSearch)
      || client.phone.toLowerCase().includes(normalizedSearch)
      || client.email.toLowerCase().includes(normalizedSearch)
      || client.frequentRoom.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    if (activeFilter === 'Todos') {
      return true;
    }

    if (activeFilter === 'Frecuentes') {
      return client.status === 'Frecuente';
    }

    if (activeFilter === 'Nuevos') {
      return client.status === 'Nuevo';
    }

    return Boolean(client.phone || client.email);
  });

  const handleCreateClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newClient.name || !newClient.phone || !newClient.email || !newClient.frequentRoom) {
      setModalMessage('Completa nombre, teléfono, correo y habitación frecuente para crear el cliente.');
      return;
    }

    setClients((currentClients) => [
      {
        id: Math.max(...currentClients.map((client) => client.id)) + 1,
        name: newClient.name,
        phone: newClient.phone,
        email: newClient.email,
        frequentRoom: newClient.frequentRoom,
        visits: 0,
        lastVisit: 'Sin visitas',
        status: newClient.status,
      },
      ...currentClients,
    ]);

    setNewClient({
      name: '',
      phone: '',
      email: '',
      frequentRoom: '',
      status: 'Nuevo',
    });
    setModalMessage('');
    setCurrentPage(1);
    setShowClientModal(false);
    setToastMessage(`Cliente ${newClient.name} creado correctamente.`);
  };

  const handleUpdateClient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingClient) {
      return;
    }

    if (!editingClient.name || !editingClient.phone || !editingClient.email || !editingClient.frequentRoom) {
      setModalMessage('Completa nombre, teléfono, correo y habitación frecuente.');
      return;
    }

    setClients((currentClients) =>
      currentClients.map((client) =>
        client.id === editingClient.id ? editingClient : client
      )
    );

    setEditingClient(null);
    setModalMessage('');
    setToastMessage(`Cliente ${editingClient.name} actualizado correctamente.`);
  };

  // Total de páginas
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  // Índices para cortar la lista según la página actual
  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;

  // Clientes que se muestran en la página actual
  const visibleClients = filteredClients.slice(startIndex, endIndex);

  return (
    <>
    <AdminSidebar active="clientes" />
    <main className="clients-page">

      <header className="clients-top">
        <div>
          <AdminBreadcrumb current="Clientes" />
          <h1>Clientes</h1>
          <p>Gestión de contactos y clientes frecuentes</p>
        </div>

        {/* ========================================
                  BUSCADOR Y BOTON PRINCIPAL
           ======================================== */}

        <div className="clients-top-actions">

  {/* BUSCADOR */}
  <div className="clients-search">

    <Search
      size={18}
      strokeWidth={2.4}
    />

    <input
      type="text"
      placeholder="Buscar cliente..."
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
      }}
    />

  </div>


  {/* BOTON NUEVO CLIENTE */}
  <button type="button" onClick={() => setShowClientModal(true)}>

    <UserRoundPlus
      size={18}
      strokeWidth={2.4}
    />

    <span>
      Nuevo cliente
    </span>

  </button>

        </div>
      </header>

     {/* Resumen superior */}
{isLoading ? (
  <AdminSkeleton variant="summary" count={4} label="Cargando resumen de clientes" />
) : (
<section className="clients-summary">

  {/* Total clientes */}
  <article>

    <div className="clients-summary-icon">
      <Users size={26} strokeWidth={2.2} />
    </div>

    <div>
      <strong>{clients.length}</strong>
      <p>Total clientes</p>
    </div>

  </article>


  {/* Clientes frecuentes */}
  <article>

    <div className="clients-summary-icon">
      <Star size={26} strokeWidth={2.2} />
    </div>

    <div>
      <strong>
        {clients.filter((client) => client.status === 'Frecuente').length}
      </strong>

      <p>Frecuentes</p>
    </div>

  </article>


  {/* Clientes nuevos */}
  <article>

    <div className="clients-summary-icon">
      <BadgePlus size={26} strokeWidth={2.2} />
    </div>

    <div>
      <strong>
        {clients.filter((client) => client.status === 'Nuevo').length}
      </strong>

      <p>Nuevos</p>
    </div>

  </article>


  {/* Contactos */}
  <article>

    <div className="clients-summary-icon">
      <PhoneCall size={26} strokeWidth={2.2} />
    </div>

    <div>
      <strong>{clients.length}</strong>
      <p>Contactos activos</p>
    </div>

  </article>

</section>
)}
      {/* Filtros rápidos */}
      <section className="clients-filters">
        {clientFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? 'active' : ''}
            onClick={() => {
              setActiveFilter(filter);
              setCurrentPage(1);
            }}
          >
            {filter}
          </button>
        ))}
      </section>

      {/* Listado de clientes */}
      <section className="clients-list" aria-busy={isLoading}>
        {isLoading && (
          <AdminSkeleton variant="card" count={4} label="Cargando clientes" />
        )}

        {!isLoading && visibleClients.map((client) => (
          <article
            className={`client-card ${client.status.toLowerCase()}`}
            key={client.id}
          >
            <div className="client-avatar">
              {client.name.charAt(0)}
            </div>

            <div className="client-info">
              <h2>{client.name}</h2>
              <p>{client.phone}</p>
              <p>{client.email}</p>
            </div>

            <div>
              <strong>{client.visits}</strong>
              <p>Visitas</p>
            </div>

            <div>
              <strong>{client.frequentRoom}</strong>
              <p>Hab. frecuente</p>
            </div>

            <div>
              <strong>{client.lastVisit}</strong>
              <p>Última visita</p>
            </div>

            <span className={`client-status ${client.status.toLowerCase()}`}>
              {client.status}
            </span>

            <div className="client-actions">
              <button type="button" onClick={() => setEditingClient(client)}>
                Editar
              </button>
              <button type="button" onClick={() => setDetailClient(client)}>
                Detalle
              </button>
            </div>
          </article>
        ))}

        {!isLoading && visibleClients.length === 0 && (
          <div className="admin-empty-state">
            <div>
              <strong>No hay clientes para mostrar</strong>
              <p>Prueba con otro filtro, nombre, correo, teléfono o habitación frecuente.</p>
            </div>
          </div>
        )}
      </section>

      {/* Paginación */}
      <section className="clients-pagination">
        <p>
          Mostrando {filteredClients.length === 0 ? 0 : startIndex + 1}
          -
          {Math.min(endIndex, filteredClients.length)} de {filteredClients.length} clientes
        </p>

        <div>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Anterior
          </button>

          <span>
            Página {currentPage} de {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Siguiente
          </button>
        </div>
      </section>

      {showClientModal && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <div className="client-modal-header">
              <div>
                <h2>Nuevo cliente</h2>
                <p>Registra un cliente para el panel administrativo.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalMessage('');
                  setShowClientModal(false);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="client-modal-form" onSubmit={handleCreateClient}>
              {modalMessage && <p className="admin-modal-message">{modalMessage}</p>}

              <label>
                Nombre
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={newClient.name}
                  onChange={(event) =>
                    setNewClient((client) => ({
                      ...client,
                      name: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Teléfono
                <input
                  type="text"
                  placeholder="+56 9 1234 5678"
                  value={newClient.phone}
                  onChange={(event) =>
                    setNewClient((client) => ({
                      ...client,
                      phone: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Correo
                <input
                  type="email"
                  placeholder="cliente@email.com"
                  value={newClient.email}
                  onChange={(event) =>
                    setNewClient((client) => ({
                      ...client,
                      email: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Habitación frecuente
                <input
                  type="text"
                  placeholder="Ej: Hab. 105"
                  value={newClient.frequentRoom}
                  onChange={(event) =>
                    setNewClient((client) => ({
                      ...client,
                      frequentRoom: event.target.value,
                    }))
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={newClient.status}
                  onChange={(event) =>
                    setNewClient((client) => ({
                      ...client,
                      status: event.target.value as Client['status'],
                    }))
                  }
                >
                  <option>Nuevo</option>
                  <option>Frecuente</option>
                </select>
              </label>

              <div className="client-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setModalMessage('');
                    setShowClientModal(false);
                  }}
                >
                  Cancelar
                </button>

                <button type="submit">
                  Crear cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingClient && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <div className="client-modal-header">
              <div>
                <h2>Editar cliente</h2>
                <p>Actualiza los datos registrados del cliente.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setModalMessage('');
                  setEditingClient(null);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form className="client-modal-form" onSubmit={handleUpdateClient}>
              {modalMessage && <p className="admin-modal-message">{modalMessage}</p>}

              <label>
                Nombre
                <input
                  type="text"
                  value={editingClient.name}
                  onChange={(event) =>
                    setEditingClient((client) =>
                      client ? { ...client, name: event.target.value } : client
                    )
                  }
                />
              </label>

              <label>
                Teléfono
                <input
                  type="text"
                  value={editingClient.phone}
                  onChange={(event) =>
                    setEditingClient((client) =>
                      client ? { ...client, phone: event.target.value } : client
                    )
                  }
                />
              </label>

              <label>
                Correo
                <input
                  type="email"
                  value={editingClient.email}
                  onChange={(event) =>
                    setEditingClient((client) =>
                      client ? { ...client, email: event.target.value } : client
                    )
                  }
                />
              </label>

              <label>
                Habitación frecuente
                <input
                  type="text"
                  value={editingClient.frequentRoom}
                  onChange={(event) =>
                    setEditingClient((client) =>
                      client ? { ...client, frequentRoom: event.target.value } : client
                    )
                  }
                />
              </label>

              <label>
                Estado
                <select
                  value={editingClient.status}
                  onChange={(event) =>
                    setEditingClient((client) =>
                      client
                        ? { ...client, status: event.target.value as Client['status'] }
                        : client
                    )
                  }
                >
                  <option>Nuevo</option>
                  <option>Frecuente</option>
                </select>
              </label>

              <div className="client-modal-actions">
                <button
                  type="button"
                  onClick={() => {
                    setModalMessage('');
                    setEditingClient(null);
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

      {detailClient && (
        <div className="client-modal-overlay">
          <div className="client-modal">
            <div className="client-modal-header">
              <div>
                <h2>Detalle cliente</h2>
                <p>Información completa del cliente seleccionado.</p>
              </div>

              <button type="button" onClick={() => setDetailClient(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="client-detail-grid">
              <div>
                <span>Nombre</span>
                <strong>{detailClient.name}</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>{detailClient.phone}</strong>
              </div>

              <div>
                <span>Correo</span>
                <strong>{detailClient.email}</strong>
              </div>

              <div>
                <span>Habitación frecuente</span>
                <strong>{detailClient.frequentRoom}</strong>
              </div>

              <div>
                <span>Visitas</span>
                <strong>{detailClient.visits}</strong>
              </div>

              <div>
                <span>Última visita</span>
                <strong>{detailClient.lastVisit}</strong>
              </div>

              <div>
                <span>Estado</span>
                <strong>{detailClient.status}</strong>
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
    </>
  );
}

export default ClientsPage;
