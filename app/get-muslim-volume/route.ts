import {NextRequest, NextResponse} from "next/server";
import {promises as fs} from "fs";
import path from "path";


export async function GET(req: NextRequest) {
  const data = await fs.readFile(
    path.join(process.cwd(), "data-source/muslim-volume.json")
  )

  const dataParse = JSON.parse(data.toString())

  return NextResponse.json({
    success: true,
    data: dataParse
  })
}