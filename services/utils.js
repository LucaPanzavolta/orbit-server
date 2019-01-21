'use strict';

const _ = require('lodash');

module.exports.filterProps = function (collection, properties) {
  return _.reduce(collection, (result, value, key) => {
    if (_.includes(properties, key)) result[key] = value;
    return result;
  }, {});
};

class HttpError {
  constructor(message, status) {
    this.message = message;
    this.status = status;
    this.name = "HttpError";
  }
};

module.exports.HttpError = HttpError;