const bcrypt = require('bcrypt');
const User = require('../models/userModels.js');


class UserModel {
    static getUserData = (user) => {
        const {_id, email, name, contactPhone} = user;
        return {
            _id,
            email,
            name,
            contactPhone: (contactPhone === undefined)? "not defined": contactPhone,
        };
    };

    static create = async function(data) {
        const {email, password, name, contactPhone} = data;
        
        if (email && password && name) {
                        
            const emailIsOccupied = await UserModel.findByEmail(email);

            if (!emailIsOccupied) {
                const salt = bcrypt.genSaltSync(10);
                const passwordHash = bcrypt.hashSync(password, salt);
                
                const newUser = new User({email, passwordHash, name, contactPhone});
                
                try {
                    return await newUser.save();
                } catch(e) {
                    console.log('Error: user saving DB error.');

                    return null;
                }
            } else {
                return null;
            }
        }    
    };

    static findByEmail = async function(email) {
        try {
            const userExists = await User.find({email: email}).exec();

            if (userExists.length !== 0) {
                return userExists;
            } else {
                return null;
            }
        } catch (e) {
            console.error(`Database Error: Can't find a user`);             
        }        
    }
};

module.exports = UserModel;