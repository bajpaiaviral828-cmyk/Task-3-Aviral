import argparse
import os
from generator import generate_image_stream
from PIL import Image
import qa

def main():
    print("=============================================")
    print("🎨 Multimodal Image Generation Studio")
    print("=============================================")
    
    parser = argparse.ArgumentParser(description="Generate images from text.")
    parser.add_argument("--prompt", type=str, required=True, help="What do you want to see?")
    parser.add_argument("--ratio", type=str, choices=["1:1", "16:9", "9:16"], default="1:1", help="Aspect ratio")
    parser.add_argument("--out", type=str, default="output.png", help="Filename to save as")
    
    args = parser.parse_args()

    os.makedirs("outputs", exist_ok=True)
    save_path = os.path.join("outputs", args.out)

    print(f"\nPrompt: {args.prompt}")
    print(f"Ratio: {args.ratio}")
    print("Generating...\n")
    
    response = generate_image_stream(args.prompt, args.ratio)
    
    if response:
        print("Phase 4: Streaming data memory-safely...")
        try:
            # Phase 4: Transport Protocol (Memory-safe streaming)
            # Instead of loading a 10MB image into RAM all at once, the PDF says
            # to chunk it out in 65536 byte (65.5KB) pieces.
            with open(save_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=65536):
                    if chunk:
                        f.write(chunk)
            
            print(f"Saved to {save_path}")
            
            # Phase 5: Integrity Verification
            # The PDF warned about "Truncated Data Streams" where the network drops
            # but the file still looks like a PNG. We have to force a full pixel decode.
            print("Phase 5: Verifying binary integrity...")
            try:
                img = Image.open(save_path)
                # verify() just checks headers, we have to call .load() to decode every pixel
                img.load() 
                print("✅ Integrity Check Passed! No broken data stream.")
                
                # Phase 6: Automated QA
                # Finally, check if the image actually matches the prompt
                qa.check_semantic_alignment(save_path, args.prompt)
                
            except OSError as e:
                print(f"❌ Integrity Error: Broken data stream detected! The image is corrupted. ({e})")
                # if it's broken, I should probably delete it or retry, but for now just delete
                os.remove(save_path)
                print("Deleted corrupted file.")
                
        except Exception as e:
            print(f"Failed to stream and save image: {e}")
    else:
        print("Generation pipeline failed.")

if __name__ == "__main__":
    main()
