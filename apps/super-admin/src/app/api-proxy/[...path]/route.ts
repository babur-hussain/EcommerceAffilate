import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params);
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params);
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params);
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params);
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
    return handleProxy(request, params);
}

async function handleProxy(request: NextRequest, params: { path: string[] }) {
    try {
        const path = params.path.join("/");
        const searchParams = request.nextUrl.searchParams.toString();
        const targetUrl = `https://api.lfvs.in/${path}${searchParams ? `?${searchParams}` : ""}`;

        console.log(`🔀 Proxying: ${request.method} ${request.nextUrl.pathname} -> ${targetUrl}`);

        // Prepare headers
        const headers = new Headers(request.headers);
        headers.delete("host"); // Important: let fetch set the host
        headers.delete("connection");
        headers.delete("content-length"); // Let fetch calculate content-length

        const auth = headers.get("authorization");
        console.log(`🔑 Auth Header Present: ${!!auth}, Length: ${auth?.length || 0}`);

        // Copy body if not GET/HEAD
        const body = (request.method !== "GET" && request.method !== "HEAD")
            ? await request.blob()
            : undefined;

        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: body,
            // @ts-ignore
            duplex: 'half' // Required for streaming bodies in some versions, though blob works too
        });

        console.log(`✅ Upstream Response: ${response.status} ${response.statusText}`);

        // Forward response headers
        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete("content-encoding"); // Let Next.js handle compression

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });

    } catch (error: any) {
        console.error("❌ Proxy Error:", error);
        return NextResponse.json({
            error: "Proxy Failed",
            details: error.message,
            stack: error.stack,
            url: `https://api.lfvs.in/${params.path.join("/")}`
        }, { status: 502 });
    }
}
