import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

type MenuItem = {
  ID: number;
  post_author: string;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: string;
  comment_status: string;
  ping_status: string;
  post_password: string;
  post_name: string;
  to_ping: string;
  pingé: string;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: string;
  post_parent: number;
  guid: string;
  menu_order: number;
  post_type: string;
  post_mime_type: string;
  comment_count: string;
  filtre: string;
  db_id: number;
  menu_item_parent: string;
  object_id: string;
  objet: string;
  type: string;
  type_label: string;
  titre: string;
  url: string;
  cible: string;
  attr_title: string;
  description: string;
  classes: string[];
  xfn: string;
};

export async function GET() {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.goto('https://kwrite.rf.gd/wp-json/menus/v1/menus/17', {
      waitUntil: 'networkidle2',
    });

    const data: MenuItem[] = await page.evaluate(() => {
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

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
