import iconv from "iconv-lite";

const getPathElem = (path, index) => {
    return path.split('\\')[index];
}

const getDirPath = (path) => {
    return path.split('\\').slice(0, -1).join('\\');
}

const removeSpaces = (string) => {
    return string.replace(/\s/g, '');
};

const getFilename = (filepath) => {
    return removeFileExtension(getLastPathElement(filepath));
};

const getLastPathElement = (path) => {
    return path.split('\\').slice(-1)[0];
};

const removeFileExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.').trim();
};

// Get a file extension without the dot
const getFileExtension = (filename) => {
    return filename.split(".").pop().toLowerCase();
};

// Generate a custom filename
const generateFilename = (filename, config = "none") => {

    switch (config) {
        case "timestamp":
            filename = Date.now() + path.extname(filename).toLowerCase();
            break;

        case "desktop":
            filename = "desktop" + path.extname(filename).toLowerCase();
            break;

        case "clean":
            // Convert accented characters to their unaccented version
            filename = filename.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            // Remove non-ASCII characters
            filename = filename.replace(/[^\x00-\x7F]/g, '');
            // Encode in utf8
            filename = iconv.decode(iconv.encode(filename, 'latin1'), 'utf8');
            break;

        case "original":
        case "none":
        default:
            filename = filename;
            break;
    }

    return filename;
};

const StorageUtils = {
    removeFileExtension,
    getFileExtension,
    generateFilename,
    getLastPathElement,
    getFilename,
    removeSpaces,
    getDirPath,
    getPathElem
};

export default StorageUtils;