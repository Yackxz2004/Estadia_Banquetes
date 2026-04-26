const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'frontend', 'src', 'pages');
const targetFiles = [
    'Sillas.jsx', 'Mesas.jsx', 'Manteleria.jsx', 'Cubierto.jsx', 'Loza.jsx', 
    'Cristaleria.jsx', 'SalasLounge.jsx', 'Periqueras.jsx', 'Carpas.jsx', 
    'PistasTarimas.jsx', 'Extras.jsx', 'Products.jsx', 'UserCRUD.jsx', 
    'Bodegas.jsx', 'Clientes.jsx', 'Degustaciones.jsx', 'Eventos.jsx', 
    'TipoEventoCRUD.jsx'
];

targetFiles.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (!fs.existsSync(fullPath)) return;
    
    let original = fs.readFileSync(fullPath, 'utf8');
    let content = original;
    
    // Add import if missing
    if (!content.includes('import { Link }') && !content.includes('import {Link}') && !content.includes('import { Link,')) {
        // Find a place to put import { Link } from 'react-router-dom';
        // After the first import is fine.
        content = content.replace(/(import[^;]+;\n)/, '$1import { Link } from \'react-router-dom\';\n');
    }
    
    const linkStr = '<Link to="/inventory" className="back-link" style={{ marginTop: "20px", display: "inline-block" }}>Volver a Inventario</Link>';
    
    // Check if there's already a back-link
    if (content.includes('className="back-link"')) {
        // Replace existing back-link element completely
        content = content.replace(/<Link[^>]*className="back-link"[^>]*>.*?(<\/Link>|)/s, linkStr);
    } else {
        // Insert right before the last </div>
        // Assuming the file exports a component and ends with </div> \n );
        
        let parts = content.split('</div>');
        if (parts.length > 1) {
            // Re-join everything except the last </div> segment
            let lastSegment = parts.pop();
            // Just before the very last </div> in the component's main return.
            // Actually, an easier regex is to look for the last </div>\n  );
            content = content.replace(/<\/div>\s*\)\s*;\s*\}\s*;?\s*export default/g, `
      ${linkStr}
    </div>
  );
};
export default`);

            // Also cover if it's function Name() { ... }
            content = content.replace(/<\/div>\s*\)\s*;\s*\n\}\s*export default/g, `
      ${linkStr}
    </div>
  );
}
export default`);
        }
    }
    
    if (original !== content) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Added back link to', file);
    } else {
        console.log('Could not automatically add to', file);
    }
});
