#!/usr/bin/bash

if which "akira-mon" > /dev/null; then
    __akira_completions()  {
        local OPTS=("--help --add-dir --rm-dirs --ls-dirs --ls-backups --rm-backups --restore")
        COMPREPLY=()
        for _opt_ in ${OPTS[@]}; do
            if [[ "$_opt_" == "$2"* ]]; then
                COMPREPLY+=("$_opt_")
            fi
        done
    }
    
    complete -F __akira_completions akira-mon
fi
