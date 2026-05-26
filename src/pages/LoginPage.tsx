import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import motelLogin from '../assets/images/motel-login.png';
import { Bed, CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, Mail, Send, X } from 'lucide-react';


function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const openRecovery = () => {
    setRecoverySent(false);
    setIsRecoveryOpen(true);
  };

  const closeRecovery = () => {
    setIsRecoveryOpen(false);
    setRecoveryEmail('');
    setRecoverySent(false);
  };

  const handleRecoverySubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!recoveryEmail.trim()) {
      return;
    }

    setRecoverySent(true);
  };

  return (
    <main className="login-layout">
     <section
  className="login-photo"
  style={{ backgroundImage: `linear-gradient(to right, rgba(6, 8, 15, 0.10), rgba(6, 8, 15, 0.75)), url(${motelLogin})` }}
>
       
      </section>

      <section className="login-content">
        <div className="login-card">
          <div className="icon-circle">
            <Bed size={34} strokeWidth={2.2} />
          </div>

          <h1>DISCRET</h1>
          <h3>Iniciar sesión</h3>

          <div className="divider">
            <span>
              <KeyRound size={18} strokeWidth={2.5} />
            </span>
          </div>

          <form>
            <label>Correo electrónico</label>
            <div className="input-group">
              <span>
                <Mail size={18} strokeWidth={2.3} />
              </span>
              <input type="email" placeholder="correo@ejemplo.com" />
            </div>

            <label>Contraseña</label>
            <div className="input-group">
              <span>
                <LockKeyhole size={18} strokeWidth={2.3} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="eye-btn"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2.3} />
                ) : (
                  <Eye size={18} strokeWidth={2.3} />
                )}
              </button>
            </div>

            <div className="login-options">
              <label className="remember">
                <input type="checkbox" defaultChecked />
                <span>Recordarme</span>
              </label>

              <button
                type="button"
                className="forgot-password-btn"
                onClick={openRecovery}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
            <div className="login-register-callout">
              <span>¿No tienes cuenta?</span>
              <button type="button" onClick={() => navigate('/registro')}>
                Registrarse
              </button>
            </div>
          </form>
        </div>

        <div className="login-footer">
          <p>Acceso exclusivo para administradores</p>
          <p>© 2026 Sistema de Reservas para Moteles</p>
        </div>
      </section>

      {isRecoveryOpen && (
        <div className="recovery-overlay" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
          <section className="recovery-modal">
            <button
              type="button"
              className="recovery-close"
              aria-label="Cerrar recuperación de contraseña"
              onClick={closeRecovery}
            >
              <X size={20} strokeWidth={2.4} />
            </button>

            <div className="recovery-icon">
              {recoverySent ? (
                <CheckCircle2 size={34} strokeWidth={2.3} />
              ) : (
                <KeyRound size={34} strokeWidth={2.3} />
              )}
            </div>

            <h2 id="recovery-title">
              {recoverySent ? 'Solicitud enviada' : 'Recuperar contraseña'}
            </h2>

            <p>
              {recoverySent
                ? 'Si el correo existe en el sistema, recibirás las instrucciones para restablecer tu acceso.'
                : 'Ingresa el correo asociado al panel administrador para recibir las instrucciones de recuperación.'}
            </p>

            {!recoverySent ? (
              <form className="recovery-form" onSubmit={handleRecoverySubmit}>
                <label htmlFor="recovery-email">Correo electrónico</label>
                <div className="input-group">
                  <span>
                    <Mail size={18} strokeWidth={2.3} />
                  </span>
                  <input
                    id="recovery-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={recoveryEmail}
                    onChange={(event) => setRecoveryEmail(event.target.value)}
                  />
                </div>

                <button type="submit" className="recovery-submit">
                  <Send size={18} strokeWidth={2.4} />
                  Enviar instrucciones
                </button>
              </form>
            ) : (
              <button type="button" className="recovery-submit" onClick={closeRecovery}>
                Entendido
              </button>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default LoginPage;
