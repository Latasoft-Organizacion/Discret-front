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

import discretLogo from '../assets/images/logo-discret.png';

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

  const closeOnMobile = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1000) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-toggle ${isOpen ? 'is-open' : 'is-closed'}`}
        aria-label={isOpen ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
        aria-expanded={isOpen}
        aria-controls="admin-sidebar"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>

    <aside
      id="admin-sidebar"
      className={`admin-sidebar ${isOpen ? 'is-open' : 'is-collapsed'}`}
      aria-label="Navegación administrativa"
    >

      {/* LOGO */}
      <div className="admin-brand">

        <img src={discretLogo} alt="DISCRET" />

        <p>
          DISCRECIÓN · CONFORT · PRIVACIDAD
        </p>

      </div>


      {/* MENU */}
      <nav className="admin-menu" aria-label="Secciones del panel administrativo">

        <Link
          to="/dashboard"
          className={active === 'dashboard' ? 'active' : ''}
          aria-current={active === 'dashboard' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/habitaciones"
          className={active === 'habitaciones' ? 'active' : ''}
          aria-current={active === 'habitaciones' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <Bed size={18} />
          Habitaciones
        </Link>

        <Link
          to="/reservas-admin"
          className={active === 'reservas' ? 'active' : ''}
          aria-current={active === 'reservas' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <ClipboardList size={18} />
          Reservas
        </Link>

        <Link
          to="/agenda"
          className={active === 'agenda' ? 'active' : ''}
          aria-current={active === 'agenda' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <CalendarDays size={18} />
          Agenda
        </Link>

        <Link
          to="/clientes"
          className={active === 'clientes' ? 'active' : ''}
          aria-current={active === 'clientes' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <Users size={18} />
          Clientes
        </Link>

        <Link
          to="/reportes"
          className={active === 'reportes' ? 'active' : ''}
          aria-current={active === 'reportes' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <ChartColumn size={18} />
          Reportes
        </Link>

        <Link
          to="/configuracion"
          className={active === 'configuracion' ? 'active' : ''}
          aria-current={active === 'configuracion' ? 'page' : undefined}
          onClick={closeOnMobile}
        >
          <Settings size={18} />
          Configuración
        </Link>

      </nav>

      <Link to="/login" className="admin-logout-link" onClick={closeOnMobile}>
        <LogOut size={18} />
        Cerrar sesión
      </Link>

    </aside>
    </>

  );
}

export default AdminSidebar;
