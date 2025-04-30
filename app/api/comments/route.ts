import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import puppeteer from 'puppeteer';

const agent = new https.Agent({
    rejectUnauthorized: false
});

type Comments = {
    id: number,
    date: string,
    post: number,
    author_name: string,
    content: string,
    status: string,
    author: string,
    type: string,
    // Ajoute d'autres propriétés nécessaires
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
    });

    const hotelsResponse = await browser.newPage();

    try {
        await hotelsResponse.goto(`https://kwrite.rf.gd/wp-json/wp/v2/comments?post=${id}`, {
            waitUntil: 'networkidle2',
        });

        const data: Comments[] = await hotelsResponse.evaluate(() => {
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

        await browser.close();

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Erreur lors de la récupération des données media:', error.message);
        return NextResponse.json({ error: `Erreur interne du serveur: ${error.message}` }, { status: 500 });
    }
}
