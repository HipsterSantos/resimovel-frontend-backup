import React, {
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from '@mui/material';

import { GoogleMapsContext } from '../contexts/google.map.context';
import { Logger } from '../helpers/logging';

const logger = new Logger('DrawInMap');

const LUANDA_CENTER = {
  lat: -8.8399876,
  lng: 13.2894368,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DrawInMap({ open, onClose }) {
  const {
    isLoaded,
    loadError,
    defaultCenter = LUANDA_CENTER,
    setMapInstance,
  } = useContext(GoogleMapsContext);

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [drawingMode, setDrawingMode] = useState(null);

  /* ----------------------------------
     Center map (Luanda → user location)
  ---------------------------------- */
  useEffect(() => {
    if (!isLoaded) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setCenter({
            lat: coords.latitude,
            lng: coords.longitude,
          });
          logger.info('Map centered on user location');
        },
        () => {
          setCenter(defaultCenter);
          logger.info('Using default center (Luanda)');
        }
      );
    }
  }, [isLoaded, defaultCenter]);

  /* ----------------------------------
     Drawing options (PRODUCTION SAFE)
  ---------------------------------- */
  const drawingOptions = useMemo(() => {
    if (!window.google?.maps?.drawing) return null;

    return {
      drawingMode: drawingMode ?? null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.MARKER,
          window.google.maps.drawing.OverlayType.CIRCLE,
          window.google.maps.drawing.OverlayType.POLYLINE,
          window.google.maps.drawing.OverlayType.POLYGON,
          window.google.maps.drawing.OverlayType.RECTANGLE,
        ],
      },
    };
  }, [drawingMode]);

  /* ----------------------------------
     Handlers
  ---------------------------------- */
  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance);
    setMapInstance?.(mapInstance);
    logger.info('Google Map instance created');
  };

  const setMode = (mode) => {
    if (!window.google?.maps?.drawing) return;
    setDrawingMode(mode);
  };

  /* ============================
     Render
  ============================ */

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle>Pesquisar através de desenho no mapa</DialogTitle>

      <Typography variant="h6" sx={{ marginLeft: '1em' }}>
        Use as ferramentas abaixo para desenhar no mapa
      </Typography>

      <DialogContent>
        {/* DRAWING BUTTONS – KEPT & STYLED */}
        <div style={{ marginBottom: 10, display: 'flex', gap: 8 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              setMode(window.google.maps.drawing.OverlayType.MARKER)
            }
          >
            Marcador
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() =>
              setMode(window.google.maps.drawing.OverlayType.CIRCLE)
            }
          >
            Círculo
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={() =>
              setMode(window.google.maps.drawing.OverlayType.POLYLINE)
            }
          >
            Linha
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={() =>
              setMode(window.google.maps.drawing.OverlayType.POLYGON)
            }
          >
            Polígono
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              setMode(window.google.maps.drawing.OverlayType.RECTANGLE)
            }
          >
            Retângulo
          </Button>
        </div>

        {/* MAP */}
        {!isLoaded && <div>Carregando mapa…</div>}
        {loadError && <div>Erro ao carregar Google Maps</div>}

        {isLoaded && drawingOptions && (
          <GoogleMap
            mapContainerStyle={{ height: '60vh', width: '100%' }}
            center={center}
            zoom={15}
            onLoad={handleMapLoad}
            options={{
              fullscreenControl: true,
              mapTypeControl: true,
              streetViewControl: false,
            }}
          >
            <DrawingManager
              key={drawingMode}
              options={drawingOptions}
            />
          </GoogleMap>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
