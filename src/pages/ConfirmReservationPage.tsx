import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, Users } from 'lucide-react';

import ReservationSuccessModal from '../components/ReservationSuccessModal';
import { ApiError, api, getClientSession, type Reserva } from '../services/api';

import '../styles/confirmReservation.css';

type ReservationData = {
  people: number;
  roomType: string;
  habitacionId?: number;
  roomNumber?: string;
  roomPrice?: number;
  selectedHour: string;
  date: string;
  reservationDate?: string;
};

const parseHourToDate = (dateValue: string, selectedHour: string) => {
  const match = selectedHour.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  const baseDate = dateValue || new Date().toISOString().slice(0, 10);

  if (!match) {
    return new Date(`${baseDate}T12:00:00`);
  }

  const [, hourValue, minuteValue, periodValue] = match;
  const period = periodValue.toLowerCase();
  let hour = Number(hourValue);

  if (period === 'pm' && hour !== 12) {
    hour += 12;
  }

  if (period === 'am' && hour === 12) {
    hour = 0;
  }

  const normalizedHour = String(hour).padStart(2, '0');

  return new Date(`${baseDate}T${normalizedHour}:${minuteValue}:00`);
};

const formatHour = (date: Date) => {
  const formattedHour = date.getHours();
  const displayPeriod = formattedHour >= 12 ? 'pm' : 'am';
  const displayHour = formattedHour % 12 || 12;
  const displayMinute = date.getMinutes().toString().padStart(2, '0');

  return `${displayHour}:${displayMinute} ${displayPeriod}`;
};

const toApiDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

function ConfirmReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state as ReservationData | null;

  const clientSession = useMemo(() => getClientSession(), []);
  const [name, setName] = useState(clientSession?.nombre ?? '');
  const [lastName, setLastName] = useState(clientSession?.apellido ?? '');
  const [phone, setPhone] = useState(clientSession?.telefono?.replace(/^\+?56\s?/, '') ?? '');
  const [email, setEmail] = useState(clientSession?.correo ?? '');
  const [comment, setComment] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedReservation, setSavedReservation] = useState<Reserva | null>(null);

  useEffect(() => {
    if (!clientSession) {
      return;
    }

    setName(clientSession.nombre);
    setLastName(clientSession.apellido);
    setPhone(clientSession.telefono.replace(/^\+?56\s?/, ''));
    setEmail(clientSession.correo);
  }, [clientSession]);

  const entryDate = parseHourToDate(
    reservation?.reservationDate ?? new Date().toISOString().slice(0, 10),
    reservation?.selectedHour ?? '',
  );
  const exitDate = new Date(entryDate);
  exitDate.setHours(exitDate.getHours() + 3);
  const checkoutHour = formatHour(exitDate);

  if (!reservation) {
    return (
      <main className="confirm-page">
        <section className="confirm-empty">
          <h1>No hay reserva para confirmar</h1>
          <p>Debes completar primero el formulario de reserva.</p>
          <button type="button" onClick={() => navigate('/reservas')}>
            Volver a reservar
          </button>
        </section>
      </main>
    );
  }

  const handleConfirmReservation = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!reservation.habitacionId) {
      setValidationMessage('Debes volver a seleccionar una habitación disponible.');
      return;
    }

    if (!name || !lastName || !phone || !email) {
      setValidationMessage('Debes completar nombre, apellido, teléfono y correo electrónico.');
      return;
    }

    setValidationMessage('');
    setIsSaving(true);

    try {
      const createdReservation = await api.crearReserva({
        cliente_id: clientSession?.id ?? null,
        habitacion_id: reservation.habitacionId,
        nombre_cliente: `${name.trim()} ${lastName.trim()}`.trim(),
        telefono_cliente: `+56 ${phone.trim()}`,
        correo_cliente: email.trim(),
        cantidad_personas: reservation.people,
        fecha_entrada: toApiDateTime(entryDate),
        fecha_salida: toApiDateTime(exitDate),
        estado: 'confirmada',
        tipo_pago: 'efectivo',
        comentario: comment.trim() || null,
      });

      setSavedReservation(createdReservation);
      setShowSuccessModal(true);
    } catch (error) {
      if (error instanceof ApiError) {
        const firstFieldError = error.errors
          ? Object.values(error.errors).flat()[0]
          : null;

        setValidationMessage(firstFieldError ?? error.message);
        return;
      }

      setValidationMessage('No se pudo guardar la reserva en la base de datos. Intenta nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="confirm-page">
      <section className="confirm-container">
        <header className="confirm-header">
          <button
            type="button"
            onClick={() => navigate('/reservas')}
          >
            ← Volver
          </button>

          <div>
            <h1>Confirmar reserva</h1>
            <p>Completa tus datos y revisa la información antes de finalizar.</p>
          </div>
        </header>

        <section className="confirm-logo">
          <h2>DISCRET</h2>
          <p>DISCRECIÓN • CONFORT • PRIVACIDAD</p>
        </section>

        <section className="confirm-summary-bar">
          <article>
            <span className="confirm-summary-icon">
              <Users size={26} strokeWidth={2.3} />
            </span>

            <strong>
              {reservation.people}{' '}
              {reservation.people === 1 ? 'Persona' : 'Personas'}
            </strong>
          </article>

          <article>
            <span className="confirm-summary-icon">
              <CalendarDays size={26} strokeWidth={2.3} />
            </span>

            <strong>{reservation.date}</strong>
          </article>

          <article>
            <span className="confirm-summary-icon">
              <Clock3 size={26} strokeWidth={2.3} />
            </span>

            <strong>{reservation.selectedHour}</strong>
          </article>
        </section>

        <form onSubmit={handleConfirmReservation} noValidate>
          <section className="confirm-card">
            <h3>Datos del cliente</h3>

            {validationMessage && (
              <p className="confirm-validation-message">
                {validationMessage}
              </p>
            )}

            <div className="confirm-client-grid">
              <label>
                Nombre *
                <input
                  type="text"
                  placeholder="Ingrese nombre"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setValidationMessage('');
                  }}
                />
              </label>

              <label>
                Apellido *
                <input
                  type="text"
                  placeholder="Ingrese apellido"
                  value={lastName}
                  onChange={(event) => {
                    setLastName(event.target.value);
                    setValidationMessage('');
                  }}
                />
              </label>

              <label>
                Teléfono *
                <div className="confirm-phone-field">
                  <span>CL +56</span>
                  <input
                    type="tel"
                    placeholder="Ingrese celular"
                    value={phone}
                    onChange={(event) => {
                      setPhone(event.target.value);
                      setValidationMessage('');
                    }}
                  />
                </div>
              </label>

              <label>
                Correo electrónico *
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setValidationMessage('');
                  }}
                />
              </label>

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

          <section className="confirm-card">
            <h3>Resumen de la reserva</h3>

            <div className="confirm-grid">
              <div>
                <span>Habitación</span>
                <strong>
                  {reservation.roomNumber
                    ? `${reservation.roomType} · Hab. ${reservation.roomNumber}`
                    : reservation.roomType}
                </strong>
              </div>

              <div>
                <span>Horario de entrada</span>
                <strong>{reservation.selectedHour}</strong>
              </div>

              <div>
                <span>Horario de salida</span>
                <strong>{checkoutHour}</strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>
                  {name && lastName
                    ? `${name} ${lastName}`
                    : 'Pendiente por completar'}
                </strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>
                  {phone
                    ? `+56 ${phone}`
                    : 'Pendiente por completar'}
                </strong>
              </div>

              <div>
                <span>Correo electrónico</span>
                <strong>{email || 'Pendiente por completar'}</strong>
              </div>

              <div className="full">
                <span>Comentario</span>
                <strong>{comment || 'Sin comentarios adicionales'}</strong>
              </div>
            </div>
          </section>

          <section className="confirm-warning">
            <strong>Reserva confidencial</strong>
            <p>
              Tu información será utilizada únicamente para gestionar esta reserva.
            </p>
          </section>

          <section className="confirm-actions">
            <button
              type="button"
              onClick={() => navigate('/reservas')}
              disabled={isSaving}
            >
              ← Volver
            </button>

            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando reserva...' : '✓ Confirmar reserva'}
            </button>
          </section>
        </form>
      </section>

      <ReservationSuccessModal
        isOpen={showSuccessModal}
        reservation={reservation}
        checkoutHour={checkoutHour}
        reservationCode={savedReservation?.codigo_reserva}
        qrToken={savedReservation?.qr_token ?? undefined}
        client={{
          name,
          lastName,
          phone,
          email,
        }}
      />
    </main>
  );
}

export default ConfirmReservationPage;
