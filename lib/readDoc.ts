import { DocxLoader } from "langchain/document_loaders/fs/docx";

export default async function readDoc(blob) {
  const loader = new DocxLoader(
    blob
  );

  return await loader.load();
}
