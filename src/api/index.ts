import express from "express";
import puppeteer from "puppeteer";
import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import { login, fillForm } from "../puppeteer/puppeteerUtils";

const router = express.Router();

const baseUrl = "https://www.seminuevos.com/";
const loginUrl = "https://admin.seminuevos.com/login";

const user = "luis.villarreal.lavr@gmail.com";
const password = "*Seminuevos200@";

router.get<{}, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.post<{}, MessageResponse>("/publish", async (req, res) => {
  const { price, description, images } = req.body;
  console.log("BODY: ", req.body);
  console.log("IMAGES: ", images);
  let browser = await puppeteer.launch({ headless: true });

  try {
    let page = await browser.newPage();
    ({ page } = await login(user, password, loginUrl, page));

    // ======= REDIRECT TO FORM TO PUBLISH =======
    await page.goto("https://www.seminuevos.com/wizard?f_dealer_id=-1", {
      waitUntil: "networkidle0",
    });

    ({ browser, page } = await fillForm(price, description, page, browser));

    await page.waitForSelector("button.next-button:not(.back)");
    await page.click("button.next-button:not(.back)");
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    // ==== GET CURRENT URL ====
    let currentUrl = page.url();
    console.log("CURRENT URL: ", currentUrl);

    // ==== DELETE "/plans" OF THE CURRENT URL =====
    currentUrl = currentUrl.replace("/plans", "");
    console.log("DELETE /PLANS: ", currentUrl);
    console.log("Redirection to publish");

    // ===== NAVIGATE TO URL WITHOUT '/PLANS'
    await page.goto(currentUrl, { waitUntil: "networkidle0" });

    console.log("Capture screenshot");
    // ===== TAKE SCREENSHOT =====
    const screenshot = await page.screenshot({ encoding: "base64" });

    await browser.close();

    res.json({ message: "Carro publicado correctamente", image: screenshot });
  } catch (error) {
    console.error(error);
    const errorMessage: MessageResponse = {
      message: `Something fail: ${error}`,
    };
    res.status(500).json(errorMessage);
  } finally {
    await browser.close();
  }
});

router.use("/emojis", emojis);

export default router;
