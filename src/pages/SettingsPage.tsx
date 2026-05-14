import '../styles/settings.css';

function SettingsPage() {
  return (
    <main className="settings-page">

      {/* Header superior */}
      <header className="settings-top">
        <div>
          <h1>Configuración</h1>
          <p>Ajustes generales del sistema de reservas</p>
        </div>

        <button type="button">Guardar cambios</button>
      </header>

      {/* Resumen superior */}
      <section className="settings-summary">
        <article>
          <span>🏨</span>
          <div>
            <strong>Discret</strong>
            <p>Nombre del sistema</p>
          </div>
        </article>

        <article>
          <span>🛏️</span>
          <div>
            <strong>4</strong>
            <p>Habitaciones activas</p>
          </div>
        </article>

        <article>
          <span>🔔</span>
          <div>
            <strong>Activo</strong>
            <p>Notificaciones</p>
          </div>
        </article>

        <article>
          <span>🛡️</span>
          <div>
            <strong>Admin</strong>
            <p>Rol actual</p>
          </div>
        </article>
      </section>

      {/* Contenido configuración */}
      <section className="settings-content">

        {/* WhatsApp */}
<article className="settings-card">
  <h2>Configuración WhatsApp</h2>
  <p>Datos para contacto y confirmaciones de reservas.</p>

  <div className="settings-form">
    <label>
      Número WhatsApp
      <input type="text" defaultValue="+56 9 1234 5678" />
    </label>

    <label>
      Estado
      <input type="text" defaultValue="Activo" />
    </label>

    <label className="full-width">
      Mensaje automático
      <input
        type="text"
        defaultValue="Hola, tu reserva ha sido registrada correctamente."
      />
    </label>
  </div>
</article>

{/* Políticas de reserva */}
<article className="settings-card">
  <h2>Políticas de reserva</h2>
  <p>Reglas generales para el uso de habitaciones.</p>

  <div className="settings-form">
    <label>
      Tolerancia llegada
      <input type="text" defaultValue="15 minutos" />
    </label>

    <label>
      Cancelación automática
      <input type="text" defaultValue="20 minutos" />
    </label>

    <label>
      Tiempo máximo ocupación
      <input type="text" defaultValue="3 horas" />
    </label>

    <label>
      Tiempo entre reservas
      <input type="text" defaultValue="30 minutos" />
    </label>
  </div>
</article>

        {/* Datos del motel */}
        <article className="settings-card">
          <h2>Datos del motel</h2>
          <p>Información principal mostrada en el sistema.</p>

          <div className="settings-form">
            <label>
              Nombre del motel
              <input type="text" defaultValue="Discret" />
            </label>

            <label>
              Correo de contacto
              <input type="email" defaultValue="admin@discret.cl" />
            </label>

            <label>
              Teléfono
              <input type="text" defaultValue="+56 9 1234 5678" />
            </label>

            <label>
              Dirección
              <input type="text" defaultValue="Santiago, Chile" />
            </label>
          </div>
        </article>

        {/* Preferencias */}
        <article className="settings-card">
          <h2>Preferencias del sistema</h2>
          <p>Configuración visual y operativa del panel.</p>

          <div className="settings-options">
            <div>
              <span>Modo oscuro</span>
              <button type="button" className="switch active">Activo</button>
            </div>

            <div>
              <span>Notificaciones</span>
              <button type="button" className="switch active">Activo</button>
            </div>

            <div>
              <span>Confirmación automática</span>
              <button type="button" className="switch">Inactivo</button>
            </div>

            <div>
              <span>Bloqueo por ocupación</span>
              <button type="button" className="switch active">Activo</button>
            </div>
          </div>
        </article>

        {/* Seguridad */}
        <article className="settings-card">
          <h2>Seguridad</h2>
          <p>Opciones básicas para el acceso administrativo.</p>

          <div className="settings-form">
            <label>
              Usuario administrador
              <input type="text" defaultValue="Administrador" />
            </label>

            <label>
              Correo administrador
              <input type="email" defaultValue="admin@motel.com" />
            </label>

            <label>
              Nueva contraseña
              <input type="password" placeholder="••••••••" />
            </label>

            <label>
              Confirmar contraseña
              <input type="password" placeholder="••••••••" />
            </label>
          </div>
        </article>

        {/* Horarios */}
        <article className="settings-card">
          <h2>Horarios y reservas</h2>
          <p>Parámetros generales para el flujo de reservas.</p>

          <div className="settings-form">
            <label>
              Hora apertura
              <input type="time" defaultValue="10:00" />
            </label>

            <label>
              Hora cierre
              <input type="time" defaultValue="23:59" />
            </label>

            <label>
              Duración reserva
              <input type="text" defaultValue="3 horas" />
            </label>

            <label>
              Tiempo de limpieza
              <input type="text" defaultValue="30 minutos" />
            </label>
          </div>
        </article>

      </section>

    </main>
  );
}

export default SettingsPage;