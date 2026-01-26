import os
import re

TARGET_DIR = "./my-knowledge-garden/study"

def normalize_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract Frontmatter block
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not match:
            return # No frontmatter, skip

        frontmatter_raw = match.group(1)
        original_frontmatter = frontmatter_raw
        
        # 1. Extract all tags scattered around
        # Look for 'tags: ...' and subsequent lines that look like list items
        # Strategy: Find "tags:", collect everything until next key or end of block.
        
        tags = []
        
        # Simple parsing logic for broken YAML
        lines = frontmatter_raw.split('\n')
        new_lines = []
        in_tags = False
        
        for line in lines:
            line = line.rstrip()
            if not line: continue
            
            # Check if it's a new key (start with char, has colon)
            is_key = re.match(r'^[a-zA-Z0-9_-]+:', line)
            
            if line.startswith('tags:'):
                in_tags = True
                # Extract inline tags: tags: [A, B] or tags: A, B
                inline_match = re.search(r'tags:\s*\[?(.*?)\]?$', line)
                if inline_match:
                    raw_tags = inline_match.group(1)
                    if raw_tags.strip():
                        # Split by comma
                        parts = raw_tags.split(',')
                        for p in parts:
                            p = p.strip()
                            if p and p != '-': 
                                tags.append(p)
                continue
            
            if in_tags:
                # If we are in tags block, check if line is a list item or continuation
                # e.g. "  - Value" or "Value" or "]" 
                if is_key:
                    # New key found, stop collecting tags
                    in_tags = False
                    new_lines.append(line)
                else:
                    # It's a tag item
                    # Remove "- ", "[", "]", ","
                    clean_line = line.replace('-', '').replace('[', '').replace(']', '').replace(',', '').strip()
                    if clean_line:
                        tags.append(clean_line)
            else:
                new_lines.append(line)
        
        # Reconstruct Tags
        # Remove duplicates, remove empty
        unique_tags = sorted(list(set(tags)))
        
        # Build new Frontmatter
        # We append tags at the end of keys for simplicity or keep structure?
        # Let's just append 'tags: [A, B, C]' to new_lines
        if unique_tags:
            tag_str = ", ".join(unique_tags)
            new_lines.append(f"tags: [{tag_str}]")
            
        new_frontmatter = "\n".join(new_lines)
        
        if new_frontmatter.strip() != original_frontmatter.strip():
            new_content = content.replace(f"---\n{original_frontmatter}\n---", f"---\n{new_frontmatter}\n---")
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"[Normalized] {os.path.basename(file_path)}")

    except Exception as e:
        print(f"[Error] {file_path}: {e}")

def main():
    print("Starting Frontmatter Normalization...")
    for root, dirs, files in os.walk(TARGET_DIR):
        if '.obsidian' in root or '.git' in root: continue
        for file in files:
            if file.endswith(".md"):
                normalize_file(os.path.join(root, file))
    print("Normalization Complete.")

if __name__ == "__main__":
    main()
