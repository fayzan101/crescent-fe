const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'postcss.config.mjs');
const BACKUP = path.join(__dirname, '..', 'postcss.config.mjs.bak');
const isCi = process.env.CI === 'true' || !!process.env.VERCEL;

function readNormalized(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

// Restore backup if file has changed
function restoreIfChanged() {
  if (!fs.existsSync(FILE)) {
    console.warn('postcss.config.mjs was not found; skipping protection step.');
    return;
  }

  if (!fs.existsSync(BACKUP)) {
    fs.copyFileSync(FILE, BACKUP);
    return;
  }

  const orig = readNormalized(BACKUP);
  const curr = readNormalized(FILE);

  if (orig !== curr) {
    fs.copyFileSync(BACKUP, FILE);
    if (isCi) {
      console.warn('postcss.config.mjs differed from backup and was restored during CI.');
      return;
    }

    console.log('postcss.config.mjs was modified and has been restored from backup.');
    process.exit(1);
  }
}

// Create backup if not exists
function ensureBackup() {
  if (!fs.existsSync(FILE)) {
    console.warn('postcss.config.mjs was not found; skipping backup step.');
    return;
  }

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
