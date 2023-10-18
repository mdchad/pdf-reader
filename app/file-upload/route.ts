import {NextRequest, NextResponse} from "next/server";
import readDoc from "@/lib/readDoc";
import {run} from "@/lib/github";

export async function POST(req: NextRequest) {
  console.log('request comingggg')
  // const pages = (await req.json())
  // const file = req.file.buffer;
  // console.log('helllooooo')
  // console.log(req.body)
  const formData = await req.formData();

  // Get file from formData
  const file = formData.get('file');
  const fileName = formData.get('fileName');

  // const runGithub = run()

  // if (file instanceof Blob) {
  //   // Convert file to stream
    const a = await readDoc(file, fileName)
  //   console.log('================')
  //   console.log(a)
  //   console.log('================')
  //
  //   // const stream = file.stream();
  //   //
  //   // // Convert stream to buffer
  //   // const chunks = [];
  //   // for await (const chunk of stream) {
  //   //   chunks.push(chunk);
  //   // }
  //   // const buffer = Buffer.concat(chunks);
  // }
  return NextResponse.json({
    success: false,
    message: "At least one PDF page required",
  })
}