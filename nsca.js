var net = require("net");
var crc32 = require("buffer-crc32");
var Crypter = require("./lib/crypto");


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
    //console.log("Connected to: " + this.host + ":" + this.port);
  }.bind(this));

  client.on("data", function(data) {
    //console.log("data received: " + data);
    var encoding = "binary";
    var inBuffer = new Buffer(data);
    var iv = inBuffer.toString(encoding, 0, 128);
    //console.log("received IV: " + iv);
    var timestamp = inBuffer.readInt32BE(128);
    //console.log("received timestamp: " + timestamp);

    var outBuffer = new Buffer(MSG_LENGTH);
    // empty Buffer
    outBuffer.fill(0);
    // NSCA version
    outBuffer.writeInt16BE(PACKET_VERSION, 0);
    // padding
    outBuffer.fill("h", 2, 3);
    // CRC32 null
    outBuffer.writeUInt32BE(0, 4);
    //timestamp
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

    if (this.encryption) {
      var encrypter = new Crypter(this.encryption, this.secret, iv);
      outBuffer = encrypter.encode(outBuffer);
    }


    client.write(outBuffer, function(a) {
      client.destroy();
      //console.log("data sent: " + outBuffer);
    });


  }.bind(this));

  client.on("close", function() {
    //no errors, lets go!
    callback(null);
  }.bind(this));

  client.on("error", function(e) {
    var err = new Error("NSCA server connection failed!");
    callback(err);
  }.bind(this));

};


module.exports = {
  Notifier: Notifier,
  OK: 0,
  WARN: 1,
  FAIL: 2,
  UNKNOWN: 3
};