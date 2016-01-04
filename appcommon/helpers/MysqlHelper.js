/**
 * Created by LocNT on 7/28/15.
 */

var Q = require('q');

var DbConfig = require("./DatabaseConfig");
var pool = DbConfig.pool;
var SqlQueryConstant = require("../helpers/SqlQueryConstant");

/**
 * Object MysqlHelper is generic Dao
 * @param tablename : string - table name of db table
 */
var MysqlHelper = function(tableName){
    this.tableName = tableName;
}

/**
 * Execute a query
 * @param sql : string
 * @param params : []
 */
var queryExecute = function(sql, params) {
    var deferred = Q.defer();
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * Find all
 */
var findAll = function() {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FINDALL;
    var params = [this.tableName];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * Find all record with active = 1
 * @param : activeFieldName - active name field
 */
var findAllActive = function(activeFieldName) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FINDALL_ACTIVE;
    var params = [this.tableName, activeFieldName];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * find one by id
 * @param id : number
 * @param : idName - id name field
 */
var findOneById = function(idName ,id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FINDONE_BY_ID;
    var params = [this.tableName, idName, id];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * add new
 * @param obj : Object
 * @param tableName : String
 */
var addNewCustom = function(tableName, obj) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_ADD_NEW;
    var params = [tableName, obj];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * add new
 * @param obj : Object
 */
var addNew = function(obj) {
    return addNewCustom(this.tableName, obj);
};

/**
 * update
 * @param obj : Object
 * @param id : Number
 * @param : idName - id name field
 */
var update = function(obj, idName, id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_UPDATE;
    var params = [this.tableName, obj, idName, id];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * inactivate
 * @param id : Number
 * @param : idName - id name field
 */
var inactivate = function(idName, id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_DO_INACTIVE;
    var params = [this.tableName, idName, id];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * remove
 * @param id : Number
 * @param : idName - id name field
 */
var remove = function(idName, id) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_REMOVE;
    var params = [this.tableName, idName, id];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,result){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(result);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * find all by field
 * @param fieldName : fieldName
 * @param : fieldValue - fieldValue
 */
var findAllByField = function(fieldName ,fieldValue) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FINDALL_BY_FIELD;
    var params = [this.tableName, fieldName, fieldValue];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/**
 * find all by field with active ===== isActive
 * @param fieldName : fieldName
 * @param : fieldValue - fieldValue
 */
var findAllByFieldWithActive = function(fieldName ,fieldValue) {
    var deferred = Q.defer();
    var sql = SqlQueryConstant.GENERIC_SQL.SLQ_FINDALL_BY_FIELD_ACTIVE;
    var params = [this.tableName, fieldName, fieldValue];
    pool.getConnection(function(err,connection){
        if (err) {
            //connection.release();
            deferred.reject(err);
        }else{
            connection.query(sql, params, function(err,rows){
                connection.release();
                if(err) {
                    deferred.reject(err);
                }else{
                    deferred.resolve(rows);
                }
            });
        }
    });
    return deferred.promise;
};

/*Export*/
MysqlHelper.prototype.queryExecute = queryExecute;
MysqlHelper.prototype.findAll = findAll;
MysqlHelper.prototype.findAllActive = findAllActive;
MysqlHelper.prototype.findOneById = findOneById;
MysqlHelper.prototype.addNewCustom = addNewCustom;
MysqlHelper.prototype.addNew = addNew;
MysqlHelper.prototype.update = update;
MysqlHelper.prototype.inactivate = inactivate;
MysqlHelper.prototype.remove = remove;
MysqlHelper.prototype.findAllByField = findAllByField;
MysqlHelper.prototype.findAllByFieldWithActive = findAllByFieldWithActive;
module.exports = MysqlHelper;