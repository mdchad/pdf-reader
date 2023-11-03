import {NextRequest, NextResponse} from "next/server";
import connectToDatabase from '@/lib/mongodb';
import {ObjectId} from "mongodb";

export async function GET(req: NextRequest) {
  const db = await connectToDatabase();

  const data = await db.collection('Hadiths').find({ "volume_title.ms": "Pengantar" }).toArray();

  return NextResponse.json({
    success: true,
    data,
  })
}

export async function PUT(req: Request, { params } : { params: any}) {
  const db = await connectToDatabase();

  const res = await req.json();
  const id = res._id
  delete res._id

  const data = await db.collection('Hadiths').updateOne({_id: new ObjectId(id)}, { $set: res });

  return NextResponse.json({
    success: true,
    data,
  })
}