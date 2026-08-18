import os
import re

directory = 'frontend/src'

# Mapping of old Tailwind classes to new ones based on the palette
# Primary: #1E3A8A (blue-900)
# Secondary: #F59E0B (amber-500)
# Tertiary: #6E2C00 (we'll use arbitrary [#6E2C00] or orange-900)
# Neutral: #475569 (slate-600)

replacements = {
    # Primary gradients and solid colors to blue-900
    r'from-blue-500': 'from-blue-900',
    r'from-blue-600': 'from-blue-900',
    r'from-blue-700': 'from-blue-900',
    r'to-indigo-500': 'to-blue-900',
    r'to-indigo-600': 'to-blue-900',
    r'to-indigo-700': 'to-blue-900',
    r'bg-blue-600': 'bg-blue-900',
    r'bg-blue-500': 'bg-blue-900',
    r'hover:bg-blue-700': 'hover:bg-blue-950',
    r'hover:from-blue-500': 'hover:from-blue-800',
    r'hover:to-indigo-500': 'hover:to-blue-800',
    r'text-blue-600': 'text-blue-900',
    r'text-indigo-600': 'text-blue-900',
    r'text-indigo-700': 'text-blue-900',
    r'border-blue-600': 'border-blue-900',
    r'ring-blue-500': 'ring-blue-900',
    r'shadow-blue-500': 'shadow-blue-900',
    
    # Let's add some secondary accents (amber-500) to replace some blue highlights
    # e.g., the spark icon, some badges
    r'text-blue-300': 'text-amber-500',
    r'from-blue-400': 'from-blue-800',
    r'to-indigo-300': 'to-blue-400',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.jsx'):
            process_file(os.path.join(root, file))
