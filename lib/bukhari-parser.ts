// @ts-nocheck

import {v4 as uuidv4} from "uuid";

async function bukhariParser(text, chapters) {
  const regex = /(?<=\n|^)(\d+(?:\.?\s?|\s?[-–]\s)(?!Bab).*?)(?=\n\d+(?:\.?\s?|\s?[-–]\s)|\n|$)/gs;
  // const regex = /\n\s*(\d+[-–]?(?!\s*Bab\b)\S.*?)\n/g;
  // const regex = /(?<=\n|^)\s*(\d+)\s*[-–]?(.*?)\n(?=\d+\s*[-–]?|\n|$)/gs;

  const arabicRegex = /[\u0600-\u06FF]/;

  const splitText = text.match(regex).map((match, index, arr) => {
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
      book_id: 'ad6a2cc8-f34b-476b-9b7e-6756a3b7d43e',
      book_name: 'sahih_bukhari',
      book_title: {
        en: '',
        ms: 'Sahih Bukhari',
        ar: ''
      },
    }
  });

  const mergedObjects = [];

  for (let i = 0; i < splitText.length; i++) {
    const currentObject = splitText[i];
    const currentContent = currentObject.content;

    // Check if the current content has a number at the beginning
    const numberMatch = currentContent.ar.match(/^\d+/);
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

export default bukhariParser