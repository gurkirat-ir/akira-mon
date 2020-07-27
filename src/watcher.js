import { readFileSync } from "fs";
import { config } from "./globs";
import { log } from "./utils";
import DirWatcher from "directory-watcher";
import Backup from "./backup";

/**
 * @file watcher.js
 * @description Watcher class definition for akira-mon
 * @author 4 IR  (support[at]4iresearch.com)
 */

export default class Watcher {
    /**
     * Creates an instance of Watcher.
     * @memberof Watcher
     */
    constructor() {
        // reading the config
        let content = readFileSync(config, { encoding: "utf8" });
        // parsing config
        let data = JSON.parse(content);
        // getting dirs
        this.dirs = data.dirs;

        // if no dir found, log and exit
        if (this.dirs.length === 0) {
            log("No directory to watch", true);
            console.log("No directory to watch");
            process.exit(1);
        }
        // create backup instance
        this.backup = new Backup();
    }

    watch() {
        // add fs.watch to each dir
        this.dirs.forEach(dir => {
            log("started watchman on " + dir);
            console.log("started watchman on " + dir);

            DirWatcher.create(dir, (err, watcher) => {
                if (err) {
                    log(err, true);
                    console.error(err);
                } else {
                    watcher.on("change", function(files) {
                        files.forEach(file => {
                            log(`${file} changed in ${dir}`);
                            console.log(`${file} changed in ${dir}`);
                            console.log("DIR", dir);
                            console.log(file);
                        });
                    });

                    watcher.on("delete", function(files) {
                        files.forEach(file => {
                            log(`${file} deleted from ${dir}`);
                            console.log(`${file} deleted from ${dir}`);
                        });
                    });

                    watcher.on("add", function(files) {
                        files.forEach(file => {
                            log(`${file} added in ${dir}`);
                            console.log(`${file} added in ${dir}`);
                        });
                    });
                }
            });
        });
    }
}
