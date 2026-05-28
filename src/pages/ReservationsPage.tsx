import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';

import { api, type Habitacion } from '../services/api';

import '../styles/reservations.css';

const fallbackRoomTypes = [
  'Habitación estándar',
  'Habitación premium',
  'Suite con jacuzzi',
  'Suite temática',
];

const availableHours = [
  '12:30 pm',
  '1:00 pm',
  '1:30 pm',
  '2:00 pm',
  '2:30 pm',
  '3:00 pm',
  '3:30 pm',
  '4:00 pm',
  '4:30 pm',
  '5:00 pm',
  '5:30 pm',
  '6:00 pm',
  '6:30 pm',
  '7:00 pm',
  '7:30 pm',
  '8:00 pm',
  '8:30 pm',
];

const formatReservationDate = (date: Date) => {
  const formatted = new Intl.DateTimeFormat('es-CL', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function ReservationsPage() {
  const navigate = useNavigate();

  const [people, setPeople] = useState(1);
  const [roomType, setRoomType] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [rooms, setRooms] = useState<Habitacion[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [roomsMessage, setRoomsMessage] = useState('');

  const reservationDate = useMemo(() => new Date(), []);
  const displayDate = useMemo(() => formatReservationDate(reservationDate), [reservationDate]);
  const reservationDateValue = useMemo(() => toDateInputValue(reservationDate), [reservationDate]);

  useEffect(() => {
    let isMounted = true;

    api.listarHabitaciones()
      .then((habitaciones) => {
        if (!isMounted) {
          return;
        }

        setRooms(habitaciones.filter((habitacion) => habitacion.activa));
        setRoomsMessage('');
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setRoomsMessage('No se pudieron cargar las habitaciones desde la base. Intenta nuevamente en unos segundos.');
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingRooms(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const availableRooms = rooms.filter((habitacion) => habitacion.estado === 'disponible');

  const roomTypes = availableRooms.length > 0
    ? Array.from(
      new Set(
        availableRooms.map((habitacion) => (
          habitacion.tipo_habitacion?.nombre
          ?? habitacion.nombre
          ?? `Habitación ${habitacion.numero}`
        )),
      ),
    )
    : fallbackRoomTypes;

  const handleContinueReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!people || !roomType || !selectedHour) {
      setValidationMessage('Debes seleccionar cantidad de personas, habitación y horario.');
      return;
    }

    const selectedRoom = availableRooms.find((habitacion) => (
      (habitacion.tipo_habitacion?.nombre ?? habitacion.nombre) === roomType
    ));

    if (!selectedRoom) {
      setValidationMessage('No hay una habitación disponible para ese tipo en este momento.');
      return;
    }

    navigate('/confirmar-reserva', {
      state: {
        people,
        roomType,
        habitacionId: selectedRoom.id,
        roomNumber: selectedRoom.numero,
        roomPrice: selectedRoom.precio,
        selectedHour,
        date: displayDate,
        reservationDate: reservationDateValue,
      },
    });
  };

  return (
    <main className="client-reservation-page">
      <header className="client-reservation-header">
        <div className="client-breadcrumb">
          <button type="button" onClick={() => navigate('/')}>
            ←
          </button>

          <span>Reservas</span>
          <small>›</small>
          <strong>Nueva reserva</strong>
        </div>

        <button
          type="button"
          className="client-back-btn"
          onClick={() => navigate('/')}
        >
          ← Volver
        </button>
      </header>

      <section className="client-reservation-title">
        <h1>Nueva Reserva</h1>
        <p>Selecciona los datos principales de tu reserva.</p>
      </section>

      <section className="client-reservation-logo">
        <h2>DISCRET</h2>
        <p>DISCRECIÓN • CONFORT • PRIVACIDAD</p>
      </section>

      <form onSubmit={handleContinueReservation} noValidate>
        <section className="client-reservation-card">
          <div className="client-form-group full">
            <label>
              Cantidad de personas <span>*</span>
            </label>

            <div className="people-options">
              {[1, 2, 3].map((number) => (
                <button
                  type="button"
                  key={number}
                  className={people === number ? 'active' : ''}
                  onClick={() => {
                    setPeople(number);
                    setValidationMessage('');
                  }}
                >
                  <UserRound size={22} strokeWidth={2.4} />

                  <span>
                    {number} {number === 1 ? 'Persona' : 'Personas'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="client-form-group full">
            <label>
              Tipo de habitación <span>*</span>
            </label>

            <select
              value={roomType}
              onChange={(event) => {
                setRoomType(event.target.value);
                setValidationMessage('');
              }}
            >
              <option value="">Selecciona el tipo de habitación</option>

              {roomTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>

            {isLoadingRooms && (
              <small className="client-reservation-helper">
                Cargando habitaciones disponibles...
              </small>
            )}

            {roomsMessage && (
              <small className="client-reservation-helper">
                {roomsMessage}
              </small>
            )}
          </div>

          <div className="available-hours-section">
            <div className="hours-title">
              <span></span>
              <strong>HORAS DISPONIBLES</strong>
              <span></span>
            </div>

            <div className="available-hours-grid">
              {availableHours.map((hour) => (
                <button
                  type="button"
                  key={hour}
                  className={selectedHour === hour ? 'active' : ''}
                  onClick={() => {
                    setSelectedHour(hour);
                    setValidationMessage('');
                  }}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>
        </section>

        {validationMessage && (
          <p className="client-reservation-message">
            {validationMessage}
          </p>
        )}

        <section className="client-reservation-actions">
          <button
            type="button"
            className="cancel-reservation-btn"
            onClick={() => navigate('/')}
          >
            × Cancelar
          </button>

          <button type="submit" className="save-reservation-btn">
            ✓ Continuar reserva
          </button>
        </section>
      </form>
    </main>
  );
}

export default ReservationsPage;
