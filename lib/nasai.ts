import {v4 as uuidv4} from "uuid";

async function nasai(text, chapters) {
  // const regex = /(?<=\n|^)(\d+(?:\.?\s?|\s?[-–]\s)(?!بَابُ).*?)(?=\n\d+(?:\.?\s?|\s?[-–]\s)|\n|$)/gs;
  // const regex = /\n\s*(\d+[-–]?(?!\s*Bab\b)\S.*?)\n/g;
  // const regex = /(?<=\n|^)\s*(\d+)\s*[-–]?(.*?)\n(?=\d+\s*[-–]?|\n|$)/gs;
  // const regex = /(?:(?<=^|\n)\s*(?:[٠-٩\d]+\s*–.*?|\d+\s*-\s*).*?(?=\n\s*(?:[٠-٩\d]+\s*–|\d+\s*-\s*)|\n|$))/gs;
  // const regex = /(?<=^|\n)\s*(?:[–—-]\s*\d+|\d+\s*[–—-]\s*).*?(?=\n\s*(?:\d+\s*[–—-]\s*|[–—-])|\n|$)/g
  const regex = /(?<=^|\n)\s*[–—-]\s*\d+.*?(?=\n\s*[–—-]\s*\d+|\n|$)/gs

  const arabicRegex = /[\u0600-\u06FF]/;

  const splitText = text.match(regex).map((match, index, arr) => {
    let contentLanguage: any = {};

    if (arabicRegex.test(match)) {
      contentLanguage['ar'] = match.trim();
    } else {
      contentLanguage['ms'] = match.trim();
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
      book_id: '6dc30e76-a364-46ba-80a1-ba9713c80938',
      book_name: 'sunan_an_nasai',
      book_title: {
        en: '',
        ms: 'Sunan An-Nasa’i',
        ar: ''
      },
    }
  });

  // return splitText

  const mergedObjects = [];

  for (let i = 0; i < splitText.length; i++) {
    const currentObject = splitText[i];
    const currentContent = currentObject.content;

    // Check if the current content has a number at the beginning
    const numberMatch = currentContent.ar.match(/^\d+/);
    const numberMsMatch = currentContent.ms.match(/^\d+/);
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

export default nasai