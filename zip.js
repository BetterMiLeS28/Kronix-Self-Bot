const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const output = fs.createWriteStream(path.join(__dirname, 'output.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function () {
    console.log(`Archive created successfully, size: ${archive.pointer()} total bytes`);
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

archive.pipe(output);

const rootDir = __dirname;

function addDirectoryToArchive(srcPath) {
    const items = fs.readdirSync(srcPath);

    for (const item of items) {
        const fullPath = path.join(srcPath, item);

        if (item === 'node_modules') {
            continue;
        }

        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            archive.directory(fullPath, item);
        } else if (stats.isFile()) {
            archive.file(fullPath, { name: path.relative(rootDir, fullPath) });
        }
    }
}

addDirectoryToArchive(rootDir);

archive.finalize();
