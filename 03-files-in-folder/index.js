const fs = require('fs');
const path = require('path');

let pathToFiles = path.join(__dirname, 'secret-folder');
console.log(pathToFiles);

fs.readdir(
  pathToFiles,
  {
    withFileTypes: true,
  },
  (err, data) => {
    if (err) throw err;

    data.forEach((obj) => {
      if (obj.isFile()) {
        const extWithDot = path.extname(obj.name);
        const ext = extWithDot.slice(1);
        const name = path.basename(obj.name, extWithDot);
        const pathToFile = path.join(pathToFiles, obj.name);

        fs.stat(pathToFile, (err, stat) => {
          if (err) throw err;
          const size = `${+stat.size / 1024}kb`;
          console.log(`${name} - ${ext} - ${size}`);
        });
      }
    });
  },
);
