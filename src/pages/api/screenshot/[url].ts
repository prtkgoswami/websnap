// pages/api/screenshot.js
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  const queryParts = (url as string).split("_");
  const decodedUrl = decodeURIComponent(queryParts[0]);
  const mode = queryParts[1];

  const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
  });
  const page = await browser.newPage();

  try {
    await page.setViewport(
      mode === "desktop"
        ? { width: 2560, height: 1440 }
        : { width: 540, height: 960 }
    );
    await page.goto(decodedUrl, { waitUntil: "networkidle2" });

    const screenshotBuffer = await page.screenshot();
    res.setHeader("Content-Type", "image/png");
    res.send(screenshotBuffer);
  } catch (error) {
    res.status(500).json({ error: "Error capturing screenshot" });
  } finally {
    await browser.close();
  }
};
