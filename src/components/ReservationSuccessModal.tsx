import { useNavigate } from 'react-router-dom';
import { Clock3, Mail, QrCode, ShieldCheck } from 'lucide-react';

import '../styles/reservationSuccessModal.css';

type Props = {
  isOpen: boolean;
  reservation: {
    roomType: string;
    date: string;
    selectedHour: string;
  };
  client: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
  };
  checkoutHour: string;
};

function ReservationSuccessModal({
  isOpen,
  reservation,
  client,
  checkoutHour,
}: Props) {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const clientFullName = `${client.name} ${client.lastName}`.trim();
  const reservationId = `DIS-${reservation.date.replace(/\W/g, '').slice(-6)}-${reservation.selectedHour.replace(/\W/g, '')}`;
  const accessPayload = [
    'DISCRET - COMPROBANTE DE RESERVA',
    `ID reserva: ${reservationId}`,
    `Cliente: ${clientFullName}`,
    `Habitacion: ${reservation.roomType}`,
    `Fecha: ${reservation.date}`,
    `Entrada: ${reservation.selectedHour}`,
    `Salida: ${checkoutHour}`,
    `Telefono: +56 ${client.phone}`,
    `Correo: ${client.email}`,
  ].join('\n');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=14&data=${encodeURIComponent(accessPayload)}`;
  const mailSubject = encodeURIComponent('Comprobante de reserva DISCRET');
  const mailBody = encodeURIComponent(
    `${accessPayload}\n\nPresenta este comprobante o QR en porteria al momento de ingresar al motel.`
  );
  const mailToClient = `mailto:${client.email}?subject=${mailSubject}&body=${mailBody}`;

  return (
    <div
      className="success-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
      aria-describedby="success-description"
    >
      <div className="success-modal-card">
        <div className="success-glow"></div>

        <div className="success-check-wrapper">
          <div className="success-check-circle">✓</div>
        </div>

        <div className="success-logo">
          <h1>DISCRET</h1>
          <p>DISCRECIÓN • CONFORT • PRIVACIDAD</p>
        </div>

        <div className="success-content">
          <h2 id="success-title">¡Reserva confirmada!</h2>
          <p id="success-description">Tu habitación ha sido reservada correctamente.</p>
          <strong>¡Te esperamos!</strong>
        </div>

        <section className="success-access-pass">
          <div className="success-access-copy">
            <span>
              <QrCode size={18} strokeWidth={2.4} />
              QR de ingreso
            </span>
            <p>
              Presenta este comprobante en portería al momento de entrar al motel.
            </p>
          </div>

          <div className="success-access-content">
            <div className="success-qr-frame">
              <img src={qrUrl} alt="QR de ingreso para presentar en portería" />
            </div>

            <div className="success-access-details">
              <div>
                <span>ID reserva</span>
                <strong>{reservationId}</strong>
              </div>

              <div>
                <span>Cliente</span>
                <strong>{clientFullName}</strong>
              </div>

              <div>
                <span>Habitación</span>
                <strong>{reservation.roomType}</strong>
              </div>

              <div>
                <span>Entrada</span>
                <strong>{reservation.selectedHour}</strong>
              </div>

              <div>
                <span>Salida</span>
                <strong>{checkoutHour}</strong>
              </div>
            </div>
          </div>

          <a className="success-email-btn" href={mailToClient}>
            <Mail size={18} strokeWidth={2.4} />
            Enviar comprobante al correo
          </a>
        </section>

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

        <button
          type="button"
          className="success-home-btn"
          aria-label="Volver al inicio de DISCRET"
          onClick={() => navigate('/')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default ReservationSuccessModal;
