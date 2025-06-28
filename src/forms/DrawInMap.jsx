import React, { useContext, useState, useEffect } from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { GoogleMapsContext } from '../contexts/google.map.context';
import { Typography } from '@mui/material';
import { useStore } from '../contexts/states.store.context';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DrawInMap({ open, onClose }) {
    const {state,dispatch} = useStore()
    const { isLoaded } = state.googleMapStatus
    const [map, setMap] = useState(null);
    const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 }); // Default center
    const [drawingMode, setDrawingMode] = useState(null);
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCenter({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }, []);
  
    const drawingModeOptions = {
      drawingMode: drawingMode || null,
      drawingControl: true,
      drawingControlOptions: {
        position: window?.google?.maps?.ControlPosition?.TOP_CENTER,
        drawingModes: [
          window?.google?.maps?.drawing.OverlayType.MARKER,
          window?.google?.maps?.drawing.OverlayType.CIRCLE,
          window?.google?.maps?.drawing.OverlayType.POLYLINE,
          window?.google?.maps?.drawing.OverlayType.POLYGON,
          window?.google?.maps?.drawing.OverlayType.RECTANGLE,
        ],
      },
    };
  
    const handleDrawingModeChange = (mode) => {
      setDrawingMode(mode);
    };
  
    return (
      <React.Fragment>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={onClose}
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>{"Pesquisar atraves por desenho no map"}</DialogTitle>
          <Typography 
          variant='h6'
          sx={{ marginLeft: '1em' }}
          >Use a seguinte ferramentas abaixo para desenhar no mapa</Typography>
          <DialogContent>
            <div style={{ marginBottom: '10px' }}>
              <Button variant="contained" onClick={() => handleDrawingModeChange(window?.google?.maps?.drawing.OverlayType.MARKER)}>Marcador</Button>
              <Button variant="contained" onClick={() => handleDrawingModeChange(window?.google?.maps?.drawing.OverlayType.CIRCLE)}>Circlo</Button>
              <Button variant="contained" onClick={() => handleDrawingModeChange(window?.google?.maps?.drawing.OverlayType.POLYLINE)}>Linha de Poligono</Button>
              <Button variant="contained" onClick={() => handleDrawingModeChange(window?.google?.maps?.drawing.OverlayType.POLYGON)}>Poligono</Button>
              <Button variant="contained" onClick={() => handleDrawingModeChange(window?.google?.maps?.drawing.OverlayType.RECTANGLE)}>Rectangulo</Button>
            </div>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ height: "60vh", width: "100%" }}
                center={center}
                zoom={15} // Adjust zoom level as needed
                onLoad={(mapInstance) => setMap(mapInstance)}
              >
                <DrawingManager
                  key={drawingMode} // Force re-render on mode change
                  options={drawingModeOptions}
                />
              </GoogleMap>
            ) : (
              <div>Loading...</div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }