"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const MapClick = dynamic(
  () => import("react-leaflet").then(({ useMapEvents }) => {
    return function MapClickInner({ onClick }) {
      useMapEvents({ click: (e) => onClick?.(e.latlng) });
      return null;
    };
  }),
  { ssr: false }
);

export function SelectableMap({ onLocationSelect, onLoadingChange }) {
  const [position, setPosition] = useState({ lat: -22.21389, lng: -49.94583 });

  const markerIcon = useMemo(() => {
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='#00E0B7' stroke='#0A1C1C' stroke-width='1.2'>
         <path d='M12 22s-7-6.58-7-11a7 7 0 1 1 14 0c0 4.42-7 11-7 11z'/>
         <circle cx='12' cy='11' r='3' fill='#0A1C1C'/>
       </svg>`
    );
    return L.icon({
      iconUrl: `data:image/svg+xml;charset=UTF-8,${svg}`,
      iconSize: [32, 32],
      iconAnchor: [16, 30],
      popupAnchor: [0, -28],
    });
  }, []);

  const handleClick = useCallback(async (latlng) => {
    setPosition(latlng);
    onLoadingChange?.(true);

    try {
      const params = new URLSearchParams({
        format: "json",
        lat: String(latlng.lat),
        lon: String(latlng.lng),
        "accept-language": "pt-BR",
      });

      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();

      const address = data?.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        "-";
      const state = address.state || "-";
      const country = address.country || "-";
      let touristPoint = "-";

      try {
        const R = 1200;
        const query = `
          [out:json][timeout:7];
          (
            node(around:${R},${latlng.lat},${latlng.lng})[tourism~"^(museum|attraction|gallery|viewpoint)$"];
            way(around:${R},${latlng.lat},${latlng.lng})[tourism~"^(museum|attraction|gallery|viewpoint)$"];
            node(around:${R},${latlng.lat},${latlng.lng})[historic~"^(memorial|monument|statue)$"];
            node(around:${R},${latlng.lat},${latlng.lng})[leisure~"^(park|garden)$"];
            node(around:${R},${latlng.lat},${latlng.lng})[shop=mall];
          );
          out center 50;
        `;
        const overpassRes = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
        );
        const overpassData = await overpassRes.json();
        const elements = Array.isArray(overpassData?.elements)
          ? overpassData.elements
          : [];

        const best = elements
          .filter((el) => el?.tags?.name)
          .sort((a, b) => (b.tags.name?.length || 0) - (a.tags.name?.length || 0))[0];

        touristPoint = best?.tags?.name || "-";
      } catch {}

      onLocationSelect?.({
        latitude: latlng.lat.toFixed(6),
        longitude: latlng.lng.toFixed(6),
        city,
        state,
        country,
        touristPoint,
      });
    } catch {
      onLocationSelect?.({
        latitude: latlng.lat.toFixed(6),
        longitude: latlng.lng.toFixed(6),
      });
    } finally {
      onLoadingChange?.(false);
    }
  }, [onLocationSelect, onLoadingChange]);

  const tileUrl = useMemo(() => "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", []);

  return (
    <Box sx={{ height: 280, border: "1px solid #00E0B7", borderRadius: 2, overflow: "hidden", backgroundColor: "#0A1C1C" }}>
      <MapContainer 
        center={[position.lat, position.lng]} 
        zoom={5} 
        style={{ height: "100%", width: "100%" }} 
        scrollWheelZoom
        worldCopyJump={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        minZoom={2}
      >
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClick onClick={handleClick} />
        <Marker position={[position.lat, position.lng]} icon={markerIcon} />
      </MapContainer>
    </Box>
  );
}


