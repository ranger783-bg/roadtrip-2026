"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { STOPS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

const line = STOPS.map((s) => [s.lat, s.lng] as [number, number]);
const lats = STOPS.map((s) => s.lat);
const lngs = STOPS.map((s) => s.lng);
const bounds: [[number, number], [number, number]] = [
  [Math.min(...lats), Math.min(...lngs)],
  [Math.max(...lats), Math.max(...lngs)],
];

function pin(color: string, label: string, main: boolean) {
  const size = main ? 30 : 22;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};color:#fff;display:flex;align-items:center;justify-content:center;font:600 ${main ? 13 : 11}px/1 Inter,sans-serif;border:2px solid #fffdf9;box-shadow:0 1px 4px rgba(0,0,0,.35)">${label}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function RouteMap() {
  return (
    <MapContainer bounds={bounds} boundsOptions={{ padding: [30, 30] }} scrollWheelZoom={false} className="h-[60vh] min-h-[380px] w-full rounded-lg border border-edge">
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline positions={line} pathOptions={{ color: "#b5552f", weight: 3, opacity: 0.7, dashArray: "7 7" }} />
      {STOPS.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={pin(s.color, String(s.seq), s.type === "main")}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>{s.name}</strong>
              <br />
              {s.city}, {s.state}
              <br />
              {s.nights > 0 ? `${formatDate(s.arrival)} → ${formatDate(s.departure)} · ${s.nights} nights` : formatDate(s.arrival)}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
