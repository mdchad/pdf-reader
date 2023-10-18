import {NextRequest, NextResponse} from "next/server";
import {promises as fs} from "fs";
import path from "path";


export async function POST(req: NextRequest) {
  const res = await req.json();
  console.log('res', res)

  const data = await fs.readFile(
    path.join(process.cwd(), "data-source/muslim-new.json")
  )

  const task = JSON.parse(data.toString())

  task.push(res)

  await fs.writeFile(
    path.join(process.cwd(), "data-source/muslim-new.json"),
    JSON.stringify(task, null, 2)
  )

  return NextResponse.json({
    success: true,
    message: "Success",
  })
}