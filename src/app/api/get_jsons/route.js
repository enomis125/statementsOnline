
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from '@/app/lib/prisma';


export async function GET(request) {

    const response = await prisma.requestRecords.findMany()

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}