const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'postcss.config.mjs');
const BACKUP = path.join(__dirname, '..', 'postcss.config.mjs.bak');

// Restore backup if file has changed
function restoreIfChanged() {
  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(FILE, BACKUP);
    return;
  }
  const orig = fs.readFileSync(BACKUP, 'utf8');
  const curr = fs.readFileSync(FILE, 'utf8');
  if (orig !== curr) {
    fs.copyFileSync(BACKUP, FILE);
    console.log('postcss.config.mjs was modified and has been restored from backup.');
    process.exit(1);
  }
}

// Create backup if not exists
function ensureBackup() {
  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(FILE, BACKUP);
    console.log('Backup of postcss.config.mjs created.');
  }
}

if (process.argv[2] === 'backup') {
  ensureBackup();
} else {
  restoreIfChanged();
}
