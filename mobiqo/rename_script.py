import os

directory = r"C:\Users\nithy\OneDrive\Documents\Desktop\Mobiqo Web\mobiqo"
for root, dirs, files in os.walk(directory):
    for dir_name in ['node_modules', '.git', 'dist', 'venv', '.gemini']:
        if dir_name in dirs:
            dirs.remove(dir_name)
    for file in files:
        if file.endswith(('.tsx', '.ts', '.html', '.css', '.js')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                if 'Modiqo' in content:
                    print(f"Replacing in {path}")
                    content = content.replace('Modiqo', 'Mobiqo')
                    with open(path, 'w', encoding='utf-8', newline='') as f:
                        f.write(content)
            except Exception as e:
                print(f"Error processing {path}: {e}")
