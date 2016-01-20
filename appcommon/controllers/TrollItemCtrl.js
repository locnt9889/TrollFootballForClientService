/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var trollItemService = require("../services/TrollItemService");

/* GET find all category */
router.get('/find', [function(req, res, next) {
    trollItemService.find(req, res);
}]);

/* GET exexute */
router.get('/execute', [function(req, res, next) {
    trollItemService.executeIncrease(req, res);
}]);

/* GET exexute */
router.get('/config-info', [function(req, res, next) {
    trollItemService.getConfigInfo(req, res);
}]);

module.exports = router;
