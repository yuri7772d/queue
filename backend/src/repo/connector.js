import mysql from "mysql2/promise"
import configEnv from "../config.load.js";
const mysqlConf = configEnv.mysql;
export default mysql.createPool({
    host:mysqlConf.host,
    user:mysqlConf.usernsme,
    password:mysqlConf.password,
    database:mysqlConf.db,
    port:mysqlConf.port,
});

