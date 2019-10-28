const massive = require('massive');

module.exports = (app) => {
    massive(process.env.CONNECTION_STRING)
        .then(database => {
            app.set("db", database);
            console.log("Database connected");
        })
        .catch(error => {
            console.log(`Database connection failed: ${error}`);
        });
}