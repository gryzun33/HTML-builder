const fs = require('fs').promises;
const path = require('path');

const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToBundleCss = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(pathToStylesFolder, { withFileTypes: true })
  .then((data) => {
    const dataOnlyCss = data.filter(
      (obj) => obj.isFile() && path.extname(obj.name) === '.css',
    );
    const promisesWithData = dataOnlyCss.map((file) =>
      fs.readFile(path.join(pathToStylesFolder, file.name)),
    );

    return Promise.all(promisesWithData);
  })
  .then((newDataArray) => {
    const newData = newDataArray.join('\n');

    return fs.writeFile(pathToBundleCss, newData);
  })
  .catch((err) => {
    throw err;
  });
