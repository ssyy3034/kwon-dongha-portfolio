import os
import re

TARGET_DIR = "./my-knowledge-garden/study"

def fix_tags(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Pattern: tags: [Category, - index/...]
        # The dash inside [] is problematic without quotes in some parsers if not careful.
        # Let's remove the dash from the second tag if it exists.
        
        # Regex to find: tags: [Word, - index/...]
        # We want to change it to: tags: [Word, "index/..."] OR just remove the dash.
        
        def replace_dash(match):
            # match.group(0) is the whole line
            # Let's just remove "- " from inside the brackets
            return match.group(0).replace(", - ", ", ")

        new_content = re.sub(r'^tags:\s*\[.*?, - .*?\]', replace_dash, content, flags=re.MULTILINE)
        
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"[Fixed] {os.path.basename(file_path)}")
            
    except Exception as e:
        print(f"[Error] {file_path}: {e}")

def main():
    print("Starting YAML Fix...")
    for root, dirs, files in os.walk(TARGET_DIR):
        if '.obsidian' in root or '.git' in root: continue
        for file in files:
            if file.endswith(".md"):
                fix_tags(os.path.join(root, file))
    print("Fix Complete.")

if __name__ == "__main__":
    main()
