# node-nsca

A node module for sending nagios nsca checks

Currently supports clear text, XOR, 3DES modes only.
Encryption coming soon!

````JavaScript
var nsca = require("nsca");
var noti = new nsca.Notifier(HOST, PORT, PASSWORD, ENCRYPTION_MODE);
noti.send("localhost", "centos check", nsca.OK, "Looks Good!");
````