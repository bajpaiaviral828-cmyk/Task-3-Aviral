import warnings
warnings.filterwarnings("ignore") # hide huggingface warnings from the terminal

try:
    from PIL import Image
    from transformers import CLIPProcessor, CLIPModel
    import torch
except ImportError:
    print("Warning: Missing QA dependencies. Run `pip install torch transformers pillow`")

# Load the model globally so we don't reload it every time
# The PDF said to use ViT-L/14 for Aesthetic/Semantic QA
# WARNING: This takes forever to download the first time!
print("Loading CLIP ViT-L/14 model... (this will take a while on the first run)")
try:
    model_id = "openai/clip-vit-large-patch14"
    model = CLIPModel.from_pretrained(model_id)
    processor = CLIPProcessor.from_pretrained(model_id)
except Exception as e:
    print(f"Failed to load CLIP model: {e}")
    model = None
    processor = None

def check_semantic_alignment(image_path, prompt):
    if model is None or processor is None:
        print("Skipping QA: Model not loaded.")
        return False
        
    print(f"\nPhase 6: Running Automated QA on {image_path}...")
    try:
        image = Image.open(image_path)
        
        # Process the image and the text prompt together
        inputs = processor(text=[prompt], images=image, return_tensors="pt", padding=True)
        
        # Calculate similarity score
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image 
        score = logits_per_image.item() # this is a raw score, usually between 20 and 40
        
        print(f"Semantic Alignment Score: {score:.2f}")
        
        # The PDF said to discard below a threshold. I'll just set an arbitrary one for the demo.
        # usually anything above 25 is a pretty good match
        if score > 25.0:
            print("✅ QA Passed: Image aligns with the text prompt.")
            return True
        else:
            print("❌ QA Failed: Image does not match the text prompt well enough (Hallucination?).")
            return False
            
    except Exception as e:
        print(f"QA Error: {e}")
        return False
