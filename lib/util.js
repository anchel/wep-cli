
module.exports = {

  getCfgVal: function (cfg = {}, tplStr) {
    if (!tplStr) {
      return tplStr;
    }
    let fn = new Function('cfg', 'return `' + tplStr + '`;');
    return fn(cfg);
  },

}
