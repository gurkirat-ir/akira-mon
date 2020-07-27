/**
 * @file utils.js
 * @description Utility definitions for the project
 * @author 4 IR  (support[at]4iresearch.com)
 */
import * as fs from "fs";
import * as mkdir from "mkdirp";
import { backupDir, config, errorLog, accessLog } from "./globs";
import * as path from "path";
/**
 * @function init
 * @description Function to initialize the project for first run
 *
 * @export
 */
export function init() {
    // check for backupdir
    if (!fs.existsSync(backupDir)) {
        mkdir.sync(backupDir, { mode: 0o700 });
    }

    // check for config file
    if (!fs.existsSync(config))
        fs.writeFileSync(config, JSON.stringify({ dirs: [], backup: {} }));

    // check for access log file
    if (!fs.existsSync(accessLog)) fs.writeFileSync(accessLog, "");
    // check for error log file
    if (!fs.existsSync(errorLog)) fs.writeFileSync(errorLog, "");
}

/**
 * @function randomStr
 * @description Function to create a random string
 * @export
 * @returns {string}
 */
export function randomStr() {
    return Math.random()
        .toString(36)
        .substr(2);
}

/**
 * @function log
 * @description Function to log message to the file
 *
 * @export
 * @param {string} msg
 * @param {boolean} [isErr=false]
 */
export function log(msg, isErr = false) {
    // checking if error log
    if (isErr) {
        // appending error.log
        fs.appendFileSync(
            errorLog,
            "[ " + new Date().toString() + " ]\n" + msg + "\n\n"
        );
    } else {
        // appending access.log
        fs.appendFileSync(
            accessLog,
            "[ " + new Date().toString() + " ]\n" + msg + "\n\n"
        );
    }
}

/**
 * Function to create backup logs
 *
 * @export
 * @param {string} dir
 * @param {string} id
 */
export function backUpLog(dir, id) {
    // reading the config file
    fs.readFile(config, { encoding: "utf8" }, (err, content) => {
        // check if error while reading
        if (err) {
            // log error
            log(err.message, true);
            console.error(err.message);
            // return
            return;
        }
        // parsing the content
        let data = JSON.parse(content);

        // check if no backup added, then add
        if (!data.backup) data.backup = {};

        // add the directory
        data.backup[dir] = id;

        // save the file from buffer to disk
        fs.writeFile(config, JSON.stringify(data), err => {
            // if error saving
            if (err) {
                // log error
                log(err.message, true);
                console.error(err.message);
                // return
                return;
            }
            // log success
            log("added backup to config");
            console.log("added backup to config");
        });
    });
}

/**
 * Function to copy entire dir
 *
 * @export
 * @param {string} src
 * @param {string} dest
 */
export function copyDir(src, dest) {
    mkdir.sync(dest);
    let files = fs.readdirSync(src);
    files.forEach(f => {
        let _x = path.resolve(f);
        if (!fs.lstatSync(_x).isDirectory())
            fs.copyFileSync(path.join(src, f), path.join(dest, f));
    });
    log("Copied the " + src + " to " + dest);
    console.log("Copied the " + src + " to " + dest);
}
