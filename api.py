import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from generator import generate_image_stream
from PIL import Image
import qa
import uuid

app = FastAPI(title="Multimodal Image Generation Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    ratio: str = "1:1"

@app.post("/generate")
async def generate(req: GenerateRequest):
    os.makedirs("outputs", exist_ok=True)
    filename = f"{uuid.uuid4().hex}.png"
    save_path = os.path.join("outputs", filename)
    
    response = generate_image_stream(req.prompt, req.ratio)
    
    if not response:
        raise HTTPException(status_code=500, detail="Generation pipeline failed. Check backend logs.")
    
    try:
        with open(save_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=65536):
                if chunk:
                    f.write(chunk)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to stream and save image: {e}")
        
    try:
        img = Image.open(save_path)
        img.load() 
    except OSError as e:
        os.remove(save_path)
        raise HTTPException(status_code=500, detail="Integrity Error: Broken data stream detected! The image is corrupted.")

    is_aligned = qa.check_semantic_alignment(save_path, req.prompt)
    if not is_aligned:
        # We can either return the image anyway or fail. For now, returning it but we could delete it.
        print("QA Failed, but returning image anyway.")
    
    return FileResponse(save_path, media_type="image/png")
