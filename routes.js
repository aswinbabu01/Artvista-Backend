module.exports = async function (app) {
    require('./app-routes/auth-routes')(app);
    require('./app-routes/protected-routes')(app);
}