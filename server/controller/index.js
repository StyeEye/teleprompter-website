const user = require('./user');
const events = require('./events');
const projects = require('./projects');
const stripe = require('./stripe')
const { authMiddleware } = require('../middleware/auth');


module.exports = (app) => {
    app.use('/auth', user);
    app.use('/api/events', authMiddleware, events);
    app.use('/api/project', authMiddleware, projects);
    app.use('/api/stripe', authMiddleware, stripe);
}