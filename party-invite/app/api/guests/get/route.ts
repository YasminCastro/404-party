import db from "@/lib/client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const database = await db;
    if (!database) throw new Error("Database is not connected");

    const collection = db.collection("guests");
    const result = await collection.find().toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
