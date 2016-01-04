/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var crawlerDao = new MysqlHelper(Constant.TABLE_NAME_DB.TROLL_FOOTBALL.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

crawlerDao.getMaxIdLocal= function(){
    var sql = SqlQueryConstant.TROLL_FOOTBALL_SQL_SCRIPT.GET_MAX_ID_LOCAL   ;
    var params = [];
    return crawlerDao.queryExecute(sql, params);
};

/*Export*/
module.exports = crawlerDao;