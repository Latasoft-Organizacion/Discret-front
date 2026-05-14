import { useNavigate } from 'react-router-dom';
import {ShieldCheck, Clock3,} from 'lucide-react';
import '../styles/reservationSuccessModal.css';

type Props = {
  isOpen: boolean;
};

function ReservationSuccessModal({ isOpen }: Props) {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="success-modal-overlay">
      <div className="success-modal-card">

        {/* Glow superior */}
        <div className="success-glow"></div>

        {/* Check animado */}
        <div className="success-check-wrapper">
          <div className="success-check-circle">✓</div>
        </div>

        {/* Logo */}
        <div className="success-logo">
          <h1>DISCRET</h1>
          <p>DISCRECIÓN • CONFORT • PRIVACIDAD</p>
        </div>

        {/* Texto principal */}
        <div className="success-content">
          <h2>¡Reserva confirmada!</h2>

          <p>Tu habitación ha sido reservada correctamente.</p>

          <strong>¡Te esperamos!</strong>
        </div>

        {/* Información adicional */}
         <div className="success-info-box">

         <div className="success-info-item">
         <ShieldCheck size={20} strokeWidth={2.2} />
          <span>Reserva 100% confidencial</span>
          </div>

         <div className="success-info-item">
         <Clock3 size={20} strokeWidth={2.2} />
         <span>Llega puntual a tu horario</span>
         </div>

          </div>

        {/* Botón volver */}
        <button
          type="button"
          className="success-home-btn"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>

      </div>
    </div>
  );
}

export default ReservationSuccessModal;