import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LocationPickerProps {
  value: string;
  onChange: (location: string) => void;
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [20.5937, 78.9629],
        zoom: 5,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Custom icon
      const customIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      map.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);

        // Remove existing marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }

        // Add new marker
        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
        map.flyTo([lat, lng], 15, { duration: 1.5 });

        // Reverse geocode
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data.display_name) {
            onChange(data.display_name);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
        }
      });

      mapInstanceRef.current = map;
      setIsLoading(false);
      setIsMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker when position changes from geocoding
  useEffect(() => {
    const updateMarker = async () => {
      if (!mapInstanceRef.current || !position || !isMapReady) return;

      const L = (await import("leaflet")).default;
      const customIcon = L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (markerRef.current) {
        mapInstanceRef.current.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker(position, { icon: customIcon }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.flyTo(position, 15, { duration: 1.5 });
    };

    updateMarker();
  }, [position, isMapReady]);

  // Geocode address when user types
  const handleAddressChange = async (address: string) => {
    onChange(address);

    if (address.length > 5) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=in&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setPosition([lat, lon]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          placeholder="Enter address or click on map to select location"
          value={value}
          onChange={(e) => handleAddressChange(e.target.value)}
          className="pr-10"
          required
        />
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
      </div>

      <div className="relative rounded-lg border border-border overflow-hidden">
        <div ref={mapRef} className="w-full h-[250px]" />
        {isLoading && (
          <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm">Loading map...</span>
            </div>
          </div>
        )}
      </div>

      {position && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3 text-primary" />
          Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        💡 Click on the map to pin your exact location or type an address above
      </p>
    </div>
  );
}
