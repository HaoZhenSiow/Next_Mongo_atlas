import { NextResponse } from "next/server";
import connectDB from "@/_lib/connectDB"

connectDB()

export async function GET(req) {
  
  
  const val = req.cookies.get('id')
  console.log(val)


  return NextResponse.json('val', { status: 201 })
}