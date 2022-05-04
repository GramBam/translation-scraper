import fetch from "node-fetch"
import cheerio from "cheerio"
import fs from 'fs'

const getRawData = (URL) => {
  return fetch(URL)
    .then((response) => response.text())
    .then((data) => {
      return data;
    });
};

const words = ['apple', 'chair', 'guitar', 'watermelon', 'umbrella', 'candy', 'fish']
const translation = []

const getData = async () => {
  for (let i = 0; i < words.length; i++) {
    const URL = "https://chinese.yabla.com/chinese-english-pinyin-dictionary.php?define=" + words[i];
    const data = await getRawData(URL);
    const $ = cheerio.load(data);

    const eng = $("input.form-control")[0].attribs.value
    const cn = $("span.pinyin")[0].children[0].data

    let characters = []
    let children = $("span.word")[0].children
    for (let j = 0; j < children.length; j++) {
      if (children[j].next && children[j].next.attribs && children[j].next.attribs.href) {
        characters.push($("span.word")[0].children[j].next.attribs.href.split('=')[1])
      }
    }

    translation.push({ english: eng, mandarin: cn, characters: characters.join('') })
  }

  console.log(translation);
  fs.writeFileSync('data.js', JSON.stringify(translation));
};

getData();