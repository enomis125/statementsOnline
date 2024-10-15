//app/api/get_jsons/[id]/route.js
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from '@/app/lib/prisma';

export async function GET(request, context) {

    const { id } = context.params;

    const response = await prisma.requestRecords.findMany({
        where: {
            requestID: parseInt(id)
        }
    })

    if (!response) {
        return new NextResponse(JSON.stringify({ status: 404 }));
    }

    prisma.$disconnect()

    return new NextResponse(JSON.stringify({ response, status: 200 }));
}

export async function PATCH(request, context) {

    try {
        const { id } = context.params;

        const response = await prisma.requestRecords.update({
            where: {
                requestID: parseInt(id),
            },
            data: {
                seen: true
            }
        })
        return new NextResponse(JSON.stringify({ status: 200 }));

    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    } finally {
        await prisma.$disconnect();
    }

}