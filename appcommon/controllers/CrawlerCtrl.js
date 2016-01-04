/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var crawlerService = require("../services/CrawlerService");

/* POST find all category */
router.get('/by-id', [function(req, res, next) {
    crawlerService.crawById(req, res);
}]);

/* POST find all category */
router.get('/rang-id', [function(req, res, next) {
    //crawlerService.crawRangId(73500, 73550);
    crawlerService.reCrawlerData();
}]);

module.exports = router;
