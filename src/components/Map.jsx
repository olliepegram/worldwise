import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import Button from './Button';
import { useGeolocation } from '../hooks/useGeolocation';

function Map() {
	const navigate = useNavigate();
	const { cities } = useCities();
	const [mapPosition, setMapPosition] = useState([40, 0]);
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		isLoading: isLoadingPosition,
		positon: geoLocationPosition,
		getPosition,
	} = useGeolocation();

	const mapLat = searchParams.get('lat');
	const mapLng = searchParams.get('lng');

	useEffect(() => {
		if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
	}, [mapLng, mapLat]);

	useEffect(() => {
		if (geoLocationPosition) {
			console.log([geoLocationPosition.lat, geoLocationPosition.lng]);
			setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
		}
	}, [geoLocationPosition]);

	return (
		<div className={styles.mapContainer}>
			<Button
				type='position'
				onClick={getPosition}
			>
				{isLoadingPosition ? 'Loading' : 'Use your positon'}
			</Button>
			<MapContainer
				className={styles.map}
				center={mapPosition}
				// center={[mapLat, mapLng]}
				zoom={13}
				scrollWheelZoom={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
				/>
				{cities.map((city) => (
					<Marker
						position={[city.position.lat, city.position.lng]}
						key={city.id}
					>
						<Popup>
							<span>{city.emoji}</span>
							<span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}

				<ChangeCenter position={mapPosition} />
				<DetectClick />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({ position }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();

	useMapEvents({
		click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	});
}

export default Map;
