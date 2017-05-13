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
    fs.mkdirsSync(self.options.path,'755');
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
   * [set 写入文件]
   * @param {[type]}   sessionId [description]
   * @param {[type]}   session   [description]
   * @param {Function} callback  [description]
   */
  MyFileStore.prototype.set = function (sessionId, session, callback) {
    helpers.set(sessionId, session, this.options, callback);
  };

  /**
   * [destroy 根据sessionId删除]
   * @param  {[type]}   sessionId [description]
   * @param  {Function} callback  [description]
   * @return {[type]}             [description]
   */
  MyFileStore.prototype.destroy = function (sessionId, callback) {
    helpers.destroy(sessionId, this.options, callback);
  };

  /**
   * [length 获取文件个数]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  MyFileStore.prototype.length = function (callback) {
    helpers.length(this.options, callback);
  };

  /**
   * [clear 清除所有session]
   * @param  {Function} callback [description]
   * @return {[type]}            [description]
   */
  MyFileStore.prototype.clear = function (callback) {
    helpers.clear(this.options, callback);
  };



  return MyFileStore;
};
