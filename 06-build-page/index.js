const fsPromises = require('fs').promises;
const path = require('path');

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');

const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToIndex = path.join(pathToDistFolder, 'index.html');

const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToStylesFile = path.join(pathToDistFolder, 'style.css');

const pathToAssets = path.join(__dirname, 'assets');
const pathToDistAssets = path.join(pathToDistFolder, 'assets');

fsPromises
  .rm(pathToDistFolder, { force: true, recursive: true })
  .then(() => fsPromises.mkdir(pathToDistFolder, { recursive: true }))
  .then(() => {
    replaceTemplate();
    compileStyles(pathToStylesFolder, pathToStylesFile);
    copyAssets(pathToAssets, pathToDistAssets);
  })
  .catch((err) => {
    throw err;
  });

function replaceTemplate() {
  let strTemplateData;
  fsPromises
    .readFile(pathToTemplate)
    .then((templateData) => {
      strTemplateData = templateData.toString();
      return fsPromises.readdir(pathToComponents, { withFileTypes: true });
    })
    .then((components) => {
      const compArray = [];

      const filesHTML = components.filter(
        (file) => file.isFile() && path.extname(file.name) === '.html',
      );

      const promisesWithData = filesHTML.map((file) =>
        fsPromises.readFile(path.join(pathToComponents, file.name)),
      );

      filesHTML.forEach((file) => {
        const fileName = path.basename(file.name, path.extname(file.name));
        const obj = {
          fileName: fileName,
        };
        compArray.push(obj);
      });
      Promise.all(promisesWithData)
        .then((dataArray) => {
          compArray.forEach((obj, i) => {
            obj.dataFile = dataArray[i].toString();
          });

          const newIndexData = compArray.reduce(
            (res, ob) => res.replace(`{{${ob.fileName}}}`, ob.dataFile),
            strTemplateData,
          );
          fsPromises.writeFile(pathToIndex, newIndexData);
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      throw err;
    });
}

function compileStyles(pathToStylesFolder, pathToBundleCss) {
  fsPromises
    .readdir(pathToStylesFolder, { withFileTypes: true })
    .then((data) => {
      const dataOnlyCss = data.filter(
        (obj) => obj.isFile() && path.extname(obj.name) === '.css',
      );
      const promisesWithData = dataOnlyCss.map((file) =>
        fsPromises.readFile(path.join(pathToStylesFolder, file.name)),
      );

      return Promise.all(promisesWithData);
    })
    .then((newDataArray) => {
      const newData = newDataArray.join('\n');

      return fsPromises.writeFile(pathToBundleCss, newData);
    })
    .catch((err) => {
      throw err;
    });
}

function copyAssets(pathToOldFolder, pathToNewFolder) {
  fsPromises
    .mkdir(pathToNewFolder, { recursive: true })
    .then(() => fsPromises.readdir(pathToOldFolder, { withFileTypes: true }))
    .then((data) => {
      data.forEach((obj) => {
        const pathToOldObj = path.join(pathToOldFolder, obj.name);
        const pathToNewObj = path.join(pathToNewFolder, obj.name);
        if (obj.isFile()) {
          fsPromises.copyFile(pathToOldObj, pathToNewObj).catch((err) => {
            throw err;
          });
        } else {
          copyAssets(pathToOldObj, pathToNewObj);
        }
      });
    })
    .catch((err) => {
      throw err;
    });
}
