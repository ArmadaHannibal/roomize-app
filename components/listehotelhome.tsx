import { useAppContext } from './contentHotel'; // Assurez-vous que le chemin est correct
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaStar } from "react-icons/fa6";
import { Card, CardFooter, Image, Button } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import '@/app/style/swiperListeHome.css';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CountUp from 'react-countup';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export const ListeHotelHome = () => {
    const { hotels, featuredMedias, types, galleries } = useAppContext();

    useEffect(() => {
        AOS.init({
            // Options here
            duration: 1000,
        });
    }, []);

    return (
        <div>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper mt-24 mx-auto max-w-7xl"
            >
                {
                    hotels.map((hotel, index) => (
                        <SwiperSlide key={hotel.id}>
                            <Card
                                isFooterBlurred
                                radius="lg"
                                className="border-none"
                                data-aos="fade-up" data-aos-duration="3000"
                            >
                                <div className='contentImg'>
                                    {featuredMedias[index] && featuredMedias[index].id === hotel.featured_media ? (
                                        <Image
                                            alt={featuredMedias[index].slug}
                                            className="object-cover"
                                            height={300}
                                            src={featuredMedias[index].source_url.replace("https://", "http://")}
                                        />
                                    ) : (
                                        <Skeleton className="chargeImgListe" />
                                    )}
                                </div>
                                <CardFooter className="before:bg-white/10 block border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10 border-t-4 border-amber-400">
                                    {/* <p className="text-tiny text-white/80">Available soon.</p> */}
                                    <div className='flex flex-col'>
                                        <div className='text-left pl-2 text-lg font-bold'><h2>{hotel.title}</h2></div>
                                        <div className='text-left pl-2 text-sm pb-5'>{types[index] && <p>{types[index].name}</p>}</div>
                                        <div className='flex flex-row justify-between'>
                                            <div></div>
                                            <div className='flex flex-row items-center space-x-2'>
                                                <div><FaStar className='w-4 h-4 text-black' /></div>
                                                <div><FaStar className='w-4 h-4 text-black' /></div>
                                                <div><FaStar className='w-4 h-4 text-black' /></div>
                                                <div><FaStar className='w-4 h-4 text-black' /></div>
                                                <div><FaStar className='w-4 h-4 text-black' /></div>
                                            </div>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* {galleries.map(gallery => (
                    <img key={gallery.id} src={gallery.source_url} alt={gallery.title} />
                ))} */}
                        </SwiperSlide>
                    ))
                }
            </Swiper>

            <div className='mx-auto max-w-7xl mt-20'>
                <div></div>
                <div></div>
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper second"
                >
                    {
                        hotels.slice(0, 2).map((hotel, index) => (
                            <SwiperSlide key={hotel.id}>
                                <div className='flex flex-row space-x-10'>
                                    <div className='contentImgsecond'>
                                        {featuredMedias[index] && featuredMedias[index].id === hotel.featured_media ? (
                                            <Image
                                                alt={featuredMedias[index].slug}
                                                className="object-cover"
                                                height={400}
                                                src={featuredMedias[index].source_url.replace("https://", "http://")}
                                            />
                                        ) : (
                                            <Skeleton className="chargeImgListe" />
                                        )}
                                    </div>
                                    {/* Affichez le contenu de l'hôtel ici */}
                                    <div className='flex flex-col space-y-4 mt-5'>
                                        <div className='text-left text-amber-500'>{types[index] && <p>{types[index].name}</p>}</div>
                                        <div className='text-3xl font-bold text-left'><div dangerouslySetInnerHTML={{ __html: hotel.title }} /></div>
                                        <div className='w-96 text-left text-sm'>
                                            <div dangerouslySetInnerHTML={{ __html: hotel.content }} />
                                        </div>
                                        <div >
                                            <div className='flex flex-row justify-between'>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='text-5xl font-semibold'>
                                                        <CountUp 
                                                            start={0} 
                                                            end={255} 
                                                            duration={5} 
                                                        />+
                                                    </div>
                                                    <div>Vue</div>
                                                </div>
                                                <div className='flex flex-col space-y-2'>
                                                    <div className='text-5xl font-semibold'>4</div>
                                                    <div>Note</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))
                    }

                </Swiper>
            </div>
        </div>
    );
}
