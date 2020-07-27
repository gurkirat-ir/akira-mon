# What is akira-monitor

Akira-Monitor is an file integrity tool. 

It allows you to monitor file for the following event
1. Create Event
2. Delete Event
3. Modify Event

To run the monitor, execute the application without any arguments


# Setup and install

## For End Users

Use the executables

Download from releases, https://github.com/4ir/akira-monitor/releases
  
## For developers
1. Fork the repository
2. Clone the repository
  
   ```
   $ git clone https://github.com/4ir/akira-monitor.git
   ```
3. Change the directory
  
   ```
   $ cd akira-monitor
   ```
4. Install the dependencies
  
   ```
   $ npm install
   ```
   Note: NodeJS and NPM must be preinstalled

# Help and usage

```
usage: akira-mon [-h] [--add-dir DIR] [--rm-dirs DIRS [DIRS ...]] [--ls-dirs]
                 [--ls-backups] [--restore ID] [--rm-backups ID [ID ...]]
                 

Optional arguments:
  -h, --help            Show this help message and exit.
  --add-dir DIR         absolute/relative path of directory to add for 
                        monitoring
  --rm-dirs DIRS [DIRS ...]
                        absolute/relative path of directories to remove from 
                        monitor
  --ls-dirs             list all the directories being monitored
  --ls-backups          shows all the backups if exists
  --restore ID          id of backup to restore
  --rm-backups ID [ID ...]
                        id(s) of backup to delete
                        
```

## Contribution

### Rules
1. Comment should be relevant to 
2. Pull request should be made from another branch apart from `master`
3. Pull request description should contain 
    + Type of change
      + Addition of feature
      + Updation / Improvement
    + Describe your change

### Scope of Contribution

+ Documentation
+ Features
+ Optimisation

## Contact Us

Email: support@4iresearch.com