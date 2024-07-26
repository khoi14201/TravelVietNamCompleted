import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Box, Button } from "@mui/material";
import ReactMapGl, {
  GeolocateControl,
  Marker,
  NavigationControl,
} from "react-map-gl";
import { useValue } from "../../../context/ContextProvider";
import "mapbox-gl/dist/mapbox-gl.css";
import Geocoder from "./Geocoder";
import debounce from "lodash.debounce";

const AddLocation = () => {
  const {
    state: {
      location: { lng, lat },
    },
    dispatch,
  } = useValue();

  const defaultLng = 106.6297; // Default longitude for TP HCM
  const defaultLat = 10.8231; // Default latitude for TP HCM

  const [viewState, setViewState] = useState({
    longitude: lng || defaultLng,
    latitude: lat || defaultLat,
    zoom: 8,
  });

  const mapRef = useRef();

  const updateLocation = useCallback(
    (longitude, latitude) => {
      dispatch({
        type: "UPDATE_LOCATION",
        payload: { lng: longitude, lat: latitude },
      });
      setViewState((prevState) => ({
        ...prevState,
        longitude,
        latitude,
      }));
    },
    [dispatch]
  );

  useEffect(() => {
    const fetchLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateLocation(longitude, latitude);
          },
          (error) => {
            console.error("Error fetching geolocation:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    if (!lng && !lat) {
      fetchLocation();
    }
  }, [lng, lat, updateLocation]);

  useEffect(() => {
    if (lng && lat) {
      updateLocation(lng, lat);
    }
  }, [lng, lat, updateLocation]);

  const handleMoveEnd = useCallback(
    debounce((evt) => {
      const { longitude, latitude } = evt.viewState;
      if (
        Math.abs(viewState.longitude - longitude) > 0.0001 ||
        Math.abs(viewState.latitude - latitude) > 0.0001
      ) {
        updateLocation(longitude, latitude);
      }
    }, 200),
    [updateLocation, viewState]
  );

  const marker = useMemo(
    () => (
      <Marker
        latitude={viewState.latitude}
        longitude={viewState.longitude}
        draggable
        onDragEnd={(e) => {
          const { lngLat } = e;
          updateLocation(lngLat.lng, lngLat.lat);
        }}
      />
    ),
    [viewState.latitude, viewState.longitude, updateLocation]
  );

  const navControl = useMemo(
    () => <NavigationControl position="bottom-right" />,
    []
  );

  const geolocateControl = useMemo(
    () => (
      <GeolocateControl
        position="top-left"
        trackUserLocation
        showUserLocation
        onGeolocate={(e) => {
          const { coords } = e;
          updateLocation(coords.longitude, coords.latitude);
        }}
      />
    ),
    [updateLocation]
  );

  const handleSubmit = () => {
    console.log(
      "New location confirmed:",
      viewState.longitude,
      viewState.latitude
    );
    // Dispatch cập nhật vị trí cuối cùng
    updateLocation(viewState.longitude, viewState.latitude);
  };

  return (
    <Box
      sx={{
        height: 400,
        position: "relative",
      }}
    >
      <ReactMapGl
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onMoveEnd={handleMoveEnd}
        ref={mapRef}
        mapboxAccessToken={process.env.REACT_APP_MAP_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {marker}
        {navControl}
        {geolocateControl}
        <Geocoder />
      </ReactMapGl>
      <Button onClick={handleSubmit}></Button>
    </Box>
  );
};

export default AddLocation;
