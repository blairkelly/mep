var app = module.parent.exports;
var path = require('path');
var find = require('find');

var photographs = [];

//photographs
var photographs_folder = path.resolve(__dirname + '/../public/images/photographs/');
find.fileSync(/\.(gif|jpg|jpeg|tiff|png)$/i, photographs_folder).forEach(function (imgfile) {
    photographs.push(imgfile.substr(photographs_folder.length + 1, imgfile.length));
});

app.get('/', app.mainMiddleware, function (req, res, next) {
    res.locals.photographs = photographs;
    res.locals.photographs_stringified = JSON.stringify(photographs, null, 6);
    res.render('index/index.jade');
});