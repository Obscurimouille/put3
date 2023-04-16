const fs = require('fs');

function toArray(users) {
  return Object.keys(users).map((id) => ({ ...users[id], id }));
}

function newName(users) {
  for (let i = 0; i < 24; i++) {
    const name = 'PC-' + String.fromCharCode(65 + i);
    if (!Object.values(users).find(user => user.name == name)) return name;
  }
}

// Get a file extension without the dot
function getFileExtension(filename) {
  return filename.split('.').pop().toLowerCase();
}

function findDesktopImageName(extensions = ['jpg', 'png', 'jpeg', 'gif']) {
  return new Promise(async (resolve, reject) => {
    const filename = 'desktop';

    // For each extension, check if the file exists
    for (let extension of extensions) {
      try {
        fs.accessSync(`./public/assets/${filename}.${extension}`);
        resolve(`${filename}.${extension}`);
        return;
      }
      catch (err) {}
    }
    // No image found
    resolve(null);
  });
}

// Return the file extension of a base64 image
// https://stackoverflow.com/questions/27886677/javascript-get-extension-from-base64-image
function getBase64FileExtension(base64) {
  switch (base64.charAt(0)) {
    case '/':
      return 'jpg';

    case 'i':
      return 'png';

    case 'R':
      return 'gif';

    case 'U':
      return 'webp';

    default:
      return null;
  }
}

module.exports = { toArray, newName, getFileExtension, findDesktopImageName, getBase64FileExtension };
