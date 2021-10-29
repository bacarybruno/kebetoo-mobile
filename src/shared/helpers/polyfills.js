/* eslint-disable object-shorthand */
/* eslint-disable no-extend-native */
if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    value: function flatMap(callback, thisArg) {
      const self = thisArg || this;
      if (self === null) {
        throw new TypeError('Array.prototype.flatMap called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(`${callback} is not a function`);
      }

      let list = [];

      const o = Object(self);

      // eslint-disable-next-line no-bitwise
      const len = o.length >>> 0;

      // eslint-disable-next-line no-plusplus
      for (let k = 0; k < len; ++k) {
        if (k in o) {
          const partList = callback.call(self, o[k], k, o);
          list = list.concat(partList);
        }
      }

      return list;
    },
  });
}
