var net = require("net");
var crc32 = require("buffer-crc32");
// var Crypter = require("./lib/crypto");


function Notifier(host, port, secret, encryption) {
  this.host = host;
  this.port = port;
  this.secret = secret;
  this.encryption = encryption;
}


Notifier.prototype.send = function(hostName, serviceDesc, statusCode, pluginOutput, callback) {
  var PACKET_VERSION = 3;
  var MSG_LENGTH = 720;


  var client = new net.Socket();

  client.connect(this.port, this.host, function() {
    // console.log("Connected to: " + this.host + ":" + this.port);
  }.bind(this));

  client.on("data", function(data) {
    // console.log("data received: " + data);
    var encoding = "binary";
    var inBuffer = new Buffer(data);
    // var iv = inBuffer.toString(encoding, 0, 128);
    // console.log("received IV: " + iv);
    var timestamp = inBuffer.readInt32BE(128);
    // console.log("received timestamp: " + timestamp);

    var outBuffer = new Buffer(MSG_LENGTH);
    // empty Buffer
    outBuffer.fill(0);
    // NSCA version
    outBuffer.writeInt16BE(PACKET_VERSION, 0);
    // padding
    outBuffer.fill("h", 2, 3);
    // CRC32 null
    outBuffer.writeUInt32BE(0, 4);
    // timestamp
    outBuffer.writeUInt32BE(timestamp, 8);
    // status code
    outBuffer.writeInt16BE(statusCode, 12);
    // host name
    outBuffer.write(hostName, 14, 77, encoding);
    // service
    outBuffer.write(serviceDesc, 78, 206, encoding);
    // our message
    outBuffer.write(pluginOutput, 206, 720, encoding);
    // CEC32
    outBuffer.writeUInt32BE(crc32.unsigned(outBuffer), 4);

    // if (this.encryption) {
    //   var encrypter = new Crypter(this.encryption, this.secret, iv);
    //   outBuffer = encrypter.encode(outBuffer);
    // }


    client.write(outBuffer, function(a) {
      client.destroy();
      // console.log("data sent: " + outBuffer);
    });
  }.bind(this));

  client.on("close", function() {
    // no errors, lets go!
    callback(null);
  }.bind(this));

  client.on("error", function(e) {
    var err = new Error("NSCA server connection failed!");
    callback(err);
  }.bind(this));
};


module.exports = {
  Notifier: Notifier,

  // NSCA status
  OK: 0,
  WARN: 1,
  FAIL: 2,
  UNKNOWN: 3,

  // encryption types
  ENCRYPT_NONE       : 0,  // no encryption
  // ENCRYPT_XOR        : 1,  // not really encrypted, just obfuscated
  // ENCRYPT_DES        : 2,  // DES
  // ENCRYPT_3DES       : 3,  // 3DES or Triple DES
  // ENCRYPT_CAST128    : 4,  // CAST-128
  // ENCRYPT_CAST256    : 5,  // CAST-256
  // ENCRYPT_XTEA       : 6,  // xTEA
  // ENCRYPT_3WAY       : 7,  // 3-WAY
  // ENCRYPT_BLOWFISH   : 8,  // SKIPJACK
  // ENCRYPT_TWOFISH    : 9,  // TWOFISH
  // ENCRYPT_LOKI97     : 10, // LOKI97
  // ENCRYPT_RC2        : 11, // RC2
  // ENCRYPT_ARCFOUR    : 12, // RC4
  // ENCRYPT_RC6        : 13, // RC6            (UNUSED)
  // ENCRYPT_RIJNDAEL128: 14, // RIJNDAEL-128
  // ENCRYPT_RIJNDAEL192: 15, // RIJNDAEL-192
  // ENCRYPT_RIJNDAEL256: 16, // RIJNDAEL-256
  // ENCRYPT_MARS       : 17, // MARS           (UNUSED)
  // ENCRYPT_PANAMA     : 18, // PANAMA         (UNUSED)
  // ENCRYPT_WAKE       : 19, // WAKE
  // ENCRYPT_SERPENT    : 20, // SERPENT
  // ENCRYPT_IDEA       : 21, // IDEA           (UNUSED)
  // ENCRYPT_ENIGMA     : 22, // ENIGMA (Unix crypt)
  // ENCRYPT_GOST       : 23, // GOST
  // ENCRYPT_SAFER64    : 24, // SAFER-sk64
  // ENCRYPT_SAFER128   : 25, // SAFER-sk128
  // ENCRYPT_SAFERPLUS  : 26, // SAFER+
};