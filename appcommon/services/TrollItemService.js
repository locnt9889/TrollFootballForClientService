/**
 * Created by LocNT on 7/29/15.
 */
var https = require('https');
var events = require('events');
var Q = require("q");

var crawlerDao = require("../daos/CrawlerDao");
var TrollItemPage = require("../models/TrollItemPage");
var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var Constant = require("../helpers/Constant");
var message = require("../message/en");

var find = function(req, res){
    var responseObj = new ResponseServerDto();
    var pageNum = isNaN(req.query.pageNum) || !req.query.pageNum ? 1 : parseInt(req.query.pageNum);
    var perPage = isNaN(req.query.perPage) || !req.query.perPage ? 10 : parseInt(req.query.perPage);

    var type = ("IMAGE" == req.query.type || "VIDEO" == req.query.type || "IFRAME" == req.query.type) ? req.query.type : "ALL";

    crawlerDao.findAll(pageNum, perPage, type).then(function (data) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data;
        res.send(responseObj);
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var executeIncrease = function(req, res){
    var responseObj = new ResponseServerDto();

    var id = isNaN(req.query.id) || !req.query.id ? 0 : parseInt(req.query.id);
    var type = req.query.type ? req.query.type : "";

    var name_field = "";

    if(id == 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.IMAGE.IMAGE_INVALID;
        responseObj.errorsObject = message.IMAGE.IMAGE_INVALID;
        responseObj.errorsMessage = message.IMAGE.IMAGE_INVALID.message;
        res.send(responseObj);
        return;
    }

    if(type == Constant.INCREASE_TYPE.LIKE){
        name_field = Constant.TABLE_NAME_DB.TROLL_FOOTBALL.NAME_FIELD_COUNT_LIKE;
    }else if(type == Constant.INCREASE_TYPE.SHARE){
        name_field = Constant.TABLE_NAME_DB.TROLL_FOOTBALL.NAME_FIELD_COUNT_SHARE;
    }else{
        responseObj.statusErrorCode = Constant.CODE_STATUS.IMAGE.EXECUTE_TYPE_INVALID;
        responseObj.errorsObject = message.IMAGE.EXECUTE_TYPE_INVALID;
        responseObj.errorsMessage = message.IMAGE.EXECUTE_TYPE_INVALID.message;
        res.send(responseObj);
        return;
    }

    crawlerDao.executeIncrease(name_field, id).then(function (data) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data;
        res.send(responseObj);
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

var getConfigInfo = function(req, res){
    var responseObj = new ResponseServerDto();

    crawlerDao.getConfigServer().then(function (data) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
        responseObj.results = data;
        res.send(responseObj);
    }, function (err) {
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

/*Exports*/
module.exports = {
    find : find,
    executeIncrease : executeIncrease,
    getConfigInfo : getConfigInfo
}