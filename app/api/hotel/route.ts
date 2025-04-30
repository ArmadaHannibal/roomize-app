import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import puppeteer from 'puppeteer';

const agent = new https.Agent({
    rejectUnauthorized: false
});

type HotelItem = {
    id: number;
    title: string;
    date: string;
    link: string;
    content: string;
    featured_media: number;
    gallery: string[];
    address: string;
    latitude: string;
    longitude: string;
    featured: boolean;
};

type ImageItem = {};

type MetaData = {
    [key: number]: {
        meta: string;
    };
};

function removeQueryParam(url: string, param: string): string {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(param);
    return urlObj.toString();
}

async function fetchImageDetails(imageId: string): Promise<string> {
    try {

        const response = await axios.get(`https://kwrite.rf.gd/wp-json/wp/v2/media/${imageId}`, { httpsAgent: agent });

        // Extraire l'URL de redirection du HTML si possible
        const redirectUrlMatch = response.data.match(/location\.href="(.*?)"/);

        if (redirectUrlMatch && redirectUrlMatch[1]) {
            const redirectUrl = redirectUrlMatch[1];
            // Nettoyer l'URL de redirection en supprimant les paramètres indésirables
            const NewredirectUrl = removeQueryParam(redirectUrl, 'i');
            // console.log('Redirect URL:', NewredirectUrl);

            // Faire une nouvelle requête à l'URL de redirection si nécessaire
            const finalResponse = await axios.get(NewredirectUrl, { httpsAgent: agent });

            return finalResponse.config.url || '';
        }

        return ''; // Si aucune redirection n'est trouvée
    } catch (error) {
        console.error(`Error fetching image details for ID ${imageId}:`, error);
        return '';
    }
}

// Exemple d'utilisation
fetchImageDetails('50').then(url => console.log('Final URL:', url));

export async function GET() {
    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
        });

        const browserMeta = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            ignoreHTTPSErrors: true,
        });

        const hotelsResponse = await browser.newPage();
        const hotelsResponseMeta = await browserMeta.newPage();

        await hotelsResponse.goto('https://kwrite.rf.gd/wp-json/wp/v2/tf_hotel', {
            waitUntil: 'networkidle2',
        });

        await hotelsResponseMeta.goto('https://kwrite.rf.gd/wp-json/hotelmeta/v1/all-hotels/', {
            waitUntil: 'networkidle2',
        });

        const data: HotelItem[] = await hotelsResponse.evaluate(() => {
            const preElement = document.querySelector('pre');
            if (preElement) {
                try {
                    return JSON.parse(preElement.innerText);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return [];
                }
            } else {
                console.error('No <pre> element found');
                return [];
            }
        });

        const dataMeta: MetaData[] = await hotelsResponseMeta.evaluate(() => {
            const preElementMeta = document.querySelector('pre');
            if (preElementMeta) {
                try {
                    return JSON.parse(preElementMeta.innerText);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    return [];
                }
            } else {
                console.error('No <pre> element found');
                return [];
            }
        });

        console.log(data);

        await browser.close();
        await browserMeta.close();

        // Move the function declaration to the top level
        function extractMetaInfo(metaString: string) {
            // console.log('metaString:', metaString); // Ajoutez ceci pour vérifier la valeur et le type

            // Assurez-vous que metaString est bien une chaîne de caractères
            if (typeof metaString !== 'string') {
                throw new TypeError('Expected a string for metaString');
            }

            const galleryMatch = metaString.match(/s:7:"gallery";s:\d+:"([\d,]+)";/);
            const galleryIds = galleryMatch ? galleryMatch[1].split(',') : [];

            const featuredMatch = metaString.match(/s:8:"featured";s:\d+:"(\d?)"/);
            const featured = featuredMatch ? featuredMatch[1] === '1' : false;

            const addressMatch = metaString.match(/s:7:"address";s:\d+:"([^"]+)"/);
            const address = addressMatch ? addressMatch[1] : 'Adresse non disponible';

            const latitudeMatch = metaString.match(/s:8:"latitude";s:\d+:"([^"]+)"/);
            const latitude = latitudeMatch ? latitudeMatch[1] : 'Latitude non disponible';

            const longitudeMatch = metaString.match(/s:9:"longitude";s:\d+:"([^"]+)"/);
            const longitude = longitudeMatch ? longitudeMatch[1] : 'Longitude non disponible';

            return { galleryIds, featured, address, latitude, longitude };
        }

        // Créer un objet pour associer les métadonnées aux hôtels
        const metaMap = new Map<number, { post_id: number; meta: any }>(
            Object.entries(dataMeta).map(([id, { post_id, meta }]) => {
                const extractedMeta = extractMetaInfo(meta.tf_hotels_opt[0] as string); // Assurez-vous que meta est une chaîne
                // console.log(meta.tf_hotels_opt[0] as string);
                // console.log('ID:', id, 'Post ID:', post_id, 'Extracted Meta:', extractedMeta);
                return [parseInt(post_id), { post_id, meta: extractedMeta }];
            })
        );

        // console.log('metaMap:', Array.from(metaMap.entries()));

        // Combiner les informations de base avec les métadonnées
        const detailedHotels: HotelItem[] = await Promise.all(data.map(async (hotel: any) => {
            const metaInfo = metaMap.get(hotel.id)?.meta || {};
            const { galleryIds = [], featured = false, address = 'Adresse non disponible', latitude = 'Latitude non disponible', longitude = 'Longitude non disponible' } = metaInfo;

            const galleryUrls = await Promise.all(galleryIds);
            console.log(galleryUrls);
            return {
                id: hotel.id,
                title: hotel.title?.rendered || 'Titre non disponible',
                date: hotel.date || 'Date non disponible',
                link: hotel.link || 'Lien non disponible',
                content: hotel.content?.rendered || 'Contenu non disponible',
                featured_media: hotel.featured_media || 0,
                gallery: galleryUrls,
                address,
                latitude,
                longitude,
                featured,
                type: hotel._links['wp:term'][2].href
            };
        }));

        // console.log(detailedHotels);

        return NextResponse.json(detailedHotels);
        
    } catch (error) {
        console.error('Error fetching hotels:', error);
        // Afficher des détails d'erreur plus spécifiques
        return NextResponse.json({ error: 'Failed to fetch hotels', details: error.response?.data || error.message }, { status: 500 });
    }
}

