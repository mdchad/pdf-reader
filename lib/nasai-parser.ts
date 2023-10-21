// @ts-nocheck

import {v4 as uuidv4} from "uuid";

function nasaiParser(text) {
  const regex = /(?<=\n|^)\s*(\d+(?:\s?[-–]\s?|\s)\s*|\-\s*\d+\s|\d+)\s*[-–]?(.*?)\n(?=\d+(?:\.?\s?|\s?[-–]\s)|\n|$)/gs

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
      book_name: 'sunan_nasai',
      book_title: {
        en: '',
        ms: 'Sunan Nasai',
        ar: ''
      },
    }
  });
  //
  const mergedObjects = [];

  for (let i = 0; i < splitText.length; i++) {
    const currentObject = splitText[i];
    const currentContent = currentObject.content;

    // Check if the current content has a number at the beginning
    const numberMatch = currentContent.ar.match(/^(?:[-–]\s*)?(\d+)/);
    if (numberMatch) {
      const currentNumber = numberMatch[0].replace(/[-–]\s*/, '');
      currentContent.number = currentNumber

      // Check if the next object exists and has a content with the same number
      if (i + 1 < splitText.length) {
        const nextObject = splitText[i + 1];
        const nextContent = nextObject.content;

        const nextNumberMatch = nextContent.ms.match(/^\d+/);
        if (nextNumberMatch && nextNumberMatch[0] === currentNumber) {
          // Merge the content of the current and next objects
          currentContent.ms += nextContent.ms;
          currentContent.ar += nextContent.ar;

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

export default nasaiParser