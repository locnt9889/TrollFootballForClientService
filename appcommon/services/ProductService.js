/**
 * Created by LocNT on 7/29/15.
 */
var MD5 = require("MD5");
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
var multiparty = require('multiparty');

var UploadResponseDTO = require("../modelsDto/UploadResponseDTO");

var productDao = require("../daos/ProductDao");
var categoryDao = require("../daos/CategoryDao");

var ResponseServerDto = require("../modelsDto/ResponseServerDto");
var Product = require("../models/Product");

var Constant = require("../helpers/Constant");
var message = require("../message/en");
var checkValidateUtil = require("../utils/CheckValidateUtil");
var serviceUtil = require("../utils/ServiceUtil");
var uploadFileHelper = require("../helpers/UploadFileHelper");

var createProduct = function(req, res){
    var responseObj = new ResponseServerDto();

    var accessTokenObj = req.accessTokenObj;
    var userID = accessTokenObj.userID;

    var productName = req.body.productName ? req.body.productName : "";
    var productCode = req.body.productCode ? req.body.productCode : "";
    var isShow = req.body.isShow ? req.body.isShow : false;
    var count = req.body.count ? req.body.count : 0;
    var price = req.body.price ? req.body.price : 0.0;
    var isSale = req.body.isSale ? req.body.isSale : false;
    var salePrice = req.body.salePrice ? req.body.salePrice : 0.0;
    var dateStartSale = req.body.isShow ? req.body.isShow : new Date();
    var dateEndSale = req.body.isShow ? req.body.isShow : new Date();

    var categoryID = isNaN(req.body.categoryID)? 0 : parseInt(req.body.categoryID);

    if(checkValidateUtil.isEmptyFeild(productName) || checkValidateUtil.isEmptyFeild(productCode)){
        responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT.CREATE_PRODUCT_EMPTY_FIELD;
        responseObj.errorsObject = message.PRODUCT.CREATE_PRODUCT_EMPTY_FIELD;
        responseObj.errorsMessage = message.PRODUCT.CREATE_PRODUCT_EMPTY_FIELD.message;
        res.send(responseObj);
        return;
    }

    if(categoryID <= 0){
        responseObj.statusErrorCode = Constant.CODE_STATUS.CATEGORY.CATEGORY_INVALID;
        responseObj.errorsObject = message.CODE_STATUS.CATEGORY.CATEGORY_INVALID;
        responseObj.errorsMessage = message.CODE_STATUS.CATEGORY.CATEGORY_INVALID.message;
        res.send(responseObj);
        return;
    }
    productDao.checkProductNameOfCategoryExist(categoryID, productName).then(function(data){
        if(data.length == 0){
            categoryDao.checkPermissionUserAndCategory(userID, categoryID).then(function(data){
                if(data.length > 0){
                    var product = new Product();

                    product.categoryID = categoryID;
                    product.count = count;
                    product.dateEndSale = dateEndSale;
                    product.dateStartSale = dateStartSale;
                    product.isSale = isSale;
                    product.isShow = isShow;
                    product.price = price;
                    product.productCode = productCode;
                    product.productName = productName;
                    product.salePrice = salePrice;

                    productDao.addNew(product).then(function(result){
                        responseObj.statusErrorCode = Constant.CODE_STATUS.SUCCESS;
                        responseObj.results = result;
                        res.send(responseObj);

                    },function(err){
                        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                        responseObj.errorsObject = err;
                        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                        res.send(responseObj);
                    });
                }else{
                    responseObj.statusErrorCode = Constant.CODE_STATUS.CATEGORY.CATEGORY_UPDATE_USER_IS_DENIED;
                    responseObj.errorsObject = message.CATEGORY.CATEGORY_UPDATE_USER_IS_DENIED;
                    responseObj.errorsMessage = message.CATEGORY.CATEGORY_UPDATE_USER_IS_DENIED.message;
                    res.send(responseObj);
                }
            }, function(err){
                responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
                responseObj.errorsObject = err;
                responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
                res.send(responseObj);
            });
        }else{
            responseObj.statusErrorCode = Constant.CODE_STATUS.PRODUCT.CREATE_PRODUCT_NAME_OF_CATEGORY_EXIST;
            responseObj.errorsObject = message.PRODUCT.CREATE_PRODUCT_NAME_OF_CATEGORY_EXIST;
            responseObj.errorsMessage = message.PRODUCT.CREATE_PRODUCT_NAME_OF_CATEGORY_EXIST.message;
            res.send(responseObj);
        }
    }, function(err){
        responseObj.statusErrorCode = Constant.CODE_STATUS.DB_EXECUTE_ERROR;
        responseObj.errorsObject = err;
        responseObj.errorsMessage = message.DB_EXECUTE_ERROR.message;
        res.send(responseObj);
    });
};

/*Exports*/
module.exports = {
    createProduct : createProduct
}