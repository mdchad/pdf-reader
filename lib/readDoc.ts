import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { writeFile } from 'node:fs';
import {RegexParser, StructuredOutputParser} from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate
} from "langchain/prompts";
import { z } from "zod";
import {RecursiveCharacterTextSplitter, CharacterTextSplitter, TokenTextSplitter} from "langchain/text_splitter";
import {BufferMemory} from "langchain/memory";
import {ConversationChain, loadQARefineChain, loadQAStuffChain} from "langchain/chains";
import {OpenAIEmbeddings} from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { v4 as uuidv4 } from 'uuid';
import nasaiParser from "@/lib/nasai-parser";
import bukhariParser from "@/lib/bukhari-parser";
import chapterParser from "@/lib/chapter-parser";
import tirmidhiParser from "@/lib/tirmidhi-parser";
import abiDawudParser from "@/lib/abiDawud-parser";
import ibnmajahParser from "@/lib/ibnmajah-parser";
import nasai from "@/lib/nasai";

export default async function readDoc(blob, fileName) {
  try {

    const loader = new DocxLoader(
      blob
    );

    const docs = await loader.load();
    // const embeddings = new OpenAIEmbeddings();
    // const chain = loadQARefineChain(model);

    // const splitter = new TokenTextSplitter({
    //   encodingName: "gpt2",
    //   chunkSize: 4000,
    //   chunkOverlap: 0,
    // });
    //
    // const output = await splitter.splitDocuments(await loader.load())
    // console.log(output)

    // const textSplitter = new CharacterTextSplitter({ separator: "بَابُ", chunkSize: 5000})
    // const textSplitter = new RecursiveCharacterTextSplitter()
    // let document = await loader.loadAndSplit(textSplitter);
    // let document = (await textSplitter.splitDocuments(await loader.load()))
    //
    // const chain = loadQAStuffChain(model);
    // const res = await chain.call({
    //   input_documents: document,
    //   question: 'Apakah itu faraid?'
    // });
    // console.log({ res })

    // const chainA = loadQAStuffChain(model);
    // const docs = [
    //   new Document({ pageContent: "Harrison went to Harvard." }),
    //   new Document({ pageContent: "Ankush went to Princeton." }),
    // ];
    // const resA = await chainA.call({
    //   input_documents: docs,
    //   question: "Where did Harrison go to college?",
    // });
    // console.log("OIIII");
    // console.log({ resA });

    // const textSplitter = new RecursiveCharacterTextSplitter({
    //   chunkSize: 4000,
    //   chunkOverlap: 20,
    // })
    // let docs = (await textSplitter.splitDocuments(await loader.load())).slice(0, 2)
    console.log("+++++++++++++++++++")
    console.log(docs)
    console.log("+++++++++++++++++++")
    //
    // const store = await MemoryVectorStore.fromDocuments(document, embeddings);
    // const question = "How many hadith are there in the document";
    // const relevantDocs = await store.similaritySearch(question);
    //
    // const res = await chain.call({
    //   input_documents: relevantDocs,
    //   question,
    // });
    //
    // console.log(res);

    // const embeddings = new OpenAIEmbeddings();
    // const chain = loadQARefineChain(model);
    //
    // // Load the documents and create the vector store
    // // const loader = new TextLoader("./state_of_the_union.txt");
    // // const docs = await loader.loadAndSplit();
    // const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    //
    // // Select the relevant documents
    // const question = "Siapakah perawi dalam hadith nombor 1616";
    //
    //
    // const relevantDocs = await store.similaritySearch(question);
    //
    // // Call the chain
    // const res = await chain.call({
    //   input_documents: relevantDocs,
    //   question,
    // });
    //
    // console.log(res)

    // const parser = StructuredOutputParser.fromZodSchema(
    //   z.object({
    //     volume: z.object({
    //       ms: z.string().describe("Volume title in Bahasa Melayu language").optional(),
    //       ar: z.string().describe("Volume title in Arabic langugage").optional()
    //     }),
    //     chapter: z.object({
    //       ms: z.string().describe("Chapter title in Bahasa Melayu"),
    //       ar: z.string().describe("Chapter title in Arabic")
    //     }),
    //     hadith_text: z.object({
    //       ms: z.string().describe("The matn of the hadith in Bahasa Melayu language"),
    //       ar: z.string().describe("The matn of the hadith in Arabic langugage")
    //     }),
    //   })
    // );
    //
    // const formatInstructions = parser.getFormatInstructions();
    // console.time('Execution Time for Prompt ID: ');
    //
    // const prompt = new PromptTemplate({
    //   template:
    //     "This is a collection of hadiths.\nExtract information from all the hadiths.\n{format_instructions}\nThe response should be presented in a markdown JSON codeblock.\nEach hadith should be in its own object following the schema.\nPrint the output in array of objects.\nTo identify the content, each hadith starts with a number like this: '1 -(1617)' or '(...)'.\nEach hadith starts with the arabic text first followed by the translation of the text in Bahasa Melayu.\n The chapter of the hadith will start with this arabic word: 'بَابُ'. It will be followed by the translation of chapter the Bahasa Melayu which starts with this word: 'Bab'\nAll the hadiths in this document are in the volume 'KITAB FARAID'.\n\nHadith: {inputText}",
    //   inputVariables: ["inputText"],
    //   partialVariables: { format_instructions: formatInstructions },
    // });
    //
    //
    for (const doc of docs) {
      const text = doc.pageContent
    //   // console.log(doc)
    //   // const input = await prompt.format({
    //   //   inputText: doc.pageContent
    //   // });
    //   // const response = await model.call(input);
    //   // console.log(doc.pageContent.split(" "))
    //
    //
    //   const regex = /(?<=\n|^)(\d+(?:\.?\s?|\s?[-–]\s)(?!Bab).*?)(?=\n\d+(?:\.?\s?|\s?[-–]\s)|\n|$)/gs;
    //   // const regex = /\n\s*(\d+[-–]?(?!\s*Bab\b)\S.*?)\n/g;
    //   // const regex = /(?<=\n|^)\s*(\d+)\s*[-–]?(.*?)\n(?=\d+\s*[-–]?|\n|$)/gs;
    //
    //   /// CHAPTER
    //
    //   // const regex1 = /(\d+\s–\s)?(?:بَابٌ:|بَابُ|باب|bab)[^.\n]*[.?!]?[\s\n]*$/gim;
    //   // const matches = text.match(regex1)
    //
      const chapters = await chapterParser(text)

      const mergedObjects = await nasai(text, chapters)

      const allNumbers = chapters.flatMap((chapter) => Array.from(chapter.numbers));

      function findMissingNumbersForChapter(numbers, totalRange) {
        const set = new Set(numbers);
        const missingNumbers = [];

        for (let i = 1; i <= totalRange; i++) {
          if (!set.has(i)) {
            missingNumbers.push(i);
          }
        }

        return missingNumbers;
      }

      const missingNumbers = findMissingNumbersForChapter(allNumbers, 1664);
      console.log(missingNumbers)

      const content = `${JSON.stringify(mergedObjects, null, 1)}`;
      writeFile(`${fileName}.json`, content, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
    // console.timeEnd('Execution Time for Prompt ID: ');
  } catch (e) {
    console.log(e)
  }

  return null
}