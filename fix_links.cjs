const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'frontend', 'src', 'pages');
const targetFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('.jsx'));

targetFiles.forEach(f => {
    const fullPath = path.join(dirPath, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    // The previous script replaced `<Link ... className="back-link"[^>]*>.*?(<\/Link>|)`
    // because `.*?` matches 0 characters and `(<\/Link>|)` matches the empty string.
    // So it just prepended the new Link before the old one without eating anything, OR it ate part of it.
    // So we ended up with:
    // <Link to="/inventory" className="back-link" ... >Volver a Inventario</Link>Volver a Inventario</Link>
    // or
    // <Link to="/inventory" className="back-link" ... >Volver a Inventario</Link>Volver al Panel</Link>
    
    content = content.replace(/<\/Link>Volver a Inventario<\/Link>/g, '</Link>');
    content = content.replace(/<\/Link>Volver al Panel<\/Link>/g, '</Link>');

    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Fixed', f);
    }
});
