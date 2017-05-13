var helpers = require('./my-session-file-helpers');
var fs = require('fs-extra');


module.exports = function (session) {
  var Store = session.Store;

  /**
   * [MyFileStore 初始化MyFileStore ]
   * @param {[type]} filename [目录名 可选]
   * @param {[type]} options  [没有传递则获取默认值 可选]
   */
  function MyFileStore(filename,options) {
    var self = this;

    options = options || {};
    Store.call(self, options);

    //如果传递了filename 则把默认的存储地址改为传递的
    if(filename){
      options.path = filename;
    }
    self.options = helpers.defaults(options);
    //创建目录
    fs.mkdirsSync(self.options.path);

    helpers.scheduleReap(self.options);
    options.reapIntervalObject = self.options.reapIntervalObject;
  }

  /**
   * 继承 Store
   */
  MyFileStore.prototype.__proto__ = Store.prototype;


  /**
   * [get 通过sessionId读取文件获得session]
   * @param  {[type]}   sessionId [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  MyFileStore.prototype.get = function (sessionId, callback) {
    helpers.get(sessionId, this.options, callback);
  };

  /**
   * Attempts to commit the given session associated with the given `sessionId` to a session file
   *
   * @param {String}   sessionId
   * @param {Object}   session
   * @param {Function} callback (optional)
   *
   * @api public
   */
  MyFileStore.prototype.set = function (sessionId, session, callback) {
    helpers.set(sessionId, session, this.options, callback);
  };

  /**
   * Attempts to unlink a given session by its id
   *
   * @param  {String}   sessionId   Files are serialized to disk by their
   *                                sessionId
   * @param  {Function} callback
   *
   * @api public
   */
  MyFileStore.prototype.destroy = function (sessionId, callback) {
    helpers.destroy(sessionId, this.options, callback);
  };

  /**
   * Attempts to fetch number of the session files
   *
   * @param  {Function} callback
   *
   * @api public
   */
  MyFileStore.prototype.length = function (callback) {
    helpers.length(this.options, callback);
  };

  /**
   * Attempts to clear out all of the existing session files
   *
   * @param  {Function} callback
   *
   * @api public
   */
  MyFileStore.prototype.clear = function (callback) {
    helpers.clear(this.options, callback);
  };

  /**
   * Attempts to find all of the session files
   *
   * @param  {Function} callback
   *
   * @api public
   */
  MyFileStore.prototype.list = function (callback) {
    helpers.list(this.options, callback);
  };

  /**
   * Attempts to detect whether a session file is already expired or not
   *
   * @param  {String}   sessionId
   * @param  {Function} callback
   *
   * @api public
   */
  MyFileStore.prototype.expired = function (sessionId, callback) {
    helpers.expired(sessionId, this.options, callback);
  };

  return MyFileStore;
};
