import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bed,
  CalendarDays,
  Check,
  Clock3,
  LockKeyhole,
  Mail,
  Menu,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';

import '../styles/clientLanding.css';
import discretLogo from '../assets/images/logo-discret.png';
import motelLogin from '../assets/images/motel-registro.png';

const menuItems = [
  { label: 'Inicio', href: '#inicio' },
  { label: '¿Quiénes somos?', href: '#quienes-somos' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Planes', href: '#planes' },
  { label: 'Reservar', href: '#reservar' },
  { label: 'Contacto', href: '#contacto' },
];

const plans = [
  {
    name: 'Plan Base',
    price: '$49.990 CLP',
    period: '/mes',
    idealFor: 'Moteles pequeños.',
    features: [
      'Reservas',
      'Habitaciones hasta 10',
      'Panel admin',
      'Agenda',
      'WhatsApp',
      'Estados de habitaciones',
    ],
  },
  {
    name: 'Plan Discret',
    price: '$59.990 CLP',
    period: '/mes',
    idealFor: 'Cadenas de moteles medianos.',
    features: [
      'Reservas',
      'Habitaciones hasta 30',
      'Panel admin',
      'Agenda',
      'WhatsApp',
      'Estado de habitaciones',
    ],
    highlighted: true,
  },
];

function ClientLandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const goToReservation = () => {
    closeMenu();
    navigate('/reservas');
  };

  const requestPlan = (planName: string) => {
    const message = encodeURIComponent(
      `Hola, quiero solicitar el ${planName} de DISCRET.`
    );

    window.open(
      `https://wa.me/56948882467?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <main
      className="client-landing-page"
      style={{
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(5, 8, 15, 0.18),
            rgba(5, 8, 15, 0.93)
          ),
          url(${motelLogin})
        `,
      }}
    >
      <div className="client-page-shade">
        <header className="client-navbar">
          <a className="client-navbar-logo" href="#inicio" onClick={closeMenu}>
            <img src={discretLogo} alt="DISCRET" />
          </a>

          <nav className="client-desktop-nav" aria-label="Navegación principal">
            {menuItems.slice(1, 5).map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="client-navbar-actions">
            <button
              type="button"
              className="client-admin-btn"
              onClick={() => navigate('/login')}
            >
              Panel administrador
            </button>

            <button
              type="button"
              className="client-menu-btn"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className={`client-floating-menu ${isMenuOpen ? 'is-open' : ''}`}>
            {menuItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}

            <button type="button" onClick={goToReservation}>
              Reservar ahora
            </button>
          </div>
        </header>

        <section id="inicio" className="client-hero-section">
          <div className="client-hero-copy">
            <p className="client-kicker">Gestión moderna para hospitality privado</p>
            <h1>DISCRET</h1>
            <p className="client-tagline">
              DISCRECIÓN • CONFORT • PRIVACIDAD
            </p>

            <div className="client-divider">
              <span></span>
              <strong>♡</strong>
              <span></span>
            </div>

            <h2>Reserva y administra con una experiencia más simple</h2>
            <p className="client-subtitle">
              Una plataforma comercial, privada y eficiente para conectar reservas,
              habitaciones y operación en tiempo real.
            </p>

            <div className="client-hero-actions">
              <button
                type="button"
                className="client-reserve-btn"
                onClick={goToReservation}
              >
                <CalendarDays size={22} strokeWidth={2.4} />
                <span>Reservar ahora</span>
              </button>

              <a className="client-ghost-link" href="#quienes-somos">
                Conocer DISCRET
              </a>
            </div>
          </div>

          <aside className="client-hero-card" aria-label="Resumen de servicios">
            <div className="client-icon">
              <Bed size={46} strokeWidth={2.2} />
            </div>
            <strong>Operación privada en tiempo real</strong>
            <p>
              Controla reservas, disponibilidad y atención desde una interfaz clara,
              rápida y segura.
            </p>
          </aside>
        </section>

        <section id="quienes-somos" className="client-section client-about-section">
          <div className="client-section-heading">
            <p className="client-kicker">¿Quiénes Somos?</p>
            <h2>Diseñamos tecnología para modernizar la gestión privada</h2>
          </div>

          <div className="client-about-panel">
            <p>
              En DISCRET desarrollamos tecnología simple, moderna y eficiente para
              la gestión de moteles y espacios de hospitality privado.
            </p>
            <p>
              Nuestra misión es ayudar a modernizar una industria que durante años
              ha operado con procesos manuales, reservas desordenadas y poca
              digitalización, entregando una plataforma intuitiva que permite
              administrar habitaciones, reservas y operaciones en tiempo real desde
              cualquier dispositivo.
            </p>
          </div>
        </section>

        <section id="beneficios" className="client-section client-benefits-grid">
          <article>
            <ShieldCheck size={28} strokeWidth={2.2} />
            <h3>Discreción garantizada</h3>
            <p>Flujos privados y una experiencia pensada para reducir fricción.</p>
          </article>

          <article>
            <Clock3 size={28} strokeWidth={2.2} />
            <h3>Reservas en minutos</h3>
            <p>Disponibilidad, horarios y confirmación reunidos en un solo lugar.</p>
          </article>

          <article>
            <LockKeyhole size={28} strokeWidth={2.2} />
            <h3>Operación protegida</h3>
            <p>Datos ordenados, acceso simple y control desde cualquier dispositivo.</p>
          </article>
        </section>

        <section className="client-section client-brand-story-section">
          <div className="client-brand-story-panel">
            <p className="client-kicker">Lo que representa DISCRET</p>
            <h2>Reservas privadas, automatización y pagos digitales para la industria motelera</h2>
            <p>
              Discret ®️ es una plataforma tecnológica que moderniza la industria
              motelera mediante reservas online privadas, automatización y pagos
              digitales.
            </p>
            <p>
              Actualmente muchos moteles siguen operando con WhatsApp y procesos
              manuales, generando mala experiencia y poca eficiencia. Nuestra solución
              permite reservas discretas, disponibilidad en tiempo real y gestión
              completa para el motel desde un panel administrativo.
            </p>
          </div>
        </section>

        <section id="planes" className="client-section client-plans-section">
          <div className="client-section-heading client-plans-heading">
            <p className="client-kicker">Planes comerciales</p>
            <h2>Elige el plan que mejor calza con tu operación</h2>
            <p>
              Valores mensuales diseñados para digitalizar reservas, habitaciones y
              administración sin complejidad.
            </p>
          </div>

          <div className="client-plans-grid">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`client-plan-card ${plan.highlighted ? 'is-featured' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => requestPlan(plan.name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    requestPlan(plan.name);
                  }
                }}
              >
                {plan.highlighted && <span className="client-plan-badge">Más completo</span>}

                <div className="client-plan-header">
                  <h3>{plan.name}</h3>
                  <div className="client-plan-price">
                    <strong>{plan.price}</strong>
                    <span>{plan.period}</span>
                  </div>
                </div>

                <p className="client-plan-ideal">
                  <span>Ideal para:</span> {plan.idealFor}
                </p>

                <ul className="client-plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={18} strokeWidth={2.6} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <span className="client-plan-btn">
                  Solicitar plan
                </span>
              </article>
            ))}
          </div>

          <p className="client-plan-note">
            *Cada plan es por 1 recinto motelero.
          </p>
        </section>

        <section id="reservar" className="client-section client-cta-section">
          <div>
            <p className="client-kicker">Listo para avanzar</p>
            <h2>Haz que cada reserva sea más rápida, clara y confidencial.</h2>
          </div>

          <button
            type="button"
            className="client-reserve-btn"
            onClick={goToReservation}
          >
            <CalendarDays size={22} strokeWidth={2.4} />
            <span>Ir a reservas</span>
          </button>
        </section>

        <section id="contacto" className="client-section client-contact-section">
          <div>
            <p className="client-kicker">Contacto</p>
            <h2>Conversemos</h2>
          </div>

          <div className="client-contact-list">
            <a href="mailto:discretchile@gmail.com">
              <Mail size={22} strokeWidth={2.3} />
              <span>
                <strong>Correo</strong>
                discretchile@gmail.com
              </span>
            </a>

            <a href="tel:+56948882467">
              <Phone size={22} strokeWidth={2.3} />
              <span>
                <strong>Teléfono Soporte</strong>
                +56 9 4888 2467
              </span>
            </a>
          </div>
        </section>

        <footer className="client-footer">
          <span>© 2026 DISCRET</span>
          <strong>DISCRECIÓN • CONFORT • PRIVACIDAD</strong>
          <button type="button" onClick={() => navigate('/login')}>
            Panel administrador
          </button>
        </footer>
      </div>
    </main>
  );
}

export default ClientLandingPage;
