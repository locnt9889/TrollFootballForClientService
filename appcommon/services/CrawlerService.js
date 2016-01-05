/**
 * Created by LocNT on 7/29/15.
 */
var https = require('https');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var request = require("request");
var cheerio = require("cheerio");
var Q = require("q");

var crawlerDao = require("../daos/CrawlerDao");
var TrollItemPage = require("../models/TrollItemPage");
var ResponseServerDto = require("../modelsDto/ResponseServerDto");

var TYPE_ITEM_IMAGE = {
    NAME : "IMAGE",
    CLASS_PARENT : ".panel-body .img-res"
};

var TYPE_ITEM_VIDEO = {
        NAME : "VIDEO",
        CLASS_PARENT : ".panel-body .vid-responsive"
};

var TITLE = {
    CLASS_PARENT : ".panel-heading .posthead",
    ELEMENT : "h2"
}

var TIME = {
    CLASS_PARENT : ".panel-heading .posthead",
    ELEMENT : ".text-muted"
}

var crawById = function(req, res){
    var responseServerDto = new ResponseServerDto();
    var id = req.query.id;
    var url = 'http://www.trollfootball.me/display.php?id=' + id;

    request(url, function(error, response, html){
        if(error){
            responseServerDto.statusErrorCode = 1;
            responseServerDto.errorsObject = error;
            res.send(responseServerDto);
        }else{
            var $ = cheerio.load(html);

            //check type
            var imageResItems = $(TYPE_ITEM_IMAGE.CLASS_PARENT);
            var videoResItems = $(TYPE_ITEM_VIDEO.CLASS_PARENT);
            var type = "";
            if(videoResItems.length > 0){
                type = TYPE_ITEM_VIDEO.NAME;
                var content = $(TYPE_ITEM_VIDEO.CLASS_PARENT).html();
                var jsonObject = { content : content};
                responseServerDto.statusErrorCode = 0;
                responseServerDto.results = jsonObject;
                res.send(responseServerDto);

            }else if(imageResItems.length > 0){
                type = TYPE_ITEM_IMAGE.NAME;
                var content = $(TYPE_ITEM_IMAGE.CLASS_PARENT).html();
                var jsonObject = { content : content};
                responseServerDto.statusErrorCode = 0;
                responseServerDto.results = jsonObject;
                res.send(responseServerDto);

            }else{
                responseServerDto.statusErrorCode = 1;
                responseServerDto.errorsObject = error;
                responseServerDto.errorsMessage = "item is not found!"
                res.send(responseServerDto);
            }
        }
    })
};

var getMaxIdOnline = function(){
    var defer = Q.defer();
    var url = 'http://www.trollfootball.me/latest.php';
    request(url, function(error, response, html){
        if(error){
            defer.reject(error);
        }else{
            var $ = cheerio.load(html);
            var items = $("#latest-posts .card .play a");
            if(items.length > 0){
                var lastURL = items[0].attribs.href;
                var lastID = lastURL.substring(lastURL.lastIndexOf("id=") + 3);
                if(lastID.indexOf("&") > -1){
                    lastID = lastID.substring(0, lastID.indexOf("&"));
                }
                var numberLastID = parseInt(lastID);
                defer.resolve(numberLastID);
            }else{
                defer.reject("no data");
            }
        }
    })

    return defer.promise;
};

var getMaxIdLocal = function(){
    var defer = Q.defer();

    crawlerDao.getMaxIdLocal().then(function (data) {
        defer.resolve(data);
    }, function (err) {
        defer.reject(err);
    });

    return defer.promise;
};

var getTimeByString = function(str){
    var dateCurrent = new Date();
    var timeLongCurrent = dateCurrent.getTime();
    try {
        var arrayString = str.toLowerCase().split("by");
        var stringTime = arrayString[0].trim();
        if (stringTime.indexOf("ago") > -1) {
            if (stringTime.indexOf("minute") > -1) {
                var mituteStr = stringTime.split("minute");
                var minute = parseInt(mituteStr[0].trim());
                var timeLong = timeLongCurrent - (minute * 60 * 1000);
                return new Date(timeLong);
            }else if(stringTime.indexOf("hour") > -1){
                var hourStr = stringTime.split("hour");
                var hour = parseInt(hourStr[0].trim());
                var timeLong = timeLongCurrent - (hour * 60 * 60 * 1000);
                return new Date(timeLong);
            }else{
                return dateCurrent;
            }
        }else{
            var date = new Date(stringTime);
            return date;
        }
    }catch(ex){
        return dateCurrent;
    }
}

var crawRangId = function(start, end){
    var pre_url = 'http://www.trollfootball.me/display.php?id=';
    for(var currentId = start; currentId <= end; currentId++){
        var url = pre_url + currentId;
        request(url, function(error, response, html){
            if(error){
                console.log("error : ")
            }else{
                //get id
                var path = response.req.path;
                var id = parseInt(path.substring(path.lastIndexOf("=") + 1));

                var $ = cheerio.load(html);

                //check type
                var imageResItems = $(TYPE_ITEM_IMAGE.CLASS_PARENT);
                var videoResItems = $(TYPE_ITEM_VIDEO.CLASS_PARENT);
                var trollItemPage = new TrollItemPage();
                trollItemPage.content_id = id;

                //get title
                var title = $(TITLE.CLASS_PARENT + " " + TITLE.ELEMENT).html();
                trollItemPage.content_title = title;

                //get time
                var timeStr = $(TIME.CLASS_PARENT + " " + TIME.ELEMENT).text();
                var dateCreate = getTimeByString(timeStr);
                trollItemPage.content_time = dateCreate;

                //console.log("crawRangId--" + trollItemPage.content_id + "--title-- " + trollItemPage.content_title);
                if(videoResItems.length > 0){
                    trollItemPage.type = TYPE_ITEM_VIDEO.NAME;
                    var content = $(TYPE_ITEM_VIDEO.CLASS_PARENT).html();
                    trollItemPage.content_embed = content;

                    crawlerDao.addNew(trollItemPage).then(function(result){
                        console.log("Save success item " + trollItemPage.content_id + " in id : " + result.insertId);
                    },function(err){
                        console.log("Save error item " + trollItemPage.content_id);
                    })
                }else if(imageResItems.length > 0){
                    trollItemPage.type = TYPE_ITEM_IMAGE.NAME;
                    var content = $(TYPE_ITEM_IMAGE.CLASS_PARENT).html();
                    trollItemPage.content_embed = content;

                    crawlerDao.addNew(trollItemPage).then(function(result){
                        console.log("Save success item " + trollItemPage.content_id + " in id : " + result.insertId);
                    },function(err){
                        console.log("Save error item " + trollItemPage.content_id);
                    })
                }else{
                    console.log("Item is not found" + trollItemPage.content_id);
                }
            }
        })
    }
};

var localMax = 0;

var reCrawlerData = function(){
    var online = 0;
    var local = 0;
    console.log("localMax : " + localMax);
    getMaxIdOnline().then(function (maxOnline) {
        online = maxOnline;
        console.log("online : " + online);
        getMaxIdLocal().then(function (dataLocal) {
            local = dataLocal[0].MaxLocal ? dataLocal[0].MaxLocal : 0;
            //local = local < 1559 ? 1599 : local;
            if(local > localMax){
                localMax = local;
            }else{
                localMax = localMax + 30;
                local = localMax;
            }
            console.log("local : " + local);
            if(local + 30 >= online > local){
                console.log("------" + (local + 1) +"---" + online + "-----");
                crawRangId(local + 1, online);
            }else if(online > local + 30){
                console.log("------" + (local + 1) +"---" + (local + 30) + "-----");
                crawRangId(local + 1, local + 30);
            }

        }, function (err) {
            console.log("maxLocal error: " + err);
        });

    }, function (err) {
        console.log("maxOnline error: " + err);
    });
};

/*Exports*/
module.exports = {
    crawById : crawById,
    crawRangId : crawRangId,
    reCrawlerData : reCrawlerData
}