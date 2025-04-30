'use client';

import { useEffect } from 'react';
import { Input } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import AOS from 'aos';


import { FaHotel } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import 'aos/dist/aos.css';


export const FiltreHomeSearch = () => {

    useEffect(() => {
        AOS.init({
            // Options here
            duration: 1000,
        });
    }, []);

    return <>
        <div className="absolute flex justify-center items-center contentfiltreHome" data-aos="fade-up" data-aos-duration="3000">
            <form>
                <div className="flex flex-row items-center space-x-10 text-black">
                    <div>
                        <div className="mb-2">
                            Nom de l'hôtel
                        </div>
                        <div>
                            <Input
                                type="text"
                                placeholder="Saisir le nom de l'hôtel"
                                labelPlacement="outside"
                                startContent={
                                    <FaHotel className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                }
                            />
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            Emplacement
                        </div>
                        <div>
                            <Select
                                className="max-w-xs"
                                // defaultSelectedKeys={["cat"]}
                                placeholder="Select an animal"
                                startContent={<FaLocationDot className="text-gray-500" />}
                            >
                                <SelectItem key='Tous'>Tous</SelectItem>
                                {/* {animals.map((animal) => (
                                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                                ))} */}
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            Type d'hôtel
                        </div>
                        <div>
                            <Select
                                className="max-w-xs"
                                // defaultSelectedKeys={["cat"]}
                                placeholder="Select an animal"
                                startContent={<FaLocationDot className="text-gray-500" />}
                            >
                                <SelectItem key='Tous'>Tous</SelectItem>
                                {/* {animals.map((animal) => (
                                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                                ))} */}
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">
                            Classement
                        </div>
                        <div>
                            <Select
                                className="max-w-xs"
                                // defaultSelectedKeys={["cat"]}
                                placeholder="Select an animal"
                                startContent={<FaLocationDot className="text-gray-500" />}
                            >
                                <SelectItem key='Tous'>Tous</SelectItem>
                                {/* {animals.map((animal) => (
                                    <SelectItem key={animal.key}>{animal.label}</SelectItem>
                                ))} */}
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center mt-8">
                        <Button color="primary" variant="faded">
                            Rechercher
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    </>
}