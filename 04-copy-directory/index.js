const fs = require('fs');
const path = require('path');

const pathToOldFolder = path.join(__dirname, 'files');

const pathToNewFolder = path.join(__dirname, 'files-copy');

fs.mkdir(pathToNewFolder, { recursive: true }, (err) => {
  if (err) throw err;

  fs.readdir(pathToOldFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;

    files.forEach((obj) => {
      if (obj.isFile()) {
        const pathToOldFile = path.join(pathToOldFolder, obj.name);
        const pathToNewFile = path.join(pathToNewFolder, obj.name);
        fs.copyFile(pathToOldFile, pathToNewFile, (err) => {
          if (err) throw err;
        });
      }
    });
  });
});
