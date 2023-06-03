import { NextResponse } from "next/server";

export async function GET(req) {
  
  const response = NextResponse.json('vasl', { status: 201 })
  response.cookies.delete('id')
  return response
  // return NextResponse.json('val', { status: 201 })
}