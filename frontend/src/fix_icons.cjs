const fs = require('fs');
const path = require('path');

const filesToFix = ['Clientes.jsx', 'Eventos.jsx', 'TipoEventoCRUD.jsx', 'UserCRUD.jsx'];
const dirPath = path.join(__dirname, 'pages');

filesToFix.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (!fs.existsSync(fullPath)) return;
    
    let original = fs.readFileSync(fullPath, 'utf8');
    
    // Replace:
    // <FiEdit2 size={16} />
    // <span title="Editar"><FiEdit2 /></span>
    // With:
    // <FiEdit2 size={18} />
    
    // Regex matches the <FiEdit> tag followed by the <span> wrapper we added.
    let content = original.replace(/<FiEdit2[^>]*>\s*<span[^>]*><FiEdit2 \/><\/span>/g, '<FiEdit2 size={18} />');
    content = content.replace(/<FiTrash2[^>]*>\s*<span[^>]*><FiTrash2 \/><\/span>/g, '<FiTrash2 size={18} />');
    
    // In case UserCRUD didn't have duplicates but just <span title="Editar"><FiEdit2 /></span>
    // Then we can leave it, or unwrap the span.
    
    if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed duplicates in', file);
    }
});
