export async function login(
  user?: string,
  password?: string,
  loginUrl?: string,
  page?: any
) {
  await page.goto(loginUrl);
  console.log(user);
  console.log(password);
  console.log("Start login");
  await page.type("input[id=email]", user);
  await page.type("input[id=password]", password);

  await Promise.all([
    page.click("button[type=submit]"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
  console.log("Finish login, home page");
  return { page };
}

export async function fillForm(
  price: string,
  description: string,
  page: any,
  browser: any
) {
  console.log("Start fill form");

  await page.waitForSelector(".latam-dropdown-content#dropdown_brands");
  // ==== TIMEOUT TO BE SURE THAT THE FORM IS LOADED ====
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // ========= BRAND SELECTION ==========
  await page.click('.latam-dropdown-button[data-activates="dropdown_brands"]');
  await page.click('#dropdown_brands li[data-content="acura"] a');
  console.log("Finish BRAND selection");

  // ========= MODEL SELECTION ==========
  // WAIT TO BE UPDATED THE MODEL SELECT
  await page.waitForFunction(() => {
    // Verificar si la lista de modelos se ha actualizado
    const modelDropdown = document.querySelector("#dropdown_models");
    return modelDropdown && modelDropdown.querySelectorAll("li").length > 1;
  });

  await page.waitForSelector("#dropdown_models");
  await page.click('.latam-dropdown-button[data-activates="dropdown_models"]');

  // Esperar a que el menú desplegable esté presente en la página
  await page.click('#dropdown_models li[data-content="ilx"] a');
  console.log("Finish MODEL selection");

  // ========= SUBTYPE SELECTION ==========
  // WAIT TO BE UPDATED THE SUBTYPE SELECT
  await page.waitForFunction(() => {
    // Verificar si la lista de modelos se ha actualizado
    const modelDropdown = document.querySelector("#dropdown_subtypes");
    return modelDropdown && modelDropdown.querySelectorAll("li").length > 1;
  });

  await page.click(
    '.latam-dropdown-button[data-activates="dropdown_subtypes"]'
  );

  // Esperar a que el menú desplegable esté presente en la página
  await page.waitForSelector("#dropdown_subtypes");
  await page.click('#dropdown_subtypes li[data-content="sedan"] a');
  console.log("Finish SUBTYPE selection");

  // ========= YEAR SELECTION ==========
  // WAIT TO BE UPDATED THE YEAR SELECT
  await page.waitForFunction(() => {
    // Verificar si la lista de modelos se ha actualizado
    const modelDropdown = document.querySelector("#dropdown_years");
    return modelDropdown && modelDropdown.querySelectorAll("li").length > 1;
  });

  await page.click('.latam-dropdown-button[data-activates="dropdown_years"]');

  // Esperar a que el menú desplegable esté presente en la página
  await page.waitForSelector("#dropdown_years");
  await page.click('#dropdown_years li[data-content="2018"] a');
  console.log("Finish YEAR selection");

  // ========= STATE SELECTION ==========
  // WAIT TO BE UPDATED THE STATE SELECT
  await page.waitForFunction(() => {
    // Verificar si la lista de modelos se ha actualizado
    const modelDropdown = document.querySelector("#dropdown_provinces");
    return modelDropdown && modelDropdown.querySelectorAll("li").length > 1;
  });

  await page.click(
    '.latam-dropdown-button[data-activates="dropdown_provinces"]'
  );

  // Esperar a que el menú desplegable esté presente en la página
  await page.waitForSelector("#dropdown_provinces");
  await page.click('#dropdown_provinces li[data-content="nuevo leon"] a');
  console.log("Finish STATE selection");

  // ========= CITIES SELECTION ==========
  // WAIT TO BE UPDATED THE CITIES SELECT
  await page.waitForFunction(() => {
    // Verificar si la lista de modelos se ha actualizado
    const modelDropdown = document.querySelector("#dropdown_cities");
    return modelDropdown && modelDropdown.querySelectorAll("li").length > 1;
  });

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  // Esperar un breve momento para que se complete el desplazamiento
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await page.click('.latam-dropdown-button[data-activates="dropdown_cities"]');

  // Esperar a que el menú desplegable esté presente en la página
  await page.waitForSelector("#dropdown_cities");
  // Desplazarse hasta el elemento para asegurarse de que esté dentro de la ventana de visualización
  await page.evaluate(() => {
    const element = document.querySelector(".latam-dropdown-content");
    if (element) element.scrollIntoView();
  });
  await page.click('#dropdown_cities li[data-content="monterrey"] a');
  console.log("Finish CITIES selection");

  // ======== INPUT RECORRIDO =========
  await page.waitForSelector("#input_recorrido");
  await page.type("#input_recorrido", "20000");
  console.log("Finish MILEAGE input");

  // ========= MILEAGETYPE SELECTION ==========
  // WAIT TO BE UPDATED THE MILEAGETYPE SELECT
  await page.waitForFunction(() => {
    const modelDropdown = document.querySelector("#dropdown_mileageType");
    return modelDropdown && modelDropdown.querySelectorAll("li").length > 1;
  });

  await page.click(
    '.latam-dropdown-button[data-activates="dropdown_mileageType"]'
  );

  // Esperar a que el menú desplegable esté presente en la página
  await page.waitForSelector("#dropdown_mileageType");
  await page.click('#dropdown_mileageType li[data-content="kms."] a');
  console.log("Finish TYPE MILEAGE selection");

  // ======== INPUT PHONE =========
  // await page.waitForSelector("#input_teléfono");
  // await page.type("#input_teléfono", "662 190 0870");

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight / 2);
  });

  // Esperar un breve momento para que se complete el desplazamiento
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // ======== INPUT PRICE =========
  const stringPrice = String(price);
  await page.waitForSelector("#input_precio");
  await page.type("#input_precio", stringPrice);
  console.log("Finish PRICE input");

  // ======== CLICK THE NEXT BUTTON =========
  await page.waitForSelector(".next-button:not(.disabled)");
  await page.click(".next-button:not(.disabled)");

  await page.waitForSelector("#Uploader");
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  // ======== INPUT DESCRIPTION =========
  await page.waitForSelector("#input_text_area_review");
  await page.type("#input_text_area_review", description);
  console.log("Finish DESCRIPTION input");

  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });

  // Esperar un breve momento para que se complete el desplazamiento
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // ==== UPLOAD FILE IMAGE TO INPUT TYPE IMAGE =====
  const fileInput = await page.$("input[type=file]");
  console.log("Start UPLOAD FILES");
  if (fileInput) {
    const path = require("path");
    const imagePath = path.resolve(__dirname, "../images/acura1.jpeg");
    const imagePath2 = path.resolve(__dirname, "../images/acura2.jpeg");
    const imagePath3 = path.resolve(__dirname, "../images/acura3.jpeg");

    await fileInput.focus();

    await fileInput.uploadFile(imagePath, imagePath2, imagePath3);
  }

  // Obtener el número inicial de imágenes en la lista
  const initialImageCount = await page.$$eval(
    ".image-list img",
    (imgs: Element[]) => imgs.length
  );

  // Esperar a que se agreguen nuevas imágenes a la lista
  await page.waitForFunction(
    `document.querySelectorAll('.image-list img').length > ${initialImageCount}`
  );
  console.log("Finish UPLOAD FILES");

  // Esperar 1 segundo adicionale después de que la página haya cargado completamente
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { browser, page };
}
