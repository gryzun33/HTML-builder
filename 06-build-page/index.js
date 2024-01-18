const fs = require('fs');
const path = require('path');

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');

const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToIndex = path.join(pathToDistFolder, 'index.html');

const pathToStylesFolder = path.join(__dirname, 'styles');
const pathToStylesFile = path.join(pathToDistFolder, 'style.css');

const pathToAssets = path.join(__dirname, 'assets');
const pathToDistAssets = path.join(pathToDistFolder, 'assets');

// create folder 'project-dist'
fs.mkdir(pathToDistFolder, { recursive: true }, (err) => {
  if (err) throw err;

  fs.readFile(pathToTemplate, (err, templateData) => {
    if (err) throw err;
    const strTemplateData = templateData.toString();

    // go to folder 'components'
    fs.readdir(pathToComponents, { withFileTypes: true }, (err, filesHTML) => {
      if (err) throw err;
      const compArray = [];
      // read content of files
      filesHTML.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.html') {
          const pathToFileHTML = path.join(pathToComponents, file.name);
          const fileName = path.basename(file.name, path.extname(file.name));

          fs.readFile(pathToFileHTML, (err, dataFile) => {
            if (err) throw err;

            const dataFileStr = dataFile.toString();
            const obj = {
              fileName: fileName,
              dataFile: dataFileStr,
            };

            compArray.push(obj);

            const newIndexData = compArray.reduce(
              (res, ob) => res.replace(`{{${ob.fileName}}}`, ob.dataFile),
              strTemplateData,
            );

            fs.writeFile(pathToIndex, newIndexData, (err) => {
              // console.log('newindexdata=', newIndexData);
              if (err) throw err;
            });
          });
        }
      });
    });
  });

  fs.readdir(pathToStylesFolder, { withFileTypes: true }, (err, data) => {
    if (err) throw err;
    // console.log('datafromStylesfolder= ', data);
    if (data.length === 0) {
      fs.writeFile(pathToStylesFile, '', (err) => {
        if (err) throw err;
      });
    } else if (
      data.every((obj) => !obj.isFile() || path.extname(obj.name) !== '.css')
    ) {
      fs.writeFile(pathToStylesFile, '', (err) => {
        if (err) throw err;
      });
    } else {
      const dataOnlyCss = data.filter(
        (obj) => obj.isFile() && path.extname(obj.name) === '.css',
      );
      const promisesWithData = dataOnlyCss.map((file) =>
        fs.promises.readFile(path.join(pathToStylesFolder, file.name)),
      );

      // console.log('promises=', promisesWithData);

      Promise.all(promisesWithData)
        .then((newDataArray) => {
          const newData = newDataArray.join('\n');
          // console.log('newdata=', newData);

          return fs.promises.writeFile(pathToStylesFile, newData);
        })
        .catch((err) => {
          throw err;
        });
    }
  });

  copyDir(pathToAssets, pathToDistAssets);
});

function copyDir(pathToOldFolder, pathToNewFolder) {
  fs.mkdir(pathToNewFolder, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(pathToOldFolder, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      files.forEach((obj) => {
        const pathToOldObj = path.join(pathToOldFolder, obj.name);
        const pathToNewObj = path.join(pathToNewFolder, obj.name);
        if (obj.isFile()) {
          fs.copyFile(pathToOldObj, pathToNewObj, (err) => {
            if (err) throw err;
          });
        } else if (obj.isDirectory()) {
          copyDir(pathToOldObj, pathToNewObj);
        }
      });
    });
  });
}
