import '../styles/login.css';
import motelLogin from '../assets/images/motel-login.png';


function LoginPage() {
  return (
    <main className="login-layout">
     <section
  className="login-photo"
  style={{ backgroundImage: `linear-gradient(to right, rgba(6, 8, 15, 0.10), rgba(6, 8, 15, 0.75)), url(${motelLogin})` }}
>
       
      </section>

      <section className="login-content">
        <div className="login-card">
          <div className="icon-circle">🛏️</div>

          <h1>Sistema de Reservas</h1>
          <h3>Panel de Administración</h3>

          <div className="divider">
            <span>🔐</span>
          </div>

          <form>
            <label>Correo electrónico</label>
            <div className="input-group">
              <span>✉️</span>
              <input type="email" placeholder="admin@motel.com" />
            </div>

            <label>Contraseña</label>
            <div className="input-group">
              <span>🔒</span>
              <input type="password" placeholder="••••••••" />
              <button type="button" className="eye-btn">👁️</button>
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