/**
 * Created by LocNT on 7/29/15.
 */

var GENERIC_SQL = {
    SLQ_FINDALL : "SELECT * FROM ??",
    SLQ_FINDALL_ACTIVE : "SELECT * FROM ?? WHERE ?? = 1",
    SLQ_FINDONE_BY_ID : "SELECT * FROM ?? WHERE ?? = ?",
    SLQ_FINDALL_BY_FIELD : "SELECT * FROM ?? WHERE ?? = ?",
    SLQ_FINDALL_BY_FIELD_ACTIVE : "SELECT * FROM ?? WHERE ?? = ? AND isActive = 1",
    SLQ_ADD_NEW : "INSERT INTO ?? SET ?",
    SLQ_UPDATE : "UPDATE ?? SET ? WHERE ?? = ?",
    SLQ_DO_INACTIVE : "UPDATE ?? SET active = 0 WHERE ?? = ?",
    SLQ_REMOVE : "DELETE FROM ?? WHERE ?? = ?"
}

var TROLL_FOOTBALL_SQL_SCRIPT = {
    FIND_COUNT: "SELECT COUNT(*) AS totalItems FROM troll_football_1 WHERE #param",
    FIND : "SELECT * FROM troll_football_1 WHERE #param ORDER BY content_id DESC LIMIT ?,?",
    EXECUTE_INCREASE : "UPDATE troll_football_1 SET ?? = ?? + 1 WHERE id = ?"
}
/*Exports*/

module.exports = {
    GENERIC_SQL : GENERIC_SQL,
    TROLL_FOOTBALL_SQL_SCRIPT : TROLL_FOOTBALL_SQL_SCRIPT
}