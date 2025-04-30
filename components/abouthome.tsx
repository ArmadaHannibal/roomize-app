'use client';

import { url } from "inspector";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { AppSwiperHotelHome } from '@/components/appswiper';

export const AboutHome = () => {

    useEffect(() => {
        AOS.init({
            // Options here
            duration: 1000,
        });
    }, []);

    return <>
        <div className="relative mt-56 contentAbout">
            <div className="relative flex flex-col z-20 space-y-1 w-full" data-aos="fade-down" data-aos-easing="linear" data-aos-duration="1500">
                <div className="flex justify-center">
                    <div style={{
                        backgroundImage: 'url(/logoBackLux.png)',
                        width: '3%',
                        height: '3rem',
                        backgroundSize: '100%',
                        backgroundRepeat: 'no-repeat',
                        left: '5rem'
                    }}></div>
                </div>
                <div className="flex justify-center font-bold">ROOMIZE</div>
                <div className="flex justify-center text-center px-60">
                    <p>
                        Découvrez notre vaste sélection d'hôtels à travers
                        le monde, avec des options adaptées à tous les
                        budgets et préférences. Comparez les tarifs,
                        consultez les avis de voyageurs, et réservez votre
                        chambre en quelques clics. Que vous cherchiez un
                        luxe cinq étoiles ou une option économique,
                        HotelFinder rend votre réservation simple et
                        rapide. Explorez les meilleures offres et commencez
                        à planifier votre prochain voyage dès aujourd'hui !
                    </p>
                </div>
            </div>
            <AppSwiperHotelHome />
            <div className="absolute opacity-40" style={{
                backgroundImage: 'url(/logoBackLux.png)',
                width: '30%',
                height: '28rem',
                backgroundSize: '100%',
                backgroundRepeat: 'no-repeat',
                left: '33.2rem',
                bottom: '53rem'
            }}></div>
        </div>
    </>
}