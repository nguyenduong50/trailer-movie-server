const fs = require('fs');

function getFromFile (pathData, callback) {
    fs.readFile(pathData, (errors, fileContent) => {
        if(errors){
            return callback([]);
        }
        else{
            callback(JSON.parse(fileContent));
        }     
    });
};

module.exports = getFromFile;