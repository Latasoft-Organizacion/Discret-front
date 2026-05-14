import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ReservationSuccessModal from '../components/ReservationSuccessModal';

import '../styles/confirmReservation.css';

type ReservationData = {
  people: number;
  roomType: string;
  selectedHour: string;
  date: string;
};

function ConfirmReservationPage() {

  // Navegación entre páginas
  const navigate = useNavigate();

  // Obtiene datos enviados desde /reservar
  const location = useLocation();

  // Datos reserva
  const reservation = location.state as ReservationData | null;

  // Datos cliente
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');

  // Estado modal éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Si no existen datos de reserva
  if (!reservation) {

    return (

      <main className="confirm-page">

        <section className="confirm-empty">

          <h1>
            No hay reserva para confirmar
          </h1>

          <p>
            Debes completar primero el formulario de reserva.
          </p>

          <button
            type="button"
            onClick={() => navigate('/reservas')}
          >
            Volver a reservar
          </button>

        </section>

      </main>

    );

  }


  // Confirmar reserva
  const handleConfirmReservation = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {

    // Evita recarga
    event.preventDefault();

    // Validación básica
    if (!name || !lastName || !phone || !email) {

      alert('Debes completar los datos del cliente.');

      return;
    }

    // Abre modal animado
    setShowSuccessModal(true);

  };


  return (

    <main className="confirm-page">

      <section className="confirm-container">


        {/* ========================================
            HEADER SUPERIOR
        ======================================== */}

        <header className="confirm-header">

          <button
            type="button"
            onClick={() => navigate('/reservas')}
          >
            ← Volver
          </button>

          <div>

            <h1>
              Confirmar reserva
            </h1>

            <p>
              Completa tus datos y revisa la información antes de finalizar.
            </p>

          </div>

        </header>


        {/* ========================================
            LOGO
        ======================================== */}

        <section className="confirm-logo">

          <h2>
            DISCRET
          </h2>

          <p>
            DISCRECIÓN • CONFORT • PRIVACIDAD
          </p>

        </section>


        {/* ========================================
            RESUMEN SUPERIOR
        ======================================== */}

        <section className="confirm-summary-bar">

          <article>

            <span>👤</span>

            <strong>
              {reservation.people}{' '}
              {reservation.people === 1 ? 'Persona' : 'Personas'}
            </strong>

          </article>

          <article>

            <span>📅</span>

            <strong>
              {reservation.date}
            </strong>

          </article>

          <article>

            <span>🕒</span>

            <strong>
              {reservation.selectedHour}
            </strong>

          </article>

        </section>


        {/* ========================================
            FORMULARIO PRINCIPAL
        ======================================== */}

        <form
          onSubmit={handleConfirmReservation}
          noValidate
        >


          {/* ========================================
              DATOS CLIENTE
          ======================================== */}

          <section className="confirm-card">

            <h3>
              Datos del cliente
            </h3>

            <div className="confirm-client-grid">


              {/* Nombre */}
              <label>

                Nombre *

                <input
                  type="text"
                  placeholder="Ingrese nombre"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />

              </label>


              {/* Apellido */}
              <label>

                Apellido *

                <input
                  type="text"
                  placeholder="Ingrese apellido"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />

              </label>


              {/* Teléfono */}
              <label>

                Teléfono *

                <div className="confirm-phone-field">

                  <span>
                    CL +56
                  </span>

                  <input
                    type="tel"
                    placeholder="Ingrese celular"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                  />

                </div>

              </label>


              {/* Correo */}
              <label>

                Correo electrónico *

                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

              </label>


              {/* Comentario */}
              <label className="full">

                Comentario opcional

                <textarea
                  placeholder="Agrega comentarios o solicitudes especiales..."
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                />

              </label>

            </div>

          </section>


          {/* ========================================
              RESUMEN RESERVA
          ======================================== */}

          <section className="confirm-card">

            <h3>
              Resumen de la reserva
            </h3>

            <div className="confirm-grid">


              {/* Habitación */}
              <div>

                <span>
                  Habitación
                </span>

                <strong>
                  {reservation.roomType}
                </strong>

              </div>


              {/* Cliente */}
              <div>

                <span>
                  Cliente
                </span>

                <strong>
                  {name && lastName
                    ? `${name} ${lastName}`
                    : 'Pendiente por completar'}
                </strong>

              </div>


              {/* Teléfono */}
              <div>

                <span>
                  Teléfono
                </span>

                <strong>
                  {phone
                    ? `+56 ${phone}`
                    : 'Pendiente por completar'}
                </strong>

              </div>


              {/* Correo */}
              <div>

                <span>
                  Correo electrónico
                </span>

                <strong>
                  {email || 'Pendiente por completar'}
                </strong>

              </div>


              {/* Comentario */}
              <div className="full">

                <span>
                  Comentario
                </span>

                <strong>
                  {comment || 'Sin comentarios adicionales'}
                </strong>

              </div>

            </div>

          </section>


          {/* ========================================
              ALERTA PRIVACIDAD
          ======================================== */}

          <section className="confirm-warning">

            <strong>
              Reserva confidencial
            </strong>

            <p>
              Tu información será utilizada únicamente para gestionar esta reserva.
            </p>

          </section>


          {/* ========================================
              BOTONES INFERIORES
          ======================================== */}

          <section className="confirm-actions">

            <button
              type="button"
              onClick={() => navigate('/reservas')}
            >
              ← Volver
            </button>

            <button type="submit">
              ✓ Confirmar reserva
            </button>

          </section>

        </form>

      </section>


      {/* ========================================
          MODAL EXITO RESERVA
      ======================================== */}

      <ReservationSuccessModal
        isOpen={showSuccessModal}
      />

    </main>

  );
}

export default ConfirmReservationPage;