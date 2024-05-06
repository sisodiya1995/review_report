const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const fs = require("fs-extra");
const path = require("path");

const data = require("./data.json");

const compile = async function (templateName, data) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
  const html = await fs.readFile(filePath, "utf-8");
  return hbs.compile(html)(data);
};

hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
(async function () {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const content = await compile("index", data);
    await page.setContent(content);
    // create a new document
    await page.pdf({
      path: "output.pdf",
      format: "A4",
      printBackground: true,
    });
    console.log("done creating PDF");
    await browser.close();
    process.exit();
  } catch (error) {
    console.log(error);
  }
})();
