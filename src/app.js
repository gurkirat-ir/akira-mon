/**
 * @file app.js
 * @description Entry file of the application
 * @author 4 IR  (support[at]4iresearch.com)
 */
import { ArgumentParser, RawDescriptionHelpFormatter } from "argparse";
import { init, log } from "./utils";
import { basename } from "path";
import {
    readFile,
    writeFileSync,
    lstatSync,
    existsSync,
    readFileSync,
    copyFileSync,
    readdir
} from "fs";
import path from "path";
import { config, backupDir } from "./globs";
import Table from "ascii-table";
import { sync as rm } from "rimraf";
import $ from "lodash";
import Watcher from "./watcher";
import { randomStr } from "./utils";
import { sync as md } from "mkdirp";
log("initializing");

// initializing the project
init();

// creating parser
const parser = new ArgumentParser({
    description:
        "Akira-Mon is an file integrity tool. It allows you to monitor file for the following event\r\n\t1. Create Event\r\n\t2. Delete Event\r\n\t3. Modify Event\r\nTo run the monitor, execute the application without any arguments",
    formatterClass: RawDescriptionHelpFormatter,
    prog: basename(process.argv0) !== "node" ? process.argv0 : process.argv[1]
});

// adding arguments
parser.addArgument("--add-dir", {
    help: "absolute/relative path of directory to add for monitoring",
    dest: "add_dirs",
    type: String,
    metavar: "DIR",
    required: false
});

parser.addArgument("--rm-dirs", {
    help: "absolute/relative path of directories to remove from monitor",
    dest: "rm_dirs",
    type: String,
    nargs: "+",
    metavar: "DIRS",
    required: false
});

parser.addArgument("--ls-dirs", {
    help: "list all the directories being monitored",
    dest: "ls_dirs",
    type: Boolean,
    required: false,
    defaultValue: false,
    action: "storeTrue"
});

parser.addArgument("--ls-backups", {
    help: "shows all the backups if exists",
    dest: "ls_backups",
    required: false,
    type: Boolean,
    defaultValue: false,
    action: "storeTrue"
});

parser.addArgument("--restore", {
    help: "id of backup to restore",
    dest: "restore",
    required: false,
    type: String,
    metavar: "ID"
});

parser.addArgument("--rm-backups", {
    help: "id(s) of backup to delete",
    dest: "rm_backups",
    required: false,
    type: String,
    nargs: "+",
    metavar: "ID"
});

// parse args
let args = parser.parseArgs();

/**
 * List backups
 */
if (args.ls_backups) {
    readFile(config, { encoding: "utf8" }, (err, content) => {
        if (err) {
            log(err.message, true);
            console.error(err.message);
            process.exit(1);
        }
        let data = JSON.parse(content).backup;

        if (Object.keys(data).length == 0) {
            log("No previous backup found", true);
            console.error("No previous backup found");
            process.exit(1);
        }

        let table = new Table("Backups");
        table.setHeading("id", "directory");
        for (const dir in data) {
            const id = data[dir];
            table.addRow(id, dir);
        }
        console.log(table.toString());
    });
} else if (args.rm_backups) {
    /**
     * Remove backups
     */
    readFile(config, { encoding: "utf8" }, (err, content) => {
        if (err) {
            log(err.message, true);
            console.error(err.message);
            process.exit(1);
        }
        let data = JSON.parse(content);

        if (!Object.keys(data.backup).length) {
            log("No previous backup found", true);
            console.error("No previous backup found");
            process.exit(1);
        }

        let table = new Table("Removed Backups");
        table.setHeading("id", "directories");

        args.rm_backups.forEach(backup => {
            let dir = path.join(backupDir, backup);
            let check = $.findKey(data.backup, v => v === backup);

            if (existsSync(dir) && check) {
                rm(dir);
                delete data.backup[check];
                table.addRow(backup, dir);
            } else {
                table.addRow(backup, "Not Found");
            }
        });

        console.log(table.toString());
        writeFileSync(config, JSON.stringify(data));
    });
} else if (args.add_dirs) {
    /**
     * Add dirs
     */
    let content = readFileSync(config);
    let data = JSON.parse(content);
    let id = randomStr();
    let dir = path.resolve(args.add_dirs);

    if (lstatSync(dir).isDirectory()) {
        if (data.dirs.indexOf(dir) < 0) {
            data.dirs.push(dir);
        }

        readdir(dir, (err, files) => {
            if (err) {
                log(err.message, true);
                console.error(err.message);
                process.exit(1);
            }
            let dest = path.join(backupDir, id);

            md(dest, { mode: 0o700 });

            files.forEach(file => {
                let _ = path.resolve(path.join(args.add_dirs, file));
                let __ = path.resolve(dest, file);
                if (!lstatSync(_).isDirectory()) {
                    data.backup[dir] = id;
                    copyFileSync(_, __);
                }
            });

            log("backed up " + dir);
            writeFileSync(config, JSON.stringify(data));
        });
    }
} else if (args.ls_dirs) {
    /**
     * List dirs
     */
    readFile(config, { encoding: "utf8" }, (err, content) => {
        if (err) {
            log(err.message, true);
            console.error(err.message);
            process.exit(1);
        }

        let data = JSON.parse(content);
        let table = new Table("Directories");

        table.setHeading("", "path");

        if (data.dirs.length === 0) {
            log("No directories found", true);
            console.error("No directories found");
            process.exit(1);
        }

        data.dirs.forEach((dir, i) => {
            table.addRow(i + 1, dir);
        });

        console.log(table.toString());
    });
} else if (args.rm_dirs) {
    /**
     * Remove dirs
     */
    readFile(config, { encoding: "utf8" }, (err, content) => {
        if (err) {
            log(err.message, true);
            console.error(err.message);
            process.exit(1);
        }

        let data = JSON.parse(content);
        let table = new Table("Directories Removed");

        table.setHeading("", "path");

        if (data.dirs.length === 0) {
            log("No directories found", true);
            console.error("No directories found");
            process.exit(1);
        }

        let i = 1;

        args.rm_dirs.forEach(dir => {
            let cutBy = data.dirs.indexOf(dir);
            if (cutBy >= 0) {
                data.dirs.splice(cutBy, 1);
                log("removed " + dir + " from config");
                config.log("removed " + dir + " from config");
                table.addRow(i++, dir);
            }
        });

        console.log(table.toString());
        writeFileSync(config, JSON.stringify(data));
    });
} else if (args.restore) {
    /**
     * Restore the folder
     */
    let t = JSON.parse(readFileSync(config)).backup;

    let dest = Object.keys(t).find(key => t[key] === args.restore);
    let src = path.resolve(path.join(backupDir, args.restore));

    readdir(src, (err, files) => {
        if (err) {
            log(err.message, true);
            console.error(err.message);
            process.exit(1);
        }

        files.forEach(file => {
            copyFileSync(
                path.resolve(path.join(src, file)),
                path.resolve(path.join(dest, file))
            );
        });

        log("restored to " + dest);
        console.log("Restored to " + dest);
    });
} else {
    /**
     * Start the watchman
     */
    let watchman = new Watcher();
    watchman.watch();
}

// handling CTRL + C
process.on("SIGINT", function() {
    log("user interrupt");
    console.log("\ruser interrupt");
    process.exit(0);
});
