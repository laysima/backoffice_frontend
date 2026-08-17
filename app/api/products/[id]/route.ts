import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Ensure this always runs per-request against live data rather than being
// cached/executed at build time.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = params.id
        const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })
        const URL = `/v1/product?id=${id}`;
        const response = await client.get(URL);
        const { data } = response.data;
        return NextResponse.json(data, { status: 200 })
    } catch (error: any) {
        console.error(`GET /api/products/${params.id} failed:`, error?.message ?? error);
        return NextResponse.json(
            { error: 'Failed to fetch product' },
            { status: 502 }
        );
    }
}

// const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })

// export async function GET(request: NextRequest) {

//     const params = request.nextUrl.searchParams
//     const id = params.get('id')

//     const URL = `/v1/product?id=${id}`

//     const res = await client.get(URL)
//     const { data } = res.data

//     console.log('data:', data)

//     return NextResponse.json({ data }, { status: 200 })
// }

