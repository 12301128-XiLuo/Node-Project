var fs = require('fs-extra');
var writeFileAtomic = require('write-file-atomic');
var path = require('path');
var crypto = require('crypto');

var helpers = {
  //需不需要加密
  isSecret: function (secret) {
    return secret !== undefined && secret != null;
  },
  //存储路径 path+sessionID
  sessionPath: function (options, sessionId) {    
    return path.join(options.path, sessionId + options.fileExtension);
  },
  //获取sessionId
  sessionId: function (options, file) {
    if ( options.fileExtension.length === 0 ) return file;
    var id = file.replace(options.filePattern, '');
    return id === file ? '' : id;
  },
  //获取上一次访问时间
  getLastAccess: function (session) {
    return session.__lastAccess;
  },
  //设置本次访问的时间
  setLastAccess: function (session) {
    session.__lastAccess = new Date().getTime();
  },
  escapeForRegExp: function (str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  },
  //对文件格式进行处理 默认为.json文件
  getFilePatternFromFileExtension: function (fileExtension) {
    return new RegExp( helpers.escapeForRegExp(fileExtension) + '$' );
  },
  /**
   * [defaults options默认值设定]
   * @param  {[object]} options [MyFileStore传递的第二个参数]
   * @return {[type]}         []
   */
  defaults: function (options) {
    options = options || {};
    var KEY_FN = function (secret, sessionId) {
      return secret + sessionId;
    };
    return {
      path: path.normalize(options.path || './sessions'),//目录
      fileExtension: options.fileExtension || '.json',//文件后缀
      filePattern: options.fileExtension
        ? helpers.getFilePatternFromFileExtension(options.fileExtension)
        : /\.json$/,
      encoding: options.encoding !== undefined
        ? options.encoding
        : 'utf8',//字符集
      encoder: options.encoder || JSON.stringify,
      decoder: options.decoder || JSON.parse,
      secret: options.secret,
      encryptEncoding: options.encryptEncoding !== undefined
        ? options.encryptEncoding
        : 'hex',
      keyFunction: options.keyFunction || KEY_FN
    };
  },

  /**
   * [get 根据sessionId读取session]
   * @param  {[type]}   sessionId [description]
   * @param  {[type]}   options   [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  get: function (sessionId, options, callback) {
    var sessionPath = helpers.sessionPath(options, sessionId);
    console.log(sessionPath);
        //首先判断是否加密
    fs.readFile(sessionPath, helpers.isSecret(options.secret) && !options.encryptEncoding ? null : options.encoding, function readCallback(err, data) {
        if (!err) {
          var json;
          try {
            //是否加密
            json = options.decoder(helpers.isSecret(options.secret) ? helpers.decrypt(options, data, sessionId) : data);
            callback(null, json);
          } catch (e) {
            callback(e);
          }
        }
        else{
          callback();
        }
      });

   
  },


  /**
   * [set 写入文件]
   * @param {[type]}   sessionId [description]
   * @param {[type]}   session   [description]
   * @param {[type]}   options   [description]
   * @param {Function} callback  [description]
   */
  set: function (sessionId, session, options, callback) {
    helpers.setLastAccess(session);

      var sessionPath = helpers.sessionPath(options, sessionId);
      var json = options.encoder(session);
      if (helpers.isSecret(options.secret)) {
        json = helpers.encrypt(options, json, sessionId)
      }
      fs.writeFile(sessionPath, json, function (err) {
        callback && callback(err);
      });
  },


  /**
   * [destroy 根据sessionId删除]
   * @param  {[type]}   sessionId [description]
   * @param  {[type]}   options   [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  destroy: function (sessionId, options, callback) {
    var sessionPath = helpers.sessionPath(options, sessionId);
    fs.remove(sessionPath, callback);
  },

  
  /**
   * [length 获取文件个数]
   * @param  {[type]}   options  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  length: function (options, callback) {
    fs.readdir(this.filedir, function(err, files) {
        callback(null, files ? files.length : 0);
    });
  },

  /**
   * [clear 清除所有session]
   * @param  {[type]}   options  [description]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  clear: function (options, callback) {
    fs.readdir(options.path, function (err, files) {
      if (err) return callback([err]);
      if (files.length <= 0) return callback();

      var errors = [];
      files.forEach(function (file, i) {
        fs.remove(path.join(options.path, file), function (err) {
            if (err) {
              errors.push(err);
            }
            // TODO: wrong call condition (call after all completed attempts to remove instead of after completed attempt with last index)
            if (i >= files.length - 1) {
              errors.length > 0 ? callback(errors) : callback();
            }
          });
        
      });
    });
  },

  //加密算法
  encAlgorithm: 'aes-256-ctr',
  /**
   * [encrypt 加密]
   * @param  {[type]} options   [description]
   * @param  {[type]} data      [description]
   * @param  {[type]} sessionId [description]
   * @return {[type]}           [description]
   */
  encrypt: function (options, data, sessionId) {
    var cipher = crypto.createCipher(helpers.encAlgorithm, options.keyFunction(options.secret, sessionId));
    var crypted = cipher.update(data, options.encoding, options.encryptEncoding );
    var cryptedFinal = cipher.final(options.encryptEncoding);
    if ( typeof cryptedFinal === 'string' ) {
      crypted += cryptedFinal;
    } else {
      crypted = Buffer.concat([crypted, cryptedFinal], crypted.length + cryptedFinal.length);
    }
    return crypted;
  },

  /**
   * [decrypt 解密]
   * @param  {[type]} options   [description]
   * @param  {[type]} data      [description]
   * @param  {[type]} sessionId [description]
   * @return {[type]}           [description]
   */
  decrypt: function (options, data, sessionId) {
    var decipher = crypto.createDecipher(helpers.encAlgorithm, options.keyFunction(options.secret, sessionId));
    var dec = decipher.update(data, options.encryptEncoding, options.encoding);
    var decFinal = decipher.final(options.encoding);
    if ( typeof decFinal === 'string' ) {
      dec += decFinal;
    } else {
      dec = Buffer.concat([dec, decFinal], dec.length + decFinal.length);
    }
    return dec;
  }

};

module.exports = helpers;
