import {v4 as uuidv4} from "uuid";

async function extractChaptersAndContent(doc) {
  const lines = doc.split(/\r?\n/).filter((line) => line.trim() !== "");
  const chapters = new Map();
  let currentChapter = { ar: '', ms: '', numbers: new Set(), id: "" };

  for (const line of lines) {
    if (line.startsWith("بَابُ") || line.startsWith("بَابٌ:") || line.startsWith("باب") || line.startsWith("بَاب")) {
      if (currentChapter !== null) {
        chapters.set(currentChapter.ar, currentChapter);
      }

      currentChapter = {
        ar: line.trim(),
        ms: "",
        numbers: new Set(),
        id: uuidv4()
      };
    } else if (/^\d+\s*-\s*/.test(line)) {
      const contentNumber = Number(line.match(/^\d+/)[0]);
      currentChapter.numbers.add(contentNumber);
    } else if (line.trim() !== "") {
      if (currentChapter !== null) {
        if (currentChapter.ms === "") {
          currentChapter.ms = line.trim();
        }
      }
    }
  }

  if (currentChapter !== null) {
    chapters.set(currentChapter.ar, currentChapter);
  }

  return Array.from(chapters.values());
}

export default extractChaptersAndContent