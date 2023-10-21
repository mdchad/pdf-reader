import {NextRequest, NextResponse} from "next/server";
import connectToDatabase from '@/lib/mongodb';

export async function GET(req: Request, params) {
  const db = await connectToDatabase();
  const number = params.id
  console.log(params)

  const res = await req.json();
  console.log(res)

  const data = await db.collection('muslim').findOne({ number });

  return NextResponse.json({
    success: true,
    data,
  })
}

export async function POST(req: NextRequest) {
  const db = await connectToDatabase();

  const res = await req.json();
  console.log(res)

  const data = await db.collection('muslim').insertOne(res);

  return NextResponse.json({
    success: true,
    message: "Success",
  })
}