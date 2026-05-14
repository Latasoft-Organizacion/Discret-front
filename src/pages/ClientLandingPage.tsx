import { useNavigate } from 'react-router-dom';
import { Bed } from 'lucide-react';

import {ShieldCheck, Clock3, LockKeyhole, CalendarDays, } from 'lucide-react';
import '../styles/clientLanding.css';

// Imagen de fondo principal
import motelLogin from '../assets/images/motel-registro.png';

function ClientLandingPage() {

  // Hook para navegar entre rutas
  const navigate = useNavigate();

  return (

    <main
      className="client-landing-page"

      /* Fondo dinámico usando import de Vite */
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(5, 8, 15, 0.15),
            rgba(5, 8, 15, 0.92)
          ),
          url(${motelLogin})
        `,
      }}
    >

      {/* Overlay oscuro */}
      <section className="client-landing-overlay">

        {/* ========================================
            NAVBAR SUPERIOR
        ======================================== */}

        <header className="client-navbar">

          <div className="client-navbar-logo">
            DISCRET
          </div>

          <button
            type="button"
            className="client-admin-btn"
            onClick={() => navigate('/login')}
          >
            Panel administrador
          </button>

        </header>

        {/* ========================================
            CONTENIDO PRINCIPAL
        ======================================== */}

        <div className="client-landing-content">

          {/* Logo principal */}
          <div className="client-logo-box">

            <div className="client-icon">
              <Bed size={46} strokeWidth={2.2} />
             </div>

            <h1>DISCRET</h1>

            <p>
              DISCRECIÓN • CONFORT • PRIVACIDAD
            </p>

          </div>

          {/* Línea divisora */}
          <div className="client-divider">
            <span></span>

            <strong>♡</strong>

            <span></span>
          </div>

          {/* Título principal */}
          <h2>
            Solo reservar ahora
          </h2>

          {/* Subtítulo */}
          <p className="client-subtitle">
            Rápido, fácil y 100% confidencial.
          </p>

          {/* Beneficios */}
          <ul className="client-benefits">

          <li>
           <ShieldCheck size={20} strokeWidth={2.2} />
            <span>Discreción garantizada</span>
           </li>

           <li>
            <Clock3 size={20} strokeWidth={2.2} />
           <span>Reservas en minutos</span>
          </li>

          <li>
           <LockKeyhole size={20} strokeWidth={2.2} />
           <span>Tu privacidad es lo primero</span>
           </li>

          </ul>

         {/* Botón principal */}
             <button
             type="button"
             className="client-reserve-btn"
             onClick={() => navigate('/reservas')}
>
         <CalendarDays size={22} strokeWidth={2.4} />
           <span>Reservar ahora</span>
          </button>

          {/* Caja de privacidad */}
          <div className="client-privacy-box">

            <strong>
              100% Privado
            </strong>

            <p>
              Tu reserva es completamente confidencial y segura.
            </p>

          </div>

          {/* Footer */}
          <small>
            © 2026 Sistema de Reservas para Moteles
          </small>

        </div>

      </section>

    </main>
  );
}

export default ClientLandingPage;