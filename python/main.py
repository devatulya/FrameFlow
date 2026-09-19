import sys
import os
import json
from generator import PPTGenerator

def main():
    if len(sys.argv) < 3:
        print("Usage: python main.py <input_json_path> <output_pptx_path>")
        sys.exit(1)
        
    json_path = sys.argv[1]
    output_path = sys.argv[2]
    
    if not os.path.exists(json_path):
        print(f"Error: JSON input file not found: {json_path}")
        sys.exit(1)
        
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    generator = PPTGenerator()
    generator.generate(data, output_path)

if __name__ == "__main__":
    main()
