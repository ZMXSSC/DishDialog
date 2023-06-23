import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import React from "react";
const DiscoverPage = () => {
    return (
            <MapContainer style={{ height: "88vh", width: "100%" }} center={[37.8277754, -122.2662917]} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[38, -122]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default DiscoverPage;