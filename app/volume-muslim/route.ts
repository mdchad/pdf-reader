import {NextRequest, NextResponse} from "next/server";
import {promises as fs} from "fs";
import path from "path";
import connectToDatabase from "@/lib/mongodb";


export async function GET() {
  const db = await connectToDatabase();
  const cursor = await db
    .collection('muslim-volume')
    .find()
  const data = [];
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    data.push(doc);
  }

  return NextResponse.json({
    success: true,
    data: data
  })
}

export async function POST(req: Request) {
  const db = await connectToDatabase();
  const res = await req.json();

  const data = await db.collection('muslim-volume').insertOne(res);

  return NextResponse.json({
    success: true,
    message: 'Success'
  })
}