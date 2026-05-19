import { useState } from 'react';
import '../styles/login.css';
import motelLogin from '../assets/images/motel-login.png';
import { Bed, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from 'lucide-react';


function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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
          <h3>Panel de Administración</h3>

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
              <input type="email" placeholder="admin@motel.com" />
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

              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>
        </div>

        <div className="login-footer">
          <p>Acceso exclusivo para administradores</p>
          <p>© 2026 Sistema de Reservas para Moteles</p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
