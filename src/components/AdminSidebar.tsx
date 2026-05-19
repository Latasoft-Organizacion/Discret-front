import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  LayoutDashboard,
  Bed,
  ClipboardList,
  CalendarDays,
  Users,
  ChartColumn,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

type Props = {
  active: string;
};

function AdminSidebar({ active }: Props) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.innerWidth > 1000;
  });

  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-toggle ${isOpen ? 'is-open' : 'is-closed'}`}
        aria-label={isOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>

    <aside className={`admin-sidebar ${isOpen ? 'is-open' : 'is-collapsed'}`}>

      {/* LOGO */}
      <div className="admin-brand">

        <h1>DISCRET</h1>

        <p>
          DISCRECIÓN · CONFORT · PRIVACIDAD
        </p>

      </div>


      {/* MENU */}
      <nav className="admin-menu">

        <Link
          to="/dashboard"
          className={active === 'dashboard' ? 'active' : ''}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/habitaciones"
          className={active === 'habitaciones' ? 'active' : ''}
        >
          <Bed size={18} />
          Habitaciones
        </Link>

        <Link
          to="/reservas-admin"
          className={active === 'reservas' ? 'active' : ''}
        >
          <ClipboardList size={18} />
          Reservas
        </Link>

        <Link
          to="/agenda"
          className={active === 'agenda' ? 'active' : ''}
        >
          <CalendarDays size={18} />
          Agenda
        </Link>

        <Link
          to="/clientes"
          className={active === 'clientes' ? 'active' : ''}
        >
          <Users size={18} />
          Clientes
        </Link>

        <Link
          to="/reportes"
          className={active === 'reportes' ? 'active' : ''}
        >
          <ChartColumn size={18} />
          Reportes
        </Link>

        <Link
          to="/configuracion"
          className={active === 'configuracion' ? 'active' : ''}
        >
          <Settings size={18} />
          Configuración
        </Link>

      </nav>

      <Link to="/login" className="admin-logout-link">
        <LogOut size={18} />
        Cerrar sesión
      </Link>

    </aside>
    </>

  );
}

export default AdminSidebar;
