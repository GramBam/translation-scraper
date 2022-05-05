const puppeteer = require("puppeteer");
const fs = require("fs");
const queries = ["My Name is", 'Hello', 'Dog', 'Apple'];
const translations = []

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 0; i < queries.length; i++) {
    let query = encodeURI(queries[i]);

    await page.goto(`https://translate.google.ca/?sl=en&tl=zh-TW&text=${query}&op=translate`);
    await page.waitForSelector(".Q4iAWc");

    let english = await page.$eval(".D5aOJc.Hapztf", (el) => el.textContent);
    let mandarin = await page.$eval(".dePhmb .kO6q6e", (el) => el.textContent);
    let characters = await page.$eval(".Q4iAWc", (el) => el.textContent);

    translations.push({ english, mandarin, characters })
  }
  await browser.close();

  console.log(translations);

  fs.writeFileSync('data.js', JSON.stringify(translations));
}

scrape();