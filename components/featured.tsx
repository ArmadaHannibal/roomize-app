'use client';

import { useEffect, useState } from 'react';
import { Image } from '@nextui-org/react';
import axios from 'axios';
import { Skeleton } from "@nextui-org/react";
import { FaStar } from "react-icons/fa6";

interface Media {
    id: number,
    date: string,
    guid: string,
    modified: string,
    slug: string,
    link: string,
    title: string,
    description: string,
    media_type: string,
    mime_type: string,
    source_url: string,
    sizes: string;
    // Ajoute d'autres propriétés nécessaires
}

interface Type {
    id: number,
    name: string;
    // Ajoute d'autres propriétés nécessaires
}

interface Galery {
    id: number,
    date: string,
    guid: string,
    modified: string,
    slug: string,
    link: string,
    title: string,
    description: string,
    media_type: string,
    mime_type: string,
    source_url: string,
    sizes: string;
    // Ajoute d'autres propriétés nécessaires
};

export const Featured = () => {
    const [hotels, setHotels] = useState([]);
    const [featuredMedia, setFeaturedMedia] = useState<Media | null>(null);
    const [typeHotel, settypeHotel] = useState<Type | null>(null);
    const [galeryHotel, setgaleryHotel] = useState<Galery[] | null>(null); // Correction ici

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('/api/hotel');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setHotels(data);

                const featuredHotel = data.find(hotel => hotel.featured);
                console.log(featuredHotel);

                if (featuredHotel) {
                    const mediaResponse = await fetch(`/api/featured_media?id=${featuredHotel.featured_media}`);
                    const mediaData = await mediaResponse.json();
                    setFeaturedMedia(mediaData);

                    const typereponse = await fetch(`api/type_hotel?url=${featuredHotel.type}`);
                    const typeData = await typereponse.json();
                    settypeHotel(typeData[0]);

                    const galeryreponse = await fetch(`api/galery?ids=${featuredHotel.gallery}`);
                    const galeryData = await galeryreponse.json();
                    setgaleryHotel(galeryData); // Supposons que `galeryData` soit un tableau
                }

            } catch (error) {
                console.error("Erreur lors de la récupération des hôtels :", error.message);
            }
        };

        fetchHotels();

    }, []);

    if (!hotels || hotels.length === 0) {
        return <Skeleton className="bgfeaturedMedia" />;
    }

    return <>
        <div>
            {hotels.map((hotel) => (
                hotel.featured == true ? (
                    <div key={hotel.id} className="hotel-card">
                        <div className='absolute opacity-50 bgfeaturedMedia bg-black'></div>
                        {featuredMedia ? (
                            <div
                                className="bg-cover bg-center featuredMedia"
                                style={{
                                    backgroundImage: `url(${featuredMedia.source_url.replace("https://", "http://")})`
                                }}
                            >
                                {/* Autres éléments à l'intérieur */}
                            </div>
                            // <Image src={featuredMedia.source_url} width={1500} height={2000} alt={featuredMedia.slug} />
                        ) : (
                            null
                        )}
                        <div dangerouslySetInnerHTML={{ __html: hotel.title }} className='absolute titlefeaturedMedia text-white text-4xl font-bold' />
                        <div className='absolute flex flex-row items-center space-x-2 startHotel'>
                            <div><FaStar className='w-5 h-5 text-white' /></div>
                            <div><FaStar className='w-5 h-5 text-white' /></div>
                            <div><FaStar className='w-5 h-5 text-white' /></div>
                            <div><FaStar className='w-5 h-5 text-white' /></div>
                            <div><FaStar className='w-5 h-5 text-white' /></div>
                        </div>
                        {typeHotel ?
                            (
                                <p className='absolute typehotel text-white text-lg'>{typeHotel.name}</p>
                            ) : (
                                <Skeleton className="typehotel w-10 h-2" />
                            )
                        }
                        <div dangerouslySetInnerHTML={{ __html: hotel.content }} className='absolute contenthotal text-white text-sm w-80' />

                        {
                            galeryHotel ? (
                                <div className='absolute contentGaleryhotel flex flex-row space-x-3'>
                                    {galeryHotel.map((galery) => (
                                        <div key={galery.id} className='Galeryhotel'>
                                            <Image src={galery.source_url.replace("https://", "http://")} alt={galery.title} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='absolute contentGaleryhotel flex flex-row space-x-3'>
                                    <Skeleton className="Galeryhotel" />
                                    <Skeleton className="Galeryhotel" />
                                    <Skeleton className="Galeryhotel" />
                                </div>
                            )
                        }

                    </div>
                ) : null
            ))}
        </div>
    </>
}
