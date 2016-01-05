/**
 * Created by LocNT on 7/28/15.
 */

var express = require('express');
var router = express.Router();

var trollItemService = require("../services/TrollItemService");

/* POST find all category */
router.get('/find', [function(req, res, next) {
    trollItemService.find(req, res);
}]);

module.exports = router;
