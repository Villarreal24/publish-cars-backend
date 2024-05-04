import express from "express";
import puppeteer from "puppeteer";
import MessageResponse from "../interfaces/MessageResponse";
import { login, fillForm } from "../puppeteer/puppeteerUtils";

const router = express.Router();

router.post<{}, MessageResponse>("/publish", async (req, res) => {
  const { price, description } = req.body;
  let browser = await puppeteer.launch({ headless: true });

  const baseUrl = process.env.BASE_URL;
  const loginUrl = process.env.LOGIN_URL;
  const user = process.env.USER_EMAIL;
  const password = process.env.PASSWORD;

  try {
    let page = await browser.newPage();
    ({ page } = await login(user, password, loginUrl, page));

    // ======= REDIRECT TO FORM TO PUBLISH =======
    await page.goto(`${baseUrl}wizard?f_dealer_id=-1`, {
      waitUntil: "networkidle0",
    });

    // ==== CALL FUNCTION TO FILL FORM ====
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

export default router;
