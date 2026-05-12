import { useState, useEffect } from "react";

const CARE_TYPES = {
  watering: { label: "Riego", emoji: "💧", color: "#ffffff"},
  fertilizing: { label: "Fertilización", emoji: "🌿", color: "#ffffff"},
  leaf: { label: "Nueva hoja", emoji: "🌱", color: "#ffffff"},
  transplant: { label: "Trasplante", emoji: "🪴", color: "#ffffff"},
};

const SEASONS = [
  { key: "spring", label: "🌸 Primavera", months: [3, 4, 5] },
  { key: "summer", label: "☀️ Verano", months: [6, 7, 8] },
  { key: "autumn", label: "🍂 Otoño", months: [9, 10, 11] },
  { key: "winter", label: "❄️ Invierno", months: [12, 1, 2] },
];

const EMOJIS = ["🌿", "🌵", "🌺", "🌸", "🌻", "🌱", "🍀", "🌴", "🎋", "🪴", "🌾", "🍃"];

const getCurrentSeason = () => {
  const m = new Date().getMonth() + 1;
  return SEASONS.find(s => s.months.includes(m))?.key || "spring";
};

const getWaterStatus = (plant) => {
  const season = getCurrentSeason();
  const schedule = plant.waterSchedule || {};
  const intervalDays = schedule[season];
  if (!intervalDays) return { status: "unknown" };

  const waterEvents = plant.history.filter(e => e.type === "watering");
  if (!waterEvents.length) return { status: "unknown" };

  const lastWater = new Date(waterEvents[waterEvents.length - 1].date);
  const now = new Date();
  const daysSince = (now - lastWater) / 86400000;
  const daysUntil = intervalDays - daysSince;
  const progress = Math.min(daysSince / intervalDays, 1);

  if (daysUntil > 2) return { status: "ok", daysUntil: Math.floor(daysUntil), progress, lastWater };
  if (daysUntil > 0) return { status: "soon", daysUntil: Math.ceil(daysUntil), progress, lastWater };
  return { status: "overdue", daysOverdue: Math.floor(-daysUntil) + 1, progress, lastWater };
};

const STATUS_STYLES = {
  ok:      { color: "#ffffff", bg: "#1f4f1f", border: "#2a5a2a", label: "✓ Al día" },
  soon:    { color: "#ffffff", bg: "#2a1a00", border: "#5a3a00", label: "⚡ Pronto" },
  overdue: { color: "#ffffff", bg: "#2a0a0a", border: "#5a1a1a", label: "⚠ Regar ya" },
  unknown: { color: "#ffffff", bg: "#0a140a", border: "#1e3a1e", label: "Sin configurar" },
};

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const daysAgo = (iso) => {
  if (!iso) return null;
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoy";
  if (days === 1) return "ayer";
  return `hace ${days} días`;
};

const SAMPLE_PLANTS = [
  {
    id: 1, name: "Monstera Thai Constellation", species: "Monstera deliciosa", location: "Salón",
    emoji: "🌿", notes: "Variegada única, luz indirecta brillante", history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 },
  },
  {
    id: 2, name: "Planta del dinero", species: "Epipremnum pinnatum", location: "Oficina",
    emoji: "💚", notes: "Trae prosperidad, fácil de cuidar", history: [],
    waterSchedule: { spring: 5, summer: 4, autumn: 5, winter: 6 },
  },
  {
    id: 3, name: "Cinta bicolor", species: "Chlorophytum comosum", location: "Ventana",
    emoji: "🎀", notes: "Produce hijuelos naturalmente", history: [],
    waterSchedule: { spring: 6, summer: 5, autumn: 6, winter: 7 },
  },
  {
    id: 4, name: "Árbol de jade 'Orejas de Shrek'", species: "Crassula ovata", location: "Terraza",
    emoji: "🌳", notes: "Suculenta, muy resistente a sequía", history: [],
    waterSchedule: { spring: 12, summer: 10, autumn: 15, winter: 20 },
  },
  {
    id: 5, name: "Cala", species: "Zantedeschia aethiopica", location: "Baño",
    emoji: "🤍", notes: "Flores elegantes blancas, requiere humedad", history: [],
    waterSchedule: { spring: 3, summer: 2, autumn: 3, winter: 4 },
  },
  {
    id: 6, name: "Philodendron Lemon Lime", species: "Philodendron hederaceum", location: "Dormitorio",
    emoji: "🍋", notes: "Hojas amarillo limón brillantes", history: [],
    waterSchedule: { spring: 7, summer: 6, autumn: 7, winter: 8 },
  },
  {
    id: 7, name: "Philodendron Micans", species: "Philodendron hederaceum micans", location: "Estudio",
    emoji: "✨", notes: "Hojas iridiscentes, luz indirecta", history: [],
    waterSchedule: { spring: 7, summer: 6, autumn: 7, winter: 8 },
  },
  {
    id: 8, name: "Poto Marble Queen", species: "Epipremnum aureum", location: "Salón",
    emoji: "👑", notes: "Moteado blanco y verde, trepa fácil", history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 },
  },
  {
    id: 9, name: "Scindapsus pictus", species: "Scindapsus pictus", location: "Cocina",
    emoji: "🎨", notes: "Manchitas plateadas, espectacular", history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 8, winter: 9 },
  },
  {
    id: 10, name: "Poto Golden", species: "Epipremnum aureum", location: "Pasillo",
    emoji: "💛", notes: "Hojas doradas, crece rápido", history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 },
  },
  {
    id: 11, name: "Philodendron Scandens", species: "Philodendron hederaceum", location: "Ventana",
    emoji: "🌱", notes: "Trepadora clásica, muy adaptable", history: [],
    waterSchedule: { spring: 7, summer: 6, autumn: 7, winter: 8 },
  },
  {
    id: 12, name: "Poto Epipremnum", species: "Epipremnum pinnatum", location: "Balcón",
    emoji: "🌿", notes: "Poto resistente y decorativo", history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 },
  },
  {
    id: 13, name: "Ficus elastica Robusta", species: "Ficus elastica", location: "Entrada",
    emoji: "🍃", notes: "Árbol robusto, hojas grandes y brillantes", history: [],
    waterSchedule: { spring: 8, summer: 7, autumn: 9, winter: 10 },
  },
  {
    id: 14, name: "Pilea peperomioides", species: "Pilea peperomioides", location: "Mesa",
    emoji: "🪴", notes: "Moneda china, produce hijuelos", history: [],
    waterSchedule: { spring: 6, summer: 5, autumn: 6, winter: 7 },
  },
];

function WaterBar({ plant }) {
  const ws = getWaterStatus(plant);
  const st = STATUS_STYLES[ws.status];
  if (ws.status === "unknown") {
    return (
      <div style={{ background: "#0a140a", borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#ffffff"}}>💧 Sin frecuencia configurada</span>
      </div>
    );
  }
  return (
    <div style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: "8px", padding: "0.5rem 0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.7rem", color: "#ffffff", fontWeight: "bold" }}>{st.label}</span>
        <span style={{ fontSize: "0.7rem", color: "#ffffff"}}>
          {ws.status === "overdue"
            ? `${ws.daysOverdue} día${ws.daysOverdue !== 1 ? "s" : ""} de retraso`
            : `en ${ws.daysUntil} día${ws.daysUntil !== 1 ? "s" : ""}`}
        </span>
      </div>
      <div style={{ background: "#0a140a", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${Math.min(ws.progress * 100, 100)}%`,
          background: ws.status === "ok" ? "#4caf50" : ws.status === "soon" ? "#ff9800" : "#f44336",
          borderRadius: "4px",
        }} />
      </div>
    </div>
  );
}

function Modal({ title, onClose, children, extra }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,10,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
      <div style={{ background: "#111a0f", border: "1px solid #2a4a2a", borderRadius: "16px", padding: "2rem", maxWidth: "500px", width: "100%", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          {typeof title === "string" ? (
            <h2 style={{ margin: 0, color: "#ffffff", fontFamily: "'Georgia', serif", fontSize: "1.3rem" }}>{title}</h2>
          ) : (
            <div style={{ flex: 1 }}>{title}</div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {extra}
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff", fontSize: "1.5rem", cursor: "pointer", lineHeight: 1 }}>×</button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function PlantCard({ plant, onSelect, onLog }) {
  const lastCare = {};
  for (const type of Object.keys(CARE_TYPES)) {
    const events = plant.history.filter(e => e.type === type);
    if (events.length) lastCare[type] = events[events.length - 1].date;
  }
  const ws = getWaterStatus(plant);
  const st = STATUS_STYLES[ws.status];

  return (
    <div
      onClick={() => onSelect(plant)}
      style={{
        background: "linear-gradient(135deg, #0d1a0d 0%, #111f11 100%)",
        border: `1px solid ${ws.status !== "unknown" ? st.border : "#1e3a1e"}`,
        borderRadius: "16px", padding: "1.5rem", cursor: "pointer",
        transition: "opacity 0.2s", position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      <div style={{ position: "absolute", top: "-20px", right: "-10px", fontSize: "5rem", opacity: 0.07 }}>{plant.emoji}</div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
        <span style={{ fontSize: "2rem" }}>{plant.emoji}</span>
        <div>
          <div style={{ color: "#ffffff", fontFamily: "'Georgia', serif", fontSize: "1.05rem", fontWeight: "bold" }}>{plant.name}</div>
          <div style={{ color: "#ffffff", fontSize: "0.72rem", fontStyle: "italic" }}>{plant.species}</div>
        </div>
        <div style={{ marginLeft: "auto", background: "#1a2a1a", padding: "0.2rem 0.55rem", borderRadius: "20px", fontSize: "0.68rem", color: "#ffffff"}}>
          📍 {plant.location}
        </div>
      </div>
      <div style={{ marginBottom: "0.85rem" }} onClick={e => e.stopPropagation()}>
        <WaterBar plant={plant} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", marginBottom: "0.85rem" }}>
        {Object.entries(CARE_TYPES).map(([type, info]) => (
          <div key={type} style={{ background: "#0a140a", borderRadius: "7px", padding: "0.4rem 0.65rem" }}>
            <div style={{ fontSize: "0.62rem", color: "#ffffff", marginBottom: "0.1rem" }}>{info.emoji} {info.label}</div>
            <div style={{ fontSize: "0.72rem", color: "#ffffff"}}>
              {lastCare[type] ? daysAgo(lastCare[type]) : "sin registro"}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
        {Object.entries(CARE_TYPES).map(([type, info]) => (
          <button key={type} onClick={() => onLog(plant, type)}
            style={{ background: "#0a1a0a", border: `1px solid ${info.color}44`, color: "#ffffff", borderRadius: "7px", padding: "0.3rem 0.55rem", fontSize: "0.75rem", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = info.color + "22"}
            onMouseLeave={e => e.currentTarget.style.background = "#0a1a0a"}
          >{info.emoji}</button>
        ))}
      </div>
    </div>
  );
}

function WateringTab({ plant, onUpdate }) {
  const currentSeason = getCurrentSeason();
  const schedule = plant.waterSchedule || {};
  const [editing, setEditing] = useState(null);
  const [tempVal, setTempVal] = useState("");
  const [saved, setSaved] = useState(false);

  const ws = getWaterStatus(plant);
  const st = STATUS_STYLES[ws.status];

  const saveInterval = async (seasonKey, val) => {
    const days = parseInt(val);
    if (!days || days < 1) return;
    await onUpdate({ ...plant, waterSchedule: { ...schedule, [seasonKey]: days } });
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const waterEvents = plant.history.filter(e => e.type === "watering");
  const lastWater = waterEvents.length ? waterEvents[waterEvents.length - 1] : null;

  return (
    <div>
      {/* Status card */}
      <div style={{ background: ws.status !== "unknown" ? st.bg : "#0a140a", border: `1px solid ${ws.status !== "unknown" ? st.border : "#1e3a1e"}`, borderRadius: "12px", padding: "1rem 1.2rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "2rem" }}>💧</span>
          <div style={{ flex: 1 }}>
            {ws.status === "unknown" && <div style={{ color: "#ffffff", fontSize: "0.9rem" }}>Configura la frecuencia de riego abajo</div>}
            {ws.status === "ok" && <>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "0.95rem" }}>Todo bien 🌿</div>
              <div style={{ color: "#ffffff", fontSize: "0.78rem" }}>Próximo riego en <strong style={{ color: "#ffffff"}}>{ws.daysUntil} días</strong></div>
            </>}
            {ws.status === "soon" && <>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "0.95rem" }}>Regar pronto ⚡</div>
              <div style={{ color: "#ffffff", fontSize: "0.78rem" }}>En <strong style={{ color: "#ffffff"}}>{ws.daysUntil} día{ws.daysUntil !== 1 ? "s" : ""}</strong></div>
            </>}
            {ws.status === "overdue" && <>
              <div style={{ color: "#ffffff", fontWeight: "bold", fontSize: "0.95rem" }}>¡Regar urgente! ⚠</div>
              <div style={{ color: "#ffffff", fontSize: "0.78rem" }}>Lleva <strong style={{ color: "#ffffff"}}>{ws.daysOverdue} día{ws.daysOverdue !== 1 ? "s" : ""}</strong> de retraso</div>
            </>}
            {lastWater && <div style={{ color: "#ffffff", fontSize: "0.72rem", marginTop: "0.2rem" }}>Último riego: {formatDate(lastWater.date)}</div>}
          </div>
        </div>
        {ws.status !== "unknown" && (
          <div style={{ marginTop: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#ffffff", marginBottom: "0.3rem" }}>
              <span>Último riego</span><span>Próximo riego</span>
            </div>
            <div style={{ background: "#0a140a", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${Math.min(ws.progress * 100, 100)}%`,
                background: ws.status === "ok" ? "linear-gradient(90deg,#2e7d32,#4caf50)" : ws.status === "soon" ? "linear-gradient(90deg,#e65100,#ff9800)" : "linear-gradient(90deg,#b71c1c,#f44336)",
                borderRadius: "6px",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Season intervals */}
      <div style={{ color: "#ffffff", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
        Frecuencia de riego por época
        {saved && <span style={{ color: "#ffffff", marginLeft: "0.5rem" }}>✓ Guardado</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
        {SEASONS.map(season => {
          const isCurrent = season.key === currentSeason;
          const days = schedule[season.key];
          const isEditing = editing === season.key;
          return (
            <div key={season.key} style={{
              background: isCurrent ? "#0f2a0f" : "#0a140a",
              border: `1px solid ${isCurrent ? "#3a6a3a" : "#1e3a1e"}`,
              borderRadius: "10px", padding: "0.75rem 1rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "#ffffff"}}>{season.label}</span>
                  {isCurrent && <span style={{ fontSize: "0.62rem", background: "#1a3a1a", border: "1px solid #3a6a3a", color: "#ffffff", borderRadius: "10px", padding: "0.1rem 0.4rem" }}>ahora</span>}
                </div>
                {!isEditing && <div style={{ color: "#ffffff", fontSize: "0.75rem", marginTop: "0.15rem" }}>{days ? `Cada ${days} día${days !== 1 ? "s" : ""}` : "No configurado"}</div>}
              </div>
              {isEditing ? (
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <input type="number" min="1" max="365" value={tempVal} onChange={e => setTempVal(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && saveInterval(season.key, tempVal)}
                    autoFocus placeholder="días"
                    style={{ width: "64px", background: "#0a140a", border: "1px solid #4a7a4a", borderRadius: "6px", color: "#ffffff", padding: "0.3rem 0.5rem", fontSize: "0.85rem", textAlign: "center" }} />
                  <button onClick={() => saveInterval(season.key, tempVal)}
                    style={{ background: "#1a4a1a", border: "1px solid #4a8a4a", color: "#ffffff", borderRadius: "6px", padding: "0.3rem 0.6rem", cursor: "pointer", fontSize: "0.8rem" }}>✓</button>
                  <button onClick={() => setEditing(null)}
                    style={{ background: "none", border: "1px solid #3a3a3a", color: "#ffffff", borderRadius: "6px", padding: "0.3rem 0.5rem", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
                </div>
              ) : (
                <button onClick={() => { setEditing(season.key); setTempVal(days || ""); }}
                  style={{ background: "#0a1a0a", border: "1px solid #2a4a2a", color: "#ffffff", borderRadius: "7px", padding: "0.3rem 0.7rem", cursor: "pointer", fontSize: "0.75rem" }}>
                  {days ? "Editar" : "+ Añadir"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ color: "#ffffff", fontSize: "0.72rem", lineHeight: 1.5 }}>
        💡 El estado en la tarjeta se actualiza automáticamente según la época actual y el último riego registrado.
      </div>
    </div>
  );
}

function PlantDetail({ plant, onClose, onLog, onUpdate, onDelete }) {
  const [activeTab, setActiveTab] = useState("riego");
  const [editNotes, setEditNotes] = useState(plant.notes || "");
  const [saved, setSaved] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(plant.name);

  const handleSaveNotes = async () => {
    await onUpdate({ ...plant, notes: editNotes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveName = async () => {
    if (tempName.trim() && tempName.trim() !== plant.name) {
      await onUpdate({ ...plant, name: tempName.trim() });
    }
    setEditingName(false);
  };

  const tabs = [["riego", "💧 Riego"], ["historial", "Historial"], ["cuidados", "Cuidados"], ["notas", "Notas"]];

  return (
    <Modal
      title={editingName ? (
        <input value={tempName} onChange={e => setTempName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
          onBlur={handleSaveName}
          autoFocus
          style={{ width: "100%", background: "#0a140a", border: "1px solid #4a7a4a", borderRadius: "8px", color: "#ffffff", padding: "0.3rem 0.5rem", fontSize: "1.3rem", fontFamily: "'Georgia', serif", fontWeight: "bold", outline: "none", boxSizing: "border-box" }} />
      ) : `${plant.emoji} ${plant.name}`}
      onClose={onClose}
      extra={!editingName ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => { setTempName(plant.name); setEditingName(true); }}
            style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.1rem" }}
            title="Editar nombre">✏️</button>
          <button onClick={() => onDelete(plant.id)}
            style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.1rem" }}
            title="Eliminar planta">🗑️</button>
        </div>
      ) : (
        <button onClick={handleSaveName}
          style={{ background: "#1a4a1a", border: "1px solid #4a8a4a", color: "#ffffff", borderRadius: "6px", padding: "0.2rem 0.5rem", cursor: "pointer", fontSize: "0.85rem", lineHeight: 1.3 }}>✓</button>
      )}>
      <div style={{ color: "#ffffff", fontSize: "0.82rem", fontStyle: "italic", marginBottom: "1.25rem" }}>{plant.species} · {plant.location}</div>
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {tabs.map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: activeTab === tab ? "#1a3a1a" : "none",
            border: `1px solid ${activeTab === tab ? "#4a7a4a" : "#2a4a2a"}`,
            color: "#ffffff",
            borderRadius: "8px", padding: "0.35rem 0.7rem", fontSize: "0.78rem", cursor: "pointer"
          }}>{label}</button>
        ))}
      </div>

      {activeTab === "riego" && <WateringTab plant={plant} onUpdate={onUpdate} />}

      {activeTab === "historial" && (
        <div>
          {plant.history.length === 0
            ? <p style={{ color: "#ffffff", textAlign: "center", padding: "2rem 0" }}>Sin registros aún</p>
            : <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[...plant.history].reverse().map((ev, i) => {
                  const info = CARE_TYPES[ev.type];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", background: "#0a140a", borderRadius: "8px", padding: "0.75rem" }}>
                      <span style={{ fontSize: "1.2rem" }}>{info.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#ffffff", fontSize: "0.85rem", fontWeight: "bold" }}>{info.label}</div>
                        <div style={{ color: "#ffffff", fontSize: "0.75rem" }}>{formatDate(ev.date)}</div>
                        {ev.notes && <div style={{ color: "#ffffff", fontSize: "0.75rem", marginTop: "0.25rem" }}>{ev.notes}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
          }
        </div>
      )}

      {activeTab === "cuidados" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {Object.entries(CARE_TYPES).map(([type, info]) => {
            const events = plant.history.filter(e => e.type === type);
            const last = events.length ? events[events.length - 1] : null;
            return (
              <div key={type} style={{ background: "#0a140a", borderRadius: "10px", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontSize: "1.5rem" }}>{info.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#ffffff", fontSize: "0.9rem" }}>{info.label}</div>
                  <div style={{ color: "#ffffff", fontSize: "0.75rem" }}>{last ? `Último: ${formatDate(last.date)}` : "Sin registros"}</div>
                  <div style={{ color: "#ffffff", fontSize: "0.7rem" }}>{events.length} registro{events.length !== 1 ? "s" : ""}</div>
                </div>
                <button onClick={() => onLog(plant, type)}
                  style={{ background: info.color + "22", border: `1px solid ${info.color}55`, color: "#ffffff", borderRadius: "8px", padding: "0.4rem 0.8rem", fontSize: "0.8rem", cursor: "pointer" }}>
                  + Registrar
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "notas" && (
        <div>
          <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)}
            placeholder="Observaciones, necesidades especiales..."
            style={{ width: "100%", minHeight: "120px", background: "#0a140a", border: "1px solid #2a4a2a", borderRadius: "8px", color: "#ffffff", padding: "0.75rem", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
          <button onClick={handleSaveNotes}
            style={{ marginTop: "0.75rem", background: saved ? "#2a5a2a" : "#1a3a1a", border: "1px solid #4a7a4a", color: "#ffffff", borderRadius: "8px", padding: "0.5rem 1.2rem", cursor: "pointer" }}>
            {saved ? "✓ Guardado" : "Guardar"}
          </button>
        </div>
      )}
    </Modal>
  );
}

function LogModal({ plant, type, onClose, onSave }) {
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const info = CARE_TYPES[type];
  return (
    <Modal title={`${info.emoji} Registrar ${info.label}`} onClose={onClose}>
      <p style={{ color: "#ffffff", marginTop: 0 }}>Planta: <span style={{ color: "#ffffff"}}>{plant.name}</span></p>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ color: "#ffffff", fontSize: "0.8rem", display: "block", marginBottom: "0.35rem" }}>Fecha y hora</label>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
          style={{ width: "100%", background: "#0a140a", border: "1px solid #2a4a2a", borderRadius: "8px", color: "#ffffff", padding: "0.6rem 0.75rem", fontSize: "0.85rem", boxSizing: "border-box" }} />
      </div>
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={{ color: "#ffffff", fontSize: "0.8rem", display: "block", marginBottom: "0.35rem" }}>Notas (opcional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ej: 50ml agua, fertilizante líquido..."
          style={{ width: "100%", minHeight: "80px", background: "#0a140a", border: "1px solid #2a4a2a", borderRadius: "8px", color: "#ffffff", padding: "0.6rem 0.75rem", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button onClick={onClose} style={{ flex: 1, background: "none", border: "1px solid #2a4a2a", color: "#ffffff", borderRadius: "8px", padding: "0.6rem", cursor: "pointer" }}>Cancelar</button>
        <button onClick={() => onSave({ type, date: new Date(date).toISOString(), notes })}
          style={{ flex: 2, background: info.color + "33", border: `1px solid ${info.color}88`, color: "#ffffff", borderRadius: "8px", padding: "0.6rem", cursor: "pointer", fontSize: "0.9rem", fontWeight: "bold" }}>
          {info.emoji} Registrar
        </button>
      </div>
    </Modal>
  );
}

function AddPlantModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", species: "", location: "", emoji: "🌿", notes: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="➕ Añadir planta" onClose={onClose}>
      {[["Nombre (ej: Monstera del salón)", "name"], ["Especie (ej: Monstera deliciosa)", "species"], ["Ubicación (ej: Balcón sur)", "location"]].map(([ph, k]) => (
        <input key={k} placeholder={ph} value={form[k]} onChange={e => set(k, e.target.value)}
          style={{ width: "100%", background: "#0a140a", border: "1px solid #2a4a2a", borderRadius: "8px", color: "#ffffff", padding: "0.6rem 0.75rem", fontSize: "0.85rem", boxSizing: "border-box", marginBottom: "0.75rem" }} />
      ))}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ color: "#ffffff", fontSize: "0.8rem", marginBottom: "0.5rem" }}>Emoji</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => set("emoji", e)} style={{
              fontSize: "1.4rem", background: form.emoji === e ? "#1a3a1a" : "none",
              border: `1px solid ${form.emoji === e ? "#4a7a4a" : "#2a4a2a"}`,
              borderRadius: "8px", padding: "0.3rem 0.4rem", cursor: "pointer"
            }}>{e}</button>
          ))}
        </div>
      </div>
      <textarea placeholder="Notas iniciales..." value={form.notes} onChange={e => set("notes", e.target.value)}
        style={{ width: "100%", minHeight: "70px", background: "#0a140a", border: "1px solid #2a4a2a", borderRadius: "8px", color: "#ffffff", padding: "0.6rem 0.75rem", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", marginBottom: "1rem" }} />
      <button onClick={() => form.name.trim() && onAdd({ ...form, id: Date.now(), history: [], waterSchedule: {} })}
        style={{ width: "100%", background: "#1a3a1a", border: "1px solid #4a7a4a", color: "#ffffff", borderRadius: "10px", padding: "0.7rem", cursor: "pointer", fontSize: "0.95rem" }}>
        🌱 Añadir planta
      </button>
    </Modal>
  );
}

export default function App() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [logModal, setLogModal] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      const response = await fetch('/.netlify/functions/getPlants');
      const data = await response.json();
      setPlants(data.length ? data : SAMPLE_PLANTS);
    } catch (error) {
      console.error('Error loading plants:', error);
      setPlants(SAMPLE_PLANTS);
    } finally {
      setLoading(false);
    }
  };

  const addPlant = async (plant) => {
    try {
      const response = await fetch('/.netlify/functions/addPlant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plant)
      });
      const newPlant = await response.json();
      setPlants(ps => [...ps, newPlant]);
      setShowAdd(false);
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };

  const updatePlant = async (updated) => {
    try {
      const response = await fetch('/.netlify/functions/updatePlant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const updatedPlant = await response.json();
      setPlants(ps => ps.map(p => p.id === updatedPlant.id ? updatedPlant : p));
      if (selectedPlant?.id === updatedPlant.id) setSelectedPlant(updatedPlant);
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  };

  const deletePlant = async (plantId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta planta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`/.netlify/functions/deletePlant?id=${plantId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        setPlants(ps => ps.filter(p => p.id !== plantId));
        setSelectedPlant(null); // Cerrar el modal si la planta estaba seleccionada
      } else {
        const error = await response.json();
        alert('Error al eliminar la planta: ' + error.error);
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      alert('Error al eliminar la planta');
    }
  };

  const handleSaveLog = async ({ type, date, notes }) => {
    const updated = { ...logModal.plant, history: [...logModal.plant.history, { type, date, notes }] };
    await updatePlant(updated);
    setLogModal(null);
  };

  const statusCounts = { ok: 0, soon: 0, overdue: 0, unknown: 0 };
  plants.forEach(p => { statusCounts[getWaterStatus(p).status]++; });

  const currentSeasonLabel = SEASONS.find(s => s.key === getCurrentSeason())?.label;

  const filtered = plants
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.species.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p => filterStatus === "all" || getWaterStatus(p).status === filterStatus);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#070f07", color: "#ffffff", fontFamily: "'Segoe UI', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Cargando plantas...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#070f07", color: "#ffffff", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "linear-gradient(180deg, #0a1a0a 0%, #070f07 100%)", borderBottom: "1px solid #1a2a1a", padding: "1.5rem 1.5rem 1rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: "'Georgia', serif", fontSize: "1.6rem", color: "#ffffff", letterSpacing: "-0.02em" }}>🌿 PlantaCare</h1>
              <div style={{ color: "#ffffff", fontSize: "0.72rem", marginTop: "0.15rem" }}>{plants.length} plantas · {currentSeasonLabel}</div>
            </div>
            <button onClick={() => setShowAdd(true)}
              style={{ background: "#1a3a1a", border: "1px solid #4a7a4a", color: "#ffffff", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.85rem" }}>
              + Nueva planta
            </button>
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
            {[
              ["all", "Todas", "#5a8a5a"],
              ["overdue", `⚠ Urgente (${statusCounts.overdue})`, "#f44336"],
              ["soon", `⚡ Pronto (${statusCounts.soon})`, "#ff9800"],
              ["ok", `✓ Al día (${statusCounts.ok})`, "#4caf50"],
            ].map(([key, label, color]) => (
              <button key={key} onClick={() => setFilterStatus(key)} style={{
                background: filterStatus === key ? color + "22" : "none",
                border: `1px solid ${filterStatus === key ? color : "#2a3a2a"}`,
                color: "#ffffff",
                borderRadius: "20px", padding: "0.25rem 0.7rem", fontSize: "0.72rem", cursor: "pointer"
              }}>{label}</button>
            ))}
          </div>

          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar plantas..."
            style={{ width: "100%", background: "#0a140a", border: "1px solid #1e3a1e", borderRadius: "10px", color: "#ffffff", padding: "0.6rem 0.9rem", fontSize: "0.85rem", boxSizing: "border-box" }} />
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1.5rem" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#ffffff", padding: "4rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
            <p>{search || filterStatus !== "all" ? "No hay plantas que coincidan" : "Añade tu primera planta"}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
            {filtered.map(plant => (
              <PlantCard key={plant.id} plant={plant} onSelect={setSelectedPlant} onLog={(p, t) => setLogModal({ plant: p, type: t })} />
            ))}
          </div>
        )}
      </div>

      {selectedPlant && (
        <PlantDetail
          plant={plants.find(p => p.id === selectedPlant.id) || selectedPlant}
          onClose={() => setSelectedPlant(null)}
          onLog={(plant, type) => setLogModal({ plant, type })}
          onUpdate={updatePlant}
          onDelete={deletePlant}
        />
      )}
      {logModal && <LogModal plant={logModal.plant} type={logModal.type} onClose={() => setLogModal(null)} onSave={handleSaveLog} />}
      {showAdd && <AddPlantModal onClose={() => setShowAdd(false)} onAdd={addPlant} />}
    </div>
  );
}

