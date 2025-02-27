// src/components/BasemapControl.js
import React from 'react';
import { LayersControl, TileLayer } from 'react-leaflet';

const { BaseLayer } = LayersControl;

const BasemapControl = () => {
  return (
    <LayersControl position="topright" collapsed={false}>
      {/* Basemap padrão: OpenStreetMap */}
      <BaseLayer checked name="OpenStreetMap">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </BaseLayer>

      {/* Basemap de Satélite */}
      <BaseLayer name="Satellite">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
        />
      </BaseLayer>
    </LayersControl>
  );
};

export default BasemapControl;
