import {NextRequest, NextResponse} from "next/server";
import readDoc from "@/lib/readDoc";
import {run} from "@/lib/github";
import {promises as fs} from "fs";
import path from "path";


export async function POST(req: NextRequest) {
  const body = await req.json();
  const checkArray = Array.isArray(body)
  const data = await fs.readFile(
    path.join(process.cwd(), "data/message.json")
  )

  const task = JSON.parse(data.toString())

  const filtered = checkArray ? task.filter(d => !body.includes(d.id)) : task.filter(d => d.id !== body)

  const writeData = await fs.writeFile(
    path.join(process.cwd(), "data/message.json"),
    JSON.stringify(filtered, 0, 2)
  )

  return NextResponse.json({
    success: true,
    message: "Success",
  })
}