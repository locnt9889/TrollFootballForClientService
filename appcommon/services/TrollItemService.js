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

    var type = ("IMAGE" == req.query.type || "VIDEO" == req.query.type) ? req.query.type : "ALL";

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

/*Exports*/
module.exports = {
    find : find
}