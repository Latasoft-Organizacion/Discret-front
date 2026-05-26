import { BrowserRouter, Routes, Route } from 'react-router-dom';


// Páginas públicas
import ClientLandingPage from '../pages/ClientLandingPage';
import ClientRegisterPage from '../pages/ClientRegisterPage';
import ConfirmReservationPage from '../pages/ConfirmReservationPage';

// Páginas administrativas
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import RoomsPage from '../pages/RoomsPage';
import ReservationsPage from '../pages/ReservationsPage';
import AdminReservationsPage from '../pages/AdminReservationsPage';
import AgendaPage from '../pages/AgendaPage';
import ClientsPage from '../pages/ClientsPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

function AppRouter() {
  return (
    <BrowserRouter basename="/discret">
      <Routes>
        {/* Landing pública cliente */}
        <Route path="/" element={<ClientLandingPage />} />
        <Route path="/registro" element={<ClientRegisterPage />} />

        {/* Formulario de reserva cliente */}
        <Route path="/reservas-admin" element={<AdminReservationsPage />} />

        {/* Confirmación de reserva cliente */}
        <Route path="/confirmar-reserva" element={<ConfirmReservationPage />} />

        {/* Login administrador */}
        <Route path="/login" element={<LoginPage />} />

        {/* Panel administrativo */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/habitaciones" element={<RoomsPage />} />
        <Route path="/reservas" element={<ReservationsPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/clientes" element={<ClientsPage />} />
        <Route path="/reportes" element={<ReportsPage />} />
        <Route path="/configuracion" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
