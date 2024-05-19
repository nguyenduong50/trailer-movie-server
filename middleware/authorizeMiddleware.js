const User = require('../models/User');

module.exports = function authorizeMiddleware(req, res, next) {
    if(!req.query.token){
        res.statusCode = 401;
        return res.send({message: "Unauthorized"});
    }

    const token = req.query.token;
    let isAuthorized = false;
    User.fetchUsers(users => {
        users.forEach(user => {
            if(user.token === token){
                isAuthorized = true;
            }
        });

        if(!isAuthorized){
            res.statusCode = 401;
            return res.send({message: "Unauthorized"});
        }
        next();
    });
}
