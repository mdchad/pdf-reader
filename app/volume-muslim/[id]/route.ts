import {NextRequest, NextResponse} from "next/server";
import {promises as fs} from "fs";
import path from "path";
import connectToDatabase from '@/lib/mongodb';
import {ObjectId} from "mongodb";
import {useParams} from "next/navigation";

export async function GET(req: Request, { params } : { params: any}) {
  const db = await connectToDatabase();
  const id = params.id

  const data = await db.collection('muslim-volume').findOne({ id });
  console.log(data)

  return NextResponse.json({
    success: true,
    data,
  })
}
