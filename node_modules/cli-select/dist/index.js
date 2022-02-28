"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _input = _interopRequireDefault(require("./input"));

var _renderer = _interopRequireDefault(require("./renderer"));

var _callbackMappers = require("./callback-mappers");

var _valueMappers = require("./value-mappers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Default options
 */
const defaultOptions = {
  outputStream: process.stdout,
  inputStream: process.stdin,
  values: [],
  defaultValue: 0,
  selected: '(x)',
  unselected: '( )',
  indentation: 0,
  cleanup: true,
  valueRenderer: value => value
};
/**
 * Create an instance of cli-select with the given options
 *
 * @param {object} options - options for cli-select
 * @param {function} callback - if specified, a callback will be used, otherwise a promise gets returned (optional)
 */

const creator = (options, callback) => {
  // merge options with default options
  options = _objectSpread({}, defaultOptions, options); // create renderer and input instances

  const renderer = new _renderer.default(options, options.outputStream);
  const input = new _input.default(options.inputStream);
  input.setDefaultValue(options.defaultValue);
  input.attachRenderer(renderer); // handle array and object values

  let valueMapper;

  if (Array.isArray(options.values)) {
    valueMapper = (0, _valueMappers.withArrayValues)(options);
  } else {
    valueMapper = (0, _valueMappers.withObjectValues)(options);
  } // map values


  options.values = valueMapper.input;
  input.setValues(options.values); // handle different callback methods

  if (typeof callback === 'function') {
    return (0, _callbackMappers.withCallback)(input, valueMapper.output, callback);
  } else {
    return (0, _callbackMappers.withPromise)(input, valueMapper.output);
  }
};

exports = module.exports = creator;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _default = creator;
exports.default = _default;