import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
API_KEY = os.getenv("HF_API_KEY", "")

def generate_image_stream(prompt, aspect_ratio="1:1"):
    if not API_KEY:
        print("Error: Hugging Face API key not found in .env file!")
        return None

    width, height = 1024, 1024
    if aspect_ratio == "16:9":
        width, height = 1344, 768
    elif aspect_ratio == "9:16":
        width, height = 768, 1344

    headers = {"Authorization": f"Bearer {API_KEY}"}
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "width": width,
            "height": height
        }
    }

    print("Phase 1 & 2: Sending request with dual-timeouts...")
    
    try:
        # Phase 2: Network API Gateway
        # The PDF said to use a dual-timeout policy (3.05s connect, 60s read) 
        # so it fails fast if the server is completely down, but waits for the GPU to render.
        response = requests.post(
            API_URL, 
            headers=headers, 
            json=payload, 
            timeout=(3.05, 60), 
            stream=True # Phase 4: Prepare for chunked streaming
        )
        
        # Phase 3: Security & Moderation Gates
        # checking if the server rejected it or if a filter caught it
        if response.status_code != 200:
            print(f"Server rejected request. Status: {response.status_code}")
            try:
                error_data = response.json()
                print(f"Reason: {error_data}")
            except:
                print("Could not parse error JSON.")
            return None
            
        return response # returning the raw response object so we can stream it in main.py
            
    except requests.exceptions.ConnectTimeout:
        print("Network Failure: Could not establish TCP connection (Failed in < 3.05s).")
        return None
    except requests.exceptions.ReadTimeout:
        print("Inference Failure: Server connected but took too long to send data (> 60s).")
        return None
    except Exception as e:
        print(f"Something else broke: {e}")
        return None
