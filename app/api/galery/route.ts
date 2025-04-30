import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import puppeteer from 'puppeteer';

const agent = new https.Agent({
    rejectUnauthorized: false
});

type Galery = {
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

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const ids = searchParams.get('ids'); // Utilise 'ids' pour un tableau d'IDs

    if (!ids) {
        return NextResponse.json({ error: 'IDs manquants' }, { status: 400 });
    }

    const idArray = ids.split(','); // Convertit la chaîne d'IDs en tableau
    const results: Galery[] = [];

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
    });

    try {
        for (const id of idArray) {
            const page = await browser.newPage();
            await page.goto(`https://kwrite.rf.gd/wp-json/wp/v2/media/${id}`, {
                waitUntil: 'networkidle2',
            });

            const data: Galery = await page.evaluate(() => {
                const preElement = document.querySelector('pre');
                if (preElement) {
                    try {
                        return JSON.parse(preElement.innerText);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        return null;
                    }
                } else {
                    console.error('No <pre> element found');
                    return null;
                }
            });

            if (data) {
                results.push(data);
            }

            await page.close(); // Ferme la page après chaque itération pour économiser de la mémoire
        }

        await browser.close();      

        return NextResponse.json(results, { status: 200 });

    } catch (error) {
        await browser.close();
        console.error('Erreur lors de la récupération des données media:', error.message);
        return NextResponse.json({ error: `Erreur interne du serveur: ${error.message}` }, { status: 500 });
    }
}
