var app = module.parent.exports;

app.get('/', app.mainMiddleware, function (req, res, next) {
    res.render('index/index.jade');
});