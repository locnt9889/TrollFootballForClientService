/**
 * Created by LocNT on 7/30/15.
 */
var Q = require("q");
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

var MysqlHelper = new require("../helpers/MysqlHelper");
var Constant = require("../helpers/Constant");
var crawlerDao = new MysqlHelper(Constant.TABLE_NAME_DB.TROLL_FOOTBALL.NAME);
var ResponsePagingDto = require("../modelsDto/ResponsePagingDto");

crawlerDao.findAll= function(pageNum, perPage, type){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    //build sql
    var sqlCount = SqlQueryConstant.TROLL_FOOTBALL_SQL_SCRIPT.FIND_COUNT;
    var sql = SqlQueryConstant.TROLL_FOOTBALL_SQL_SCRIPT.FIND;

    //if(type != "ALL"){
    //    sqlCount = sqlCount.replace("#param", " type = '"+ type +"'");
    //    sql = sql.replace("#param", " type = '"+ type +"'");
    //}else{
    //    sqlCount = sqlCount.replace("#param", "1");
    //    sql = sql.replace("#param", "1");
    //}

    if(type == "IMAGE"){
        sqlCount = sqlCount.replace("#param", " type = 'IMAGE'");
        sql = sql.replace("#param", " type = 'IMAGE'");
    }else if(type == "VIDEO"){
        sqlCount = sqlCount.replace("#param", " (type = 'VIDEO' OR type = 'IFRAME')");
        sql = sql.replace("#param", " (type = 'VIDEO' OR type = 'IFRAME')");
    }else{
        sqlCount = sqlCount.replace("#param", "1");
        sql = sql.replace("#param", "1");
    }

    var paramCount = [];

    crawlerDao.queryExecute(sqlCount, paramCount).then(function(data){
        var responsePagingDto = new ResponsePagingDto();
        var totalItems = data[0].totalItems;
        var totalPages = parseInt(totalItems / perPage);
        if((totalItems / perPage) > totalPages){
            totalPages = totalPages + 1;
        }

        responsePagingDto.pageNum = pageNum;
        responsePagingDto.perPage = perPage;
        responsePagingDto.totalItems = totalItems;
        responsePagingDto.totalPages = totalPages;

        var params = [start, perPage];
        crawlerDao.queryExecute(sql, params).then(function(data1){
            responsePagingDto.items = data1;

            def.resolve(responsePagingDto);
        }, function(err){
            def.reject(err);
        });
    }, function(err){
        def.reject(err);
    });

    return def.promise;
};

crawlerDao.executeIncrease= function(name_field, id){
    var sql = SqlQueryConstant.TROLL_FOOTBALL_SQL_SCRIPT.EXECUTE_INCREASE;
    var params = [name_field, name_field, id];
    return crawlerDao.queryExecute(sql, params);
};

/*Export*/
module.exports = crawlerDao;