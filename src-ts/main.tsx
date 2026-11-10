import React from "react";
import ReactDOM from "react-dom/client";
import { MapComponentsProvider } from "@mapcomponents/react-maplibre";
import App from "./App";
import "./index.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { DeckGlContextProvider } from "@mapcomponents/deck-gl";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MapComponentsProvider>
            <DeckGlContextProvider>
                <App />
            </DeckGlContextProvider>
        </MapComponentsProvider>
    </React.StrictMode>,
);
