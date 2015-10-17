var app = module.parent.exports;
var sass = require('node-sass');
var md5 = require('MD5');
var fs = require('fs');
var watch = require('node-watch');

var scssPath = __dirname + '/../styles';
var scssFilePath = scssPath + '/style.scss';

var compileCSS = function () {
    sass.render({
        file: scssFilePath,
        outputStyle: 'compressed'
    }, function (err, result) {
        if (err) {
            return console.error("Error rendering SASS.", err);
        }

        var css = app.resources.stylesheets.main.css = result.css.toString();
        app.resources.stylesheets.main.hash = md5(css);

        console.log("Finished compiling CSS. Hash: " + app.resources.stylesheets.main.hash);
    });
}

console.log("Starting node-watch on CSS");
watch(scssPath, function (filename) {
    console.log("Recompiling CSS...");
    compileCSS();
});

compileCSS();

app.get(/^\/style-(\w+)\.css$/, function (req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.end(app.resources.stylesheets.main.css);
});