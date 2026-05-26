import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import '../styles/reservations.css';

function ClientRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    lastName: '',
    phone: '',
    email: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    isAdult: false,
  });
  const [message, setMessage] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setMessage('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.name ||
      !form.lastName ||
      !form.phone ||
      !form.email ||
      !form.birthDate ||
      !form.password ||
      !form.confirmPassword
    ) {
      setMessage('Completa todos los datos para crear tu registro.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    if (!form.isAdult) {
      setMessage('Debes autorizar que eres mayor de 18 años para continuar.');
      return;
    }

    setIsRegistered(true);
    setMessage('Registro creado correctamente. Ya puedes continuar con tu reserva.');
  };

  return (
    <main className="client-reservation-page client-register-page">
      <header className="client-reservation-header">
        <div className="client-breadcrumb">
          <button type="button" aria-label="Volver al inicio" onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </button>

          <span>Cliente</span>
          <small>/</small>
          <strong>Registro</strong>
        </div>

        <button type="button" className="client-back-btn" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </header>

      <section className="client-reservation-logo client-register-logo">
        <h2>DISCRET</h2>
        <p>DISCRECION - CONFORT - PRIVACIDAD</p>
      </section>

      <section className="client-register-shell">
        <div className="client-register-copy">
          <p className="client-register-kicker">Registro cliente</p>
          <h1>Crea tu acceso para reservar de forma privada</h1>
          <p>
            Ingresa tus datos principales. Luego podrás continuar al flujo de reserva
            y confirmar tu horario.
          </p>

          <div className="client-register-benefits">
            <span>
              <ShieldCheck size={18} />
              Registro privado
            </span>
            <span>
              <CheckCircle2 size={18} />
              Confirmacion simple
            </span>
          </div>
        </div>

        <form className="client-reservation-card client-register-card" onSubmit={handleSubmit} noValidate>
          <div className="client-form-grid">
            <label className="client-form-group">
              <span className="client-register-label">Nombre <strong>*</strong></span>
              <span className="client-input-icon">
                <UserRound size={18} />
                <input
                  type="text"
                  value={form.name}
                  placeholder="Ej: Juan"
                  autoComplete="given-name"
                  onChange={(event) => updateField('name', event.target.value)}
                />
              </span>
            </label>

            <label className="client-form-group">
              <span className="client-register-label">Apellido <strong>*</strong></span>
              <span className="client-input-icon">
                <UserRound size={18} />
                <input
                  type="text"
                  value={form.lastName}
                  placeholder="Ej: Perez"
                  autoComplete="family-name"
                  onChange={(event) => updateField('lastName', event.target.value)}
                />
              </span>
            </label>

            <label className="client-form-group">
              <span className="client-register-label">Teléfono <strong>*</strong></span>
              <span className="client-input-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  value={form.phone}
                  placeholder="+56 9 1234 5678"
                  autoComplete="tel"
                  onChange={(event) => updateField('phone', event.target.value)}
                />
              </span>
            </label>

            <label className="client-form-group">
              <span className="client-register-label">Correo <strong>*</strong></span>
              <span className="client-input-icon">
                <Mail size={18} />
                <input
                  type="email"
                  value={form.email}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </span>
            </label>

            <label className="client-form-group">
              <span className="client-register-label">Fecha de nacimiento <strong>*</strong></span>
              <span className="client-input-icon">
                <CalendarDays size={18} />
                <input
                  type="date"
                  value={form.birthDate}
                  autoComplete="bday"
                  onChange={(event) => updateField('birthDate', event.target.value)}
                />
              </span>
            </label>

            <label className="client-form-group">
              <span className="client-register-label">Contraseña <strong>*</strong></span>
              <span className="client-input-icon">
                <LockKeyhole size={18} />
                <input
                  type="password"
                  value={form.password}
                  placeholder="Crea una contraseña"
                  autoComplete="new-password"
                  onChange={(event) => updateField('password', event.target.value)}
                />
              </span>
            </label>

            <label className="client-form-group">
              <span className="client-register-label">Confirmar contraseña <strong>*</strong></span>
              <span className="client-input-icon">
                <LockKeyhole size={18} />
                <input
                  type="password"
                  value={form.confirmPassword}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                />
              </span>
            </label>
          </div>

          <div className="client-register-warning">
            <ShieldCheck size={18} />
            <p>
              Tus datos serán guardados de forma confidencial con el fin de gestionar
              tu reserva, verificar tu edad y contactarte sobre tu solicitud.
            </p>
          </div>

          <label className="client-register-check">
            <input
              type="checkbox"
              checked={form.isAdult}
              onChange={(event) => updateField('isAdult', event.target.checked)}
            />
            <span>Autorizo que soy mayor de 18 años.</span>
          </label>

          {message && (
            <p className={`client-reservation-message ${isRegistered ? 'is-success' : ''}`}>
              {message}
            </p>
          )}

          <div className="client-register-actions">
            <button type="button" className="cancel-reservation-btn" onClick={() => navigate('/')}>
              Cancelar
            </button>
            <button type={isRegistered ? 'button' : 'submit'} className="save-reservation-btn" onClick={isRegistered ? () => navigate('/reservas') : undefined}>
              {isRegistered ? 'Continuar a reservar' : 'Crear registro'}
            </button>
          </div>

          <div className="client-register-login-callout">
            <span>¿Ya tienes cuenta?</span>
            <button type="button" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </div>
        </form>
      </section>

      {isRegistered && (
        <section className="client-register-success" role="status" aria-live="polite">
          <div className="client-register-success-card">
            <div className="client-register-success-glow"></div>
            <div className="client-register-success-check">
              <CheckCircle2 size={58} strokeWidth={2.4} />
            </div>

            <div className="client-register-success-logo">
              <h2>DISCRET</h2>
              <p>DISCRECIÓN - CONFORT - PRIVACIDAD</p>
            </div>

            <div className="client-register-success-copy">
              <h3>¡Registro completado!</h3>
              <p>Tus datos fueron registrados correctamente.</p>
              <strong>Ya puedes continuar con tu reserva.</strong>
            </div>

            <div className="client-register-success-info">
              <span>
                <ShieldCheck size={18} />
                Datos tratados de forma confidencial
              </span>
              <span>
                <CheckCircle2 size={18} />
                Validación lista para reservar
              </span>
            </div>

            <div className="client-register-success-actions">
              <button
                type="button"
                className="save-reservation-btn"
                onClick={() => navigate('/reservas')}
              >
                Continuar a reservar
              </button>
              <button
                type="button"
                className="cancel-reservation-btn"
                onClick={() => navigate('/login')}
              >
                O iniciar sesión
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default ClientRegisterPage;
