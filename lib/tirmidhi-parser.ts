// @ts-nocheck

import {v4 as uuidv4} from "uuid";

const arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
function convertNumbers(str) {
  if(typeof str[0] === 'string') {
    for (let i=0; i<10; i++) {
      str[0] = str[0].replace(arabicNumbers[i], i);
    }
  }
  return str;
};

async function tirmidhiParser(text, chapters) {
  // const regex = /(?<=\n|^)([٠-٩\d]+(?:\.?\s?|\s?[-–]\s)(?!Bab\b).*?)(?=\n[٠-٩\d]+(?:\.?\s?|\s?[-–]\s)|\n|$)/gs;
  // const regex = /(?<=\n|^)([٠-٩\d]+(?:\.?\s?|\s?[-–]\s)(?!بَابٌ\b).*?)(?=\n[٠-٩\d]+(?:\.?\s?|\s?[-–]\s)|\n|$)/gs;
  // const regex = /(?<=\n|^)([٠-٩\d]+(?:\.?\s?|\s?[-–]\s)(?!بَابٌ\b)[\s\S]*?)(?=\n[٠-٩\d]+(?:\.?\s?|\s?[-–]\s)|\n|$)/g;
  // const regex = /(?:(?<=\n|^)[٠-٩\d]+\s*–.*?(?=\n[٠-٩\d]+\s*–|\n|$)|(?<=\n|^)\d+\s*-\s*.*?(?=\n\d+\s*-\s*|\n|$))/gs;
  // const regex = /([٠-٩\d]+\s*–.*?(?=\n[٠-٩\d]+\s*–|\n|$)|(?<=^|\n)\d+\s*-\s*.*?(?=\n\d+\s*-\s*|$))/gs;
  // const regex = /(?<=^|\n)[٠-٩\d]+\s*–.*?(?=\n[٠-٩\d]+\s*–|\n|$)|(?<=^|\n)\d+\s*-\s*.*?(?=\n\d+\s*-\s*|\n|$)/g
  const regex = /(?:(?<=^|\n)(?:[٠-٩\d]+\s*–.*?|\d+\s*-\s*).*?(?=\n(?:[٠-٩\d]+\s*–|\d+\s*-\s*)|\n|$))/gs;
  // const regex = /(?:^|\n)(?:[٠-٩\d]+\s*–|\d+\s*-)[\s\S]*?(?=(?:\n(?:[٠-٩\d]+\s*–|\d+\s*-))|$)/g


  const arabicRegex = /[\u0600-\u06FF]/;

  const splitText = text.match(regex).map((match, index, arr) => {
    if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4) {
      console.log('match === ', match)
      console.log('+++++++++++++++++++++++++++++++')
    }
    let contentLanguage: any = {};

    if (arabicRegex.test(match)) {
      contentLanguage['ar'] = match;
    } else {
      contentLanguage['ms'] = match;
    }

    return {
      id: uuidv4(),
      footnotes: [],
      number: null,
      content: {
        en: '',
        ms: '',
        ar: '',
        ...contentLanguage
      },
      chapter_id: '',
      chapter_name: '',
      chapter_title: {
        en: '',
        ms: '',
        ar: ''
      },
      volume_id: '',
      volume_name: '',
      volume_title: {
        en: '',
        ms: '',
        ar: ''
      },
      book_id: "c4d5ea38-2090-4f28-8ca3-40bb2639d502",
      book_name: "jami_al_tirmidhi",
      book_title: {
        en: '',
        ms: 'Jami’ Al-Tirmidhi',
        ar: ''
      }
    }
  });

  const mergedObjects = [];

  for (let i = 0; i < splitText.length; i++) {
    const currentObject = splitText[i];
    const currentContent = currentObject.content;

    const babRegex = /^.*[٠-٩\d].*[-–].*Bab.*$/gm;
    const babArabicRegex = /^[٠-٩\d]+\s*–\s*بَابٌ/;
    const regex = /^بَابٌ.*$/gm;

    // const matches = currentContent.ms.match(babRegex);
    // const arabicMatches = currentContent.ar.match(babArabicRegex);
    // const arabic1Matches = currentContent.ar.match(regex);
    // if (arabicMatches || arabic1Matches || matches) {
    //   // console.log(matches)
    //   // console.log(matches)
    //   // console.log('1', arabic1Matches)
    //   // console.log('2', arabicMatches)
    //   // console.log('3', matches)
    //   continue
    // }

    // Check if the current content has a number at the beginning
    let numberMatch
    numberMatch = currentContent.ar.match(/^\d+/);
    const arabicNumberMatch = currentContent.ar.match(/^([٠-٩]+)/);
    if (arabicNumberMatch) {
      numberMatch = convertNumbers(arabicNumberMatch)
    }

    if (numberMatch) {
      const currentNumber = numberMatch[0];

      // Check if the next object exists and has a content with the same number
      if (i + 1 < splitText.length) {
        const nextObject = splitText[i + 1];
        const nextContent = nextObject.content;

        const nextNumberMatch = nextContent.ms.match(/^\d+/);
        if (nextNumberMatch && nextNumberMatch[0] === currentNumber) {
          let currentChapter = chapters.find(chapter => chapter.numbers.has(parseInt(currentNumber)))
          // Merge the content of the current and next objects
          currentContent.ms += nextContent.ms;
          currentContent.ar += nextContent.ar;
          currentObject.number = currentNumber
          if (currentChapter) {
            currentObject.chapter_title.ms = currentChapter.ms
            currentObject.chapter_title.ar = currentChapter.ar
            currentObject.chapter_id = currentChapter.id
          }
          // Skip the next object since it has been merged
          i++;
        }
      }

      // Add the merged object to the result array
      mergedObjects.push(currentObject);
    }
  }

  return mergedObjects
}

export default tirmidhiParser