'use client';

import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { Skeleton } from "@nextui-org/react";

// Définition des interfaces
interface Media {
    id: number;
    source_url: string;
    slug: string;
}

interface Type {
    id: number;
    name: string;
}

interface Galery {
    id: number;
    source_url: string;
    title: string;
}

interface Hotel {
    id: number;
    title: string;
    featured_media: number;
    type: string;
    gallery: string[];
}

interface AppContextProps {
    hotels: Hotel[];
    setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
    featuredMedias: Media[];
    types: Type[];
    galleries: Galery[];
}

const AppContext = createContext<AppContextProps>({
    hotels: [],
    setHotels: () => {},
    featuredMedias: [],
    types: [],
    galleries: [],
});

export const FeaturedProvider = ({ children }: { children: ReactNode }) => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [featuredMedias, setFeaturedMedias] = useState<Media[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [galleries, setGalleries] = useState<Galery[]>([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('/api/hotel');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Hotel[] = await response.json();
                setHotels(data);

                // Boucle sur chaque hôtel pour récupérer les détails supplémentaires
                const medias: Media[] = [];
                const typeList: Type[] = [];
                const galleryList: Galery[] = [];

                for (const hotel of data) {
                    // Récupérer les médias
                    const mediaResponse = await fetch(`/api/featured_media?id=${hotel.featured_media}`);
                    const mediaData: Media = await mediaResponse.json();
                    medias.push(mediaData);

                    // Récupérer le type
                    const typeResponse = await fetch(`/api/type_hotel?url=${hotel.type}`);
                    const typeData: Type[] = await typeResponse.json();
                    if (typeData.length > 0) {
                        typeList.push(typeData[0]);
                    }

                    // // Récupérer la galerie
                    // const galleryResponse = await fetch(`/api/galery?ids=${hotel.gallery.join(',')}`);
                    // const galleryData: Galery[] = await galleryResponse.json();
                    // galleryList.push(...galleryData); // Ajoute toutes les galeries
                }

                setFeaturedMedias(medias);
                setTypes(typeList);
                setGalleries(galleryList);

            } catch (error) {
                console.error("Erreur lors de la récupération des hôtels :", error.message);
            }
        };

        fetchHotels();

    }, []);

    return (
        <AppContext.Provider value={{ hotels, setHotels, featuredMedias, types, galleries }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte
export const useAppContext = () => useContext(AppContext);
