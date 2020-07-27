/**
 * @file globs.js
 * @description All the global and shared variables
 * @author 4 IR  (support[at]4iresearch.com)
 */
import * as path from "path";
import * as os from "os";

/**
 * @name baseDir
 * @description The base directory of the application
 */
export const baseDir = path.join(os.userInfo().homedir, ".akira-mon");

/**
 * @name backupDir
 * @description The backup directory of the application
 */
export const backupDir = path.join(baseDir, "backups");

/**
 * @name errorLog
 * @description The error log file path of the application
 */
export const errorLog = path.join(baseDir, "error.log");

/**
 * @name accessLog
 * @description The access log file path of the application
 */
export const accessLog = path.join(baseDir, "access.log");

/**
 * @name config
 * @description The config file path of the application
 */
export const config = path.join(baseDir, "config.json");
