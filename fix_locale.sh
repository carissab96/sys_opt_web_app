#!/bin/bash

# Clear existing locale settings
unset LC_ALL
unset LANG
unset LANGUAGE

# Set all locale variables to en_US.utf8
for var in LANG LANGUAGE LC_CTYPE LC_NUMERIC LC_TIME LC_COLLATE \
           LC_MONETARY LC_MESSAGES LC_PAPER LC_NAME LC_ADDRESS \
           LC_TELEPHONE LC_MEASUREMENT LC_IDENTIFICATION
do
    export $var=en_US.utf8
done

echo "Locale settings updated. Current settings:"
locale