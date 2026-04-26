const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'pages');
const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    let original = fs.readFileSync(fullPath, 'utf8');
    let content = original;
    
    // Some files might use <span>Editar</span> or >Editar< or >Editar</button>
    // We want to replace exactly the button text: 
    // <button ...>Editar</button> --> <button ...><FiEdit2 /></button>
    // <span>Editar</span> --> <span><FiEdit2 /></span>
    
    // We can just replace >Editar< with ><FiEdit2 /><
    
    let needsImport = false;
    
    if (content.includes('>Editar<')) {
        content = content.replace(/>Editar</g, ' title="Editar"><FiEdit2 /><');
        needsImport = true;
    }
    
    if (content.includes('>Eliminar<')) {
        content = content.replace(/>Eliminar</g, ' title="Eliminar"><FiTrash2 /><');
        needsImport = true;
    }
    
    if (needsImport && !content.includes('FiEdit2')) {
        // Find last import
        const lines = content.split('\n');
        const lastImportIndex = lines.findLastIndex(line => line.startsWith('import '));
        lines.splice(lastImportIndex + 1, 0, "import { FiEdit2, FiTrash2 } from 'react-icons/fi';");
        content = lines.join('\n');
    }
    
    if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', file);
    }
});
