
import { NextResponse } from "next/server";
import prisma from '@/app/lib/prisma';


export async function GET() {

    const response = await prisma.requestRecords.findMany()

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}