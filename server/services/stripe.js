const stripe = require("stripe")(process.env.STRIPE_TEST_KEY);

module.exports = {
    stripeDonate: (req, res, next) => {
        //console.log(req.body)
        return stripe.charges.create({
            amount: 2000,
            currency: "usd",
            description: "An example charge",
            source: req.body.token
        })
            .then(status => {
                return { status };
            })
            .catch(err => {
                console.log(err);
                return { success: false };
            })
    }
};