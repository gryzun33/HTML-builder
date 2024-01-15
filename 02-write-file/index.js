const fs = require('fs');
const path = require('path');

const { stdout, stdin, argv, stderr } = process;

const pathToFile = path.join(argv[1], 'text.txt');
const output = fs.createWriteStream(pathToFile);

stdout.write("Hello? What's the weather like today? \n");

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Good Bye!\n');
    process.exit(0);
  }
  output.write(data);
});

process.on('SIGINT', () => {
  stdout.write('\nGood Bye!\n');
  process.exit(0);
});
