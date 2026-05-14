import { Link } from 'react-router-dom';

import {
  LayoutDashboard,
  Bed,
  ClipboardList,
  CalendarDays,
  Users,
  ChartColumn,
  Settings,
} from 'lucide-react';

type Props = {
  active: string;
};

function AdminSidebar({ active }: Props) {

  return (

    <aside className="admin-sidebar">

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

    </aside>

  );
}

export default AdminSidebar;