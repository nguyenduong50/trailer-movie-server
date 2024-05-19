const movieRouter = require('./movie');

const router = (app) => {
    app.use('/api', movieRouter);
    app.use((req, res, next) => {
        res.status(404).send({message: "Page not found"});
    });
};

module.exports = router;