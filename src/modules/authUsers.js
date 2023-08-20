const User = require('../models/userModels.js');
const bcrypt = require('bcrypt');

const verify = (username, password, done) => {
    findByUserName(username, (err, user) => {
        if (err) {
            return done(err);
        };
        if (!user) {
            return done(null, false);
        };
        
        if (!verifyPassword(user, password)) {
            console.log("Ошибка проверки");

            return done(null, false);
        };

        return done(null, user);
    });
};

const findById = (id, cb) => {
    process.nextTick(async() => {
        try {
            const user = await User.findById(id);
            if (user) {
                cb(null, user)
            } else {
                cb(new Error('User ' + id + ' does not exist'))
            }
        } catch(err) {
            console.log(err.message);      
        };
    });
};

const findByUserName = (username, cb) => {
    process.nextTick(async() => {
        try {
            const user = await User.findOne({email: username});      
            if (user) {
                return cb(null, user)
            }
        } catch (err) {
            console.log(err.message);
        }
        
        return cb(null, null)
    });
};

const verifyPassword = (user, password) => {  
    try {
        const comp = bcrypt.compareSync(password, user.passwordHash);
        return comp;
    } catch(e) {
        console.log('bcrypt error: ', e.message);      
    } 
};

module.exports = {verify, findById};