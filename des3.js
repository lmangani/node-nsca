var forge = require("node-forge");

function DES3Encoder() {
  this.key = "";
  this.iv = "";
}

DES3Encoder.prototype.validateKeySize = function() {

};

DES3Encoder.prototype.open = function(key, iv) {
  this.key = key;
  this.iv = iv;
};


DES3Encoder.prototype.encrypt = function(buffer) {
  // 3DES key and IV sizes
  var keySize = 24;
  var ivSize = 8;

  String.prototype.repeat = function(n) {
    var str = '';
    for (var i = 0; i < n; i++) {
      str += this;
    }
    return str;
  };

  // trim IV if longer than ivSize
  this.iv = this.iv.substr(0, ivSize);
  // add random bytes if IV is shorter than ivSize
  this.iv += forge.random.getBytesSync(ivSize - this.iv.length);

  // trim key if longer than keySize
  this.key = this.key.substr(0, keySize);
  // add right padding if key is shorter than keySize
  this.key += "\0".repeat(keySize - this.key.length);

  // create cipher with key
  var cipher = forge.cipher.createCipher("3DES-CFB", this.key);
  cipher.start({iv: this.iv});
  // encrypt the buffer
  // we need to pass a ByteStringBuffer - which can't be created from Buffer ._.
  cipher.update(forge.util.createBuffer(buffer.toString(), 'binary'));
  cipher.finish();

  // we're done :)
  return cipher.output.data;
};


module.exports = DES3Encoder;