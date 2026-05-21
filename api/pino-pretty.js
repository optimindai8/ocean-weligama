import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
  
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/.pnpm/colorette@2.0.20/node_modules/colorette/index.cjs
var require_colorette = __commonJS({
  "node_modules/.pnpm/colorette@2.0.20/node_modules/colorette/index.cjs"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tty = require("tty");
    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      var n = /* @__PURE__ */ Object.create(null);
      if (e) {
        Object.keys(e).forEach(function(k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: function() {
                return e[k];
              }
            });
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
    var tty__namespace = /* @__PURE__ */ _interopNamespace(tty);
    var {
      env = {},
      argv = [],
      platform = ""
    } = typeof process === "undefined" ? {} : process;
    var isDisabled = "NO_COLOR" in env || argv.includes("--no-color");
    var isForced = "FORCE_COLOR" in env || argv.includes("--color");
    var isWindows = platform === "win32";
    var isDumbTerminal = env.TERM === "dumb";
    var isCompatibleTerminal = tty__namespace && tty__namespace.isatty && tty__namespace.isatty(1) && env.TERM && !isDumbTerminal;
    var isCI = "CI" in env && ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env);
    var isColorSupported2 = !isDisabled && (isForced || isWindows && !isDumbTerminal || isCompatibleTerminal || isCI);
    var replaceClose = (index, string, close, replace, head = string.substring(0, index) + replace, tail = string.substring(index + close.length), next = tail.indexOf(close)) => head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
    var clearBleed = (index, string, open, close, replace) => index < 0 ? open + string + close : open + replaceClose(index, string, close, replace) + close;
    var filterEmpty = (open, close, replace = open, at = open.length + 1) => (string) => string || !(string === "" || string === void 0) ? clearBleed(
      ("" + string).indexOf(close, at),
      string,
      open,
      close,
      replace
    ) : "";
    var init = (open, close, replace) => filterEmpty(`\x1B[${open}m`, `\x1B[${close}m`, replace);
    var colors2 = {
      reset: init(0, 0),
      bold: init(1, 22, "\x1B[22m\x1B[1m"),
      dim: init(2, 22, "\x1B[22m\x1B[2m"),
      italic: init(3, 23),
      underline: init(4, 24),
      inverse: init(7, 27),
      hidden: init(8, 28),
      strikethrough: init(9, 29),
      black: init(30, 39),
      red: init(31, 39),
      green: init(32, 39),
      yellow: init(33, 39),
      blue: init(34, 39),
      magenta: init(35, 39),
      cyan: init(36, 39),
      white: init(37, 39),
      gray: init(90, 39),
      bgBlack: init(40, 49),
      bgRed: init(41, 49),
      bgGreen: init(42, 49),
      bgYellow: init(43, 49),
      bgBlue: init(44, 49),
      bgMagenta: init(45, 49),
      bgCyan: init(46, 49),
      bgWhite: init(47, 49),
      blackBright: init(90, 39),
      redBright: init(91, 39),
      greenBright: init(92, 39),
      yellowBright: init(93, 39),
      blueBright: init(94, 39),
      magentaBright: init(95, 39),
      cyanBright: init(96, 39),
      whiteBright: init(97, 39),
      bgBlackBright: init(100, 49),
      bgRedBright: init(101, 49),
      bgGreenBright: init(102, 49),
      bgYellowBright: init(103, 49),
      bgBlueBright: init(104, 49),
      bgMagentaBright: init(105, 49),
      bgCyanBright: init(106, 49),
      bgWhiteBright: init(107, 49)
    };
    var createColors = ({ useColor = isColorSupported2 } = {}) => useColor ? colors2 : Object.keys(colors2).reduce(
      (colors3, key) => ({ ...colors3, [key]: String }),
      {}
    );
    var {
      reset,
      bold,
      dim,
      italic,
      underline,
      inverse,
      hidden,
      strikethrough,
      black,
      red,
      green,
      yellow,
      blue,
      magenta,
      cyan,
      white,
      gray,
      bgBlack,
      bgRed,
      bgGreen,
      bgYellow,
      bgBlue,
      bgMagenta,
      bgCyan,
      bgWhite,
      blackBright,
      redBright,
      greenBright,
      yellowBright,
      blueBright,
      magentaBright,
      cyanBright,
      whiteBright,
      bgBlackBright,
      bgRedBright,
      bgGreenBright,
      bgYellowBright,
      bgBlueBright,
      bgMagentaBright,
      bgCyanBright,
      bgWhiteBright
    } = createColors();
    exports2.bgBlack = bgBlack;
    exports2.bgBlackBright = bgBlackBright;
    exports2.bgBlue = bgBlue;
    exports2.bgBlueBright = bgBlueBright;
    exports2.bgCyan = bgCyan;
    exports2.bgCyanBright = bgCyanBright;
    exports2.bgGreen = bgGreen;
    exports2.bgGreenBright = bgGreenBright;
    exports2.bgMagenta = bgMagenta;
    exports2.bgMagentaBright = bgMagentaBright;
    exports2.bgRed = bgRed;
    exports2.bgRedBright = bgRedBright;
    exports2.bgWhite = bgWhite;
    exports2.bgWhiteBright = bgWhiteBright;
    exports2.bgYellow = bgYellow;
    exports2.bgYellowBright = bgYellowBright;
    exports2.black = black;
    exports2.blackBright = blackBright;
    exports2.blue = blue;
    exports2.blueBright = blueBright;
    exports2.bold = bold;
    exports2.createColors = createColors;
    exports2.cyan = cyan;
    exports2.cyanBright = cyanBright;
    exports2.dim = dim;
    exports2.gray = gray;
    exports2.green = green;
    exports2.greenBright = greenBright;
    exports2.hidden = hidden;
    exports2.inverse = inverse;
    exports2.isColorSupported = isColorSupported2;
    exports2.italic = italic;
    exports2.magenta = magenta;
    exports2.magentaBright = magentaBright;
    exports2.red = red;
    exports2.redBright = redBright;
    exports2.reset = reset;
    exports2.strikethrough = strikethrough;
    exports2.underline = underline;
    exports2.white = white;
    exports2.whiteBright = whiteBright;
    exports2.yellow = yellow;
    exports2.yellowBright = yellowBright;
  }
});

// node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS({
  "node_modules/.pnpm/wrappy@1.0.2/node_modules/wrappy/wrappy.js"(exports2, module2) {
    module2.exports = wrappy;
    function wrappy(fn, cb) {
      if (fn && cb) return wrappy(fn)(cb);
      if (typeof fn !== "function")
        throw new TypeError("need wrapper function");
      Object.keys(fn).forEach(function(k) {
        wrapper[k] = fn[k];
      });
      return wrapper;
      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb2 = args[args.length - 1];
        if (typeof ret === "function" && ret !== cb2) {
          Object.keys(cb2).forEach(function(k) {
            ret[k] = cb2[k];
          });
        }
        return ret;
      }
    }
  }
});

// node_modules/.pnpm/once@1.4.0/node_modules/once/once.js
var require_once = __commonJS({
  "node_modules/.pnpm/once@1.4.0/node_modules/once/once.js"(exports2, module2) {
    var wrappy = require_wrappy();
    module2.exports = wrappy(once);
    module2.exports.strict = wrappy(onceStrict);
    once.proto = once(function() {
      Object.defineProperty(Function.prototype, "once", {
        value: function() {
          return once(this);
        },
        configurable: true
      });
      Object.defineProperty(Function.prototype, "onceStrict", {
        value: function() {
          return onceStrict(this);
        },
        configurable: true
      });
    });
    function once(fn) {
      var f = function() {
        if (f.called) return f.value;
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      f.called = false;
      return f;
    }
    function onceStrict(fn) {
      var f = function() {
        if (f.called)
          throw new Error(f.onceError);
        f.called = true;
        return f.value = fn.apply(this, arguments);
      };
      var name = fn.name || "Function wrapped with `once`";
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f;
    }
  }
});

// node_modules/.pnpm/end-of-stream@1.4.5/node_modules/end-of-stream/index.js
var require_end_of_stream = __commonJS({
  "node_modules/.pnpm/end-of-stream@1.4.5/node_modules/end-of-stream/index.js"(exports2, module2) {
    var once = require_once();
    var noop = function() {
    };
    var qnt = global.Bare ? queueMicrotask : process.nextTick.bind(process);
    var isRequest = function(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    };
    var isChildProcess = function(stream) {
      return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3;
    };
    var eos = function(stream, opts, callback) {
      if (typeof opts === "function") return eos(stream, null, opts);
      if (!opts) opts = {};
      callback = once(callback || noop);
      var ws = stream._writableState;
      var rs = stream._readableState;
      var readable = opts.readable || opts.readable !== false && stream.readable;
      var writable = opts.writable || opts.writable !== false && stream.writable;
      var cancelled = false;
      var onlegacyfinish = function() {
        if (!stream.writable) onfinish();
      };
      var onfinish = function() {
        writable = false;
        if (!readable) callback.call(stream);
      };
      var onend = function() {
        readable = false;
        if (!writable) callback.call(stream);
      };
      var onexit = function(exitCode) {
        callback.call(stream, exitCode ? new Error("exited with error code: " + exitCode) : null);
      };
      var onerror = function(err) {
        callback.call(stream, err);
      };
      var onclose = function() {
        qnt(onclosenexttick);
      };
      var onclosenexttick = function() {
        if (cancelled) return;
        if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error("premature close"));
        if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error("premature close"));
      };
      var onrequest = function() {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        stream.on("abort", onclose);
        if (stream.req) onrequest();
        else stream.on("request", onrequest);
      } else if (writable && !ws) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      if (isChildProcess(stream)) stream.on("exit", onexit);
      stream.on("end", onend);
      stream.on("finish", onfinish);
      if (opts.error !== false) stream.on("error", onerror);
      stream.on("close", onclose);
      return function() {
        cancelled = true;
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req) stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("exit", onexit);
        stream.removeListener("end", onend);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
    };
    module2.exports = eos;
  }
});

// node_modules/.pnpm/pump@3.0.4/node_modules/pump/index.js
var require_pump = __commonJS({
  "node_modules/.pnpm/pump@3.0.4/node_modules/pump/index.js"(exports2, module2) {
    var once = require_once();
    var eos = require_end_of_stream();
    var fs;
    try {
      fs = require("fs");
    } catch (e) {
    }
    var noop = function() {
    };
    var ancient = typeof process === "undefined" ? false : /^v?\.0/.test(process.version);
    var isFn = function(fn) {
      return typeof fn === "function";
    };
    var isFS = function(stream) {
      if (!ancient) return false;
      if (!fs) return false;
      return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close);
    };
    var isRequest = function(stream) {
      return stream.setHeader && isFn(stream.abort);
    };
    var destroyer = function(stream, reading, writing, callback) {
      callback = once(callback);
      var closed = false;
      stream.on("close", function() {
        closed = true;
      });
      eos(stream, { readable: reading, writable: writing }, function(err) {
        if (err) return callback(err);
        closed = true;
        callback();
      });
      var destroyed = false;
      return function(err) {
        if (closed) return;
        if (destroyed) return;
        destroyed = true;
        if (isFS(stream)) return stream.close(noop);
        if (isRequest(stream)) return stream.abort();
        if (isFn(stream.destroy)) return stream.destroy();
        callback(err || new Error("stream was destroyed"));
      };
    };
    var call = function(fn) {
      fn();
    };
    var pipe = function(from, to) {
      return from.pipe(to);
    };
    var pump2 = function() {
      var streams = Array.prototype.slice.call(arguments);
      var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop;
      if (Array.isArray(streams[0])) streams = streams[0];
      if (streams.length < 2) throw new Error("pump requires two streams per minimum");
      var error;
      var destroys = streams.map(function(stream, i) {
        var reading = i < streams.length - 1;
        var writing = i > 0;
        return destroyer(stream, reading, writing, function(err) {
          if (!error) error = err;
          if (err) destroys.forEach(call);
          if (reading) return;
          destroys.forEach(call);
          callback(error);
        });
      });
      return streams.reduce(pipe);
    };
    module2.exports = pump2;
  }
});

// node_modules/.pnpm/split2@4.2.0/node_modules/split2/index.js
var require_split2 = __commonJS({
  "node_modules/.pnpm/split2@4.2.0/node_modules/split2/index.js"(exports2, module2) {
    "use strict";
    var { Transform: Transform2 } = require("stream");
    var { StringDecoder } = require("string_decoder");
    var kLast = /* @__PURE__ */ Symbol("last");
    var kDecoder = /* @__PURE__ */ Symbol("decoder");
    function transform(chunk, enc, cb) {
      let list;
      if (this.overflow) {
        const buf = this[kDecoder].write(chunk);
        list = buf.split(this.matcher);
        if (list.length === 1) return cb();
        list.shift();
        this.overflow = false;
      } else {
        this[kLast] += this[kDecoder].write(chunk);
        list = this[kLast].split(this.matcher);
      }
      this[kLast] = list.pop();
      for (let i = 0; i < list.length; i++) {
        try {
          push(this, this.mapper(list[i]));
        } catch (error) {
          return cb(error);
        }
      }
      this.overflow = this[kLast].length > this.maxLength;
      if (this.overflow && !this.skipOverflow) {
        cb(new Error("maximum buffer reached"));
        return;
      }
      cb();
    }
    function flush(cb) {
      this[kLast] += this[kDecoder].end();
      if (this[kLast]) {
        try {
          push(this, this.mapper(this[kLast]));
        } catch (error) {
          return cb(error);
        }
      }
      cb();
    }
    function push(self, val) {
      if (val !== void 0) {
        self.push(val);
      }
    }
    function noop(incoming) {
      return incoming;
    }
    function split(matcher, mapper, options) {
      matcher = matcher || /\r?\n/;
      mapper = mapper || noop;
      options = options || {};
      switch (arguments.length) {
        case 1:
          if (typeof matcher === "function") {
            mapper = matcher;
            matcher = /\r?\n/;
          } else if (typeof matcher === "object" && !(matcher instanceof RegExp) && !matcher[Symbol.split]) {
            options = matcher;
            matcher = /\r?\n/;
          }
          break;
        case 2:
          if (typeof matcher === "function") {
            options = mapper;
            mapper = matcher;
            matcher = /\r?\n/;
          } else if (typeof mapper === "object") {
            options = mapper;
            mapper = noop;
          }
      }
      options = Object.assign({}, options);
      options.autoDestroy = true;
      options.transform = transform;
      options.flush = flush;
      options.readableObjectMode = true;
      const stream = new Transform2(options);
      stream[kLast] = "";
      stream[kDecoder] = new StringDecoder("utf8");
      stream.matcher = matcher;
      stream.mapper = mapper;
      stream.maxLength = options.maxLength;
      stream.skipOverflow = options.skipOverflow || false;
      stream.overflow = false;
      stream._destroy = function(err, cb) {
        this._writableState.errorEmitted = false;
        cb(err);
      };
      return stream;
    }
    module2.exports = split;
  }
});

// node_modules/.pnpm/pino-abstract-transport@3.0.0/node_modules/pino-abstract-transport/index.js
var require_pino_abstract_transport = __commonJS({
  "node_modules/.pnpm/pino-abstract-transport@3.0.0/node_modules/pino-abstract-transport/index.js"(exports2, module2) {
    "use strict";
    var metadata = /* @__PURE__ */ Symbol.for("pino.metadata");
    var split = require_split2();
    var { Duplex } = require("stream");
    var { parentPort, workerData } = require("worker_threads");
    function createDeferred() {
      let resolve;
      let reject;
      const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
      promise.resolve = resolve;
      promise.reject = reject;
      return promise;
    }
    module2.exports = function build2(fn, opts = {}) {
      const waitForConfig = opts.expectPinoConfig === true && workerData?.workerData?.pinoWillSendConfig === true;
      const parseLines = opts.parse === "lines";
      const parseLine = typeof opts.parseLine === "function" ? opts.parseLine : JSON.parse;
      const close = opts.close || defaultClose;
      const stream = split(function(line) {
        let value;
        try {
          value = parseLine(line);
        } catch (error) {
          this.emit("unknown", line, error);
          return;
        }
        if (value === null) {
          this.emit("unknown", line, "Null value ignored");
          return;
        }
        if (typeof value !== "object") {
          value = {
            data: value,
            time: Date.now()
          };
        }
        if (stream[metadata]) {
          stream.lastTime = value.time;
          stream.lastLevel = value.level;
          stream.lastObj = value;
        }
        if (parseLines) {
          return line;
        }
        return value;
      }, { autoDestroy: true });
      stream._destroy = function(err, cb) {
        const promise = close(err, cb);
        if (promise && typeof promise.then === "function") {
          promise.then(cb, cb);
        }
      };
      if (opts.expectPinoConfig === true && workerData?.workerData?.pinoWillSendConfig !== true) {
        setImmediate(() => {
          stream.emit("error", new Error("This transport is not compatible with the current version of pino. Please upgrade pino to the latest version."));
        });
      }
      if (opts.metadata !== false) {
        stream[metadata] = true;
        stream.lastTime = 0;
        stream.lastLevel = 0;
        stream.lastObj = null;
      }
      if (waitForConfig) {
        let pinoConfig = {};
        const configReceived = createDeferred();
        parentPort.on("message", function handleMessage(message) {
          if (message.code === "PINO_CONFIG") {
            pinoConfig = message.config;
            configReceived.resolve();
            parentPort.off("message", handleMessage);
          }
        });
        Object.defineProperties(stream, {
          levels: {
            get() {
              return pinoConfig.levels;
            }
          },
          messageKey: {
            get() {
              return pinoConfig.messageKey;
            }
          },
          errorKey: {
            get() {
              return pinoConfig.errorKey;
            }
          }
        });
        return configReceived.then(finish);
      }
      return finish();
      function finish() {
        let res = fn(stream);
        if (res && typeof res.catch === "function") {
          res.catch((err) => {
            stream.destroy(err);
          });
          res = null;
        } else if (opts.enablePipelining && res) {
          return Duplex.from({ writable: stream, readable: res });
        }
        return stream;
      }
    };
    function defaultClose(err, cb) {
      process.nextTick(cb, err);
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/constants.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      DATE_FORMAT: "yyyy-mm-dd HH:MM:ss.l o",
      DATE_FORMAT_SIMPLE: "HH:MM:ss.l",
      /**
       * @type {K_ERROR_LIKE_KEYS}
       */
      ERROR_LIKE_KEYS: ["err", "error"],
      MESSAGE_KEY: "msg",
      LEVEL_KEY: "level",
      LEVEL_LABEL: "levelLabel",
      TIMESTAMP_KEY: "time",
      LEVELS: {
        default: "USERLVL",
        60: "FATAL",
        50: "ERROR",
        40: "WARN",
        30: "INFO",
        20: "DEBUG",
        10: "TRACE"
      },
      LEVEL_NAMES: {
        fatal: 60,
        error: 50,
        warn: 40,
        info: 30,
        debug: 20,
        trace: 10
      },
      // Object keys that probably came from a logger like Pino or Bunyan.
      LOGGER_KEYS: [
        "pid",
        "hostname",
        "name",
        "level",
        "time",
        "timestamp",
        "caller"
      ]
    };
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/get-level-label-data.js
var require_get_level_label_data = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/get-level-label-data.js"(exports2, module2) {
    "use strict";
    module2.exports = getLevelLabelData;
    var { LEVELS, LEVEL_NAMES } = require_constants();
    function getLevelLabelData(useOnlyCustomProps, customLevels, customLevelNames) {
      const levels = useOnlyCustomProps ? customLevels || LEVELS : Object.assign({}, LEVELS, customLevels);
      const levelNames = useOnlyCustomProps ? customLevelNames || LEVEL_NAMES : Object.assign({}, LEVEL_NAMES, customLevelNames);
      return function(level) {
        let levelNum = "default";
        if (Number.isInteger(+level)) {
          levelNum = Object.prototype.hasOwnProperty.call(levels, level) ? level : levelNum;
        } else {
          levelNum = Object.prototype.hasOwnProperty.call(levelNames, level.toLowerCase()) ? levelNames[level.toLowerCase()] : levelNum;
        }
        return [levels[levelNum], levelNum];
      };
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/colors.js
var require_colors = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/colors.js"(exports2, module2) {
    "use strict";
    var nocolor = (input) => input;
    var plain = {
      default: nocolor,
      60: nocolor,
      50: nocolor,
      40: nocolor,
      30: nocolor,
      20: nocolor,
      10: nocolor,
      message: nocolor,
      greyMessage: nocolor,
      property: nocolor
    };
    var { createColors } = require_colorette();
    var getLevelLabelData = require_get_level_label_data();
    var availableColors = createColors({ useColor: true });
    var { white, bgRed, red, yellow, green, blue, gray, cyan, magenta } = availableColors;
    var colored = {
      default: white,
      60: bgRed,
      50: red,
      40: yellow,
      30: green,
      20: blue,
      10: gray,
      message: cyan,
      greyMessage: gray,
      property: magenta
    };
    function resolveCustomColoredColorizer(customColors) {
      return customColors.reduce(
        function(agg, [level, color]) {
          agg[level] = typeof availableColors[color] === "function" ? availableColors[color] : white;
          return agg;
        },
        { default: white, message: cyan, greyMessage: gray, property: magenta }
      );
    }
    function colorizeLevel(useOnlyCustomProps) {
      return function(level, colorizer, { customLevels, customLevelNames } = {}) {
        const [levelStr, levelNum] = getLevelLabelData(useOnlyCustomProps, customLevels, customLevelNames)(level);
        return Object.prototype.hasOwnProperty.call(colorizer, levelNum) ? colorizer[levelNum](levelStr) : colorizer.default(levelStr);
      };
    }
    function plainColorizer(useOnlyCustomProps) {
      const newPlainColorizer = colorizeLevel(useOnlyCustomProps);
      const customColoredColorizer = function(level, opts) {
        return newPlainColorizer(level, plain, opts);
      };
      customColoredColorizer.message = plain.message;
      customColoredColorizer.greyMessage = plain.greyMessage;
      customColoredColorizer.property = plain.property;
      customColoredColorizer.colors = createColors({ useColor: false });
      return customColoredColorizer;
    }
    function coloredColorizer(useOnlyCustomProps) {
      const newColoredColorizer = colorizeLevel(useOnlyCustomProps);
      const customColoredColorizer = function(level, opts) {
        return newColoredColorizer(level, colored, opts);
      };
      customColoredColorizer.message = colored.message;
      customColoredColorizer.property = colored.property;
      customColoredColorizer.greyMessage = colored.greyMessage;
      customColoredColorizer.colors = availableColors;
      return customColoredColorizer;
    }
    function customColoredColorizerFactory(customColors, useOnlyCustomProps) {
      const onlyCustomColored = resolveCustomColoredColorizer(customColors);
      const customColored = useOnlyCustomProps ? onlyCustomColored : Object.assign({}, colored, onlyCustomColored);
      const colorizeLevelCustom = colorizeLevel(useOnlyCustomProps);
      const customColoredColorizer = function(level, opts) {
        return colorizeLevelCustom(level, customColored, opts);
      };
      customColoredColorizer.colors = availableColors;
      customColoredColorizer.message = customColoredColorizer.message || customColored.message;
      customColoredColorizer.property = customColoredColorizer.property || customColored.property;
      customColoredColorizer.greyMessage = customColoredColorizer.greyMessage || customColored.greyMessage;
      return customColoredColorizer;
    }
    module2.exports = function getColorizer(useColors = false, customColors, useOnlyCustomProps) {
      if (useColors && customColors !== void 0) {
        return customColoredColorizerFactory(customColors, useOnlyCustomProps);
      } else if (useColors) {
        return coloredColorizer(useOnlyCustomProps);
      }
      return plainColorizer(useOnlyCustomProps);
    };
  }
});

// node_modules/.pnpm/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js
var require_atomic_sleep = __commonJS({
  "node_modules/.pnpm/atomic-sleep@1.0.0/node_modules/atomic-sleep/index.js"(exports2, module2) {
    "use strict";
    if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        Atomics.wait(nil, 0, 0, Number(ms));
      };
      const nil = new Int32Array(new SharedArrayBuffer(4));
      module2.exports = sleep;
    } else {
      let sleep = function(ms) {
        const valid = ms > 0 && ms < Infinity;
        if (valid === false) {
          if (typeof ms !== "number" && typeof ms !== "bigint") {
            throw TypeError("sleep: ms must be a number");
          }
          throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
        }
        const target = Date.now() + Number(ms);
        while (target > Date.now()) {
        }
      };
      module2.exports = sleep;
    }
  }
});

// node_modules/.pnpm/sonic-boom@4.2.1/node_modules/sonic-boom/index.js
var require_sonic_boom = __commonJS({
  "node_modules/.pnpm/sonic-boom@4.2.1/node_modules/sonic-boom/index.js"(exports2, module2) {
    "use strict";
    var fs = require("fs");
    var EventEmitter = require("events");
    var inherits = require("util").inherits;
    var path = require("path");
    var sleep = require_atomic_sleep();
    var assert = require("assert");
    var BUSY_WRITE_TIMEOUT = 100;
    var kEmptyBuffer = Buffer.allocUnsafe(0);
    var MAX_WRITE = 16 * 1024;
    var kContentModeBuffer = "buffer";
    var kContentModeUtf8 = "utf8";
    var [major, minor] = (process.versions.node || "0.0").split(".").map(Number);
    var kCopyBuffer = major >= 22 && minor >= 7;
    function openFile(file, sonic) {
      sonic._opening = true;
      sonic._writing = true;
      sonic._asyncDrainScheduled = false;
      function fileOpened(err, fd) {
        if (err) {
          sonic._reopening = false;
          sonic._writing = false;
          sonic._opening = false;
          if (sonic.sync) {
            process.nextTick(() => {
              if (sonic.listenerCount("error") > 0) {
                sonic.emit("error", err);
              }
            });
          } else {
            sonic.emit("error", err);
          }
          return;
        }
        const reopening = sonic._reopening;
        sonic.fd = fd;
        sonic.file = file;
        sonic._reopening = false;
        sonic._opening = false;
        sonic._writing = false;
        if (sonic.sync) {
          process.nextTick(() => sonic.emit("ready"));
        } else {
          sonic.emit("ready");
        }
        if (sonic.destroyed) {
          return;
        }
        if (!sonic._writing && sonic._len > sonic.minLength || sonic._flushPending) {
          sonic._actualWrite();
        } else if (reopening) {
          process.nextTick(() => sonic.emit("drain"));
        }
      }
      const flags = sonic.append ? "a" : "w";
      const mode = sonic.mode;
      if (sonic.sync) {
        try {
          if (sonic.mkdir) fs.mkdirSync(path.dirname(file), { recursive: true });
          const fd = fs.openSync(file, flags, mode);
          fileOpened(null, fd);
        } catch (err) {
          fileOpened(err);
          throw err;
        }
      } else if (sonic.mkdir) {
        fs.mkdir(path.dirname(file), { recursive: true }, (err) => {
          if (err) return fileOpened(err);
          fs.open(file, flags, mode, fileOpened);
        });
      } else {
        fs.open(file, flags, mode, fileOpened);
      }
    }
    function SonicBoom(opts) {
      if (!(this instanceof SonicBoom)) {
        return new SonicBoom(opts);
      }
      let { fd, dest, minLength, maxLength, maxWrite, periodicFlush, sync, append = true, mkdir, retryEAGAIN, fsync, contentMode, mode } = opts || {};
      fd = fd || dest;
      this._len = 0;
      this.fd = -1;
      this._bufs = [];
      this._lens = [];
      this._writing = false;
      this._ending = false;
      this._reopening = false;
      this._asyncDrainScheduled = false;
      this._flushPending = false;
      this._hwm = Math.max(minLength || 0, 16387);
      this.file = null;
      this.destroyed = false;
      this.minLength = minLength || 0;
      this.maxLength = maxLength || 0;
      this.maxWrite = maxWrite || MAX_WRITE;
      this._periodicFlush = periodicFlush || 0;
      this._periodicFlushTimer = void 0;
      this.sync = sync || false;
      this.writable = true;
      this._fsync = fsync || false;
      this.append = append || false;
      this.mode = mode;
      this.retryEAGAIN = retryEAGAIN || (() => true);
      this.mkdir = mkdir || false;
      let fsWriteSync;
      let fsWrite;
      if (contentMode === kContentModeBuffer) {
        this._writingBuf = kEmptyBuffer;
        this.write = writeBuffer;
        this.flush = flushBuffer;
        this.flushSync = flushBufferSync;
        this._actualWrite = actualWriteBuffer;
        fsWriteSync = () => fs.writeSync(this.fd, this._writingBuf);
        fsWrite = () => fs.write(this.fd, this._writingBuf, this.release);
      } else if (contentMode === void 0 || contentMode === kContentModeUtf8) {
        this._writingBuf = "";
        this.write = write;
        this.flush = flush;
        this.flushSync = flushSync;
        this._actualWrite = actualWrite;
        fsWriteSync = () => {
          if (Buffer.isBuffer(this._writingBuf)) {
            return fs.writeSync(this.fd, this._writingBuf);
          }
          return fs.writeSync(this.fd, this._writingBuf, "utf8");
        };
        fsWrite = () => {
          if (Buffer.isBuffer(this._writingBuf)) {
            return fs.write(this.fd, this._writingBuf, this.release);
          }
          return fs.write(this.fd, this._writingBuf, "utf8", this.release);
        };
      } else {
        throw new Error(`SonicBoom supports "${kContentModeUtf8}" and "${kContentModeBuffer}", but passed ${contentMode}`);
      }
      if (typeof fd === "number") {
        this.fd = fd;
        process.nextTick(() => this.emit("ready"));
      } else if (typeof fd === "string") {
        openFile(fd, this);
      } else {
        throw new Error("SonicBoom supports only file descriptors and files");
      }
      if (this.minLength >= this.maxWrite) {
        throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
      }
      this.release = (err, n) => {
        if (err) {
          if ((err.code === "EAGAIN" || err.code === "EBUSY") && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {
            if (this.sync) {
              try {
                sleep(BUSY_WRITE_TIMEOUT);
                this.release(void 0, 0);
              } catch (err2) {
                this.release(err2);
              }
            } else {
              setTimeout(fsWrite, BUSY_WRITE_TIMEOUT);
            }
          } else {
            this._writing = false;
            this.emit("error", err);
          }
          return;
        }
        this.emit("write", n);
        const releasedBufObj = releaseWritingBuf(this._writingBuf, this._len, n);
        this._len = releasedBufObj.len;
        this._writingBuf = releasedBufObj.writingBuf;
        if (this._writingBuf.length) {
          if (!this.sync) {
            fsWrite();
            return;
          }
          try {
            do {
              const n2 = fsWriteSync();
              const releasedBufObj2 = releaseWritingBuf(this._writingBuf, this._len, n2);
              this._len = releasedBufObj2.len;
              this._writingBuf = releasedBufObj2.writingBuf;
            } while (this._writingBuf.length);
          } catch (err2) {
            this.release(err2);
            return;
          }
        }
        if (this._fsync) {
          fs.fsyncSync(this.fd);
        }
        const len = this._len;
        if (this._reopening) {
          this._writing = false;
          this._reopening = false;
          this.reopen();
        } else if (len > this.minLength) {
          this._actualWrite();
        } else if (this._ending) {
          if (len > 0) {
            this._actualWrite();
          } else {
            this._writing = false;
            actualClose(this);
          }
        } else {
          this._writing = false;
          if (this.sync) {
            if (!this._asyncDrainScheduled) {
              this._asyncDrainScheduled = true;
              process.nextTick(emitDrain, this);
            }
          } else {
            this.emit("drain");
          }
        }
      };
      this.on("newListener", function(name) {
        if (name === "drain") {
          this._asyncDrainScheduled = false;
        }
      });
      if (this._periodicFlush !== 0) {
        this._periodicFlushTimer = setInterval(() => this.flush(null), this._periodicFlush);
        this._periodicFlushTimer.unref();
      }
    }
    function releaseWritingBuf(writingBuf, len, n) {
      if (typeof writingBuf === "string") {
        writingBuf = Buffer.from(writingBuf);
      }
      len = Math.max(len - n, 0);
      writingBuf = writingBuf.subarray(n);
      return { writingBuf, len };
    }
    function emitDrain(sonic) {
      const hasListeners = sonic.listenerCount("drain") > 0;
      if (!hasListeners) return;
      sonic._asyncDrainScheduled = false;
      sonic.emit("drain");
    }
    inherits(SonicBoom, EventEmitter);
    function mergeBuf(bufs, len) {
      if (bufs.length === 0) {
        return kEmptyBuffer;
      }
      if (bufs.length === 1) {
        return bufs[0];
      }
      return Buffer.concat(bufs, len);
    }
    function write(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      data = "" + data;
      const dataLen = Buffer.byteLength(data);
      const len = this._len + dataLen;
      const bufs = this._bufs;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || Buffer.byteLength(bufs[bufs.length - 1]) + dataLen > this.maxWrite) {
        bufs.push(data);
      } else {
        bufs[bufs.length - 1] += data;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function writeBuffer(data) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      const len = this._len + data.length;
      const bufs = this._bufs;
      const lens = this._lens;
      if (this.maxLength && len > this.maxLength) {
        this.emit("drop", data);
        return this._len < this._hwm;
      }
      if (bufs.length === 0 || lens[lens.length - 1] + data.length > this.maxWrite) {
        bufs.push([data]);
        lens.push(data.length);
      } else {
        bufs[bufs.length - 1].push(data);
        lens[lens.length - 1] += data.length;
      }
      this._len = len;
      if (!this._writing && this._len >= this.minLength) {
        this._actualWrite();
      }
      return this._len < this._hwm;
    }
    function callFlushCallbackOnDrain(cb) {
      this._flushPending = true;
      const onDrain = () => {
        if (!this._fsync) {
          try {
            fs.fsync(this.fd, (err) => {
              this._flushPending = false;
              cb(err);
            });
          } catch (err) {
            cb(err);
          }
        } else {
          this._flushPending = false;
          cb();
        }
        this.off("error", onError);
      };
      const onError = (err) => {
        this._flushPending = false;
        cb(err);
        this.off("drain", onDrain);
      };
      this.once("drain", onDrain);
      this.once("error", onError);
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push("");
      }
      this._actualWrite();
    }
    function flushBuffer(cb) {
      if (cb != null && typeof cb !== "function") {
        throw new Error("flush cb must be a function");
      }
      if (this.destroyed) {
        const error = new Error("SonicBoom destroyed");
        if (cb) {
          cb(error);
          return;
        }
        throw error;
      }
      if (this.minLength <= 0) {
        cb?.();
        return;
      }
      if (cb) {
        callFlushCallbackOnDrain.call(this, cb);
      }
      if (this._writing) {
        return;
      }
      if (this._bufs.length === 0) {
        this._bufs.push([]);
        this._lens.push(0);
      }
      this._actualWrite();
    }
    SonicBoom.prototype.reopen = function(file) {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.reopen(file);
        });
        return;
      }
      if (this._ending) {
        return;
      }
      if (!this.file) {
        throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
      }
      if (file) {
        this.file = file;
      }
      this._reopening = true;
      if (this._writing) {
        return;
      }
      const fd = this.fd;
      this.once("ready", () => {
        if (fd !== this.fd) {
          fs.close(fd, (err) => {
            if (err) {
              return this.emit("error", err);
            }
          });
        }
      });
      openFile(this.file, this);
    };
    SonicBoom.prototype.end = function() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this._opening) {
        this.once("ready", () => {
          this.end();
        });
        return;
      }
      if (this._ending) {
        return;
      }
      this._ending = true;
      if (this._writing) {
        return;
      }
      if (this._len > 0 && this.fd >= 0) {
        this._actualWrite();
      } else {
        actualClose(this);
      }
    };
    function flushSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift(this._writingBuf);
        this._writingBuf = "";
      }
      let buf = "";
      while (this._bufs.length || buf.length) {
        if (buf.length <= 0) {
          buf = this._bufs[0];
        }
        try {
          const n = Buffer.isBuffer(buf) ? fs.writeSync(this.fd, buf) : fs.writeSync(this.fd, buf, "utf8");
          const releasedBufObj = releaseWritingBuf(buf, this._len, n);
          buf = releasedBufObj.writingBuf;
          this._len = releasedBufObj.len;
          if (buf.length <= 0) {
            this._bufs.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
      try {
        fs.fsyncSync(this.fd);
      } catch {
      }
    }
    function flushBufferSync() {
      if (this.destroyed) {
        throw new Error("SonicBoom destroyed");
      }
      if (this.fd < 0) {
        throw new Error("sonic boom is not ready yet");
      }
      if (!this._writing && this._writingBuf.length > 0) {
        this._bufs.unshift([this._writingBuf]);
        this._writingBuf = kEmptyBuffer;
      }
      let buf = kEmptyBuffer;
      while (this._bufs.length || buf.length) {
        if (buf.length <= 0) {
          buf = mergeBuf(this._bufs[0], this._lens[0]);
        }
        try {
          const n = fs.writeSync(this.fd, buf);
          buf = buf.subarray(n);
          this._len = Math.max(this._len - n, 0);
          if (buf.length <= 0) {
            this._bufs.shift();
            this._lens.shift();
          }
        } catch (err) {
          const shouldRetry = err.code === "EAGAIN" || err.code === "EBUSY";
          if (shouldRetry && !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {
            throw err;
          }
          sleep(BUSY_WRITE_TIMEOUT);
        }
      }
    }
    SonicBoom.prototype.destroy = function() {
      if (this.destroyed) {
        return;
      }
      actualClose(this);
    };
    function actualWrite() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf.length ? this._writingBuf : this._bufs.shift() || "";
      if (this.sync) {
        try {
          const written = Buffer.isBuffer(this._writingBuf) ? fs.writeSync(this.fd, this._writingBuf) : fs.writeSync(this.fd, this._writingBuf, "utf8");
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        fs.write(this.fd, this._writingBuf, release);
      }
    }
    function actualWriteBuffer() {
      const release = this.release;
      this._writing = true;
      this._writingBuf = this._writingBuf.length ? this._writingBuf : mergeBuf(this._bufs.shift(), this._lens.shift());
      if (this.sync) {
        try {
          const written = fs.writeSync(this.fd, this._writingBuf);
          release(null, written);
        } catch (err) {
          release(err);
        }
      } else {
        if (kCopyBuffer) {
          this._writingBuf = Buffer.from(this._writingBuf);
        }
        fs.write(this.fd, this._writingBuf, release);
      }
    }
    function actualClose(sonic) {
      if (sonic.fd === -1) {
        sonic.once("ready", actualClose.bind(null, sonic));
        return;
      }
      if (sonic._periodicFlushTimer !== void 0) {
        clearInterval(sonic._periodicFlushTimer);
      }
      sonic.destroyed = true;
      sonic._bufs = [];
      sonic._lens = [];
      assert(typeof sonic.fd === "number", `sonic.fd must be a number, got ${typeof sonic.fd}`);
      try {
        fs.fsync(sonic.fd, closeWrapped);
      } catch {
      }
      function closeWrapped() {
        if (sonic.fd !== 1 && sonic.fd !== 2) {
          fs.close(sonic.fd, done);
        } else {
          done();
        }
      }
      function done(err) {
        if (err) {
          sonic.emit("error", err);
          return;
        }
        if (sonic._ending && !sonic._writing) {
          sonic.emit("finish");
        }
        sonic.emit("close");
      }
    }
    SonicBoom.SonicBoom = SonicBoom;
    SonicBoom.default = SonicBoom;
    module2.exports = SonicBoom;
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/noop.js
var require_noop = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/noop.js"(exports2, module2) {
    "use strict";
    module2.exports = function noop() {
    };
  }
});

// node_modules/.pnpm/on-exit-leak-free@2.1.2/node_modules/on-exit-leak-free/index.js
var require_on_exit_leak_free = __commonJS({
  "node_modules/.pnpm/on-exit-leak-free@2.1.2/node_modules/on-exit-leak-free/index.js"(exports2, module2) {
    "use strict";
    var refs = {
      exit: [],
      beforeExit: []
    };
    var functions = {
      exit: onExit,
      beforeExit: onBeforeExit
    };
    var registry;
    function ensureRegistry() {
      if (registry === void 0) {
        registry = new FinalizationRegistry(clear);
      }
    }
    function install(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.on(event, functions[event]);
    }
    function uninstall(event) {
      if (refs[event].length > 0) {
        return;
      }
      process.removeListener(event, functions[event]);
      if (refs.exit.length === 0 && refs.beforeExit.length === 0) {
        registry = void 0;
      }
    }
    function onExit() {
      callRefs("exit");
    }
    function onBeforeExit() {
      callRefs("beforeExit");
    }
    function callRefs(event) {
      for (const ref of refs[event]) {
        const obj = ref.deref();
        const fn = ref.fn;
        if (obj !== void 0) {
          fn(obj, event);
        }
      }
      refs[event] = [];
    }
    function clear(ref) {
      for (const event of ["exit", "beforeExit"]) {
        const index = refs[event].indexOf(ref);
        refs[event].splice(index, index + 1);
        uninstall(event);
      }
    }
    function _register(event, obj, fn) {
      if (obj === void 0) {
        throw new Error("the object can't be undefined");
      }
      install(event);
      const ref = new WeakRef(obj);
      ref.fn = fn;
      ensureRegistry();
      registry.register(obj, ref);
      refs[event].push(ref);
    }
    function register(obj, fn) {
      _register("exit", obj, fn);
    }
    function registerBeforeExit(obj, fn) {
      _register("beforeExit", obj, fn);
    }
    function unregister(obj) {
      if (registry === void 0) {
        return;
      }
      registry.unregister(obj);
      for (const event of ["exit", "beforeExit"]) {
        refs[event] = refs[event].filter((ref) => {
          const _obj = ref.deref();
          return _obj && _obj !== obj;
        });
        uninstall(event);
      }
    }
    module2.exports = {
      register,
      registerBeforeExit,
      unregister
    };
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/build-safe-sonic-boom.js
var require_build_safe_sonic_boom = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/build-safe-sonic-boom.js"(exports2, module2) {
    "use strict";
    module2.exports = buildSafeSonicBoom2;
    var { isMainThread } = require("node:worker_threads");
    var SonicBoom = require_sonic_boom();
    var noop = require_noop();
    function buildSafeSonicBoom2(opts) {
      const stream = new SonicBoom(opts);
      stream.on("error", filterBrokenPipe);
      if (!opts.sync && isMainThread) {
        setupOnExit(stream);
      }
      return stream;
      function filterBrokenPipe(err) {
        if (err.code === "EPIPE") {
          stream.write = noop;
          stream.end = noop;
          stream.flushSync = noop;
          stream.destroy = noop;
          return;
        }
        stream.removeListener("error", filterBrokenPipe);
      }
    }
    function setupOnExit(stream) {
      if (global.WeakRef && global.WeakMap && global.FinalizationRegistry) {
        const onExit = require_on_exit_leak_free();
        onExit.register(stream, autoEnd);
        stream.on("close", function() {
          onExit.unregister(stream);
        });
      }
    }
    function autoEnd(stream, eventName) {
      if (stream.destroyed) {
        return;
      }
      if (eventName === "beforeExit") {
        stream.flush();
        stream.on("drain", function() {
          stream.end();
        });
      } else {
        stream.flushSync();
      }
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/is-valid-date.js
var require_is_valid_date = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/is-valid-date.js"(exports2, module2) {
    "use strict";
    module2.exports = isValidDate;
    function isValidDate(date) {
      return date instanceof Date && !Number.isNaN(date.getTime());
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/create-date.js
var require_create_date = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/create-date.js"(exports2, module2) {
    "use strict";
    module2.exports = createDate;
    var isValidDate = require_is_valid_date();
    function createDate(epoch) {
      let date = new Date(epoch);
      if (isValidDate(date)) {
        return date;
      }
      date = /* @__PURE__ */ new Date(+epoch);
      return date;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/split-property-key.js
var require_split_property_key = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/split-property-key.js"(exports2, module2) {
    "use strict";
    module2.exports = splitPropertyKey;
    function splitPropertyKey(key) {
      const result = [];
      let backslash = false;
      let segment = "";
      for (let i = 0; i < key.length; i++) {
        const c = key.charAt(i);
        if (c === "\\") {
          backslash = true;
          continue;
        }
        if (backslash) {
          backslash = false;
          segment += c;
          continue;
        }
        if (c === ".") {
          result.push(segment);
          segment = "";
          continue;
        }
        segment += c;
      }
      if (segment.length) {
        result.push(segment);
      }
      return result;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/get-property-value.js
var require_get_property_value = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/get-property-value.js"(exports2, module2) {
    "use strict";
    module2.exports = getPropertyValue;
    var splitPropertyKey = require_split_property_key();
    function getPropertyValue(obj, property) {
      const props = Array.isArray(property) ? property : splitPropertyKey(property);
      for (const prop of props) {
        if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
          return;
        }
        obj = obj[prop];
      }
      return obj;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/delete-log-property.js
var require_delete_log_property = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/delete-log-property.js"(exports2, module2) {
    "use strict";
    module2.exports = deleteLogProperty;
    var getPropertyValue = require_get_property_value();
    var splitPropertyKey = require_split_property_key();
    function deleteLogProperty(log, property) {
      const props = splitPropertyKey(property);
      const propToDelete = props.pop();
      log = getPropertyValue(log, props);
      if (log !== null && typeof log === "object" && Object.prototype.hasOwnProperty.call(log, propToDelete)) {
        delete log[propToDelete];
      }
    }
  }
});

// node_modules/.pnpm/fast-copy@4.0.2/node_modules/fast-copy/dist/cjs/index.cjs
var require_cjs = __commonJS({
  "node_modules/.pnpm/fast-copy@4.0.2/node_modules/fast-copy/dist/cjs/index.cjs"(exports2) {
    "use strict";
    var toStringFunction = Function.prototype.toString;
    var toStringObject = Object.prototype.toString;
    function getCleanClone(prototype) {
      if (!prototype) {
        return /* @__PURE__ */ Object.create(null);
      }
      const Constructor = prototype.constructor;
      if (Constructor === Object) {
        return prototype === Object.prototype ? {} : Object.create(prototype);
      }
      if (Constructor && ~toStringFunction.call(Constructor).indexOf("[native code]")) {
        try {
          return new Constructor();
        } catch (_a) {
        }
      }
      return Object.create(prototype);
    }
    function getTag(value) {
      const stringTag = value[Symbol.toStringTag];
      if (stringTag) {
        return stringTag;
      }
      const type = toStringObject.call(value);
      return type.substring(8, type.length - 1);
    }
    var { hasOwnProperty, propertyIsEnumerable } = Object.prototype;
    function copyOwnDescriptor(original, clone, property, state) {
      const ownDescriptor = Object.getOwnPropertyDescriptor(original, property) || {
        configurable: true,
        enumerable: true,
        value: original[property],
        writable: true
      };
      const descriptor = ownDescriptor.get || ownDescriptor.set ? ownDescriptor : {
        configurable: ownDescriptor.configurable,
        enumerable: ownDescriptor.enumerable,
        value: state.copier(ownDescriptor.value, state),
        writable: ownDescriptor.writable
      };
      try {
        Object.defineProperty(clone, property, descriptor);
      } catch (_a) {
        clone[property] = descriptor.get ? descriptor.get() : descriptor.value;
      }
    }
    function copyOwnPropertiesStrict(value, clone, state) {
      const names = Object.getOwnPropertyNames(value);
      for (let index = 0; index < names.length; ++index) {
        copyOwnDescriptor(value, clone, names[index], state);
      }
      const symbols = Object.getOwnPropertySymbols(value);
      for (let index = 0; index < symbols.length; ++index) {
        copyOwnDescriptor(value, clone, symbols[index], state);
      }
      return clone;
    }
    function copyArrayLoose(array, state) {
      const clone = new state.Constructor();
      state.cache.set(array, clone);
      for (let index = 0; index < array.length; ++index) {
        clone[index] = state.copier(array[index], state);
      }
      return clone;
    }
    function copyArrayStrict(array, state) {
      const clone = new state.Constructor();
      state.cache.set(array, clone);
      return copyOwnPropertiesStrict(array, clone, state);
    }
    function copyArrayBuffer(arrayBuffer, _state) {
      return arrayBuffer.slice(0);
    }
    function copyBlob(blob, _state) {
      return blob.slice(0, blob.size, blob.type);
    }
    function copyDataView(dataView, state) {
      return new state.Constructor(copyArrayBuffer(dataView.buffer));
    }
    function copyDate(date, state) {
      return new state.Constructor(date.getTime());
    }
    function copyMapLoose(map, state) {
      const clone = new state.Constructor();
      state.cache.set(map, clone);
      map.forEach((value, key) => {
        clone.set(key, state.copier(value, state));
      });
      return clone;
    }
    function copyMapStrict(map, state) {
      return copyOwnPropertiesStrict(map, copyMapLoose(map, state), state);
    }
    function copyObjectLoose(object, state) {
      const clone = getCleanClone(state.prototype);
      state.cache.set(object, clone);
      for (const key in object) {
        if (hasOwnProperty.call(object, key)) {
          clone[key] = state.copier(object[key], state);
        }
      }
      const symbols = Object.getOwnPropertySymbols(object);
      for (let index = 0; index < symbols.length; ++index) {
        const symbol = symbols[index];
        if (propertyIsEnumerable.call(object, symbol)) {
          clone[symbol] = state.copier(object[symbol], state);
        }
      }
      return clone;
    }
    function copyObjectStrict(object, state) {
      const clone = getCleanClone(state.prototype);
      state.cache.set(object, clone);
      return copyOwnPropertiesStrict(object, clone, state);
    }
    function copyPrimitiveWrapper(primitiveObject, state) {
      return new state.Constructor(primitiveObject.valueOf());
    }
    function copyRegExp(regExp, state) {
      const clone = new state.Constructor(regExp.source, regExp.flags);
      clone.lastIndex = regExp.lastIndex;
      return clone;
    }
    function copySelf(value, _state) {
      return value;
    }
    function copySetLoose(set, state) {
      const clone = new state.Constructor();
      state.cache.set(set, clone);
      set.forEach((value) => {
        clone.add(state.copier(value, state));
      });
      return clone;
    }
    function copySetStrict(set, state) {
      return copyOwnPropertiesStrict(set, copySetLoose(set, state), state);
    }
    function createDefaultCache() {
      return /* @__PURE__ */ new WeakMap();
    }
    function getOptions({ createCache: createCacheOverride, methods: methodsOverride, strict }) {
      const defaultMethods = {
        array: strict ? copyArrayStrict : copyArrayLoose,
        arrayBuffer: copyArrayBuffer,
        asyncGenerator: copySelf,
        blob: copyBlob,
        dataView: copyDataView,
        date: copyDate,
        error: copySelf,
        generator: copySelf,
        map: strict ? copyMapStrict : copyMapLoose,
        object: strict ? copyObjectStrict : copyObjectLoose,
        regExp: copyRegExp,
        set: strict ? copySetStrict : copySetLoose
      };
      const methods = methodsOverride ? Object.assign(defaultMethods, methodsOverride) : defaultMethods;
      const copiers = getTagSpecificCopiers(methods);
      const createCache = createCacheOverride || createDefaultCache;
      if (!copiers.Object || !copiers.Array) {
        throw new Error("An object and array copier must be provided.");
      }
      return { createCache, copiers, methods, strict: Boolean(strict) };
    }
    function getTagSpecificCopiers(methods) {
      return {
        Arguments: methods.object,
        Array: methods.array,
        ArrayBuffer: methods.arrayBuffer,
        AsyncGenerator: methods.asyncGenerator,
        Blob: methods.blob,
        Boolean: copyPrimitiveWrapper,
        DataView: methods.dataView,
        Date: methods.date,
        Error: methods.error,
        Float32Array: methods.arrayBuffer,
        Float64Array: methods.arrayBuffer,
        Generator: methods.generator,
        Int8Array: methods.arrayBuffer,
        Int16Array: methods.arrayBuffer,
        Int32Array: methods.arrayBuffer,
        Map: methods.map,
        Number: copyPrimitiveWrapper,
        Object: methods.object,
        Promise: copySelf,
        RegExp: methods.regExp,
        Set: methods.set,
        String: copyPrimitiveWrapper,
        WeakMap: copySelf,
        WeakSet: copySelf,
        Uint8Array: methods.arrayBuffer,
        Uint8ClampedArray: methods.arrayBuffer,
        Uint16Array: methods.arrayBuffer,
        Uint32Array: methods.arrayBuffer,
        Uint64Array: methods.arrayBuffer
      };
    }
    function createCopier(options = {}) {
      const { createCache, copiers } = getOptions(options);
      const { Array: copyArray, Object: copyObject } = copiers;
      function copier(value, state) {
        state.prototype = state.Constructor = void 0;
        if (!value || typeof value !== "object") {
          return value;
        }
        if (state.cache.has(value)) {
          return state.cache.get(value);
        }
        state.prototype = Object.getPrototypeOf(value);
        state.Constructor = state.prototype && state.prototype.constructor;
        if (!state.Constructor || state.Constructor === Object) {
          return copyObject(value, state);
        }
        if (Array.isArray(value)) {
          return copyArray(value, state);
        }
        const tagSpecificCopier = copiers[getTag(value)];
        if (tagSpecificCopier) {
          return tagSpecificCopier(value, state);
        }
        return typeof value.then === "function" ? value : copyObject(value, state);
      }
      return function copy2(value) {
        return copier(value, {
          Constructor: void 0,
          cache: createCache(),
          copier,
          prototype: void 0
        });
      };
    }
    var copyStrict = createCopier({ strict: true });
    var copy = createCopier();
    exports2.copy = copy;
    exports2.copyStrict = copyStrict;
    exports2.createCopier = createCopier;
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/filter-log.js
var require_filter_log = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/filter-log.js"(exports2, module2) {
    "use strict";
    module2.exports = filterLog;
    var { createCopier } = require_cjs();
    var fastCopy = createCopier({});
    var deleteLogProperty = require_delete_log_property();
    function filterLog({ log, context }) {
      const { ignoreKeys, includeKeys } = context;
      const logCopy = fastCopy(log);
      if (includeKeys) {
        const logIncluded = {};
        includeKeys.forEach((key) => {
          logIncluded[key] = logCopy[key];
        });
        return logIncluded;
      }
      ignoreKeys.forEach((ignoreKey) => {
        deleteLogProperty(logCopy, ignoreKey);
      });
      return logCopy;
    }
  }
});

// node_modules/.pnpm/dateformat@4.6.3/node_modules/dateformat/lib/dateformat.js
var require_dateformat = __commonJS({
  "node_modules/.pnpm/dateformat@4.6.3/node_modules/dateformat/lib/dateformat.js"(exports2, module2) {
    "use strict";
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    (function(global2) {
      var _arguments = arguments;
      var dateFormat = /* @__PURE__ */ (function() {
        var token = /d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g;
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        var timezoneClip = /[^-+\dA-Z]/g;
        return function(date, mask, utc, gmt) {
          if (_arguments.length === 1 && kindOf(date) === "string" && !/\d/.test(date)) {
            mask = date;
            date = void 0;
          }
          date = date || date === 0 ? date : /* @__PURE__ */ new Date();
          if (!(date instanceof Date)) {
            date = new Date(date);
          }
          if (isNaN(date)) {
            throw TypeError("Invalid date");
          }
          mask = String(dateFormat.masks[mask] || mask || dateFormat.masks["default"]);
          var maskSlice = mask.slice(0, 4);
          if (maskSlice === "UTC:" || maskSlice === "GMT:") {
            mask = mask.slice(4);
            utc = true;
            if (maskSlice === "GMT:") {
              gmt = true;
            }
          }
          var _ = function _2() {
            return utc ? "getUTC" : "get";
          };
          var _d = function d() {
            return date[_() + "Date"]();
          };
          var D = function D2() {
            return date[_() + "Day"]();
          };
          var _m = function m() {
            return date[_() + "Month"]();
          };
          var y = function y2() {
            return date[_() + "FullYear"]();
          };
          var _H = function H() {
            return date[_() + "Hours"]();
          };
          var _M = function M() {
            return date[_() + "Minutes"]();
          };
          var _s = function s() {
            return date[_() + "Seconds"]();
          };
          var _L = function L() {
            return date[_() + "Milliseconds"]();
          };
          var _o = function o() {
            return utc ? 0 : date.getTimezoneOffset();
          };
          var _W = function W() {
            return getWeek(date);
          };
          var _N = function N() {
            return getDayOfWeek(date);
          };
          var flags = { d: function d() {
            return _d();
          }, dd: function dd() {
            return pad(_d());
          }, ddd: function ddd() {
            return dateFormat.i18n.dayNames[D()];
          }, DDD: function DDD() {
            return getDayName({ y: y(), m: _m(), d: _d(), _: _(), dayName: dateFormat.i18n.dayNames[D()], short: true });
          }, dddd: function dddd() {
            return dateFormat.i18n.dayNames[D() + 7];
          }, DDDD: function DDDD() {
            return getDayName({ y: y(), m: _m(), d: _d(), _: _(), dayName: dateFormat.i18n.dayNames[D() + 7] });
          }, m: function m() {
            return _m() + 1;
          }, mm: function mm() {
            return pad(_m() + 1);
          }, mmm: function mmm() {
            return dateFormat.i18n.monthNames[_m()];
          }, mmmm: function mmmm() {
            return dateFormat.i18n.monthNames[_m() + 12];
          }, yy: function yy() {
            return String(y()).slice(2);
          }, yyyy: function yyyy() {
            return pad(y(), 4);
          }, h: function h() {
            return _H() % 12 || 12;
          }, hh: function hh() {
            return pad(_H() % 12 || 12);
          }, H: function H() {
            return _H();
          }, HH: function HH() {
            return pad(_H());
          }, M: function M() {
            return _M();
          }, MM: function MM() {
            return pad(_M());
          }, s: function s() {
            return _s();
          }, ss: function ss() {
            return pad(_s());
          }, l: function l() {
            return pad(_L(), 3);
          }, L: function L() {
            return pad(Math.floor(_L() / 10));
          }, t: function t() {
            return _H() < 12 ? dateFormat.i18n.timeNames[0] : dateFormat.i18n.timeNames[1];
          }, tt: function tt() {
            return _H() < 12 ? dateFormat.i18n.timeNames[2] : dateFormat.i18n.timeNames[3];
          }, T: function T() {
            return _H() < 12 ? dateFormat.i18n.timeNames[4] : dateFormat.i18n.timeNames[5];
          }, TT: function TT() {
            return _H() < 12 ? dateFormat.i18n.timeNames[6] : dateFormat.i18n.timeNames[7];
          }, Z: function Z() {
            return gmt ? "GMT" : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "").replace(/GMT\+0000/g, "UTC");
          }, o: function o() {
            return (_o() > 0 ? "-" : "+") + pad(Math.floor(Math.abs(_o()) / 60) * 100 + Math.abs(_o()) % 60, 4);
          }, p: function p() {
            return (_o() > 0 ? "-" : "+") + pad(Math.floor(Math.abs(_o()) / 60), 2) + ":" + pad(Math.floor(Math.abs(_o()) % 60), 2);
          }, S: function S() {
            return ["th", "st", "nd", "rd"][_d() % 10 > 3 ? 0 : (_d() % 100 - _d() % 10 != 10) * _d() % 10];
          }, W: function W() {
            return _W();
          }, WW: function WW() {
            return pad(_W());
          }, N: function N() {
            return _N();
          } };
          return mask.replace(token, function(match) {
            if (match in flags) {
              return flags[match]();
            }
            return match.slice(1, match.length - 1);
          });
        };
      })();
      dateFormat.masks = { default: "ddd mmm dd yyyy HH:MM:ss", shortDate: "m/d/yy", paddedShortDate: "mm/dd/yyyy", mediumDate: "mmm d, yyyy", longDate: "mmmm d, yyyy", fullDate: "dddd, mmmm d, yyyy", shortTime: "h:MM TT", mediumTime: "h:MM:ss TT", longTime: "h:MM:ss TT Z", isoDate: "yyyy-mm-dd", isoTime: "HH:MM:ss", isoDateTime: "yyyy-mm-dd'T'HH:MM:sso", isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z" };
      dateFormat.i18n = { dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"] };
      var pad = function pad2(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
          val = "0" + val;
        }
        return val;
      };
      var getDayName = function getDayName2(_ref) {
        var y = _ref.y, m = _ref.m, d = _ref.d, _ = _ref._, dayName = _ref.dayName, _ref$short = _ref["short"], _short = _ref$short === void 0 ? false : _ref$short;
        var today = /* @__PURE__ */ new Date();
        var yesterday = /* @__PURE__ */ new Date();
        yesterday.setDate(yesterday[_ + "Date"]() - 1);
        var tomorrow = /* @__PURE__ */ new Date();
        tomorrow.setDate(tomorrow[_ + "Date"]() + 1);
        var today_d = function today_d2() {
          return today[_ + "Date"]();
        };
        var today_m = function today_m2() {
          return today[_ + "Month"]();
        };
        var today_y = function today_y2() {
          return today[_ + "FullYear"]();
        };
        var yesterday_d = function yesterday_d2() {
          return yesterday[_ + "Date"]();
        };
        var yesterday_m = function yesterday_m2() {
          return yesterday[_ + "Month"]();
        };
        var yesterday_y = function yesterday_y2() {
          return yesterday[_ + "FullYear"]();
        };
        var tomorrow_d = function tomorrow_d2() {
          return tomorrow[_ + "Date"]();
        };
        var tomorrow_m = function tomorrow_m2() {
          return tomorrow[_ + "Month"]();
        };
        var tomorrow_y = function tomorrow_y2() {
          return tomorrow[_ + "FullYear"]();
        };
        if (today_y() === y && today_m() === m && today_d() === d) {
          return _short ? "Tdy" : "Today";
        } else if (yesterday_y() === y && yesterday_m() === m && yesterday_d() === d) {
          return _short ? "Ysd" : "Yesterday";
        } else if (tomorrow_y() === y && tomorrow_m() === m && tomorrow_d() === d) {
          return _short ? "Tmw" : "Tomorrow";
        }
        return dayName;
      };
      var getWeek = function getWeek2(date) {
        var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        targetThursday.setDate(targetThursday.getDate() - (targetThursday.getDay() + 6) % 7 + 3);
        var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() - (firstThursday.getDay() + 6) % 7 + 3);
        var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
        targetThursday.setHours(targetThursday.getHours() - ds);
        var weekDiff = (targetThursday - firstThursday) / (864e5 * 7);
        return 1 + Math.floor(weekDiff);
      };
      var getDayOfWeek = function getDayOfWeek2(date) {
        var dow = date.getDay();
        if (dow === 0) {
          dow = 7;
        }
        return dow;
      };
      var kindOf = function kindOf2(val) {
        if (val === null) {
          return "null";
        }
        if (val === void 0) {
          return "undefined";
        }
        if (_typeof(val) !== "object") {
          return _typeof(val);
        }
        if (Array.isArray(val)) {
          return "array";
        }
        return {}.toString.call(val).slice(8, -1).toLowerCase();
      };
      if (typeof define === "function" && define.amd) {
        define(function() {
          return dateFormat;
        });
      } else if ((typeof exports2 === "undefined" ? "undefined" : _typeof(exports2)) === "object") {
        module2.exports = dateFormat;
      } else {
        global2.dateFormat = dateFormat;
      }
    })(void 0);
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/format-time.js
var require_format_time = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/format-time.js"(exports2, module2) {
    "use strict";
    module2.exports = formatTime;
    var {
      DATE_FORMAT,
      DATE_FORMAT_SIMPLE
    } = require_constants();
    var dateformat = require_dateformat();
    var createDate = require_create_date();
    var isValidDate = require_is_valid_date();
    function formatTime(epoch, translateTime = false) {
      if (translateTime === false) {
        return epoch;
      }
      const instant = createDate(epoch);
      if (!isValidDate(instant)) {
        return epoch;
      }
      if (translateTime === true) {
        return dateformat(instant, DATE_FORMAT_SIMPLE);
      }
      const upperFormat = translateTime.toUpperCase();
      if (upperFormat === "SYS:STANDARD") {
        return dateformat(instant, DATE_FORMAT);
      }
      const prefix = upperFormat.substr(0, 4);
      if (prefix === "SYS:" || prefix === "UTC:") {
        if (prefix === "UTC:") {
          return dateformat(instant, translateTime);
        }
        return dateformat(instant, translateTime.slice(4));
      }
      return dateformat(instant, `UTC:${translateTime}`);
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/handle-custom-levels-names-opts.js
var require_handle_custom_levels_names_opts = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/handle-custom-levels-names-opts.js"(exports2, module2) {
    "use strict";
    module2.exports = handleCustomLevelsNamesOpts;
    function handleCustomLevelsNamesOpts(cLevels) {
      if (!cLevels) return {};
      if (typeof cLevels === "string") {
        return cLevels.split(",").reduce((agg, value, idx) => {
          const [levelName, levelNum = idx] = value.split(":");
          agg[levelName.toLowerCase()] = levelNum;
          return agg;
        }, {});
      } else if (Object.prototype.toString.call(cLevels) === "[object Object]") {
        return Object.keys(cLevels).reduce((agg, levelName) => {
          agg[levelName.toLowerCase()] = cLevels[levelName];
          return agg;
        }, {});
      } else {
        return {};
      }
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/handle-custom-levels-opts.js
var require_handle_custom_levels_opts = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/handle-custom-levels-opts.js"(exports2, module2) {
    "use strict";
    module2.exports = handleCustomLevelsOpts;
    function handleCustomLevelsOpts(cLevels) {
      if (!cLevels) return {};
      if (typeof cLevels === "string") {
        return cLevels.split(",").reduce(
          (agg, value, idx) => {
            const [levelName, levelNum = idx] = value.split(":");
            agg[levelNum] = levelName.toUpperCase();
            return agg;
          },
          { default: "USERLVL" }
        );
      } else if (Object.prototype.toString.call(cLevels) === "[object Object]") {
        return Object.keys(cLevels).reduce((agg, levelName) => {
          agg[cLevels[levelName]] = levelName.toUpperCase();
          return agg;
        }, { default: "USERLVL" });
      } else {
        return {};
      }
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/interpret-conditionals.js
var require_interpret_conditionals = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/interpret-conditionals.js"(exports2, module2) {
    "use strict";
    module2.exports = interpretConditionals;
    var getPropertyValue = require_get_property_value();
    function interpretConditionals(messageFormat, log) {
      messageFormat = messageFormat.replace(/{if (.*?)}(.*?){end}/g, replacer);
      messageFormat = messageFormat.replace(/{if (.*?)}/g, "");
      messageFormat = messageFormat.replace(/{end}/g, "");
      return messageFormat.replace(/\s+/g, " ").trim();
      function replacer(_, key, value) {
        const propertyValue = getPropertyValue(log, key);
        if (propertyValue && value.includes(key)) {
          return value.replace(new RegExp("{" + key + "}", "g"), propertyValue);
        } else {
          return "";
        }
      }
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/is-object.js
var require_is_object = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/is-object.js"(exports2, module2) {
    "use strict";
    module2.exports = isObject;
    function isObject(input) {
      return Object.prototype.toString.apply(input) === "[object Object]";
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/join-lines-with-indentation.js
var require_join_lines_with_indentation = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/join-lines-with-indentation.js"(exports2, module2) {
    "use strict";
    module2.exports = joinLinesWithIndentation;
    function joinLinesWithIndentation({ input, ident = "    ", eol = "\n" }) {
      const lines = input.split(/\r?\n/);
      for (let i = 1; i < lines.length; i += 1) {
        lines[i] = ident + lines[i];
      }
      return lines.join(eol);
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/parse-factory-options.js
var require_parse_factory_options = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/parse-factory-options.js"(exports2, module2) {
    "use strict";
    module2.exports = parseFactoryOptions2;
    var {
      LEVEL_NAMES
    } = require_constants();
    var colors2 = require_colors();
    var handleCustomLevelsOpts = require_handle_custom_levels_opts();
    var handleCustomLevelsNamesOpts = require_handle_custom_levels_names_opts();
    var handleLevelLabelData = require_get_level_label_data();
    function parseFactoryOptions2(options) {
      const EOL = options.crlf ? "\r\n" : "\n";
      const IDENT = "    ";
      const {
        customPrettifiers,
        errorLikeObjectKeys,
        hideObject,
        levelFirst,
        levelKey,
        levelLabel,
        messageFormat,
        messageKey,
        minimumLevel,
        singleLine,
        timestampKey,
        translateTime
      } = options;
      const errorProps = options.errorProps.split(",");
      const useOnlyCustomProps = typeof options.useOnlyCustomProps === "boolean" ? options.useOnlyCustomProps : options.useOnlyCustomProps === "true";
      const customLevels = handleCustomLevelsOpts(options.customLevels);
      const customLevelNames = handleCustomLevelsNamesOpts(options.customLevels);
      const getLevelLabelData = handleLevelLabelData(useOnlyCustomProps, customLevels, customLevelNames);
      let customColors;
      if (options.customColors) {
        if (typeof options.customColors === "string") {
          customColors = options.customColors.split(",").reduce((agg, value) => {
            const [level, color] = value.split(":");
            const condition = useOnlyCustomProps ? options.customLevels : customLevelNames[level] !== void 0;
            const levelNum = condition ? customLevelNames[level] : LEVEL_NAMES[level];
            const colorIdx = levelNum !== void 0 ? levelNum : level;
            agg.push([colorIdx, color]);
            return agg;
          }, []);
        } else if (typeof options.customColors === "object") {
          customColors = Object.keys(options.customColors).reduce((agg, value) => {
            const [level, color] = [value, options.customColors[value]];
            const condition = useOnlyCustomProps ? options.customLevels : customLevelNames[level] !== void 0;
            const levelNum = condition ? customLevelNames[level] : LEVEL_NAMES[level];
            const colorIdx = levelNum !== void 0 ? levelNum : level;
            agg.push([colorIdx, color]);
            return agg;
          }, []);
        } else {
          throw new Error("options.customColors must be of type string or object.");
        }
      }
      const customProperties = { customLevels, customLevelNames };
      if (useOnlyCustomProps === true && !options.customLevels) {
        customProperties.customLevels = void 0;
        customProperties.customLevelNames = void 0;
      }
      const includeKeys = options.include !== void 0 ? new Set(options.include.split(",")) : void 0;
      const ignoreKeys = !includeKeys && options.ignore ? new Set(options.ignore.split(",")) : void 0;
      const colorizer = colors2(options.colorize, customColors, useOnlyCustomProps);
      const objectColorizer = options.colorizeObjects ? colorizer : colors2(false, [], false);
      return {
        EOL,
        IDENT,
        colorizer,
        customColors,
        customLevelNames,
        customLevels,
        customPrettifiers,
        customProperties,
        errorLikeObjectKeys,
        errorProps,
        getLevelLabelData,
        hideObject,
        ignoreKeys,
        includeKeys,
        levelFirst,
        levelKey,
        levelLabel,
        messageFormat,
        messageKey,
        minimumLevel,
        objectColorizer,
        singleLine,
        timestampKey,
        translateTime,
        useOnlyCustomProps
      };
    }
  }
});

// node_modules/.pnpm/fast-safe-stringify@2.1.1/node_modules/fast-safe-stringify/index.js
var require_fast_safe_stringify = __commonJS({
  "node_modules/.pnpm/fast-safe-stringify@2.1.1/node_modules/fast-safe-stringify/index.js"(exports2, module2) {
    module2.exports = stringify;
    stringify.default = stringify;
    stringify.stable = deterministicStringify;
    stringify.stableStringify = deterministicStringify;
    var LIMIT_REPLACE_NODE = "[...]";
    var CIRCULAR_REPLACE_NODE = "[Circular]";
    var arr = [];
    var replacerStack = [];
    function defaultOptions2() {
      return {
        depthLimit: Number.MAX_SAFE_INTEGER,
        edgesLimit: Number.MAX_SAFE_INTEGER
      };
    }
    function stringify(obj, replacer, spacer, options) {
      if (typeof options === "undefined") {
        options = defaultOptions2();
      }
      decirc(obj, "", 0, [], void 0, 0, options);
      var res;
      try {
        if (replacerStack.length === 0) {
          res = JSON.stringify(obj, replacer, spacer);
        } else {
          res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
        }
      } catch (_) {
        return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
      } finally {
        while (arr.length !== 0) {
          var part = arr.pop();
          if (part.length === 4) {
            Object.defineProperty(part[0], part[1], part[3]);
          } else {
            part[0][part[1]] = part[2];
          }
        }
      }
      return res;
    }
    function setReplace(replace, val, k, parent) {
      var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
      if (propertyDescriptor.get !== void 0) {
        if (propertyDescriptor.configurable) {
          Object.defineProperty(parent, k, { value: replace });
          arr.push([parent, k, val, propertyDescriptor]);
        } else {
          replacerStack.push([val, k, replace]);
        }
      } else {
        parent[k] = replace;
        arr.push([parent, k, val]);
      }
    }
    function decirc(val, k, edgeIndex, stack, parent, depth, options) {
      depth += 1;
      var i;
      if (typeof val === "object" && val !== null) {
        for (i = 0; i < stack.length; i++) {
          if (stack[i] === val) {
            setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
            return;
          }
        }
        if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        stack.push(val);
        if (Array.isArray(val)) {
          for (i = 0; i < val.length; i++) {
            decirc(val[i], i, i, stack, val, depth, options);
          }
        } else {
          var keys = Object.keys(val);
          for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            decirc(val[key], key, i, stack, val, depth, options);
          }
        }
        stack.pop();
      }
    }
    function compareFunction(a, b) {
      if (a < b) {
        return -1;
      }
      if (a > b) {
        return 1;
      }
      return 0;
    }
    function deterministicStringify(obj, replacer, spacer, options) {
      if (typeof options === "undefined") {
        options = defaultOptions2();
      }
      var tmp = deterministicDecirc(obj, "", 0, [], void 0, 0, options) || obj;
      var res;
      try {
        if (replacerStack.length === 0) {
          res = JSON.stringify(tmp, replacer, spacer);
        } else {
          res = JSON.stringify(tmp, replaceGetterValues(replacer), spacer);
        }
      } catch (_) {
        return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]");
      } finally {
        while (arr.length !== 0) {
          var part = arr.pop();
          if (part.length === 4) {
            Object.defineProperty(part[0], part[1], part[3]);
          } else {
            part[0][part[1]] = part[2];
          }
        }
      }
      return res;
    }
    function deterministicDecirc(val, k, edgeIndex, stack, parent, depth, options) {
      depth += 1;
      var i;
      if (typeof val === "object" && val !== null) {
        for (i = 0; i < stack.length; i++) {
          if (stack[i] === val) {
            setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
            return;
          }
        }
        try {
          if (typeof val.toJSON === "function") {
            return;
          }
        } catch (_) {
          return;
        }
        if (typeof options.depthLimit !== "undefined" && depth > options.depthLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        if (typeof options.edgesLimit !== "undefined" && edgeIndex + 1 > options.edgesLimit) {
          setReplace(LIMIT_REPLACE_NODE, val, k, parent);
          return;
        }
        stack.push(val);
        if (Array.isArray(val)) {
          for (i = 0; i < val.length; i++) {
            deterministicDecirc(val[i], i, i, stack, val, depth, options);
          }
        } else {
          var tmp = {};
          var keys = Object.keys(val).sort(compareFunction);
          for (i = 0; i < keys.length; i++) {
            var key = keys[i];
            deterministicDecirc(val[key], key, i, stack, val, depth, options);
            tmp[key] = val[key];
          }
          if (typeof parent !== "undefined") {
            arr.push([parent, k, val]);
            parent[k] = tmp;
          } else {
            return tmp;
          }
        }
        stack.pop();
      }
    }
    function replaceGetterValues(replacer) {
      replacer = typeof replacer !== "undefined" ? replacer : function(k, v) {
        return v;
      };
      return function(key, val) {
        if (replacerStack.length > 0) {
          for (var i = 0; i < replacerStack.length; i++) {
            var part = replacerStack[i];
            if (part[1] === key && part[0] === val) {
              val = part[2];
              replacerStack.splice(i, 1);
              break;
            }
          }
        }
        return replacer.call(this, key, val);
      };
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-error.js
var require_prettify_error = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-error.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyError;
    var joinLinesWithIndentation = require_join_lines_with_indentation();
    function prettifyError({ keyName, lines, eol, ident }) {
      let result = "";
      const joinedLines = joinLinesWithIndentation({ input: lines, ident, eol });
      const splitLines = `${ident}${keyName}: ${joinedLines}${eol}`.split(eol);
      for (let j = 0; j < splitLines.length; j += 1) {
        if (j !== 0) result += eol;
        const line = splitLines[j];
        if (/^\s*"stack"/.test(line)) {
          const matches = /^(\s*"stack":)\s*(".*"),?$/.exec(line);
          if (matches && matches.length === 3) {
            const indentSize = /^\s*/.exec(line)[0].length + 4;
            const indentation = " ".repeat(indentSize);
            const stackMessage = matches[2];
            result += matches[1] + eol + indentation + JSON.parse(stackMessage).replace(/\n/g, eol + indentation);
          } else {
            result += line;
          }
        } else {
          result += line;
        }
      }
      return result;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-object.js
var require_prettify_object = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-object.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyObject;
    var {
      LOGGER_KEYS
    } = require_constants();
    var stringifySafe = require_fast_safe_stringify();
    var joinLinesWithIndentation = require_join_lines_with_indentation();
    var prettifyError = require_prettify_error();
    function prettifyObject({
      log,
      excludeLoggerKeys = true,
      skipKeys = [],
      context
    }) {
      const {
        EOL: eol,
        IDENT: ident,
        customPrettifiers,
        errorLikeObjectKeys: errorLikeKeys,
        objectColorizer,
        singleLine,
        colorizer
      } = context;
      const keysToIgnore = [].concat(skipKeys);
      if (excludeLoggerKeys === true) Array.prototype.push.apply(keysToIgnore, LOGGER_KEYS);
      let result = "";
      const { plain, errors } = Object.entries(log).reduce(({ plain: plain2, errors: errors2 }, [k, v]) => {
        if (keysToIgnore.includes(k) === false) {
          const pretty2 = typeof customPrettifiers[k] === "function" ? customPrettifiers[k](v, k, log, { colors: colorizer.colors }) : v;
          if (errorLikeKeys.includes(k)) {
            errors2[k] = pretty2;
          } else {
            plain2[k] = pretty2;
          }
        }
        return { plain: plain2, errors: errors2 };
      }, { plain: {}, errors: {} });
      if (singleLine) {
        if (Object.keys(plain).length > 0) {
          result += objectColorizer.greyMessage(stringifySafe(plain));
        }
        result += eol;
        result = result.replace(/\\\\/gi, "\\");
      } else {
        Object.entries(plain).forEach(([keyName, keyValue]) => {
          let lines = typeof customPrettifiers[keyName] === "function" ? keyValue : stringifySafe(keyValue, null, 2);
          if (lines === void 0) return;
          lines = lines.replace(/\\\\/gi, "\\");
          const joinedLines = joinLinesWithIndentation({ input: lines, ident, eol });
          result += `${ident}${objectColorizer.property(keyName)}:${joinedLines.startsWith(eol) ? "" : " "}${joinedLines}${eol}`;
        });
      }
      Object.entries(errors).forEach(([keyName, keyValue]) => {
        const lines = typeof customPrettifiers[keyName] === "function" ? keyValue : stringifySafe(keyValue, null, 2);
        if (lines === void 0) return;
        result += prettifyError({ keyName, lines, eol, ident });
      });
      return result;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-error-log.js
var require_prettify_error_log = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-error-log.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyErrorLog;
    var {
      LOGGER_KEYS
    } = require_constants();
    var isObject = require_is_object();
    var joinLinesWithIndentation = require_join_lines_with_indentation();
    var prettifyObject = require_prettify_object();
    function prettifyErrorLog({ log, context }) {
      const {
        EOL: eol,
        IDENT: ident,
        errorProps: errorProperties,
        messageKey
      } = context;
      const stack = log.stack;
      const joinedLines = joinLinesWithIndentation({ input: stack, ident, eol });
      let result = `${ident}${joinedLines}${eol}`;
      if (errorProperties.length > 0) {
        const excludeProperties = LOGGER_KEYS.concat(messageKey, "type", "stack");
        let propertiesToPrint;
        if (errorProperties[0] === "*") {
          propertiesToPrint = Object.keys(log).filter((k) => excludeProperties.includes(k) === false);
        } else {
          propertiesToPrint = errorProperties.filter((k) => excludeProperties.includes(k) === false);
        }
        for (let i = 0; i < propertiesToPrint.length; i += 1) {
          const key = propertiesToPrint[i];
          if (key in log === false) continue;
          if (isObject(log[key])) {
            const prettifiedObject = prettifyObject({
              log: log[key],
              excludeLoggerKeys: false,
              context: {
                ...context,
                IDENT: ident + ident
              }
            });
            result = `${result}${ident}${key}: {${eol}${prettifiedObject}${ident}}${eol}`;
            continue;
          }
          result = `${result}${ident}${key}: ${log[key]}${eol}`;
        }
      }
      return result;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-level.js
var require_prettify_level = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-level.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyLevel;
    var getPropertyValue = require_get_property_value();
    function prettifyLevel({ log, context }) {
      const {
        colorizer,
        customLevels,
        customLevelNames,
        levelKey,
        getLevelLabelData
      } = context;
      const prettifier = context.customPrettifiers?.level;
      const output = getPropertyValue(log, levelKey);
      if (output === void 0) return void 0;
      const labelColorized = colorizer(output, { customLevels, customLevelNames });
      if (prettifier) {
        const [label] = getLevelLabelData(output);
        return prettifier(output, levelKey, log, { label, labelColorized, colors: colorizer.colors });
      }
      return labelColorized;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-message.js
var require_prettify_message = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-message.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyMessage;
    var {
      LEVELS
    } = require_constants();
    var getPropertyValue = require_get_property_value();
    var interpretConditionals = require_interpret_conditionals();
    function prettifyMessage({ log, context }) {
      const {
        colorizer,
        customLevels,
        levelKey,
        levelLabel,
        messageFormat,
        messageKey,
        useOnlyCustomProps
      } = context;
      if (messageFormat && typeof messageFormat === "string") {
        const parsedMessageFormat = interpretConditionals(messageFormat, log);
        const message = String(parsedMessageFormat).replace(
          /{([^{}]+)}/g,
          function(match, p1) {
            let level;
            if (p1 === levelLabel && (level = getPropertyValue(log, levelKey)) !== void 0) {
              const condition = useOnlyCustomProps ? customLevels === void 0 : customLevels[level] === void 0;
              return condition ? LEVELS[level] : customLevels[level];
            }
            const value = getPropertyValue(log, p1);
            return value !== void 0 ? value : "";
          }
        );
        return colorizer.message(message);
      }
      if (messageFormat && typeof messageFormat === "function") {
        const msg = messageFormat(log, messageKey, levelLabel, { colors: colorizer.colors });
        return colorizer.message(msg);
      }
      if (messageKey in log === false) return void 0;
      if (typeof log[messageKey] !== "string" && typeof log[messageKey] !== "number" && typeof log[messageKey] !== "boolean") return void 0;
      return colorizer.message(log[messageKey]);
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-metadata.js
var require_prettify_metadata = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-metadata.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyMetadata;
    function prettifyMetadata({ log, context }) {
      const { customPrettifiers: prettifiers, colorizer } = context;
      let line = "";
      if (log.name || log.pid || log.hostname) {
        line += "(";
        if (log.name) {
          line += prettifiers.name ? prettifiers.name(log.name, "name", log, { colors: colorizer.colors }) : log.name;
        }
        if (log.pid) {
          const prettyPid = prettifiers.pid ? prettifiers.pid(log.pid, "pid", log, { colors: colorizer.colors }) : log.pid;
          if (log.name && log.pid) {
            line += "/" + prettyPid;
          } else {
            line += prettyPid;
          }
        }
        if (log.hostname) {
          const prettyHostname = prettifiers.hostname ? prettifiers.hostname(log.hostname, "hostname", log, { colors: colorizer.colors }) : log.hostname;
          line += `${line === "(" ? "on" : " on"} ${prettyHostname}`;
        }
        line += ")";
      }
      if (log.caller) {
        const prettyCaller = prettifiers.caller ? prettifiers.caller(log.caller, "caller", log, { colors: colorizer.colors }) : log.caller;
        line += `${line === "" ? "" : " "}<${prettyCaller}>`;
      }
      if (line === "") {
        return void 0;
      } else {
        return line;
      }
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-time.js
var require_prettify_time = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/prettify-time.js"(exports2, module2) {
    "use strict";
    module2.exports = prettifyTime;
    var formatTime = require_format_time();
    function prettifyTime({ log, context }) {
      const {
        timestampKey,
        translateTime: translateFormat
      } = context;
      const prettifier = context.customPrettifiers?.time;
      let time = null;
      if (timestampKey in log) {
        time = log[timestampKey];
      } else if ("timestamp" in log) {
        time = log.timestamp;
      }
      if (time === null) return void 0;
      const output = translateFormat ? formatTime(time, translateFormat) : time;
      return prettifier ? prettifier(output) : `[${output}]`;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/index.js
var require_utils = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/utils/index.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      buildSafeSonicBoom: require_build_safe_sonic_boom(),
      createDate: require_create_date(),
      deleteLogProperty: require_delete_log_property(),
      filterLog: require_filter_log(),
      formatTime: require_format_time(),
      getPropertyValue: require_get_property_value(),
      handleCustomLevelsNamesOpts: require_handle_custom_levels_names_opts(),
      handleCustomLevelsOpts: require_handle_custom_levels_opts(),
      interpretConditionals: require_interpret_conditionals(),
      isObject: require_is_object(),
      isValidDate: require_is_valid_date(),
      joinLinesWithIndentation: require_join_lines_with_indentation(),
      noop: require_noop(),
      parseFactoryOptions: require_parse_factory_options(),
      prettifyErrorLog: require_prettify_error_log(),
      prettifyError: require_prettify_error(),
      prettifyLevel: require_prettify_level(),
      prettifyMessage: require_prettify_message(),
      prettifyMetadata: require_prettify_metadata(),
      prettifyObject: require_prettify_object(),
      prettifyTime: require_prettify_time(),
      splitPropertyKey: require_split_property_key(),
      getLevelLabelData: require_get_level_label_data()
    };
  }
});

// node_modules/.pnpm/secure-json-parse@4.1.0/node_modules/secure-json-parse/index.js
var require_secure_json_parse = __commonJS({
  "node_modules/.pnpm/secure-json-parse@4.1.0/node_modules/secure-json-parse/index.js"(exports2, module2) {
    "use strict";
    var hasBuffer = typeof Buffer !== "undefined";
    var suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
    var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    function _parse(text, reviver, options) {
      if (options == null) {
        if (reviver !== null && typeof reviver === "object") {
          options = reviver;
          reviver = void 0;
        }
      }
      if (hasBuffer && Buffer.isBuffer(text)) {
        text = text.toString();
      }
      if (text && text.charCodeAt(0) === 65279) {
        text = text.slice(1);
      }
      const obj = JSON.parse(text, reviver);
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      const protoAction = options && options.protoAction || "error";
      const constructorAction = options && options.constructorAction || "error";
      if (protoAction === "ignore" && constructorAction === "ignore") {
        return obj;
      }
      if (protoAction !== "ignore" && constructorAction !== "ignore") {
        if (suspectProtoRx.test(text) === false && suspectConstructorRx.test(text) === false) {
          return obj;
        }
      } else if (protoAction !== "ignore" && constructorAction === "ignore") {
        if (suspectProtoRx.test(text) === false) {
          return obj;
        }
      } else {
        if (suspectConstructorRx.test(text) === false) {
          return obj;
        }
      }
      return filter(obj, { protoAction, constructorAction, safe: options && options.safe });
    }
    function filter(obj, { protoAction = "error", constructorAction = "error", safe } = {}) {
      let next = [obj];
      while (next.length) {
        const nodes = next;
        next = [];
        for (const node of nodes) {
          if (protoAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "__proto__")) {
            if (safe === true) {
              return null;
            } else if (protoAction === "error") {
              throw new SyntaxError("Object contains forbidden prototype property");
            }
            delete node.__proto__;
          }
          if (constructorAction !== "ignore" && Object.prototype.hasOwnProperty.call(node, "constructor") && node.constructor !== null && typeof node.constructor === "object" && Object.prototype.hasOwnProperty.call(node.constructor, "prototype")) {
            if (safe === true) {
              return null;
            } else if (constructorAction === "error") {
              throw new SyntaxError("Object contains forbidden prototype property");
            }
            delete node.constructor;
          }
          for (const key in node) {
            const value = node[key];
            if (value && typeof value === "object") {
              next.push(value);
            }
          }
        }
      }
      return obj;
    }
    function parse(text, reviver, options) {
      const { stackTraceLimit } = Error;
      Error.stackTraceLimit = 0;
      try {
        return _parse(text, reviver, options);
      } finally {
        Error.stackTraceLimit = stackTraceLimit;
      }
    }
    function safeParse(text, reviver) {
      const { stackTraceLimit } = Error;
      Error.stackTraceLimit = 0;
      try {
        return _parse(text, reviver, { safe: true });
      } catch {
        return void 0;
      } finally {
        Error.stackTraceLimit = stackTraceLimit;
      }
    }
    module2.exports = parse;
    module2.exports.default = parse;
    module2.exports.parse = parse;
    module2.exports.safeParse = safeParse;
    module2.exports.scan = filter;
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/pretty.js
var require_pretty = __commonJS({
  "node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/lib/pretty.js"(exports2, module2) {
    "use strict";
    module2.exports = pretty2;
    var sjs = require_secure_json_parse();
    var isObject = require_is_object();
    var prettifyErrorLog = require_prettify_error_log();
    var prettifyLevel = require_prettify_level();
    var prettifyMessage = require_prettify_message();
    var prettifyMetadata = require_prettify_metadata();
    var prettifyObject = require_prettify_object();
    var prettifyTime = require_prettify_time();
    var filterLog = require_filter_log();
    var {
      LEVELS,
      LEVEL_KEY: LEVEL_KEY2,
      LEVEL_NAMES
    } = require_constants();
    var jsonParser = (input) => {
      try {
        return { value: sjs.parse(input, { protoAction: "remove" }) };
      } catch (err) {
        return { err };
      }
    };
    function pretty2(inputData) {
      let log;
      if (!isObject(inputData)) {
        const parsed = jsonParser(inputData);
        if (parsed.err || !isObject(parsed.value)) {
          return inputData + this.EOL;
        }
        log = parsed.value;
      } else {
        log = inputData;
      }
      if (this.minimumLevel) {
        let condition;
        if (this.useOnlyCustomProps) {
          condition = this.customLevels;
        } else {
          condition = this.customLevelNames[this.minimumLevel] !== void 0;
        }
        let minimum;
        if (condition) {
          minimum = this.customLevelNames[this.minimumLevel];
        } else {
          minimum = LEVEL_NAMES[this.minimumLevel];
        }
        if (!minimum) {
          minimum = typeof this.minimumLevel === "string" ? LEVEL_NAMES[this.minimumLevel] : LEVEL_NAMES[LEVELS[this.minimumLevel].toLowerCase()];
        }
        const level = log[this.levelKey === void 0 ? LEVEL_KEY2 : this.levelKey];
        if (level < minimum) return;
      }
      const prettifiedMessage = prettifyMessage({ log, context: this.context });
      if (this.ignoreKeys || this.includeKeys) {
        log = filterLog({ log, context: this.context });
      }
      const prettifiedLevel = prettifyLevel({
        log,
        context: {
          ...this.context,
          // This is odd. The colorizer ends up relying on the value of
          // `customProperties` instead of the original `customLevels` and
          // `customLevelNames`.
          ...this.context.customProperties
        }
      });
      const prettifiedMetadata = prettifyMetadata({ log, context: this.context });
      const prettifiedTime = prettifyTime({ log, context: this.context });
      let line = "";
      if (this.levelFirst && prettifiedLevel) {
        line = `${prettifiedLevel}`;
      }
      if (prettifiedTime && line === "") {
        line = `${prettifiedTime}`;
      } else if (prettifiedTime) {
        line = `${line} ${prettifiedTime}`;
      }
      if (!this.levelFirst && prettifiedLevel) {
        if (line.length > 0) {
          line = `${line} ${prettifiedLevel}`;
        } else {
          line = prettifiedLevel;
        }
      }
      if (prettifiedMetadata) {
        if (line.length > 0) {
          line = `${line} ${prettifiedMetadata}:`;
        } else {
          line = prettifiedMetadata;
        }
      }
      if (line.endsWith(":") === false && line !== "") {
        line += ":";
      }
      if (prettifiedMessage !== void 0) {
        if (line.length > 0) {
          line = `${line} ${prettifiedMessage}`;
        } else {
          line = prettifiedMessage;
        }
      }
      if (line.length > 0 && !this.singleLine) {
        line += this.EOL;
      }
      if (log.type === "Error" && typeof log.stack === "string") {
        const prettifiedErrorLog = prettifyErrorLog({ log, context: this.context });
        if (this.singleLine) line += this.EOL;
        line += prettifiedErrorLog;
      } else if (this.hideObject === false) {
        const skipKeys = [
          this.messageKey,
          this.levelKey,
          this.timestampKey
        ].map((key) => key.replaceAll(/\\/g, "")).filter((key) => {
          return typeof log[key] === "string" || typeof log[key] === "number" || typeof log[key] === "boolean";
        });
        const prettifiedObject = prettifyObject({
          log,
          skipKeys,
          context: this.context
        });
        if (this.singleLine && !/^\s$/.test(prettifiedObject)) {
          line += " ";
        }
        line += prettifiedObject;
      }
      return line;
    }
  }
});

// node_modules/.pnpm/pino-pretty@13.1.3/node_modules/pino-pretty/index.js
var { isColorSupported } = require_colorette();
var pump = require_pump();
var { Transform } = require("node:stream");
var abstractTransport = require_pino_abstract_transport();
var colors = require_colors();
var {
  ERROR_LIKE_KEYS,
  LEVEL_KEY,
  LEVEL_LABEL,
  MESSAGE_KEY,
  TIMESTAMP_KEY
} = require_constants();
var {
  buildSafeSonicBoom,
  parseFactoryOptions
} = require_utils();
var pretty = require_pretty();
var defaultOptions = {
  colorize: isColorSupported,
  colorizeObjects: true,
  crlf: false,
  customColors: null,
  customLevels: null,
  customPrettifiers: {},
  errorLikeObjectKeys: ERROR_LIKE_KEYS,
  errorProps: "",
  hideObject: false,
  ignore: "hostname",
  include: void 0,
  levelFirst: false,
  levelKey: LEVEL_KEY,
  levelLabel: LEVEL_LABEL,
  messageFormat: null,
  messageKey: MESSAGE_KEY,
  minimumLevel: void 0,
  outputStream: process.stdout,
  singleLine: false,
  timestampKey: TIMESTAMP_KEY,
  translateTime: true,
  useOnlyCustomProps: true
};
function prettyFactory(options) {
  const context = parseFactoryOptions(Object.assign({}, defaultOptions, options));
  return pretty.bind({ ...context, context });
}
function build(opts = {}) {
  let pretty2 = prettyFactory(opts);
  let destination;
  return abstractTransport(function(source) {
    source.on("message", function pinoConfigListener(message) {
      if (!message || message.code !== "PINO_CONFIG") return;
      Object.assign(opts, {
        messageKey: message.config.messageKey,
        errorLikeObjectKeys: Array.from(/* @__PURE__ */ new Set([...opts.errorLikeObjectKeys || ERROR_LIKE_KEYS, message.config.errorKey])),
        customLevels: message.config.levels.values
      });
      pretty2 = prettyFactory(opts);
      source.off("message", pinoConfigListener);
    });
    const stream = new Transform({
      objectMode: true,
      autoDestroy: true,
      transform(chunk, enc, cb) {
        const line = pretty2(chunk);
        cb(null, line);
      }
    });
    if (typeof opts.destination === "object" && typeof opts.destination.write === "function") {
      destination = opts.destination;
    } else {
      destination = buildSafeSonicBoom({
        dest: opts.destination || 1,
        append: opts.append,
        mkdir: opts.mkdir,
        sync: opts.sync
        // by default sonic will be async
      });
    }
    source.on("unknown", function(line) {
      destination.write(line + "\n");
    });
    pump(source, stream, destination);
    return stream;
  }, {
    parse: "lines",
    close(err, cb) {
      destination.on("close", () => {
        cb(err);
      });
    }
  });
}
module.exports = build;
module.exports.build = build;
module.exports.PinoPretty = build;
module.exports.prettyFactory = prettyFactory;
module.exports.colorizerFactory = colors;
module.exports.isColorSupported = isColorSupported;
module.exports.default = build;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2NvbG9yZXR0ZUAyLjAuMjAvbm9kZV9tb2R1bGVzL2NvbG9yZXR0ZS9pbmRleC5janMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3dyYXBweUAxLjAuMi9ub2RlX21vZHVsZXMvd3JhcHB5L3dyYXBweS5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vb25jZUAxLjQuMC9ub2RlX21vZHVsZXMvb25jZS9vbmNlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9lbmQtb2Ytc3RyZWFtQDEuNC41L25vZGVfbW9kdWxlcy9lbmQtb2Ytc3RyZWFtL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9wdW1wQDMuMC40L25vZGVfbW9kdWxlcy9wdW1wL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9zcGxpdDJANC4yLjAvbm9kZV9tb2R1bGVzL3NwbGl0Mi9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1hYnN0cmFjdC10cmFuc3BvcnRAMy4wLjAvbm9kZV9tb2R1bGVzL3Bpbm8tYWJzdHJhY3QtdHJhbnNwb3J0L2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi9jb25zdGFudHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL2dldC1sZXZlbC1sYWJlbC1kYXRhLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi9jb2xvcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2F0b21pYy1zbGVlcEAxLjAuMC9ub2RlX21vZHVsZXMvYXRvbWljLXNsZWVwL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9zb25pYy1ib29tQDQuMi4xL25vZGVfbW9kdWxlcy9zb25pYy1ib29tL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi91dGlscy9ub29wLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9vbi1leGl0LWxlYWstZnJlZUAyLjEuMi9ub2RlX21vZHVsZXMvb24tZXhpdC1sZWFrLWZyZWUvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL2J1aWxkLXNhZmUtc29uaWMtYm9vbS5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvaXMtdmFsaWQtZGF0ZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvY3JlYXRlLWRhdGUuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL3NwbGl0LXByb3BlcnR5LWtleS5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvZ2V0LXByb3BlcnR5LXZhbHVlLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi91dGlscy9kZWxldGUtbG9nLXByb3BlcnR5LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9mYXN0LWNvcHlANC4wLjIvbm9kZV9tb2R1bGVzL3NyYy91dGlscy50cyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vZmFzdC1jb3B5QDQuMC4yL25vZGVfbW9kdWxlcy9zcmMvY29waWVyLnRzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9mYXN0LWNvcHlANC4wLjIvbm9kZV9tb2R1bGVzL3NyYy9vcHRpb25zLnRzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9mYXN0LWNvcHlANC4wLjIvbm9kZV9tb2R1bGVzL3NyYy9pbmRleC50cyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvZmlsdGVyLWxvZy5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vZGF0ZWZvcm1hdEA0LjYuMy9ub2RlX21vZHVsZXMvZGF0ZWZvcm1hdC9saWIvZGF0ZWZvcm1hdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvZm9ybWF0LXRpbWUuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL2hhbmRsZS1jdXN0b20tbGV2ZWxzLW5hbWVzLW9wdHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL2hhbmRsZS1jdXN0b20tbGV2ZWxzLW9wdHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL2ludGVycHJldC1jb25kaXRpb25hbHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL2lzLW9iamVjdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvam9pbi1saW5lcy13aXRoLWluZGVudGF0aW9uLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi91dGlscy9wYXJzZS1mYWN0b3J5LW9wdGlvbnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2Zhc3Qtc2FmZS1zdHJpbmdpZnlAMi4xLjEvbm9kZV9tb2R1bGVzL2Zhc3Qtc2FmZS1zdHJpbmdpZnkvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL3ByZXR0aWZ5LWVycm9yLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi91dGlscy9wcmV0dGlmeS1vYmplY3QuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL3ByZXR0aWZ5LWVycm9yLWxvZy5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1wcmV0dHlAMTMuMS4zL25vZGVfbW9kdWxlcy9waW5vLXByZXR0eS9saWIvdXRpbHMvcHJldHRpZnktbGV2ZWwuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL3ByZXR0aWZ5LW1lc3NhZ2UuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvbGliL3V0aWxzL3ByZXR0aWZ5LW1ldGFkYXRhLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi91dGlscy9wcmV0dGlmeS10aW1lLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi91dGlscy9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vc2VjdXJlLWpzb24tcGFyc2VANC4xLjAvbm9kZV9tb2R1bGVzL3NlY3VyZS1qc29uLXBhcnNlL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXByZXR0eUAxMy4xLjMvbm9kZV9tb2R1bGVzL3Bpbm8tcHJldHR5L2xpYi9wcmV0dHkuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tcHJldHR5QDEzLjEuMy9ub2RlX21vZHVsZXMvcGluby1wcmV0dHkvaW5kZXguanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIHR0eSA9IHJlcXVpcmUoJ3R0eScpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcE5hbWVzcGFjZShlKSB7XG4gIGlmIChlICYmIGUuX19lc01vZHVsZSkgcmV0dXJuIGU7XG4gIHZhciBuID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgaWYgKGUpIHtcbiAgICBPYmplY3Qua2V5cyhlKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAoayAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgIHZhciBkID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlLCBrKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sIGssIGQuZ2V0ID8gZCA6IHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZVtrXTsgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBuW1wiZGVmYXVsdFwiXSA9IGU7XG4gIHJldHVybiBPYmplY3QuZnJlZXplKG4pO1xufVxuXG52YXIgdHR5X19uYW1lc3BhY2UgPSAvKiNfX1BVUkVfXyovX2ludGVyb3BOYW1lc3BhY2UodHR5KTtcblxuY29uc3Qge1xuICBlbnYgPSB7fSxcbiAgYXJndiA9IFtdLFxuICBwbGF0Zm9ybSA9IFwiXCIsXG59ID0gdHlwZW9mIHByb2Nlc3MgPT09IFwidW5kZWZpbmVkXCIgPyB7fSA6IHByb2Nlc3M7XG5cbmNvbnN0IGlzRGlzYWJsZWQgPSBcIk5PX0NPTE9SXCIgaW4gZW52IHx8IGFyZ3YuaW5jbHVkZXMoXCItLW5vLWNvbG9yXCIpO1xuY29uc3QgaXNGb3JjZWQgPSBcIkZPUkNFX0NPTE9SXCIgaW4gZW52IHx8IGFyZ3YuaW5jbHVkZXMoXCItLWNvbG9yXCIpO1xuY29uc3QgaXNXaW5kb3dzID0gcGxhdGZvcm0gPT09IFwid2luMzJcIjtcbmNvbnN0IGlzRHVtYlRlcm1pbmFsID0gZW52LlRFUk0gPT09IFwiZHVtYlwiO1xuXG5jb25zdCBpc0NvbXBhdGlibGVUZXJtaW5hbCA9XG4gIHR0eV9fbmFtZXNwYWNlICYmIHR0eV9fbmFtZXNwYWNlLmlzYXR0eSAmJiB0dHlfX25hbWVzcGFjZS5pc2F0dHkoMSkgJiYgZW52LlRFUk0gJiYgIWlzRHVtYlRlcm1pbmFsO1xuXG5jb25zdCBpc0NJID1cbiAgXCJDSVwiIGluIGVudiAmJlxuICAoXCJHSVRIVUJfQUNUSU9OU1wiIGluIGVudiB8fCBcIkdJVExBQl9DSVwiIGluIGVudiB8fCBcIkNJUkNMRUNJXCIgaW4gZW52KTtcblxuY29uc3QgaXNDb2xvclN1cHBvcnRlZCA9XG4gICFpc0Rpc2FibGVkICYmXG4gIChpc0ZvcmNlZCB8fCAoaXNXaW5kb3dzICYmICFpc0R1bWJUZXJtaW5hbCkgfHwgaXNDb21wYXRpYmxlVGVybWluYWwgfHwgaXNDSSk7XG5cbmNvbnN0IHJlcGxhY2VDbG9zZSA9IChcbiAgaW5kZXgsXG4gIHN0cmluZyxcbiAgY2xvc2UsXG4gIHJlcGxhY2UsXG4gIGhlYWQgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIGluZGV4KSArIHJlcGxhY2UsXG4gIHRhaWwgPSBzdHJpbmcuc3Vic3RyaW5nKGluZGV4ICsgY2xvc2UubGVuZ3RoKSxcbiAgbmV4dCA9IHRhaWwuaW5kZXhPZihjbG9zZSlcbikgPT4gaGVhZCArIChuZXh0IDwgMCA/IHRhaWwgOiByZXBsYWNlQ2xvc2UobmV4dCwgdGFpbCwgY2xvc2UsIHJlcGxhY2UpKTtcblxuY29uc3QgY2xlYXJCbGVlZCA9IChpbmRleCwgc3RyaW5nLCBvcGVuLCBjbG9zZSwgcmVwbGFjZSkgPT5cbiAgaW5kZXggPCAwXG4gICAgPyBvcGVuICsgc3RyaW5nICsgY2xvc2VcbiAgICA6IG9wZW4gKyByZXBsYWNlQ2xvc2UoaW5kZXgsIHN0cmluZywgY2xvc2UsIHJlcGxhY2UpICsgY2xvc2U7XG5cbmNvbnN0IGZpbHRlckVtcHR5ID1cbiAgKG9wZW4sIGNsb3NlLCByZXBsYWNlID0gb3BlbiwgYXQgPSBvcGVuLmxlbmd0aCArIDEpID0+XG4gIChzdHJpbmcpID0+XG4gICAgc3RyaW5nIHx8ICEoc3RyaW5nID09PSBcIlwiIHx8IHN0cmluZyA9PT0gdW5kZWZpbmVkKVxuICAgICAgPyBjbGVhckJsZWVkKFxuICAgICAgICAgIChcIlwiICsgc3RyaW5nKS5pbmRleE9mKGNsb3NlLCBhdCksXG4gICAgICAgICAgc3RyaW5nLFxuICAgICAgICAgIG9wZW4sXG4gICAgICAgICAgY2xvc2UsXG4gICAgICAgICAgcmVwbGFjZVxuICAgICAgICApXG4gICAgICA6IFwiXCI7XG5cbmNvbnN0IGluaXQgPSAob3BlbiwgY2xvc2UsIHJlcGxhY2UpID0+XG4gIGZpbHRlckVtcHR5KGBcXHgxYlske29wZW59bWAsIGBcXHgxYlske2Nsb3NlfW1gLCByZXBsYWNlKTtcblxuY29uc3QgY29sb3JzID0ge1xuICByZXNldDogaW5pdCgwLCAwKSxcbiAgYm9sZDogaW5pdCgxLCAyMiwgXCJcXHgxYlsyMm1cXHgxYlsxbVwiKSxcbiAgZGltOiBpbml0KDIsIDIyLCBcIlxceDFiWzIybVxceDFiWzJtXCIpLFxuICBpdGFsaWM6IGluaXQoMywgMjMpLFxuICB1bmRlcmxpbmU6IGluaXQoNCwgMjQpLFxuICBpbnZlcnNlOiBpbml0KDcsIDI3KSxcbiAgaGlkZGVuOiBpbml0KDgsIDI4KSxcbiAgc3RyaWtldGhyb3VnaDogaW5pdCg5LCAyOSksXG4gIGJsYWNrOiBpbml0KDMwLCAzOSksXG4gIHJlZDogaW5pdCgzMSwgMzkpLFxuICBncmVlbjogaW5pdCgzMiwgMzkpLFxuICB5ZWxsb3c6IGluaXQoMzMsIDM5KSxcbiAgYmx1ZTogaW5pdCgzNCwgMzkpLFxuICBtYWdlbnRhOiBpbml0KDM1LCAzOSksXG4gIGN5YW46IGluaXQoMzYsIDM5KSxcbiAgd2hpdGU6IGluaXQoMzcsIDM5KSxcbiAgZ3JheTogaW5pdCg5MCwgMzkpLFxuICBiZ0JsYWNrOiBpbml0KDQwLCA0OSksXG4gIGJnUmVkOiBpbml0KDQxLCA0OSksXG4gIGJnR3JlZW46IGluaXQoNDIsIDQ5KSxcbiAgYmdZZWxsb3c6IGluaXQoNDMsIDQ5KSxcbiAgYmdCbHVlOiBpbml0KDQ0LCA0OSksXG4gIGJnTWFnZW50YTogaW5pdCg0NSwgNDkpLFxuICBiZ0N5YW46IGluaXQoNDYsIDQ5KSxcbiAgYmdXaGl0ZTogaW5pdCg0NywgNDkpLFxuICBibGFja0JyaWdodDogaW5pdCg5MCwgMzkpLFxuICByZWRCcmlnaHQ6IGluaXQoOTEsIDM5KSxcbiAgZ3JlZW5CcmlnaHQ6IGluaXQoOTIsIDM5KSxcbiAgeWVsbG93QnJpZ2h0OiBpbml0KDkzLCAzOSksXG4gIGJsdWVCcmlnaHQ6IGluaXQoOTQsIDM5KSxcbiAgbWFnZW50YUJyaWdodDogaW5pdCg5NSwgMzkpLFxuICBjeWFuQnJpZ2h0OiBpbml0KDk2LCAzOSksXG4gIHdoaXRlQnJpZ2h0OiBpbml0KDk3LCAzOSksXG4gIGJnQmxhY2tCcmlnaHQ6IGluaXQoMTAwLCA0OSksXG4gIGJnUmVkQnJpZ2h0OiBpbml0KDEwMSwgNDkpLFxuICBiZ0dyZWVuQnJpZ2h0OiBpbml0KDEwMiwgNDkpLFxuICBiZ1llbGxvd0JyaWdodDogaW5pdCgxMDMsIDQ5KSxcbiAgYmdCbHVlQnJpZ2h0OiBpbml0KDEwNCwgNDkpLFxuICBiZ01hZ2VudGFCcmlnaHQ6IGluaXQoMTA1LCA0OSksXG4gIGJnQ3lhbkJyaWdodDogaW5pdCgxMDYsIDQ5KSxcbiAgYmdXaGl0ZUJyaWdodDogaW5pdCgxMDcsIDQ5KSxcbn07XG5cbmNvbnN0IGNyZWF0ZUNvbG9ycyA9ICh7IHVzZUNvbG9yID0gaXNDb2xvclN1cHBvcnRlZCB9ID0ge30pID0+XG4gIHVzZUNvbG9yXG4gICAgPyBjb2xvcnNcbiAgICA6IE9iamVjdC5rZXlzKGNvbG9ycykucmVkdWNlKFxuICAgICAgICAoY29sb3JzLCBrZXkpID0+ICh7IC4uLmNvbG9ycywgW2tleV06IFN0cmluZyB9KSxcbiAgICAgICAge31cbiAgICAgICk7XG5cbmNvbnN0IHtcbiAgcmVzZXQsXG4gIGJvbGQsXG4gIGRpbSxcbiAgaXRhbGljLFxuICB1bmRlcmxpbmUsXG4gIGludmVyc2UsXG4gIGhpZGRlbixcbiAgc3RyaWtldGhyb3VnaCxcbiAgYmxhY2ssXG4gIHJlZCxcbiAgZ3JlZW4sXG4gIHllbGxvdyxcbiAgYmx1ZSxcbiAgbWFnZW50YSxcbiAgY3lhbixcbiAgd2hpdGUsXG4gIGdyYXksXG4gIGJnQmxhY2ssXG4gIGJnUmVkLFxuICBiZ0dyZWVuLFxuICBiZ1llbGxvdyxcbiAgYmdCbHVlLFxuICBiZ01hZ2VudGEsXG4gIGJnQ3lhbixcbiAgYmdXaGl0ZSxcbiAgYmxhY2tCcmlnaHQsXG4gIHJlZEJyaWdodCxcbiAgZ3JlZW5CcmlnaHQsXG4gIHllbGxvd0JyaWdodCxcbiAgYmx1ZUJyaWdodCxcbiAgbWFnZW50YUJyaWdodCxcbiAgY3lhbkJyaWdodCxcbiAgd2hpdGVCcmlnaHQsXG4gIGJnQmxhY2tCcmlnaHQsXG4gIGJnUmVkQnJpZ2h0LFxuICBiZ0dyZWVuQnJpZ2h0LFxuICBiZ1llbGxvd0JyaWdodCxcbiAgYmdCbHVlQnJpZ2h0LFxuICBiZ01hZ2VudGFCcmlnaHQsXG4gIGJnQ3lhbkJyaWdodCxcbiAgYmdXaGl0ZUJyaWdodCxcbn0gPSBjcmVhdGVDb2xvcnMoKTtcblxuZXhwb3J0cy5iZ0JsYWNrID0gYmdCbGFjaztcbmV4cG9ydHMuYmdCbGFja0JyaWdodCA9IGJnQmxhY2tCcmlnaHQ7XG5leHBvcnRzLmJnQmx1ZSA9IGJnQmx1ZTtcbmV4cG9ydHMuYmdCbHVlQnJpZ2h0ID0gYmdCbHVlQnJpZ2h0O1xuZXhwb3J0cy5iZ0N5YW4gPSBiZ0N5YW47XG5leHBvcnRzLmJnQ3lhbkJyaWdodCA9IGJnQ3lhbkJyaWdodDtcbmV4cG9ydHMuYmdHcmVlbiA9IGJnR3JlZW47XG5leHBvcnRzLmJnR3JlZW5CcmlnaHQgPSBiZ0dyZWVuQnJpZ2h0O1xuZXhwb3J0cy5iZ01hZ2VudGEgPSBiZ01hZ2VudGE7XG5leHBvcnRzLmJnTWFnZW50YUJyaWdodCA9IGJnTWFnZW50YUJyaWdodDtcbmV4cG9ydHMuYmdSZWQgPSBiZ1JlZDtcbmV4cG9ydHMuYmdSZWRCcmlnaHQgPSBiZ1JlZEJyaWdodDtcbmV4cG9ydHMuYmdXaGl0ZSA9IGJnV2hpdGU7XG5leHBvcnRzLmJnV2hpdGVCcmlnaHQgPSBiZ1doaXRlQnJpZ2h0O1xuZXhwb3J0cy5iZ1llbGxvdyA9IGJnWWVsbG93O1xuZXhwb3J0cy5iZ1llbGxvd0JyaWdodCA9IGJnWWVsbG93QnJpZ2h0O1xuZXhwb3J0cy5ibGFjayA9IGJsYWNrO1xuZXhwb3J0cy5ibGFja0JyaWdodCA9IGJsYWNrQnJpZ2h0O1xuZXhwb3J0cy5ibHVlID0gYmx1ZTtcbmV4cG9ydHMuYmx1ZUJyaWdodCA9IGJsdWVCcmlnaHQ7XG5leHBvcnRzLmJvbGQgPSBib2xkO1xuZXhwb3J0cy5jcmVhdGVDb2xvcnMgPSBjcmVhdGVDb2xvcnM7XG5leHBvcnRzLmN5YW4gPSBjeWFuO1xuZXhwb3J0cy5jeWFuQnJpZ2h0ID0gY3lhbkJyaWdodDtcbmV4cG9ydHMuZGltID0gZGltO1xuZXhwb3J0cy5ncmF5ID0gZ3JheTtcbmV4cG9ydHMuZ3JlZW4gPSBncmVlbjtcbmV4cG9ydHMuZ3JlZW5CcmlnaHQgPSBncmVlbkJyaWdodDtcbmV4cG9ydHMuaGlkZGVuID0gaGlkZGVuO1xuZXhwb3J0cy5pbnZlcnNlID0gaW52ZXJzZTtcbmV4cG9ydHMuaXNDb2xvclN1cHBvcnRlZCA9IGlzQ29sb3JTdXBwb3J0ZWQ7XG5leHBvcnRzLml0YWxpYyA9IGl0YWxpYztcbmV4cG9ydHMubWFnZW50YSA9IG1hZ2VudGE7XG5leHBvcnRzLm1hZ2VudGFCcmlnaHQgPSBtYWdlbnRhQnJpZ2h0O1xuZXhwb3J0cy5yZWQgPSByZWQ7XG5leHBvcnRzLnJlZEJyaWdodCA9IHJlZEJyaWdodDtcbmV4cG9ydHMucmVzZXQgPSByZXNldDtcbmV4cG9ydHMuc3RyaWtldGhyb3VnaCA9IHN0cmlrZXRocm91Z2g7XG5leHBvcnRzLnVuZGVybGluZSA9IHVuZGVybGluZTtcbmV4cG9ydHMud2hpdGUgPSB3aGl0ZTtcbmV4cG9ydHMud2hpdGVCcmlnaHQgPSB3aGl0ZUJyaWdodDtcbmV4cG9ydHMueWVsbG93ID0geWVsbG93O1xuZXhwb3J0cy55ZWxsb3dCcmlnaHQgPSB5ZWxsb3dCcmlnaHQ7XG4iLCAiLy8gUmV0dXJucyBhIHdyYXBwZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgd3JhcHBlZCBjYWxsYmFja1xuLy8gVGhlIHdyYXBwZXIgZnVuY3Rpb24gc2hvdWxkIGRvIHNvbWUgc3R1ZmYsIGFuZCByZXR1cm4gYVxuLy8gcHJlc3VtYWJseSBkaWZmZXJlbnQgY2FsbGJhY2sgZnVuY3Rpb24uXG4vLyBUaGlzIG1ha2VzIHN1cmUgdGhhdCBvd24gcHJvcGVydGllcyBhcmUgcmV0YWluZWQsIHNvIHRoYXRcbi8vIGRlY29yYXRpb25zIGFuZCBzdWNoIGFyZSBub3QgbG9zdCBhbG9uZyB0aGUgd2F5LlxubW9kdWxlLmV4cG9ydHMgPSB3cmFwcHlcbmZ1bmN0aW9uIHdyYXBweSAoZm4sIGNiKSB7XG4gIGlmIChmbiAmJiBjYikgcmV0dXJuIHdyYXBweShmbikoY2IpXG5cbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJylcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCduZWVkIHdyYXBwZXIgZnVuY3Rpb24nKVxuXG4gIE9iamVjdC5rZXlzKGZuKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgd3JhcHBlcltrXSA9IGZuW2tdXG4gIH0pXG5cbiAgcmV0dXJuIHdyYXBwZXJcblxuICBmdW5jdGlvbiB3cmFwcGVyKCkge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldXG4gICAgfVxuICAgIHZhciByZXQgPSBmbi5hcHBseSh0aGlzLCBhcmdzKVxuICAgIHZhciBjYiA9IGFyZ3NbYXJncy5sZW5ndGgtMV1cbiAgICBpZiAodHlwZW9mIHJldCA9PT0gJ2Z1bmN0aW9uJyAmJiByZXQgIT09IGNiKSB7XG4gICAgICBPYmplY3Qua2V5cyhjYikuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICByZXRba10gPSBjYltrXVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHJldFxuICB9XG59XG4iLCAidmFyIHdyYXBweSA9IHJlcXVpcmUoJ3dyYXBweScpXG5tb2R1bGUuZXhwb3J0cyA9IHdyYXBweShvbmNlKVxubW9kdWxlLmV4cG9ydHMuc3RyaWN0ID0gd3JhcHB5KG9uY2VTdHJpY3QpXG5cbm9uY2UucHJvdG8gPSBvbmNlKGZ1bmN0aW9uICgpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEZ1bmN0aW9uLnByb3RvdHlwZSwgJ29uY2UnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBvbmNlKHRoaXMpXG4gICAgfSxcbiAgICBjb25maWd1cmFibGU6IHRydWVcbiAgfSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRnVuY3Rpb24ucHJvdG90eXBlLCAnb25jZVN0cmljdCcsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG9uY2VTdHJpY3QodGhpcylcbiAgICB9LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KVxufSlcblxuZnVuY3Rpb24gb25jZSAoZm4pIHtcbiAgdmFyIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGYuY2FsbGVkKSByZXR1cm4gZi52YWx1ZVxuICAgIGYuY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmLnZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIGYuY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZcbn1cblxuZnVuY3Rpb24gb25jZVN0cmljdCAoZm4pIHtcbiAgdmFyIGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGYuY2FsbGVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGYub25jZUVycm9yKVxuICAgIGYuY2FsbGVkID0gdHJ1ZVxuICAgIHJldHVybiBmLnZhbHVlID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG4gIHZhciBuYW1lID0gZm4ubmFtZSB8fCAnRnVuY3Rpb24gd3JhcHBlZCB3aXRoIGBvbmNlYCdcbiAgZi5vbmNlRXJyb3IgPSBuYW1lICsgXCIgc2hvdWxkbid0IGJlIGNhbGxlZCBtb3JlIHRoYW4gb25jZVwiXG4gIGYuY2FsbGVkID0gZmFsc2VcbiAgcmV0dXJuIGZcbn1cbiIsICJ2YXIgb25jZSA9IHJlcXVpcmUoJ29uY2UnKTtcblxudmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG52YXIgcW50ID0gZ2xvYmFsLkJhcmUgPyBxdWV1ZU1pY3JvdGFzayA6IHByb2Nlc3MubmV4dFRpY2suYmluZChwcm9jZXNzKTtcblxudmFyIGlzUmVxdWVzdCA9IGZ1bmN0aW9uKHN0cmVhbSkge1xuXHRyZXR1cm4gc3RyZWFtLnNldEhlYWRlciAmJiB0eXBlb2Ygc3RyZWFtLmFib3J0ID09PSAnZnVuY3Rpb24nO1xufTtcblxudmFyIGlzQ2hpbGRQcm9jZXNzID0gZnVuY3Rpb24oc3RyZWFtKSB7XG5cdHJldHVybiBzdHJlYW0uc3RkaW8gJiYgQXJyYXkuaXNBcnJheShzdHJlYW0uc3RkaW8pICYmIHN0cmVhbS5zdGRpby5sZW5ndGggPT09IDNcbn07XG5cbnZhciBlb3MgPSBmdW5jdGlvbihzdHJlYW0sIG9wdHMsIGNhbGxiYWNrKSB7XG5cdGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGVvcyhzdHJlYW0sIG51bGwsIG9wdHMpO1xuXHRpZiAoIW9wdHMpIG9wdHMgPSB7fTtcblxuXHRjYWxsYmFjayA9IG9uY2UoY2FsbGJhY2sgfHwgbm9vcCk7XG5cblx0dmFyIHdzID0gc3RyZWFtLl93cml0YWJsZVN0YXRlO1xuXHR2YXIgcnMgPSBzdHJlYW0uX3JlYWRhYmxlU3RhdGU7XG5cdHZhciByZWFkYWJsZSA9IG9wdHMucmVhZGFibGUgfHwgKG9wdHMucmVhZGFibGUgIT09IGZhbHNlICYmIHN0cmVhbS5yZWFkYWJsZSk7XG5cdHZhciB3cml0YWJsZSA9IG9wdHMud3JpdGFibGUgfHwgKG9wdHMud3JpdGFibGUgIT09IGZhbHNlICYmIHN0cmVhbS53cml0YWJsZSk7XG5cdHZhciBjYW5jZWxsZWQgPSBmYWxzZTtcblxuXHR2YXIgb25sZWdhY3lmaW5pc2ggPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIXN0cmVhbS53cml0YWJsZSkgb25maW5pc2goKTtcblx0fTtcblxuXHR2YXIgb25maW5pc2ggPSBmdW5jdGlvbigpIHtcblx0XHR3cml0YWJsZSA9IGZhbHNlO1xuXHRcdGlmICghcmVhZGFibGUpIGNhbGxiYWNrLmNhbGwoc3RyZWFtKTtcblx0fTtcblxuXHR2YXIgb25lbmQgPSBmdW5jdGlvbigpIHtcblx0XHRyZWFkYWJsZSA9IGZhbHNlO1xuXHRcdGlmICghd3JpdGFibGUpIGNhbGxiYWNrLmNhbGwoc3RyZWFtKTtcblx0fTtcblxuXHR2YXIgb25leGl0ID0gZnVuY3Rpb24oZXhpdENvZGUpIHtcblx0XHRjYWxsYmFjay5jYWxsKHN0cmVhbSwgZXhpdENvZGUgPyBuZXcgRXJyb3IoJ2V4aXRlZCB3aXRoIGVycm9yIGNvZGU6ICcgKyBleGl0Q29kZSkgOiBudWxsKTtcblx0fTtcblxuXHR2YXIgb25lcnJvciA9IGZ1bmN0aW9uKGVycikge1xuXHRcdGNhbGxiYWNrLmNhbGwoc3RyZWFtLCBlcnIpO1xuXHR9O1xuXG5cdHZhciBvbmNsb3NlID0gZnVuY3Rpb24oKSB7XG5cdFx0cW50KG9uY2xvc2VuZXh0dGljayk7XG5cdH07XG5cblx0dmFyIG9uY2xvc2VuZXh0dGljayA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChjYW5jZWxsZWQpIHJldHVybjtcblx0XHRpZiAocmVhZGFibGUgJiYgIShycyAmJiAocnMuZW5kZWQgJiYgIXJzLmRlc3Ryb3llZCkpKSByZXR1cm4gY2FsbGJhY2suY2FsbChzdHJlYW0sIG5ldyBFcnJvcigncHJlbWF0dXJlIGNsb3NlJykpO1xuXHRcdGlmICh3cml0YWJsZSAmJiAhKHdzICYmICh3cy5lbmRlZCAmJiAhd3MuZGVzdHJveWVkKSkpIHJldHVybiBjYWxsYmFjay5jYWxsKHN0cmVhbSwgbmV3IEVycm9yKCdwcmVtYXR1cmUgY2xvc2UnKSk7XG5cdH07XG5cblx0dmFyIG9ucmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdHN0cmVhbS5yZXEub24oJ2ZpbmlzaCcsIG9uZmluaXNoKTtcblx0fTtcblxuXHRpZiAoaXNSZXF1ZXN0KHN0cmVhbSkpIHtcblx0XHRzdHJlYW0ub24oJ2NvbXBsZXRlJywgb25maW5pc2gpO1xuXHRcdHN0cmVhbS5vbignYWJvcnQnLCBvbmNsb3NlKTtcblx0XHRpZiAoc3RyZWFtLnJlcSkgb25yZXF1ZXN0KCk7XG5cdFx0ZWxzZSBzdHJlYW0ub24oJ3JlcXVlc3QnLCBvbnJlcXVlc3QpO1xuXHR9IGVsc2UgaWYgKHdyaXRhYmxlICYmICF3cykgeyAvLyBsZWdhY3kgc3RyZWFtc1xuXHRcdHN0cmVhbS5vbignZW5kJywgb25sZWdhY3lmaW5pc2gpO1xuXHRcdHN0cmVhbS5vbignY2xvc2UnLCBvbmxlZ2FjeWZpbmlzaCk7XG5cdH1cblxuXHRpZiAoaXNDaGlsZFByb2Nlc3Moc3RyZWFtKSkgc3RyZWFtLm9uKCdleGl0Jywgb25leGl0KTtcblxuXHRzdHJlYW0ub24oJ2VuZCcsIG9uZW5kKTtcblx0c3RyZWFtLm9uKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cdGlmIChvcHRzLmVycm9yICE9PSBmYWxzZSkgc3RyZWFtLm9uKCdlcnJvcicsIG9uZXJyb3IpO1xuXHRzdHJlYW0ub24oJ2Nsb3NlJywgb25jbG9zZSk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdGNhbmNlbGxlZCA9IHRydWU7XG5cdFx0c3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjb21wbGV0ZScsIG9uZmluaXNoKTtcblx0XHRzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2Fib3J0Jywgb25jbG9zZSk7XG5cdFx0c3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdyZXF1ZXN0Jywgb25yZXF1ZXN0KTtcblx0XHRpZiAoc3RyZWFtLnJlcSkgc3RyZWFtLnJlcS5yZW1vdmVMaXN0ZW5lcignZmluaXNoJywgb25maW5pc2gpO1xuXHRcdHN0cmVhbS5yZW1vdmVMaXN0ZW5lcignZW5kJywgb25sZWdhY3lmaW5pc2gpO1xuXHRcdHN0cmVhbS5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBvbmxlZ2FjeWZpbmlzaCk7XG5cdFx0c3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdmaW5pc2gnLCBvbmZpbmlzaCk7XG5cdFx0c3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdleGl0Jywgb25leGl0KTtcblx0XHRzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2VuZCcsIG9uZW5kKTtcblx0XHRzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25lcnJvcik7XG5cdFx0c3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdjbG9zZScsIG9uY2xvc2UpO1xuXHR9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlb3M7XG4iLCAidmFyIG9uY2UgPSByZXF1aXJlKCdvbmNlJylcbnZhciBlb3MgPSByZXF1aXJlKCdlbmQtb2Ytc3RyZWFtJylcbnZhciBmc1xuXG50cnkge1xuICBmcyA9IHJlcXVpcmUoJ2ZzJykgLy8gd2Ugb25seSBuZWVkIGZzIHRvIGdldCB0aGUgUmVhZFN0cmVhbSBhbmQgV3JpdGVTdHJlYW0gcHJvdG90eXBlc1xufSBjYXRjaCAoZSkge31cblxudmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7fVxudmFyIGFuY2llbnQgPSB0eXBlb2YgcHJvY2VzcyA9PT0gJ3VuZGVmaW5lZCcgPyBmYWxzZSA6IC9edj9cXC4wLy50ZXN0KHByb2Nlc3MudmVyc2lvbilcblxudmFyIGlzRm4gPSBmdW5jdGlvbiAoZm4pIHtcbiAgcmV0dXJuIHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJ1xufVxuXG52YXIgaXNGUyA9IGZ1bmN0aW9uIChzdHJlYW0pIHtcbiAgaWYgKCFhbmNpZW50KSByZXR1cm4gZmFsc2UgLy8gbmV3ZXIgbm9kZSB2ZXJzaW9uIGRvIG5vdCBuZWVkIHRvIGNhcmUgYWJvdXQgZnMgaXMgYSBzcGVjaWFsIHdheVxuICBpZiAoIWZzKSByZXR1cm4gZmFsc2UgLy8gYnJvd3NlclxuICByZXR1cm4gKHN0cmVhbSBpbnN0YW5jZW9mIChmcy5SZWFkU3RyZWFtIHx8IG5vb3ApIHx8IHN0cmVhbSBpbnN0YW5jZW9mIChmcy5Xcml0ZVN0cmVhbSB8fCBub29wKSkgJiYgaXNGbihzdHJlYW0uY2xvc2UpXG59XG5cbnZhciBpc1JlcXVlc3QgPSBmdW5jdGlvbiAoc3RyZWFtKSB7XG4gIHJldHVybiBzdHJlYW0uc2V0SGVhZGVyICYmIGlzRm4oc3RyZWFtLmFib3J0KVxufVxuXG52YXIgZGVzdHJveWVyID0gZnVuY3Rpb24gKHN0cmVhbSwgcmVhZGluZywgd3JpdGluZywgY2FsbGJhY2spIHtcbiAgY2FsbGJhY2sgPSBvbmNlKGNhbGxiYWNrKVxuXG4gIHZhciBjbG9zZWQgPSBmYWxzZVxuICBzdHJlYW0ub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgIGNsb3NlZCA9IHRydWVcbiAgfSlcblxuICBlb3Moc3RyZWFtLCB7cmVhZGFibGU6IHJlYWRpbmcsIHdyaXRhYmxlOiB3cml0aW5nfSwgZnVuY3Rpb24gKGVycikge1xuICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIpXG4gICAgY2xvc2VkID0gdHJ1ZVxuICAgIGNhbGxiYWNrKClcbiAgfSlcblxuICB2YXIgZGVzdHJveWVkID0gZmFsc2VcbiAgcmV0dXJuIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBpZiAoY2xvc2VkKSByZXR1cm5cbiAgICBpZiAoZGVzdHJveWVkKSByZXR1cm5cbiAgICBkZXN0cm95ZWQgPSB0cnVlXG5cbiAgICBpZiAoaXNGUyhzdHJlYW0pKSByZXR1cm4gc3RyZWFtLmNsb3NlKG5vb3ApIC8vIHVzZSBjbG9zZSBmb3IgZnMgc3RyZWFtcyB0byBhdm9pZCBmZCBsZWFrc1xuICAgIGlmIChpc1JlcXVlc3Qoc3RyZWFtKSkgcmV0dXJuIHN0cmVhbS5hYm9ydCgpIC8vIHJlcXVlc3QuZGVzdHJveSBqdXN0IGRvIC5lbmQgLSAuYWJvcnQgaXMgd2hhdCB3ZSB3YW50XG5cbiAgICBpZiAoaXNGbihzdHJlYW0uZGVzdHJveSkpIHJldHVybiBzdHJlYW0uZGVzdHJveSgpXG5cbiAgICBjYWxsYmFjayhlcnIgfHwgbmV3IEVycm9yKCdzdHJlYW0gd2FzIGRlc3Ryb3llZCcpKVxuICB9XG59XG5cbnZhciBjYWxsID0gZnVuY3Rpb24gKGZuKSB7XG4gIGZuKClcbn1cblxudmFyIHBpcGUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgcmV0dXJuIGZyb20ucGlwZSh0bylcbn1cblxudmFyIHB1bXAgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdHJlYW1zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICB2YXIgY2FsbGJhY2sgPSBpc0ZuKHN0cmVhbXNbc3RyZWFtcy5sZW5ndGggLSAxXSB8fCBub29wKSAmJiBzdHJlYW1zLnBvcCgpIHx8IG5vb3BcblxuICBpZiAoQXJyYXkuaXNBcnJheShzdHJlYW1zWzBdKSkgc3RyZWFtcyA9IHN0cmVhbXNbMF1cbiAgaWYgKHN0cmVhbXMubGVuZ3RoIDwgMikgdGhyb3cgbmV3IEVycm9yKCdwdW1wIHJlcXVpcmVzIHR3byBzdHJlYW1zIHBlciBtaW5pbXVtJylcblxuICB2YXIgZXJyb3JcbiAgdmFyIGRlc3Ryb3lzID0gc3RyZWFtcy5tYXAoZnVuY3Rpb24gKHN0cmVhbSwgaSkge1xuICAgIHZhciByZWFkaW5nID0gaSA8IHN0cmVhbXMubGVuZ3RoIC0gMVxuICAgIHZhciB3cml0aW5nID0gaSA+IDBcbiAgICByZXR1cm4gZGVzdHJveWVyKHN0cmVhbSwgcmVhZGluZywgd3JpdGluZywgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKCFlcnJvcikgZXJyb3IgPSBlcnJcbiAgICAgIGlmIChlcnIpIGRlc3Ryb3lzLmZvckVhY2goY2FsbClcbiAgICAgIGlmIChyZWFkaW5nKSByZXR1cm5cbiAgICAgIGRlc3Ryb3lzLmZvckVhY2goY2FsbClcbiAgICAgIGNhbGxiYWNrKGVycm9yKVxuICAgIH0pXG4gIH0pXG5cbiAgcmV0dXJuIHN0cmVhbXMucmVkdWNlKHBpcGUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVtcFxuIiwgIi8qXG5Db3B5cmlnaHQgKGMpIDIwMTQtMjAyMSwgTWF0dGVvIENvbGxpbmEgPGhlbGxvQG1hdHRlb2NvbGxpbmEuY29tPlxuXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcbnB1cnBvc2Ugd2l0aCBvciB3aXRob3V0IGZlZSBpcyBoZXJlYnkgZ3JhbnRlZCwgcHJvdmlkZWQgdGhhdCB0aGUgYWJvdmVcbmNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2UgYXBwZWFyIGluIGFsbCBjb3BpZXMuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIgQU5EIFRIRSBBVVRIT1IgRElTQ0xBSU1TIEFMTCBXQVJSQU5USUVTXG5XSVRIIFJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GXG5NRVJDSEFOVEFCSUxJVFkgQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUlxuQU5ZIFNQRUNJQUwsIERJUkVDVCwgSU5ESVJFQ1QsIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPUiBBTlkgREFNQUdFU1xuV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTSBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOXG5BQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1IgT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUlxuSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1IgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cbiovXG5cbid1c2Ugc3RyaWN0J1xuXG5jb25zdCB7IFRyYW5zZm9ybSB9ID0gcmVxdWlyZSgnc3RyZWFtJylcbmNvbnN0IHsgU3RyaW5nRGVjb2RlciB9ID0gcmVxdWlyZSgnc3RyaW5nX2RlY29kZXInKVxuY29uc3Qga0xhc3QgPSBTeW1ib2woJ2xhc3QnKVxuY29uc3Qga0RlY29kZXIgPSBTeW1ib2woJ2RlY29kZXInKVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm0gKGNodW5rLCBlbmMsIGNiKSB7XG4gIGxldCBsaXN0XG4gIGlmICh0aGlzLm92ZXJmbG93KSB7IC8vIExpbmUgYnVmZmVyIGlzIGZ1bGwuIFNraXAgdG8gc3RhcnQgb2YgbmV4dCBsaW5lLlxuICAgIGNvbnN0IGJ1ZiA9IHRoaXNba0RlY29kZXJdLndyaXRlKGNodW5rKVxuICAgIGxpc3QgPSBidWYuc3BsaXQodGhpcy5tYXRjaGVyKVxuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSByZXR1cm4gY2IoKSAvLyBMaW5lIGVuZGluZyBub3QgZm91bmQuIERpc2NhcmQgZW50aXJlIGNodW5rLlxuXG4gICAgLy8gTGluZSBlbmRpbmcgZm91bmQuIERpc2NhcmQgdHJhaWxpbmcgZnJhZ21lbnQgb2YgcHJldmlvdXMgbGluZSBhbmQgcmVzZXQgb3ZlcmZsb3cgc3RhdGUuXG4gICAgbGlzdC5zaGlmdCgpXG4gICAgdGhpcy5vdmVyZmxvdyA9IGZhbHNlXG4gIH0gZWxzZSB7XG4gICAgdGhpc1trTGFzdF0gKz0gdGhpc1trRGVjb2Rlcl0ud3JpdGUoY2h1bmspXG4gICAgbGlzdCA9IHRoaXNba0xhc3RdLnNwbGl0KHRoaXMubWF0Y2hlcilcbiAgfVxuXG4gIHRoaXNba0xhc3RdID0gbGlzdC5wb3AoKVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHRyeSB7XG4gICAgICBwdXNoKHRoaXMsIHRoaXMubWFwcGVyKGxpc3RbaV0pKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gY2IoZXJyb3IpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5vdmVyZmxvdyA9IHRoaXNba0xhc3RdLmxlbmd0aCA+IHRoaXMubWF4TGVuZ3RoXG4gIGlmICh0aGlzLm92ZXJmbG93ICYmICF0aGlzLnNraXBPdmVyZmxvdykge1xuICAgIGNiKG5ldyBFcnJvcignbWF4aW11bSBidWZmZXIgcmVhY2hlZCcpKVxuICAgIHJldHVyblxuICB9XG5cbiAgY2IoKVxufVxuXG5mdW5jdGlvbiBmbHVzaCAoY2IpIHtcbiAgLy8gZm9yd2FyZCBhbnkgZ2liYmVyaXNoIGxlZnQgaW4gdGhlcmVcbiAgdGhpc1trTGFzdF0gKz0gdGhpc1trRGVjb2Rlcl0uZW5kKClcblxuICBpZiAodGhpc1trTGFzdF0pIHtcbiAgICB0cnkge1xuICAgICAgcHVzaCh0aGlzLCB0aGlzLm1hcHBlcih0aGlzW2tMYXN0XSkpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBjYihlcnJvcilcbiAgICB9XG4gIH1cblxuICBjYigpXG59XG5cbmZ1bmN0aW9uIHB1c2ggKHNlbGYsIHZhbCkge1xuICBpZiAodmFsICE9PSB1bmRlZmluZWQpIHtcbiAgICBzZWxmLnB1c2godmFsKVxuICB9XG59XG5cbmZ1bmN0aW9uIG5vb3AgKGluY29taW5nKSB7XG4gIHJldHVybiBpbmNvbWluZ1xufVxuXG5mdW5jdGlvbiBzcGxpdCAobWF0Y2hlciwgbWFwcGVyLCBvcHRpb25zKSB7XG4gIC8vIFNldCBkZWZhdWx0cyBmb3IgYW55IGFyZ3VtZW50cyBub3Qgc3VwcGxpZWQuXG4gIG1hdGNoZXIgPSBtYXRjaGVyIHx8IC9cXHI/XFxuL1xuICBtYXBwZXIgPSBtYXBwZXIgfHwgbm9vcFxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIC8vIFRlc3QgYXJndW1lbnRzIGV4cGxpY2l0bHkuXG4gIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGNhc2UgMTpcbiAgICAgIC8vIElmIG1hcHBlciBpcyBvbmx5IGFyZ3VtZW50LlxuICAgICAgaWYgKHR5cGVvZiBtYXRjaGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIG1hcHBlciA9IG1hdGNoZXJcbiAgICAgICAgbWF0Y2hlciA9IC9cXHI/XFxuL1xuICAgICAgLy8gSWYgb3B0aW9ucyBpcyBvbmx5IGFyZ3VtZW50LlxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hlciA9PT0gJ29iamVjdCcgJiYgIShtYXRjaGVyIGluc3RhbmNlb2YgUmVnRXhwKSAmJiAhbWF0Y2hlcltTeW1ib2wuc3BsaXRdKSB7XG4gICAgICAgIG9wdGlvbnMgPSBtYXRjaGVyXG4gICAgICAgIG1hdGNoZXIgPSAvXFxyP1xcbi9cbiAgICAgIH1cbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIDI6XG4gICAgICAvLyBJZiBtYXBwZXIgYW5kIG9wdGlvbnMgYXJlIGFyZ3VtZW50cy5cbiAgICAgIGlmICh0eXBlb2YgbWF0Y2hlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvcHRpb25zID0gbWFwcGVyXG4gICAgICAgIG1hcHBlciA9IG1hdGNoZXJcbiAgICAgICAgbWF0Y2hlciA9IC9cXHI/XFxuL1xuICAgICAgLy8gSWYgbWF0Y2hlciBhbmQgb3B0aW9ucyBhcmUgYXJndW1lbnRzLlxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbWFwcGVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICBvcHRpb25zID0gbWFwcGVyXG4gICAgICAgIG1hcHBlciA9IG5vb3BcbiAgICAgIH1cbiAgfVxuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKVxuICBvcHRpb25zLmF1dG9EZXN0cm95ID0gdHJ1ZVxuICBvcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuICBvcHRpb25zLmZsdXNoID0gZmx1c2hcbiAgb3B0aW9ucy5yZWFkYWJsZU9iamVjdE1vZGUgPSB0cnVlXG5cbiAgY29uc3Qgc3RyZWFtID0gbmV3IFRyYW5zZm9ybShvcHRpb25zKVxuXG4gIHN0cmVhbVtrTGFzdF0gPSAnJ1xuICBzdHJlYW1ba0RlY29kZXJdID0gbmV3IFN0cmluZ0RlY29kZXIoJ3V0ZjgnKVxuICBzdHJlYW0ubWF0Y2hlciA9IG1hdGNoZXJcbiAgc3RyZWFtLm1hcHBlciA9IG1hcHBlclxuICBzdHJlYW0ubWF4TGVuZ3RoID0gb3B0aW9ucy5tYXhMZW5ndGhcbiAgc3RyZWFtLnNraXBPdmVyZmxvdyA9IG9wdGlvbnMuc2tpcE92ZXJmbG93IHx8IGZhbHNlXG4gIHN0cmVhbS5vdmVyZmxvdyA9IGZhbHNlXG4gIHN0cmVhbS5fZGVzdHJveSA9IGZ1bmN0aW9uIChlcnIsIGNiKSB7XG4gICAgLy8gV2VpcmQgTm9kZSB2MTIgYnVnIHRoYXQgd2UgbmVlZCB0byB3b3JrIGFyb3VuZFxuICAgIHRoaXMuX3dyaXRhYmxlU3RhdGUuZXJyb3JFbWl0dGVkID0gZmFsc2VcbiAgICBjYihlcnIpXG4gIH1cblxuICByZXR1cm4gc3RyZWFtXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3BsaXRcbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgbWV0YWRhdGEgPSBTeW1ib2wuZm9yKCdwaW5vLm1ldGFkYXRhJylcbmNvbnN0IHNwbGl0ID0gcmVxdWlyZSgnc3BsaXQyJylcbmNvbnN0IHsgRHVwbGV4IH0gPSByZXF1aXJlKCdzdHJlYW0nKVxuY29uc3QgeyBwYXJlbnRQb3J0LCB3b3JrZXJEYXRhIH0gPSByZXF1aXJlKCd3b3JrZXJfdGhyZWFkcycpXG5cbmZ1bmN0aW9uIGNyZWF0ZURlZmVycmVkICgpIHtcbiAgbGV0IHJlc29sdmVcbiAgbGV0IHJlamVjdFxuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKF9yZXNvbHZlLCBfcmVqZWN0KSA9PiB7XG4gICAgcmVzb2x2ZSA9IF9yZXNvbHZlXG4gICAgcmVqZWN0ID0gX3JlamVjdFxuICB9KVxuICBwcm9taXNlLnJlc29sdmUgPSByZXNvbHZlXG4gIHByb21pc2UucmVqZWN0ID0gcmVqZWN0XG4gIHJldHVybiBwcm9taXNlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGQgKGZuLCBvcHRzID0ge30pIHtcbiAgY29uc3Qgd2FpdEZvckNvbmZpZyA9IG9wdHMuZXhwZWN0UGlub0NvbmZpZyA9PT0gdHJ1ZSAmJiB3b3JrZXJEYXRhPy53b3JrZXJEYXRhPy5waW5vV2lsbFNlbmRDb25maWcgPT09IHRydWVcbiAgY29uc3QgcGFyc2VMaW5lcyA9IG9wdHMucGFyc2UgPT09ICdsaW5lcydcbiAgY29uc3QgcGFyc2VMaW5lID0gdHlwZW9mIG9wdHMucGFyc2VMaW5lID09PSAnZnVuY3Rpb24nID8gb3B0cy5wYXJzZUxpbmUgOiBKU09OLnBhcnNlXG4gIGNvbnN0IGNsb3NlID0gb3B0cy5jbG9zZSB8fCBkZWZhdWx0Q2xvc2VcbiAgY29uc3Qgc3RyZWFtID0gc3BsaXQoZnVuY3Rpb24gKGxpbmUpIHtcbiAgICBsZXQgdmFsdWVcblxuICAgIHRyeSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlTGluZShsaW5lKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmVtaXQoJ3Vua25vd24nLCBsaW5lLCBlcnJvcilcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5lbWl0KCd1bmtub3duJywgbGluZSwgJ051bGwgdmFsdWUgaWdub3JlZCcpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdmFsdWUgPSB7XG4gICAgICAgIGRhdGE6IHZhbHVlLFxuICAgICAgICB0aW1lOiBEYXRlLm5vdygpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0cmVhbVttZXRhZGF0YV0pIHtcbiAgICAgIHN0cmVhbS5sYXN0VGltZSA9IHZhbHVlLnRpbWVcbiAgICAgIHN0cmVhbS5sYXN0TGV2ZWwgPSB2YWx1ZS5sZXZlbFxuICAgICAgc3RyZWFtLmxhc3RPYmogPSB2YWx1ZVxuICAgIH1cblxuICAgIGlmIChwYXJzZUxpbmVzKSB7XG4gICAgICByZXR1cm4gbGluZVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9LCB7IGF1dG9EZXN0cm95OiB0cnVlIH0pXG5cbiAgc3RyZWFtLl9kZXN0cm95ID0gZnVuY3Rpb24gKGVyciwgY2IpIHtcbiAgICBjb25zdCBwcm9taXNlID0gY2xvc2UoZXJyLCBjYilcbiAgICBpZiAocHJvbWlzZSAmJiB0eXBlb2YgcHJvbWlzZS50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9taXNlLnRoZW4oY2IsIGNiKVxuICAgIH1cbiAgfVxuXG4gIGlmIChvcHRzLmV4cGVjdFBpbm9Db25maWcgPT09IHRydWUgJiYgd29ya2VyRGF0YT8ud29ya2VyRGF0YT8ucGlub1dpbGxTZW5kQ29uZmlnICE9PSB0cnVlKSB7XG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgIHN0cmVhbS5lbWl0KCdlcnJvcicsIG5ldyBFcnJvcignVGhpcyB0cmFuc3BvcnQgaXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgY3VycmVudCB2ZXJzaW9uIG9mIHBpbm8uIFBsZWFzZSB1cGdyYWRlIHBpbm8gdG8gdGhlIGxhdGVzdCB2ZXJzaW9uLicpKVxuICAgIH0pXG4gIH1cblxuICBpZiAob3B0cy5tZXRhZGF0YSAhPT0gZmFsc2UpIHtcbiAgICBzdHJlYW1bbWV0YWRhdGFdID0gdHJ1ZVxuICAgIHN0cmVhbS5sYXN0VGltZSA9IDBcbiAgICBzdHJlYW0ubGFzdExldmVsID0gMFxuICAgIHN0cmVhbS5sYXN0T2JqID0gbnVsbFxuICB9XG5cbiAgaWYgKHdhaXRGb3JDb25maWcpIHtcbiAgICBsZXQgcGlub0NvbmZpZyA9IHt9XG4gICAgY29uc3QgY29uZmlnUmVjZWl2ZWQgPSBjcmVhdGVEZWZlcnJlZCgpXG4gICAgcGFyZW50UG9ydC5vbignbWVzc2FnZScsIGZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UgKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLmNvZGUgPT09ICdQSU5PX0NPTkZJRycpIHtcbiAgICAgICAgcGlub0NvbmZpZyA9IG1lc3NhZ2UuY29uZmlnXG4gICAgICAgIGNvbmZpZ1JlY2VpdmVkLnJlc29sdmUoKVxuICAgICAgICBwYXJlbnRQb3J0Lm9mZignbWVzc2FnZScsIGhhbmRsZU1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHN0cmVhbSwge1xuICAgICAgbGV2ZWxzOiB7XG4gICAgICAgIGdldCAoKSB7IHJldHVybiBwaW5vQ29uZmlnLmxldmVscyB9XG4gICAgICB9LFxuICAgICAgbWVzc2FnZUtleToge1xuICAgICAgICBnZXQgKCkgeyByZXR1cm4gcGlub0NvbmZpZy5tZXNzYWdlS2V5IH1cbiAgICAgIH0sXG4gICAgICBlcnJvcktleToge1xuICAgICAgICBnZXQgKCkgeyByZXR1cm4gcGlub0NvbmZpZy5lcnJvcktleSB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBjb25maWdSZWNlaXZlZC50aGVuKGZpbmlzaClcbiAgfVxuXG4gIHJldHVybiBmaW5pc2goKVxuXG4gIGZ1bmN0aW9uIGZpbmlzaCAoKSB7XG4gICAgbGV0IHJlcyA9IGZuKHN0cmVhbSlcblxuICAgIGlmIChyZXMgJiYgdHlwZW9mIHJlcy5jYXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVzLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgc3RyZWFtLmRlc3Ryb3koZXJyKVxuICAgICAgfSlcblxuICAgICAgLy8gc2V0IGl0IHRvIG51bGwgdG8gbm90IHJldGFpbiBhIHJlZmVyZW5jZSB0byB0aGUgcHJvbWlzZVxuICAgICAgcmVzID0gbnVsbFxuICAgIH0gZWxzZSBpZiAob3B0cy5lbmFibGVQaXBlbGluaW5nICYmIHJlcykge1xuICAgICAgcmV0dXJuIER1cGxleC5mcm9tKHsgd3JpdGFibGU6IHN0cmVhbSwgcmVhZGFibGU6IHJlcyB9KVxuICAgIH1cblxuICAgIHJldHVybiBzdHJlYW1cbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q2xvc2UgKGVyciwgY2IpIHtcbiAgcHJvY2Vzcy5uZXh0VGljayhjYiwgZXJyKVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEEgc2V0IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaW5kaWNhdGUgdGhlIHZhbHVlIHJlcHJlc2VudHMgYW4gZXJyb3Igb2JqZWN0LlxuICpcbiAqIEB0eXBlZGVmIHtzdHJpbmdbXX0gS19FUlJPUl9MSUtFX0tFWVNcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgREFURV9GT1JNQVQ6ICd5eXl5LW1tLWRkIEhIOk1NOnNzLmwgbycsXG4gIERBVEVfRk9STUFUX1NJTVBMRTogJ0hIOk1NOnNzLmwnLFxuXG4gIC8qKlxuICAgKiBAdHlwZSB7S19FUlJPUl9MSUtFX0tFWVN9XG4gICAqL1xuICBFUlJPUl9MSUtFX0tFWVM6IFsnZXJyJywgJ2Vycm9yJ10sXG5cbiAgTUVTU0FHRV9LRVk6ICdtc2cnLFxuXG4gIExFVkVMX0tFWTogJ2xldmVsJyxcblxuICBMRVZFTF9MQUJFTDogJ2xldmVsTGFiZWwnLFxuXG4gIFRJTUVTVEFNUF9LRVk6ICd0aW1lJyxcblxuICBMRVZFTFM6IHtcbiAgICBkZWZhdWx0OiAnVVNFUkxWTCcsXG4gICAgNjA6ICdGQVRBTCcsXG4gICAgNTA6ICdFUlJPUicsXG4gICAgNDA6ICdXQVJOJyxcbiAgICAzMDogJ0lORk8nLFxuICAgIDIwOiAnREVCVUcnLFxuICAgIDEwOiAnVFJBQ0UnXG4gIH0sXG5cbiAgTEVWRUxfTkFNRVM6IHtcbiAgICBmYXRhbDogNjAsXG4gICAgZXJyb3I6IDUwLFxuICAgIHdhcm46IDQwLFxuICAgIGluZm86IDMwLFxuICAgIGRlYnVnOiAyMCxcbiAgICB0cmFjZTogMTBcbiAgfSxcblxuICAvLyBPYmplY3Qga2V5cyB0aGF0IHByb2JhYmx5IGNhbWUgZnJvbSBhIGxvZ2dlciBsaWtlIFBpbm8gb3IgQnVueWFuLlxuICBMT0dHRVJfS0VZUzogW1xuICAgICdwaWQnLFxuICAgICdob3N0bmFtZScsXG4gICAgJ25hbWUnLFxuICAgICdsZXZlbCcsXG4gICAgJ3RpbWUnLFxuICAgICd0aW1lc3RhbXAnLFxuICAgICdjYWxsZXInXG4gIF1cbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMZXZlbExhYmVsRGF0YVxuY29uc3QgeyBMRVZFTFMsIExFVkVMX05BTUVTIH0gPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKVxuXG4vKipcbiAqIEdpdmVuIGluaXRpYWwgc2V0dGluZ3MgZm9yIGN1c3RvbSBsZXZlbHMvbmFtZXMgYW5kIHVzZSBvZiBvbmx5IGN1c3RvbSBwcm9wc1xuICogZ2V0IHRoZSBsZXZlbCBsYWJlbCB0aGF0IGNvcnJlc3BvbmRzIHdpdGggYSBnaXZlbiBsZXZlbCBudW1iZXJcbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVzZU9ubHlDdXN0b21Qcm9wc1xuICogQHBhcmFtIHtvYmplY3R9IGN1c3RvbUxldmVsc1xuICogQHBhcmFtIHtvYmplY3R9IGN1c3RvbUxldmVsTmFtZXNcbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhIG51bWJlciBsZXZlbCBhbmQgcmV0dXJucyB0aGUgbGV2ZWwncyBsYWJlbCBzdHJpbmdcbiAqL1xuZnVuY3Rpb24gZ2V0TGV2ZWxMYWJlbERhdGEgKHVzZU9ubHlDdXN0b21Qcm9wcywgY3VzdG9tTGV2ZWxzLCBjdXN0b21MZXZlbE5hbWVzKSB7XG4gIGNvbnN0IGxldmVscyA9IHVzZU9ubHlDdXN0b21Qcm9wcyA/IGN1c3RvbUxldmVscyB8fCBMRVZFTFMgOiBPYmplY3QuYXNzaWduKHt9LCBMRVZFTFMsIGN1c3RvbUxldmVscylcbiAgY29uc3QgbGV2ZWxOYW1lcyA9IHVzZU9ubHlDdXN0b21Qcm9wcyA/IGN1c3RvbUxldmVsTmFtZXMgfHwgTEVWRUxfTkFNRVMgOiBPYmplY3QuYXNzaWduKHt9LCBMRVZFTF9OQU1FUywgY3VzdG9tTGV2ZWxOYW1lcylcbiAgcmV0dXJuIGZ1bmN0aW9uIChsZXZlbCkge1xuICAgIGxldCBsZXZlbE51bSA9ICdkZWZhdWx0J1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKCtsZXZlbCkpIHtcbiAgICAgIGxldmVsTnVtID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGxldmVscywgbGV2ZWwpID8gbGV2ZWwgOiBsZXZlbE51bVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXZlbE51bSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChsZXZlbE5hbWVzLCBsZXZlbC50b0xvd2VyQ2FzZSgpKSA/IGxldmVsTmFtZXNbbGV2ZWwudG9Mb3dlckNhc2UoKV0gOiBsZXZlbE51bVxuICAgIH1cblxuICAgIHJldHVybiBbbGV2ZWxzW2xldmVsTnVtXSwgbGV2ZWxOdW1dXG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3Qgbm9jb2xvciA9IGlucHV0ID0+IGlucHV0XG5jb25zdCBwbGFpbiA9IHtcbiAgZGVmYXVsdDogbm9jb2xvcixcbiAgNjA6IG5vY29sb3IsXG4gIDUwOiBub2NvbG9yLFxuICA0MDogbm9jb2xvcixcbiAgMzA6IG5vY29sb3IsXG4gIDIwOiBub2NvbG9yLFxuICAxMDogbm9jb2xvcixcbiAgbWVzc2FnZTogbm9jb2xvcixcbiAgZ3JleU1lc3NhZ2U6IG5vY29sb3IsXG4gIHByb3BlcnR5OiBub2NvbG9yXG59XG5cbmNvbnN0IHsgY3JlYXRlQ29sb3JzIH0gPSByZXF1aXJlKCdjb2xvcmV0dGUnKVxuY29uc3QgZ2V0TGV2ZWxMYWJlbERhdGEgPSByZXF1aXJlKCcuL3V0aWxzL2dldC1sZXZlbC1sYWJlbC1kYXRhJylcbmNvbnN0IGF2YWlsYWJsZUNvbG9ycyA9IGNyZWF0ZUNvbG9ycyh7IHVzZUNvbG9yOiB0cnVlIH0pXG5jb25zdCB7IHdoaXRlLCBiZ1JlZCwgcmVkLCB5ZWxsb3csIGdyZWVuLCBibHVlLCBncmF5LCBjeWFuLCBtYWdlbnRhIH0gPSBhdmFpbGFibGVDb2xvcnNcblxuY29uc3QgY29sb3JlZCA9IHtcbiAgZGVmYXVsdDogd2hpdGUsXG4gIDYwOiBiZ1JlZCxcbiAgNTA6IHJlZCxcbiAgNDA6IHllbGxvdyxcbiAgMzA6IGdyZWVuLFxuICAyMDogYmx1ZSxcbiAgMTA6IGdyYXksXG4gIG1lc3NhZ2U6IGN5YW4sXG4gIGdyZXlNZXNzYWdlOiBncmF5LFxuICBwcm9wZXJ0eTogbWFnZW50YVxufVxuXG5mdW5jdGlvbiByZXNvbHZlQ3VzdG9tQ29sb3JlZENvbG9yaXplciAoY3VzdG9tQ29sb3JzKSB7XG4gIHJldHVybiBjdXN0b21Db2xvcnMucmVkdWNlKFxuICAgIGZ1bmN0aW9uIChhZ2csIFtsZXZlbCwgY29sb3JdKSB7XG4gICAgICBhZ2dbbGV2ZWxdID0gdHlwZW9mIGF2YWlsYWJsZUNvbG9yc1tjb2xvcl0gPT09ICdmdW5jdGlvbicgPyBhdmFpbGFibGVDb2xvcnNbY29sb3JdIDogd2hpdGVcblxuICAgICAgcmV0dXJuIGFnZ1xuICAgIH0sXG4gICAgeyBkZWZhdWx0OiB3aGl0ZSwgbWVzc2FnZTogY3lhbiwgZ3JleU1lc3NhZ2U6IGdyYXksIHByb3BlcnR5OiBtYWdlbnRhIH1cbiAgKVxufVxuXG5mdW5jdGlvbiBjb2xvcml6ZUxldmVsICh1c2VPbmx5Q3VzdG9tUHJvcHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChsZXZlbCwgY29sb3JpemVyLCB7IGN1c3RvbUxldmVscywgY3VzdG9tTGV2ZWxOYW1lcyB9ID0ge30pIHtcbiAgICBjb25zdCBbbGV2ZWxTdHIsIGxldmVsTnVtXSA9IGdldExldmVsTGFiZWxEYXRhKHVzZU9ubHlDdXN0b21Qcm9wcywgY3VzdG9tTGV2ZWxzLCBjdXN0b21MZXZlbE5hbWVzKShsZXZlbClcblxuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY29sb3JpemVyLCBsZXZlbE51bSkgPyBjb2xvcml6ZXJbbGV2ZWxOdW1dKGxldmVsU3RyKSA6IGNvbG9yaXplci5kZWZhdWx0KGxldmVsU3RyKVxuICB9XG59XG5cbmZ1bmN0aW9uIHBsYWluQ29sb3JpemVyICh1c2VPbmx5Q3VzdG9tUHJvcHMpIHtcbiAgY29uc3QgbmV3UGxhaW5Db2xvcml6ZXIgPSBjb2xvcml6ZUxldmVsKHVzZU9ubHlDdXN0b21Qcm9wcylcbiAgY29uc3QgY3VzdG9tQ29sb3JlZENvbG9yaXplciA9IGZ1bmN0aW9uIChsZXZlbCwgb3B0cykge1xuICAgIHJldHVybiBuZXdQbGFpbkNvbG9yaXplcihsZXZlbCwgcGxhaW4sIG9wdHMpXG4gIH1cbiAgY3VzdG9tQ29sb3JlZENvbG9yaXplci5tZXNzYWdlID0gcGxhaW4ubWVzc2FnZVxuICBjdXN0b21Db2xvcmVkQ29sb3JpemVyLmdyZXlNZXNzYWdlID0gcGxhaW4uZ3JleU1lc3NhZ2VcbiAgY3VzdG9tQ29sb3JlZENvbG9yaXplci5wcm9wZXJ0eSA9IHBsYWluLnByb3BlcnR5XG4gIGN1c3RvbUNvbG9yZWRDb2xvcml6ZXIuY29sb3JzID0gY3JlYXRlQ29sb3JzKHsgdXNlQ29sb3I6IGZhbHNlIH0pXG4gIHJldHVybiBjdXN0b21Db2xvcmVkQ29sb3JpemVyXG59XG5cbmZ1bmN0aW9uIGNvbG9yZWRDb2xvcml6ZXIgKHVzZU9ubHlDdXN0b21Qcm9wcykge1xuICBjb25zdCBuZXdDb2xvcmVkQ29sb3JpemVyID0gY29sb3JpemVMZXZlbCh1c2VPbmx5Q3VzdG9tUHJvcHMpXG4gIGNvbnN0IGN1c3RvbUNvbG9yZWRDb2xvcml6ZXIgPSBmdW5jdGlvbiAobGV2ZWwsIG9wdHMpIHtcbiAgICByZXR1cm4gbmV3Q29sb3JlZENvbG9yaXplcihsZXZlbCwgY29sb3JlZCwgb3B0cylcbiAgfVxuICBjdXN0b21Db2xvcmVkQ29sb3JpemVyLm1lc3NhZ2UgPSBjb2xvcmVkLm1lc3NhZ2VcbiAgY3VzdG9tQ29sb3JlZENvbG9yaXplci5wcm9wZXJ0eSA9IGNvbG9yZWQucHJvcGVydHlcbiAgY3VzdG9tQ29sb3JlZENvbG9yaXplci5ncmV5TWVzc2FnZSA9IGNvbG9yZWQuZ3JleU1lc3NhZ2VcbiAgY3VzdG9tQ29sb3JlZENvbG9yaXplci5jb2xvcnMgPSBhdmFpbGFibGVDb2xvcnNcbiAgcmV0dXJuIGN1c3RvbUNvbG9yZWRDb2xvcml6ZXJcbn1cblxuZnVuY3Rpb24gY3VzdG9tQ29sb3JlZENvbG9yaXplckZhY3RvcnkgKGN1c3RvbUNvbG9ycywgdXNlT25seUN1c3RvbVByb3BzKSB7XG4gIGNvbnN0IG9ubHlDdXN0b21Db2xvcmVkID0gcmVzb2x2ZUN1c3RvbUNvbG9yZWRDb2xvcml6ZXIoY3VzdG9tQ29sb3JzKVxuICBjb25zdCBjdXN0b21Db2xvcmVkID0gdXNlT25seUN1c3RvbVByb3BzID8gb25seUN1c3RvbUNvbG9yZWQgOiBPYmplY3QuYXNzaWduKHt9LCBjb2xvcmVkLCBvbmx5Q3VzdG9tQ29sb3JlZClcbiAgY29uc3QgY29sb3JpemVMZXZlbEN1c3RvbSA9IGNvbG9yaXplTGV2ZWwodXNlT25seUN1c3RvbVByb3BzKVxuXG4gIGNvbnN0IGN1c3RvbUNvbG9yZWRDb2xvcml6ZXIgPSBmdW5jdGlvbiAobGV2ZWwsIG9wdHMpIHtcbiAgICByZXR1cm4gY29sb3JpemVMZXZlbEN1c3RvbShsZXZlbCwgY3VzdG9tQ29sb3JlZCwgb3B0cylcbiAgfVxuICBjdXN0b21Db2xvcmVkQ29sb3JpemVyLmNvbG9ycyA9IGF2YWlsYWJsZUNvbG9yc1xuICBjdXN0b21Db2xvcmVkQ29sb3JpemVyLm1lc3NhZ2UgPSBjdXN0b21Db2xvcmVkQ29sb3JpemVyLm1lc3NhZ2UgfHwgY3VzdG9tQ29sb3JlZC5tZXNzYWdlXG4gIGN1c3RvbUNvbG9yZWRDb2xvcml6ZXIucHJvcGVydHkgPSBjdXN0b21Db2xvcmVkQ29sb3JpemVyLnByb3BlcnR5IHx8IGN1c3RvbUNvbG9yZWQucHJvcGVydHlcbiAgY3VzdG9tQ29sb3JlZENvbG9yaXplci5ncmV5TWVzc2FnZSA9IGN1c3RvbUNvbG9yZWRDb2xvcml6ZXIuZ3JleU1lc3NhZ2UgfHwgY3VzdG9tQ29sb3JlZC5ncmV5TWVzc2FnZVxuXG4gIHJldHVybiBjdXN0b21Db2xvcmVkQ29sb3JpemVyXG59XG5cbi8qKlxuICogQXBwbGllcyBjb2xvcml6YXRpb24sIGlmIHBvc3NpYmxlLCB0byBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhc3NlZCBpblxuICogYGxldmVsYC4gRm9yIGV4YW1wbGUsIHRoZSBkZWZhdWx0IGNvbG9yaXplciB3aWxsIHJldHVybiBhIFwiZ3JlZW5cIiBjb2xvcmVkXG4gKiBzdHJpbmcgZm9yIHRoZSBcImluZm9cIiBsZXZlbC5cbiAqXG4gKiBAdHlwZWRlZiB7ZnVuY3Rpb259IENvbG9yaXplckZ1bmNcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gbGV2ZWwgSW4gZWl0aGVyIGNhc2UsIHRoZSBpbnB1dCB3aWxsIG1hcCB0byBhIGNvbG9yXG4gKiBmb3IgdGhlIHNwZWNpZmllZCBsZXZlbCBvciB0byB0aGUgY29sb3IgZm9yIGBVU0VSTFZMYCBpZiB0aGUgbGV2ZWwgaXMgbm90XG4gKiByZWNvZ25pemVkLlxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gbWVzc2FnZSBBY2NlcHRzIG9uZSBzdHJpbmcgcGFyYW1ldGVyIHRoYXQgd2lsbCBiZVxuICogY29sb3JpemVkIHRvIGEgcHJlZGVmaW5lZCBjb2xvci5cbiAqIEBwcm9wZXJ0eSB7Q29sb3JldHRlLkNvbG9yZXR0ZX0gY29sb3JzIEF2YWlsYWJsZSBjb2xvciBmdW5jdGlvbnMgYmFzZWQgb24gYHVzZUNvbG9yYCAob3IgYGNvbG9yaXplYCkgY29udGV4dFxuICovXG5cbi8qKlxuICogRmFjdG9yeSBmdW5jdGlvbiBnZXQgYSBmdW5jdGlvbiB0byBjb2xvcml6ZWQgbGV2ZWxzLiBUaGUgcmV0dXJuZWQgZnVuY3Rpb25cbiAqIGFsc28gaW5jbHVkZXMgYSBgLm1lc3NhZ2Uoc3RyKWAgbWV0aG9kIHRvIGNvbG9yaXplIHN0cmluZ3MuXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBbdXNlQ29sb3JzPWZhbHNlXSBXaGVuIGB0cnVlYCBhIGZ1bmN0aW9uIHRoYXQgYXBwbGllcyBzdGFuZGFyZFxuICogdGVybWluYWwgY29sb3JzIGlzIHJldHVybmVkLlxuICogQHBhcmFtIHthcnJheVtdfSBbY3VzdG9tQ29sb3JzXSBUdXBsZSB3aGVyZSBmaXJzdCBpdGVtIG9mIGVhY2ggYXJyYXkgaXMgdGhlXG4gKiBsZXZlbCBpbmRleCBhbmQgdGhlIHNlY29uZCBpdGVtIGlzIHRoZSBjb2xvclxuICogQHBhcmFtIHtib29sZWFufSBbdXNlT25seUN1c3RvbVByb3BzXSBXaGVuIGB0cnVlYCwgb25seSB1c2UgdGhlIHByb3ZpZGVkXG4gKiBjdXN0b20gY29sb3JzIHByb3ZpZGVkIGFuZCBub3QgZmFsbGJhY2sgdG8gZGVmYXVsdFxuICpcbiAqIEByZXR1cm5zIHtDb2xvcml6ZXJGdW5jfSBgZnVuY3Rpb24gKGxldmVsKSB7fWAgaGFzIGEgYC5tZXNzYWdlKHN0cilgIG1ldGhvZCB0b1xuICogYXBwbHkgY29sb3JpemF0aW9uIHRvIGEgc3RyaW5nLiBUaGUgY29yZSBmdW5jdGlvbiBhY2NlcHRzIGVpdGhlciBhbiBpbnRlZ2VyXG4gKiBgbGV2ZWxgIG9yIGEgYHN0cmluZ2AgbGV2ZWwuIFRoZSBpbnRlZ2VyIGxldmVsIHdpbGwgbWFwIHRvIGEga25vd24gbGV2ZWxcbiAqIHN0cmluZyBvciB0byBgVVNFUkxWTGAgaWYgbm90IGtub3duLiAgVGhlIHN0cmluZyBgbGV2ZWxgIHdpbGwgbWFwIHRvIHRoZSBzYW1lXG4gKiBjb2xvcnMgYXMgdGhlIGludGVnZXIgYGxldmVsYCBhbmQgd2lsbCBhbHNvIGRlZmF1bHQgdG8gYFVTRVJMVkxgIGlmIHRoZSBnaXZlblxuICogc3RyaW5nIGlzIG5vdCBhIHJlY29nbml6ZWQgbGV2ZWwgbmFtZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRDb2xvcml6ZXIgKHVzZUNvbG9ycyA9IGZhbHNlLCBjdXN0b21Db2xvcnMsIHVzZU9ubHlDdXN0b21Qcm9wcykge1xuICBpZiAodXNlQ29sb3JzICYmIGN1c3RvbUNvbG9ycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGN1c3RvbUNvbG9yZWRDb2xvcml6ZXJGYWN0b3J5KGN1c3RvbUNvbG9ycywgdXNlT25seUN1c3RvbVByb3BzKVxuICB9IGVsc2UgaWYgKHVzZUNvbG9ycykge1xuICAgIHJldHVybiBjb2xvcmVkQ29sb3JpemVyKHVzZU9ubHlDdXN0b21Qcm9wcylcbiAgfVxuXG4gIHJldHVybiBwbGFpbkNvbG9yaXplcih1c2VPbmx5Q3VzdG9tUHJvcHMpXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbi8qIGdsb2JhbCBTaGFyZWRBcnJheUJ1ZmZlciwgQXRvbWljcyAqL1xuXG5pZiAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXRvbWljcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgY29uc3QgbmlsID0gbmV3IEludDMyQXJyYXkobmV3IFNoYXJlZEFycmF5QnVmZmVyKDQpKVxuXG4gIGZ1bmN0aW9uIHNsZWVwIChtcykge1xuICAgIC8vIGFsc28gZmlsdGVycyBvdXQgTmFOLCBub24tbnVtYmVyIHR5cGVzLCBpbmNsdWRpbmcgZW1wdHkgc3RyaW5ncywgYnV0IGFsbG93cyBiaWdpbnRzXG4gICAgY29uc3QgdmFsaWQgPSBtcyA+IDAgJiYgbXMgPCBJbmZpbml0eSBcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodHlwZW9mIG1zICE9PSAnbnVtYmVyJyAmJiB0eXBlb2YgbXMgIT09ICdiaWdpbnQnKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignc2xlZXA6IG1zIG11c3QgYmUgYSBudW1iZXInKVxuICAgICAgfVxuICAgICAgdGhyb3cgUmFuZ2VFcnJvcignc2xlZXA6IG1zIG11c3QgYmUgYSBudW1iZXIgdGhhdCBpcyBncmVhdGVyIHRoYW4gMCBidXQgbGVzcyB0aGFuIEluZmluaXR5JylcbiAgICB9XG5cbiAgICBBdG9taWNzLndhaXQobmlsLCAwLCAwLCBOdW1iZXIobXMpKVxuICB9XG4gIG1vZHVsZS5leHBvcnRzID0gc2xlZXBcbn0gZWxzZSB7XG5cbiAgZnVuY3Rpb24gc2xlZXAgKG1zKSB7XG4gICAgLy8gYWxzbyBmaWx0ZXJzIG91dCBOYU4sIG5vbi1udW1iZXIgdHlwZXMsIGluY2x1ZGluZyBlbXB0eSBzdHJpbmdzLCBidXQgYWxsb3dzIGJpZ2ludHNcbiAgICBjb25zdCB2YWxpZCA9IG1zID4gMCAmJiBtcyA8IEluZmluaXR5IFxuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbXMgIT09ICdudW1iZXInICYmIHR5cGVvZiBtcyAhPT0gJ2JpZ2ludCcpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzbGVlcDogbXMgbXVzdCBiZSBhIG51bWJlcicpXG4gICAgICB9XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCdzbGVlcDogbXMgbXVzdCBiZSBhIG51bWJlciB0aGF0IGlzIGdyZWF0ZXIgdGhhbiAwIGJ1dCBsZXNzIHRoYW4gSW5maW5pdHknKVxuICAgIH1cbiAgICBjb25zdCB0YXJnZXQgPSBEYXRlLm5vdygpICsgTnVtYmVyKG1zKVxuICAgIHdoaWxlICh0YXJnZXQgPiBEYXRlLm5vdygpKXt9XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IHNsZWVwXG5cbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgaW5oZXJpdHMgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHNcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHNsZWVwID0gcmVxdWlyZSgnYXRvbWljLXNsZWVwJylcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG5cbmNvbnN0IEJVU1lfV1JJVEVfVElNRU9VVCA9IDEwMFxuY29uc3Qga0VtcHR5QnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKDApXG5cbi8vIDE2IEtCLiBEb24ndCB3cml0ZSBtb3JlIHRoYW4gZG9ja2VyIGJ1ZmZlciBzaXplLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21vYnkvbW9ieS9ibG9iLzUxM2VjNzM4MzEyNjk5NDdkMzhhNjQ0YzI3OGNlM2NhYzM2NzgzYjIvZGFlbW9uL2xvZ2dlci9jb3BpZXIuZ28jTDEzXG5jb25zdCBNQVhfV1JJVEUgPSAxNiAqIDEwMjRcblxuY29uc3Qga0NvbnRlbnRNb2RlQnVmZmVyID0gJ2J1ZmZlcidcbmNvbnN0IGtDb250ZW50TW9kZVV0ZjggPSAndXRmOCdcblxuY29uc3QgW21ham9yLCBtaW5vcl0gPSAocHJvY2Vzcy52ZXJzaW9ucy5ub2RlIHx8ICcwLjAnKS5zcGxpdCgnLicpLm1hcChOdW1iZXIpXG5jb25zdCBrQ29weUJ1ZmZlciA9IG1ham9yID49IDIyICYmIG1pbm9yID49IDdcblxuZnVuY3Rpb24gb3BlbkZpbGUgKGZpbGUsIHNvbmljKSB7XG4gIHNvbmljLl9vcGVuaW5nID0gdHJ1ZVxuICBzb25pYy5fd3JpdGluZyA9IHRydWVcbiAgc29uaWMuX2FzeW5jRHJhaW5TY2hlZHVsZWQgPSBmYWxzZVxuXG4gIC8vIE5PVEU6ICdlcnJvcicgYW5kICdyZWFkeScgZXZlbnRzIGVtaXR0ZWQgYmVsb3cgb25seSByZWxldmFudCB3aGVuIHNvbmljLnN5bmM9PT1mYWxzZVxuICAvLyBmb3Igc3luYyBtb2RlLCB0aGVyZSBpcyBubyB3YXkgdG8gYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIHJlY2VpdmUgdGhlc2VcblxuICBmdW5jdGlvbiBmaWxlT3BlbmVkIChlcnIsIGZkKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgc29uaWMuX3Jlb3BlbmluZyA9IGZhbHNlXG4gICAgICBzb25pYy5fd3JpdGluZyA9IGZhbHNlXG4gICAgICBzb25pYy5fb3BlbmluZyA9IGZhbHNlXG5cbiAgICAgIGlmIChzb25pYy5zeW5jKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIGlmIChzb25pYy5saXN0ZW5lckNvdW50KCdlcnJvcicpID4gMCkge1xuICAgICAgICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCByZW9wZW5pbmcgPSBzb25pYy5fcmVvcGVuaW5nXG5cbiAgICBzb25pYy5mZCA9IGZkXG4gICAgc29uaWMuZmlsZSA9IGZpbGVcbiAgICBzb25pYy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgICBzb25pYy5fb3BlbmluZyA9IGZhbHNlXG4gICAgc29uaWMuX3dyaXRpbmcgPSBmYWxzZVxuXG4gICAgaWYgKHNvbmljLnN5bmMpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gc29uaWMuZW1pdCgncmVhZHknKSlcbiAgICB9IGVsc2Uge1xuICAgICAgc29uaWMuZW1pdCgncmVhZHknKVxuICAgIH1cblxuICAgIGlmIChzb25pYy5kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKCghc29uaWMuX3dyaXRpbmcgJiYgc29uaWMuX2xlbiA+IHNvbmljLm1pbkxlbmd0aCkgfHwgc29uaWMuX2ZsdXNoUGVuZGluZykge1xuICAgICAgc29uaWMuX2FjdHVhbFdyaXRlKClcbiAgICB9IGVsc2UgaWYgKHJlb3BlbmluZykge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBzb25pYy5lbWl0KCdkcmFpbicpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGZsYWdzID0gc29uaWMuYXBwZW5kID8gJ2EnIDogJ3cnXG4gIGNvbnN0IG1vZGUgPSBzb25pYy5tb2RlXG5cbiAgaWYgKHNvbmljLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHNvbmljLm1rZGlyKSBmcy5ta2RpclN5bmMocGF0aC5kaXJuYW1lKGZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgICAgY29uc3QgZmQgPSBmcy5vcGVuU3luYyhmaWxlLCBmbGFncywgbW9kZSlcbiAgICAgIGZpbGVPcGVuZWQobnVsbCwgZmQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBmaWxlT3BlbmVkKGVycilcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgfSBlbHNlIGlmIChzb25pYy5ta2Rpcikge1xuICAgIGZzLm1rZGlyKHBhdGguZGlybmFtZShmaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGZpbGVPcGVuZWQoZXJyKVxuICAgICAgZnMub3BlbihmaWxlLCBmbGFncywgbW9kZSwgZmlsZU9wZW5lZClcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGZzLm9wZW4oZmlsZSwgZmxhZ3MsIG1vZGUsIGZpbGVPcGVuZWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gU29uaWNCb29tIChvcHRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb25pY0Jvb20pKSB7XG4gICAgcmV0dXJuIG5ldyBTb25pY0Jvb20ob3B0cylcbiAgfVxuXG4gIGxldCB7IGZkLCBkZXN0LCBtaW5MZW5ndGgsIG1heExlbmd0aCwgbWF4V3JpdGUsIHBlcmlvZGljRmx1c2gsIHN5bmMsIGFwcGVuZCA9IHRydWUsIG1rZGlyLCByZXRyeUVBR0FJTiwgZnN5bmMsIGNvbnRlbnRNb2RlLCBtb2RlIH0gPSBvcHRzIHx8IHt9XG5cbiAgZmQgPSBmZCB8fCBkZXN0XG5cbiAgdGhpcy5fbGVuID0gMFxuICB0aGlzLmZkID0gLTFcbiAgdGhpcy5fYnVmcyA9IFtdXG4gIHRoaXMuX2xlbnMgPSBbXVxuICB0aGlzLl93cml0aW5nID0gZmFsc2VcbiAgdGhpcy5fZW5kaW5nID0gZmFsc2VcbiAgdGhpcy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgdGhpcy5fYXN5bmNEcmFpblNjaGVkdWxlZCA9IGZhbHNlXG4gIHRoaXMuX2ZsdXNoUGVuZGluZyA9IGZhbHNlXG4gIHRoaXMuX2h3bSA9IE1hdGgubWF4KG1pbkxlbmd0aCB8fCAwLCAxNjM4NylcbiAgdGhpcy5maWxlID0gbnVsbFxuICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gIHRoaXMubWluTGVuZ3RoID0gbWluTGVuZ3RoIHx8IDBcbiAgdGhpcy5tYXhMZW5ndGggPSBtYXhMZW5ndGggfHwgMFxuICB0aGlzLm1heFdyaXRlID0gbWF4V3JpdGUgfHwgTUFYX1dSSVRFXG4gIHRoaXMuX3BlcmlvZGljRmx1c2ggPSBwZXJpb2RpY0ZsdXNoIHx8IDBcbiAgdGhpcy5fcGVyaW9kaWNGbHVzaFRpbWVyID0gdW5kZWZpbmVkXG4gIHRoaXMuc3luYyA9IHN5bmMgfHwgZmFsc2VcbiAgdGhpcy53cml0YWJsZSA9IHRydWVcbiAgdGhpcy5fZnN5bmMgPSBmc3luYyB8fCBmYWxzZVxuICB0aGlzLmFwcGVuZCA9IGFwcGVuZCB8fCBmYWxzZVxuICB0aGlzLm1vZGUgPSBtb2RlXG4gIHRoaXMucmV0cnlFQUdBSU4gPSByZXRyeUVBR0FJTiB8fCAoKCkgPT4gdHJ1ZSlcbiAgdGhpcy5ta2RpciA9IG1rZGlyIHx8IGZhbHNlXG5cbiAgbGV0IGZzV3JpdGVTeW5jXG4gIGxldCBmc1dyaXRlXG4gIGlmIChjb250ZW50TW9kZSA9PT0ga0NvbnRlbnRNb2RlQnVmZmVyKSB7XG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9IGtFbXB0eUJ1ZmZlclxuICAgIHRoaXMud3JpdGUgPSB3cml0ZUJ1ZmZlclxuICAgIHRoaXMuZmx1c2ggPSBmbHVzaEJ1ZmZlclxuICAgIHRoaXMuZmx1c2hTeW5jID0gZmx1c2hCdWZmZXJTeW5jXG4gICAgdGhpcy5fYWN0dWFsV3JpdGUgPSBhY3R1YWxXcml0ZUJ1ZmZlclxuICAgIGZzV3JpdGVTeW5jID0gKCkgPT4gZnMud3JpdGVTeW5jKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYpXG4gICAgZnNXcml0ZSA9ICgpID0+IGZzLndyaXRlKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYsIHRoaXMucmVsZWFzZSlcbiAgfSBlbHNlIGlmIChjb250ZW50TW9kZSA9PT0gdW5kZWZpbmVkIHx8IGNvbnRlbnRNb2RlID09PSBrQ29udGVudE1vZGVVdGY4KSB7XG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9ICcnXG4gICAgdGhpcy53cml0ZSA9IHdyaXRlXG4gICAgdGhpcy5mbHVzaCA9IGZsdXNoXG4gICAgdGhpcy5mbHVzaFN5bmMgPSBmbHVzaFN5bmNcbiAgICB0aGlzLl9hY3R1YWxXcml0ZSA9IGFjdHVhbFdyaXRlXG4gICAgZnNXcml0ZVN5bmMgPSAoKSA9PiB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHRoaXMuX3dyaXRpbmdCdWYpKSB7XG4gICAgICAgIHJldHVybiBmcy53cml0ZVN5bmModGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZilcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcy53cml0ZVN5bmModGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgJ3V0ZjgnKVxuICAgIH1cbiAgICBmc1dyaXRlID0gKCkgPT4ge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih0aGlzLl93cml0aW5nQnVmKSkge1xuICAgICAgICByZXR1cm4gZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgdGhpcy5yZWxlYXNlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZzLndyaXRlKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYsICd1dGY4JywgdGhpcy5yZWxlYXNlKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNvbmljQm9vbSBzdXBwb3J0cyBcIiR7a0NvbnRlbnRNb2RlVXRmOH1cIiBhbmQgXCIke2tDb250ZW50TW9kZUJ1ZmZlcn1cIiwgYnV0IHBhc3NlZCAke2NvbnRlbnRNb2RlfWApXG4gIH1cblxuICBpZiAodHlwZW9mIGZkID09PSAnbnVtYmVyJykge1xuICAgIHRoaXMuZmQgPSBmZFxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gdGhpcy5lbWl0KCdyZWFkeScpKVxuICB9IGVsc2UgaWYgKHR5cGVvZiBmZCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcGVuRmlsZShmZCwgdGhpcylcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBzdXBwb3J0cyBvbmx5IGZpbGUgZGVzY3JpcHRvcnMgYW5kIGZpbGVzJylcbiAgfVxuICBpZiAodGhpcy5taW5MZW5ndGggPj0gdGhpcy5tYXhXcml0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbWluTGVuZ3RoIHNob3VsZCBiZSBzbWFsbGVyIHRoYW4gbWF4V3JpdGUgKCR7dGhpcy5tYXhXcml0ZX0pYClcbiAgfVxuXG4gIHRoaXMucmVsZWFzZSA9IChlcnIsIG4pID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBpZiAoKGVyci5jb2RlID09PSAnRUFHQUlOJyB8fCBlcnIuY29kZSA9PT0gJ0VCVVNZJykgJiYgdGhpcy5yZXRyeUVBR0FJTihlcnIsIHRoaXMuX3dyaXRpbmdCdWYubGVuZ3RoLCB0aGlzLl9sZW4gLSB0aGlzLl93cml0aW5nQnVmLmxlbmd0aCkpIHtcbiAgICAgICAgaWYgKHRoaXMuc3luYykge1xuICAgICAgICAgIC8vIFRoaXMgZXJyb3IgY29kZSBzaG91bGQgbm90IGhhcHBlbiBpbiBzeW5jIG1vZGUsIGJlY2F1c2UgaXQgaXNcbiAgICAgICAgICAvLyBub3QgdXNpbmcgdGhlIHVuZGVybGluaW5nIG9wZXJhdGluZyBzeXN0ZW0gYXN5bmNocm9ub3VzIGZ1bmN0aW9ucy5cbiAgICAgICAgICAvLyBIb3dldmVyIGl0IGhhcHBlbnMsIGFuZCBzbyB3ZSBoYW5kbGUgaXQuXG4gICAgICAgICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vcGlub2pzL3Bpbm8vaXNzdWVzLzc4M1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzbGVlcChCVVNZX1dSSVRFX1RJTUVPVVQpXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UodW5kZWZpbmVkLCAwKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTGV0J3MgZ2l2ZSB0aGUgZGVzdGluYXRpb24gc29tZSB0aW1lIHRvIHByb2Nlc3MgdGhlIGNodW5rLlxuICAgICAgICAgIHNldFRpbWVvdXQoZnNXcml0ZSwgQlVTWV9XUklURV9USU1FT1VUKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl93cml0aW5nID0gZmFsc2VcblxuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCd3cml0ZScsIG4pXG4gICAgY29uc3QgcmVsZWFzZWRCdWZPYmogPSByZWxlYXNlV3JpdGluZ0J1Zih0aGlzLl93cml0aW5nQnVmLCB0aGlzLl9sZW4sIG4pXG4gICAgdGhpcy5fbGVuID0gcmVsZWFzZWRCdWZPYmoubGVuXG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9IHJlbGVhc2VkQnVmT2JqLndyaXRpbmdCdWZcblxuICAgIGlmICh0aGlzLl93cml0aW5nQnVmLmxlbmd0aCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmMpIHtcbiAgICAgICAgZnNXcml0ZSgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY29uc3QgbiA9IGZzV3JpdGVTeW5jKClcbiAgICAgICAgICBjb25zdCByZWxlYXNlZEJ1Zk9iaiA9IHJlbGVhc2VXcml0aW5nQnVmKHRoaXMuX3dyaXRpbmdCdWYsIHRoaXMuX2xlbiwgbilcbiAgICAgICAgICB0aGlzLl9sZW4gPSByZWxlYXNlZEJ1Zk9iai5sZW5cbiAgICAgICAgICB0aGlzLl93cml0aW5nQnVmID0gcmVsZWFzZWRCdWZPYmoud3JpdGluZ0J1ZlxuICAgICAgICB9IHdoaWxlICh0aGlzLl93cml0aW5nQnVmLmxlbmd0aClcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLnJlbGVhc2UoZXJyKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZnN5bmMpIHtcbiAgICAgIGZzLmZzeW5jU3luYyh0aGlzLmZkKVxuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IHRoaXMuX2xlblxuICAgIGlmICh0aGlzLl9yZW9wZW5pbmcpIHtcbiAgICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucmVvcGVuKClcbiAgICB9IGVsc2UgaWYgKGxlbiA+IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgICB0aGlzLl9hY3R1YWxXcml0ZSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9lbmRpbmcpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHRoaXMuX2FjdHVhbFdyaXRlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZVxuICAgICAgICBhY3R1YWxDbG9zZSh0aGlzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93cml0aW5nID0gZmFsc2VcbiAgICAgIGlmICh0aGlzLnN5bmMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hc3luY0RyYWluU2NoZWR1bGVkKSB7XG4gICAgICAgICAgdGhpcy5fYXN5bmNEcmFpblNjaGVkdWxlZCA9IHRydWVcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXREcmFpbiwgdGhpcylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkcmFpbicpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5vbignbmV3TGlzdGVuZXInLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChuYW1lID09PSAnZHJhaW4nKSB7XG4gICAgICB0aGlzLl9hc3luY0RyYWluU2NoZWR1bGVkID0gZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgaWYgKHRoaXMuX3BlcmlvZGljRmx1c2ggIT09IDApIHtcbiAgICB0aGlzLl9wZXJpb2RpY0ZsdXNoVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLmZsdXNoKG51bGwpLCB0aGlzLl9wZXJpb2RpY0ZsdXNoKVxuICAgIHRoaXMuX3BlcmlvZGljRmx1c2hUaW1lci51bnJlZigpXG4gIH1cbn1cblxuLyoqXG4gKiBSZWxlYXNlIHRoZSB3cml0aW5nQnVmIGFmdGVyIGZzLndyaXRlIG4gYnl0ZXMgZGF0YVxuICogQHBhcmFtIHtzdHJpbmcgfCBCdWZmZXJ9IHdyaXRpbmdCdWYgLSBjdXJyZW50bHkgd3JpdGluZyBidWZmZXIsIHVzdWFsbHkgYmUgaW5zdGFuY2UuX3dyaXRpbmdCdWYuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gY3VycmVudGx5IGJ1ZmZlciBsZW5ndGgsIHVzdWFsbHkgYmUgaW5zdGFuY2UuX2xlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gbnVtYmVyIG9mIGJ5dGVzIGZzIGFscmVhZHkgd3JpdHRlblxuICogQHJldHVybnMge3t3cml0aW5nQnVmOiBzdHJpbmcgfCBCdWZmZXIsIGxlbjogbnVtYmVyfX0gcmVsZWFzZWQgd3JpdGluZ0J1ZiBhbmQgbGVuZ3RoXG4gKi9cbmZ1bmN0aW9uIHJlbGVhc2VXcml0aW5nQnVmICh3cml0aW5nQnVmLCBsZW4sIG4pIHtcbiAgaWYgKHR5cGVvZiB3cml0aW5nQnVmID09PSAnc3RyaW5nJykge1xuICAgIHdyaXRpbmdCdWYgPSBCdWZmZXIuZnJvbSh3cml0aW5nQnVmKVxuICB9XG5cbiAgbGVuID0gTWF0aC5tYXgobGVuIC0gbiwgMClcbiAgd3JpdGluZ0J1ZiA9IHdyaXRpbmdCdWYuc3ViYXJyYXkobilcbiAgcmV0dXJuIHsgd3JpdGluZ0J1ZiwgbGVuIH1cbn1cblxuZnVuY3Rpb24gZW1pdERyYWluIChzb25pYykge1xuICBjb25zdCBoYXNMaXN0ZW5lcnMgPSBzb25pYy5saXN0ZW5lckNvdW50KCdkcmFpbicpID4gMFxuICBpZiAoIWhhc0xpc3RlbmVycykgcmV0dXJuXG4gIHNvbmljLl9hc3luY0RyYWluU2NoZWR1bGVkID0gZmFsc2VcbiAgc29uaWMuZW1pdCgnZHJhaW4nKVxufVxuXG5pbmhlcml0cyhTb25pY0Jvb20sIEV2ZW50RW1pdHRlcilcblxuZnVuY3Rpb24gbWVyZ2VCdWYgKGJ1ZnMsIGxlbikge1xuICBpZiAoYnVmcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ga0VtcHR5QnVmZmVyXG4gIH1cblxuICBpZiAoYnVmcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gYnVmc1swXVxuICB9XG5cbiAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoYnVmcywgbGVuKVxufVxuXG5mdW5jdGlvbiB3cml0ZSAoZGF0YSkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgZGF0YSA9ICcnICsgZGF0YVxuICBjb25zdCBkYXRhTGVuID0gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSlcbiAgY29uc3QgbGVuID0gdGhpcy5fbGVuICsgZGF0YUxlblxuICBjb25zdCBidWZzID0gdGhpcy5fYnVmc1xuXG4gIGlmICh0aGlzLm1heExlbmd0aCAmJiBsZW4gPiB0aGlzLm1heExlbmd0aCkge1xuICAgIHRoaXMuZW1pdCgnZHJvcCcsIGRhdGEpXG4gICAgcmV0dXJuIHRoaXMuX2xlbiA8IHRoaXMuX2h3bVxuICB9XG5cbiAgaWYgKFxuICAgIGJ1ZnMubGVuZ3RoID09PSAwIHx8XG4gICAgQnVmZmVyLmJ5dGVMZW5ndGgoYnVmc1tidWZzLmxlbmd0aCAtIDFdKSArIGRhdGFMZW4gPiB0aGlzLm1heFdyaXRlXG4gICkge1xuICAgIGJ1ZnMucHVzaChkYXRhKVxuICB9IGVsc2Uge1xuICAgIGJ1ZnNbYnVmcy5sZW5ndGggLSAxXSArPSBkYXRhXG4gIH1cblxuICB0aGlzLl9sZW4gPSBsZW5cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fbGVuID49IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgdGhpcy5fYWN0dWFsV3JpdGUoKVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2xlbiA8IHRoaXMuX2h3bVxufVxuXG5mdW5jdGlvbiB3cml0ZUJ1ZmZlciAoZGF0YSkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgY29uc3QgbGVuID0gdGhpcy5fbGVuICsgZGF0YS5sZW5ndGhcbiAgY29uc3QgYnVmcyA9IHRoaXMuX2J1ZnNcbiAgY29uc3QgbGVucyA9IHRoaXMuX2xlbnNcblxuICBpZiAodGhpcy5tYXhMZW5ndGggJiYgbGVuID4gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICB0aGlzLmVtaXQoJ2Ryb3AnLCBkYXRhKVxuICAgIHJldHVybiB0aGlzLl9sZW4gPCB0aGlzLl9od21cbiAgfVxuXG4gIGlmIChcbiAgICBidWZzLmxlbmd0aCA9PT0gMCB8fFxuICAgIGxlbnNbbGVucy5sZW5ndGggLSAxXSArIGRhdGEubGVuZ3RoID4gdGhpcy5tYXhXcml0ZVxuICApIHtcbiAgICBidWZzLnB1c2goW2RhdGFdKVxuICAgIGxlbnMucHVzaChkYXRhLmxlbmd0aClcbiAgfSBlbHNlIHtcbiAgICBidWZzW2J1ZnMubGVuZ3RoIC0gMV0ucHVzaChkYXRhKVxuICAgIGxlbnNbbGVucy5sZW5ndGggLSAxXSArPSBkYXRhLmxlbmd0aFxuICB9XG5cbiAgdGhpcy5fbGVuID0gbGVuXG5cbiAgaWYgKCF0aGlzLl93cml0aW5nICYmIHRoaXMuX2xlbiA+PSB0aGlzLm1pbkxlbmd0aCkge1xuICAgIHRoaXMuX2FjdHVhbFdyaXRlKClcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9sZW4gPCB0aGlzLl9od21cbn1cblxuZnVuY3Rpb24gY2FsbEZsdXNoQ2FsbGJhY2tPbkRyYWluIChjYikge1xuICB0aGlzLl9mbHVzaFBlbmRpbmcgPSB0cnVlXG4gIGNvbnN0IG9uRHJhaW4gPSAoKSA9PiB7XG4gICAgLy8gb25seSBpZiBfZnN5bmMgaXMgZmFsc2UgdG8gYXZvaWQgZG91YmxlIGZzeW5jXG4gICAgaWYgKCF0aGlzLl9mc3luYykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZnMuZnN5bmModGhpcy5mZCwgKGVycikgPT4ge1xuICAgICAgICAgIHRoaXMuX2ZsdXNoUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgY2IoZXJyKVxuICAgICAgICB9KVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNiKGVycilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZmx1c2hQZW5kaW5nID0gZmFsc2VcbiAgICAgIGNiKClcbiAgICB9XG4gICAgdGhpcy5vZmYoJ2Vycm9yJywgb25FcnJvcilcbiAgfVxuICBjb25zdCBvbkVycm9yID0gKGVycikgPT4ge1xuICAgIHRoaXMuX2ZsdXNoUGVuZGluZyA9IGZhbHNlXG4gICAgY2IoZXJyKVxuICAgIHRoaXMub2ZmKCdkcmFpbicsIG9uRHJhaW4pXG4gIH1cblxuICB0aGlzLm9uY2UoJ2RyYWluJywgb25EcmFpbilcbiAgdGhpcy5vbmNlKCdlcnJvcicsIG9uRXJyb3IpXG59XG5cbmZ1bmN0aW9uIGZsdXNoIChjYikge1xuICBpZiAoY2IgIT0gbnVsbCAmJiB0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZsdXNoIGNiIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gIH1cblxuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gICAgaWYgKGNiKSB7XG4gICAgICBjYihlcnJvcilcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRocm93IGVycm9yXG4gIH1cblxuICBpZiAodGhpcy5taW5MZW5ndGggPD0gMCkge1xuICAgIGNiPy4oKVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKGNiKSB7XG4gICAgY2FsbEZsdXNoQ2FsbGJhY2tPbkRyYWluLmNhbGwodGhpcywgY2IpXG4gIH1cblxuICBpZiAodGhpcy5fd3JpdGluZykge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHRoaXMuX2J1ZnMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fYnVmcy5wdXNoKCcnKVxuICB9XG5cbiAgdGhpcy5fYWN0dWFsV3JpdGUoKVxufVxuXG5mdW5jdGlvbiBmbHVzaEJ1ZmZlciAoY2IpIHtcbiAgaWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmbHVzaCBjYiBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICB9XG5cbiAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICAgIGlmIChjYikge1xuICAgICAgY2IoZXJyb3IpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvclxuICB9XG5cbiAgaWYgKHRoaXMubWluTGVuZ3RoIDw9IDApIHtcbiAgICBjYj8uKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChjYikge1xuICAgIGNhbGxGbHVzaENhbGxiYWNrT25EcmFpbi5jYWxsKHRoaXMsIGNiKVxuICB9XG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9idWZzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2J1ZnMucHVzaChbXSlcbiAgICB0aGlzLl9sZW5zLnB1c2goMClcbiAgfVxuXG4gIHRoaXMuX2FjdHVhbFdyaXRlKClcbn1cblxuU29uaWNCb29tLnByb3RvdHlwZS5yZW9wZW4gPSBmdW5jdGlvbiAoZmlsZSkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgaWYgKHRoaXMuX29wZW5pbmcpIHtcbiAgICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW9wZW4oZmlsZSlcbiAgICB9KVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHRoaXMuX2VuZGluZykge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKCF0aGlzLmZpbGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byByZW9wZW4gYSBmaWxlIGRlc2NyaXB0b3IsIHlvdSBtdXN0IHBhc3MgYSBmaWxlIHRvIFNvbmljQm9vbScpXG4gIH1cblxuICBpZiAoZmlsZSkge1xuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgfVxuICB0aGlzLl9yZW9wZW5pbmcgPSB0cnVlXG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGZkID0gdGhpcy5mZFxuICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgIGlmIChmZCAhPT0gdGhpcy5mZCkge1xuICAgICAgZnMuY2xvc2UoZmQsIChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICBvcGVuRmlsZSh0aGlzLmZpbGUsIHRoaXMpXG59XG5cblNvbmljQm9vbS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgaWYgKHRoaXMuX29wZW5pbmcpIHtcbiAgICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy5lbmQoKVxuICAgIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLl9lbmRpbmcgPSB0cnVlXG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9sZW4gPiAwICYmIHRoaXMuZmQgPj0gMCkge1xuICAgIHRoaXMuX2FjdHVhbFdyaXRlKClcbiAgfSBlbHNlIHtcbiAgICBhY3R1YWxDbG9zZSh0aGlzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoU3luYyAoKSB7XG4gIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gIH1cblxuICBpZiAodGhpcy5mZCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvbmljIGJvb20gaXMgbm90IHJlYWR5IHlldCcpXG4gIH1cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fd3JpdGluZ0J1Zi5sZW5ndGggPiAwKSB7XG4gICAgdGhpcy5fYnVmcy51bnNoaWZ0KHRoaXMuX3dyaXRpbmdCdWYpXG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9ICcnXG4gIH1cblxuICBsZXQgYnVmID0gJydcbiAgd2hpbGUgKHRoaXMuX2J1ZnMubGVuZ3RoIHx8IGJ1Zi5sZW5ndGgpIHtcbiAgICBpZiAoYnVmLmxlbmd0aCA8PSAwKSB7XG4gICAgICBidWYgPSB0aGlzLl9idWZzWzBdXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBuID0gQnVmZmVyLmlzQnVmZmVyKGJ1ZilcbiAgICAgICAgPyBmcy53cml0ZVN5bmModGhpcy5mZCwgYnVmKVxuICAgICAgICA6IGZzLndyaXRlU3luYyh0aGlzLmZkLCBidWYsICd1dGY4JylcbiAgICAgIGNvbnN0IHJlbGVhc2VkQnVmT2JqID0gcmVsZWFzZVdyaXRpbmdCdWYoYnVmLCB0aGlzLl9sZW4sIG4pXG4gICAgICBidWYgPSByZWxlYXNlZEJ1Zk9iai53cml0aW5nQnVmXG4gICAgICB0aGlzLl9sZW4gPSByZWxlYXNlZEJ1Zk9iai5sZW5cbiAgICAgIGlmIChidWYubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgdGhpcy5fYnVmcy5zaGlmdCgpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zdCBzaG91bGRSZXRyeSA9IGVyci5jb2RlID09PSAnRUFHQUlOJyB8fCBlcnIuY29kZSA9PT0gJ0VCVVNZJ1xuICAgICAgaWYgKHNob3VsZFJldHJ5ICYmICF0aGlzLnJldHJ5RUFHQUlOKGVyciwgYnVmLmxlbmd0aCwgdGhpcy5fbGVuIC0gYnVmLmxlbmd0aCkpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG5cbiAgICAgIHNsZWVwKEJVU1lfV1JJVEVfVElNRU9VVClcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIGZzLmZzeW5jU3luYyh0aGlzLmZkKVxuICB9IGNhdGNoIHtcbiAgICAvLyBTa2lwIHRoZSBlcnJvci4gVGhlIGZkIG1pZ2h0IG5vdCBzdXBwb3J0IGZzeW5jLlxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoQnVmZmVyU3luYyAoKSB7XG4gIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gIH1cblxuICBpZiAodGhpcy5mZCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvbmljIGJvb20gaXMgbm90IHJlYWR5IHlldCcpXG4gIH1cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fd3JpdGluZ0J1Zi5sZW5ndGggPiAwKSB7XG4gICAgdGhpcy5fYnVmcy51bnNoaWZ0KFt0aGlzLl93cml0aW5nQnVmXSlcbiAgICB0aGlzLl93cml0aW5nQnVmID0ga0VtcHR5QnVmZmVyXG4gIH1cblxuICBsZXQgYnVmID0ga0VtcHR5QnVmZmVyXG4gIHdoaWxlICh0aGlzLl9idWZzLmxlbmd0aCB8fCBidWYubGVuZ3RoKSB7XG4gICAgaWYgKGJ1Zi5sZW5ndGggPD0gMCkge1xuICAgICAgYnVmID0gbWVyZ2VCdWYodGhpcy5fYnVmc1swXSwgdGhpcy5fbGVuc1swXSlcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG4gPSBmcy53cml0ZVN5bmModGhpcy5mZCwgYnVmKVxuICAgICAgYnVmID0gYnVmLnN1YmFycmF5KG4pXG4gICAgICB0aGlzLl9sZW4gPSBNYXRoLm1heCh0aGlzLl9sZW4gLSBuLCAwKVxuICAgICAgaWYgKGJ1Zi5sZW5ndGggPD0gMCkge1xuICAgICAgICB0aGlzLl9idWZzLnNoaWZ0KClcbiAgICAgICAgdGhpcy5fbGVucy5zaGlmdCgpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zdCBzaG91bGRSZXRyeSA9IGVyci5jb2RlID09PSAnRUFHQUlOJyB8fCBlcnIuY29kZSA9PT0gJ0VCVVNZJ1xuICAgICAgaWYgKHNob3VsZFJldHJ5ICYmICF0aGlzLnJldHJ5RUFHQUlOKGVyciwgYnVmLmxlbmd0aCwgdGhpcy5fbGVuIC0gYnVmLmxlbmd0aCkpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG5cbiAgICAgIHNsZWVwKEJVU1lfV1JJVEVfVElNRU9VVClcbiAgICB9XG4gIH1cbn1cblxuU29uaWNCb29tLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICBhY3R1YWxDbG9zZSh0aGlzKVxufVxuXG5mdW5jdGlvbiBhY3R1YWxXcml0ZSAoKSB7XG4gIGNvbnN0IHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VcbiAgdGhpcy5fd3JpdGluZyA9IHRydWVcbiAgdGhpcy5fd3JpdGluZ0J1ZiA9IHRoaXMuX3dyaXRpbmdCdWYubGVuZ3RoID8gdGhpcy5fd3JpdGluZ0J1ZiA6IHRoaXMuX2J1ZnMuc2hpZnQoKSB8fCAnJ1xuXG4gIGlmICh0aGlzLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgd3JpdHRlbiA9IEJ1ZmZlci5pc0J1ZmZlcih0aGlzLl93cml0aW5nQnVmKVxuICAgICAgICA/IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmKVxuICAgICAgICA6IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmLCAndXRmOCcpXG4gICAgICByZWxlYXNlKG51bGwsIHdyaXR0ZW4pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWxlYXNlKGVycilcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgcmVsZWFzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhY3R1YWxXcml0ZUJ1ZmZlciAoKSB7XG4gIGNvbnN0IHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VcbiAgdGhpcy5fd3JpdGluZyA9IHRydWVcbiAgdGhpcy5fd3JpdGluZ0J1ZiA9IHRoaXMuX3dyaXRpbmdCdWYubGVuZ3RoID8gdGhpcy5fd3JpdGluZ0J1ZiA6IG1lcmdlQnVmKHRoaXMuX2J1ZnMuc2hpZnQoKSwgdGhpcy5fbGVucy5zaGlmdCgpKVxuXG4gIGlmICh0aGlzLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgd3JpdHRlbiA9IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmKVxuICAgICAgcmVsZWFzZShudWxsLCB3cml0dGVuKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmVsZWFzZShlcnIpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGZzLndyaXRlIHdpbGwgbmVlZCB0byBjb3B5IHN0cmluZyB0byBidWZmZXIgYW55d2F5IHNvXG4gICAgLy8gd2UgZG8gaXQgaGVyZSB0byBhdm9pZCB0aGUgb3ZlcmhlYWQgb2YgY2FsY3VsYXRpbmcgdGhlIGJ1ZmZlciBzaXplXG4gICAgLy8gaW4gcmVsZWFzZVdyaXRpbmdCdWYuXG4gICAgaWYgKGtDb3B5QnVmZmVyKSB7XG4gICAgICB0aGlzLl93cml0aW5nQnVmID0gQnVmZmVyLmZyb20odGhpcy5fd3JpdGluZ0J1ZilcbiAgICB9XG4gICAgZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgcmVsZWFzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhY3R1YWxDbG9zZSAoc29uaWMpIHtcbiAgaWYgKHNvbmljLmZkID09PSAtMSkge1xuICAgIHNvbmljLm9uY2UoJ3JlYWR5JywgYWN0dWFsQ2xvc2UuYmluZChudWxsLCBzb25pYykpXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoc29uaWMuX3BlcmlvZGljRmx1c2hUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2xlYXJJbnRlcnZhbChzb25pYy5fcGVyaW9kaWNGbHVzaFRpbWVyKVxuICB9XG5cbiAgc29uaWMuZGVzdHJveWVkID0gdHJ1ZVxuICBzb25pYy5fYnVmcyA9IFtdXG4gIHNvbmljLl9sZW5zID0gW11cblxuICBhc3NlcnQodHlwZW9mIHNvbmljLmZkID09PSAnbnVtYmVyJywgYHNvbmljLmZkIG11c3QgYmUgYSBudW1iZXIsIGdvdCAke3R5cGVvZiBzb25pYy5mZH1gKVxuICB0cnkge1xuICAgIGZzLmZzeW5jKHNvbmljLmZkLCBjbG9zZVdyYXBwZWQpXG4gIH0gY2F0Y2gge1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VXcmFwcGVkICgpIHtcbiAgICAvLyBXZSBza2lwIGVycm9ycyBpbiBmc3luY1xuXG4gICAgaWYgKHNvbmljLmZkICE9PSAxICYmIHNvbmljLmZkICE9PSAyKSB7XG4gICAgICBmcy5jbG9zZShzb25pYy5mZCwgZG9uZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9uZSgpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZG9uZSAoZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoc29uaWMuX2VuZGluZyAmJiAhc29uaWMuX3dyaXRpbmcpIHtcbiAgICAgIHNvbmljLmVtaXQoJ2ZpbmlzaCcpXG4gICAgfVxuICAgIHNvbmljLmVtaXQoJ2Nsb3NlJylcbiAgfVxufVxuXG4vKipcbiAqIFRoZXNlIGV4cG9ydCBjb25maWd1cmF0aW9ucyBlbmFibGUgSlMgYW5kIFRTIGRldmVsb3BlcnNcbiAqIHRvIGNvbnN1bWVyIFNvbmljQm9vbSBpbiB3aGF0ZXZlciB3YXkgYmVzdCBzdWl0cyB0aGVpciBuZWVkcy5cbiAqIFNvbWUgZXhhbXBsZXMgb2Ygc3VwcG9ydGVkIGltcG9ydCBzeW50YXggaW5jbHVkZXM6XG4gKiAtIGBjb25zdCBTb25pY0Jvb20gPSByZXF1aXJlKCdTb25pY0Jvb20nKWBcbiAqIC0gYGNvbnN0IHsgU29uaWNCb29tIH0gPSByZXF1aXJlKCdTb25pY0Jvb20nKWBcbiAqIC0gYGltcG9ydCAqIGFzIFNvbmljQm9vbSBmcm9tICdTb25pY0Jvb20nYFxuICogLSBgaW1wb3J0IHsgU29uaWNCb29tIH0gZnJvbSAnU29uaWNCb29tJ2BcbiAqIC0gYGltcG9ydCBTb25pY0Jvb20gZnJvbSAnU29uaWNCb29tJ2BcbiAqL1xuU29uaWNCb29tLlNvbmljQm9vbSA9IFNvbmljQm9vbVxuU29uaWNCb29tLmRlZmF1bHQgPSBTb25pY0Jvb21cbm1vZHVsZS5leHBvcnRzID0gU29uaWNCb29tXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbm9vcCAoKSB7fVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCByZWZzID0ge1xuICBleGl0OiBbXSxcbiAgYmVmb3JlRXhpdDogW11cbn1cbmNvbnN0IGZ1bmN0aW9ucyA9IHtcbiAgZXhpdDogb25FeGl0LFxuICBiZWZvcmVFeGl0OiBvbkJlZm9yZUV4aXRcbn1cblxubGV0IHJlZ2lzdHJ5XG5cbmZ1bmN0aW9uIGVuc3VyZVJlZ2lzdHJ5ICgpIHtcbiAgaWYgKHJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICByZWdpc3RyeSA9IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeShjbGVhcilcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnN0YWxsIChldmVudCkge1xuICBpZiAocmVmc1tldmVudF0ubGVuZ3RoID4gMCkge1xuICAgIHJldHVyblxuICB9XG5cbiAgcHJvY2Vzcy5vbihldmVudCwgZnVuY3Rpb25zW2V2ZW50XSlcbn1cblxuZnVuY3Rpb24gdW5pbnN0YWxsIChldmVudCkge1xuICBpZiAocmVmc1tldmVudF0ubGVuZ3RoID4gMCkge1xuICAgIHJldHVyblxuICB9XG4gIHByb2Nlc3MucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGZ1bmN0aW9uc1tldmVudF0pXG4gIGlmIChyZWZzLmV4aXQubGVuZ3RoID09PSAwICYmIHJlZnMuYmVmb3JlRXhpdC5sZW5ndGggPT09IDApIHtcbiAgICByZWdpc3RyeSA9IHVuZGVmaW5lZFxuICB9XG59XG5cbmZ1bmN0aW9uIG9uRXhpdCAoKSB7XG4gIGNhbGxSZWZzKCdleGl0Jylcbn1cblxuZnVuY3Rpb24gb25CZWZvcmVFeGl0ICgpIHtcbiAgY2FsbFJlZnMoJ2JlZm9yZUV4aXQnKVxufVxuXG5mdW5jdGlvbiBjYWxsUmVmcyAoZXZlbnQpIHtcbiAgZm9yIChjb25zdCByZWYgb2YgcmVmc1tldmVudF0pIHtcbiAgICBjb25zdCBvYmogPSByZWYuZGVyZWYoKVxuICAgIGNvbnN0IGZuID0gcmVmLmZuXG5cbiAgICAvLyBUaGlzIHNob3VsZCBhbHdheXMgaGFwcGVuLCBob3dldmVyIEdDIGlzXG4gICAgLy8gdW5kZXRlcm1pbmlzdGljIHNvIGl0IG1pZ2h0IG5vdCBoYXBwZW4uXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAob2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGZuKG9iaiwgZXZlbnQpXG4gICAgfVxuICB9XG4gIHJlZnNbZXZlbnRdID0gW11cbn1cblxuZnVuY3Rpb24gY2xlYXIgKHJlZikge1xuICBmb3IgKGNvbnN0IGV2ZW50IG9mIFsnZXhpdCcsICdiZWZvcmVFeGl0J10pIHtcbiAgICBjb25zdCBpbmRleCA9IHJlZnNbZXZlbnRdLmluZGV4T2YocmVmKVxuICAgIHJlZnNbZXZlbnRdLnNwbGljZShpbmRleCwgaW5kZXggKyAxKVxuICAgIHVuaW5zdGFsbChldmVudClcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVnaXN0ZXIgKGV2ZW50LCBvYmosIGZuKSB7XG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndGhlIG9iamVjdCBjYW5cXCd0IGJlIHVuZGVmaW5lZCcpXG4gIH1cbiAgaW5zdGFsbChldmVudClcbiAgY29uc3QgcmVmID0gbmV3IFdlYWtSZWYob2JqKVxuICByZWYuZm4gPSBmblxuXG4gIGVuc3VyZVJlZ2lzdHJ5KClcbiAgcmVnaXN0cnkucmVnaXN0ZXIob2JqLCByZWYpXG4gIHJlZnNbZXZlbnRdLnB1c2gocmVmKVxufVxuXG5mdW5jdGlvbiByZWdpc3RlciAob2JqLCBmbikge1xuICBfcmVnaXN0ZXIoJ2V4aXQnLCBvYmosIGZuKVxufVxuXG5mdW5jdGlvbiByZWdpc3RlckJlZm9yZUV4aXQgKG9iaiwgZm4pIHtcbiAgX3JlZ2lzdGVyKCdiZWZvcmVFeGl0Jywgb2JqLCBmbilcbn1cblxuZnVuY3Rpb24gdW5yZWdpc3RlciAob2JqKSB7XG4gIGlmIChyZWdpc3RyeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgcmVnaXN0cnkudW5yZWdpc3RlcihvYmopXG4gIGZvciAoY29uc3QgZXZlbnQgb2YgWydleGl0JywgJ2JlZm9yZUV4aXQnXSkge1xuICAgIHJlZnNbZXZlbnRdID0gcmVmc1tldmVudF0uZmlsdGVyKChyZWYpID0+IHtcbiAgICAgIGNvbnN0IF9vYmogPSByZWYuZGVyZWYoKVxuICAgICAgcmV0dXJuIF9vYmogJiYgX29iaiAhPT0gb2JqXG4gICAgfSlcbiAgICB1bmluc3RhbGwoZXZlbnQpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHJlZ2lzdGVyLFxuICByZWdpc3RlckJlZm9yZUV4aXQsXG4gIHVucmVnaXN0ZXJcbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBidWlsZFNhZmVTb25pY0Jvb21cblxuY29uc3QgeyBpc01haW5UaHJlYWQgfSA9IHJlcXVpcmUoJ25vZGU6d29ya2VyX3RocmVhZHMnKVxuY29uc3QgU29uaWNCb29tID0gcmVxdWlyZSgnc29uaWMtYm9vbScpXG5jb25zdCBub29wID0gcmVxdWlyZSgnLi9ub29wJylcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2FmZSBTb25pY0Jvb20gaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0cyBPcHRpb25zIGZvciBTb25pY0Jvb21cbiAqXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBBIG5ldyBTb25pY0Jvb20gc3RyZWFtXG4gKi9cbmZ1bmN0aW9uIGJ1aWxkU2FmZVNvbmljQm9vbSAob3B0cykge1xuICBjb25zdCBzdHJlYW0gPSBuZXcgU29uaWNCb29tKG9wdHMpXG4gIHN0cmVhbS5vbignZXJyb3InLCBmaWx0ZXJCcm9rZW5QaXBlKVxuICAvLyBpZiB3ZSBhcmUgc3luYzogZmFsc2UsIHdlIG11c3QgZmx1c2ggb24gZXhpdFxuICBpZiAoIW9wdHMuc3luYyAmJiBpc01haW5UaHJlYWQpIHtcbiAgICBzZXR1cE9uRXhpdChzdHJlYW0pXG4gIH1cbiAgcmV0dXJuIHN0cmVhbVxuXG4gIGZ1bmN0aW9uIGZpbHRlckJyb2tlblBpcGUgKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PT0gJ0VQSVBFJykge1xuICAgICAgc3RyZWFtLndyaXRlID0gbm9vcFxuICAgICAgc3RyZWFtLmVuZCA9IG5vb3BcbiAgICAgIHN0cmVhbS5mbHVzaFN5bmMgPSBub29wXG4gICAgICBzdHJlYW0uZGVzdHJveSA9IG5vb3BcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzdHJlYW0ucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgZmlsdGVyQnJva2VuUGlwZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXR1cE9uRXhpdCAoc3RyZWFtKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIGlmIChnbG9iYWwuV2Vha1JlZiAmJiBnbG9iYWwuV2Vha01hcCAmJiBnbG9iYWwuRmluYWxpemF0aW9uUmVnaXN0cnkpIHtcbiAgICAvLyBUaGlzIGlzIGxlYWsgZnJlZSwgaXQgZG9lcyBub3QgbGVhdmUgZXZlbnQgaGFuZGxlcnNcbiAgICBjb25zdCBvbkV4aXQgPSByZXF1aXJlKCdvbi1leGl0LWxlYWstZnJlZScpXG5cbiAgICBvbkV4aXQucmVnaXN0ZXIoc3RyZWFtLCBhdXRvRW5kKVxuXG4gICAgc3RyZWFtLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIG9uRXhpdC51bnJlZ2lzdGVyKHN0cmVhbSlcbiAgICB9KVxuICB9XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5mdW5jdGlvbiBhdXRvRW5kIChzdHJlYW0sIGV2ZW50TmFtZSkge1xuICAvLyBUaGlzIGNoZWNrIGlzIG5lZWRlZCBvbmx5IG9uIHNvbWUgcGxhdGZvcm1zXG5cbiAgaWYgKHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChldmVudE5hbWUgPT09ICdiZWZvcmVFeGl0Jykge1xuICAgIC8vIFdlIHN0aWxsIGhhdmUgYW4gZXZlbnQgbG9vcCwgbGV0J3MgdXNlIGl0XG4gICAgc3RyZWFtLmZsdXNoKClcbiAgICBzdHJlYW0ub24oJ2RyYWluJywgZnVuY3Rpb24gKCkge1xuICAgICAgc3RyZWFtLmVuZCgpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICAvLyBXZSBkbyBub3QgaGF2ZSBhbiBldmVudCBsb29wLCBzbyBmbHVzaCBzeW5jaHJvbm91c2x5XG4gICAgc3RyZWFtLmZsdXNoU3luYygpXG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBpc1ZhbGlkRGF0ZVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgYXJndW1lbnQgaXMgYSBKUyBEYXRlIGFuZCBub3QgJ0ludmFsaWQgRGF0ZScuXG4gKlxuICogQHBhcmFtIHtEYXRlfSBkYXRlIFRoZSBkYXRlIHRvIGNoZWNrLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlIGlmIHRoZSBhcmd1bWVudCBpcyBhIEpTIERhdGUgYW5kIG5vdCAnSW52YWxpZCBEYXRlJy5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZERhdGUgKGRhdGUpIHtcbiAgcmV0dXJuIGRhdGUgaW5zdGFuY2VvZiBEYXRlICYmICFOdW1iZXIuaXNOYU4oZGF0ZS5nZXRUaW1lKCkpXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRGF0ZVxuXG5jb25zdCBpc1ZhbGlkRGF0ZSA9IHJlcXVpcmUoJy4vaXMtdmFsaWQtZGF0ZScpXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIEpTIERhdGUgZnJvbSBhIG51bWJlciBvciBzdHJpbmcuIEFjY2VwdHMgYW55IHNpbmdsZSBudW1iZXJcbiAqIG9yIHNpbmdsZSBzdHJpbmcgYXJndW1lbnQgdGhhdCBpcyB2YWxpZCBmb3IgdGhlIERhdGUoKSBjb25zdHJ1Y3RvcixcbiAqIG9yIGFuIGVwb2NoIGFzIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gZXBvY2ggVGhlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBEYXRlLlxuICpcbiAqIEByZXR1cm5zIHtEYXRlfSBUaGUgY29uc3RydWN0ZWQgRGF0ZS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGF0ZSAoZXBvY2gpIHtcbiAgLy8gSWYgZXBvY2ggaXMgYWxyZWFkeSBhIHZhbGlkIGFyZ3VtZW50LCByZXR1cm4gdGhlIHZhbGlkIERhdGVcbiAgbGV0IGRhdGUgPSBuZXcgRGF0ZShlcG9jaClcbiAgaWYgKGlzVmFsaWREYXRlKGRhdGUpKSB7XG4gICAgcmV0dXJuIGRhdGVcbiAgfVxuXG4gIC8vIENvbnZlcnQgdG8gYSBudW1iZXIgdG8gcGVybWl0IGVwb2NoIGFzIGEgc3RyaW5nXG4gIGRhdGUgPSBuZXcgRGF0ZSgrZXBvY2gpXG4gIHJldHVybiBkYXRlXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gc3BsaXRQcm9wZXJ0eUtleVxuXG4vKipcbiAqIFNwbGl0cyB0aGUgcHJvcGVydHkga2V5IGRlbGltaXRlZCBieSBhIGRvdCBjaGFyYWN0ZXIgYnV0IG5vdCB3aGVuIGl0IGlzIHByZWNlZGVkXG4gKiBieSBhIGJhY2tzbGFzaC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IEEgc3RyaW5nIGlkZW50aWZ5aW5nIHRoZSBwcm9wZXJ0eS5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nW119IFJldHVybnMgYSBsaXN0IG9mIHN0cmluZyBjb250YWluaW5nIGVhY2ggZGVsaW1pdGVkIHByb3BlcnR5LlxuICogZS5nLiBgJ3Byb3AyXFwuZG9tYWluXFwuY29ycC5wcm9wMidgIHNob3VsZCByZXR1cm4gWyAncHJvcDIuZG9tYWluLmNvbScsICdwcm9wMicgXVxuICovXG5mdW5jdGlvbiBzcGxpdFByb3BlcnR5S2V5IChrZXkpIHtcbiAgY29uc3QgcmVzdWx0ID0gW11cbiAgbGV0IGJhY2tzbGFzaCA9IGZhbHNlXG4gIGxldCBzZWdtZW50ID0gJydcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGtleS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGMgPSBrZXkuY2hhckF0KGkpXG5cbiAgICBpZiAoYyA9PT0gJ1xcXFwnKSB7XG4gICAgICBiYWNrc2xhc2ggPSB0cnVlXG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGlmIChiYWNrc2xhc2gpIHtcbiAgICAgIGJhY2tzbGFzaCA9IGZhbHNlXG4gICAgICBzZWdtZW50ICs9IGNcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgLyogTm9uLWVzY2FwZWQgZG90LCBwdXNoIHRvIHJlc3VsdCAqL1xuICAgIGlmIChjID09PSAnLicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpXG4gICAgICBzZWdtZW50ID0gJydcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuXG4gICAgc2VnbWVudCArPSBjXG4gIH1cblxuICAvKiBQdXNoIGxhc3QgZW50cnkgdG8gcmVzdWx0ICovXG4gIGlmIChzZWdtZW50Lmxlbmd0aCkge1xuICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UHJvcGVydHlWYWx1ZVxuXG5jb25zdCBzcGxpdFByb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi9zcGxpdC1wcm9wZXJ0eS1rZXknKVxuXG4vKipcbiAqIEdldHMgYSBzcGVjaWZpZWQgcHJvcGVydHkgZnJvbSBhbiBvYmplY3QgaWYgaXQgZXhpc3RzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBiZSBzZWFyY2hlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfHN0cmluZ1tdfSBwcm9wZXJ0eSBBIHN0cmluZywgb3IgYW4gYXJyYXkgb2Ygc3RyaW5ncywgaWRlbnRpZnlpbmdcbiAqIHRoZSBwcm9wZXJ0eSB0byBiZSByZXRyaWV2ZWQgZnJvbSB0aGUgb2JqZWN0LlxuICogQWNjZXB0cyBuZXN0ZWQgcHJvcGVydGllcyBkZWxpbWl0ZWQgYnkgYSBgLmAuXG4gKiBEZWxpbWl0ZXIgY2FuIGJlIGVzY2FwZWQgdG8gcHJlc2VydmUgcHJvcGVydHkgbmFtZXMgdGhhdCBjb250YWluIHRoZSBkZWxpbWl0ZXIuXG4gKiBlLmcuIGAncHJvcDEucHJvcDInYCBvciBgJ3Byb3AyXFwuZG9tYWluXFwuY29ycC5wcm9wMidgLlxuICpcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBnZXRQcm9wZXJ0eVZhbHVlIChvYmosIHByb3BlcnR5KSB7XG4gIGNvbnN0IHByb3BzID0gQXJyYXkuaXNBcnJheShwcm9wZXJ0eSkgPyBwcm9wZXJ0eSA6IHNwbGl0UHJvcGVydHlLZXkocHJvcGVydHkpXG5cbiAgZm9yIChjb25zdCBwcm9wIG9mIHByb3BzKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIG9iaiA9IG9ialtwcm9wXVxuICB9XG5cbiAgcmV0dXJuIG9ialxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGV0ZUxvZ1Byb3BlcnR5XG5cbmNvbnN0IGdldFByb3BlcnR5VmFsdWUgPSByZXF1aXJlKCcuL2dldC1wcm9wZXJ0eS12YWx1ZScpXG5jb25zdCBzcGxpdFByb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi9zcGxpdC1wcm9wZXJ0eS1rZXknKVxuXG4vKipcbiAqIERlbGV0ZXMgYSBzcGVjaWZpZWQgcHJvcGVydHkgZnJvbSBhIGxvZyBvYmplY3QgaWYgaXQgZXhpc3RzLlxuICogVGhpcyBmdW5jdGlvbiBtdXRhdGVzIHRoZSBwYXNzZWQgaW4gYGxvZ2Agb2JqZWN0LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2cgVGhlIGxvZyBvYmplY3QgdG8gYmUgbW9kaWZpZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgQSBzdHJpbmcgaWRlbnRpZnlpbmcgdGhlIHByb3BlcnR5IHRvIGJlIGRlbGV0ZWQgZnJvbVxuICogdGhlIGxvZyBvYmplY3QuIEFjY2VwdHMgbmVzdGVkIHByb3BlcnRpZXMgZGVsaW1pdGVkIGJ5IGEgYC5gXG4gKiBEZWxpbWl0ZXIgY2FuIGJlIGVzY2FwZWQgdG8gcHJlc2VydmUgcHJvcGVydHkgbmFtZXMgdGhhdCBjb250YWluIHRoZSBkZWxpbWl0ZXIuXG4gKiBlLmcuIGAncHJvcDEucHJvcDInYCBvciBgJ3Byb3AyXFwuZG9tYWluXFwuY29ycC5wcm9wMidgXG4gKi9cbmZ1bmN0aW9uIGRlbGV0ZUxvZ1Byb3BlcnR5IChsb2csIHByb3BlcnR5KSB7XG4gIGNvbnN0IHByb3BzID0gc3BsaXRQcm9wZXJ0eUtleShwcm9wZXJ0eSlcbiAgY29uc3QgcHJvcFRvRGVsZXRlID0gcHJvcHMucG9wKClcblxuICBsb2cgPSBnZXRQcm9wZXJ0eVZhbHVlKGxvZywgcHJvcHMpXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgaWYgKGxvZyAhPT0gbnVsbCAmJiB0eXBlb2YgbG9nID09PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobG9nLCBwcm9wVG9EZWxldGUpKSB7XG4gICAgZGVsZXRlIGxvZ1twcm9wVG9EZWxldGVdXG4gIH1cbn1cbiIsICJleHBvcnQgaW50ZXJmYWNlIENhY2hlIHtcbiAgaGFzOiAodmFsdWU6IGFueSkgPT4gYm9vbGVhbjtcbiAgc2V0OiAoa2V5OiBhbnksIHZhbHVlOiBhbnkpID0+IHZvaWQ7XG4gIGdldDogKGtleTogYW55KSA9PiBhbnk7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdW5ib3VuZC1tZXRob2RcbmNvbnN0IHRvU3RyaW5nRnVuY3Rpb24gPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L3VuYm91bmQtbWV0aG9kXG5jb25zdCB0b1N0cmluZ09iamVjdCA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cbi8qKlxuICogR2V0IGFuIGVtcHR5IHZlcnNpb24gb2YgdGhlIG9iamVjdCB3aXRoIHRoZSBzYW1lIHByb3RvdHlwZSBpdCBoYXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGVhbkNsb25lKHByb3RvdHlwZTogYW55KTogYW55IHtcbiAgaWYgKCFwcm90b3R5cGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgfVxuXG4gIGNvbnN0IENvbnN0cnVjdG9yID0gcHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuXG4gIGlmIChDb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgcmV0dXJuIHByb3RvdHlwZSA9PT0gT2JqZWN0LnByb3RvdHlwZSA/IHt9IDogT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUgYXMgb2JqZWN0IHwgbnVsbCk7XG4gIH1cblxuICBpZiAoQ29uc3RydWN0b3IgJiYgfnRvU3RyaW5nRnVuY3Rpb24uY2FsbChDb25zdHJ1Y3RvcikuaW5kZXhPZignW25hdGl2ZSBjb2RlXScpKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIElnbm9yZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSBhcyBvYmplY3QgfCBudWxsKTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRhZyBvZiB0aGUgdmFsdWUgcGFzc2VkLCBzbyB0aGF0IHRoZSBjb3JyZWN0IGNvcGllciBjYW4gYmUgdXNlZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRhZyh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgY29uc3Qgc3RyaW5nVGFnID0gdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXTtcblxuICBpZiAoc3RyaW5nVGFnKSB7XG4gICAgcmV0dXJuIHN0cmluZ1RhZztcbiAgfVxuXG4gIGNvbnN0IHR5cGUgPSB0b1N0cmluZ09iamVjdC5jYWxsKHZhbHVlKTtcblxuICByZXR1cm4gdHlwZS5zdWJzdHJpbmcoOCwgdHlwZS5sZW5ndGggLSAxKTtcbn1cbiIsICJpbXBvcnQgeyBnZXRDbGVhbkNsb25lIH0gZnJvbSAnLi91dGlscy5qcyc7XG5pbXBvcnQgdHlwZSB7IENhY2hlIH0gZnJvbSAnLi91dGlscy50cyc7XG5cbmV4cG9ydCB0eXBlIEludGVybmFsQ29waWVyPFZhbHVlPiA9ICh2YWx1ZTogVmFsdWUsIHN0YXRlOiBTdGF0ZSkgPT4gVmFsdWU7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGUge1xuICBDb25zdHJ1Y3RvcjogYW55O1xuICBjYWNoZTogQ2FjaGU7XG4gIGNvcGllcjogSW50ZXJuYWxDb3BpZXI8YW55PjtcbiAgcHJvdG90eXBlOiBhbnk7XG59XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdW5ib3VuZC1tZXRob2RcbmNvbnN0IHsgaGFzT3duUHJvcGVydHksIHByb3BlcnR5SXNFbnVtZXJhYmxlIH0gPSBPYmplY3QucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBjb3B5T3duRGVzY3JpcHRvcjxWYWx1ZSBleHRlbmRzIG9iamVjdD4oXG4gIG9yaWdpbmFsOiBWYWx1ZSxcbiAgY2xvbmU6IFZhbHVlLFxuICBwcm9wZXJ0eTogc3RyaW5nIHwgc3ltYm9sLFxuICBzdGF0ZTogU3RhdGUsXG4pOiB2b2lkIHtcbiAgY29uc3Qgb3duRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob3JpZ2luYWwsIHByb3BlcnR5KSB8fCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgdmFsdWU6IG9yaWdpbmFsW3Byb3BlcnR5IGFzIGtleW9mIFZhbHVlXSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgfTtcbiAgY29uc3QgZGVzY3JpcHRvciA9XG4gICAgb3duRGVzY3JpcHRvci5nZXQgfHwgb3duRGVzY3JpcHRvci5zZXRcbiAgICAgID8gb3duRGVzY3JpcHRvclxuICAgICAgOiB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiBvd25EZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiBvd25EZXNjcmlwdG9yLmVudW1lcmFibGUsXG4gICAgICAgICAgdmFsdWU6IHN0YXRlLmNvcGllcihvd25EZXNjcmlwdG9yLnZhbHVlLCBzdGF0ZSksXG4gICAgICAgICAgd3JpdGFibGU6IG93bkRlc2NyaXB0b3Iud3JpdGFibGUsXG4gICAgICAgIH07XG5cbiAgdHJ5IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY2xvbmUsIHByb3BlcnR5LCBkZXNjcmlwdG9yKTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gVGhlIGFib3ZlIGNhbiBmYWlsIG9uIG5vZGUgaW4gZXh0cmVtZSBlZGdlIGNhc2VzLCBzbyBmYWxsIGJhY2sgdG8gdGhlIGxvb3NlIGFzc2lnbm1lbnQuXG4gICAgY2xvbmVbcHJvcGVydHkgYXMga2V5b2YgVmFsdWVdID0gZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldCgpIDogZGVzY3JpcHRvci52YWx1ZTtcbiAgfVxufVxuXG4vKipcbiAqIFN0cmljbHR5IGNvcHkgYWxsIHByb3BlcnRpZXMgY29udGFpbmVkIG9uIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPd25Qcm9wZXJ0aWVzU3RyaWN0PFZhbHVlIGV4dGVuZHMgb2JqZWN0Pih2YWx1ZTogVmFsdWUsIGNsb25lOiBWYWx1ZSwgc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICBjb25zdCBuYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcblxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbmFtZXMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgY29weU93bkRlc2NyaXB0b3IodmFsdWUsIGNsb25lLCBuYW1lc1tpbmRleF0hLCBzdGF0ZSk7XG4gIH1cblxuICBjb25zdCBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh2YWx1ZSk7XG5cbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN5bWJvbHMubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgY29weU93bkRlc2NyaXB0b3IodmFsdWUsIGNsb25lLCBzeW1ib2xzW2luZGV4XSEsIHN0YXRlKTtcbiAgfVxuXG4gIHJldHVybiBjbG9uZTtcbn1cblxuLyoqXG4gKiBEZWVwbHkgY29weSB0aGUgaW5kZXhlZCB2YWx1ZXMgaW4gdGhlIGFycmF5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weUFycmF5TG9vc2UoYXJyYXk6IGFueVtdLCBzdGF0ZTogU3RhdGUpIHtcbiAgY29uc3QgY2xvbmUgPSBuZXcgc3RhdGUuQ29uc3RydWN0b3IoKTtcblxuICAvLyBzZXQgaW4gdGhlIGNhY2hlIGltbWVkaWF0ZWx5IHRvIGJlIGFibGUgdG8gcmV1c2UgdGhlIG9iamVjdCByZWN1cnNpdmVseVxuICBzdGF0ZS5jYWNoZS5zZXQoYXJyYXksIGNsb25lKTtcblxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgYXJyYXkubGVuZ3RoOyArK2luZGV4KSB7XG4gICAgY2xvbmVbaW5kZXhdID0gc3RhdGUuY29waWVyKGFycmF5W2luZGV4XSwgc3RhdGUpO1xuICB9XG5cbiAgcmV0dXJuIGNsb25lO1xufVxuXG4vKipcbiAqIERlZXBseSBjb3B5IHRoZSBpbmRleGVkIHZhbHVlcyBpbiB0aGUgYXJyYXksIGFzIHdlbGwgYXMgYW55IGN1c3RvbSBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weUFycmF5U3RyaWN0PFZhbHVlIGV4dGVuZHMgYW55W10+KGFycmF5OiBWYWx1ZSwgc3RhdGU6IFN0YXRlKSB7XG4gIGNvbnN0IGNsb25lID0gbmV3IHN0YXRlLkNvbnN0cnVjdG9yKCkgYXMgVmFsdWU7XG5cbiAgLy8gc2V0IGluIHRoZSBjYWNoZSBpbW1lZGlhdGVseSB0byBiZSBhYmxlIHRvIHJldXNlIHRoZSBvYmplY3QgcmVjdXJzaXZlbHlcbiAgc3RhdGUuY2FjaGUuc2V0KGFycmF5LCBjbG9uZSk7XG5cbiAgcmV0dXJuIGNvcHlPd25Qcm9wZXJ0aWVzU3RyaWN0KGFycmF5LCBjbG9uZSwgc3RhdGUpO1xufVxuXG4vKipcbiAqIENvcHkgdGhlIGNvbnRlbnRzIG9mIHRoZSBBcnJheUJ1ZmZlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlBcnJheUJ1ZmZlcjxWYWx1ZSBleHRlbmRzIEFycmF5QnVmZmVyTGlrZT4oYXJyYXlCdWZmZXI6IFZhbHVlLCBfc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICByZXR1cm4gYXJyYXlCdWZmZXIuc2xpY2UoMCkgYXMgVmFsdWU7XG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IEJsb2Igd2l0aCB0aGUgY29udGVudHMgb2YgdGhlIG9yaWdpbmFsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weUJsb2I8VmFsdWUgZXh0ZW5kcyBCbG9iPihibG9iOiBWYWx1ZSwgX3N0YXRlOiBTdGF0ZSk6IFZhbHVlIHtcbiAgcmV0dXJuIGJsb2Iuc2xpY2UoMCwgYmxvYi5zaXplLCBibG9iLnR5cGUpIGFzIFZhbHVlO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBEYXRhVmlldyB3aXRoIHRoZSBjb250ZW50cyBvZiB0aGUgb3JpZ2luYWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5RGF0YVZpZXc8VmFsdWUgZXh0ZW5kcyBEYXRhVmlldz4oZGF0YVZpZXc6IFZhbHVlLCBzdGF0ZTogU3RhdGUpOiBWYWx1ZSB7XG4gIHJldHVybiBuZXcgc3RhdGUuQ29uc3RydWN0b3IoY29weUFycmF5QnVmZmVyKGRhdGFWaWV3LmJ1ZmZlciwgc3RhdGUpKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgRGF0ZSBiYXNlZCBvbiB0aGUgdGltZSBvZiB0aGUgb3JpZ2luYWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5RGF0ZTxWYWx1ZSBleHRlbmRzIERhdGU+KGRhdGU6IFZhbHVlLCBzdGF0ZTogU3RhdGUpOiBWYWx1ZSB7XG4gIHJldHVybiBuZXcgc3RhdGUuQ29uc3RydWN0b3IoZGF0ZS5nZXRUaW1lKCkpO1xufVxuXG4vKipcbiAqIERlZXBseSBjb3B5IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU1hcExvb3NlPFZhbHVlIGV4dGVuZHMgTWFwPGFueSwgYW55Pj4obWFwOiBWYWx1ZSwgc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICBjb25zdCBjbG9uZSA9IG5ldyBzdGF0ZS5Db25zdHJ1Y3RvcigpIGFzIFZhbHVlO1xuXG4gIC8vIHNldCBpbiB0aGUgY2FjaGUgaW1tZWRpYXRlbHkgdG8gYmUgYWJsZSB0byByZXVzZSB0aGUgb2JqZWN0IHJlY3Vyc2l2ZWx5XG4gIHN0YXRlLmNhY2hlLnNldChtYXAsIGNsb25lKTtcblxuICBtYXAuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgIGNsb25lLnNldChrZXksIHN0YXRlLmNvcGllcih2YWx1ZSwgc3RhdGUpKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNsb25lO1xufVxuXG4vKipcbiAqIERlZXBseSBjb3B5IHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsLCBhcyB3ZWxsIGFzIGFueSBjdXN0b20gcHJvcGVydGllcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNYXBTdHJpY3Q8VmFsdWUgZXh0ZW5kcyBNYXA8YW55LCBhbnk+PihtYXA6IFZhbHVlLCBzdGF0ZTogU3RhdGUpIHtcbiAgcmV0dXJuIGNvcHlPd25Qcm9wZXJ0aWVzU3RyaWN0KG1hcCwgY29weU1hcExvb3NlKG1hcCwgc3RhdGUpLCBzdGF0ZSk7XG59XG5cbi8qKlxuICogRGVlcGx5IGNvcHkgdGhlIHByb3BlcnRpZXMgKGtleXMgYW5kIHN5bWJvbHMpIGFuZCB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weU9iamVjdExvb3NlPFZhbHVlIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4ob2JqZWN0OiBWYWx1ZSwgc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICBjb25zdCBjbG9uZSA9IGdldENsZWFuQ2xvbmUoc3RhdGUucHJvdG90eXBlKTtcblxuICAvLyBzZXQgaW4gdGhlIGNhY2hlIGltbWVkaWF0ZWx5IHRvIGJlIGFibGUgdG8gcmV1c2UgdGhlIG9iamVjdCByZWN1cnNpdmVseVxuICBzdGF0ZS5jYWNoZS5zZXQob2JqZWN0LCBjbG9uZSk7XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpKSB7XG4gICAgICBjbG9uZVtrZXldID0gc3RhdGUuY29waWVyKG9iamVjdFtrZXldLCBzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcblxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3ltYm9scy5sZW5ndGg7ICsraW5kZXgpIHtcbiAgICBjb25zdCBzeW1ib2wgPSBzeW1ib2xzW2luZGV4XSE7XG5cbiAgICBpZiAocHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChvYmplY3QsIHN5bWJvbCkpIHtcbiAgICAgIGNsb25lW3N5bWJvbF0gPSBzdGF0ZS5jb3BpZXIoKG9iamVjdCBhcyBhbnkpW3N5bWJvbF0sIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2xvbmU7XG59XG5cbi8qKlxuICogRGVlcGx5IGNvcHkgdGhlIHByb3BlcnRpZXMgKGtleXMgYW5kIHN5bWJvbHMpIGFuZCB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsLCBhcyB3ZWxsXG4gKiBhcyBhbnkgaGlkZGVuIG9yIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5T2JqZWN0U3RyaWN0PFZhbHVlIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgYW55Pj4ob2JqZWN0OiBWYWx1ZSwgc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICBjb25zdCBjbG9uZSA9IGdldENsZWFuQ2xvbmUoc3RhdGUucHJvdG90eXBlKTtcblxuICAvLyBzZXQgaW4gdGhlIGNhY2hlIGltbWVkaWF0ZWx5IHRvIGJlIGFibGUgdG8gcmV1c2UgdGhlIG9iamVjdCByZWN1cnNpdmVseVxuICBzdGF0ZS5jYWNoZS5zZXQob2JqZWN0LCBjbG9uZSk7XG5cbiAgcmV0dXJuIGNvcHlPd25Qcm9wZXJ0aWVzU3RyaWN0KG9iamVjdCwgY2xvbmUsIHN0YXRlKTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcHJpbWl0aXZlIHdyYXBwZXIgZnJvbSB0aGUgdmFsdWUgb2YgdGhlIG9yaWdpbmFsLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weVByaW1pdGl2ZVdyYXBwZXI8XG4gIC8vIFNwZWNpZmljYWxseSB1c2UgdGhlIG9iamVjdCBjb25zdHJ1Y3RvciB0eXBlc1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXdyYXBwZXItb2JqZWN0LXR5cGVzXG4gIFZhbHVlIGV4dGVuZHMgQm9vbGVhbiB8IE51bWJlciB8IFN0cmluZyxcbj4ocHJpbWl0aXZlT2JqZWN0OiBWYWx1ZSwgc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICByZXR1cm4gbmV3IHN0YXRlLkNvbnN0cnVjdG9yKHByaW1pdGl2ZU9iamVjdC52YWx1ZU9mKCkpO1xufVxuXG4vKipcbiAqIENyZWF0ZSBhIG5ldyBSZWdFeHAgYmFzZWQgb24gdGhlIHZhbHVlIGFuZCBmbGFncyBvZiB0aGUgb3JpZ2luYWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5UmVnRXhwPFZhbHVlIGV4dGVuZHMgUmVnRXhwPihyZWdFeHA6IFZhbHVlLCBzdGF0ZTogU3RhdGUpOiBWYWx1ZSB7XG4gIGNvbnN0IGNsb25lID0gbmV3IHN0YXRlLkNvbnN0cnVjdG9yKHJlZ0V4cC5zb3VyY2UsIHJlZ0V4cC5mbGFncykgYXMgVmFsdWU7XG5cbiAgY2xvbmUubGFzdEluZGV4ID0gcmVnRXhwLmxhc3RJbmRleDtcblxuICByZXR1cm4gY2xvbmU7XG59XG5cbi8qKlxuICogUmV0dXJuIHRoZSBvcmlnaW5hbCB2YWx1ZSAoYW4gaWRlbnRpdHkgZnVuY3Rpb24pLlxuICpcbiAqIEBub3RlXG4gKiBUSGlzIGlzIHVzZWQgZm9yIG9iamVjdHMgdGhhdCBjYW5ub3QgYmUgY29waWVkLCBzdWNoIGFzIFdlYWtNYXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5U2VsZjxWYWx1ZT4odmFsdWU6IFZhbHVlLCBfc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogRGVlcGx5IGNvcHkgdGhlIHZhbHVlcyBvZiB0aGUgb3JpZ2luYWwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3B5U2V0TG9vc2U8VmFsdWUgZXh0ZW5kcyBTZXQ8YW55Pj4oc2V0OiBWYWx1ZSwgc3RhdGU6IFN0YXRlKTogVmFsdWUge1xuICBjb25zdCBjbG9uZSA9IG5ldyBzdGF0ZS5Db25zdHJ1Y3RvcigpIGFzIFZhbHVlO1xuXG4gIC8vIHNldCBpbiB0aGUgY2FjaGUgaW1tZWRpYXRlbHkgdG8gYmUgYWJsZSB0byByZXVzZSB0aGUgb2JqZWN0IHJlY3Vyc2l2ZWx5XG4gIHN0YXRlLmNhY2hlLnNldChzZXQsIGNsb25lKTtcblxuICBzZXQuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICBjbG9uZS5hZGQoc3RhdGUuY29waWVyKHZhbHVlLCBzdGF0ZSkpO1xuICB9KTtcblxuICByZXR1cm4gY2xvbmU7XG59XG5cbi8qKlxuICogRGVlcGx5IGNvcHkgdGhlIHZhbHVlcyBvZiB0aGUgb3JpZ2luYWwsIGFzIHdlbGwgYXMgYW55IGN1c3RvbSBwcm9wZXJ0aWVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29weVNldFN0cmljdDxWYWx1ZSBleHRlbmRzIFNldDxhbnk+PihzZXQ6IFZhbHVlLCBzdGF0ZTogU3RhdGUpOiBWYWx1ZSB7XG4gIHJldHVybiBjb3B5T3duUHJvcGVydGllc1N0cmljdChzZXQsIGNvcHlTZXRMb29zZShzZXQsIHN0YXRlKSwgc3RhdGUpO1xufVxuIiwgImltcG9ydCB7XG4gIGNvcHlBcnJheUJ1ZmZlcixcbiAgY29weUFycmF5TG9vc2UsXG4gIGNvcHlBcnJheVN0cmljdCxcbiAgY29weUJsb2IsXG4gIGNvcHlEYXRhVmlldyxcbiAgY29weURhdGUsXG4gIGNvcHlNYXBMb29zZSxcbiAgY29weU1hcFN0cmljdCxcbiAgY29weU9iamVjdExvb3NlLFxuICBjb3B5T2JqZWN0U3RyaWN0LFxuICBjb3B5UHJpbWl0aXZlV3JhcHBlcixcbiAgY29weVJlZ0V4cCxcbiAgY29weVNlbGYsXG4gIGNvcHlTZXRMb29zZSxcbiAgY29weVNldFN0cmljdCxcbn0gZnJvbSAnLi9jb3BpZXIuanMnO1xuaW1wb3J0IHR5cGUgeyBJbnRlcm5hbENvcGllciB9IGZyb20gJy4vY29waWVyLnRzJztcbmltcG9ydCB0eXBlIHsgQ2FjaGUgfSBmcm9tICcuL3V0aWxzLnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBDb3BpZXJNZXRob2RzIHtcbiAgYXJyYXk/OiBJbnRlcm5hbENvcGllcjxhbnlbXT47XG4gIGFycmF5QnVmZmVyPzogSW50ZXJuYWxDb3BpZXI8QXJyYXlCdWZmZXI+O1xuICBhc3luY0dlbmVyYXRvcj86IEludGVybmFsQ29waWVyPEFzeW5jR2VuZXJhdG9yPjtcbiAgYmxvYj86IEludGVybmFsQ29waWVyPEJsb2I+O1xuICBkYXRhVmlldz86IEludGVybmFsQ29waWVyPERhdGFWaWV3PjtcbiAgZGF0ZT86IEludGVybmFsQ29waWVyPERhdGU+O1xuICBlcnJvcj86IEludGVybmFsQ29waWVyPEVycm9yPjtcbiAgZ2VuZXJhdG9yPzogSW50ZXJuYWxDb3BpZXI8R2VuZXJhdG9yPjtcbiAgbWFwPzogSW50ZXJuYWxDb3BpZXI8TWFwPGFueSwgYW55Pj47XG4gIG9iamVjdD86IEludGVybmFsQ29waWVyPFJlY29yZDxzdHJpbmcsIGFueT4+O1xuICByZWdFeHA/OiBJbnRlcm5hbENvcGllcjxSZWdFeHA+O1xuICBzZXQ/OiBJbnRlcm5hbENvcGllcjxTZXQ8YW55Pj47XG59XG5cbmludGVyZmFjZSBDb3BpZXJzIHtcbiAgW2tleTogc3RyaW5nXTogSW50ZXJuYWxDb3BpZXI8YW55PiB8IHVuZGVmaW5lZDtcblxuICBBcmd1bWVudHM6IEludGVybmFsQ29waWVyPFJlY29yZDxzdHJpbmcsIGFueT4+O1xuICBBcnJheTogSW50ZXJuYWxDb3BpZXI8YW55W10+O1xuICBBcnJheUJ1ZmZlcjogSW50ZXJuYWxDb3BpZXI8QXJyYXlCdWZmZXI+O1xuICBBc3luY0dlbmVyYXRvcjogSW50ZXJuYWxDb3BpZXI8QXN5bmNHZW5lcmF0b3I+O1xuICBCbG9iOiBJbnRlcm5hbENvcGllcjxCbG9iPjtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby13cmFwcGVyLW9iamVjdC10eXBlc1xuICBCb29sZWFuOiBJbnRlcm5hbENvcGllcjxCb29sZWFuPjtcbiAgRGF0YVZpZXc6IEludGVybmFsQ29waWVyPERhdGFWaWV3PjtcbiAgRGF0ZTogSW50ZXJuYWxDb3BpZXI8RGF0ZT47XG4gIEVycm9yOiBJbnRlcm5hbENvcGllcjxFcnJvcj47XG4gIEZsb2F0MzJBcnJheTogSW50ZXJuYWxDb3BpZXI8QXJyYXlCdWZmZXI+O1xuICBGbG9hdDY0QXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbiAgR2VuZXJhdG9yOiBJbnRlcm5hbENvcGllcjxHZW5lcmF0b3I+O1xuXG4gIEludDhBcnJheTogSW50ZXJuYWxDb3BpZXI8QXJyYXlCdWZmZXI+O1xuICBJbnQxNkFycmF5OiBJbnRlcm5hbENvcGllcjxBcnJheUJ1ZmZlcj47XG4gIEludDMyQXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbiAgTWFwOiBJbnRlcm5hbENvcGllcjxNYXA8YW55LCBhbnk+PjtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby13cmFwcGVyLW9iamVjdC10eXBlc1xuICBOdW1iZXI6IEludGVybmFsQ29waWVyPE51bWJlcj47XG4gIE9iamVjdDogSW50ZXJuYWxDb3BpZXI8UmVjb3JkPHN0cmluZywgYW55Pj47XG4gIFByb21pc2U6IEludGVybmFsQ29waWVyPFByb21pc2U8YW55Pj47XG4gIFJlZ0V4cDogSW50ZXJuYWxDb3BpZXI8UmVnRXhwPjtcbiAgU2V0OiBJbnRlcm5hbENvcGllcjxTZXQ8YW55Pj47XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8td3JhcHBlci1vYmplY3QtdHlwZXNcbiAgU3RyaW5nOiBJbnRlcm5hbENvcGllcjxTdHJpbmc+O1xuICBXZWFrTWFwOiBJbnRlcm5hbENvcGllcjxXZWFrTWFwPGFueSwgYW55Pj47XG4gIFdlYWtTZXQ6IEludGVybmFsQ29waWVyPFdlYWtTZXQ8YW55Pj47XG4gIFVpbnQ4QXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbiAgVWludDhDbGFtcGVkQXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbiAgVWludDE2QXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbiAgVWludDMyQXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbiAgVWludDY0QXJyYXk6IEludGVybmFsQ29waWVyPEFycmF5QnVmZmVyPjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDcmVhdGVDb3BpZXJPcHRpb25zIHtcbiAgY3JlYXRlQ2FjaGU/OiAoKSA9PiBDYWNoZTtcbiAgbWV0aG9kcz86IENvcGllck1ldGhvZHM7XG4gIHN0cmljdD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWlyZWRDcmVhdGVDb3BpZXJPcHRpb25zIGV4dGVuZHMgT21pdDxSZXF1aXJlZDxDcmVhdGVDb3BpZXJPcHRpb25zPiwgJ21ldGhvZHMnPiB7XG4gIGNvcGllcnM6IENvcGllcnM7XG4gIG1ldGhvZHM6IFJlcXVpcmVkPENvcGllck1ldGhvZHM+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGVmYXVsdENhY2hlKCk6IENhY2hlIHtcbiAgcmV0dXJuIG5ldyBXZWFrTWFwKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPcHRpb25zKHtcbiAgY3JlYXRlQ2FjaGU6IGNyZWF0ZUNhY2hlT3ZlcnJpZGUsXG4gIG1ldGhvZHM6IG1ldGhvZHNPdmVycmlkZSxcbiAgc3RyaWN0LFxufTogQ3JlYXRlQ29waWVyT3B0aW9ucyk6IFJlcXVpcmVkQ3JlYXRlQ29waWVyT3B0aW9ucyB7XG4gIGNvbnN0IGRlZmF1bHRNZXRob2RzID0ge1xuICAgIGFycmF5OiBzdHJpY3QgPyBjb3B5QXJyYXlTdHJpY3QgOiBjb3B5QXJyYXlMb29zZSxcbiAgICBhcnJheUJ1ZmZlcjogY29weUFycmF5QnVmZmVyLFxuICAgIGFzeW5jR2VuZXJhdG9yOiBjb3B5U2VsZixcbiAgICBibG9iOiBjb3B5QmxvYixcbiAgICBkYXRhVmlldzogY29weURhdGFWaWV3LFxuICAgIGRhdGU6IGNvcHlEYXRlLFxuICAgIGVycm9yOiBjb3B5U2VsZixcbiAgICBnZW5lcmF0b3I6IGNvcHlTZWxmLFxuICAgIG1hcDogc3RyaWN0ID8gY29weU1hcFN0cmljdCA6IGNvcHlNYXBMb29zZSxcbiAgICBvYmplY3Q6IHN0cmljdCA/IGNvcHlPYmplY3RTdHJpY3QgOiBjb3B5T2JqZWN0TG9vc2UsXG4gICAgcmVnRXhwOiBjb3B5UmVnRXhwLFxuICAgIHNldDogc3RyaWN0ID8gY29weVNldFN0cmljdCA6IGNvcHlTZXRMb29zZSxcbiAgfTtcblxuICBjb25zdCBtZXRob2RzID0gbWV0aG9kc092ZXJyaWRlID8gT2JqZWN0LmFzc2lnbihkZWZhdWx0TWV0aG9kcywgbWV0aG9kc092ZXJyaWRlKSA6IGRlZmF1bHRNZXRob2RzO1xuICBjb25zdCBjb3BpZXJzID0gZ2V0VGFnU3BlY2lmaWNDb3BpZXJzKG1ldGhvZHMpO1xuICBjb25zdCBjcmVhdGVDYWNoZSA9IGNyZWF0ZUNhY2hlT3ZlcnJpZGUgfHwgY3JlYXRlRGVmYXVsdENhY2hlO1xuXG4gIC8vIEV4dHJhIHNhZmV0eSBjaGVjayB0byBlbnN1cmUgdGhhdCBvYmplY3QgYW5kIGFycmF5IGNvcGllcnMgYXJlIGFsd2F5cyBwcm92aWRlZCxcbiAgLy8gYXZvaWRpbmcgcnVudGltZSBlcnJvcnMuXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5uZWNlc3NhcnktY29uZGl0aW9uXG4gIGlmICghY29waWVycy5PYmplY3QgfHwgIWNvcGllcnMuQXJyYXkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FuIG9iamVjdCBhbmQgYXJyYXkgY29waWVyIG11c3QgYmUgcHJvdmlkZWQuJyk7XG4gIH1cblxuICByZXR1cm4geyBjcmVhdGVDYWNoZSwgY29waWVycywgbWV0aG9kcywgc3RyaWN0OiBCb29sZWFuKHN0cmljdCkgfTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIGNvcGllcnMgdXNlZCBmb3IgZWFjaCBzcGVjaWZpYyBvYmplY3QgdGFnLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFnU3BlY2lmaWNDb3BpZXJzKG1ldGhvZHM6IFJlcXVpcmVkPENvcGllck1ldGhvZHM+KTogQ29waWVycyB7XG4gIHJldHVybiB7XG4gICAgQXJndW1lbnRzOiBtZXRob2RzLm9iamVjdCxcbiAgICBBcnJheTogbWV0aG9kcy5hcnJheSxcbiAgICBBcnJheUJ1ZmZlcjogbWV0aG9kcy5hcnJheUJ1ZmZlcixcbiAgICBBc3luY0dlbmVyYXRvcjogbWV0aG9kcy5hc3luY0dlbmVyYXRvcixcbiAgICBCbG9iOiBtZXRob2RzLmJsb2IsXG4gICAgQm9vbGVhbjogY29weVByaW1pdGl2ZVdyYXBwZXIsXG4gICAgRGF0YVZpZXc6IG1ldGhvZHMuZGF0YVZpZXcsXG4gICAgRGF0ZTogbWV0aG9kcy5kYXRlLFxuICAgIEVycm9yOiBtZXRob2RzLmVycm9yLFxuICAgIEZsb2F0MzJBcnJheTogbWV0aG9kcy5hcnJheUJ1ZmZlcixcbiAgICBGbG9hdDY0QXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gICAgR2VuZXJhdG9yOiBtZXRob2RzLmdlbmVyYXRvcixcbiAgICBJbnQ4QXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gICAgSW50MTZBcnJheTogbWV0aG9kcy5hcnJheUJ1ZmZlcixcbiAgICBJbnQzMkFycmF5OiBtZXRob2RzLmFycmF5QnVmZmVyLFxuICAgIE1hcDogbWV0aG9kcy5tYXAsXG4gICAgTnVtYmVyOiBjb3B5UHJpbWl0aXZlV3JhcHBlcixcbiAgICBPYmplY3Q6IG1ldGhvZHMub2JqZWN0LFxuICAgIFByb21pc2U6IGNvcHlTZWxmLFxuICAgIFJlZ0V4cDogbWV0aG9kcy5yZWdFeHAsXG4gICAgU2V0OiBtZXRob2RzLnNldCxcbiAgICBTdHJpbmc6IGNvcHlQcmltaXRpdmVXcmFwcGVyLFxuICAgIFdlYWtNYXA6IGNvcHlTZWxmLFxuICAgIFdlYWtTZXQ6IGNvcHlTZWxmLFxuICAgIFVpbnQ4QXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gICAgVWludDhDbGFtcGVkQXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gICAgVWludDE2QXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gICAgVWludDMyQXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gICAgVWludDY0QXJyYXk6IG1ldGhvZHMuYXJyYXlCdWZmZXIsXG4gIH07XG59XG4iLCAiaW1wb3J0IHR5cGUgeyBTdGF0ZSB9IGZyb20gJy4vY29waWVyLnRzJztcbmltcG9ydCB7IGdldE9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMuanMnO1xuaW1wb3J0IHR5cGUgeyBDcmVhdGVDb3BpZXJPcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zLnRzJztcbmltcG9ydCB7IGdldFRhZyB9IGZyb20gJy4vdXRpbHMuanMnO1xuXG5leHBvcnQgdHlwZSB7IFN0YXRlIH0gZnJvbSAnLi9jb3BpZXIudHMnO1xuZXhwb3J0IHR5cGUgeyBDcmVhdGVDb3BpZXJPcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zLnRzJztcblxuLyoqXG4gKiBDcmVhdGUgYSBjdXN0b20gY29waWVyIGJhc2VkIG9uIGN1c3RvbSBvcHRpb25zIGZvciBhbnkgb2YgdGhlIGZvbGxvd2luZzpcbiAqICAgLSBgY3JlYXRlQ2FjaGVgIG1ldGhvZCB0byBjcmVhdGUgYSBjYWNoZSBmb3IgY29waWVkIG9iamVjdHNcbiAqICAgLSBjdXN0b20gY29waWVyIGBtZXRob2RzYCBmb3Igc3BlY2lmaWMgb2JqZWN0IHR5cGVzXG4gKiAgIC0gYHN0cmljdGAgbW9kZSB0byBjb3B5IGFsbCBwcm9wZXJ0aWVzIHdpdGggdGhlaXIgZGVzY3JpcHRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvcGllcihvcHRpb25zOiBDcmVhdGVDb3BpZXJPcHRpb25zID0ge30pIHtcbiAgY29uc3QgeyBjcmVhdGVDYWNoZSwgY29waWVycyB9ID0gZ2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgY29uc3QgeyBBcnJheTogY29weUFycmF5LCBPYmplY3Q6IGNvcHlPYmplY3QgfSA9IGNvcGllcnM7XG5cbiAgZnVuY3Rpb24gY29waWVyKHZhbHVlOiBhbnksIHN0YXRlOiBTdGF0ZSk6IGFueSB7XG4gICAgc3RhdGUucHJvdG90eXBlID0gc3RhdGUuQ29uc3RydWN0b3IgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RhdGUuY2FjaGUuaGFzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHN0YXRlLmNhY2hlLmdldCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGUucHJvdG90eXBlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKTtcbiAgICAvLyBVc2luZyBsb2dpY2FsIEFORCBmb3Igc3BlZWQsIHNpbmNlIG9wdGlvbmFsIGNoYWluaW5nIHRyYW5zZm9ybXMgdG9cbiAgICAvLyBhIGxvY2FsIHZhcmlhYmxlIHVzYWdlLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLW9wdGlvbmFsLWNoYWluXG4gICAgc3RhdGUuQ29uc3RydWN0b3IgPSBzdGF0ZS5wcm90b3R5cGUgJiYgc3RhdGUucHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gcGxhaW4gb2JqZWN0c1xuICAgIGlmICghc3RhdGUuQ29uc3RydWN0b3IgfHwgc3RhdGUuQ29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgcmV0dXJuIGNvcHlPYmplY3QodmFsdWUgYXMgUmVjb3JkPHN0cmluZywgYW55Piwgc3RhdGUpO1xuICAgIH1cblxuICAgIC8vIGFycmF5c1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGNvcHlBcnJheSh2YWx1ZSwgc3RhdGUpO1xuICAgIH1cblxuICAgIGNvbnN0IHRhZ1NwZWNpZmljQ29waWVyID0gY29waWVyc1tnZXRUYWcodmFsdWUpXTtcblxuICAgIGlmICh0YWdTcGVjaWZpY0NvcGllcikge1xuICAgICAgcmV0dXJuIHRhZ1NwZWNpZmljQ29waWVyKHZhbHVlLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBjb3B5T2JqZWN0KHZhbHVlIGFzIFJlY29yZDxzdHJpbmcsIGFueT4sIHN0YXRlKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBjb3B5PFZhbHVlPih2YWx1ZTogVmFsdWUpOiBWYWx1ZSB7XG4gICAgcmV0dXJuIGNvcGllcih2YWx1ZSwge1xuICAgICAgQ29uc3RydWN0b3I6IHVuZGVmaW5lZCxcbiAgICAgIGNhY2hlOiBjcmVhdGVDYWNoZSgpLFxuICAgICAgY29waWVyLFxuICAgICAgcHJvdG90eXBlOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29weSBhbiB2YWx1ZSBkZWVwbHkgYXMgbXVjaCBhcyBwb3NzaWJsZSwgd2hlcmUgc3RyaWN0IHJlY3JlYXRpb24gb2Ygb2JqZWN0IHByb3BlcnRpZXNcbiAqIGFyZSBtYWludGFpbmVkLiBBbGwgcHJvcGVydGllcyAoaW5jbHVkaW5nIG5vbi1lbnVtZXJhYmxlIG9uZXMpIGFyZSBjb3BpZWQgd2l0aCB0aGVpclxuICogb3JpZ2luYWwgcHJvcGVydHkgZGVzY3JpcHRvcnMgb24gYm90aCBvYmplY3RzIGFuZCBhcnJheXMuXG4gKi9cbmV4cG9ydCBjb25zdCBjb3B5U3RyaWN0ID0gY3JlYXRlQ29waWVyKHsgc3RyaWN0OiB0cnVlIH0pO1xuXG4vKipcbiAqIENvcHkgYW4gdmFsdWUgZGVlcGx5IGFzIG11Y2ggYXMgcG9zc2libGUuXG4gKi9cbmV4cG9ydCBjb25zdCBjb3B5ID0gY3JlYXRlQ29waWVyKCk7XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZmlsdGVyTG9nXG5cbmNvbnN0IHsgY3JlYXRlQ29waWVyIH0gPSByZXF1aXJlKCdmYXN0LWNvcHknKVxuY29uc3QgZmFzdENvcHkgPSBjcmVhdGVDb3BpZXIoe30pXG5cbmNvbnN0IGRlbGV0ZUxvZ1Byb3BlcnR5ID0gcmVxdWlyZSgnLi9kZWxldGUtbG9nLXByb3BlcnR5JylcblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBGaWx0ZXJMb2dQYXJhbXNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBsb2cgVGhlIGxvZyBvYmplY3QgdG8gYmUgbW9kaWZpZWQuXG4gKiBAcHJvcGVydHkge1ByZXR0eUNvbnRleHR9IGNvbnRleHQgVGhlIGNvbnRleHQgb2JqZWN0IGJ1aWx0IGZyb20gcGFyc2luZ1xuICogdGhlIG9wdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBGaWx0ZXIgYSBsb2cgb2JqZWN0IGJ5IHJlbW92aW5nIG9yIGluY2x1ZGluZyBrZXlzIGFjY29yZGluZ2x5LlxuICogV2hlbiBgaW5jbHVkZUtleXNgIGlzIHBhc3NlZCwgYGlnbm9yZWRLZXlzYCB3aWxsIGJlIGlnbm9yZWQuXG4gKiBPbmUgb2YgaWdub3JlS2V5cyBvciBpbmNsdWRlS2V5cyBtdXN0IGJlIHBhc3MgaW4uXG4gKlxuICogQHBhcmFtIHtGaWx0ZXJMb2dQYXJhbXN9IGlucHV0XG4gKlxuICogQHJldHVybnMge29iamVjdH0gQSBuZXcgYGxvZ2Agb2JqZWN0IGluc3RhbmNlIHRoYXRcbiAqICBlaXRoZXIgb25seSBpbmNsdWRlcyB0aGUga2V5cyBpbiBpZ25vcmVLZXlzXG4gKiAgb3IgZG9lcyBub3QgaW5jbHVkZSB0aG9zZSBpbiBpZ25vcmVkS2V5cy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyTG9nICh7IGxvZywgY29udGV4dCB9KSB7XG4gIGNvbnN0IHsgaWdub3JlS2V5cywgaW5jbHVkZUtleXMgfSA9IGNvbnRleHRcbiAgY29uc3QgbG9nQ29weSA9IGZhc3RDb3B5KGxvZylcblxuICBpZiAoaW5jbHVkZUtleXMpIHtcbiAgICBjb25zdCBsb2dJbmNsdWRlZCA9IHt9XG5cbiAgICBpbmNsdWRlS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGxvZ0luY2x1ZGVkW2tleV0gPSBsb2dDb3B5W2tleV1cbiAgICB9KVxuICAgIHJldHVybiBsb2dJbmNsdWRlZFxuICB9XG5cbiAgaWdub3JlS2V5cy5mb3JFYWNoKChpZ25vcmVLZXkpID0+IHtcbiAgICBkZWxldGVMb2dQcm9wZXJ0eShsb2dDb3B5LCBpZ25vcmVLZXkpXG4gIH0pXG4gIHJldHVybiBsb2dDb3B5XG59XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gX3R5cGVvZihvYmope1wiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjtpZih0eXBlb2YgU3ltYm9sPT09XCJmdW5jdGlvblwiJiZ0eXBlb2YgU3ltYm9sLml0ZXJhdG9yPT09XCJzeW1ib2xcIil7X3R5cGVvZj1mdW5jdGlvbiBfdHlwZW9mKG9iail7cmV0dXJuIHR5cGVvZiBvYmp9fWVsc2V7X3R5cGVvZj1mdW5jdGlvbiBfdHlwZW9mKG9iail7cmV0dXJuIG9iaiYmdHlwZW9mIFN5bWJvbD09PVwiZnVuY3Rpb25cIiYmb2JqLmNvbnN0cnVjdG9yPT09U3ltYm9sJiZvYmohPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIG9ian19cmV0dXJuIF90eXBlb2Yob2JqKX0oZnVuY3Rpb24oZ2xvYmFsKXt2YXIgX2FyZ3VtZW50cz1hcmd1bWVudHM7dmFyIGRhdGVGb3JtYXQ9ZnVuY3Rpb24oKXt2YXIgdG9rZW49L2R7MSw0fXxEezMsNH18bXsxLDR9fHl5KD86eXkpP3woW0hoTXNUdF0pXFwxP3xXezEsMn18W0xsb3BTWk5dfFwiW15cIl0qXCJ8J1teJ10qJy9nO3ZhciB0aW1lem9uZT0vXFxiKD86W1BNQ0VBXVtTRFBdVHwoPzpQYWNpZmljfE1vdW50YWlufENlbnRyYWx8RWFzdGVybnxBdGxhbnRpYykgKD86U3RhbmRhcmR8RGF5bGlnaHR8UHJldmFpbGluZykgVGltZXwoPzpHTVR8VVRDKSg/OlstK11cXGR7NH0pPylcXGIvZzt2YXIgdGltZXpvbmVDbGlwPS9bXi0rXFxkQS1aXS9nO3JldHVybiBmdW5jdGlvbihkYXRlLG1hc2ssdXRjLGdtdCl7aWYoX2FyZ3VtZW50cy5sZW5ndGg9PT0xJiZraW5kT2YoZGF0ZSk9PT1cInN0cmluZ1wiJiYhL1xcZC8udGVzdChkYXRlKSl7bWFzaz1kYXRlO2RhdGU9dW5kZWZpbmVkfWRhdGU9ZGF0ZXx8ZGF0ZT09PTA/ZGF0ZTpuZXcgRGF0ZTtpZighKGRhdGUgaW5zdGFuY2VvZiBEYXRlKSl7ZGF0ZT1uZXcgRGF0ZShkYXRlKX1pZihpc05hTihkYXRlKSl7dGhyb3cgVHlwZUVycm9yKFwiSW52YWxpZCBkYXRlXCIpfW1hc2s9U3RyaW5nKGRhdGVGb3JtYXQubWFza3NbbWFza118fG1hc2t8fGRhdGVGb3JtYXQubWFza3NbXCJkZWZhdWx0XCJdKTt2YXIgbWFza1NsaWNlPW1hc2suc2xpY2UoMCw0KTtpZihtYXNrU2xpY2U9PT1cIlVUQzpcInx8bWFza1NsaWNlPT09XCJHTVQ6XCIpe21hc2s9bWFzay5zbGljZSg0KTt1dGM9dHJ1ZTtpZihtYXNrU2xpY2U9PT1cIkdNVDpcIil7Z210PXRydWV9fXZhciBfPWZ1bmN0aW9uIF8oKXtyZXR1cm4gdXRjP1wiZ2V0VVRDXCI6XCJnZXRcIn07dmFyIF9kPWZ1bmN0aW9uIGQoKXtyZXR1cm4gZGF0ZVtfKCkrXCJEYXRlXCJdKCl9O3ZhciBEPWZ1bmN0aW9uIEQoKXtyZXR1cm4gZGF0ZVtfKCkrXCJEYXlcIl0oKX07dmFyIF9tPWZ1bmN0aW9uIG0oKXtyZXR1cm4gZGF0ZVtfKCkrXCJNb250aFwiXSgpfTt2YXIgeT1mdW5jdGlvbiB5KCl7cmV0dXJuIGRhdGVbXygpK1wiRnVsbFllYXJcIl0oKX07dmFyIF9IPWZ1bmN0aW9uIEgoKXtyZXR1cm4gZGF0ZVtfKCkrXCJIb3Vyc1wiXSgpfTt2YXIgX009ZnVuY3Rpb24gTSgpe3JldHVybiBkYXRlW18oKStcIk1pbnV0ZXNcIl0oKX07dmFyIF9zPWZ1bmN0aW9uIHMoKXtyZXR1cm4gZGF0ZVtfKCkrXCJTZWNvbmRzXCJdKCl9O3ZhciBfTD1mdW5jdGlvbiBMKCl7cmV0dXJuIGRhdGVbXygpK1wiTWlsbGlzZWNvbmRzXCJdKCl9O3ZhciBfbz1mdW5jdGlvbiBvKCl7cmV0dXJuIHV0Yz8wOmRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKX07dmFyIF9XPWZ1bmN0aW9uIFcoKXtyZXR1cm4gZ2V0V2VlayhkYXRlKX07dmFyIF9OPWZ1bmN0aW9uIE4oKXtyZXR1cm4gZ2V0RGF5T2ZXZWVrKGRhdGUpfTt2YXIgZmxhZ3M9e2Q6ZnVuY3Rpb24gZCgpe3JldHVybiBfZCgpfSxkZDpmdW5jdGlvbiBkZCgpe3JldHVybiBwYWQoX2QoKSl9LGRkZDpmdW5jdGlvbiBkZGQoKXtyZXR1cm4gZGF0ZUZvcm1hdC5pMThuLmRheU5hbWVzW0QoKV19LERERDpmdW5jdGlvbiBEREQoKXtyZXR1cm4gZ2V0RGF5TmFtZSh7eTp5KCksbTpfbSgpLGQ6X2QoKSxfOl8oKSxkYXlOYW1lOmRhdGVGb3JtYXQuaTE4bi5kYXlOYW1lc1tEKCldLHNob3J0OnRydWV9KX0sZGRkZDpmdW5jdGlvbiBkZGRkKCl7cmV0dXJuIGRhdGVGb3JtYXQuaTE4bi5kYXlOYW1lc1tEKCkrN119LEREREQ6ZnVuY3Rpb24gRERERCgpe3JldHVybiBnZXREYXlOYW1lKHt5OnkoKSxtOl9tKCksZDpfZCgpLF86XygpLGRheU5hbWU6ZGF0ZUZvcm1hdC5pMThuLmRheU5hbWVzW0QoKSs3XX0pfSxtOmZ1bmN0aW9uIG0oKXtyZXR1cm4gX20oKSsxfSxtbTpmdW5jdGlvbiBtbSgpe3JldHVybiBwYWQoX20oKSsxKX0sbW1tOmZ1bmN0aW9uIG1tbSgpe3JldHVybiBkYXRlRm9ybWF0LmkxOG4ubW9udGhOYW1lc1tfbSgpXX0sbW1tbTpmdW5jdGlvbiBtbW1tKCl7cmV0dXJuIGRhdGVGb3JtYXQuaTE4bi5tb250aE5hbWVzW19tKCkrMTJdfSx5eTpmdW5jdGlvbiB5eSgpe3JldHVybiBTdHJpbmcoeSgpKS5zbGljZSgyKX0seXl5eTpmdW5jdGlvbiB5eXl5KCl7cmV0dXJuIHBhZCh5KCksNCl9LGg6ZnVuY3Rpb24gaCgpe3JldHVybiBfSCgpJTEyfHwxMn0saGg6ZnVuY3Rpb24gaGgoKXtyZXR1cm4gcGFkKF9IKCklMTJ8fDEyKX0sSDpmdW5jdGlvbiBIKCl7cmV0dXJuIF9IKCl9LEhIOmZ1bmN0aW9uIEhIKCl7cmV0dXJuIHBhZChfSCgpKX0sTTpmdW5jdGlvbiBNKCl7cmV0dXJuIF9NKCl9LE1NOmZ1bmN0aW9uIE1NKCl7cmV0dXJuIHBhZChfTSgpKX0sczpmdW5jdGlvbiBzKCl7cmV0dXJuIF9zKCl9LHNzOmZ1bmN0aW9uIHNzKCl7cmV0dXJuIHBhZChfcygpKX0sbDpmdW5jdGlvbiBsKCl7cmV0dXJuIHBhZChfTCgpLDMpfSxMOmZ1bmN0aW9uIEwoKXtyZXR1cm4gcGFkKE1hdGguZmxvb3IoX0woKS8xMCkpfSx0OmZ1bmN0aW9uIHQoKXtyZXR1cm4gX0goKTwxMj9kYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzBdOmRhdGVGb3JtYXQuaTE4bi50aW1lTmFtZXNbMV19LHR0OmZ1bmN0aW9uIHR0KCl7cmV0dXJuIF9IKCk8MTI/ZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1syXTpkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzNdfSxUOmZ1bmN0aW9uIFQoKXtyZXR1cm4gX0goKTwxMj9kYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzRdOmRhdGVGb3JtYXQuaTE4bi50aW1lTmFtZXNbNV19LFRUOmZ1bmN0aW9uIFRUKCl7cmV0dXJuIF9IKCk8MTI/ZGF0ZUZvcm1hdC5pMThuLnRpbWVOYW1lc1s2XTpkYXRlRm9ybWF0LmkxOG4udGltZU5hbWVzWzddfSxaOmZ1bmN0aW9uIFooKXtyZXR1cm4gZ210P1wiR01UXCI6dXRjP1wiVVRDXCI6KFN0cmluZyhkYXRlKS5tYXRjaCh0aW1lem9uZSl8fFtcIlwiXSkucG9wKCkucmVwbGFjZSh0aW1lem9uZUNsaXAsXCJcIikucmVwbGFjZSgvR01UXFwrMDAwMC9nLFwiVVRDXCIpfSxvOmZ1bmN0aW9uIG8oKXtyZXR1cm4oX28oKT4wP1wiLVwiOlwiK1wiKStwYWQoTWF0aC5mbG9vcihNYXRoLmFicyhfbygpKS82MCkqMTAwK01hdGguYWJzKF9vKCkpJTYwLDQpfSxwOmZ1bmN0aW9uIHAoKXtyZXR1cm4oX28oKT4wP1wiLVwiOlwiK1wiKStwYWQoTWF0aC5mbG9vcihNYXRoLmFicyhfbygpKS82MCksMikrXCI6XCIrcGFkKE1hdGguZmxvb3IoTWF0aC5hYnMoX28oKSklNjApLDIpfSxTOmZ1bmN0aW9uIFMoKXtyZXR1cm5bXCJ0aFwiLFwic3RcIixcIm5kXCIsXCJyZFwiXVtfZCgpJTEwPjM/MDooX2QoKSUxMDAtX2QoKSUxMCE9MTApKl9kKCklMTBdfSxXOmZ1bmN0aW9uIFcoKXtyZXR1cm4gX1coKX0sV1c6ZnVuY3Rpb24gV1coKXtyZXR1cm4gcGFkKF9XKCkpfSxOOmZ1bmN0aW9uIE4oKXtyZXR1cm4gX04oKX19O3JldHVybiBtYXNrLnJlcGxhY2UodG9rZW4sZnVuY3Rpb24obWF0Y2gpe2lmKG1hdGNoIGluIGZsYWdzKXtyZXR1cm4gZmxhZ3NbbWF0Y2hdKCl9cmV0dXJuIG1hdGNoLnNsaWNlKDEsbWF0Y2gubGVuZ3RoLTEpfSl9fSgpO2RhdGVGb3JtYXQubWFza3M9e2RlZmF1bHQ6XCJkZGQgbW1tIGRkIHl5eXkgSEg6TU06c3NcIixzaG9ydERhdGU6XCJtL2QveXlcIixwYWRkZWRTaG9ydERhdGU6XCJtbS9kZC95eXl5XCIsbWVkaXVtRGF0ZTpcIm1tbSBkLCB5eXl5XCIsbG9uZ0RhdGU6XCJtbW1tIGQsIHl5eXlcIixmdWxsRGF0ZTpcImRkZGQsIG1tbW0gZCwgeXl5eVwiLHNob3J0VGltZTpcImg6TU0gVFRcIixtZWRpdW1UaW1lOlwiaDpNTTpzcyBUVFwiLGxvbmdUaW1lOlwiaDpNTTpzcyBUVCBaXCIsaXNvRGF0ZTpcInl5eXktbW0tZGRcIixpc29UaW1lOlwiSEg6TU06c3NcIixpc29EYXRlVGltZTpcInl5eXktbW0tZGQnVCdISDpNTTpzc29cIixpc29VdGNEYXRlVGltZTpcIlVUQzp5eXl5LW1tLWRkJ1QnSEg6TU06c3MnWidcIixleHBpcmVzSGVhZGVyRm9ybWF0OlwiZGRkLCBkZCBtbW0geXl5eSBISDpNTTpzcyBaXCJ9O2RhdGVGb3JtYXQuaTE4bj17ZGF5TmFtZXM6W1wiU3VuXCIsXCJNb25cIixcIlR1ZVwiLFwiV2VkXCIsXCJUaHVcIixcIkZyaVwiLFwiU2F0XCIsXCJTdW5kYXlcIixcIk1vbmRheVwiLFwiVHVlc2RheVwiLFwiV2VkbmVzZGF5XCIsXCJUaHVyc2RheVwiLFwiRnJpZGF5XCIsXCJTYXR1cmRheVwiXSxtb250aE5hbWVzOltcIkphblwiLFwiRmViXCIsXCJNYXJcIixcIkFwclwiLFwiTWF5XCIsXCJKdW5cIixcIkp1bFwiLFwiQXVnXCIsXCJTZXBcIixcIk9jdFwiLFwiTm92XCIsXCJEZWNcIixcIkphbnVhcnlcIixcIkZlYnJ1YXJ5XCIsXCJNYXJjaFwiLFwiQXByaWxcIixcIk1heVwiLFwiSnVuZVwiLFwiSnVseVwiLFwiQXVndXN0XCIsXCJTZXB0ZW1iZXJcIixcIk9jdG9iZXJcIixcIk5vdmVtYmVyXCIsXCJEZWNlbWJlclwiXSx0aW1lTmFtZXM6W1wiYVwiLFwicFwiLFwiYW1cIixcInBtXCIsXCJBXCIsXCJQXCIsXCJBTVwiLFwiUE1cIl19O3ZhciBwYWQ9ZnVuY3Rpb24gcGFkKHZhbCxsZW4pe3ZhbD1TdHJpbmcodmFsKTtsZW49bGVufHwyO3doaWxlKHZhbC5sZW5ndGg8bGVuKXt2YWw9XCIwXCIrdmFsfXJldHVybiB2YWx9O3ZhciBnZXREYXlOYW1lPWZ1bmN0aW9uIGdldERheU5hbWUoX3JlZil7dmFyIHk9X3JlZi55LG09X3JlZi5tLGQ9X3JlZi5kLF89X3JlZi5fLGRheU5hbWU9X3JlZi5kYXlOYW1lLF9yZWYkc2hvcnQ9X3JlZltcInNob3J0XCJdLF9zaG9ydD1fcmVmJHNob3J0PT09dm9pZCAwP2ZhbHNlOl9yZWYkc2hvcnQ7dmFyIHRvZGF5PW5ldyBEYXRlO3ZhciB5ZXN0ZXJkYXk9bmV3IERhdGU7eWVzdGVyZGF5LnNldERhdGUoeWVzdGVyZGF5W18rXCJEYXRlXCJdKCktMSk7dmFyIHRvbW9ycm93PW5ldyBEYXRlO3RvbW9ycm93LnNldERhdGUodG9tb3Jyb3dbXytcIkRhdGVcIl0oKSsxKTt2YXIgdG9kYXlfZD1mdW5jdGlvbiB0b2RheV9kKCl7cmV0dXJuIHRvZGF5W18rXCJEYXRlXCJdKCl9O3ZhciB0b2RheV9tPWZ1bmN0aW9uIHRvZGF5X20oKXtyZXR1cm4gdG9kYXlbXytcIk1vbnRoXCJdKCl9O3ZhciB0b2RheV95PWZ1bmN0aW9uIHRvZGF5X3koKXtyZXR1cm4gdG9kYXlbXytcIkZ1bGxZZWFyXCJdKCl9O3ZhciB5ZXN0ZXJkYXlfZD1mdW5jdGlvbiB5ZXN0ZXJkYXlfZCgpe3JldHVybiB5ZXN0ZXJkYXlbXytcIkRhdGVcIl0oKX07dmFyIHllc3RlcmRheV9tPWZ1bmN0aW9uIHllc3RlcmRheV9tKCl7cmV0dXJuIHllc3RlcmRheVtfK1wiTW9udGhcIl0oKX07dmFyIHllc3RlcmRheV95PWZ1bmN0aW9uIHllc3RlcmRheV95KCl7cmV0dXJuIHllc3RlcmRheVtfK1wiRnVsbFllYXJcIl0oKX07dmFyIHRvbW9ycm93X2Q9ZnVuY3Rpb24gdG9tb3Jyb3dfZCgpe3JldHVybiB0b21vcnJvd1tfK1wiRGF0ZVwiXSgpfTt2YXIgdG9tb3Jyb3dfbT1mdW5jdGlvbiB0b21vcnJvd19tKCl7cmV0dXJuIHRvbW9ycm93W18rXCJNb250aFwiXSgpfTt2YXIgdG9tb3Jyb3dfeT1mdW5jdGlvbiB0b21vcnJvd195KCl7cmV0dXJuIHRvbW9ycm93W18rXCJGdWxsWWVhclwiXSgpfTtpZih0b2RheV95KCk9PT15JiZ0b2RheV9tKCk9PT1tJiZ0b2RheV9kKCk9PT1kKXtyZXR1cm4gX3Nob3J0P1wiVGR5XCI6XCJUb2RheVwifWVsc2UgaWYoeWVzdGVyZGF5X3koKT09PXkmJnllc3RlcmRheV9tKCk9PT1tJiZ5ZXN0ZXJkYXlfZCgpPT09ZCl7cmV0dXJuIF9zaG9ydD9cIllzZFwiOlwiWWVzdGVyZGF5XCJ9ZWxzZSBpZih0b21vcnJvd195KCk9PT15JiZ0b21vcnJvd19tKCk9PT1tJiZ0b21vcnJvd19kKCk9PT1kKXtyZXR1cm4gX3Nob3J0P1wiVG13XCI6XCJUb21vcnJvd1wifXJldHVybiBkYXlOYW1lfTt2YXIgZ2V0V2Vlaz1mdW5jdGlvbiBnZXRXZWVrKGRhdGUpe3ZhciB0YXJnZXRUaHVyc2RheT1uZXcgRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksZGF0ZS5nZXRNb250aCgpLGRhdGUuZ2V0RGF0ZSgpKTt0YXJnZXRUaHVyc2RheS5zZXREYXRlKHRhcmdldFRodXJzZGF5LmdldERhdGUoKS0odGFyZ2V0VGh1cnNkYXkuZ2V0RGF5KCkrNiklNyszKTt2YXIgZmlyc3RUaHVyc2RheT1uZXcgRGF0ZSh0YXJnZXRUaHVyc2RheS5nZXRGdWxsWWVhcigpLDAsNCk7Zmlyc3RUaHVyc2RheS5zZXREYXRlKGZpcnN0VGh1cnNkYXkuZ2V0RGF0ZSgpLShmaXJzdFRodXJzZGF5LmdldERheSgpKzYpJTcrMyk7dmFyIGRzPXRhcmdldFRodXJzZGF5LmdldFRpbWV6b25lT2Zmc2V0KCktZmlyc3RUaHVyc2RheS5nZXRUaW1lem9uZU9mZnNldCgpO3RhcmdldFRodXJzZGF5LnNldEhvdXJzKHRhcmdldFRodXJzZGF5LmdldEhvdXJzKCktZHMpO3ZhciB3ZWVrRGlmZj0odGFyZ2V0VGh1cnNkYXktZmlyc3RUaHVyc2RheSkvKDg2NGU1KjcpO3JldHVybiAxK01hdGguZmxvb3Iod2Vla0RpZmYpfTt2YXIgZ2V0RGF5T2ZXZWVrPWZ1bmN0aW9uIGdldERheU9mV2VlayhkYXRlKXt2YXIgZG93PWRhdGUuZ2V0RGF5KCk7aWYoZG93PT09MCl7ZG93PTd9cmV0dXJuIGRvd307dmFyIGtpbmRPZj1mdW5jdGlvbiBraW5kT2YodmFsKXtpZih2YWw9PT1udWxsKXtyZXR1cm5cIm51bGxcIn1pZih2YWw9PT11bmRlZmluZWQpe3JldHVyblwidW5kZWZpbmVkXCJ9aWYoX3R5cGVvZih2YWwpIT09XCJvYmplY3RcIil7cmV0dXJuIF90eXBlb2YodmFsKX1pZihBcnJheS5pc0FycmF5KHZhbCkpe3JldHVyblwiYXJyYXlcIn1yZXR1cm57fS50b1N0cmluZy5jYWxsKHZhbCkuc2xpY2UoOCwtMSkudG9Mb3dlckNhc2UoKX07aWYodHlwZW9mIGRlZmluZT09PVwiZnVuY3Rpb25cIiYmZGVmaW5lLmFtZCl7ZGVmaW5lKGZ1bmN0aW9uKCl7cmV0dXJuIGRhdGVGb3JtYXR9KX1lbHNlIGlmKCh0eXBlb2YgZXhwb3J0cz09PVwidW5kZWZpbmVkXCI/XCJ1bmRlZmluZWRcIjpfdHlwZW9mKGV4cG9ydHMpKT09PVwib2JqZWN0XCIpe21vZHVsZS5leHBvcnRzPWRhdGVGb3JtYXR9ZWxzZXtnbG9iYWwuZGF0ZUZvcm1hdD1kYXRlRm9ybWF0fX0pKHZvaWQgMCk7IiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZvcm1hdFRpbWVcblxuY29uc3Qge1xuICBEQVRFX0ZPUk1BVCxcbiAgREFURV9GT1JNQVRfU0lNUExFXG59ID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJylcblxuY29uc3QgZGF0ZWZvcm1hdCA9IHJlcXVpcmUoJ2RhdGVmb3JtYXQnKVxuY29uc3QgY3JlYXRlRGF0ZSA9IHJlcXVpcmUoJy4vY3JlYXRlLWRhdGUnKVxuY29uc3QgaXNWYWxpZERhdGUgPSByZXF1aXJlKCcuL2lzLXZhbGlkLWRhdGUnKVxuXG4vKipcbiAqIENvbnZlcnRzIGEgZ2l2ZW4gYGVwb2NoYCB0byBhIGRlc2lyZWQgZGlzcGxheSBmb3JtYXQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ8c3RyaW5nfSBlcG9jaCBUaGUgdGltZSB0byBjb252ZXJ0LiBNYXkgYmUgYW55IHZhbHVlIHRoYXQgaXNcbiAqIHZhbGlkIGZvciBgbmV3IERhdGUoKWAuXG4gKiBAcGFyYW0ge2Jvb2xlYW58c3RyaW5nfSBbdHJhbnNsYXRlVGltZT1mYWxzZV0gV2hlbiBgZmFsc2VgLCB0aGUgZ2l2ZW4gYGVwb2NoYFxuICogd2lsbCBzaW1wbHkgYmUgcmV0dXJuZWQuIFdoZW4gYHRydWVgLCB0aGUgZ2l2ZW4gYGVwb2NoYCB3aWxsIGJlIGNvbnZlcnRlZFxuICogdG8gYSBzdHJpbmcgYXQgVVRDIHVzaW5nIHRoZSBgREFURV9GT1JNQVRfU0lNUExFYCBjb25zdGFudC4gSWYgYHRyYW5zbGF0ZVRpbWVgIGlzXG4gKiBhIHN0cmluZywgdGhlIGZvbGxvd2luZyBydWxlcyBhcmUgYXZhaWxhYmxlOlxuICpcbiAqIC0gYDxmb3JtYXQgc3RyaW5nPmA6IFRoZSBzdHJpbmcgaXMgYSBsaXRlcmFsIGZvcm1hdCBzdHJpbmcuIFRoaXMgZm9ybWF0XG4gKiBzdHJpbmcgd2lsbCBiZSB1c2VkIHRvIGludGVycHJldCB0aGUgYGVwb2NoYCBhbmQgcmV0dXJuIGEgZGlzcGxheSBzdHJpbmdcbiAqIGF0IFVUQy5cbiAqIC0gYFNZUzpTVEFOREFSRGA6IFRoZSByZXR1cm5lZCBkaXNwbGF5IHN0cmluZyB3aWxsIGZvbGxvdyB0aGUgYERBVEVfRk9STUFUYFxuICogY29uc3RhbnQgYXQgdGhlIHN5c3RlbSdzIGxvY2FsIHRpbWV6b25lLlxuICogLSBgU1lTOjxmb3JtYXQgc3RyaW5nPmA6IFRoZSByZXR1cm5lZCBkaXNwbGF5IHN0cmluZyB3aWxsIGZvbGxvdyB0aGUgZ2l2ZW5cbiAqIGA8Zm9ybWF0IHN0cmluZz5gIGF0IHRoZSBzeXN0ZW0ncyBsb2NhbCB0aW1lem9uZS5cbiAqIC0gYFVUQzo8Zm9ybWF0IHN0cmluZz5gOiBUaGUgcmV0dXJuZWQgZGlzcGxheSBzdHJpbmcgd2lsbCBmb2xsb3cgdGhlIGdpdmVuXG4gKiBgPGZvcm1hdCBzdHJpbmc+YCBhdCBVVEMuXG4gKlxuICogQHJldHVybnMge251bWJlcnxzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdGltZS5cbiAqL1xuZnVuY3Rpb24gZm9ybWF0VGltZSAoZXBvY2gsIHRyYW5zbGF0ZVRpbWUgPSBmYWxzZSkge1xuICBpZiAodHJhbnNsYXRlVGltZSA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gZXBvY2hcbiAgfVxuXG4gIGNvbnN0IGluc3RhbnQgPSBjcmVhdGVEYXRlKGVwb2NoKVxuXG4gIC8vIElmIHRoZSBEYXRlIGlzIGludmFsaWQsIGRvIG5vdCBhdHRlbXB0IHRvIGZvcm1hdFxuICBpZiAoIWlzVmFsaWREYXRlKGluc3RhbnQpKSB7XG4gICAgcmV0dXJuIGVwb2NoXG4gIH1cblxuICBpZiAodHJhbnNsYXRlVGltZSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBkYXRlZm9ybWF0KGluc3RhbnQsIERBVEVfRk9STUFUX1NJTVBMRSlcbiAgfVxuXG4gIGNvbnN0IHVwcGVyRm9ybWF0ID0gdHJhbnNsYXRlVGltZS50b1VwcGVyQ2FzZSgpXG4gIGlmICh1cHBlckZvcm1hdCA9PT0gJ1NZUzpTVEFOREFSRCcpIHtcbiAgICByZXR1cm4gZGF0ZWZvcm1hdChpbnN0YW50LCBEQVRFX0ZPUk1BVClcbiAgfVxuXG4gIGNvbnN0IHByZWZpeCA9IHVwcGVyRm9ybWF0LnN1YnN0cigwLCA0KVxuICBpZiAocHJlZml4ID09PSAnU1lTOicgfHwgcHJlZml4ID09PSAnVVRDOicpIHtcbiAgICBpZiAocHJlZml4ID09PSAnVVRDOicpIHtcbiAgICAgIHJldHVybiBkYXRlZm9ybWF0KGluc3RhbnQsIHRyYW5zbGF0ZVRpbWUpXG4gICAgfVxuICAgIHJldHVybiBkYXRlZm9ybWF0KGluc3RhbnQsIHRyYW5zbGF0ZVRpbWUuc2xpY2UoNCkpXG4gIH1cblxuICByZXR1cm4gZGF0ZWZvcm1hdChpbnN0YW50LCBgVVRDOiR7dHJhbnNsYXRlVGltZX1gKVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhhbmRsZUN1c3RvbUxldmVsc05hbWVzT3B0c1xuXG4vKipcbiAqIFBhcnNlIGEgQ1NWIHN0cmluZyBvciBvcHRpb25zIG9iamVjdCB0aGF0IG1hcHMgbGV2ZWxcbiAqIGxhYmVscyB0byBsZXZlbCB2YWx1ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBjTGV2ZWxzIEFuIG9iamVjdCBtYXBwaW5nIGxldmVsXG4gKiBuYW1lcyB0byBsZXZlbCB2YWx1ZXMsIGUuZy4gYHsgaW5mbzogMzAsIGRlYnVnOiA2NSB9YCwgb3IgYVxuICogQ1NWIHN0cmluZyBpbiB0aGUgZm9ybWF0IGBsZXZlbF9uYW1lOmxldmVsX3ZhbHVlYCwgZS5nLlxuICogYGluZm86MzAsZGVidWc6NjVgLlxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IEFuIG9iamVjdCBtYXBwaW5nIGxldmVscyBuYW1lcyB0byBsZXZlbCB2YWx1ZXNcbiAqIGUuZy4gYHsgaW5mbzogMzAsIGRlYnVnOiA2NSB9YC5cbiAqL1xuZnVuY3Rpb24gaGFuZGxlQ3VzdG9tTGV2ZWxzTmFtZXNPcHRzIChjTGV2ZWxzKSB7XG4gIGlmICghY0xldmVscykgcmV0dXJuIHt9XG5cbiAgaWYgKHR5cGVvZiBjTGV2ZWxzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBjTGV2ZWxzXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLnJlZHVjZSgoYWdnLCB2YWx1ZSwgaWR4KSA9PiB7XG4gICAgICAgIGNvbnN0IFtsZXZlbE5hbWUsIGxldmVsTnVtID0gaWR4XSA9IHZhbHVlLnNwbGl0KCc6JylcbiAgICAgICAgYWdnW2xldmVsTmFtZS50b0xvd2VyQ2FzZSgpXSA9IGxldmVsTnVtXG4gICAgICAgIHJldHVybiBhZ2dcbiAgICAgIH0sIHt9KVxuICB9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjTGV2ZWxzKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gT2JqZWN0XG4gICAgICAua2V5cyhjTGV2ZWxzKVxuICAgICAgLnJlZHVjZSgoYWdnLCBsZXZlbE5hbWUpID0+IHtcbiAgICAgICAgYWdnW2xldmVsTmFtZS50b0xvd2VyQ2FzZSgpXSA9IGNMZXZlbHNbbGV2ZWxOYW1lXVxuICAgICAgICByZXR1cm4gYWdnXG4gICAgICB9LCB7fSlcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4ge31cbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGhhbmRsZUN1c3RvbUxldmVsc09wdHNcblxuLyoqXG4gKiBQYXJzZSBhIENTViBzdHJpbmcgb3Igb3B0aW9ucyBvYmplY3QgdGhhdCBzcGVjaWZpZXNcbiAqIGNvbmZpZ3VyYXRpb24gZm9yIGN1c3RvbSBsZXZlbHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBjTGV2ZWxzIEFuIG9iamVjdCBtYXBwaW5nIGxldmVsXG4gKiBuYW1lcyB0byB2YWx1ZXMsIGUuZy4gYHsgaW5mbzogMzAsIGRlYnVnOiA2NSB9YCwgb3IgYVxuICogQ1NWIHN0cmluZyBpbiB0aGUgZm9ybWF0IGBsZXZlbF9uYW1lOmxldmVsX3ZhbHVlYCwgZS5nLlxuICogYGluZm86MzAsZGVidWc6NjVgLlxuICpcbiAqIEByZXR1cm5zIHtvYmplY3R9IEFuIG9iamVjdCBtYXBwaW5nIGxldmVscyB0byBsYWJlbHMgdGhhdFxuICogYXBwZWFyIGluIGxvZ3MsIGUuZy4gYHsgJzMwJzogJ0lORk8nLCAnNjUnOiAnREVCVUcnIH1gLlxuICovXG5mdW5jdGlvbiBoYW5kbGVDdXN0b21MZXZlbHNPcHRzIChjTGV2ZWxzKSB7XG4gIGlmICghY0xldmVscykgcmV0dXJuIHt9XG5cbiAgaWYgKHR5cGVvZiBjTGV2ZWxzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBjTGV2ZWxzXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLnJlZHVjZSgoYWdnLCB2YWx1ZSwgaWR4KSA9PiB7XG4gICAgICAgIGNvbnN0IFtsZXZlbE5hbWUsIGxldmVsTnVtID0gaWR4XSA9IHZhbHVlLnNwbGl0KCc6JylcbiAgICAgICAgYWdnW2xldmVsTnVtXSA9IGxldmVsTmFtZS50b1VwcGVyQ2FzZSgpXG4gICAgICAgIHJldHVybiBhZ2dcbiAgICAgIH0sXG4gICAgICB7IGRlZmF1bHQ6ICdVU0VSTFZMJyB9KVxuICB9IGVsc2UgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChjTGV2ZWxzKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICByZXR1cm4gT2JqZWN0XG4gICAgICAua2V5cyhjTGV2ZWxzKVxuICAgICAgLnJlZHVjZSgoYWdnLCBsZXZlbE5hbWUpID0+IHtcbiAgICAgICAgYWdnW2NMZXZlbHNbbGV2ZWxOYW1lXV0gPSBsZXZlbE5hbWUudG9VcHBlckNhc2UoKVxuICAgICAgICByZXR1cm4gYWdnXG4gICAgICB9LCB7IGRlZmF1bHQ6ICdVU0VSTFZMJyB9KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7fVxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gaW50ZXJwcmV0Q29uZGl0aW9uYWxzXG5cbmNvbnN0IGdldFByb3BlcnR5VmFsdWUgPSByZXF1aXJlKCcuL2dldC1wcm9wZXJ0eS12YWx1ZScpXG5cbi8qKlxuICogVHJhbnNsYXRlcyBhbGwgY29uZGl0aW9uYWwgYmxvY2tzIGZyb20gd2l0aGluIHRoZSBtZXNzYWdlRm9ybWF0LiBUcmFuc2xhdGVzXG4gKiBhbnkgbWF0Y2hpbmcge2lmIGtleX17a2V5fXtlbmR9IHN0YXRlbWVudHMgYW5kIHJldHVybnMgZXZlcnl0aGluZyBiZXR3ZWVuXG4gKiBpZiBhbmQgZWxzZSBibG9ja3MgaWYgdGhlIGtleSBwcm92aWRlZCB3YXMgZm91bmQgaW4gbG9nLlxuICpcbiAqIEBwYXJhbSB7TWVzc2FnZUZvcm1hdFN0cmluZ3xNZXNzYWdlRm9ybWF0RnVuY3Rpb259IG1lc3NhZ2VGb3JtYXQgQSBmb3JtYXRcbiAqIHN0cmluZyBvciBmdW5jdGlvbiB0aGF0IGRlZmluZXMgaG93IHRoZSBsb2dnZWQgbWVzc2FnZSBzaG91bGQgYmVcbiAqIGNvbmRpdGlvbmFsbHkgZm9ybWF0dGVkLlxuICogQHBhcmFtIHtvYmplY3R9IGxvZyBUaGUgbG9nIG9iamVjdCB0byBiZSBtb2RpZmllZC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcGFyc2VkIG1lc3NhZ2VGb3JtYXQuXG4gKi9cbmZ1bmN0aW9uIGludGVycHJldENvbmRpdGlvbmFscyAobWVzc2FnZUZvcm1hdCwgbG9nKSB7XG4gIG1lc3NhZ2VGb3JtYXQgPSBtZXNzYWdlRm9ybWF0LnJlcGxhY2UoL3tpZiAoLio/KX0oLio/KXtlbmR9L2csIHJlcGxhY2VyKVxuXG4gIC8vIFJlbW92ZSBub24tdGVybWluYXRlZCBpZiBibG9ja3NcbiAgbWVzc2FnZUZvcm1hdCA9IG1lc3NhZ2VGb3JtYXQucmVwbGFjZSgve2lmICguKj8pfS9nLCAnJylcbiAgLy8gUmVtb3ZlIGZsb2F0aW5nIGVuZCBibG9ja3NcbiAgbWVzc2FnZUZvcm1hdCA9IG1lc3NhZ2VGb3JtYXQucmVwbGFjZSgve2VuZH0vZywgJycpXG5cbiAgcmV0dXJuIG1lc3NhZ2VGb3JtYXQucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2VyIChfLCBrZXksIHZhbHVlKSB7XG4gICAgY29uc3QgcHJvcGVydHlWYWx1ZSA9IGdldFByb3BlcnR5VmFsdWUobG9nLCBrZXkpXG4gICAgaWYgKHByb3BlcnR5VmFsdWUgJiYgdmFsdWUuaW5jbHVkZXMoa2V5KSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UobmV3IFJlZ0V4cCgneycgKyBrZXkgKyAnfScsICdnJyksIHByb3BlcnR5VmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0XG5cbmZ1bmN0aW9uIGlzT2JqZWN0IChpbnB1dCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShpbnB1dCkgPT09ICdbb2JqZWN0IE9iamVjdF0nXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gam9pbkxpbmVzV2l0aEluZGVudGF0aW9uXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gSm9pbkxpbmVzV2l0aEluZGVudGF0aW9uUGFyYW1zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaW5wdXQgVGhlIHN0cmluZyB0byBzcGxpdCBhbmQgcmVmb3JtYXQuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2lkZW50XSBUaGUgaW5kZW50YXRpb24gc3RyaW5nLiBEZWZhdWx0OiBgICAgIGAgKDQgc3BhY2VzKS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbZW9sXSBUaGUgZW5kIG9mIGxpbmUgc2VxdWVuY2UgdG8gdXNlIHdoZW4gcmVqb2luaW5nXG4gKiB0aGUgbGluZXMuIERlZmF1bHQ6IGAnXFxuJ2AuXG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIHN0cmluZyB3aXRoIGxpbmUgc2VwYXJhdG9ycywgZWl0aGVyIGBcXHJcXG5gIG9yIGBcXG5gLCBhZGQgaW5kZW50YXRpb25cbiAqIHRvIGFsbCBsaW5lcyBzdWJzZXF1ZW50IHRvIHRoZSBmaXJzdCBsaW5lIGFuZCByZWpvaW4gdGhlIGxpbmVzIHVzaW5nIGFuXG4gKiBlbmQgb2YgbGluZSBzZXF1ZW5jZS5cbiAqXG4gKiBAcGFyYW0ge0pvaW5MaW5lc1dpdGhJbmRlbnRhdGlvblBhcmFtc30gaW5wdXRcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZyB3aXRoIGxpbmVzIHN1YnNlcXVlbnQgdG8gdGhlIGZpcnN0IGluZGVudGVkXG4gKiB3aXRoIHRoZSBnaXZlbiBpbmRlbnRhdGlvbiBzZXF1ZW5jZS5cbiAqL1xuZnVuY3Rpb24gam9pbkxpbmVzV2l0aEluZGVudGF0aW9uICh7IGlucHV0LCBpZGVudCA9ICcgICAgJywgZW9sID0gJ1xcbicgfSkge1xuICBjb25zdCBsaW5lcyA9IGlucHV0LnNwbGl0KC9cXHI/XFxuLylcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGxpbmVzW2ldID0gaWRlbnQgKyBsaW5lc1tpXVxuICB9XG4gIHJldHVybiBsaW5lcy5qb2luKGVvbClcbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBwYXJzZUZhY3RvcnlPcHRpb25zXG5cbmNvbnN0IHtcbiAgTEVWRUxfTkFNRVNcbn0gPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKVxuY29uc3QgY29sb3JzID0gcmVxdWlyZSgnLi4vY29sb3JzJylcbmNvbnN0IGhhbmRsZUN1c3RvbUxldmVsc09wdHMgPSByZXF1aXJlKCcuL2hhbmRsZS1jdXN0b20tbGV2ZWxzLW9wdHMnKVxuY29uc3QgaGFuZGxlQ3VzdG9tTGV2ZWxzTmFtZXNPcHRzID0gcmVxdWlyZSgnLi9oYW5kbGUtY3VzdG9tLWxldmVscy1uYW1lcy1vcHRzJylcbmNvbnN0IGhhbmRsZUxldmVsTGFiZWxEYXRhID0gcmVxdWlyZSgnLi9nZXQtbGV2ZWwtbGFiZWwtZGF0YScpXG5cbi8qKlxuICogQSBgUHJldHR5Q29udGV4dGAgaXMgYW4gb2JqZWN0IHRvIGJlIHVzZWQgYnkgdGhlIHZhcmlvdXMgZnVuY3Rpb25zIHRoYXRcbiAqIHByb2Nlc3MgbG9nIGRhdGEuIEl0IGlzIGRlcml2ZWQgZnJvbSB0aGUgcHJvdmlkZWQge0BsaW5rIFBpbm9QcmV0dHlPcHRpb25zfS5cbiAqIEl0IG1heSBiZSB1c2VkIGFzIGEgYHRoaXNgIGNvbnRleHQuXG4gKlxuICogQHR5cGVkZWYge29iamVjdH0gUHJldHR5Q29udGV4dFxuICogQHByb3BlcnR5IHtzdHJpbmd9IEVPTCBUaGUgZXNjYXBlIHNlcXVlbmNlIGNob3NlbiBhcyB0aGUgbGluZSB0ZXJtaW5hdG9yLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IElERU5UIFRoZSBzdHJpbmcgdG8gdXNlIGFzIHRoZSBpbmRlbnRhdGlvbiBzZXF1ZW5jZS5cbiAqIEBwcm9wZXJ0eSB7Q29sb3JpemVyRnVuY30gY29sb3JpemVyIEEgY29uZmlndXJlZCBjb2xvcml6ZXIgZnVuY3Rpb24uXG4gKiBAcHJvcGVydHkge0FycmF5W0FycmF5PG51bWJlciwgc3RyaW5nPl19IGN1c3RvbUNvbG9ycyBBIHNldCBvZiBjdXN0b20gY29sb3JcbiAqIG5hbWVzIGFzc29jaWF0ZWQgd2l0aCBsZXZlbCBudW1iZXJzLlxuICogQHByb3BlcnR5IHtvYmplY3R9IGN1c3RvbUxldmVsTmFtZXMgQSBoYXNoIG9mIGxldmVsIG51bWJlcnMgdG8gbGV2ZWwgbmFtZXMsXG4gKiBlLmcuIGB7IDMwOiBcImluZm9cIiB9YC5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjdXN0b21MZXZlbHMgQSBoYXNoIG9mIGxldmVsIG5hbWVzIHRvIGxldmVsIG51bWJlcnMsXG4gKiBlLmcuIGB7IGluZm86IDMwIH1gLlxuICogQHByb3BlcnR5IHtDdXN0b21QcmV0dGlmaWVyc30gY3VzdG9tUHJldHRpZmllcnMgQSBoYXNoIG9mIGN1c3RvbSBwcmV0dGlmaWVyXG4gKiBmdW5jdGlvbnMuXG4gKiBAcHJvcGVydHkge29iamVjdH0gY3VzdG9tUHJvcGVydGllcyBDb21wcmlzZWQgb2YgYGN1c3RvbUxldmVsc2AgYW5kXG4gKiBgY3VzdG9tTGV2ZWxOYW1lc2AgaWYgc3VjaCBvcHRpb25zIGFyZSBwcm92aWRlZC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IGVycm9yTGlrZU9iamVjdEtleXMgVGhlIGtleSBuYW1lcyBpbiB0aGUgbG9nIGRhdGEgdGhhdFxuICogc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgaG9sZGluZyBlcnJvciBvYmplY3RzLlxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gZXJyb3JQcm9wcyBBIGxpc3Qgb2YgZXJyb3Igb2JqZWN0IGtleXMgdGhhdCBzaG91bGQgYmVcbiAqIGluY2x1ZGVkIGluIHRoZSBvdXRwdXQuXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBnZXRMZXZlbExhYmVsRGF0YSBQYXNzIGEgbnVtZXJpYyBsZXZlbCB0byByZXR1cm4gW2xldmVsTGFiZWxTdHJpbmcsbGV2ZWxOdW1dXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGhpZGVPYmplY3QgSW5kaWNhdGVzIHRoZSBwcmV0dGlmaWVyIHNob3VsZCBvbWl0IG9iamVjdHNcbiAqIGluIHRoZSBvdXRwdXQuXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBpZ25vcmVLZXlzIFNldCBvZiBsb2cgZGF0YSBrZXlzIHRvIG9taXQuXG4gKiBAcHJvcGVydHkge3N0cmluZ1tdfSBpbmNsdWRlS2V5cyBPcHBvc2l0ZSBvZiBgaWdub3JlS2V5c2AuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGxldmVsRmlyc3QgSW5kaWNhdGVzIHRoZSBsZXZlbCBzaG91bGQgYmUgcHJpbnRlZCBmaXJzdC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsZXZlbEtleSBOYW1lIG9mIHRoZSBrZXkgaW4gdGhlIGxvZyBkYXRhIHRoYXQgY29udGFpbnNcbiAqIHRoZSBtZXNzYWdlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGxldmVsTGFiZWwgRm9ybWF0IHRva2VuIHRvIHJlcHJlc2VudCB0aGUgcG9zaXRpb24gb2YgdGhlXG4gKiBsZXZlbCBuYW1lIGluIHRoZSBvdXRwdXQgc3RyaW5nLlxuICogQHByb3BlcnR5IHtNZXNzYWdlRm9ybWF0U3RyaW5nfE1lc3NhZ2VGb3JtYXRGdW5jdGlvbn0gbWVzc2FnZUZvcm1hdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IG1lc3NhZ2VLZXkgTmFtZSBvZiB0aGUga2V5IGluIHRoZSBsb2cgZGF0YSB0aGF0IGNvbnRhaW5zXG4gKiB0aGUgbWVzc2FnZS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bWJlcn0gbWluaW11bUxldmVsIFRoZSBtaW5pbXVtIGxvZyBsZXZlbCB0byBwcm9jZXNzXG4gKiBhbmQgb3V0cHV0LlxuICogQHByb3BlcnR5IHtDb2xvcml6ZXJGdW5jfSBvYmplY3RDb2xvcml6ZXJcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc2luZ2xlTGluZSBJbmRpY2F0ZXMgb2JqZWN0cyBzaG91bGQgYmUgcHJpbnRlZCBvbiBhXG4gKiBzaW5nbGUgb3V0cHV0IGxpbmUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdGltZXN0YW1wS2V5IFRoZSBuYW1lIG9mIHRoZSBrZXkgaW4gdGhlIGxvZyBkYXRhIHRoYXRcbiAqIGNvbnRhaW5zIHRoZSBsb2cgdGltZXN0YW1wLlxuICogQHByb3BlcnR5IHtib29sZWFufSB0cmFuc2xhdGVUaW1lIEluZGljYXRlcyBpZiB0aW1lc3RhbXBzIHNob3VsZCBiZVxuICogdHJhbnNsYXRlZCB0byBhIGh1bWFuLXJlYWRhYmxlIHN0cmluZy5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gdXNlT25seUN1c3RvbVByb3BzXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge1Bpbm9QcmV0dHlPcHRpb25zfSBvcHRpb25zIFRoZSB1c2VyIHN1cHBsaWVkIG9iamVjdCBvZiBvcHRpb25zLlxuICpcbiAqIEByZXR1cm5zIHtQcmV0dHlDb250ZXh0fVxuICovXG5mdW5jdGlvbiBwYXJzZUZhY3RvcnlPcHRpb25zIChvcHRpb25zKSB7XG4gIGNvbnN0IEVPTCA9IG9wdGlvbnMuY3JsZiA/ICdcXHJcXG4nIDogJ1xcbidcbiAgY29uc3QgSURFTlQgPSAnICAgICdcbiAgY29uc3Qge1xuICAgIGN1c3RvbVByZXR0aWZpZXJzLFxuICAgIGVycm9yTGlrZU9iamVjdEtleXMsXG4gICAgaGlkZU9iamVjdCxcbiAgICBsZXZlbEZpcnN0LFxuICAgIGxldmVsS2V5LFxuICAgIGxldmVsTGFiZWwsXG4gICAgbWVzc2FnZUZvcm1hdCxcbiAgICBtZXNzYWdlS2V5LFxuICAgIG1pbmltdW1MZXZlbCxcbiAgICBzaW5nbGVMaW5lLFxuICAgIHRpbWVzdGFtcEtleSxcbiAgICB0cmFuc2xhdGVUaW1lXG4gIH0gPSBvcHRpb25zXG4gIGNvbnN0IGVycm9yUHJvcHMgPSBvcHRpb25zLmVycm9yUHJvcHMuc3BsaXQoJywnKVxuICBjb25zdCB1c2VPbmx5Q3VzdG9tUHJvcHMgPSB0eXBlb2Ygb3B0aW9ucy51c2VPbmx5Q3VzdG9tUHJvcHMgPT09ICdib29sZWFuJ1xuICAgID8gb3B0aW9ucy51c2VPbmx5Q3VzdG9tUHJvcHNcbiAgICA6IChvcHRpb25zLnVzZU9ubHlDdXN0b21Qcm9wcyA9PT0gJ3RydWUnKVxuICBjb25zdCBjdXN0b21MZXZlbHMgPSBoYW5kbGVDdXN0b21MZXZlbHNPcHRzKG9wdGlvbnMuY3VzdG9tTGV2ZWxzKVxuICBjb25zdCBjdXN0b21MZXZlbE5hbWVzID0gaGFuZGxlQ3VzdG9tTGV2ZWxzTmFtZXNPcHRzKG9wdGlvbnMuY3VzdG9tTGV2ZWxzKVxuICBjb25zdCBnZXRMZXZlbExhYmVsRGF0YSA9IGhhbmRsZUxldmVsTGFiZWxEYXRhKHVzZU9ubHlDdXN0b21Qcm9wcywgY3VzdG9tTGV2ZWxzLCBjdXN0b21MZXZlbE5hbWVzKVxuXG4gIGxldCBjdXN0b21Db2xvcnNcbiAgaWYgKG9wdGlvbnMuY3VzdG9tQ29sb3JzKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmN1c3RvbUNvbG9ycyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGN1c3RvbUNvbG9ycyA9IG9wdGlvbnMuY3VzdG9tQ29sb3JzLnNwbGl0KCcsJykucmVkdWNlKChhZ2csIHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbnN0IFtsZXZlbCwgY29sb3JdID0gdmFsdWUuc3BsaXQoJzonKVxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB1c2VPbmx5Q3VzdG9tUHJvcHNcbiAgICAgICAgICA/IG9wdGlvbnMuY3VzdG9tTGV2ZWxzXG4gICAgICAgICAgOiBjdXN0b21MZXZlbE5hbWVzW2xldmVsXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgIGNvbnN0IGxldmVsTnVtID0gY29uZGl0aW9uXG4gICAgICAgICAgPyBjdXN0b21MZXZlbE5hbWVzW2xldmVsXVxuICAgICAgICAgIDogTEVWRUxfTkFNRVNbbGV2ZWxdXG4gICAgICAgIGNvbnN0IGNvbG9ySWR4ID0gbGV2ZWxOdW0gIT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gbGV2ZWxOdW1cbiAgICAgICAgICA6IGxldmVsXG4gICAgICAgIGFnZy5wdXNoKFtjb2xvcklkeCwgY29sb3JdKVxuICAgICAgICByZXR1cm4gYWdnXG4gICAgICB9LCBbXSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zLmN1c3RvbUNvbG9ycyA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGN1c3RvbUNvbG9ycyA9IE9iamVjdC5rZXlzKG9wdGlvbnMuY3VzdG9tQ29sb3JzKS5yZWR1Y2UoKGFnZywgdmFsdWUpID0+IHtcbiAgICAgICAgY29uc3QgW2xldmVsLCBjb2xvcl0gPSBbdmFsdWUsIG9wdGlvbnMuY3VzdG9tQ29sb3JzW3ZhbHVlXV1cbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdXNlT25seUN1c3RvbVByb3BzXG4gICAgICAgICAgPyBvcHRpb25zLmN1c3RvbUxldmVsc1xuICAgICAgICAgIDogY3VzdG9tTGV2ZWxOYW1lc1tsZXZlbF0gIT09IHVuZGVmaW5lZFxuICAgICAgICBjb25zdCBsZXZlbE51bSA9IGNvbmRpdGlvblxuICAgICAgICAgID8gY3VzdG9tTGV2ZWxOYW1lc1tsZXZlbF1cbiAgICAgICAgICA6IExFVkVMX05BTUVTW2xldmVsXVxuICAgICAgICBjb25zdCBjb2xvcklkeCA9IGxldmVsTnVtICE9PSB1bmRlZmluZWRcbiAgICAgICAgICA/IGxldmVsTnVtXG4gICAgICAgICAgOiBsZXZlbFxuICAgICAgICBhZ2cucHVzaChbY29sb3JJZHgsIGNvbG9yXSlcbiAgICAgICAgcmV0dXJuIGFnZ1xuICAgICAgfSwgW10pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignb3B0aW9ucy5jdXN0b21Db2xvcnMgbXVzdCBiZSBvZiB0eXBlIHN0cmluZyBvciBvYmplY3QuJylcbiAgICB9XG4gIH1cblxuICBjb25zdCBjdXN0b21Qcm9wZXJ0aWVzID0geyBjdXN0b21MZXZlbHMsIGN1c3RvbUxldmVsTmFtZXMgfVxuICBpZiAodXNlT25seUN1c3RvbVByb3BzID09PSB0cnVlICYmICFvcHRpb25zLmN1c3RvbUxldmVscykge1xuICAgIGN1c3RvbVByb3BlcnRpZXMuY3VzdG9tTGV2ZWxzID0gdW5kZWZpbmVkXG4gICAgY3VzdG9tUHJvcGVydGllcy5jdXN0b21MZXZlbE5hbWVzID0gdW5kZWZpbmVkXG4gIH1cblxuICBjb25zdCBpbmNsdWRlS2V5cyA9IG9wdGlvbnMuaW5jbHVkZSAhPT0gdW5kZWZpbmVkXG4gICAgPyBuZXcgU2V0KG9wdGlvbnMuaW5jbHVkZS5zcGxpdCgnLCcpKVxuICAgIDogdW5kZWZpbmVkXG4gIGNvbnN0IGlnbm9yZUtleXMgPSAoIWluY2x1ZGVLZXlzICYmIG9wdGlvbnMuaWdub3JlKVxuICAgID8gbmV3IFNldChvcHRpb25zLmlnbm9yZS5zcGxpdCgnLCcpKVxuICAgIDogdW5kZWZpbmVkXG5cbiAgY29uc3QgY29sb3JpemVyID0gY29sb3JzKG9wdGlvbnMuY29sb3JpemUsIGN1c3RvbUNvbG9ycywgdXNlT25seUN1c3RvbVByb3BzKVxuICBjb25zdCBvYmplY3RDb2xvcml6ZXIgPSBvcHRpb25zLmNvbG9yaXplT2JqZWN0c1xuICAgID8gY29sb3JpemVyXG4gICAgOiBjb2xvcnMoZmFsc2UsIFtdLCBmYWxzZSlcblxuICByZXR1cm4ge1xuICAgIEVPTCxcbiAgICBJREVOVCxcbiAgICBjb2xvcml6ZXIsXG4gICAgY3VzdG9tQ29sb3JzLFxuICAgIGN1c3RvbUxldmVsTmFtZXMsXG4gICAgY3VzdG9tTGV2ZWxzLFxuICAgIGN1c3RvbVByZXR0aWZpZXJzLFxuICAgIGN1c3RvbVByb3BlcnRpZXMsXG4gICAgZXJyb3JMaWtlT2JqZWN0S2V5cyxcbiAgICBlcnJvclByb3BzLFxuICAgIGdldExldmVsTGFiZWxEYXRhLFxuICAgIGhpZGVPYmplY3QsXG4gICAgaWdub3JlS2V5cyxcbiAgICBpbmNsdWRlS2V5cyxcbiAgICBsZXZlbEZpcnN0LFxuICAgIGxldmVsS2V5LFxuICAgIGxldmVsTGFiZWwsXG4gICAgbWVzc2FnZUZvcm1hdCxcbiAgICBtZXNzYWdlS2V5LFxuICAgIG1pbmltdW1MZXZlbCxcbiAgICBvYmplY3RDb2xvcml6ZXIsXG4gICAgc2luZ2xlTGluZSxcbiAgICB0aW1lc3RhbXBLZXksXG4gICAgdHJhbnNsYXRlVGltZSxcbiAgICB1c2VPbmx5Q3VzdG9tUHJvcHNcbiAgfVxufVxuIiwgIm1vZHVsZS5leHBvcnRzID0gc3RyaW5naWZ5XG5zdHJpbmdpZnkuZGVmYXVsdCA9IHN0cmluZ2lmeVxuc3RyaW5naWZ5LnN0YWJsZSA9IGRldGVybWluaXN0aWNTdHJpbmdpZnlcbnN0cmluZ2lmeS5zdGFibGVTdHJpbmdpZnkgPSBkZXRlcm1pbmlzdGljU3RyaW5naWZ5XG5cbnZhciBMSU1JVF9SRVBMQUNFX05PREUgPSAnWy4uLl0nXG52YXIgQ0lSQ1VMQVJfUkVQTEFDRV9OT0RFID0gJ1tDaXJjdWxhcl0nXG5cbnZhciBhcnIgPSBbXVxudmFyIHJlcGxhY2VyU3RhY2sgPSBbXVxuXG5mdW5jdGlvbiBkZWZhdWx0T3B0aW9ucyAoKSB7XG4gIHJldHVybiB7XG4gICAgZGVwdGhMaW1pdDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVIsXG4gICAgZWRnZXNMaW1pdDogTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJcbiAgfVxufVxuXG4vLyBSZWd1bGFyIHN0cmluZ2lmeVxuZnVuY3Rpb24gc3RyaW5naWZ5IChvYmosIHJlcGxhY2VyLCBzcGFjZXIsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJykge1xuICAgIG9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucygpXG4gIH1cblxuICBkZWNpcmMob2JqLCAnJywgMCwgW10sIHVuZGVmaW5lZCwgMCwgb3B0aW9ucylcbiAgdmFyIHJlc1xuICB0cnkge1xuICAgIGlmIChyZXBsYWNlclN0YWNrLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmVzID0gSlNPTi5zdHJpbmdpZnkob2JqLCByZXBsYWNlciwgc3BhY2VyKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXMgPSBKU09OLnN0cmluZ2lmeShvYmosIHJlcGxhY2VHZXR0ZXJWYWx1ZXMocmVwbGFjZXIpLCBzcGFjZXIpXG4gICAgfVxuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KCdbdW5hYmxlIHRvIHNlcmlhbGl6ZSwgY2lyY3VsYXIgcmVmZXJlbmNlIGlzIHRvbyBjb21wbGV4IHRvIGFuYWx5emVdJylcbiAgfSBmaW5hbGx5IHtcbiAgICB3aGlsZSAoYXJyLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdmFyIHBhcnQgPSBhcnIucG9wKClcbiAgICAgIGlmIChwYXJ0Lmxlbmd0aCA9PT0gNCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocGFydFswXSwgcGFydFsxXSwgcGFydFszXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRbMF1bcGFydFsxXV0gPSBwYXJ0WzJdXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gc2V0UmVwbGFjZSAocmVwbGFjZSwgdmFsLCBrLCBwYXJlbnQpIHtcbiAgdmFyIHByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocGFyZW50LCBrKVxuICBpZiAocHJvcGVydHlEZXNjcmlwdG9yLmdldCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHByb3BlcnR5RGVzY3JpcHRvci5jb25maWd1cmFibGUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwYXJlbnQsIGssIHsgdmFsdWU6IHJlcGxhY2UgfSlcbiAgICAgIGFyci5wdXNoKFtwYXJlbnQsIGssIHZhbCwgcHJvcGVydHlEZXNjcmlwdG9yXSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmVwbGFjZXJTdGFjay5wdXNoKFt2YWwsIGssIHJlcGxhY2VdKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwYXJlbnRba10gPSByZXBsYWNlXG4gICAgYXJyLnB1c2goW3BhcmVudCwgaywgdmFsXSlcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWNpcmMgKHZhbCwgaywgZWRnZUluZGV4LCBzdGFjaywgcGFyZW50LCBkZXB0aCwgb3B0aW9ucykge1xuICBkZXB0aCArPSAxXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgIT09IG51bGwpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzdGFja1tpXSA9PT0gdmFsKSB7XG4gICAgICAgIHNldFJlcGxhY2UoQ0lSQ1VMQVJfUkVQTEFDRV9OT0RFLCB2YWwsIGssIHBhcmVudClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgdHlwZW9mIG9wdGlvbnMuZGVwdGhMaW1pdCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIGRlcHRoID4gb3B0aW9ucy5kZXB0aExpbWl0XG4gICAgKSB7XG4gICAgICBzZXRSZXBsYWNlKExJTUlUX1JFUExBQ0VfTk9ERSwgdmFsLCBrLCBwYXJlbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygb3B0aW9ucy5lZGdlc0xpbWl0ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgZWRnZUluZGV4ICsgMSA+IG9wdGlvbnMuZWRnZXNMaW1pdFxuICAgICkge1xuICAgICAgc2V0UmVwbGFjZShMSU1JVF9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc3RhY2sucHVzaCh2YWwpXG4gICAgLy8gT3B0aW1pemUgZm9yIEFycmF5cy4gQmlnIGFycmF5cyBjb3VsZCBraWxsIHRoZSBwZXJmb3JtYW5jZSBvdGhlcndpc2UhXG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgZm9yIChpID0gMDsgaSA8IHZhbC5sZW5ndGg7IGkrKykge1xuICAgICAgICBkZWNpcmModmFsW2ldLCBpLCBpLCBzdGFjaywgdmFsLCBkZXB0aCwgb3B0aW9ucylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWwpXG4gICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIga2V5ID0ga2V5c1tpXVxuICAgICAgICBkZWNpcmModmFsW2tleV0sIGtleSwgaSwgc3RhY2ssIHZhbCwgZGVwdGgsIG9wdGlvbnMpXG4gICAgICB9XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpXG4gIH1cbn1cblxuLy8gU3RhYmxlLXN0cmluZ2lmeVxuZnVuY3Rpb24gY29tcGFyZUZ1bmN0aW9uIChhLCBiKSB7XG4gIGlmIChhIDwgYikge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChhID4gYikge1xuICAgIHJldHVybiAxXG4gIH1cbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5pc3RpY1N0cmluZ2lmeSAob2JqLCByZXBsYWNlciwgc3BhY2VyLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zID0gZGVmYXVsdE9wdGlvbnMoKVxuICB9XG5cbiAgdmFyIHRtcCA9IGRldGVybWluaXN0aWNEZWNpcmMob2JqLCAnJywgMCwgW10sIHVuZGVmaW5lZCwgMCwgb3B0aW9ucykgfHwgb2JqXG4gIHZhciByZXNcbiAgdHJ5IHtcbiAgICBpZiAocmVwbGFjZXJTdGFjay5sZW5ndGggPT09IDApIHtcbiAgICAgIHJlcyA9IEpTT04uc3RyaW5naWZ5KHRtcCwgcmVwbGFjZXIsIHNwYWNlcilcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzID0gSlNPTi5zdHJpbmdpZnkodG1wLCByZXBsYWNlR2V0dGVyVmFsdWVzKHJlcGxhY2VyKSwgc3BhY2VyKVxuICAgIH1cbiAgfSBjYXRjaCAoXykge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSgnW3VuYWJsZSB0byBzZXJpYWxpemUsIGNpcmN1bGFyIHJlZmVyZW5jZSBpcyB0b28gY29tcGxleCB0byBhbmFseXplXScpXG4gIH0gZmluYWxseSB7XG4gICAgLy8gRW5zdXJlIHRoYXQgd2UgcmVzdG9yZSB0aGUgb2JqZWN0IGFzIGl0IHdhcy5cbiAgICB3aGlsZSAoYXJyLmxlbmd0aCAhPT0gMCkge1xuICAgICAgdmFyIHBhcnQgPSBhcnIucG9wKClcbiAgICAgIGlmIChwYXJ0Lmxlbmd0aCA9PT0gNCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocGFydFswXSwgcGFydFsxXSwgcGFydFszXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnRbMF1bcGFydFsxXV0gPSBwYXJ0WzJdXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5pc3RpY0RlY2lyYyAodmFsLCBrLCBlZGdlSW5kZXgsIHN0YWNrLCBwYXJlbnQsIGRlcHRoLCBvcHRpb25zKSB7XG4gIGRlcHRoICs9IDFcbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIHZhbCAhPT0gbnVsbCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHN0YWNrW2ldID09PSB2YWwpIHtcbiAgICAgICAgc2V0UmVwbGFjZShDSVJDVUxBUl9SRVBMQUNFX05PREUsIHZhbCwgaywgcGFyZW50KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlb2YgdmFsLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICB0eXBlb2Ygb3B0aW9ucy5kZXB0aExpbWl0ICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgZGVwdGggPiBvcHRpb25zLmRlcHRoTGltaXRcbiAgICApIHtcbiAgICAgIHNldFJlcGxhY2UoTElNSVRfUkVQTEFDRV9OT0RFLCB2YWwsIGssIHBhcmVudClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHR5cGVvZiBvcHRpb25zLmVkZ2VzTGltaXQgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICBlZGdlSW5kZXggKyAxID4gb3B0aW9ucy5lZGdlc0xpbWl0XG4gICAgKSB7XG4gICAgICBzZXRSZXBsYWNlKExJTUlUX1JFUExBQ0VfTk9ERSwgdmFsLCBrLCBwYXJlbnQpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBzdGFjay5wdXNoKHZhbClcbiAgICAvLyBPcHRpbWl6ZSBmb3IgQXJyYXlzLiBCaWcgYXJyYXlzIGNvdWxkIGtpbGwgdGhlIHBlcmZvcm1hbmNlIG90aGVyd2lzZSFcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgdmFsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRldGVybWluaXN0aWNEZWNpcmModmFsW2ldLCBpLCBpLCBzdGFjaywgdmFsLCBkZXB0aCwgb3B0aW9ucylcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ3JlYXRlIGEgdGVtcG9yYXJ5IG9iamVjdCBpbiB0aGUgcmVxdWlyZWQgd2F5XG4gICAgICB2YXIgdG1wID0ge31cbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsKS5zb3J0KGNvbXBhcmVGdW5jdGlvbilcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzW2ldXG4gICAgICAgIGRldGVybWluaXN0aWNEZWNpcmModmFsW2tleV0sIGtleSwgaSwgc3RhY2ssIHZhbCwgZGVwdGgsIG9wdGlvbnMpXG4gICAgICAgIHRtcFtrZXldID0gdmFsW2tleV1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGFyZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcnIucHVzaChbcGFyZW50LCBrLCB2YWxdKVxuICAgICAgICBwYXJlbnRba10gPSB0bXBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0bXBcbiAgICAgIH1cbiAgICB9XG4gICAgc3RhY2sucG9wKClcbiAgfVxufVxuXG4vLyB3cmFwcyByZXBsYWNlciBmdW5jdGlvbiB0byBoYW5kbGUgdmFsdWVzIHdlIGNvdWxkbid0IHJlcGxhY2Vcbi8vIGFuZCBtYXJrIHRoZW0gYXMgcmVwbGFjZWQgdmFsdWVcbmZ1bmN0aW9uIHJlcGxhY2VHZXR0ZXJWYWx1ZXMgKHJlcGxhY2VyKSB7XG4gIHJlcGxhY2VyID1cbiAgICB0eXBlb2YgcmVwbGFjZXIgIT09ICd1bmRlZmluZWQnXG4gICAgICA/IHJlcGxhY2VyXG4gICAgICA6IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgICAgIHJldHVybiB2XG4gICAgICB9XG4gIHJldHVybiBmdW5jdGlvbiAoa2V5LCB2YWwpIHtcbiAgICBpZiAocmVwbGFjZXJTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcGxhY2VyU3RhY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHBhcnQgPSByZXBsYWNlclN0YWNrW2ldXG4gICAgICAgIGlmIChwYXJ0WzFdID09PSBrZXkgJiYgcGFydFswXSA9PT0gdmFsKSB7XG4gICAgICAgICAgdmFsID0gcGFydFsyXVxuICAgICAgICAgIHJlcGxhY2VyU3RhY2suc3BsaWNlKGksIDEpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbClcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0aWZ5RXJyb3JcblxuY29uc3Qgam9pbkxpbmVzV2l0aEluZGVudGF0aW9uID0gcmVxdWlyZSgnLi9qb2luLWxpbmVzLXdpdGgtaW5kZW50YXRpb24nKVxuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFByZXR0aWZ5RXJyb3JQYXJhbXNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBrZXlOYW1lIFRoZSBrZXkgYXNzaWduZWQgdG8gdGhpcyBlcnJvciBpbiB0aGUgbG9nIG9iamVjdC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBsaW5lcyBUaGUgU1RSSU5HSUZJRUQgZXJyb3IuIElmIHRoZSBlcnJvciBmaWVsZCBoYXMgYVxuICogIGN1c3RvbSBwcmV0dGlmaWVyLCB0aGF0IHNob3VsZCBiZSBwcmUtYXBwbGllZCBhcyB3ZWxsLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkZW50IFRoZSBpbmRlbnRhdGlvbiBzZXF1ZW5jZSB0byB1c2UuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZW9sIFRoZSBFT0wgc2VxdWVuY2UgdG8gdXNlLlxuICovXG5cbi8qKlxuICogUHJldHRpZmllcyBhbiBlcnJvciBzdHJpbmcgaW50byBhIG11bHRpLWxpbmUgZm9ybWF0LlxuICpcbiAqIEBwYXJhbSB7UHJldHRpZnlFcnJvclBhcmFtc30gaW5wdXRcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiBwcmV0dGlmeUVycm9yICh7IGtleU5hbWUsIGxpbmVzLCBlb2wsIGlkZW50IH0pIHtcbiAgbGV0IHJlc3VsdCA9ICcnXG4gIGNvbnN0IGpvaW5lZExpbmVzID0gam9pbkxpbmVzV2l0aEluZGVudGF0aW9uKHsgaW5wdXQ6IGxpbmVzLCBpZGVudCwgZW9sIH0pXG4gIGNvbnN0IHNwbGl0TGluZXMgPSBgJHtpZGVudH0ke2tleU5hbWV9OiAke2pvaW5lZExpbmVzfSR7ZW9sfWAuc3BsaXQoZW9sKVxuXG4gIGZvciAobGV0IGogPSAwOyBqIDwgc3BsaXRMaW5lcy5sZW5ndGg7IGogKz0gMSkge1xuICAgIGlmIChqICE9PSAwKSByZXN1bHQgKz0gZW9sXG5cbiAgICBjb25zdCBsaW5lID0gc3BsaXRMaW5lc1tqXVxuICAgIGlmICgvXlxccypcInN0YWNrXCIvLnRlc3QobGluZSkpIHtcbiAgICAgIGNvbnN0IG1hdGNoZXMgPSAvXihcXHMqXCJzdGFja1wiOilcXHMqKFwiLipcIiksPyQvLmV4ZWMobGluZSlcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICBjb25zdCBpbmRlbnRTaXplID0gL15cXHMqLy5leGVjKGxpbmUpWzBdLmxlbmd0aCArIDRcbiAgICAgICAgY29uc3QgaW5kZW50YXRpb24gPSAnICcucmVwZWF0KGluZGVudFNpemUpXG4gICAgICAgIGNvbnN0IHN0YWNrTWVzc2FnZSA9IG1hdGNoZXNbMl1cbiAgICAgICAgcmVzdWx0ICs9IG1hdGNoZXNbMV0gKyBlb2wgKyBpbmRlbnRhdGlvbiArIEpTT04ucGFyc2Uoc3RhY2tNZXNzYWdlKS5yZXBsYWNlKC9cXG4vZywgZW9sICsgaW5kZW50YXRpb24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHQgKz0gbGluZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQgKz0gbGluZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBwcmV0dGlmeU9iamVjdFxuXG5jb25zdCB7XG4gIExPR0dFUl9LRVlTXG59ID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJylcblxuY29uc3Qgc3RyaW5naWZ5U2FmZSA9IHJlcXVpcmUoJ2Zhc3Qtc2FmZS1zdHJpbmdpZnknKVxuY29uc3Qgam9pbkxpbmVzV2l0aEluZGVudGF0aW9uID0gcmVxdWlyZSgnLi9qb2luLWxpbmVzLXdpdGgtaW5kZW50YXRpb24nKVxuY29uc3QgcHJldHRpZnlFcnJvciA9IHJlcXVpcmUoJy4vcHJldHRpZnktZXJyb3InKVxuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFByZXR0aWZ5T2JqZWN0UGFyYW1zXG4gKiBAcHJvcGVydHkge29iamVjdH0gbG9nIFRoZSBvYmplY3QgdG8gcHJldHRpZnkuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtleGNsdWRlTG9nZ2VyS2V5c10gSW5kaWNhdGVzIGlmIGtub3duIGxvZ2dlciBzcGVjaWZpY1xuICoga2V5cyBzaG91bGQgYmUgZXhjbHVkZWQgZnJvbSBwcmV0dGlmaWNhdGlvbi4gRGVmYXVsdDogYHRydWVgLlxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gW3NraXBLZXlzXSBBIHNldCBvZiBvYmplY3Qga2V5cyB0byBleGNsdWRlIGZyb20gdGhlXG4gKiAgKiBwcmV0dGlmaWVkIHJlc3VsdC4gRGVmYXVsdDogYFtdYC5cbiAqIEBwcm9wZXJ0eSB7UHJldHR5Q29udGV4dH0gY29udGV4dCBUaGUgY29udGV4dCBvYmplY3QgYnVpbHQgZnJvbSBwYXJzaW5nXG4gKiB0aGUgb3B0aW9ucy5cbiAqL1xuXG4vKipcbiAqIFByZXR0aWZpZXMgYSBzdGFuZGFyZCBvYmplY3QuIFNwZWNpYWwgY2FyZSBpcyB0YWtlbiB3aGVuIHByb2Nlc3NpbmcgdGhlIG9iamVjdFxuICogdG8gaGFuZGxlIGNoaWxkIG9iamVjdHMgdGhhdCBhcmUgYXR0YWNoZWQgdG8ga2V5cyBrbm93biB0byBjb250YWluIGVycm9yXG4gKiBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSB7UHJldHRpZnlPYmplY3RQYXJhbXN9IGlucHV0XG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHByZXR0aWZpZWQgc3RyaW5nLiBUaGlzIGNhbiBiZSBhcyBsaXR0bGUgYXMgYCcnYCBpZlxuICogdGhlcmUgd2FzIG5vdGhpbmcgdG8gcHJldHRpZnkuXG4gKi9cbmZ1bmN0aW9uIHByZXR0aWZ5T2JqZWN0ICh7XG4gIGxvZyxcbiAgZXhjbHVkZUxvZ2dlcktleXMgPSB0cnVlLFxuICBza2lwS2V5cyA9IFtdLFxuICBjb250ZXh0XG59KSB7XG4gIGNvbnN0IHtcbiAgICBFT0w6IGVvbCxcbiAgICBJREVOVDogaWRlbnQsXG4gICAgY3VzdG9tUHJldHRpZmllcnMsXG4gICAgZXJyb3JMaWtlT2JqZWN0S2V5czogZXJyb3JMaWtlS2V5cyxcbiAgICBvYmplY3RDb2xvcml6ZXIsXG4gICAgc2luZ2xlTGluZSxcbiAgICBjb2xvcml6ZXJcbiAgfSA9IGNvbnRleHRcbiAgY29uc3Qga2V5c1RvSWdub3JlID0gW10uY29uY2F0KHNraXBLZXlzKVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gIGlmIChleGNsdWRlTG9nZ2VyS2V5cyA9PT0gdHJ1ZSkgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoa2V5c1RvSWdub3JlLCBMT0dHRVJfS0VZUylcblxuICBsZXQgcmVzdWx0ID0gJydcblxuICAvLyBTcGxpdCBvYmplY3Qga2V5cyBpbnRvIHR3byBjYXRlZ29yaWVzOiBlcnJvciBhbmQgbm9uLWVycm9yXG4gIGNvbnN0IHsgcGxhaW4sIGVycm9ycyB9ID0gT2JqZWN0LmVudHJpZXMobG9nKS5yZWR1Y2UoKHsgcGxhaW4sIGVycm9ycyB9LCBbaywgdl0pID0+IHtcbiAgICBpZiAoa2V5c1RvSWdub3JlLmluY2x1ZGVzKGspID09PSBmYWxzZSkge1xuICAgICAgLy8gUHJlLWFwcGx5IGN1c3RvbSBwcmV0dGlmaWVycywgYmVjYXVzZSBhbGwgMyBjYXNlcyBiZWxvdyB3aWxsIG5lZWQgdGhpc1xuICAgICAgY29uc3QgcHJldHR5ID0gdHlwZW9mIGN1c3RvbVByZXR0aWZpZXJzW2tdID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gY3VzdG9tUHJldHRpZmllcnNba10odiwgaywgbG9nLCB7IGNvbG9yczogY29sb3JpemVyLmNvbG9ycyB9KVxuICAgICAgICA6IHZcbiAgICAgIGlmIChlcnJvckxpa2VLZXlzLmluY2x1ZGVzKGspKSB7XG4gICAgICAgIGVycm9yc1trXSA9IHByZXR0eVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGxhaW5ba10gPSBwcmV0dHlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgcGxhaW4sIGVycm9ycyB9XG4gIH0sIHsgcGxhaW46IHt9LCBlcnJvcnM6IHt9IH0pXG5cbiAgaWYgKHNpbmdsZUxpbmUpIHtcbiAgICAvLyBTdHJpbmdpZnkgdGhlIGVudGlyZSBvYmplY3QgYXMgYSBzaW5nbGUgSlNPTiBsaW5lXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICBpZiAoT2JqZWN0LmtleXMocGxhaW4pLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3VsdCArPSBvYmplY3RDb2xvcml6ZXIuZ3JleU1lc3NhZ2Uoc3RyaW5naWZ5U2FmZShwbGFpbikpXG4gICAgfVxuICAgIHJlc3VsdCArPSBlb2xcbiAgICAvLyBBdm9pZCBwcmludGluZyB0aGUgZXNjYXBlIGNoYXJhY3RlciBvbiBlc2NhcGVkIGJhY2tzbGFzaGVzLlxuICAgIHJlc3VsdCA9IHJlc3VsdC5yZXBsYWNlKC9cXFxcXFxcXC9naSwgJ1xcXFwnKVxuICB9IGVsc2Uge1xuICAgIC8vIFB1dCBlYWNoIG9iamVjdCBlbnRyeSBvbiBpdHMgb3duIGxpbmVcbiAgICBPYmplY3QuZW50cmllcyhwbGFpbikuZm9yRWFjaCgoW2tleU5hbWUsIGtleVZhbHVlXSkgPT4ge1xuICAgICAgLy8gY3VzdG9tIHByZXR0aWZpZXJzIGFyZSBhbHJlYWR5IGFwcGxpZWQgYWJvdmUsIHNvIHdlIGNhbiBza2lwIGl0IG5vd1xuICAgICAgbGV0IGxpbmVzID0gdHlwZW9mIGN1c3RvbVByZXR0aWZpZXJzW2tleU5hbWVdID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8ga2V5VmFsdWVcbiAgICAgICAgOiBzdHJpbmdpZnlTYWZlKGtleVZhbHVlLCBudWxsLCAyKVxuXG4gICAgICBpZiAobGluZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG5cbiAgICAgIC8vIEF2b2lkIHByaW50aW5nIHRoZSBlc2NhcGUgY2hhcmFjdGVyIG9uIGVzY2FwZWQgYmFja3NsYXNoZXMuXG4gICAgICBsaW5lcyA9IGxpbmVzLnJlcGxhY2UoL1xcXFxcXFxcL2dpLCAnXFxcXCcpXG5cbiAgICAgIGNvbnN0IGpvaW5lZExpbmVzID0gam9pbkxpbmVzV2l0aEluZGVudGF0aW9uKHsgaW5wdXQ6IGxpbmVzLCBpZGVudCwgZW9sIH0pXG4gICAgICByZXN1bHQgKz0gYCR7aWRlbnR9JHtvYmplY3RDb2xvcml6ZXIucHJvcGVydHkoa2V5TmFtZSl9OiR7am9pbmVkTGluZXMuc3RhcnRzV2l0aChlb2wpID8gJycgOiAnICd9JHtqb2luZWRMaW5lc30ke2VvbH1gXG4gICAgfSlcbiAgfVxuXG4gIC8vIEVycm9yc1xuICBPYmplY3QuZW50cmllcyhlcnJvcnMpLmZvckVhY2goKFtrZXlOYW1lLCBrZXlWYWx1ZV0pID0+IHtcbiAgICAvLyBjdXN0b20gcHJldHRpZmllcnMgYXJlIGFscmVhZHkgYXBwbGllZCBhYm92ZSwgc28gd2UgY2FuIHNraXAgaXQgbm93XG4gICAgY29uc3QgbGluZXMgPSB0eXBlb2YgY3VzdG9tUHJldHRpZmllcnNba2V5TmFtZV0gPT09ICdmdW5jdGlvbidcbiAgICAgID8ga2V5VmFsdWVcbiAgICAgIDogc3RyaW5naWZ5U2FmZShrZXlWYWx1ZSwgbnVsbCwgMilcblxuICAgIGlmIChsaW5lcyA9PT0gdW5kZWZpbmVkKSByZXR1cm5cblxuICAgIHJlc3VsdCArPSBwcmV0dGlmeUVycm9yKHsga2V5TmFtZSwgbGluZXMsIGVvbCwgaWRlbnQgfSlcbiAgfSlcblxuICByZXR1cm4gcmVzdWx0XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gcHJldHRpZnlFcnJvckxvZ1xuXG5jb25zdCB7XG4gIExPR0dFUl9LRVlTXG59ID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzJylcblxuY29uc3QgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzLW9iamVjdCcpXG5jb25zdCBqb2luTGluZXNXaXRoSW5kZW50YXRpb24gPSByZXF1aXJlKCcuL2pvaW4tbGluZXMtd2l0aC1pbmRlbnRhdGlvbicpXG5jb25zdCBwcmV0dGlmeU9iamVjdCA9IHJlcXVpcmUoJy4vcHJldHRpZnktb2JqZWN0JylcblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQcmV0dGlmeUVycm9yTG9nUGFyYW1zXG4gKiBAcHJvcGVydHkge29iamVjdH0gbG9nIFRoZSBlcnJvciBsb2cgdG8gcHJldHRpZnkuXG4gKiBAcHJvcGVydHkge1ByZXR0eUNvbnRleHR9IGNvbnRleHQgVGhlIGNvbnRleHQgb2JqZWN0IGJ1aWx0IGZyb20gcGFyc2luZ1xuICogdGhlIG9wdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBHaXZlbiBhIGxvZyBvYmplY3QgdGhhdCBoYXMgYSBgdHlwZTogJ0Vycm9yJ2Aga2V5LCBwcmV0dGlmeSB0aGUgb2JqZWN0IGFuZFxuICogcmV0dXJuIHRoZSByZXN1bHQuIEluIG90aGVyXG4gKlxuICogQHBhcmFtIHtQcmV0dGlmeUVycm9yTG9nUGFyYW1zfSBpbnB1dFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgc3RyaW5nIHRoYXQgcmVwcmVzZW50cyB0aGUgcHJldHRpZmllZCBlcnJvciBsb2cuXG4gKi9cbmZ1bmN0aW9uIHByZXR0aWZ5RXJyb3JMb2cgKHsgbG9nLCBjb250ZXh0IH0pIHtcbiAgY29uc3Qge1xuICAgIEVPTDogZW9sLFxuICAgIElERU5UOiBpZGVudCxcbiAgICBlcnJvclByb3BzOiBlcnJvclByb3BlcnRpZXMsXG4gICAgbWVzc2FnZUtleVxuICB9ID0gY29udGV4dFxuICBjb25zdCBzdGFjayA9IGxvZy5zdGFja1xuICBjb25zdCBqb2luZWRMaW5lcyA9IGpvaW5MaW5lc1dpdGhJbmRlbnRhdGlvbih7IGlucHV0OiBzdGFjaywgaWRlbnQsIGVvbCB9KVxuICBsZXQgcmVzdWx0ID0gYCR7aWRlbnR9JHtqb2luZWRMaW5lc30ke2VvbH1gXG5cbiAgaWYgKGVycm9yUHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3QgZXhjbHVkZVByb3BlcnRpZXMgPSBMT0dHRVJfS0VZUy5jb25jYXQobWVzc2FnZUtleSwgJ3R5cGUnLCAnc3RhY2snKVxuICAgIGxldCBwcm9wZXJ0aWVzVG9QcmludFxuICAgIGlmIChlcnJvclByb3BlcnRpZXNbMF0gPT09ICcqJykge1xuICAgICAgLy8gUHJpbnQgYWxsIHNpYmxpbmcgcHJvcGVydGllcyBleGNlcHQgZm9yIHRoZSBzdGFuZGFyZCBleGNsdXNpb25zLlxuICAgICAgcHJvcGVydGllc1RvUHJpbnQgPSBPYmplY3Qua2V5cyhsb2cpLmZpbHRlcihrID0+IGV4Y2x1ZGVQcm9wZXJ0aWVzLmluY2x1ZGVzKGspID09PSBmYWxzZSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUHJpbnQgb25seSBzcGVjaWZpZWQgcHJvcGVydGllcyB1bmxlc3MgdGhlIHByb3BlcnR5IGlzIGEgc3RhbmRhcmQgZXhjbHVzaW9uLlxuICAgICAgcHJvcGVydGllc1RvUHJpbnQgPSBlcnJvclByb3BlcnRpZXMuZmlsdGVyKGsgPT4gZXhjbHVkZVByb3BlcnRpZXMuaW5jbHVkZXMoaykgPT09IGZhbHNlKVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcGVydGllc1RvUHJpbnQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IGtleSA9IHByb3BlcnRpZXNUb1ByaW50W2ldXG4gICAgICBpZiAoa2V5IGluIGxvZyA9PT0gZmFsc2UpIGNvbnRpbnVlXG4gICAgICBpZiAoaXNPYmplY3QobG9nW2tleV0pKSB7XG4gICAgICAgIC8vIFRoZSBuZXN0ZWQgb2JqZWN0IG1heSBoYXZlIFwibG9nZ2VyXCIgdHlwZSBrZXlzIGJ1dCBzaW5jZSB0aGV5IGFyZSBub3RcbiAgICAgICAgLy8gYXQgdGhlIHJvb3QgbGV2ZWwgb2YgdGhlIG9iamVjdCBiZWluZyBwcm9jZXNzZWQsIHdlIHdhbnQgdG8gcHJpbnQgdGhlbS5cbiAgICAgICAgLy8gVGh1cywgd2UgaW52b2tlIHdpdGggYGV4Y2x1ZGVMb2dnZXJLZXlzOiBmYWxzZWAuXG4gICAgICAgIGNvbnN0IHByZXR0aWZpZWRPYmplY3QgPSBwcmV0dGlmeU9iamVjdCh7XG4gICAgICAgICAgbG9nOiBsb2dba2V5XSxcbiAgICAgICAgICBleGNsdWRlTG9nZ2VyS2V5czogZmFsc2UsXG4gICAgICAgICAgY29udGV4dDoge1xuICAgICAgICAgICAgLi4uY29udGV4dCxcbiAgICAgICAgICAgIElERU5UOiBpZGVudCArIGlkZW50XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXN1bHQgPSBgJHtyZXN1bHR9JHtpZGVudH0ke2tleX06IHske2VvbH0ke3ByZXR0aWZpZWRPYmplY3R9JHtpZGVudH19JHtlb2x9YFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgcmVzdWx0ID0gYCR7cmVzdWx0fSR7aWRlbnR9JHtrZXl9OiAke2xvZ1trZXldfSR7ZW9sfWBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gcHJldHRpZnlMZXZlbFxuXG5jb25zdCBnZXRQcm9wZXJ0eVZhbHVlID0gcmVxdWlyZSgnLi9nZXQtcHJvcGVydHktdmFsdWUnKVxuXG4vKipcbiAqIEB0eXBlZGVmIHtvYmplY3R9IFByZXR0aWZ5TGV2ZWxQYXJhbXNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBsb2cgVGhlIGxvZyBvYmplY3QuXG4gKiBAcHJvcGVydHkge1ByZXR0eUNvbnRleHR9IGNvbnRleHQgVGhlIGNvbnRleHQgb2JqZWN0IGJ1aWx0IGZyb20gcGFyc2luZ1xuICogdGhlIG9wdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHBhc3NlZCBpbiBsb2cgaGFzIGEgYGxldmVsYCB2YWx1ZSBhbmQgcmV0dXJucyBhIHByZXR0aWZpZWRcbiAqIHN0cmluZyBmb3IgdGhhdCBsZXZlbCBpZiBzby5cbiAqXG4gKiBAcGFyYW0ge1ByZXR0aWZ5TGV2ZWxQYXJhbXN9IGlucHV0XG4gKlxuICogQHJldHVybnMge3VuZGVmaW5lZHxzdHJpbmd9IElmIGBsb2dgIGRvZXMgbm90IGhhdmUgYSBgbGV2ZWxgIHByb3BlcnR5IHRoZW5cbiAqIGB1bmRlZmluZWRgIHdpbGwgYmUgcmV0dXJuZWQuIE90aGVyd2lzZSwgYSBzdHJpbmcgZnJvbSB0aGUgc3BlY2lmaWVkXG4gKiBgY29sb3JpemVyYCBpcyByZXR1cm5lZC5cbiAqL1xuZnVuY3Rpb24gcHJldHRpZnlMZXZlbCAoeyBsb2csIGNvbnRleHQgfSkge1xuICBjb25zdCB7XG4gICAgY29sb3JpemVyLFxuICAgIGN1c3RvbUxldmVscyxcbiAgICBjdXN0b21MZXZlbE5hbWVzLFxuICAgIGxldmVsS2V5LFxuICAgIGdldExldmVsTGFiZWxEYXRhXG4gIH0gPSBjb250ZXh0XG4gIGNvbnN0IHByZXR0aWZpZXIgPSBjb250ZXh0LmN1c3RvbVByZXR0aWZpZXJzPy5sZXZlbFxuICBjb25zdCBvdXRwdXQgPSBnZXRQcm9wZXJ0eVZhbHVlKGxvZywgbGV2ZWxLZXkpXG4gIGlmIChvdXRwdXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZFxuICBjb25zdCBsYWJlbENvbG9yaXplZCA9IGNvbG9yaXplcihvdXRwdXQsIHsgY3VzdG9tTGV2ZWxzLCBjdXN0b21MZXZlbE5hbWVzIH0pXG4gIGlmIChwcmV0dGlmaWVyKSB7XG4gICAgY29uc3QgW2xhYmVsXSA9IGdldExldmVsTGFiZWxEYXRhKG91dHB1dClcbiAgICByZXR1cm4gcHJldHRpZmllcihvdXRwdXQsIGxldmVsS2V5LCBsb2csIHsgbGFiZWwsIGxhYmVsQ29sb3JpemVkLCBjb2xvcnM6IGNvbG9yaXplci5jb2xvcnMgfSlcbiAgfVxuICByZXR1cm4gbGFiZWxDb2xvcml6ZWRcbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSBwcmV0dGlmeU1lc3NhZ2VcblxuY29uc3Qge1xuICBMRVZFTFNcbn0gPSByZXF1aXJlKCcuLi9jb25zdGFudHMnKVxuXG5jb25zdCBnZXRQcm9wZXJ0eVZhbHVlID0gcmVxdWlyZSgnLi9nZXQtcHJvcGVydHktdmFsdWUnKVxuY29uc3QgaW50ZXJwcmV0Q29uZGl0aW9uYWxzID0gcmVxdWlyZSgnLi9pbnRlcnByZXQtY29uZGl0aW9uYWxzJylcblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQcmV0dGlmeU1lc3NhZ2VQYXJhbXNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBsb2cgVGhlIGxvZyBvYmplY3Qgd2l0aCB0aGUgbWVzc2FnZSB0byBjb2xvcml6ZS5cbiAqIEBwcm9wZXJ0eSB7UHJldHR5Q29udGV4dH0gY29udGV4dCBUaGUgY29udGV4dCBvYmplY3QgYnVpbHQgZnJvbSBwYXJzaW5nXG4gKiB0aGUgb3B0aW9ucy5cbiAqL1xuXG4vKipcbiAqIFByZXR0aWZpZXMgYSBtZXNzYWdlIHN0cmluZyBpZiB0aGUgZ2l2ZW4gYGxvZ2AgaGFzIGEgbWVzc2FnZSBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge1ByZXR0aWZ5TWVzc2FnZVBhcmFtc30gaW5wdXRcbiAqXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfHN0cmluZ30gSWYgdGhlIG1lc3NhZ2Uga2V5IGlzIG5vdCBmb3VuZCwgb3IgdGhlIG1lc3NhZ2VcbiAqIGtleSBpcyBub3QgYSBzdHJpbmcsIHRoZW4gYHVuZGVmaW5lZGAgd2lsbCBiZSByZXR1cm5lZC4gT3RoZXJ3aXNlLCBhIHN0cmluZ1xuICogdGhhdCBpcyB0aGUgcHJldHRpZmllZCBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBwcmV0dGlmeU1lc3NhZ2UgKHsgbG9nLCBjb250ZXh0IH0pIHtcbiAgY29uc3Qge1xuICAgIGNvbG9yaXplcixcbiAgICBjdXN0b21MZXZlbHMsXG4gICAgbGV2ZWxLZXksXG4gICAgbGV2ZWxMYWJlbCxcbiAgICBtZXNzYWdlRm9ybWF0LFxuICAgIG1lc3NhZ2VLZXksXG4gICAgdXNlT25seUN1c3RvbVByb3BzXG4gIH0gPSBjb250ZXh0XG4gIGlmIChtZXNzYWdlRm9ybWF0ICYmIHR5cGVvZiBtZXNzYWdlRm9ybWF0ID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IHBhcnNlZE1lc3NhZ2VGb3JtYXQgPSBpbnRlcnByZXRDb25kaXRpb25hbHMobWVzc2FnZUZvcm1hdCwgbG9nKVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IFN0cmluZyhwYXJzZWRNZXNzYWdlRm9ybWF0KS5yZXBsYWNlKFxuICAgICAgL3soW157fV0rKX0vZyxcbiAgICAgIGZ1bmN0aW9uIChtYXRjaCwgcDEpIHtcbiAgICAgICAgLy8gcmV0dXJuIGxvZyBsZXZlbCBhcyBzdHJpbmcgaW5zdGVhZCBvZiBpbnRcbiAgICAgICAgbGV0IGxldmVsXG4gICAgICAgIGlmIChwMSA9PT0gbGV2ZWxMYWJlbCAmJiAobGV2ZWwgPSBnZXRQcm9wZXJ0eVZhbHVlKGxvZywgbGV2ZWxLZXkpKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY29uc3QgY29uZGl0aW9uID0gdXNlT25seUN1c3RvbVByb3BzID8gY3VzdG9tTGV2ZWxzID09PSB1bmRlZmluZWQgOiBjdXN0b21MZXZlbHNbbGV2ZWxdID09PSB1bmRlZmluZWRcbiAgICAgICAgICByZXR1cm4gY29uZGl0aW9uID8gTEVWRUxTW2xldmVsXSA6IGN1c3RvbUxldmVsc1tsZXZlbF1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhcnNlIG5lc3RlZCBrZXkgYWNjZXNzLCBlLmcuIGB7a2V5QS5zdWJLZXlCfWAuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0UHJvcGVydHlWYWx1ZShsb2csIHAxKVxuICAgICAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogJydcbiAgICAgIH0pXG4gICAgcmV0dXJuIGNvbG9yaXplci5tZXNzYWdlKG1lc3NhZ2UpXG4gIH1cbiAgaWYgKG1lc3NhZ2VGb3JtYXQgJiYgdHlwZW9mIG1lc3NhZ2VGb3JtYXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBjb25zdCBtc2cgPSBtZXNzYWdlRm9ybWF0KGxvZywgbWVzc2FnZUtleSwgbGV2ZWxMYWJlbCwgeyBjb2xvcnM6IGNvbG9yaXplci5jb2xvcnMgfSlcbiAgICByZXR1cm4gY29sb3JpemVyLm1lc3NhZ2UobXNnKVxuICB9XG4gIGlmIChtZXNzYWdlS2V5IGluIGxvZyA9PT0gZmFsc2UpIHJldHVybiB1bmRlZmluZWRcbiAgaWYgKHR5cGVvZiBsb2dbbWVzc2FnZUtleV0gIT09ICdzdHJpbmcnICYmIHR5cGVvZiBsb2dbbWVzc2FnZUtleV0gIT09ICdudW1iZXInICYmIHR5cGVvZiBsb2dbbWVzc2FnZUtleV0gIT09ICdib29sZWFuJykgcmV0dXJuIHVuZGVmaW5lZFxuICByZXR1cm4gY29sb3JpemVyLm1lc3NhZ2UobG9nW21lc3NhZ2VLZXldKVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0aWZ5TWV0YWRhdGFcblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQcmV0dGlmeU1ldGFkYXRhUGFyYW1zXG4gKiBAcHJvcGVydHkge29iamVjdH0gbG9nIFRoZSBsb2cgdGhhdCBtYXkgb3IgbWF5IG5vdCBjb250YWluIG1ldGFkYXRhIHRvXG4gKiBiZSBwcmV0dGlmaWVkLlxuICogQHByb3BlcnR5IHtQcmV0dHlDb250ZXh0fSBjb250ZXh0IFRoZSBjb250ZXh0IG9iamVjdCBidWlsdCBmcm9tIHBhcnNpbmdcbiAqIHRoZSBvcHRpb25zLlxuICovXG5cbi8qKlxuICogUHJldHRpZmllcyBtZXRhZGF0YSB0aGF0IGlzIHVzdWFsbHkgcHJlc2VudCBpbiBhIFBpbm8gbG9nIGxpbmUuIEl0IGxvb2tzIGZvclxuICogZmllbGRzIGBuYW1lYCwgYHBpZGAsIGBob3N0bmFtZWAsIGFuZCBgY2FsbGVyYCBhbmQgcmV0dXJucyBhIGZvcm1hdHRlZCBzdHJpbmcgdXNpbmdcbiAqIHRoZSBmaWVsZHMgaXQgZmluZHMuXG4gKlxuICogQHBhcmFtIHtQcmV0dGlmeU1ldGFkYXRhUGFyYW1zfSBpbnB1dFxuICpcbiAqIEByZXR1cm5zIHt1bmRlZmluZWR8c3RyaW5nfSBJZiBubyBtZXRhZGF0YSBpcyBmb3VuZCB0aGVuIGB1bmRlZmluZWRgIGlzXG4gKiByZXR1cm5lZC4gT3RoZXJ3aXNlLCBhIHN0cmluZyBvZiBwcmV0dGlmaWVkIG1ldGFkYXRhIGlzIHJldHVybmVkLlxuICovXG5mdW5jdGlvbiBwcmV0dGlmeU1ldGFkYXRhICh7IGxvZywgY29udGV4dCB9KSB7XG4gIGNvbnN0IHsgY3VzdG9tUHJldHRpZmllcnM6IHByZXR0aWZpZXJzLCBjb2xvcml6ZXIgfSA9IGNvbnRleHRcbiAgbGV0IGxpbmUgPSAnJ1xuXG4gIGlmIChsb2cubmFtZSB8fCBsb2cucGlkIHx8IGxvZy5ob3N0bmFtZSkge1xuICAgIGxpbmUgKz0gJygnXG5cbiAgICBpZiAobG9nLm5hbWUpIHtcbiAgICAgIGxpbmUgKz0gcHJldHRpZmllcnMubmFtZVxuICAgICAgICA/IHByZXR0aWZpZXJzLm5hbWUobG9nLm5hbWUsICduYW1lJywgbG9nLCB7IGNvbG9yczogY29sb3JpemVyLmNvbG9ycyB9KVxuICAgICAgICA6IGxvZy5uYW1lXG4gICAgfVxuXG4gICAgaWYgKGxvZy5waWQpIHtcbiAgICAgIGNvbnN0IHByZXR0eVBpZCA9IHByZXR0aWZpZXJzLnBpZFxuICAgICAgICA/IHByZXR0aWZpZXJzLnBpZChsb2cucGlkLCAncGlkJywgbG9nLCB7IGNvbG9yczogY29sb3JpemVyLmNvbG9ycyB9KVxuICAgICAgICA6IGxvZy5waWRcbiAgICAgIGlmIChsb2cubmFtZSAmJiBsb2cucGlkKSB7XG4gICAgICAgIGxpbmUgKz0gJy8nICsgcHJldHR5UGlkXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lICs9IHByZXR0eVBpZFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChsb2cuaG9zdG5hbWUpIHtcbiAgICAgIC8vIElmIGBwaWRgIGFuZCBgbmFtZWAgd2VyZSBpbiB0aGUgaWdub3JlIGtleXMgbGlzdCB0aGVuIHdlIGRvbid0IG5lZWRcbiAgICAgIC8vIHRoZSBsZWFkaW5nIHNwYWNlLlxuICAgICAgY29uc3QgcHJldHR5SG9zdG5hbWUgPSBwcmV0dGlmaWVycy5ob3N0bmFtZVxuICAgICAgICA/IHByZXR0aWZpZXJzLmhvc3RuYW1lKGxvZy5ob3N0bmFtZSwgJ2hvc3RuYW1lJywgbG9nLCB7IGNvbG9yczogY29sb3JpemVyLmNvbG9ycyB9KVxuICAgICAgICA6IGxvZy5ob3N0bmFtZVxuXG4gICAgICBsaW5lICs9IGAke2xpbmUgPT09ICcoJyA/ICdvbicgOiAnIG9uJ30gJHtwcmV0dHlIb3N0bmFtZX1gXG4gICAgfVxuXG4gICAgbGluZSArPSAnKSdcbiAgfVxuXG4gIGlmIChsb2cuY2FsbGVyKSB7XG4gICAgY29uc3QgcHJldHR5Q2FsbGVyID0gcHJldHRpZmllcnMuY2FsbGVyXG4gICAgICA/IHByZXR0aWZpZXJzLmNhbGxlcihsb2cuY2FsbGVyLCAnY2FsbGVyJywgbG9nLCB7IGNvbG9yczogY29sb3JpemVyLmNvbG9ycyB9KVxuICAgICAgOiBsb2cuY2FsbGVyXG5cbiAgICBsaW5lICs9IGAke2xpbmUgPT09ICcnID8gJycgOiAnICd9PCR7cHJldHR5Q2FsbGVyfT5gXG4gIH1cblxuICBpZiAobGluZSA9PT0gJycpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpbmVcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0aWZ5VGltZVxuXG5jb25zdCBmb3JtYXRUaW1lID0gcmVxdWlyZSgnLi9mb3JtYXQtdGltZScpXG5cbi8qKlxuICogQHR5cGVkZWYge29iamVjdH0gUHJldHRpZnlUaW1lUGFyYW1zXG4gKiBAcHJvcGVydHkge29iamVjdH0gbG9nIFRoZSBsb2cgb2JqZWN0IHdpdGggdGhlIHRpbWVzdGFtcCB0byBiZSBwcmV0dGlmaWVkLlxuICogQHByb3BlcnR5IHtQcmV0dHlDb250ZXh0fSBjb250ZXh0IFRoZSBjb250ZXh0IG9iamVjdCBidWlsdCBmcm9tIHBhcnNpbmdcbiAqIHRoZSBvcHRpb25zLlxuICovXG5cbi8qKlxuICogUHJldHRpZmllcyBhIHRpbWVzdGFtcCBpZiB0aGUgZ2l2ZW4gYGxvZ2AgaGFzIGVpdGhlciBgdGltZWAsIGB0aW1lc3RhbXBgIG9yIGN1c3RvbSBzcGVjaWZpZWQgdGltZXN0YW1wXG4gKiBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge1ByZXR0aWZ5VGltZVBhcmFtc30gaW5wdXRcbiAqXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfHN0cmluZ30gSWYgYSB0aW1lc3RhbXAgcHJvcGVydHkgY2Fubm90IGJlIGZvdW5kIHRoZW5cbiAqIGB1bmRlZmluZWRgIGlzIHJldHVybmVkLiBPdGhlcndpc2UsIHRoZSBwcmV0dGlmaWVkIHRpbWUgaXMgcmV0dXJuZWQgYXMgYVxuICogc3RyaW5nLlxuICovXG5mdW5jdGlvbiBwcmV0dGlmeVRpbWUgKHsgbG9nLCBjb250ZXh0IH0pIHtcbiAgY29uc3Qge1xuICAgIHRpbWVzdGFtcEtleSxcbiAgICB0cmFuc2xhdGVUaW1lOiB0cmFuc2xhdGVGb3JtYXRcbiAgfSA9IGNvbnRleHRcbiAgY29uc3QgcHJldHRpZmllciA9IGNvbnRleHQuY3VzdG9tUHJldHRpZmllcnM/LnRpbWVcbiAgbGV0IHRpbWUgPSBudWxsXG5cbiAgaWYgKHRpbWVzdGFtcEtleSBpbiBsb2cpIHtcbiAgICB0aW1lID0gbG9nW3RpbWVzdGFtcEtleV1cbiAgfSBlbHNlIGlmICgndGltZXN0YW1wJyBpbiBsb2cpIHtcbiAgICB0aW1lID0gbG9nLnRpbWVzdGFtcFxuICB9XG5cbiAgaWYgKHRpbWUgPT09IG51bGwpIHJldHVybiB1bmRlZmluZWRcbiAgY29uc3Qgb3V0cHV0ID0gdHJhbnNsYXRlRm9ybWF0ID8gZm9ybWF0VGltZSh0aW1lLCB0cmFuc2xhdGVGb3JtYXQpIDogdGltZVxuXG4gIHJldHVybiBwcmV0dGlmaWVyID8gcHJldHRpZmllcihvdXRwdXQpIDogYFske291dHB1dH1dYFxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYnVpbGRTYWZlU29uaWNCb29tOiByZXF1aXJlKCcuL2J1aWxkLXNhZmUtc29uaWMtYm9vbS5qcycpLFxuICBjcmVhdGVEYXRlOiByZXF1aXJlKCcuL2NyZWF0ZS1kYXRlLmpzJyksXG4gIGRlbGV0ZUxvZ1Byb3BlcnR5OiByZXF1aXJlKCcuL2RlbGV0ZS1sb2ctcHJvcGVydHkuanMnKSxcbiAgZmlsdGVyTG9nOiByZXF1aXJlKCcuL2ZpbHRlci1sb2cuanMnKSxcbiAgZm9ybWF0VGltZTogcmVxdWlyZSgnLi9mb3JtYXQtdGltZS5qcycpLFxuICBnZXRQcm9wZXJ0eVZhbHVlOiByZXF1aXJlKCcuL2dldC1wcm9wZXJ0eS12YWx1ZS5qcycpLFxuICBoYW5kbGVDdXN0b21MZXZlbHNOYW1lc09wdHM6IHJlcXVpcmUoJy4vaGFuZGxlLWN1c3RvbS1sZXZlbHMtbmFtZXMtb3B0cy5qcycpLFxuICBoYW5kbGVDdXN0b21MZXZlbHNPcHRzOiByZXF1aXJlKCcuL2hhbmRsZS1jdXN0b20tbGV2ZWxzLW9wdHMuanMnKSxcbiAgaW50ZXJwcmV0Q29uZGl0aW9uYWxzOiByZXF1aXJlKCcuL2ludGVycHJldC1jb25kaXRpb25hbHMuanMnKSxcbiAgaXNPYmplY3Q6IHJlcXVpcmUoJy4vaXMtb2JqZWN0LmpzJyksXG4gIGlzVmFsaWREYXRlOiByZXF1aXJlKCcuL2lzLXZhbGlkLWRhdGUuanMnKSxcbiAgam9pbkxpbmVzV2l0aEluZGVudGF0aW9uOiByZXF1aXJlKCcuL2pvaW4tbGluZXMtd2l0aC1pbmRlbnRhdGlvbi5qcycpLFxuICBub29wOiByZXF1aXJlKCcuL25vb3AuanMnKSxcbiAgcGFyc2VGYWN0b3J5T3B0aW9uczogcmVxdWlyZSgnLi9wYXJzZS1mYWN0b3J5LW9wdGlvbnMuanMnKSxcbiAgcHJldHRpZnlFcnJvckxvZzogcmVxdWlyZSgnLi9wcmV0dGlmeS1lcnJvci1sb2cuanMnKSxcbiAgcHJldHRpZnlFcnJvcjogcmVxdWlyZSgnLi9wcmV0dGlmeS1lcnJvci5qcycpLFxuICBwcmV0dGlmeUxldmVsOiByZXF1aXJlKCcuL3ByZXR0aWZ5LWxldmVsLmpzJyksXG4gIHByZXR0aWZ5TWVzc2FnZTogcmVxdWlyZSgnLi9wcmV0dGlmeS1tZXNzYWdlLmpzJyksXG4gIHByZXR0aWZ5TWV0YWRhdGE6IHJlcXVpcmUoJy4vcHJldHRpZnktbWV0YWRhdGEuanMnKSxcbiAgcHJldHRpZnlPYmplY3Q6IHJlcXVpcmUoJy4vcHJldHRpZnktb2JqZWN0LmpzJyksXG4gIHByZXR0aWZ5VGltZTogcmVxdWlyZSgnLi9wcmV0dGlmeS10aW1lLmpzJyksXG4gIHNwbGl0UHJvcGVydHlLZXk6IHJlcXVpcmUoJy4vc3BsaXQtcHJvcGVydHkta2V5LmpzJyksXG4gIGdldExldmVsTGFiZWxEYXRhOiByZXF1aXJlKCcuL2dldC1sZXZlbC1sYWJlbC1kYXRhJylcbn1cblxuLy8gVGhlIHJlbWFpbmRlciBvZiB0aGlzIGZpbGUgY29uc2lzdHMgb2YganNkb2MgYmxvY2tzIHRoYXQgYXJlIGRpZmZpY3VsdCB0b1xuLy8gZGV0ZXJtaW5lIGEgbW9yZSBhcHByb3ByaWF0ZSBcImhvbWVcIiBmb3IuIEFzIGFuIGV4YW1wbGUsIHRoZSBibG9ja3MgYXNzb2NpYXRlZFxuLy8gd2l0aCBjdXN0b20gcHJldHRpZmllcnMgY291bGQgbGl2ZSBpbiBlaXRoZXIgdGhlIGBwcmV0dGlmeS1sZXZlbGAsXG4vLyBgcHJldHRpZnktbWV0YWRhdGFgLCBvciBgcHJldHRpZnktdGltZWAgZmlsZXMgc2luY2UgdGhleSBhcmUgdGhlIHByaW1hcnlcbi8vIGZpbGVzIHdoZXJlIHN1Y2ggY29kZSBpcyB1c2VkLiBCdXQgd2Ugd2FudCBhIGNlbnRyYWwgcGxhY2UgdG8gZGVmaW5lIGNvbW1vblxuLy8gZG9jIGJsb2Nrcywgc28gd2UgYXJlIHBpY2tpbmcgdGhpcyBmaWxlIGFzIHRoZSBhbnN3ZXIuXG5cbi8qKlxuICogQSBoYXNoIG9mIGxvZyBwcm9wZXJ0eSBuYW1lcyBtYXBwZWQgdG8gcHJldHRpZmllciBmdW5jdGlvbnMuIFdoZW4gdGhlXG4gKiBpbmNvbWluZyBsb2cgZGF0YSBpcyBiZWluZyBwcm9jZXNzZWQgZm9yIHByZXR0aWZpY2F0aW9uLCBhbnkga2V5IG9uIHRoZSBsb2dcbiAqIHRoYXQgbWF0Y2hlcyBhIGtleSBpbiBhIGN1c3RvbSBwcmV0dGlmaWVycyBoYXNoIHdpbGwgYmUgcHJldHRpZmllZCB1c2luZ1xuICogdGhhdCBtYXRjaGluZyBjdXN0b20gcHJldHRpZmllci4gVGhlIHZhbHVlIHBhc3NlZCB0byB0aGUgY3VzdG9tIHByZXR0aWZpZXJcbiAqIHdpbGwgdGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCB0aGUgY29ycmVzcG9uZGluZyBsb2cga2V5LlxuICpcbiAqIFRoZSBoYXNoIG1heSBjb250YWluIGFueSBhcmJpdHJhcnkga2V5cyBmb3IgYXJiaXRyYXJ5IGxvZyBwcm9wZXJ0aWVzLCBidXQgaXRcbiAqIG1heSBhbHNvIGNvbnRhaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBrZXkgbmFtZXMgdGhhdCBtYXAgdG8gd2VsbC1rbm93biBsb2dcbiAqIHByb3BlcnRpZXMuIFRoZXNlIGtleXMgYXJlOlxuICpcbiAqICsgYHRpbWVgIChmb3IgdGhlIHRpbWVzdGFtcCBmaWVsZClcbiAqICsgYGxldmVsYCAoZm9yIHRoZSBsZXZlbCBsYWJlbCBmaWVsZDsgdmFsdWUgbWF5IGJlIGEgbGV2ZWwgbnVtYmVyIGluc3RlYWRcbiAqIG9mIGEgbGV2ZWwgbGFiZWwpXG4gKiArIGBob3N0bmFtZWBcbiAqICsgYHBpZGBcbiAqICsgYG5hbWVgXG4gKiArIGBjYWxsZXJgXG4gKlxuICogQHR5cGVkZWYge09iamVjdC48c3RyaW5nLCBDdXN0b21QcmV0dGlmaWVyRnVuYz59IEN1c3RvbVByZXR0aWZpZXJzXG4gKi9cblxuLyoqXG4gKiBBIHN5bmNocm9ub3VzIGZ1bmN0aW9uIHRvIGJlIHVzZWQgZm9yIHByZXR0aWZ5aW5nIGEgbG9nIHByb3BlcnR5LiBJdCBtdXN0XG4gKiByZXR1cm4gYSBzdHJpbmcuXG4gKlxuICogQHR5cGVkZWYge2Z1bmN0aW9ufSBDdXN0b21QcmV0dGlmaWVyRnVuY1xuICogQHBhcmFtIHthbnl9IHZhbHVlIFRoZSB2YWx1ZSB0byBiZSBwcmV0dGlmaWVkIGZvciB0aGUga2V5IGFzc29jaWF0ZWQgd2l0aFxuICogdGhlIHByZXR0aWZpZXIuXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5cbi8qKlxuICogQSB0b2tlbml6ZWQgc3RyaW5nIHRoYXQgaW5kaWNhdGVzIGhvdyB0aGUgcHJldHRpZmllZCBsb2cgbGluZSBzaG91bGQgYmVcbiAqIGZvcm1hdHRlZC4gVG9rZW5zIGFyZSBlaXRoZXIgbG9nIHByb3BlcnRpZXMgZW5jbG9zZWQgaW4gY3VybHkgYnJhY2VzLCBlLmcuXG4gKiBge2xldmVsTGFiZWx9YCwgYHtwaWR9YCwgb3IgYHtyZXEudXJsfWAsIG9yIGNvbmRpdGlvbmFsIGRpcmVjdGl2ZXMgaW4gY3VybHlcbiAqIGJyYWNlcy4gVGhlIG9ubHkgY29uZGl0aW9uYWwgZGlyZWN0aXZlcyBzdXBwb3J0ZWQgYXJlIGBpZmAgYW5kIGBlbmRgLCBlLmcuXG4gKiBge2lmIHBpZH17cGlkfXtlbmR9YDsgZXZlcnkgYGlmYCBtdXN0IGhhdmUgYSBtYXRjaGluZyBgZW5kYC4gTmVzdGVkXG4gKiBjb25kaXRpb25zIGFyZSBub3Qgc3VwcG9ydGVkLlxuICpcbiAqIEB0eXBlZGVmIHtzdHJpbmd9IE1lc3NhZ2VGb3JtYXRTdHJpbmdcbiAqXG4gKiBAZXhhbXBsZVxuICogYHtsZXZlbExhYmVsfSAtIHtpZiBwaWR9e3BpZH0gLSB7ZW5kfXVybDp7cmVxLnVybH1gXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQcmV0dGlmeU1lc3NhZ2VFeHRyYXNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjb2xvcnMgQXZhaWxhYmxlIGNvbG9yIGZ1bmN0aW9ucyBiYXNlZCBvbiBgdXNlQ29sb3JgIChvciBgY29sb3JpemVgKSBjb250ZXh0XG4gKiB0aGUgb3B0aW9ucy5cbiAqL1xuXG4vKipcbiAqIEEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGEgbG9nIG9iamVjdCwgbmFtZSBvZiB0aGUgbWVzc2FnZSBrZXksIGFuZCBuYW1lIG9mXG4gKiB0aGUgbGV2ZWwgbGFiZWwga2V5IGFuZCByZXR1cm5zIGEgZm9ybWF0dGVkIGxvZyBsaW5lLlxuICpcbiAqIE5vdGU6IHRoaXMgZnVuY3Rpb24gbXVzdCBiZSBzeW5jaHJvbm91cy5cbiAqXG4gKiBAdHlwZWRlZiB7ZnVuY3Rpb259IE1lc3NhZ2VGb3JtYXRGdW5jdGlvblxuICogQHBhcmFtIHtvYmplY3R9IGxvZyBUaGUgbG9nIG9iamVjdCB0byBiZSBwcm9jZXNzZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZUtleSBUaGUgbmFtZSBvZiB0aGUga2V5IGluIHRoZSBgbG9nYCBvYmplY3QgdGhhdFxuICogY29udGFpbnMgdGhlIGxvZyBtZXNzYWdlLlxuICogQHBhcmFtIHtzdHJpbmd9IGxldmVsTGFiZWwgVGhlIG5hbWUgb2YgdGhlIGtleSBpbiB0aGUgYGxvZ2Agb2JqZWN0IHRoYXRcbiAqIGNvbnRhaW5zIHRoZSBsb2cgbGV2ZWwgbmFtZS5cbiAqIEBwYXJhbSB7UHJldHRpZnlNZXNzYWdlRXh0cmFzfSBleHRyYXMgQWRkaXRpb25hbCBkYXRhIGF2YWlsYWJsZSBmb3IgbWVzc2FnZSBjb250ZXh0XG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICpcbiAqIEBleGFtcGxlXG4gKiBmdW5jdGlvbiAobG9nLCBtZXNzYWdlS2V5LCBsZXZlbExhYmVsKSB7XG4gKiAgIHJldHVybiBgJHtsb2dbbGV2ZWxMYWJlbF19IC0gJHtsb2dbbWVzc2FnZUtleV19YFxuICogfVxuICovXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGhhc0J1ZmZlciA9IHR5cGVvZiBCdWZmZXIgIT09ICd1bmRlZmluZWQnXG5jb25zdCBzdXNwZWN0UHJvdG9SeCA9IC9cIig/Ol98XFxcXHUwMDVbRmZdKSg/Ol98XFxcXHUwMDVbRmZdKSg/OnB8XFxcXHUwMDcwKSg/OnJ8XFxcXHUwMDcyKSg/Om98XFxcXHUwMDZbRmZdKSg/OnR8XFxcXHUwMDc0KSg/Om98XFxcXHUwMDZbRmZdKSg/Ol98XFxcXHUwMDVbRmZdKSg/Ol98XFxcXHUwMDVbRmZdKVwiXFxzKjovXG5jb25zdCBzdXNwZWN0Q29uc3RydWN0b3JSeCA9IC9cIig/OmN8XFxcXHUwMDYzKSg/Om98XFxcXHUwMDZbRmZdKSg/Om58XFxcXHUwMDZbRWVdKSg/OnN8XFxcXHUwMDczKSg/OnR8XFxcXHUwMDc0KSg/OnJ8XFxcXHUwMDcyKSg/OnV8XFxcXHUwMDc1KSg/OmN8XFxcXHUwMDYzKSg/OnR8XFxcXHUwMDc0KSg/Om98XFxcXHUwMDZbRmZdKSg/OnJ8XFxcXHUwMDcyKVwiXFxzKjovXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIEludGVybmFsIHBhcnNlIGZ1bmN0aW9uIHRoYXQgcGFyc2VzIEpTT04gdGV4dCB3aXRoIHNlY3VyaXR5IGNoZWNrcy5cbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ3xCdWZmZXJ9IHRleHQgLSBUaGUgSlNPTiB0ZXh0IHN0cmluZyBvciBCdWZmZXIgdG8gcGFyc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmV2aXZlcl0gLSBUaGUgSlNPTi5wYXJzZSgpIG9wdGlvbmFsIHJldml2ZXIgYXJndW1lbnQuXG4gKiBAcGFyYW0ge2ltcG9ydCgnLi90eXBlcycpLlBhcnNlT3B0aW9uc30gW29wdGlvbnNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHBhcnNlZCBvYmplY3QuXG4gKiBAdGhyb3dzIHtTeW50YXhFcnJvcn0gSWYgYSBmb3JiaWRkZW4gcHJvdG90eXBlIHByb3BlcnR5IGlzIGZvdW5kIGFuZCBgb3B0aW9ucy5wcm90b0FjdGlvbmAgb3JcbiAqIGBvcHRpb25zLmNvbnN0cnVjdG9yQWN0aW9uYCBpcyBgJ2Vycm9yJ2AuXG4gKi9cbmZ1bmN0aW9uIF9wYXJzZSAodGV4dCwgcmV2aXZlciwgb3B0aW9ucykge1xuICAvLyBOb3JtYWxpemUgYXJndW1lbnRzXG4gIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICBpZiAocmV2aXZlciAhPT0gbnVsbCAmJiB0eXBlb2YgcmV2aXZlciA9PT0gJ29iamVjdCcpIHtcbiAgICAgIG9wdGlvbnMgPSByZXZpdmVyXG4gICAgICByZXZpdmVyID0gdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgaWYgKGhhc0J1ZmZlciAmJiBCdWZmZXIuaXNCdWZmZXIodGV4dCkpIHtcbiAgICB0ZXh0ID0gdGV4dC50b1N0cmluZygpXG4gIH1cblxuICAvLyBCT00gY2hlY2tlclxuICBpZiAodGV4dCAmJiB0ZXh0LmNoYXJDb2RlQXQoMCkgPT09IDB4RkVGRikge1xuICAgIHRleHQgPSB0ZXh0LnNsaWNlKDEpXG4gIH1cblxuICAvLyBQYXJzZSBub3JtYWxseSwgYWxsb3dpbmcgZXhjZXB0aW9uc1xuICBjb25zdCBvYmogPSBKU09OLnBhcnNlKHRleHQsIHJldml2ZXIpXG5cbiAgLy8gSWdub3JlIG51bGwgYW5kIG5vbi1vYmplY3RzXG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICBjb25zdCBwcm90b0FjdGlvbiA9IChvcHRpb25zICYmIG9wdGlvbnMucHJvdG9BY3Rpb24pIHx8ICdlcnJvcidcbiAgY29uc3QgY29uc3RydWN0b3JBY3Rpb24gPSAob3B0aW9ucyAmJiBvcHRpb25zLmNvbnN0cnVjdG9yQWN0aW9uKSB8fCAnZXJyb3InXG5cbiAgLy8gb3B0aW9uczogJ2Vycm9yJyAoZGVmYXVsdCkgLyAncmVtb3ZlJyAvICdpZ25vcmUnXG4gIGlmIChwcm90b0FjdGlvbiA9PT0gJ2lnbm9yZScgJiYgY29uc3RydWN0b3JBY3Rpb24gPT09ICdpZ25vcmUnKSB7XG4gICAgcmV0dXJuIG9ialxuICB9XG5cbiAgaWYgKHByb3RvQWN0aW9uICE9PSAnaWdub3JlJyAmJiBjb25zdHJ1Y3RvckFjdGlvbiAhPT0gJ2lnbm9yZScpIHtcbiAgICBpZiAoc3VzcGVjdFByb3RvUngudGVzdCh0ZXh0KSA9PT0gZmFsc2UgJiYgc3VzcGVjdENvbnN0cnVjdG9yUngudGVzdCh0ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBvYmpcbiAgICB9XG4gIH0gZWxzZSBpZiAocHJvdG9BY3Rpb24gIT09ICdpZ25vcmUnICYmIGNvbnN0cnVjdG9yQWN0aW9uID09PSAnaWdub3JlJykge1xuICAgIGlmIChzdXNwZWN0UHJvdG9SeC50ZXN0KHRleHQpID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIG9ialxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoc3VzcGVjdENvbnN0cnVjdG9yUngudGVzdCh0ZXh0KSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBvYmpcbiAgICB9XG4gIH1cblxuICAvLyBTY2FuIHJlc3VsdCBmb3IgcHJvdG8ga2V5c1xuICByZXR1cm4gZmlsdGVyKG9iaiwgeyBwcm90b0FjdGlvbiwgY29uc3RydWN0b3JBY3Rpb24sIHNhZmU6IG9wdGlvbnMgJiYgb3B0aW9ucy5zYWZlIH0pXG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIFNjYW5zIGFuZCBmaWx0ZXJzIGFuIG9iamVjdCBmb3IgZm9yYmlkZGVuIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiAtIFRoZSBvYmplY3QgYmVpbmcgc2Nhbm5lZC5cbiAqIEBwYXJhbSB7aW1wb3J0KCcuL3R5cGVzJykuUGFyc2VPcHRpb25zfSBbb3B0aW9uc10gLSBPcHRpb25hbCBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R8bnVsbH0gVGhlIGZpbHRlcmVkIG9iamVjdCwgb3IgYG51bGxgIGlmIHNhZmUgbW9kZSBpcyBlbmFibGVkIGFuZCBpc3N1ZXMgYXJlIGZvdW5kLlxuICogQHRocm93cyB7U3ludGF4RXJyb3J9IElmIGEgZm9yYmlkZGVuIHByb3RvdHlwZSBwcm9wZXJ0eSBpcyBmb3VuZCBhbmQgYG9wdGlvbnMucHJvdG9BY3Rpb25gIG9yXG4gKiBgb3B0aW9ucy5jb25zdHJ1Y3RvckFjdGlvbmAgaXMgYCdlcnJvcidgLlxuICovXG5mdW5jdGlvbiBmaWx0ZXIgKG9iaiwgeyBwcm90b0FjdGlvbiA9ICdlcnJvcicsIGNvbnN0cnVjdG9yQWN0aW9uID0gJ2Vycm9yJywgc2FmZSB9ID0ge30pIHtcbiAgbGV0IG5leHQgPSBbb2JqXVxuXG4gIHdoaWxlIChuZXh0Lmxlbmd0aCkge1xuICAgIGNvbnN0IG5vZGVzID0gbmV4dFxuICAgIG5leHQgPSBbXVxuXG4gICAgZm9yIChjb25zdCBub2RlIG9mIG5vZGVzKSB7XG4gICAgICBpZiAocHJvdG9BY3Rpb24gIT09ICdpZ25vcmUnICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChub2RlLCAnX19wcm90b19fJykpIHsgLy8gQXZvaWQgY2FsbGluZyBub2RlLmhhc093blByb3BlcnR5IGRpcmVjdGx5XG4gICAgICAgIGlmIChzYWZlID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfSBlbHNlIGlmIChwcm90b0FjdGlvbiA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcignT2JqZWN0IGNvbnRhaW5zIGZvcmJpZGRlbiBwcm90b3R5cGUgcHJvcGVydHknKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG5vZGUuX19wcm90b19fIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tcHJvdG9cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbnN0cnVjdG9yQWN0aW9uICE9PSAnaWdub3JlJyAmJlxuICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChub2RlLCAnY29uc3RydWN0b3InKSAmJlxuICAgICAgICAgIG5vZGUuY29uc3RydWN0b3IgIT09IG51bGwgJiZcbiAgICAgICAgICB0eXBlb2Ygbm9kZS5jb25zdHJ1Y3RvciA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobm9kZS5jb25zdHJ1Y3RvciwgJ3Byb3RvdHlwZScpKSB7IC8vIEF2b2lkIGNhbGxpbmcgbm9kZS5oYXNPd25Qcm9wZXJ0eSBkaXJlY3RseVxuICAgICAgICBpZiAoc2FmZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH0gZWxzZSBpZiAoY29uc3RydWN0b3JBY3Rpb24gPT09ICdlcnJvcicpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoJ09iamVjdCBjb250YWlucyBmb3JiaWRkZW4gcHJvdG90eXBlIHByb3BlcnR5JylcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBub2RlLmNvbnN0cnVjdG9yXG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIG5vZGUpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBub2RlW2tleV1cbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBuZXh0LnB1c2godmFsdWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9ialxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBQYXJzZXMgYSBnaXZlbiBKU09OLWZvcm1hdHRlZCB0ZXh0IGludG8gYW4gb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmd8QnVmZmVyfSB0ZXh0IC0gVGhlIEpTT04gdGV4dCBzdHJpbmcgb3IgQnVmZmVyIHRvIHBhcnNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jldml2ZXJdIC0gVGhlIGBKU09OLnBhcnNlKClgIG9wdGlvbmFsIHJldml2ZXIgYXJndW1lbnQsIG9yIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtpbXBvcnQoJy4vdHlwZXMnKS5QYXJzZU9wdGlvbnN9IFtvcHRpb25zXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICogQHJldHVybnMgeyp9IFRoZSBwYXJzZWQgb2JqZWN0LlxuICogQHRocm93cyB7U3ludGF4RXJyb3J9IElmIHRoZSBKU09OIHRleHQgaXMgbWFsZm9ybWVkIG9yIGNvbnRhaW5zIGZvcmJpZGRlbiBwcm90b3R5cGUgcHJvcGVydGllc1xuICogd2hlbiBgb3B0aW9ucy5wcm90b0FjdGlvbmAgb3IgYG9wdGlvbnMuY29uc3RydWN0b3JBY3Rpb25gIGlzIGAnZXJyb3InYC5cbiAqL1xuZnVuY3Rpb24gcGFyc2UgKHRleHQsIHJldml2ZXIsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBzdGFja1RyYWNlTGltaXQgfSA9IEVycm9yXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IDBcbiAgdHJ5IHtcbiAgICByZXR1cm4gX3BhcnNlKHRleHQsIHJldml2ZXIsIG9wdGlvbnMpXG4gIH0gZmluYWxseSB7XG4gICAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gc3RhY2tUcmFjZUxpbWl0XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gU2FmZWx5IHBhcnNlcyBhIGdpdmVuIEpTT04tZm9ybWF0dGVkIHRleHQgaW50byBhbiBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ3xCdWZmZXJ9IHRleHQgLSBUaGUgSlNPTiB0ZXh0IHN0cmluZyBvciBCdWZmZXIgdG8gcGFyc2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmV2aXZlcl0gLSBUaGUgYEpTT04ucGFyc2UoKWAgb3B0aW9uYWwgcmV2aXZlciBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHsqfG51bGx8dW5kZWZpbmVkfSBUaGUgcGFyc2VkIG9iamVjdCwgYG51bGxgIGlmIHNlY3VyaXR5IGlzc3VlcyBmb3VuZCwgb3IgYHVuZGVmaW5lZGAgb24gcGFyc2UgZXJyb3IuXG4gKi9cbmZ1bmN0aW9uIHNhZmVQYXJzZSAodGV4dCwgcmV2aXZlcikge1xuICBjb25zdCB7IHN0YWNrVHJhY2VMaW1pdCB9ID0gRXJyb3JcbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gMFxuICB0cnkge1xuICAgIHJldHVybiBfcGFyc2UodGV4dCwgcmV2aXZlciwgeyBzYWZlOiB0cnVlIH0pXG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfSBmaW5hbGx5IHtcbiAgICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBzdGFja1RyYWNlTGltaXRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhcnNlXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gcGFyc2Vcbm1vZHVsZS5leHBvcnRzLnBhcnNlID0gcGFyc2Vcbm1vZHVsZS5leHBvcnRzLnNhZmVQYXJzZSA9IHNhZmVQYXJzZVxubW9kdWxlLmV4cG9ydHMuc2NhbiA9IGZpbHRlclxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHByZXR0eVxuXG5jb25zdCBzanMgPSByZXF1aXJlKCdzZWN1cmUtanNvbi1wYXJzZScpXG5cbmNvbnN0IGlzT2JqZWN0ID0gcmVxdWlyZSgnLi91dGlscy9pcy1vYmplY3QnKVxuY29uc3QgcHJldHRpZnlFcnJvckxvZyA9IHJlcXVpcmUoJy4vdXRpbHMvcHJldHRpZnktZXJyb3ItbG9nJylcbmNvbnN0IHByZXR0aWZ5TGV2ZWwgPSByZXF1aXJlKCcuL3V0aWxzL3ByZXR0aWZ5LWxldmVsJylcbmNvbnN0IHByZXR0aWZ5TWVzc2FnZSA9IHJlcXVpcmUoJy4vdXRpbHMvcHJldHRpZnktbWVzc2FnZScpXG5jb25zdCBwcmV0dGlmeU1ldGFkYXRhID0gcmVxdWlyZSgnLi91dGlscy9wcmV0dGlmeS1tZXRhZGF0YScpXG5jb25zdCBwcmV0dGlmeU9iamVjdCA9IHJlcXVpcmUoJy4vdXRpbHMvcHJldHRpZnktb2JqZWN0JylcbmNvbnN0IHByZXR0aWZ5VGltZSA9IHJlcXVpcmUoJy4vdXRpbHMvcHJldHRpZnktdGltZScpXG5jb25zdCBmaWx0ZXJMb2cgPSByZXF1aXJlKCcuL3V0aWxzL2ZpbHRlci1sb2cnKVxuXG5jb25zdCB7XG4gIExFVkVMUyxcbiAgTEVWRUxfS0VZLFxuICBMRVZFTF9OQU1FU1xufSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJylcblxuY29uc3QganNvblBhcnNlciA9IGlucHV0ID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4geyB2YWx1ZTogc2pzLnBhcnNlKGlucHV0LCB7IHByb3RvQWN0aW9uOiAncmVtb3ZlJyB9KSB9XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiB7IGVyciB9XG4gIH1cbn1cblxuLyoqXG4gKiBPcmNoZXN0cmF0ZXMgcHJvY2Vzc2luZyB0aGUgcmVjZWl2ZWQgbG9nIGRhdGEgYWNjb3JkaW5nIHRvIHRoZSBwcm92aWRlZFxuICogY29uZmlndXJhdGlvbiBhbmQgcmV0dXJucyBhIHByZXR0aWZpZWQgbG9nIHN0cmluZy5cbiAqXG4gKiBAdHlwZWRlZiB7ZnVuY3Rpb259IExvZ1ByZXR0aWZpZXJGdW5jXG4gKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGlucHV0RGF0YSBBIGxvZyBzdHJpbmcgb3IgYSBsb2ctbGlrZSBvYmplY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBBIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgdGhlIHByZXR0aWZpZWQgbG9nIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIHByZXR0eSAoaW5wdXREYXRhKSB7XG4gIGxldCBsb2dcbiAgaWYgKCFpc09iamVjdChpbnB1dERhdGEpKSB7XG4gICAgY29uc3QgcGFyc2VkID0ganNvblBhcnNlcihpbnB1dERhdGEpXG4gICAgaWYgKHBhcnNlZC5lcnIgfHwgIWlzT2JqZWN0KHBhcnNlZC52YWx1ZSkpIHtcbiAgICAgIC8vIHBhc3MgdGhyb3VnaFxuICAgICAgcmV0dXJuIGlucHV0RGF0YSArIHRoaXMuRU9MXG4gICAgfVxuICAgIGxvZyA9IHBhcnNlZC52YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxvZyA9IGlucHV0RGF0YVxuICB9XG5cbiAgaWYgKHRoaXMubWluaW11bUxldmVsKSB7XG4gICAgLy8gV2UgbmVlZCB0byBmaWd1cmUgb3V0IGlmIHRoZSBjdXN0b20gbGV2ZWxzIGhhcyB0aGUgZGVzaXJlZCBtaW5pbXVtXG4gICAgLy8gbGV2ZWwgJiB1c2UgdGhhdCBvbmUgaWYgZm91bmQuIElmIG5vdCwgZGV0ZXJtaW5lIGlmIHRoZSBsZXZlbCBleGlzdHNcbiAgICAvLyBpbiB0aGUgc3RhbmRhcmQgbGV2ZWxzLiBJbiBib3RoIGNhc2VzLCBtYWtlIHN1cmUgd2UgaGF2ZSB0aGUgbGV2ZWxcbiAgICAvLyBudW1iZXIgaW5zdGVhZCBvZiB0aGUgbGV2ZWwgbmFtZS5cbiAgICBsZXQgY29uZGl0aW9uXG4gICAgaWYgKHRoaXMudXNlT25seUN1c3RvbVByb3BzKSB7XG4gICAgICBjb25kaXRpb24gPSB0aGlzLmN1c3RvbUxldmVsc1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25kaXRpb24gPSB0aGlzLmN1c3RvbUxldmVsTmFtZXNbdGhpcy5taW5pbXVtTGV2ZWxdICE9PSB1bmRlZmluZWRcbiAgICB9XG4gICAgbGV0IG1pbmltdW1cbiAgICBpZiAoY29uZGl0aW9uKSB7XG4gICAgICBtaW5pbXVtID0gdGhpcy5jdXN0b21MZXZlbE5hbWVzW3RoaXMubWluaW11bUxldmVsXVxuICAgIH0gZWxzZSB7XG4gICAgICBtaW5pbXVtID0gTEVWRUxfTkFNRVNbdGhpcy5taW5pbXVtTGV2ZWxdXG4gICAgfVxuICAgIGlmICghbWluaW11bSkge1xuICAgICAgbWluaW11bSA9IHR5cGVvZiB0aGlzLm1pbmltdW1MZXZlbCA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBMRVZFTF9OQU1FU1t0aGlzLm1pbmltdW1MZXZlbF1cbiAgICAgICAgOiBMRVZFTF9OQU1FU1tMRVZFTFNbdGhpcy5taW5pbXVtTGV2ZWxdLnRvTG93ZXJDYXNlKCldXG4gICAgfVxuXG4gICAgY29uc3QgbGV2ZWwgPSBsb2dbdGhpcy5sZXZlbEtleSA9PT0gdW5kZWZpbmVkID8gTEVWRUxfS0VZIDogdGhpcy5sZXZlbEtleV1cbiAgICBpZiAobGV2ZWwgPCBtaW5pbXVtKSByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IHByZXR0aWZpZWRNZXNzYWdlID0gcHJldHRpZnlNZXNzYWdlKHsgbG9nLCBjb250ZXh0OiB0aGlzLmNvbnRleHQgfSlcblxuICBpZiAodGhpcy5pZ25vcmVLZXlzIHx8IHRoaXMuaW5jbHVkZUtleXMpIHtcbiAgICBsb2cgPSBmaWx0ZXJMb2coeyBsb2csIGNvbnRleHQ6IHRoaXMuY29udGV4dCB9KVxuICB9XG5cbiAgY29uc3QgcHJldHRpZmllZExldmVsID0gcHJldHRpZnlMZXZlbCh7XG4gICAgbG9nLFxuICAgIGNvbnRleHQ6IHtcbiAgICAgIC4uLnRoaXMuY29udGV4dCxcbiAgICAgIC8vIFRoaXMgaXMgb2RkLiBUaGUgY29sb3JpemVyIGVuZHMgdXAgcmVseWluZyBvbiB0aGUgdmFsdWUgb2ZcbiAgICAgIC8vIGBjdXN0b21Qcm9wZXJ0aWVzYCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBgY3VzdG9tTGV2ZWxzYCBhbmRcbiAgICAgIC8vIGBjdXN0b21MZXZlbE5hbWVzYC5cbiAgICAgIC4uLnRoaXMuY29udGV4dC5jdXN0b21Qcm9wZXJ0aWVzXG4gICAgfVxuICB9KVxuICBjb25zdCBwcmV0dGlmaWVkTWV0YWRhdGEgPSBwcmV0dGlmeU1ldGFkYXRhKHsgbG9nLCBjb250ZXh0OiB0aGlzLmNvbnRleHQgfSlcbiAgY29uc3QgcHJldHRpZmllZFRpbWUgPSBwcmV0dGlmeVRpbWUoeyBsb2csIGNvbnRleHQ6IHRoaXMuY29udGV4dCB9KVxuXG4gIGxldCBsaW5lID0gJydcbiAgaWYgKHRoaXMubGV2ZWxGaXJzdCAmJiBwcmV0dGlmaWVkTGV2ZWwpIHtcbiAgICBsaW5lID0gYCR7cHJldHRpZmllZExldmVsfWBcbiAgfVxuXG4gIGlmIChwcmV0dGlmaWVkVGltZSAmJiBsaW5lID09PSAnJykge1xuICAgIGxpbmUgPSBgJHtwcmV0dGlmaWVkVGltZX1gXG4gIH0gZWxzZSBpZiAocHJldHRpZmllZFRpbWUpIHtcbiAgICBsaW5lID0gYCR7bGluZX0gJHtwcmV0dGlmaWVkVGltZX1gXG4gIH1cblxuICBpZiAoIXRoaXMubGV2ZWxGaXJzdCAmJiBwcmV0dGlmaWVkTGV2ZWwpIHtcbiAgICBpZiAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgICBsaW5lID0gYCR7bGluZX0gJHtwcmV0dGlmaWVkTGV2ZWx9YFxuICAgIH0gZWxzZSB7XG4gICAgICBsaW5lID0gcHJldHRpZmllZExldmVsXG4gICAgfVxuICB9XG5cbiAgaWYgKHByZXR0aWZpZWRNZXRhZGF0YSkge1xuICAgIGlmIChsaW5lLmxlbmd0aCA+IDApIHtcbiAgICAgIGxpbmUgPSBgJHtsaW5lfSAke3ByZXR0aWZpZWRNZXRhZGF0YX06YFxuICAgIH0gZWxzZSB7XG4gICAgICBsaW5lID0gcHJldHRpZmllZE1ldGFkYXRhXG4gICAgfVxuICB9XG5cbiAgaWYgKGxpbmUuZW5kc1dpdGgoJzonKSA9PT0gZmFsc2UgJiYgbGluZSAhPT0gJycpIHtcbiAgICBsaW5lICs9ICc6J1xuICB9XG5cbiAgaWYgKHByZXR0aWZpZWRNZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICBpZiAobGluZS5sZW5ndGggPiAwKSB7XG4gICAgICBsaW5lID0gYCR7bGluZX0gJHtwcmV0dGlmaWVkTWVzc2FnZX1gXG4gICAgfSBlbHNlIHtcbiAgICAgIGxpbmUgPSBwcmV0dGlmaWVkTWVzc2FnZVxuICAgIH1cbiAgfVxuXG4gIGlmIChsaW5lLmxlbmd0aCA+IDAgJiYgIXRoaXMuc2luZ2xlTGluZSkge1xuICAgIGxpbmUgKz0gdGhpcy5FT0xcbiAgfVxuXG4gIC8vIHBpbm9ANysgZG9lcyBub3QgbG9nIHRoaXMgYW55bW9yZVxuICBpZiAobG9nLnR5cGUgPT09ICdFcnJvcicgJiYgdHlwZW9mIGxvZy5zdGFjayA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBwcmV0dGlmaWVkRXJyb3JMb2cgPSBwcmV0dGlmeUVycm9yTG9nKHsgbG9nLCBjb250ZXh0OiB0aGlzLmNvbnRleHQgfSlcbiAgICBpZiAodGhpcy5zaW5nbGVMaW5lKSBsaW5lICs9IHRoaXMuRU9MXG4gICAgbGluZSArPSBwcmV0dGlmaWVkRXJyb3JMb2dcbiAgfSBlbHNlIGlmICh0aGlzLmhpZGVPYmplY3QgPT09IGZhbHNlKSB7XG4gICAgY29uc3Qgc2tpcEtleXMgPSBbXG4gICAgICB0aGlzLm1lc3NhZ2VLZXksXG4gICAgICB0aGlzLmxldmVsS2V5LFxuICAgICAgdGhpcy50aW1lc3RhbXBLZXlcbiAgICBdXG4gICAgICAubWFwKChrZXkpID0+IGtleS5yZXBsYWNlQWxsKC9cXFxcL2csICcnKSlcbiAgICAgIC5maWx0ZXIoa2V5ID0+IHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBsb2dba2V5XSA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICB0eXBlb2YgbG9nW2tleV0gPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgdHlwZW9mIGxvZ1trZXldID09PSAnYm9vbGVhbidcbiAgICAgIH0pXG4gICAgY29uc3QgcHJldHRpZmllZE9iamVjdCA9IHByZXR0aWZ5T2JqZWN0KHtcbiAgICAgIGxvZyxcbiAgICAgIHNraXBLZXlzLFxuICAgICAgY29udGV4dDogdGhpcy5jb250ZXh0XG4gICAgfSlcblxuICAgIC8vIEluIHNpbmdsZSBsaW5lIG1vZGUsIGluY2x1ZGUgYSBzcGFjZSBvbmx5IGlmIHByZXR0aWZpZWQgdmVyc2lvbiBpc24ndCBlbXB0eVxuICAgIGlmICh0aGlzLnNpbmdsZUxpbmUgJiYgIS9eXFxzJC8udGVzdChwcmV0dGlmaWVkT2JqZWN0KSkge1xuICAgICAgbGluZSArPSAnICdcbiAgICB9XG4gICAgbGluZSArPSBwcmV0dGlmaWVkT2JqZWN0XG4gIH1cblxuICByZXR1cm4gbGluZVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB7IGlzQ29sb3JTdXBwb3J0ZWQgfSA9IHJlcXVpcmUoJ2NvbG9yZXR0ZScpXG5jb25zdCBwdW1wID0gcmVxdWlyZSgncHVtcCcpXG5jb25zdCB7IFRyYW5zZm9ybSB9ID0gcmVxdWlyZSgnbm9kZTpzdHJlYW0nKVxuY29uc3QgYWJzdHJhY3RUcmFuc3BvcnQgPSByZXF1aXJlKCdwaW5vLWFic3RyYWN0LXRyYW5zcG9ydCcpXG5jb25zdCBjb2xvcnMgPSByZXF1aXJlKCcuL2xpYi9jb2xvcnMnKVxuY29uc3Qge1xuICBFUlJPUl9MSUtFX0tFWVMsXG4gIExFVkVMX0tFWSxcbiAgTEVWRUxfTEFCRUwsXG4gIE1FU1NBR0VfS0VZLFxuICBUSU1FU1RBTVBfS0VZXG59ID0gcmVxdWlyZSgnLi9saWIvY29uc3RhbnRzJylcbmNvbnN0IHtcbiAgYnVpbGRTYWZlU29uaWNCb29tLFxuICBwYXJzZUZhY3RvcnlPcHRpb25zXG59ID0gcmVxdWlyZSgnLi9saWIvdXRpbHMnKVxuY29uc3QgcHJldHR5ID0gcmVxdWlyZSgnLi9saWIvcHJldHR5JylcblxuLyoqXG4gKiBAdHlwZWRlZiB7b2JqZWN0fSBQaW5vUHJldHR5T3B0aW9uc1xuICogQHByb3BlcnR5IHtib29sZWFufSBbY29sb3JpemVdIEluZGljYXRlcyBpZiBjb2xvcnMgc2hvdWxkIGJlIHVzZWQgd2hlblxuICogcHJldHRpZnlpbmcuIFRoZSBkZWZhdWx0IHdpbGwgYmUgZGV0ZXJtaW5lZCBieSB0aGUgdGVybWluYWwgY2FwYWJpbGl0aWVzIGF0XG4gKiBydW4gdGltZS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2NvbG9yaXplT2JqZWN0cz10cnVlXSBBcHBseSBjb2xvcmluZyB0byByZW5kZXJlZCBvYmplY3RzXG4gKiB3aGVuIGNvbG9yaW5nIGlzIGVuYWJsZWQuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtjcmxmPWZhbHNlXSBFbmQgbGluZXMgd2l0aCBgXFxyXFxuYCBpbnN0ZWFkIG9mIGBcXG5gLlxuICogQHByb3BlcnR5IHtzdHJpbmd8bnVsbH0gW2N1c3RvbUNvbG9ycz1udWxsXSBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGNvbG9yc1xuICogdG8gdXNlIGZvciBzcGVjaWZpYyBsZXZlbCBsYWJlbHMsIGUuZy4gYGVycjpyZWQsaW5mbzpibHVlYC5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfG51bGx9IFtjdXN0b21MZXZlbHM9bnVsbF0gQSBjb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiB1c2VyXG4gKiBkZWZpbmVkIGxldmVsIG5hbWVzIGFuZCBudW1iZXJzLCBlLmcuIGBlcnI6OTksaW5mbzoxYC5cbiAqIEBwcm9wZXJ0eSB7Q3VzdG9tUHJldHRpZmllcnN9IFtjdXN0b21QcmV0dGlmaWVycz17fV0gQSBzZXQgb2YgcHJldHRpZmllclxuICogZnVuY3Rpb25zIHRvIGFwcGx5IHRvIGtleXMgZGVmaW5lZCBpbiB0aGlzIG9iamVjdC5cbiAqIEBwcm9wZXJ0eSB7S19FUlJPUl9MSUtFX0tFWVN9IFtlcnJvckxpa2VPYmplY3RLZXlzXSBBIGxpc3Qgb2Ygc3RyaW5nIHByb3BlcnR5XG4gKiBuYW1lcyB0byBjb25zaWRlciBhcyBlcnJvciBvYmplY3RzLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtlcnJvclByb3BzPScnXSBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIHByb3BlcnRpZXMgb25cbiAqIGVycm9yIG9iamVjdHMgdG8gaW5jbHVkZSBpbiB0aGUgb3V0cHV0LlxuICogQHByb3BlcnR5IHtib29sZWFufSBbaGlkZU9iamVjdD1mYWxzZV0gV2hlbiBgdHJ1ZWAsIGRhdGEgb2JqZWN0cyB3aWxsIGJlXG4gKiBvbWl0dGVkIGZyb20gdGhlIG91dHB1dCAoZXhjZXB0IGZvciBlcnJvciBvYmplY3RzKS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbaWdub3JlPSdob3N0bmFtZSddIEEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgbG9nIGtleXNcbiAqIHRvIG9taXQgd2hlbiBvdXRwdXR0aW5nIHRoZSBwcmV0dGlmaWVkIGxvZyBpbmZvcm1hdGlvbi5cbiAqIEBwcm9wZXJ0eSB7dW5kZWZpbmVkfHN0cmluZ30gW2luY2x1ZGU9dW5kZWZpbmVkXSBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mXG4gKiBsb2cga2V5cyB0byBpbmNsdWRlIGluIHRoZSBwcmV0dGlmaWVkIGxvZyBpbmZvcm1hdGlvbi4gT25seSB0aGUga2V5cyBpbiB0aGlzXG4gKiBsaXN0IHdpbGwgYmUgaW5jbHVkZWQgaW4gdGhlIG91dHB1dC5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW2xldmVsRmlyc3Q9ZmFsc2VdIFdoZW4gdHJ1ZSwgdGhlIGxvZyBsZXZlbCB3aWxsIGJlIHRoZVxuICogZmlyc3QgZmllbGQgaW4gdGhlIHByZXR0aWZpZWQgb3V0cHV0LlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtsZXZlbEtleT0nbGV2ZWwnXSBUaGUga2V5IG5hbWUgaW4gdGhlIGxvZyBkYXRhIHRoYXRcbiAqIGNvbnRhaW5zIHRoZSBsZXZlbCB2YWx1ZSBmb3IgdGhlIGxvZy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbGV2ZWxMYWJlbD0nbGV2ZWxMYWJlbCddIFRva2VuIG5hbWUgdG8gdXNlIGluXG4gKiBgbWVzc2FnZUZvcm1hdGAgdG8gcmVwcmVzZW50IHRoZSBuYW1lIG9mIHRoZSBsb2dnZWQgbGV2ZWwuXG4gKiBAcHJvcGVydHkge251bGx8TWVzc2FnZUZvcm1hdFN0cmluZ3xNZXNzYWdlRm9ybWF0RnVuY3Rpb259IFttZXNzYWdlRm9ybWF0PW51bGxdXG4gKiBXaGVuIGEgc3RyaW5nLCBkZWZpbmVzIGhvdyB0aGUgcHJldHRpZmllZCBsaW5lIHNob3VsZCBiZSBmb3JtYXR0ZWQgYWNjb3JkaW5nXG4gKiB0byBkZWZpbmVkIHRva2Vucy4gV2hlbiBhIGZ1bmN0aW9uLCBhIHN5bmNocm9ub3VzIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhXG4gKiBmb3JtYXR0ZWQgc3RyaW5nLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IFttZXNzYWdlS2V5PSdtc2cnXSBEZWZpbmVzIHRoZSBrZXkgaW4gaW5jb21pbmcgbG9ncyB0aGF0XG4gKiBjb250YWlucyB0aGUgbWVzc2FnZSBvZiB0aGUgbG9nLCBpZiBwcmVzZW50LlxuICogQHByb3BlcnR5IHt1bmRlZmluZWR8c3RyaW5nfG51bWJlcn0gW21pbmltdW1MZXZlbD11bmRlZmluZWRdIFRoZSBtaW5pbXVtXG4gKiBsZXZlbCBmb3IgbG9ncyB0aGF0IHNob3VsZCBiZSBwcm9jZXNzZWQuIEFueSBsb2dzIGJlbG93IHRoaXMgbGV2ZWwgd2lsbFxuICogYmUgb21pdHRlZC5cbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBbb3V0cHV0U3RyZWFtPXByb2Nlc3Muc3Rkb3V0XSBUaGUgc3RyZWFtIHRvIHdyaXRlXG4gKiBwcmV0dGlmaWVkIGxvZyBsaW5lcyB0by5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3NpbmdsZUxpbmU9ZmFsc2VdIFdoZW4gYHRydWVgIGFueSBvYmplY3RzLCBleGNlcHQgZXJyb3JcbiAqIG9iamVjdHMsIGluIHRoZSBsb2cgZGF0YSB3aWxsIGJlIHByaW50ZWQgYXMgYSBzaW5nbGUgbGluZSBpbnN0ZWFkIGFzIG11bHRpcGxlXG4gKiBsaW5lcy5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdGltZXN0YW1wS2V5PSd0aW1lJ10gRGVmaW5lcyB0aGUga2V5IGluIGluY29taW5nIGxvZ3NcbiAqIHRoYXQgY29udGFpbnMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbG9nLCBpZiBwcmVzZW50LlxuICogQHByb3BlcnR5IHtib29sZWFufHN0cmluZ30gW3RyYW5zbGF0ZVRpbWU9dHJ1ZV0gV2hlbiB0cnVlLCB3aWxsIHRyYW5zbGF0ZSBhXG4gKiBKYXZhU2NyaXB0IGRhdGUgaW50ZWdlciBpbnRvIGEgaHVtYW4tcmVhZGFibGUgc3RyaW5nLiBJZiBzZXQgdG8gYSBzdHJpbmcsXG4gKiBpdCBtdXN0IGJlIGEgZm9ybWF0IHN0cmluZy5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3VzZU9ubHlDdXN0b21Qcm9wcz10cnVlXSBXaGVuIHRydWUsIG9ubHkgY3VzdG9tIGxldmVsc1xuICogYW5kIGNvbG9ycyB3aWxsIGJlIHVzZWQgaWYgdGhleSBoYXZlIGJlZW4gcHJvdmlkZWQuXG4gKi9cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBvcHRpb25zIHRoYXQgd2lsbCBiZSB1c2VkIHdoZW4gcHJldHRpZnlpbmcgbG9nIGxpbmVzLlxuICpcbiAqIEB0eXBlIHtQaW5vUHJldHR5T3B0aW9uc31cbiAqL1xuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGNvbG9yaXplOiBpc0NvbG9yU3VwcG9ydGVkLFxuICBjb2xvcml6ZU9iamVjdHM6IHRydWUsXG4gIGNybGY6IGZhbHNlLFxuICBjdXN0b21Db2xvcnM6IG51bGwsXG4gIGN1c3RvbUxldmVsczogbnVsbCxcbiAgY3VzdG9tUHJldHRpZmllcnM6IHt9LFxuICBlcnJvckxpa2VPYmplY3RLZXlzOiBFUlJPUl9MSUtFX0tFWVMsXG4gIGVycm9yUHJvcHM6ICcnLFxuICBoaWRlT2JqZWN0OiBmYWxzZSxcbiAgaWdub3JlOiAnaG9zdG5hbWUnLFxuICBpbmNsdWRlOiB1bmRlZmluZWQsXG4gIGxldmVsRmlyc3Q6IGZhbHNlLFxuICBsZXZlbEtleTogTEVWRUxfS0VZLFxuICBsZXZlbExhYmVsOiBMRVZFTF9MQUJFTCxcbiAgbWVzc2FnZUZvcm1hdDogbnVsbCxcbiAgbWVzc2FnZUtleTogTUVTU0FHRV9LRVksXG4gIG1pbmltdW1MZXZlbDogdW5kZWZpbmVkLFxuICBvdXRwdXRTdHJlYW06IHByb2Nlc3Muc3Rkb3V0LFxuICBzaW5nbGVMaW5lOiBmYWxzZSxcbiAgdGltZXN0YW1wS2V5OiBUSU1FU1RBTVBfS0VZLFxuICB0cmFuc2xhdGVUaW1lOiB0cnVlLFxuICB1c2VPbmx5Q3VzdG9tUHJvcHM6IHRydWVcbn1cblxuLyoqXG4gKiBQcm9jZXNzZXMgdGhlIHN1cHBsaWVkIG9wdGlvbnMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgbG9nIGRhdGFcbiAqIGFuZCBwcm9kdWNlcyBhIHByZXR0aWZpZWQgbG9nIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1Bpbm9QcmV0dHlPcHRpb25zfSBvcHRpb25zIENvbmZpZ3VyYXRpb24gZm9yIHRoZSBwcmV0dGlmaWVyLlxuICogQHJldHVybnMge0xvZ1ByZXR0aWZpZXJGdW5jfVxuICovXG5mdW5jdGlvbiBwcmV0dHlGYWN0b3J5IChvcHRpb25zKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBwYXJzZUZhY3RvcnlPcHRpb25zKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKSlcbiAgcmV0dXJuIHByZXR0eS5iaW5kKHsgLi4uY29udGV4dCwgY29udGV4dCB9KVxufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtQaW5vUHJldHR5T3B0aW9uc30gQnVpbGRTdHJlYW1PcHRzXG4gKiBAcHJvcGVydHkge29iamVjdHxudW1iZXJ8c3RyaW5nfSBbZGVzdGluYXRpb25dIEEgZGVzdGluYXRpb24gc3RyZWFtLCBmaWxlXG4gKiBkZXNjcmlwdG9yLCBvciB0YXJnZXQgcGF0aCB0byBhIGZpbGUuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFthcHBlbmRdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IFtta2Rpcl1cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gW3N5bmM9ZmFsc2VdXG4gKi9cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEge0BsaW5rIExvZ1ByZXR0aWZpZXJGdW5jfSBhbmQgYSBzdHJlYW0gdG8gd2hpY2ggdGhlIHByb2R1Y2VkXG4gKiBwcmV0dGlmaWVkIGxvZyBkYXRhIHdpbGwgYmUgd3JpdHRlbi5cbiAqXG4gKiBAcGFyYW0ge0J1aWxkU3RyZWFtT3B0c30gb3B0c1xuICogQHJldHVybnMge1RyYW5zZm9ybSB8IChUcmFuc2Zvcm0gJiBPblVua25vd24pfVxuICovXG5mdW5jdGlvbiBidWlsZCAob3B0cyA9IHt9KSB7XG4gIGxldCBwcmV0dHkgPSBwcmV0dHlGYWN0b3J5KG9wdHMpXG4gIGxldCBkZXN0aW5hdGlvblxuICByZXR1cm4gYWJzdHJhY3RUcmFuc3BvcnQoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHNvdXJjZS5vbignbWVzc2FnZScsIGZ1bmN0aW9uIHBpbm9Db25maWdMaXN0ZW5lciAobWVzc2FnZSkge1xuICAgICAgaWYgKCFtZXNzYWdlIHx8IG1lc3NhZ2UuY29kZSAhPT0gJ1BJTk9fQ09ORklHJykgcmV0dXJuXG4gICAgICBPYmplY3QuYXNzaWduKG9wdHMsIHtcbiAgICAgICAgbWVzc2FnZUtleTogbWVzc2FnZS5jb25maWcubWVzc2FnZUtleSxcbiAgICAgICAgZXJyb3JMaWtlT2JqZWN0S2V5czogQXJyYXkuZnJvbShuZXcgU2V0KFsuLi4ob3B0cy5lcnJvckxpa2VPYmplY3RLZXlzIHx8IEVSUk9SX0xJS0VfS0VZUyksIG1lc3NhZ2UuY29uZmlnLmVycm9yS2V5XSkpLFxuICAgICAgICBjdXN0b21MZXZlbHM6IG1lc3NhZ2UuY29uZmlnLmxldmVscy52YWx1ZXNcbiAgICAgIH0pXG4gICAgICBwcmV0dHkgPSBwcmV0dHlGYWN0b3J5KG9wdHMpXG4gICAgICBzb3VyY2Uub2ZmKCdtZXNzYWdlJywgcGlub0NvbmZpZ0xpc3RlbmVyKVxuICAgIH0pXG4gICAgY29uc3Qgc3RyZWFtID0gbmV3IFRyYW5zZm9ybSh7XG4gICAgICBvYmplY3RNb2RlOiB0cnVlLFxuICAgICAgYXV0b0Rlc3Ryb3k6IHRydWUsXG4gICAgICB0cmFuc2Zvcm0gKGNodW5rLCBlbmMsIGNiKSB7XG4gICAgICAgIGNvbnN0IGxpbmUgPSBwcmV0dHkoY2h1bmspXG4gICAgICAgIGNiKG51bGwsIGxpbmUpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICh0eXBlb2Ygb3B0cy5kZXN0aW5hdGlvbiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9wdHMuZGVzdGluYXRpb24ud3JpdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGRlc3RpbmF0aW9uID0gb3B0cy5kZXN0aW5hdGlvblxuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0aW5hdGlvbiA9IGJ1aWxkU2FmZVNvbmljQm9vbSh7XG4gICAgICAgIGRlc3Q6IG9wdHMuZGVzdGluYXRpb24gfHwgMSxcbiAgICAgICAgYXBwZW5kOiBvcHRzLmFwcGVuZCxcbiAgICAgICAgbWtkaXI6IG9wdHMubWtkaXIsXG4gICAgICAgIHN5bmM6IG9wdHMuc3luYyAvLyBieSBkZWZhdWx0IHNvbmljIHdpbGwgYmUgYXN5bmNcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgc291cmNlLm9uKCd1bmtub3duJywgZnVuY3Rpb24gKGxpbmUpIHtcbiAgICAgIGRlc3RpbmF0aW9uLndyaXRlKGxpbmUgKyAnXFxuJylcbiAgICB9KVxuXG4gICAgcHVtcChzb3VyY2UsIHN0cmVhbSwgZGVzdGluYXRpb24pXG4gICAgcmV0dXJuIHN0cmVhbVxuICB9LCB7XG4gICAgcGFyc2U6ICdsaW5lcycsXG4gICAgY2xvc2UgKGVyciwgY2IpIHtcbiAgICAgIGRlc3RpbmF0aW9uLm9uKCdjbG9zZScsICgpID0+IHtcbiAgICAgICAgY2IoZXJyKVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnVpbGRcbm1vZHVsZS5leHBvcnRzLmJ1aWxkID0gYnVpbGRcbm1vZHVsZS5leHBvcnRzLlBpbm9QcmV0dHkgPSBidWlsZFxubW9kdWxlLmV4cG9ydHMucHJldHR5RmFjdG9yeSA9IHByZXR0eUZhY3Rvcnlcbm1vZHVsZS5leHBvcnRzLmNvbG9yaXplckZhY3RvcnkgPSBjb2xvcnNcbm1vZHVsZS5leHBvcnRzLmlzQ29sb3JTdXBwb3J0ZWQgPSBpc0NvbG9yU3VwcG9ydGVkXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gYnVpbGRcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUEseUVBQUFBLFVBQUE7QUFBQTtBQUVBLFdBQU8sZUFBZUEsVUFBUyxjQUFjLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFFNUQsUUFBSSxNQUFNLFFBQVEsS0FBSztBQUV2QixhQUFTLGtCQUFrQixHQUFHO0FBQzVCLFVBQUksS0FBSyxFQUFFLFdBQVksUUFBTztBQUM5QixVQUFJLElBQUksdUJBQU8sT0FBTyxJQUFJO0FBQzFCLFVBQUksR0FBRztBQUNMLGVBQU8sS0FBSyxDQUFDLEVBQUUsUUFBUSxTQUFVLEdBQUc7QUFDbEMsY0FBSSxNQUFNLFdBQVc7QUFDbkIsZ0JBQUksSUFBSSxPQUFPLHlCQUF5QixHQUFHLENBQUM7QUFDNUMsbUJBQU8sZUFBZSxHQUFHLEdBQUcsRUFBRSxNQUFNLElBQUk7QUFBQSxjQUN0QyxZQUFZO0FBQUEsY0FDWixLQUFLLFdBQVk7QUFBRSx1QkFBTyxFQUFFLENBQUM7QUFBQSxjQUFHO0FBQUEsWUFDbEMsQ0FBQztBQUFBLFVBQ0g7QUFBQSxRQUNGLENBQUM7QUFBQSxNQUNIO0FBQ0EsUUFBRSxTQUFTLElBQUk7QUFDZixhQUFPLE9BQU8sT0FBTyxDQUFDO0FBQUEsSUFDeEI7QUFFQSxRQUFJLGlCQUE4QixrQ0FBa0IsR0FBRztBQUV2RCxRQUFNO0FBQUEsTUFDSixNQUFNLENBQUM7QUFBQSxNQUNQLE9BQU8sQ0FBQztBQUFBLE1BQ1IsV0FBVztBQUFBLElBQ2IsSUFBSSxPQUFPLFlBQVksY0FBYyxDQUFDLElBQUk7QUFFMUMsUUFBTSxhQUFhLGNBQWMsT0FBTyxLQUFLLFNBQVMs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SUFBRSxPQUFPLEVBQUU7QUFBQSxVQUFDO0FBQUUsY0FBSSxJQUFFLFNBQVNDLEtBQUc7QUFBQyxtQkFBTyxLQUFLLEVBQUUsSUFBRSxVQUFVLEVBQUU7QUFBQSxVQUFDO0FBQUUsY0FBSSxLQUFHLFNBQVMsSUFBRztBQUFDLG1CQUFPLEtBQUssRUFBRSxJQUFFLE9BQU8sRUFBRTtBQUFBLFVBQUM7QUFBRSxjQUFJLEtBQUcsU0FBUyxJQUFHO0FBQUMsbUJBQU8sS0FBSyxFQUFFLElBQUUsU0FBUyxFQUFFO0FBQUEsVUFBQztBQUFFLGNBQUksS0FBRyxTQUFTLElBQUc7QUFBQyxtQkFBTyxLQUFLLEVBQUUsSUFBRSxTQUFTLEVBQUU7QUFBQSxVQUFDO0FBQUUsY0FBSSxLQUFHLFNBQVMsSUFBRztBQUFDLG1CQUFPLEtBQUssRUFBRSxJQUFFLGNBQWMsRUFBRTtBQUFBLFVBQUM7QUFBRSxjQUFJLEtBQUcsU0FBUyxJQUFHO0FBQUMsbUJBQU8sTUFBSSxJQUFFLEtBQUssa0JBQWtCO0FBQUEsVUFBQztBQUFFLGNBQUksS0FBRyxTQUFTLElBQUc7QUFBQyxtQkFBTyxRQUFRLElBQUk7QUFBQSxVQUFDO0FBQUUsY0FBSSxLQUFHLFNBQVMsSUFBRztBQUFDLG1CQUFPLGFBQWEsSUFBSTtBQUFBLFVBQUM7QUFBRSxjQUFJLFFBQU0sRUFBQyxHQUFFLFNBQVMsSUFBRztBQUFDLG1CQUFPLEdBQUc7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxJQUFJLEdBQUcsQ0FBQztBQUFBLFVBQUMsR0FBRSxLQUFJLFNBQVMsTUFBSztBQUFDLG1CQUFPLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQztBQUFBLFVBQUMsR0FBRSxLQUFJLFNBQVMsTUFBSztBQUFDLG1CQUFPLFdBQVcsRUFBQyxHQUFFLEVBQUUsR0FBRSxHQUFFLEdBQUcsR0FBRSxHQUFFLEdBQUcsR0FBRSxHQUFFLEVBQUUsR0FBRSxTQUFRLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQyxHQUFFLE9BQU0sS0FBSSxDQUFDO0FBQUEsVUFBQyxHQUFFLE1BQUssU0FBUyxPQUFNO0FBQUMsbUJBQU8sV0FBVyxLQUFLLFNBQVMsRUFBRSxJQUFFLENBQUM7QUFBQSxVQUFDLEdBQUUsTUFBSyxTQUFTLE9BQU07QUFBQyxtQkFBTyxXQUFXLEVBQUMsR0FBRSxFQUFFLEdBQUUsR0FBRSxHQUFHLEdBQUUsR0FBRSxHQUFHLEdBQUUsR0FBRSxFQUFFLEdBQUUsU0FBUSxXQUFXLEtBQUssU0FBUyxFQUFFLElBQUUsQ0FBQyxFQUFDLENBQUM7QUFBQSxVQUFDLEdBQUUsR0FBRSxTQUFTLElBQUc7QUFBQyxtQkFBTyxHQUFHLElBQUU7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxJQUFJLEdBQUcsSUFBRSxDQUFDO0FBQUEsVUFBQyxHQUFFLEtBQUksU0FBUyxNQUFLO0FBQUMsbUJBQU8sV0FBVyxLQUFLLFdBQVcsR0FBRyxDQUFDO0FBQUEsVUFBQyxHQUFFLE1BQUssU0FBUyxPQUFNO0FBQUMsbUJBQU8sV0FBVyxLQUFLLFdBQVcsR0FBRyxJQUFFLEVBQUU7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztBQUFBLFVBQUMsR0FBRSxNQUFLLFNBQVMsT0FBTTtBQUFDLG1CQUFPLElBQUksRUFBRSxHQUFFLENBQUM7QUFBQSxVQUFDLEdBQUUsR0FBRSxTQUFTLElBQUc7QUFBQyxtQkFBTyxHQUFHLElBQUUsTUFBSTtBQUFBLFVBQUUsR0FBRSxJQUFHLFNBQVMsS0FBSTtBQUFDLG1CQUFPLElBQUksR0FBRyxJQUFFLE1BQUksRUFBRTtBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsSUFBRztBQUFDLG1CQUFPLEdBQUc7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxJQUFJLEdBQUcsQ0FBQztBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsSUFBRztBQUFDLG1CQUFPLEdBQUc7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxJQUFJLEdBQUcsQ0FBQztBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsSUFBRztBQUFDLG1CQUFPLEdBQUc7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxJQUFJLEdBQUcsQ0FBQztBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsSUFBRztBQUFDLG1CQUFPLElBQUksR0FBRyxHQUFFLENBQUM7QUFBQSxVQUFDLEdBQUUsR0FBRSxTQUFTLElBQUc7QUFBQyxtQkFBTyxJQUFJLEtBQUssTUFBTSxHQUFHLElBQUUsRUFBRSxDQUFDO0FBQUEsVUFBQyxHQUFFLEdBQUUsU0FBUyxJQUFHO0FBQUMsbUJBQU8sR0FBRyxJQUFFLEtBQUcsV0FBVyxLQUFLLFVBQVUsQ0FBQyxJQUFFLFdBQVcsS0FBSyxVQUFVLENBQUM7QUFBQSxVQUFDLEdBQUUsSUFBRyxTQUFTLEtBQUk7QUFBQyxtQkFBTyxHQUFHLElBQUUsS0FBRyxXQUFXLEtBQUssVUFBVSxDQUFDLElBQUUsV0FBVyxLQUFLLFVBQVUsQ0FBQztBQUFBLFVBQUMsR0FBRSxHQUFFLFNBQVMsSUFBRztBQUFDLG1CQUFPLEdBQUcsSUFBRSxLQUFHLFdBQVcsS0FBSyxVQUFVLENBQUMsSUFBRSxXQUFXLEtBQUssVUFBVSxDQUFDO0FBQUEsVUFBQyxHQUFFLElBQUcsU0FBUyxLQUFJO0FBQUMsbUJBQU8sR0FBRyxJQUFFLEtBQUcsV0FBVyxLQUFLLFVBQVUsQ0FBQyxJQUFFLFdBQVcsS0FBSyxVQUFVLENBQUM7QUFBQSxVQUFDLEdBQUUsR0FBRSxTQUFTLElBQUc7QUFBQyxtQkFBTyxNQUFJLFFBQU0sTUFBSSxTQUFPLE9BQU8sSUFBSSxFQUFFLE1BQU0sUUFBUSxLQUFHLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxRQUFRLGNBQWEsRUFBRSxFQUFFLFFBQVEsY0FBYSxLQUFLO0FBQUEsVUFBQyxHQUFFLEdBQUUsU0FBUyxJQUFHO0FBQUMsb0JBQU8sR0FBRyxJQUFFLElBQUUsTUFBSSxPQUFLLElBQUksS0FBSyxN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QUFBQSxNQUNmO0FBQUEsSUFDRixDQUFDO0FBRUQsUUFBSSxPQUFPLEtBQUssZ0JBQWdCLFlBQVksT0FBTyxLQUFLLFlBQVksVUFBVSxZQUFZO0FBQ3hGLG9CQUFjLEtBQUs7QUFBQSxJQUNyQixPQUFPO0FBQ0wsb0JBQWMsbUJBQW1CO0FBQUEsUUFDL0IsTUFBTSxLQUFLLGVBQWU7QUFBQSxRQUMxQixRQUFRLEtBQUs7QUFBQSxRQUNiLE9BQU8sS0FBSztBQUFBLFFBQ1osTUFBTSxLQUFLO0FBQUE7QUFBQSxNQUNiLENBQUM7QUFBQSxJQUNIO0FBRUEsV0FBTyxHQUFHLFdBQVcsU0FBVSxNQUFNO0FBQ25DLGtCQUFZLE1BQU0sT0FBTyxJQUFJO0FBQUEsSUFDL0IsQ0FBQztBQUVELFNBQUssUUFBUSxRQUFRLFdBQVc7QUFDaEMsV0FBTztBQUFBLEVBQ1QsR0FBRztBQUFBLElBQ0QsT0FBTztBQUFBLElBQ1AsTUFBTyxLQUFLLElBQUk7QUFDZCxrQkFBWSxHQUFHLFNBQVMsTUFBTTtBQUM1QixXQUFHLEdBQUc7QUFBQSxNQUNSLENBQUM7QUFBQSxJQUNIO0FBQUEsRUFDRixDQUFDO0FBQ0g7QUFFQSxPQUFPLFVBQVU7QUFDakIsT0FBTyxRQUFRLFFBQVE7QUFDdkIsT0FBTyxRQUFRLGFBQWE7QUFDNUIsT0FBTyxRQUFRLGdCQUFnQjtBQUMvQixPQUFPLFFBQVEsbUJBQW1CO0FBQ2xDLE9BQU8sUUFBUSxtQkFBbUI7QUFDbEMsT0FBTyxRQUFRLFVBQVU7IiwKICAibmFtZXMiOiBbImV4cG9ydHMiLCAiaXNDb2xvclN1cHBvcnRlZCIsICJjb2xvcnMiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiY2IiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAicHVtcCIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJUcmFuc2Zvcm0iLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiYnVpbGQiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXJyIiwgIm4iLCAicmVsZWFzZWRCdWZPYmoiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiYnVpbGRTYWZlU29uaWNCb29tIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImNvcHkiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiX3R5cGVvZiIsICJvYmoiLCAiZ2xvYmFsIiwgIl8iLCAiRCIsICJ5IiwgInBhZCIsICJnZXREYXlOYW1lIiwgInRvZGF5X2QiLCAidG9kYXlfbSIsICJ0b2RheV95IiwgInllc3RlcmRheV9kIiwgInllc3RlcmRheV9tIiwgInllc3RlcmRheV95IiwgInRvbW9ycm93X2QiLCAidG9tb3Jyb3dfbSIsICJ0b21vcnJvd195IiwgImdldFdlZWsiLCAiZ2V0RGF5T2ZXZWVrIiwgImtpbmRPZiIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJwYXJzZUZhY3RvcnlPcHRpb25zIiwgImNvbG9ycyIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJkZWZhdWx0T3B0aW9ucyIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJwbGFpbiIsICJlcnJvcnMiLCAicHJldHR5IiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgInByZXR0eSIsICJMRVZFTF9LRVkiLCAicHJldHR5Il0KfQo=
