# node-nsca

A node module for sending nagios nsca checks

Currently supports clear text and XOR.
3DES mode is broken.
Other encryption modes are currently disable due to tugrul/node-mcrypt#16

````JavaScript
var nsca = require("nsca");
var noti = new nsca.Notifier(HOST, PORT, PASSWORD, ENCRYPTION_MODE);
noti.send("localhost", "centos check", nsca.OK, "Looks Good!");
````