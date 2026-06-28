import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, ratio = "1:1" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Call local FastAPI Python backend
    const apiUrl = "http://127.0.0.1:8000/generate";
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        ratio,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend Error:", response.status, errorText);
      
      let errorMessage = "Failed to generate image from backend";
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.detail) errorMessage = errJson.detail;
      } catch (e) {
        // keep default
      }
      
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    
    // Return image directly
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store, must-revalidate",
      },
    });

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
