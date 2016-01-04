/**
 * Created by LocNT on 7/28/15.
 */

var mysql     =    require('mysql');

//server 188.166.237.78 for disploy
//var DB_CONFIG = {
//    connectionLimit : 100, //important
//    host : 'localhost',
//    user : 'root',
//    password : 'Chomoi2015',
//    database : 'chomoidb',
//    debug    :  false
//};


//server 104.236.31.239
var DB_CONFIG = {
    connectionLimit : 100, //important
    host     : '6recipes.com',
    user     : 'crawler',
    password : 'crawler2016',
    database : 'crawler',
    debug    :  false
}

/*var DB_CONFIG = {
    connectionLimit : 101, //important
    host     : 'localhost',//188.166.237.78
   // port : 3306,
    user     : 'root',
    password : 'Devchomoi2015',
    database : 'chomoidb',
    debug    :  false
}*/

exports.pool = mysql.createPool(DB_CONFIG);