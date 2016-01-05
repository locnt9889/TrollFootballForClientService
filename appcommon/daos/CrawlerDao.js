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

crawlerDao.findAll= function(pageNum, perPage){
    var def = Q.defer();

    var start = perPage * (pageNum-1);

    //build sql
    var sqlCount = SqlQueryConstant.TROLL_FOOTBALL_SQL_SCRIPT.FIND_COUNT;
    var sql = SqlQueryConstant.TROLL_FOOTBALL_SQL_SCRIPT.FIND;

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

/*Export*/
module.exports = crawlerDao;