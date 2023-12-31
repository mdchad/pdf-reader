import {NextRequest, NextResponse} from "next/server";
import {promises as fs} from "fs";
import path from "path";
import connectToDatabase from '@/lib/mongodb';
import {ObjectId} from "mongodb";
import {useParams} from "next/navigation";

export async function GET(req: Request, { params } : { params: any}) {
  const db = await connectToDatabase();
  const number = Number(params.id)

  const data = await db.collection('muslim').findOne({ number });

  return NextResponse.json({
    success: true,
    data,
  })
}

export async function PUT(req: Request, { params } : { params: any}) {
  const db = await connectToDatabase();
  const number = params.id

  const res = await req.json();

  const data = await db.collection('muslim').updateOne({ number }, { $set: res });

  return NextResponse.json({
    success: true,
    data,
  })
}