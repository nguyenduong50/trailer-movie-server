const path = require('path');
const pathDirName = require('../utils/pathDirName');
const getFromFile = require('../utils/getFromFile');

//path dummy Data 
const pathUserToken = path.join(pathDirName, 'data', 'userToken.json');

//Class User
module.exports = class User {
    static fetchUsers(callback) {
        getFromFile(pathUserToken, callback);
    };
}
