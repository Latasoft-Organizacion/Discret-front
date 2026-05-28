import { useMemo, useState } from 'react';
import { Bed, Bell, Building2, MessageCircle, ShieldCheck, Star } from 'lucide-react';
import AdminBreadcrumb from '../components/AdminBreadcrumb';
import AdminToast, { type AdminToastType } from '../components/AdminToast';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/adminSidebar.css';
import '../styles/settings.css';

function SettingsPage() {
  const [whatsappSettings, setWhatsappSettings] = useState({
    number: '+56 9 4888 2467',
    status: 'Activo',
    message: 'Hola, tu reserva ha sido registrada correctamente.',
  });
  const [reservationPolicies, setReservationPolicies] = useState({
    arrivalTolerance: '15 minutos',
    automaticCancellation: '20 minutos',
    maxOccupationTime: '3 horas',
    timeBetweenReservations: '30 minutos',
  });
  const [securitySettings, setSecuritySettings] = useState({
    adminUser: 'Administrador',
    adminEmail: 'admin@motel.com',
    newPassword: '',
    confirmPassword: '',
  });
  const [scheduleSettings, setScheduleSettings] = useState({
    openingTime: '10:00',
    closingTime: '23:59',
    reservationDuration: '3 horas',
    cleaningTime: '30 minutos',
  });
  const [ratingSettings, setRatingSettings] = useState({
    enabled: 'Activo',
    sendDelay: '30 minutos',
    channel: 'Correo',
    message: 'Gracias por visitarnos. Queremos conocer tu experiencia en DISCRET.',
  });
  const [motelData, setMotelData] = useState({
    name: 'Discret',
    contactEmail: 'admin@discret.cl',
    phone: '+56 9 1234 5678',
    address: 'Santiago, Chile',
    businessName: 'Discret SpA',
    taxId: '77.777.777-7',
    city: 'Santiago',
    region: 'Región Metropolitana',
    supportEmail: 'discretchile@gmail.com',
    website: 'www.discret.cl',
  });
  const [systemPreferences, setSystemPreferences] = useState({
    darkMode: true,
    notifications: true,
    automaticConfirmation: false,
    occupancyLock: true,
    frequentClientPeriod: '3-meses',
  });
  const [saveMessage, setSaveMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [toastType, setToastType] = useState<AdminToastType>('success');

  const whatsappUrl = useMemo(() => {
    const cleanNumber = whatsappSettings.number.replace(/\D/g, '');
    const text = encodeURIComponent(whatsappSettings.message);

    return cleanNumber ? `https://wa.me/${cleanNumber}?text=${text}` : '#';
  }, [whatsappSettings.message, whatsappSettings.number]);

  const updateWhatsappSetting = (field: keyof typeof whatsappSettings, value: string) => {
    setWhatsappSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const updateReservationPolicy = (field: keyof typeof reservationPolicies, value: string) => {
    setReservationPolicies((currentPolicies) => ({
      ...currentPolicies,
      [field]: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const updateSecuritySetting = (field: keyof typeof securitySettings, value: string) => {
    setSecuritySettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const updateScheduleSetting = (field: keyof typeof scheduleSettings, value: string) => {
    setScheduleSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const updateRatingSetting = (field: keyof typeof ratingSettings, value: string) => {
    setRatingSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const updateMotelData = (field: keyof typeof motelData, value: string) => {
    setMotelData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const toggleSystemPreference = (
    field: Exclude<keyof typeof systemPreferences, 'frequentClientPeriod'>,
  ) => {
    setSystemPreferences((currentPreferences) => ({
      ...currentPreferences,
      [field]: !currentPreferences[field],
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const updateFrequentClientPeriod = (value: string) => {
    setSystemPreferences((currentPreferences) => ({
      ...currentPreferences,
      frequentClientPeriod: value,
    }));
    setSaveMessage('');
    setSettingsError('');
  };

  const saveSettings = () => {
    if (
      securitySettings.newPassword
      && securitySettings.newPassword !== securitySettings.confirmPassword
    ) {
      setSaveMessage('');
      setSettingsError('Las contraseñas no coinciden.');
      setToastType('error');
      return;
    }

    setSettingsError('');
    setSaveMessage('Configuración guardada correctamente.');
    setToastType('success');
  };

  const undoSettings = () => {
    setWhatsappSettings({
      number: '+56 9 4888 2467',
      status: 'Activo',
      message: 'Hola, tu reserva ha sido registrada correctamente.',
    });
    setReservationPolicies({
      arrivalTolerance: '15 minutos',
      automaticCancellation: '20 minutos',
      maxOccupationTime: '3 horas',
      timeBetweenReservations: '30 minutos',
    });
    setSecuritySettings({
      adminUser: 'Administrador',
      adminEmail: 'admin@motel.com',
      newPassword: '',
      confirmPassword: '',
    });
    setScheduleSettings({
      openingTime: '10:00',
      closingTime: '23:59',
      reservationDuration: '3 horas',
      cleaningTime: '30 minutos',
    });
    setRatingSettings({
      enabled: 'Activo',
      sendDelay: '30 minutos',
      channel: 'Correo',
      message: 'Gracias por visitarnos. Queremos conocer tu experiencia en DISCRET.',
    });
    setMotelData({
      name: 'Discret',
      contactEmail: 'admin@discret.cl',
      phone: '+56 9 1234 5678',
      address: 'Santiago, Chile',
      businessName: 'Discret SpA',
      taxId: '77.777.777-7',
      city: 'Santiago',
      region: 'Región Metropolitana',
      supportEmail: 'discretchile@gmail.com',
      website: 'www.discret.cl',
    });
    setSystemPreferences({
      darkMode: true,
      notifications: true,
      automaticConfirmation: false,
      occupancyLock: true,
      frequentClientPeriod: '3-meses',
    });
    setSettingsError('');
    setSaveMessage('Cambios deshechos correctamente.');
    setToastType('info');
  };

  return (
    <>
    <AdminSidebar active="configuracion" />
    <main className="settings-page">

      {/* Header superior */}
      <header className="settings-top">
        <div>
          <AdminBreadcrumb current="Configuración" />
          <h1>Configuración</h1>
          <p>Ajustes generales del sistema de reservas</p>
        </div>
      </header>

      {/* Resumen superior */}
      <section className="settings-summary">
        <article>
          <span className="settings-summary-icon pink">
            <Building2 size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>Discret</strong>
            <p>Nombre del sistema</p>
          </div>
        </article>

        <article>
          <span className="settings-summary-icon blue">
            <Bed size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>4</strong>
            <p>Habitaciones activas</p>
          </div>
        </article>

        <article>
          <span className="settings-summary-icon soft">
            <Bell size={22} strokeWidth={2.4} />
          </span>
          <div>
            <strong>Activo</strong>
            <p>Notificaciones</p>
          </div>
        </article>

        <article>
          <span className="settings-summary-icon green">
            <ShieldCheck size={22} strokeWidth={2.4} />
          </span>
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
      <input
        type="tel"
        value={whatsappSettings.number}
        onChange={(event) => updateWhatsappSetting('number', event.target.value)}
      />
    </label>

    <label>
      Estado
      <select
        value={whatsappSettings.status}
        onChange={(event) => updateWhatsappSetting('status', event.target.value)}
      >
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </label>

    <label className="full-width">
      Mensaje automático
      <input
        type="text"
        value={whatsappSettings.message}
        onChange={(event) => updateWhatsappSetting('message', event.target.value)}
      />
    </label>
  </div>

  <div className="settings-whatsapp-preview">
    <span className="settings-whatsapp-icon">
      <MessageCircle size={18} strokeWidth={2.5} />
    </span>

    <div>
      <strong>Vista previa</strong>
      <p>{whatsappSettings.message}</p>
    </div>

    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className={whatsappSettings.status === 'Activo' ? '' : 'disabled'}
      aria-disabled={whatsappSettings.status !== 'Activo'}
    >
      Probar WhatsApp
    </a>
  </div>
</article>

{/* Políticas de reserva */}
<article className="settings-card">
  <h2>Políticas de reserva</h2>
  <p>Reglas generales para el uso de habitaciones.</p>

  <div className="settings-form">
    <label>
      Tolerancia llegada
      <select
        value={reservationPolicies.arrivalTolerance}
        onChange={(event) => updateReservationPolicy('arrivalTolerance', event.target.value)}
      >
        <option value="10 minutos">10 minutos</option>
        <option value="15 minutos">15 minutos</option>
        <option value="20 minutos">20 minutos</option>
        <option value="30 minutos">30 minutos</option>
      </select>
    </label>

    <label>
      Cancelación automática
      <select
        value={reservationPolicies.automaticCancellation}
        onChange={(event) => updateReservationPolicy('automaticCancellation', event.target.value)}
      >
        <option value="15 minutos">15 minutos</option>
        <option value="20 minutos">20 minutos</option>
        <option value="30 minutos">30 minutos</option>
        <option value="45 minutos">45 minutos</option>
        <option value="1 hora">1 hora</option>
      </select>
    </label>

    <label>
      Tiempo máximo ocupación
      <select
        value={reservationPolicies.maxOccupationTime}
        onChange={(event) => updateReservationPolicy('maxOccupationTime', event.target.value)}
      >
        <option value="2 horas">2 horas</option>
        <option value="3 horas">3 horas</option>
        <option value="4 horas">4 horas</option>
        <option value="6 horas">6 horas</option>
      </select>
    </label>

    <label>
      Tiempo entre reservas
      <select
        value={reservationPolicies.timeBetweenReservations}
        onChange={(event) => updateReservationPolicy('timeBetweenReservations', event.target.value)}
      >
        <option value="15 minutos">15 minutos</option>
        <option value="30 minutos">30 minutos</option>
        <option value="45 minutos">45 minutos</option>
        <option value="1 hora">1 hora</option>
      </select>
    </label>
  </div>

  <div className="settings-policy-summary">
    <strong>Resumen aplicado</strong>
    <p>
      Llegada con {reservationPolicies.arrivalTolerance} de tolerancia,
      cancelación a los {reservationPolicies.automaticCancellation},
      uso máximo de {reservationPolicies.maxOccupationTime} y
      {reservationPolicies.timeBetweenReservations} entre reservas.
    </p>
  </div>
</article>

{/* Valoraciones */}
<article className="settings-card">
  <h2>Valoraciones post-salida</h2>
  <p>EnvÃ­o automÃ¡tico de encuesta al cliente tras finalizar su estadÃ­a.</p>

  <div className="settings-form">
    <label>
      Estado
      <select
        value={ratingSettings.enabled}
        onChange={(event) => updateRatingSetting('enabled', event.target.value)}
      >
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </label>

    <label>
      Enviar despuÃ©s de
      <select
        value={ratingSettings.sendDelay}
        onChange={(event) => updateRatingSetting('sendDelay', event.target.value)}
      >
        <option value="15 minutos">15 minutos</option>
        <option value="30 minutos">30 minutos</option>
        <option value="45 minutos">45 minutos</option>
        <option value="1 hora">1 hora</option>
      </select>
    </label>

    <label>
      Canal
      <select
        value={ratingSettings.channel}
        onChange={(event) => updateRatingSetting('channel', event.target.value)}
      >
        <option value="Correo">Correo</option>
        <option value="WhatsApp">WhatsApp</option>
        <option value="Correo y WhatsApp">Correo y WhatsApp</option>
      </select>
    </label>

    <label className="full-width">
      Mensaje de invitaciÃ³n
      <input
        type="text"
        value={ratingSettings.message}
        onChange={(event) => updateRatingSetting('message', event.target.value)}
      />
    </label>
  </div>

  <div className="settings-rating-preview">
    <span>
      <Star size={18} strokeWidth={2.5} />
    </span>
    <div>
      <strong>Regla activa</strong>
      <p>
        {ratingSettings.enabled === 'Activo'
          ? `Enviar valoraciÃ³n por ${ratingSettings.channel.toLowerCase()} ${ratingSettings.sendDelay} despuÃ©s de la salida.`
          : 'El envÃ­o automÃ¡tico de valoraciones estÃ¡ inactivo.'}
      </p>
    </div>
  </div>
</article>

        {/* Datos del motel */}
        <article className="settings-card">
          <h2>Datos del motel</h2>
          <p>Información principal mostrada en el sistema.</p>

          <div className="settings-form">
            <label>
              Nombre del motel
              <input
                type="text"
                value={motelData.name}
                onChange={(event) => updateMotelData('name', event.target.value)}
              />
            </label>

            <label>
              Correo de contacto
              <input
                type="email"
                value={motelData.contactEmail}
                onChange={(event) => updateMotelData('contactEmail', event.target.value)}
              />
            </label>

            <label>
              Teléfono
              <input
                type="tel"
                value={motelData.phone}
                onChange={(event) => updateMotelData('phone', event.target.value)}
              />
            </label>

            <label>
              Dirección
              <input
                type="text"
                value={motelData.address}
                onChange={(event) => updateMotelData('address', event.target.value)}
              />
            </label>

            <label>
              Razón social
              <input
                type="text"
                value={motelData.businessName}
                onChange={(event) => updateMotelData('businessName', event.target.value)}
              />
            </label>

            <label>
              RUT empresa
              <input
                type="text"
                value={motelData.taxId}
                onChange={(event) => updateMotelData('taxId', event.target.value)}
              />
            </label>

            <label>
              Ciudad
              <input
                type="text"
                value={motelData.city}
                onChange={(event) => updateMotelData('city', event.target.value)}
              />
            </label>

            <label>
              Región
              <input
                type="text"
                value={motelData.region}
                onChange={(event) => updateMotelData('region', event.target.value)}
              />
            </label>

            <label>
              Correo soporte
              <input
                type="email"
                value={motelData.supportEmail}
                onChange={(event) => updateMotelData('supportEmail', event.target.value)}
              />
            </label>

            <label>
              Sitio web
              <input
                type="text"
                value={motelData.website}
                onChange={(event) => updateMotelData('website', event.target.value)}
              />
            </label>
          </div>

          <div className="settings-policy-summary">
            <strong>Ficha del motel</strong>
            <p>
              {motelData.name || 'Motel sin nombre'} opera en {motelData.city || 'ciudad pendiente'},
              con contacto principal {motelData.contactEmail || 'sin correo'} y soporte
              {' '}
              {motelData.supportEmail || 'pendiente por completar'}.
            </p>
          </div>
        </article>

        {/* Preferencias */}
        <article className="settings-card">
          <h2>Preferencias del sistema</h2>
          <p>Configuración visual y operativa del panel.</p>

          <div className="settings-options">
            <div>
              <span>Modo oscuro</span>
              <button
                type="button"
                className={`switch ${systemPreferences.darkMode ? 'active' : ''}`}
                onClick={() => toggleSystemPreference('darkMode')}
              >
                {systemPreferences.darkMode ? 'Activo' : 'Inactivo'}
              </button>
            </div>

            <div>
              <span>Notificaciones</span>
              <button
                type="button"
                className={`switch ${systemPreferences.notifications ? 'active' : ''}`}
                onClick={() => toggleSystemPreference('notifications')}
              >
                {systemPreferences.notifications ? 'Activo' : 'Inactivo'}
              </button>
            </div>

            <div>
              <span>Confirmación automática</span>
              <button
                type="button"
                className={`switch ${systemPreferences.automaticConfirmation ? 'active' : ''}`}
                onClick={() => toggleSystemPreference('automaticConfirmation')}
              >
                {systemPreferences.automaticConfirmation ? 'Activo' : 'Inactivo'}
              </button>
            </div>

            <div>
              <span>Bloqueo por ocupación</span>
              <button
                type="button"
                className={`switch ${systemPreferences.occupancyLock ? 'active' : ''}`}
                onClick={() => toggleSystemPreference('occupancyLock')}
              >
                {systemPreferences.occupancyLock ? 'Activo' : 'Inactivo'}
              </button>
            </div>

            <label className="settings-option-field">
              Cliente frecuente cada
              <select
                value={systemPreferences.frequentClientPeriod}
                onChange={(event) => updateFrequentClientPeriod(event.target.value)}
              >
                <option value="1-mes">1 mes</option>
                <option value="2-meses">2 meses</option>
                <option value="3-meses">3 meses</option>
                <option value="6-meses">6 meses</option>
                <option value="1-ano">1 año</option>
                <option value="siempre">Siempre que tenga visitas</option>
              </select>
            </label>
          </div>

          <div className="settings-policy-summary">
            <strong>Preferencias activas</strong>
            <p>
              Modo oscuro {systemPreferences.darkMode ? 'activo' : 'inactivo'},
              notificaciones {systemPreferences.notifications ? 'activas' : 'inactivas'},
              confirmación automática {systemPreferences.automaticConfirmation ? 'activa' : 'inactiva'}
              {' '}
              y bloqueo por ocupación {systemPreferences.occupancyLock ? 'activo' : 'inactivo'}.
            </p>
          </div>
        </article>

        {/* Seguridad */}
        <article className="settings-card">
          <h2>Seguridad</h2>
          <p>Opciones básicas para el acceso administrativo.</p>

          <div className="settings-form">
            <label>
              Usuario administrador
              <input
                type="text"
                value={securitySettings.adminUser}
                onChange={(event) => updateSecuritySetting('adminUser', event.target.value)}
              />
            </label>

            <label>
              Correo administrador
              <input
                type="email"
                value={securitySettings.adminEmail}
                onChange={(event) => updateSecuritySetting('adminEmail', event.target.value)}
              />
            </label>

            <label>
              Nueva contraseña
              <input
                type="password"
                value={securitySettings.newPassword}
                onChange={(event) => updateSecuritySetting('newPassword', event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <label>
              Confirmar contraseña
              <input
                type="password"
                value={securitySettings.confirmPassword}
                onChange={(event) => updateSecuritySetting('confirmPassword', event.target.value)}
                placeholder="••••••••"
              />
            </label>
          </div>

          <div className="settings-policy-summary">
            <strong>Acceso configurado</strong>
            <p>
              Usuario {securitySettings.adminUser || 'sin nombre'} con correo
              {' '}
              {securitySettings.adminEmail || 'pendiente por completar'}.
              {' '}
              {securitySettings.newPassword
                ? 'La contraseña se actualizará al guardar.'
                : 'La contraseña actual se mantiene sin cambios.'}
            </p>
          </div>
        </article>

        {/* Horarios */}
        <article className="settings-card">
          <h2>Horarios y reservas</h2>
          <p>Parámetros generales para el flujo de reservas.</p>

          <div className="settings-form">
            <label>
              Hora apertura
              <input
                type="time"
                value={scheduleSettings.openingTime}
                onChange={(event) => updateScheduleSetting('openingTime', event.target.value)}
              />
            </label>

            <label>
              Hora cierre
              <input
                type="time"
                value={scheduleSettings.closingTime}
                onChange={(event) => updateScheduleSetting('closingTime', event.target.value)}
              />
            </label>

            <label>
              Duración reserva
              <select
                value={scheduleSettings.reservationDuration}
                onChange={(event) => updateScheduleSetting('reservationDuration', event.target.value)}
              >
                <option value="2 horas">2 horas</option>
                <option value="3 horas">3 horas</option>
                <option value="4 horas">4 horas</option>
                <option value="6 horas">6 horas</option>
              </select>
            </label>

            <label>
              Tiempo de limpieza
              <select
                value={scheduleSettings.cleaningTime}
                onChange={(event) => updateScheduleSetting('cleaningTime', event.target.value)}
              >
                <option value="15 minutos">15 minutos</option>
                <option value="30 minutos">30 minutos</option>
                <option value="45 minutos">45 minutos</option>
                <option value="1 hora">1 hora</option>
              </select>
            </label>
          </div>

          <div className="settings-policy-summary">
            <strong>Horario operativo</strong>
            <p>
              Atención desde {scheduleSettings.openingTime} hasta {scheduleSettings.closingTime},
              reservas de {scheduleSettings.reservationDuration} y
              {' '}
              {scheduleSettings.cleaningTime} para limpieza entre usos.
            </p>
          </div>
        </article>

      </section>

      <section className="settings-actions-bar" aria-label="Acciones de configuración">
        <div>
          <strong>Guardar configuración</strong>
          <p>Aplica o descarta los cambios realizados en esta página.</p>
        </div>

        <div className="settings-actions-buttons">
          <button type="button" className="settings-undo-button" onClick={undoSettings}>
            Deshacer cambios
          </button>
          <button type="button" className="settings-save-button" onClick={saveSettings}>
            Guardar cambios
          </button>
        </div>
      </section>

      <AdminToast
        message={settingsError || saveMessage}
        type={settingsError ? 'error' : toastType}
        onClose={() => {
          setSaveMessage('');
          setSettingsError('');
        }}
      />

    </main>
    </>
  );
}

export default SettingsPage;
