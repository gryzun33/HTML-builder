const fs = require('fs').promises;
const path = require('path');

const pathToOldFolder = path.join(__dirname, 'files');
const pathToNewFolder = path.join(__dirname, 'files-copy');

function copyDir() {
  fs.rm(pathToNewFolder, { force: true, recursive: true })
    .then(() => fs.mkdir(pathToNewFolder, { recursive: true }))
    .then(() => fs.readdir(pathToOldFolder, { withFileTypes: true }))
    .then((data) => {
      const files = data.filter((obj) => obj.isFile());
      files.forEach((file) => {
        const pathToOldFile = path.join(pathToOldFolder, file.name);
        const pathToNewFile = path.join(pathToNewFolder, file.name);
        fs.copyFile(pathToOldFile, pathToNewFile);
      });
    })
    .catch((err) => {
      throw err;
    });
}

copyDir();
