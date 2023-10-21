import {NextRequest, NextResponse} from "next/server";
import readDoc from "@/lib/readDoc";
import {run} from "@/lib/github";
import {promises as fs} from "fs";
import path from "path";


export async function POST(req: NextRequest) {
  const res = await req.json();

  const data = await fs.readFile(
    path.join(process.cwd(), "data-source/nasai.json")
  )

  const task = JSON.parse(data.toString())

  let updateRange = false;
  let body: any
  const mergedObj = task.map((item: any) => {
    if (!updateRange) {
      body = res.find((r: any) => {
        return parseInt(r.range.start) === parseInt(item.number)
      })
    }

    if (body) {
      if (parseInt(item.number) === parseInt(body.range.start)) {
        updateRange = true;
        const newValue = { ...item, volume_id: body.valueId, volume_title: { ...body.value } }
        return newValue
      }

      if (updateRange) {
        if (parseInt(item.number) === parseInt(body.range.end)) {
          updateRange = false;
        }
        const newValue = { ...item, volume_id: body.valueId, volume_title: { ...body.value } }
        return newValue
      }
    } else {
      return item;
    }
  });


  await fs.writeFile(
    path.join(process.cwd(), "data-source/nasai.json"),
    JSON.stringify(mergedObj, null, 2)
  )

  return NextResponse.json({
    success: true,
    message: "Success",
  })
}