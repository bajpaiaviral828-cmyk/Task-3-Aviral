# Project 3: Multimodal Image Generation Studio

This is the third project of my Generative AI Internship at DecodeLabs! The goal was to move past text generation and learn how to do Multimodal Generation (Text-to-Image). 

The requirements for this project were actually insane. The PDF blueprint asked for enterprise-grade network safety, so I had to learn a bunch of advanced Python networking and error handling to make this work.

## What I Built
A CLI tool that takes a text prompt and an aspect ratio (like 16:9 or 1:1), connects to Hugging Face's Stable Diffusion model, and downloads the raw binary pixels to save an image locally. I also built a small `demo.html` page to test the API visually.

## How the Blueprint is Implemented

1. **Phase 1 & 2 (Dual-Timeouts):** Standard `requests.get()` can freeze your whole computer if the remote server hangs. I learned how to pass a tuple `timeout=(3.05, 60)` so it fails fast on connection errors, but gives the GPU 60 seconds to render the image.
2. **Phase 3 (Security Gates):** I added basic try/except blocks to catch HTTP errors if the image gets blocked by safety filters.
3. **Phase 4 (Memory-Safe Streaming):** Instead of downloading a massive 10MB image into RAM all at once (which crashes smaller servers), I used `iter_content(chunk_size=65536)` to stream the bytes directly into the local file system. 
4. **Phase 5 (Integrity Verification):** I found out the hard way that if your internet drops mid-download, the image file is corrupted but Python won't throw an error! I used Pillow's `Image.open().load()` to force a pixel-by-pixel decode to catch "truncated data streams".
5. **Phase 6 (Automated QA):** I used the massive `CLIP ViT-L/14` model from OpenAI to calculate a "Cosine Similarity Score" between the image and the original prompt. *Note: this model is gigabytes large so it takes forever to load the first time!*

## How to run it

### 🚀 Live Demo (No installation required!)
You don't need to install anything to try this out. Just click the link below to open the Glassmorphism UI right in your browser. All you need is a free Hugging Face API key!

👉 **[Try the Live Demo Here](https://raw.githack.com/bajpaiaviral828-cmyk/Task-3-Aviral/main/demo.html)**

### Local Installation
If you want to run the python CLI tool locally:
1. `pip install -r requirements.txt` (Warning: PyTorch and Transformers take a while to install).
2. Get a free Hugging Face API key and put it in `.env`.
3. Run the pipeline:
```bash
python main.py --prompt "A cyberpunk city in the rain" --ratio "16:9"
```

## Struggle points
The `qa.py` file was super annoying to set up because the `transformers` library kept throwing warnings, but I finally got the similarity score working! Also, handling raw binary streams was confusing at first because it's so different from just receiving a JSON string.
