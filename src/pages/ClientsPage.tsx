import { useState } from 'react';
import {
  Users,
  Star,
  BadgePlus,
  PhoneCall,
  Search,
  UserRoundPlus,
} from 'lucide-react';
import '../styles/clients.css';

interface Client {
  id: number;
  name: string;
  phone: string;
  visits: number;
  lastVisit: string;
  status: 'Frecuente' | 'Nuevo';
}

function ClientsPage() {
  // Página actual de la tabla
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Cantidad de clientes visibles por página
  const clientsPerPage = 10;

  // Datos simulados de clientes
  const clients: Client[] = [
    { id: 1, name: 'Juan Pérez', phone: '+56 9 1234 5678', visits: 4, lastVisit: '24/05/2026', status: 'Frecuente' },
    { id: 2, name: 'María López', phone: '+56 9 8765 4321', visits: 2, lastVisit: '20/05/2026', status: 'Nuevo' },
    { id: 3, name: 'Carlos Rojas', phone: '+56 9 5555 1111', visits: 6, lastVisit: '18/05/2026', status: 'Frecuente' },
  ];

  // Total de páginas
  const totalPages = Math.ceil(clients.length / clientsPerPage);

  // Índices para cortar la lista según la página actual
  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;

  // Clientes que se muestran en la página actual
  const visibleClients = clients.slice(startIndex, endIndex);

  return (
    <main className="clients-page">

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
    />

  </div>


  {/* BOTON NUEVO CLIENTE */}
  <button type="button">

    <UserRoundPlus
      size={18}
      strokeWidth={2.4}
    />

    <span>
      Nuevo cliente
    </span>

  </button>

</div>

     {/* Resumen superior */}
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
      {/* Filtros rápidos */}
      <section className="clients-filters">
        <button type="button" className="active">Todos</button>
        <button type="button">Frecuentes</button>
        <button type="button">Nuevos</button>
        <button type="button">Activos</button>
      </section>

      {/* Listado de clientes */}
      <section className="clients-list">
        {visibleClients.map((client) => (
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
            </div>

            <div>
              <strong>{client.visits}</strong>
              <p>Visitas</p>
            </div>

            <div>
              <strong>{client.lastVisit}</strong>
              <p>Última visita</p>
            </div>

            <span className={`client-status ${client.status.toLowerCase()}`}>
              {client.status}
            </span>

            <div className="client-actions">
              <button type="button">Editar</button>
              <button type="button">Detalle</button>
            </div>
          </article>
        ))}
      </section>

      {/* Paginación */}
      <section className="clients-pagination">
        <p>
          Mostrando {clients.length === 0 ? 0 : startIndex + 1}
          -
          {Math.min(endIndex, clients.length)} de {clients.length} clientes
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
    </main>
  );
}

export default ClientsPage;