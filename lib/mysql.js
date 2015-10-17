var exports = {}
var mysql = require('mysql');

exports.connect = function (options, cb) {
    //         charset: 'utf8mb4'
    var connection = mysql.createConnection(options);
    connection.connect(function (err) {
        if(err) {
            console.error("Error connecting to database.", err);
            return cb(err, null);
        }
        cb(null, connection);
    });
}

exports.query = function (query, cb) {
    var options = {
        host     : process.env.MYSQL_DBADDRESS || 'localhost',
        port     : process.env.MYSQL_DBPORT || 3306,
        database : process.env.MYSQL_DBNAME,
        user     : process.env.MYSQL_DBUSER,
        password : process.env.MYSQL_DBPASS,
        multipleStatements: false,
        supportBigNumbers: true,
        bigNumberStrings: true,
        charset: 'utf8mb4'
    }
    exports.connect(options, function (err, connection) {
        if (err) {
            return cb(err);
        }
        connection.query(query, function (err, rows, fields) {
            if (err) {
                connection.destroy();
                return cb(err);
            }
            connection.end(function (err) {
                if (err) {
                    console.error("Trouble ending mysql connection");
                }
                cb(null, rows);
            });
        });
    });
}

exports.query_specific = function (options, query, cb) {
    exports.connect(options, function (err, connection) {
        if (err) {
            return cb(err);
        }
        connection.query(query, function (err, rows, fields) {
            if (err) {
                connection.destroy();
                return cb(err);
            }
            connection.end(function (err) {
                if (err) {
                    console.error("Trouble ending mysql (query_specific) connection");
                }
                connection.destroy();
                cb(null, rows);
            });
        });
    });
}

exports.mysql = mysql;

//needed to export
module.exports = exports;