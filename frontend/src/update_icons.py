import os
import glob
import re

dir_path = r'c:\Users\boyas\Estadia\Estadia_Banquetes\frontend\src\pages'
files = glob.glob(os.path.join(dir_path, '*.jsx'))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    needs_import = False
    
    if '>Editar<' in content or '>Eliminar<' in content:
        content = re.sub(r'>Editar<', r' title="Editar"><Pencil size={18} /><', content)
        content = re.sub(r'>Eliminar<', r' title="Eliminar"><Trash2 size={18} /><', content)
        needs_import = True
        
    if needs_import and 'lucide-react' not in content:
        lines = content.split('\n')
        last_import = 0
        for i, line in enumerate(lines):
            if line.startswith('import '):
                last_import = i
        lines.insert(last_import + 1, "import { Pencil, Trash2 } from 'lucide-react';")
        content = '\n'.join(lines)
        
    if original != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {os.path.basename(file)}')
