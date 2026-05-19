import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRound } from 'lucide-react';
import '../styles/reservations.css';

function ReservationsPage() {
  // Permite navegar entre páginas
  const navigate = useNavigate();

  // Cantidad de personas seleccionada
  const [people, setPeople] = useState(1);

  // Tipo de habitación seleccionada
  const [roomType, setRoomType] = useState('');

  // Horario seleccionado
  const [selectedHour, setSelectedHour] = useState('');

  // Tipos de habitación disponibles
  const roomTypes = [
    'Habitación estándar',
    'Habitación premium',
    'Suite con jacuzzi',
    'Suite temática',
  ];

  // Horarios disponibles
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

  // Valida la selección y envía los datos a la ventana de confirmación
  const handleContinueReservation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!people || !roomType || !selectedHour) {
      alert('Debes seleccionar cantidad de personas, habitación y horario.');
      return;
    }

    navigate('/confirmar-reserva', {
      state: {
        people,
        roomType,
        selectedHour,
        date: 'Vie, May 15',
      },
    });
  };

  return (
    <main className="client-reservation-page">
      {/* Header superior */}
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

      {/* Título principal */}
      <section className="client-reservation-title">
        <h1>Nueva Reserva</h1>
        <p>Selecciona los datos principales de tu reserva.</p>
      </section>

      {/* Logo central */}
      <section className="client-reservation-logo">
        <h2>DISCRET</h2>
        <p>DISCRECIÓN • CONFORT • PRIVACIDAD</p>
      </section>

      {/* Formulario principal */}
      <form onSubmit={handleContinueReservation} noValidate>
        <section className="client-reservation-card">
          {/* Cantidad de personas */}
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
                  onClick={() => setPeople(number)}
                >
                  <UserRound size={22} strokeWidth={2.4} />

                   <span>
                   {number} {number === 1 ? 'Persona' : 'Personas'}
                    </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de habitación */}
          <div className="client-form-group full">
            <label>
              Tipo de habitación <span>*</span>
            </label>

            <select
              value={roomType}
              onChange={(event) => setRoomType(event.target.value)}
            >
              <option value="">Selecciona el tipo de habitación</option>

              {roomTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Horas disponibles */}
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
                  onClick={() => setSelectedHour(hour)}
                >
                  {hour}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Botones inferiores */}
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
