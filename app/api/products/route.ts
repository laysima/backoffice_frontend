import { NextResponse } from "next/server";
import axios from "axios";

// Prevent Next.js from trying to statically render/execute this route at
// build time (which was calling the live API during `next build` on Vercel
// and failing the deploy). This forces it to run per-request instead.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })
        const URL = "/v1/products";
        const response = await client.get(URL);
        const { data } = response.data;
        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error('GET /api/products failed:', error?.message ?? error);
        return NextResponse.json(
            { error: 'Failed to fetch products' },
            { status: 502 }
        );
    }
}

