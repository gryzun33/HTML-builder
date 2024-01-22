const fs = require('fs');
const readline = require('readline');
const path = require('path');

const { stdout, stdin, argv } = process;

const pathToFile = path.join(argv[1], 'text.txt');
fs.createWriteStream(pathToFile);

stdout.write('Please enter some text: \n');

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

rl.on('line', (data) => {
  if (data.toString().trim() === 'exit') {
    rl.close();
  }
  fs.appendFile(pathToFile, data + '\n', (err) => {
    if (err) throw err;
  });
});

rl.on('close', () => {
  console.log('Good Bye!');
  process.exit(0);
});
