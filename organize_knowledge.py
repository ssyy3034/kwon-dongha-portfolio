import os
import re
 
# Let's use basic string manipulation to be safe in standard python env without 'pyyaml' or 'python-frontmatter' if not installed.
# But for reliability, I will assume basic text processing.

TARGET_DIR = "./my-knowledge-garden/study"

# 1. Define Categories & Keywords
CATEGORIES = {
    "CS": [
        "pintos", "os", "operating system", "운영체제", "process", "thread", "scheduling",
        "virtual memory", "malloc", "system call", "kernel", "rbtree", "btree", "c언어", "포인터",
        "csapp", "assembly", "register", "cpu", "memory", "concurrency", "semaphore", "lock"
    ],
    "Algorithm": [
        "algorithm", "알고리즘", "bfs", "dfs", "dp", "dynamic programming", "dijkstra", 
        "graph", "tree", "stack", "queue", "linked list", "sort", "search", "greedy", 
        "backtracking", "baekjoon", "leetcode", "programmers", "코딩테스트", "자료구조", "rbtree", "heap"
    ],
    "Frontend": [
        "react", "next.js", "javascript", "typescript", "html", "css", "dom", "browser", 
        "frontend", "ui", "ux", "redux", "recoil", "zustand", "tailwind", "component", "rendering", "csr", "ssr"
    ],
    "Backend": [
        "node.js", "express", "nest.js", "spring", "java", "backend", "db", "database", "sql", "nosql",
        "api", "rest", "graphql", "server", "architecture", "authentication", "jwt", "oauth"
    ],
    "Network": [
        "network", "http", "tcp", "ip", "udp", "socket", "proxy", "dns", "web server", "osi", 
        "packet", "cors", "websocket", "https", "ssl", "tls"
    ],
    "DevOps": [
        "devops", "aws", "docker", "kubernetes", "cicd", "jenkins", "github actions", "deploy", 
        "cloud", "linux", "shell", "bash", "nginx", "git", "version control"
    ],
    "AI_Data": [
        "ai", "artificial intelligence", "ml", "machine learning", "deep learning", "python", 
        "pandas", "numpy", "pytorch", "tensorflow", "llm", "rag", "gpt", "data science"
    ],
    "Retrospective": [
        "회고", "retrospective", "journal", "diary", "til", "wil", "log", "일지", "생각", 
        "review", "lesson learned", "커피챗", "면접", "interview", "resume", "soft skill"
    ]
}

def detect_category(content, filename):
    text = (filename + " " + content).lower()
    
    # Priority Check (CS > Algorithm > ... > Retrospective)
    # Give explicit weight to path names if possible, but here we keep simple.
    
    scores = {cat: 0 for cat in CATEGORIES}
    
    for cat, keywords in CATEGORIES.items():
        for kw in keywords:
            if kw in text:
                scores[cat] += 1
                
    # Get max score
    best_cat = max(scores, key=scores.get)
    
    if scores[best_cat] > 0:
        return best_cat
    return "Uncategorized"

def update_frontmatter(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        filename = os.path.basename(file_path)
        
        # Check if frontmatter exists
        has_frontmatter = content.startswith('---')
        
        new_category = detect_category(content, filename)
        if new_category == "Uncategorized":
            return # Skip if no clear category
            
        if has_frontmatter:
            # Simple Regex replacement for tags
            # Case 1: tags: [ ... ]
            if re.search(r'^tags:\s*\[(.*?)\]', content, re.MULTILINE):
                # Append if not exists? or Replace? -> Let's Replace to normalize.
                # But to be safe, let's prepend the new category if it's not there.
                # Actually, replacing with single main category is cleaner for the graph.
                # Let's Force the Main Category as the FIRST tag.
                
                def replace_tags(match):
                    existing = match.group(1)
                    if new_category in existing:
                        return match.group(0)
                    return f"tags: [{new_category}, {existing}]"
                    
                new_content = re.sub(r'^tags:\s*\[(.*?)\]', replace_tags, content, 1, re.MULTILINE)
                
            # Case 2: tags: value
            elif re.search(r'^tags:\s*(.+)$', content, re.MULTILINE):
                def replace_tags_single(match):
                    existing = match.group(1).strip()
                    if new_category in existing:
                        return match.group(0)
                    return f"tags: [{new_category}, {existing}]"
                new_content = re.sub(r'^tags:\s*(.+)$', replace_tags_single, content, 1, re.MULTILINE)
                
            else:
                # Frontmatter exists but no tags -> Add tags
                new_content = re.sub(r'^---', f"---\ntags: [{new_category}]", content, 1) # Only first match (start of file) is wrong logic for sub... 
                # Better: insert after first --- 
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    parts[1] = parts[1] + f"\ntags: [{new_category}]"
                    new_content = '---'.join(parts)
                else:
                    new_content = content
        else:
            # No frontmatter -> Create one
            new_content = f"---\ntags: [{new_category}]\n---\n\n{content}"
            
        if content != new_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"[Updated] {filename} -> {new_category}")
            
    except Exception as e:
        print(f"[Error] {file_path}: {e}")

def main():
    print("Starting Knowledge Organization...")
    for root, dirs, files in os.walk(TARGET_DIR):
        # Ignore .obsidian, .git etc
        if '.obsidian' in root or '.git' in root or 'node_modules' in root:
            continue
            
        for file in files:
            if file.endswith(".md"):
                update_frontmatter(os.path.join(root, file))
    print("Organization Complete.")

if __name__ == "__main__":
    main()
