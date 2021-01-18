if (!Array.prototype.flatMap) {
    Object.defineProperty(Array.prototype, 'flatMap', {
        value: function (callback, thisArg) {
            let self = thisArg || this;
            if (self === null) {
                throw new TypeError('Array.prototype.flatMap called on null or undefined');
            }
            if (typeof callback !== 'function') {
                throw new TypeError(callback + ' is not a function');
            }

            let list = [];

            // 1. Let O be ? ToObject(this value).
            let o = Object(self);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            let len = o.length >>> 0;

            for (let k = 0; k < len; ++k) {
                if (k in o) {
                    let part_list = callback.call(self, o[k], k, o);
                    list = list.concat(part_list);
                }
            }

            return list;
        }
    });
}