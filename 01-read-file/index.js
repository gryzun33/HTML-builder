const fs = require('fs');
const path = require('path');

const pathToDir = process.argv[1];
const pathToFile = path.join(pathToDir, 'text.txt');

const stream = fs.createReadStream(pathToFile, 'utf-8');

let data = '';

stream.on('data', (chunk) => (data += chunk));
stream.on('end', () => process.stdout.write(data));
stream.on('error', (error) => process.stdout.write('Error', error.message));
