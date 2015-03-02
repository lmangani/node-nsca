# node-nsca

A node module for sending nagios nsca checks

````JavaScript
var nsca = require("nsca");
var noti = new nsca.Notifier(HOST, PORT, PASSWORD, ENCRYPTION_MODE);
noti.send("localhost", "centos check", nsca.OK, "Looks Good!");
````

# Encryption modes

You can use the integer defined in your `nsca.cfg`,
or use one of these keywords:

```JavaScript
nsca.ENCRYPT_NONE
nsca.ENCRYPT_XOR
nsca.ENCRYPT_DES
nsca.ENCRYPT_3DES
nsca.ENCRYPT_CAST128
nsca.ENCRYPT_CAST256
nsca.ENCRYPT_XTEA
nsca.ENCRYPT_3WAY     // NOT AVAILABLE
nsca.ENCRYPT_BLOWFISH
nsca.ENCRYPT_TWOFISH
nsca.ENCRYPT_LOKI97
nsca.ENCRYPT_RC2
nsca.ENCRYPT_ARCFOUR
nsca.ENCRYPT_RC6
nsca.ENCRYPT_RIJNDAEL128
nsca.ENCRYPT_RIJNDAEL192
nsca.ENCRYPT_RIJNDAEL256
nsca.ENCRYPT_MARS     // NOT AVAILABLE
nsca.ENCRYPT_PANAMA
nsca.ENCRYPT_WAKE
nsca.ENCRYPT_SERPENT
nsca.ENCRYPT_IDEA
nsca.ENCRYPT_ENIGMA
nsca.ENCRYPT_GOST
nsca.ENCRYPT_SAFER64  // NOT AVAILABLE
nsca.ENCRYPT_SAFER128 // NOT AVAILABLE
nsca.ENCRYPT_SAFERPLUS
```

# NSCA status

```JavaScript
nsca.OK
nsca.WARN
nsca.FAIL
nsca.UNKNOWN
```