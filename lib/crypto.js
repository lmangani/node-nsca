var MCrypt = require("mcrypt").MCrypt;
var XorEncoder = require("./xor");

var ciphers = [
  "des",
  "tripledes",
  "cast-128",
  "cast-256",
  "xtea",
  /*3-WAY*/ undefined,
  "blowfish",
  "twofish",
  "loki97",
  "rc2",
  "arcfour",
  "rijndael-128",
  "rijndael-192",
  "rijndael-256",
  /*MARS*/ undefined,
  /*PANAMA*/ undefined,
  "wake",
  "serpent",
  /*IDEA*/ undefined,
  "enigma",
  "gost",
  /*SAFER-sk64*/ undefined,
  /*SAFER-sk128*/ undefined,
  "saferplus",
];

function Crypter(enc, key, iv) {
  this.key = key;
  this.iv = iv;
  if (enc === 1) {
    this.encryption = new XorEncoder();
  } else {
    var cipher = ciphers[enc - 2];
    if (cipher) {
      this.encryption = new MCrypt(cipher, "cfb");
    } else {
      throw new Error("unsupported encryption mode: " + enc + "!");
    }
  }
}

Crypter.prototype.encode = function(msg) {
  this.encryption.validateKeySize(false);
  this.encryption.open(this.key, this.iv);
  return this.encryption.encrypt(msg);
};


module.exports = Crypter;