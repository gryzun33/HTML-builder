const fs = require('fs');
const path = require('path');

const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(pathToStylesFolder, { withFileTypes: true }, (err, data) => {
  if (err) throw err;
  const dataArray = [];

  data.forEach((obj) => {
    if (!obj.isFile() || path.extname(obj.name) !== '.css') {
      const newData = dataArray.join('\n');
      fs.writeFile(pathToBundle, newData, (err) => {
        if (err) throw err;
      });
    } else {
      const pathToCssFile = path.join(pathToStylesFolder, obj.name);

      fs.readFile(pathToCssFile, (err, dataFile) => {
        if (err) throw err;

        dataArray.push(dataFile);
        const newData = dataArray.join('\n');

        fs.writeFile(pathToBundle, newData, (err) => {
          if (err) throw err;
        });
      });
    }
  });
});
