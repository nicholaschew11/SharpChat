const Yup = require("yup");

const loginSchema = Yup.object({
    username: Yup.string().required("Username Required").min(5, "Too Short").max(30, "Too Long"),
    password: Yup.string().required("Password Required").min(5, "Too Short").max(30, "Too Long"),
});

const validate = (req, res, next) => {
    const data = req.body;
    loginSchema
        .validate(data)
        .catch(error => {
            console.log(error.errors);
            res.status(422).send();
        })
        .then(valid => {
            if (valid) {
                console.log("Form Good");
                next();
            } else {
                res.status(422).send();
            }
    });
}

module.exports = validate;