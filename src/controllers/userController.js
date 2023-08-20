const {passport} = require("../config/config.passport");
const { UserModule } = require("../modules");


exports.signin = (req, res, next) => {
    if (req.body.password && req.body.email) {
        passport.authenticate("local", (err, user, info) => {
            if (err) { 
                return res.status(500).json({
                    error: info,
                    status:"error"
                });
            }
            if (!user) { 
                return res.status(400).json({
                    error: "Неверный логин или пароль",
                    status:"error"
                });
            }
            req.logIn(user, (err) => {                
                if (err) {
                    return next(err); 
                }

                return res.status(200).json({
                    data: UserModule.getUserData(user),
                    status: "Ok"
                }); 
            });
        })(req, res, next);
    } else {
        res.status(400).json({
            error: "Неверный логин или пароль",
            status:"error"
        });
    };
};

exports.getCurrentUser = (req, res) => {
    if (req.user) {
        res.status(200).json(UserModule.getUserData(req.user));                
    } else {
        res.status(200).json({
            reply: 'No user logged in',
            status: "error"
        });
    };
};

exports.logaut = (req, res) => {
    if (req.user) {
        req.logout((err) => {
            if (err) {
                console.error(err);
                return next(err);
            }
            res.status(200).json({
                reply: "Logged out",
                status: "Ok"
            });
        });
    } else {
        res.status(400).json({
            reply: "No user logged in",
            status: "Bad request"
        });
    }
};

exports.signup = async(req, res) => {
    if (req.user) {
        res.status(400).json({
            reply: "Please, log out first",
            status: "error"
        })
    } else {
        const newUser = await UserModule.create(req.body);
        if (newUser) {
            res.status(200).json({
                data: UserModule.getUserData(newUser),
                status: "ok"
            });
        } else { 
            res.status(500).json({
                error: "Не удалось зарегистрировать пользователя",
                status: "error"
            });              
        };
    };
};


// exports.create = async(req, res) => {
//     const { email, contactPhone, name, passwordHash } = req.body;
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
//     const matchCheckEmail = await findUserByEmail(email);
//      // регулярное выражение для валидации телефона +7 999 1234567 | 8 (999) 123-45-67 | +7(999)1234567
//     const phoneRegex = /^(?:\+7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}$/;
//     const nameRegex = /^[a-zA-Z]+$/;
//     const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;

//     if (!emailRegex.test(email)) {
//         return res.status(400).json("Некорректный email");
//     }

//     if(matchCheckEmail) {
//         return res.status(400).json("email уже зарегистрирован");
//     }

//     if (!phoneRegex.test(contactPhone)) {
//         return res.status(400).json("Некорректный телефон");
//     }
    
//     if (!nameRegex.test(name)) {
//         return res.status(400).json("Некорректное имя");
//     }
    
//     if (!passwordRegex.test(passwordHash)) {
//         return res.status(400).json("Некорректный пароль");
//     }

//     const newUser = new UserDb({email, contactPhone, name, passwordHash});
//     try {
//         newUser.save();
//         res.json("все хорошо");
//     } catch(err) {
//         console.log(err);
//         res.status(500).json("Произошла ошибка при сохранении пользователя");
//     }
// }