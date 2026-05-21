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

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-helpers.js
var require_err_helpers = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-helpers.js"(exports2, module2) {
    "use strict";
    var isErrorLike = (err) => {
      return err && typeof err.message === "string";
    };
    var getErrorCause = (err) => {
      if (!err) return;
      const cause = err.cause;
      if (typeof cause === "function") {
        const causeResult = err.cause();
        return isErrorLike(causeResult) ? causeResult : void 0;
      } else {
        return isErrorLike(cause) ? cause : void 0;
      }
    };
    var _stackWithCauses = (err, seen) => {
      if (!isErrorLike(err)) return "";
      const stack = err.stack || "";
      if (seen.has(err)) {
        return stack + "\ncauses have become circular...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        return stack + "\ncaused by: " + _stackWithCauses(cause, seen);
      } else {
        return stack;
      }
    };
    var stackWithCauses = (err) => _stackWithCauses(err, /* @__PURE__ */ new Set());
    var _messageWithCauses = (err, seen, skip) => {
      if (!isErrorLike(err)) return "";
      const message = skip ? "" : err.message || "";
      if (seen.has(err)) {
        return message + ": ...";
      }
      const cause = getErrorCause(err);
      if (cause) {
        seen.add(err);
        const skipIfVErrorStyleCause = typeof err.cause === "function";
        return message + (skipIfVErrorStyleCause ? "" : ": ") + _messageWithCauses(cause, seen, skipIfVErrorStyleCause);
      } else {
        return message;
      }
    };
    var messageWithCauses = (err) => _messageWithCauses(err, /* @__PURE__ */ new Set());
    module2.exports = {
      isErrorLike,
      getErrorCause,
      stackWithCauses,
      messageWithCauses
    };
  }
});

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-proto.js
var require_err_proto = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-proto.js"(exports2, module2) {
    "use strict";
    var seen = /* @__PURE__ */ Symbol("circular-ref-tag");
    var rawSymbol = /* @__PURE__ */ Symbol("pino-raw-err-ref");
    var pinoErrProto = Object.create({}, {
      type: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      message: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      stack: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      aggregateErrors: {
        enumerable: true,
        writable: true,
        value: void 0
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoErrProto, rawSymbol, {
      writable: true,
      value: {}
    });
    module2.exports = {
      pinoErrProto,
      pinoErrorSymbols: {
        seen,
        rawSymbol
      }
    };
  }
});

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err.js
var require_err = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err.js"(exports2, module2) {
    "use strict";
    module2.exports = errSerializer;
    var { messageWithCauses, stackWithCauses, isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = messageWithCauses(err);
      _err.stack = stackWithCauses(err);
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errSerializer(err2));
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (key !== "cause" && !Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-with-cause.js
var require_err_with_cause = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/err-with-cause.js"(exports2, module2) {
    "use strict";
    module2.exports = errWithCauseSerializer;
    var { isErrorLike } = require_err_helpers();
    var { pinoErrProto, pinoErrorSymbols } = require_err_proto();
    var { seen } = pinoErrorSymbols;
    var { toString } = Object.prototype;
    function errWithCauseSerializer(err) {
      if (!isErrorLike(err)) {
        return err;
      }
      err[seen] = void 0;
      const _err = Object.create(pinoErrProto);
      _err.type = toString.call(err.constructor) === "[object Function]" ? err.constructor.name : err.name;
      _err.message = err.message;
      _err.stack = err.stack;
      if (Array.isArray(err.errors)) {
        _err.aggregateErrors = err.errors.map((err2) => errWithCauseSerializer(err2));
      }
      if (isErrorLike(err.cause) && !Object.prototype.hasOwnProperty.call(err.cause, seen)) {
        _err.cause = errWithCauseSerializer(err.cause);
      }
      for (const key in err) {
        if (_err[key] === void 0) {
          const val = err[key];
          if (isErrorLike(val)) {
            if (!Object.prototype.hasOwnProperty.call(val, seen)) {
              _err[key] = errWithCauseSerializer(val);
            }
          } else {
            _err[key] = val;
          }
        }
      }
      delete err[seen];
      _err.raw = err;
      return _err;
    }
  }
});

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/req.js
var require_req = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/req.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      mapHttpRequest,
      reqSerializer
    };
    var rawSymbol = /* @__PURE__ */ Symbol("pino-raw-req-ref");
    var pinoReqProto = Object.create({}, {
      id: {
        enumerable: true,
        writable: true,
        value: ""
      },
      method: {
        enumerable: true,
        writable: true,
        value: ""
      },
      url: {
        enumerable: true,
        writable: true,
        value: ""
      },
      query: {
        enumerable: true,
        writable: true,
        value: ""
      },
      params: {
        enumerable: true,
        writable: true,
        value: ""
      },
      headers: {
        enumerable: true,
        writable: true,
        value: {}
      },
      remoteAddress: {
        enumerable: true,
        writable: true,
        value: ""
      },
      remotePort: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoReqProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function reqSerializer(req) {
      const connection = req.info || req.socket;
      const _req = Object.create(pinoReqProto);
      _req.id = typeof req.id === "function" ? req.id() : req.id || (req.info ? req.info.id : void 0);
      _req.method = req.method;
      if (req.originalUrl) {
        _req.url = req.originalUrl;
      } else {
        const path = req.path;
        _req.url = typeof path === "string" ? path : req.url ? req.url.path || req.url : void 0;
      }
      if (req.query) {
        _req.query = req.query;
      }
      if (req.params) {
        _req.params = req.params;
      }
      _req.headers = req.headers;
      _req.remoteAddress = connection && connection.remoteAddress;
      _req.remotePort = connection && connection.remotePort;
      _req.raw = req.raw || req;
      return _req;
    }
    function mapHttpRequest(req) {
      return {
        req: reqSerializer(req)
      };
    }
  }
});

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/res.js
var require_res = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/lib/res.js"(exports2, module2) {
    "use strict";
    module2.exports = {
      mapHttpResponse,
      resSerializer
    };
    var rawSymbol = /* @__PURE__ */ Symbol("pino-raw-res-ref");
    var pinoResProto = Object.create({}, {
      statusCode: {
        enumerable: true,
        writable: true,
        value: 0
      },
      headers: {
        enumerable: true,
        writable: true,
        value: ""
      },
      raw: {
        enumerable: false,
        get: function() {
          return this[rawSymbol];
        },
        set: function(val) {
          this[rawSymbol] = val;
        }
      }
    });
    Object.defineProperty(pinoResProto, rawSymbol, {
      writable: true,
      value: {}
    });
    function resSerializer(res) {
      const _res = Object.create(pinoResProto);
      _res.statusCode = res.headersSent ? res.statusCode : null;
      _res.headers = res.getHeaders ? res.getHeaders() : res._headers;
      _res.raw = res;
      return _res;
    }
    function mapHttpResponse(res) {
      return {
        res: resSerializer(res)
      };
    }
  }
});

// node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/index.js
var require_pino_std_serializers = __commonJS({
  "node_modules/.pnpm/pino-std-serializers@7.1.0/node_modules/pino-std-serializers/index.js"(exports2, module2) {
    "use strict";
    var errSerializer = require_err();
    var errWithCauseSerializer = require_err_with_cause();
    var reqSerializers = require_req();
    var resSerializers = require_res();
    module2.exports = {
      err: errSerializer,
      errWithCause: errWithCauseSerializer,
      mapHttpRequest: reqSerializers.mapHttpRequest,
      mapHttpResponse: resSerializers.mapHttpResponse,
      req: reqSerializers.reqSerializer,
      res: resSerializers.resSerializer,
      wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
        if (customSerializer === errSerializer) return customSerializer;
        return function wrapErrSerializer(err) {
          return customSerializer(errSerializer(err));
        };
      },
      wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
        if (customSerializer === reqSerializers.reqSerializer) return customSerializer;
        return function wrappedReqSerializer(req) {
          return customSerializer(reqSerializers.reqSerializer(req));
        };
      },
      wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
        if (customSerializer === resSerializers.resSerializer) return customSerializer;
        return function wrappedResSerializer(res) {
          return customSerializer(resSerializers.resSerializer(res));
        };
      }
    };
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/caller.js
var require_caller = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/caller.js"(exports2, module2) {
    "use strict";
    function noOpPrepareStackTrace(_, stack) {
      return stack;
    }
    module2.exports = function getCallers() {
      const originalPrepare = Error.prepareStackTrace;
      Error.prepareStackTrace = noOpPrepareStackTrace;
      const stack = new Error().stack;
      Error.prepareStackTrace = originalPrepare;
      if (!Array.isArray(stack)) {
        return void 0;
      }
      const entries = stack.slice(2);
      const fileNames = [];
      for (const entry of entries) {
        if (!entry) {
          continue;
        }
        fileNames.push(entry.getFileName());
      }
      return fileNames;
    };
  }
});

// node_modules/.pnpm/@pinojs+redact@0.4.0/node_modules/@pinojs/redact/index.js
var require_redact = __commonJS({
  "node_modules/.pnpm/@pinojs+redact@0.4.0/node_modules/@pinojs/redact/index.js"(exports2, module2) {
    "use strict";
    function deepClone(obj) {
      if (obj === null || typeof obj !== "object") {
        return obj;
      }
      if (obj instanceof Date) {
        return new Date(obj.getTime());
      }
      if (obj instanceof Array) {
        const cloned = [];
        for (let i = 0; i < obj.length; i++) {
          cloned[i] = deepClone(obj[i]);
        }
        return cloned;
      }
      if (typeof obj === "object") {
        const cloned = Object.create(Object.getPrototypeOf(obj));
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
          }
        }
        return cloned;
      }
      return obj;
    }
    function parsePath(path) {
      const parts = [];
      let current = "";
      let inBrackets = false;
      let inQuotes = false;
      let quoteChar = "";
      for (let i = 0; i < path.length; i++) {
        const char = path[i];
        if (!inBrackets && char === ".") {
          if (current) {
            parts.push(current);
            current = "";
          }
        } else if (char === "[") {
          if (current) {
            parts.push(current);
            current = "";
          }
          inBrackets = true;
        } else if (char === "]" && inBrackets) {
          parts.push(current);
          current = "";
          inBrackets = false;
          inQuotes = false;
        } else if ((char === '"' || char === "'") && inBrackets) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuotes = false;
            quoteChar = "";
          } else {
            current += char;
          }
        } else {
          current += char;
        }
      }
      if (current) {
        parts.push(current);
      }
      return parts;
    }
    function setValue(obj, parts, value) {
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (typeof current !== "object" || current === null || !(key in current)) {
          return false;
        }
        if (typeof current[key] !== "object" || current[key] === null) {
          return false;
        }
        current = current[key];
      }
      const lastKey = parts[parts.length - 1];
      if (lastKey === "*") {
        if (Array.isArray(current)) {
          for (let i = 0; i < current.length; i++) {
            current[i] = value;
          }
        } else if (typeof current === "object" && current !== null) {
          for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
              current[key] = value;
            }
          }
        }
      } else {
        if (typeof current === "object" && current !== null && lastKey in current && Object.prototype.hasOwnProperty.call(current, lastKey)) {
          current[lastKey] = value;
        }
      }
      return true;
    }
    function removeKey(obj, parts) {
      let current = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (typeof current !== "object" || current === null || !(key in current)) {
          return false;
        }
        if (typeof current[key] !== "object" || current[key] === null) {
          return false;
        }
        current = current[key];
      }
      const lastKey = parts[parts.length - 1];
      if (lastKey === "*") {
        if (Array.isArray(current)) {
          for (let i = 0; i < current.length; i++) {
            current[i] = void 0;
          }
        } else if (typeof current === "object" && current !== null) {
          for (const key in current) {
            if (Object.prototype.hasOwnProperty.call(current, key)) {
              delete current[key];
            }
          }
        }
      } else {
        if (typeof current === "object" && current !== null && lastKey in current && Object.prototype.hasOwnProperty.call(current, lastKey)) {
          delete current[lastKey];
        }
      }
      return true;
    }
    var PATH_NOT_FOUND = /* @__PURE__ */ Symbol("PATH_NOT_FOUND");
    function getValueIfExists(obj, parts) {
      let current = obj;
      for (const part of parts) {
        if (current === null || current === void 0) {
          return PATH_NOT_FOUND;
        }
        if (typeof current !== "object" || current === null) {
          return PATH_NOT_FOUND;
        }
        if (!(part in current)) {
          return PATH_NOT_FOUND;
        }
        current = current[part];
      }
      return current;
    }
    function getValue(obj, parts) {
      let current = obj;
      for (const part of parts) {
        if (current === null || current === void 0) {
          return void 0;
        }
        if (typeof current !== "object" || current === null) {
          return void 0;
        }
        current = current[part];
      }
      return current;
    }
    function redactPaths(obj, paths, censor, remove = false) {
      for (const path of paths) {
        const parts = parsePath(path);
        if (parts.includes("*")) {
          redactWildcardPath(obj, parts, censor, path, remove);
        } else {
          if (remove) {
            removeKey(obj, parts);
          } else {
            const value = getValueIfExists(obj, parts);
            if (value === PATH_NOT_FOUND) {
              continue;
            }
            const actualCensor = typeof censor === "function" ? censor(value, parts) : censor;
            setValue(obj, parts, actualCensor);
          }
        }
      }
    }
    function redactWildcardPath(obj, parts, censor, originalPath, remove = false) {
      const wildcardIndex = parts.indexOf("*");
      if (wildcardIndex === parts.length - 1) {
        const parentParts = parts.slice(0, -1);
        let current = obj;
        for (const part of parentParts) {
          if (current === null || current === void 0) return;
          if (typeof current !== "object" || current === null) return;
          current = current[part];
        }
        if (Array.isArray(current)) {
          if (remove) {
            for (let i = 0; i < current.length; i++) {
              current[i] = void 0;
            }
          } else {
            for (let i = 0; i < current.length; i++) {
              const indexPath = [...parentParts, i.toString()];
              const actualCensor = typeof censor === "function" ? censor(current[i], indexPath) : censor;
              current[i] = actualCensor;
            }
          }
        } else if (typeof current === "object" && current !== null) {
          if (remove) {
            const keysToDelete = [];
            for (const key in current) {
              if (Object.prototype.hasOwnProperty.call(current, key)) {
                keysToDelete.push(key);
              }
            }
            for (const key of keysToDelete) {
              delete current[key];
            }
          } else {
            for (const key in current) {
              const keyPath = [...parentParts, key];
              const actualCensor = typeof censor === "function" ? censor(current[key], keyPath) : censor;
              current[key] = actualCensor;
            }
          }
        }
      } else {
        redactIntermediateWildcard(obj, parts, censor, wildcardIndex, originalPath, remove);
      }
    }
    function redactIntermediateWildcard(obj, parts, censor, wildcardIndex, originalPath, remove = false) {
      const beforeWildcard = parts.slice(0, wildcardIndex);
      const afterWildcard = parts.slice(wildcardIndex + 1);
      const pathArray = [];
      function traverse(current, pathLength) {
        if (pathLength === beforeWildcard.length) {
          if (Array.isArray(current)) {
            for (let i = 0; i < current.length; i++) {
              pathArray[pathLength] = i.toString();
              traverse(current[i], pathLength + 1);
            }
          } else if (typeof current === "object" && current !== null) {
            for (const key in current) {
              pathArray[pathLength] = key;
              traverse(current[key], pathLength + 1);
            }
          }
        } else if (pathLength < beforeWildcard.length) {
          const nextKey = beforeWildcard[pathLength];
          if (current && typeof current === "object" && current !== null && nextKey in current) {
            pathArray[pathLength] = nextKey;
            traverse(current[nextKey], pathLength + 1);
          }
        } else {
          if (afterWildcard.includes("*")) {
            const wrappedCensor = typeof censor === "function" ? (value, path) => {
              const fullPath = [...pathArray.slice(0, pathLength), ...path];
              return censor(value, fullPath);
            } : censor;
            redactWildcardPath(current, afterWildcard, wrappedCensor, originalPath, remove);
          } else {
            if (remove) {
              removeKey(current, afterWildcard);
            } else {
              const actualCensor = typeof censor === "function" ? censor(getValue(current, afterWildcard), [...pathArray.slice(0, pathLength), ...afterWildcard]) : censor;
              setValue(current, afterWildcard, actualCensor);
            }
          }
        }
      }
      if (beforeWildcard.length === 0) {
        traverse(obj, 0);
      } else {
        let current = obj;
        for (let i = 0; i < beforeWildcard.length; i++) {
          const part = beforeWildcard[i];
          if (current === null || current === void 0) return;
          if (typeof current !== "object" || current === null) return;
          current = current[part];
          pathArray[i] = part;
        }
        if (current !== null && current !== void 0) {
          traverse(current, beforeWildcard.length);
        }
      }
    }
    function buildPathStructure(pathsToClone) {
      if (pathsToClone.length === 0) {
        return null;
      }
      const pathStructure = /* @__PURE__ */ new Map();
      for (const path of pathsToClone) {
        const parts = parsePath(path);
        let current = pathStructure;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!current.has(part)) {
            current.set(part, /* @__PURE__ */ new Map());
          }
          current = current.get(part);
        }
      }
      return pathStructure;
    }
    function selectiveClone(obj, pathStructure) {
      if (!pathStructure) {
        return obj;
      }
      function cloneSelectively(source, pathMap, depth = 0) {
        if (!pathMap || pathMap.size === 0) {
          return source;
        }
        if (source === null || typeof source !== "object") {
          return source;
        }
        if (source instanceof Date) {
          return new Date(source.getTime());
        }
        if (Array.isArray(source)) {
          const cloned2 = [];
          for (let i = 0; i < source.length; i++) {
            const indexStr = i.toString();
            if (pathMap.has(indexStr) || pathMap.has("*")) {
              cloned2[i] = cloneSelectively(source[i], pathMap.get(indexStr) || pathMap.get("*"));
            } else {
              cloned2[i] = source[i];
            }
          }
          return cloned2;
        }
        const cloned = Object.create(Object.getPrototypeOf(source));
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (pathMap.has(key) || pathMap.has("*")) {
              cloned[key] = cloneSelectively(source[key], pathMap.get(key) || pathMap.get("*"));
            } else {
              cloned[key] = source[key];
            }
          }
        }
        return cloned;
      }
      return cloneSelectively(obj, pathStructure);
    }
    function validatePath(path) {
      if (typeof path !== "string") {
        throw new Error("Paths must be (non-empty) strings");
      }
      if (path === "") {
        throw new Error("Invalid redaction path ()");
      }
      if (path.includes("..")) {
        throw new Error(`Invalid redaction path (${path})`);
      }
      if (path.includes(",")) {
        throw new Error(`Invalid redaction path (${path})`);
      }
      let bracketCount = 0;
      let inQuotes = false;
      let quoteChar = "";
      for (let i = 0; i < path.length; i++) {
        const char = path[i];
        if ((char === '"' || char === "'") && bracketCount > 0) {
          if (!inQuotes) {
            inQuotes = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inQuotes = false;
            quoteChar = "";
          }
        } else if (char === "[" && !inQuotes) {
          bracketCount++;
        } else if (char === "]" && !inQuotes) {
          bracketCount--;
          if (bracketCount < 0) {
            throw new Error(`Invalid redaction path (${path})`);
          }
        }
      }
      if (bracketCount !== 0) {
        throw new Error(`Invalid redaction path (${path})`);
      }
    }
    function validatePaths(paths) {
      if (!Array.isArray(paths)) {
        throw new TypeError("paths must be an array");
      }
      for (const path of paths) {
        validatePath(path);
      }
    }
    function slowRedact(options = {}) {
      const {
        paths = [],
        censor = "[REDACTED]",
        serialize = JSON.stringify,
        strict = true,
        remove = false
      } = options;
      validatePaths(paths);
      const pathStructure = buildPathStructure(paths);
      return function redact(obj) {
        if (strict && (obj === null || typeof obj !== "object")) {
          if (obj === null || obj === void 0) {
            return serialize ? serialize(obj) : obj;
          }
          if (typeof obj !== "object") {
            return serialize ? serialize(obj) : obj;
          }
        }
        const cloned = selectiveClone(obj, pathStructure);
        const original = obj;
        let actualCensor = censor;
        if (typeof censor === "function") {
          actualCensor = censor;
        }
        redactPaths(cloned, paths, actualCensor, remove);
        if (serialize === false) {
          cloned.restore = function() {
            return deepClone(original);
          };
          return cloned;
        }
        if (typeof serialize === "function") {
          return serialize(cloned);
        }
        return JSON.stringify(cloned);
      };
    }
    module2.exports = slowRedact;
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/symbols.js
var require_symbols = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/symbols.js"(exports2, module2) {
    "use strict";
    var setLevelSym = /* @__PURE__ */ Symbol("pino.setLevel");
    var getLevelSym = /* @__PURE__ */ Symbol("pino.getLevel");
    var levelValSym = /* @__PURE__ */ Symbol("pino.levelVal");
    var levelCompSym = /* @__PURE__ */ Symbol("pino.levelComp");
    var useLevelLabelsSym = /* @__PURE__ */ Symbol("pino.useLevelLabels");
    var useOnlyCustomLevelsSym = /* @__PURE__ */ Symbol("pino.useOnlyCustomLevels");
    var mixinSym = /* @__PURE__ */ Symbol("pino.mixin");
    var lsCacheSym = /* @__PURE__ */ Symbol("pino.lsCache");
    var chindingsSym = /* @__PURE__ */ Symbol("pino.chindings");
    var asJsonSym = /* @__PURE__ */ Symbol("pino.asJson");
    var writeSym = /* @__PURE__ */ Symbol("pino.write");
    var redactFmtSym = /* @__PURE__ */ Symbol("pino.redactFmt");
    var timeSym = /* @__PURE__ */ Symbol("pino.time");
    var timeSliceIndexSym = /* @__PURE__ */ Symbol("pino.timeSliceIndex");
    var streamSym = /* @__PURE__ */ Symbol("pino.stream");
    var stringifySym = /* @__PURE__ */ Symbol("pino.stringify");
    var stringifySafeSym = /* @__PURE__ */ Symbol("pino.stringifySafe");
    var stringifiersSym = /* @__PURE__ */ Symbol("pino.stringifiers");
    var endSym = /* @__PURE__ */ Symbol("pino.end");
    var formatOptsSym = /* @__PURE__ */ Symbol("pino.formatOpts");
    var messageKeySym = /* @__PURE__ */ Symbol("pino.messageKey");
    var errorKeySym = /* @__PURE__ */ Symbol("pino.errorKey");
    var nestedKeySym = /* @__PURE__ */ Symbol("pino.nestedKey");
    var nestedKeyStrSym = /* @__PURE__ */ Symbol("pino.nestedKeyStr");
    var mixinMergeStrategySym = /* @__PURE__ */ Symbol("pino.mixinMergeStrategy");
    var msgPrefixSym = /* @__PURE__ */ Symbol("pino.msgPrefix");
    var wildcardFirstSym = /* @__PURE__ */ Symbol("pino.wildcardFirst");
    var serializersSym = /* @__PURE__ */ Symbol.for("pino.serializers");
    var formattersSym = /* @__PURE__ */ Symbol.for("pino.formatters");
    var hooksSym = /* @__PURE__ */ Symbol.for("pino.hooks");
    var needsMetadataGsym = /* @__PURE__ */ Symbol.for("pino.metadata");
    module2.exports = {
      setLevelSym,
      getLevelSym,
      levelValSym,
      levelCompSym,
      useLevelLabelsSym,
      mixinSym,
      lsCacheSym,
      chindingsSym,
      asJsonSym,
      writeSym,
      serializersSym,
      redactFmtSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      wildcardFirstSym,
      needsMetadataGsym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    };
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/redaction.js
var require_redaction = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/redaction.js"(exports2, module2) {
    "use strict";
    var Redact = require_redact();
    var { redactFmtSym, wildcardFirstSym } = require_symbols();
    var rx = /[^.[\]]+|\[([^[\]]*?)\]/g;
    var CENSOR = "[Redacted]";
    var strict = false;
    function redaction(opts, serialize) {
      const { paths, censor, remove } = handle(opts);
      const shape = paths.reduce((o, str) => {
        rx.lastIndex = 0;
        const first = rx.exec(str);
        const next = rx.exec(str);
        let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
        if (ns === "*") {
          ns = wildcardFirstSym;
        }
        if (next === null) {
          o[ns] = null;
          return o;
        }
        if (o[ns] === null) {
          return o;
        }
        const { index } = next;
        const nextPath = `${str.substr(index, str.length - 1)}`;
        o[ns] = o[ns] || [];
        if (ns !== wildcardFirstSym && o[ns].length === 0) {
          o[ns].push(...o[wildcardFirstSym] || []);
        }
        if (ns === wildcardFirstSym) {
          Object.keys(o).forEach(function(k) {
            if (o[k]) {
              o[k].push(nextPath);
            }
          });
        }
        o[ns].push(nextPath);
        return o;
      }, {});
      const result = {
        [redactFmtSym]: Redact({ paths, censor, serialize, strict, remove })
      };
      const topCensor = (...args) => {
        return typeof censor === "function" ? serialize(censor(...args)) : serialize(censor);
      };
      return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
        if (shape[k] === null) {
          o[k] = (value) => topCensor(value, [k]);
        } else {
          const wrappedCensor = typeof censor === "function" ? (value, path) => {
            return censor(value, [k, ...path]);
          } : censor;
          o[k] = Redact({
            paths: shape[k],
            censor: wrappedCensor,
            serialize,
            strict,
            remove
          });
        }
        return o;
      }, result);
    }
    function handle(opts) {
      if (Array.isArray(opts)) {
        opts = { paths: opts, censor: CENSOR };
        return opts;
      }
      let { paths, censor = CENSOR, remove } = opts;
      if (Array.isArray(paths) === false) {
        throw Error("pino \u2013 redact must contain an array of strings");
      }
      if (remove === true) censor = void 0;
      return { paths, censor, remove };
    }
    module2.exports = redaction;
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/time.js
var require_time = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/time.js"(exports2, module2) {
    "use strict";
    var nullTime = () => "";
    var epochTime = () => `,"time":${Date.now()}`;
    var unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
    var isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
    var NS_PER_MS = 1000000n;
    var NS_PER_SEC = 1000000000n;
    var startWallTimeNs = BigInt(Date.now()) * NS_PER_MS;
    var startHrTime = process.hrtime.bigint();
    var isoTimeNano = () => {
      const elapsedNs = process.hrtime.bigint() - startHrTime;
      const currentTimeNs = startWallTimeNs + elapsedNs;
      const secondsSinceEpoch = currentTimeNs / NS_PER_SEC;
      const nanosWithinSecond = currentTimeNs % NS_PER_SEC;
      const msSinceEpoch = Number(secondsSinceEpoch * 1000n + nanosWithinSecond / 1000000n);
      const date = new Date(msSinceEpoch);
      const year = date.getUTCFullYear();
      const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
      const day = date.getUTCDate().toString().padStart(2, "0");
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");
      return `,"time":"${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${nanosWithinSecond.toString().padStart(9, "0")}Z"`;
    };
    module2.exports = { nullTime, epochTime, unixTime, isoTime, isoTimeNano };
  }
});

// node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS({
  "node_modules/.pnpm/quick-format-unescaped@4.0.4/node_modules/quick-format-unescaped/index.js"(exports2, module2) {
    "use strict";
    function tryStringify(o) {
      try {
        return JSON.stringify(o);
      } catch (e) {
        return '"[Circular]"';
      }
    }
    module2.exports = format;
    function format(f, args, opts) {
      var ss = opts && opts.stringify || tryStringify;
      var offset = 1;
      if (typeof f === "object" && f !== null) {
        var len = args.length + offset;
        if (len === 1) return f;
        var objects = new Array(len);
        objects[0] = ss(f);
        for (var index = 1; index < len; index++) {
          objects[index] = ss(args[index]);
        }
        return objects.join(" ");
      }
      if (typeof f !== "string") {
        return f;
      }
      var argLen = args.length;
      if (argLen === 0) return f;
      var str = "";
      var a = 1 - offset;
      var lastPos = -1;
      var flen = f && f.length || 0;
      for (var i = 0; i < flen; ) {
        if (f.charCodeAt(i) === 37 && i + 1 < flen) {
          lastPos = lastPos > -1 ? lastPos : 0;
          switch (f.charCodeAt(i + 1)) {
            case 100:
            // 'd'
            case 102:
              if (a >= argLen)
                break;
              if (args[a] == null) break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += Number(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 105:
              if (a >= argLen)
                break;
              if (args[a] == null) break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += Math.floor(Number(args[a]));
              lastPos = i + 2;
              i++;
              break;
            case 79:
            // 'O'
            case 111:
            // 'o'
            case 106:
              if (a >= argLen)
                break;
              if (args[a] === void 0) break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              var type = typeof args[a];
              if (type === "string") {
                str += "'" + args[a] + "'";
                lastPos = i + 2;
                i++;
                break;
              }
              if (type === "function") {
                str += args[a].name || "<anonymous>";
                lastPos = i + 2;
                i++;
                break;
              }
              str += ss(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 115:
              if (a >= argLen)
                break;
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += String(args[a]);
              lastPos = i + 2;
              i++;
              break;
            case 37:
              if (lastPos < i)
                str += f.slice(lastPos, i);
              str += "%";
              lastPos = i + 2;
              i++;
              a--;
              break;
          }
          ++a;
        }
        ++i;
      }
      if (lastPos === -1)
        return f;
      else if (lastPos < flen) {
        str += f.slice(lastPos);
      }
      return str;
    }
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

// node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/package.json"(exports2, module2) {
    module2.exports = {
      name: "thread-stream",
      version: "3.1.0",
      description: "A streaming way to send data to a Node.js Worker Thread",
      main: "index.js",
      types: "index.d.ts",
      dependencies: {
        "real-require": "^0.2.0"
      },
      devDependencies: {
        "@types/node": "^20.1.0",
        "@types/tap": "^15.0.0",
        "@yao-pkg/pkg": "^5.11.5",
        desm: "^1.3.0",
        fastbench: "^1.0.1",
        husky: "^9.0.6",
        "pino-elasticsearch": "^8.0.0",
        "sonic-boom": "^4.0.1",
        standard: "^17.0.0",
        tap: "^16.2.0",
        "ts-node": "^10.8.0",
        typescript: "^5.3.2",
        "why-is-node-running": "^2.2.2"
      },
      scripts: {
        build: "tsc --noEmit",
        test: 'standard && npm run build && npm run transpile && tap "test/**/*.test.*js" && tap --ts test/*.test.*ts',
        "test:ci": "standard && npm run transpile && npm run test:ci:js && npm run test:ci:ts",
        "test:ci:js": 'tap --no-check-coverage --timeout=120 --coverage-report=lcovonly "test/**/*.test.*js"',
        "test:ci:ts": 'tap --ts --no-check-coverage --coverage-report=lcovonly "test/**/*.test.*ts"',
        "test:yarn": 'npm run transpile && tap "test/**/*.test.js" --no-check-coverage',
        transpile: "sh ./test/ts/transpile.sh",
        prepare: "husky install"
      },
      standard: {
        ignore: [
          "test/ts/**/*",
          "test/syntax-error.mjs"
        ]
      },
      repository: {
        type: "git",
        url: "git+https://github.com/mcollina/thread-stream.git"
      },
      keywords: [
        "worker",
        "thread",
        "threads",
        "stream"
      ],
      author: "Matteo Collina <hello@matteocollina.com>",
      license: "MIT",
      bugs: {
        url: "https://github.com/mcollina/thread-stream/issues"
      },
      homepage: "https://github.com/mcollina/thread-stream#readme"
    };
  }
});

// node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/wait.js
var require_wait = __commonJS({
  "node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/wait.js"(exports2, module2) {
    "use strict";
    var MAX_TIMEOUT = 1e3;
    function wait(state, index, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index);
      if (current === expected) {
        done(null, "ok");
        return;
      }
      let prior = current;
      const check = (backoff) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            prior = current;
            current = Atomics.load(state, index);
            if (current === prior) {
              check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
            } else {
              if (current === expected) done(null, "ok");
              else done(null, "not-equal");
            }
          }, backoff);
        }
      };
      check(1);
    }
    function waitDiff(state, index, expected, timeout, done) {
      const max = Date.now() + timeout;
      let current = Atomics.load(state, index);
      if (current !== expected) {
        done(null, "ok");
        return;
      }
      const check = (backoff) => {
        if (Date.now() > max) {
          done(null, "timed-out");
        } else {
          setTimeout(() => {
            current = Atomics.load(state, index);
            if (current !== expected) {
              done(null, "ok");
            } else {
              check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
            }
          }, backoff);
        }
      };
      check(1);
    }
    module2.exports = { wait, waitDiff };
  }
});

// node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/indexes.js
var require_indexes = __commonJS({
  "node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/indexes.js"(exports2, module2) {
    "use strict";
    var WRITE_INDEX = 4;
    var READ_INDEX = 8;
    module2.exports = {
      WRITE_INDEX,
      READ_INDEX
    };
  }
});

// node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/index.js
var require_thread_stream = __commonJS({
  "node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/index.js"(exports2, module2) {
    "use strict";
    var { version } = require_package();
    var { EventEmitter } = require("events");
    var { Worker } = require("worker_threads");
    var { join } = require("path");
    var { pathToFileURL } = require("url");
    var { wait } = require_wait();
    var {
      WRITE_INDEX,
      READ_INDEX
    } = require_indexes();
    var buffer = require("buffer");
    var assert = require("assert");
    var kImpl = /* @__PURE__ */ Symbol("kImpl");
    var MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
    var FakeWeakRef = class {
      constructor(value) {
        this._value = value;
      }
      deref() {
        return this._value;
      }
    };
    var FakeFinalizationRegistry = class {
      register() {
      }
      unregister() {
      }
    };
    var FinalizationRegistry2 = process.env.NODE_V8_COVERAGE ? FakeFinalizationRegistry : global.FinalizationRegistry || FakeFinalizationRegistry;
    var WeakRef2 = process.env.NODE_V8_COVERAGE ? FakeWeakRef : global.WeakRef || FakeWeakRef;
    var registry = new FinalizationRegistry2((worker) => {
      if (worker.exited) {
        return;
      }
      worker.terminate();
    });
    function createWorker(stream, opts) {
      const { filename, workerData } = opts;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      const toExecute = bundlerOverrides["thread-stream-worker"] || join(__dirname, "lib", "worker.js");
      const worker = new Worker(toExecute, {
        ...opts.workerOpts,
        trackUnmanagedFds: false,
        workerData: {
          filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
          dataBuf: stream[kImpl].dataBuf,
          stateBuf: stream[kImpl].stateBuf,
          workerData: {
            $context: {
              threadStreamVersion: version
            },
            ...workerData
          }
        }
      });
      worker.stream = new FakeWeakRef(stream);
      worker.on("message", onWorkerMessage);
      worker.on("exit", onWorkerExit);
      registry.register(stream, worker);
      return worker;
    }
    function drain(stream) {
      assert(!stream[kImpl].sync);
      if (stream[kImpl].needDrain) {
        stream[kImpl].needDrain = false;
        stream.emit("drain");
      }
    }
    function nextFlush(stream) {
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let leftover = stream[kImpl].data.length - writeIndex;
      if (leftover > 0) {
        if (stream[kImpl].buf.length === 0) {
          stream[kImpl].flushing = false;
          if (stream[kImpl].ending) {
            end(stream);
          } else if (stream[kImpl].needDrain) {
            process.nextTick(drain, stream);
          }
          return;
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, nextFlush.bind(null, stream));
        } else {
          stream.flush(() => {
            if (stream.destroyed) {
              return;
            }
            Atomics.store(stream[kImpl].state, READ_INDEX, 0);
            Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
            while (toWriteBytes > stream[kImpl].data.length) {
              leftover = leftover / 2;
              toWrite = stream[kImpl].buf.slice(0, leftover);
              toWriteBytes = Buffer.byteLength(toWrite);
            }
            stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
            write(stream, toWrite, nextFlush.bind(null, stream));
          });
        }
      } else if (leftover === 0) {
        if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
          return;
        }
        stream.flush(() => {
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          nextFlush(stream);
        });
      } else {
        destroy(stream, new Error("overwritten"));
      }
    }
    function onWorkerMessage(msg) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        this.exited = true;
        this.terminate();
        return;
      }
      switch (msg.code) {
        case "READY":
          this.stream = new WeakRef2(stream);
          stream.flush(() => {
            stream[kImpl].ready = true;
            stream.emit("ready");
          });
          break;
        case "ERROR":
          destroy(stream, msg.err);
          break;
        case "EVENT":
          if (Array.isArray(msg.args)) {
            stream.emit(msg.name, ...msg.args);
          } else {
            stream.emit(msg.name, msg.args);
          }
          break;
        case "WARNING":
          process.emitWarning(msg.err);
          break;
        default:
          destroy(stream, new Error("this should not happen: " + msg.code));
      }
    }
    function onWorkerExit(code) {
      const stream = this.stream.deref();
      if (stream === void 0) {
        return;
      }
      registry.unregister(stream);
      stream.worker.exited = true;
      stream.worker.off("exit", onWorkerExit);
      destroy(stream, code !== 0 ? new Error("the worker thread exited") : null);
    }
    var ThreadStream = class extends EventEmitter {
      constructor(opts = {}) {
        super();
        if (opts.bufferSize < 4) {
          throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
        }
        this[kImpl] = {};
        this[kImpl].stateBuf = new SharedArrayBuffer(128);
        this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
        this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
        this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
        this[kImpl].sync = opts.sync || false;
        this[kImpl].ending = false;
        this[kImpl].ended = false;
        this[kImpl].needDrain = false;
        this[kImpl].destroyed = false;
        this[kImpl].flushing = false;
        this[kImpl].ready = false;
        this[kImpl].finished = false;
        this[kImpl].errored = null;
        this[kImpl].closed = false;
        this[kImpl].buf = "";
        this.worker = createWorker(this, opts);
        this.on("message", (message, transferList) => {
          this.worker.postMessage(message, transferList);
        });
      }
      write(data) {
        if (this[kImpl].destroyed) {
          error(this, new Error("the worker has exited"));
          return false;
        }
        if (this[kImpl].ending) {
          error(this, new Error("the worker is ending"));
          return false;
        }
        if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
          try {
            writeSync(this);
            this[kImpl].flushing = true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        this[kImpl].buf += data;
        if (this[kImpl].sync) {
          try {
            writeSync(this);
            return true;
          } catch (err) {
            destroy(this, err);
            return false;
          }
        }
        if (!this[kImpl].flushing) {
          this[kImpl].flushing = true;
          setImmediate(nextFlush, this);
        }
        this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
        return !this[kImpl].needDrain;
      }
      end() {
        if (this[kImpl].destroyed) {
          return;
        }
        this[kImpl].ending = true;
        end(this);
      }
      flush(cb) {
        if (this[kImpl].destroyed) {
          if (typeof cb === "function") {
            process.nextTick(cb, new Error("the worker has exited"));
          }
          return;
        }
        const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
        wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err, res) => {
          if (err) {
            destroy(this, err);
            process.nextTick(cb, err);
            return;
          }
          if (res === "not-equal") {
            this.flush(cb);
            return;
          }
          process.nextTick(cb);
        });
      }
      flushSync() {
        if (this[kImpl].destroyed) {
          return;
        }
        writeSync(this);
        flushSync(this);
      }
      unref() {
        this.worker.unref();
      }
      ref() {
        this.worker.ref();
      }
      get ready() {
        return this[kImpl].ready;
      }
      get destroyed() {
        return this[kImpl].destroyed;
      }
      get closed() {
        return this[kImpl].closed;
      }
      get writable() {
        return !this[kImpl].destroyed && !this[kImpl].ending;
      }
      get writableEnded() {
        return this[kImpl].ending;
      }
      get writableFinished() {
        return this[kImpl].finished;
      }
      get writableNeedDrain() {
        return this[kImpl].needDrain;
      }
      get writableObjectMode() {
        return false;
      }
      get writableErrored() {
        return this[kImpl].errored;
      }
    };
    function error(stream, err) {
      setImmediate(() => {
        stream.emit("error", err);
      });
    }
    function destroy(stream, err) {
      if (stream[kImpl].destroyed) {
        return;
      }
      stream[kImpl].destroyed = true;
      if (err) {
        stream[kImpl].errored = err;
        error(stream, err);
      }
      if (!stream.worker.exited) {
        stream.worker.terminate().catch(() => {
        }).then(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      } else {
        setImmediate(() => {
          stream[kImpl].closed = true;
          stream.emit("close");
        });
      }
    }
    function write(stream, data, cb) {
      const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      const length = Buffer.byteLength(data);
      stream[kImpl].data.write(data, current);
      Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length);
      Atomics.notify(stream[kImpl].state, WRITE_INDEX);
      cb();
      return true;
    }
    function end(stream) {
      if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
        return;
      }
      stream[kImpl].ended = true;
      try {
        stream.flushSync();
        let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
        Atomics.notify(stream[kImpl].state, WRITE_INDEX);
        let spins = 0;
        while (readIndex !== -1) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
          readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
          if (readIndex === -2) {
            destroy(stream, new Error("end() failed"));
            return;
          }
          if (++spins === 10) {
            destroy(stream, new Error("end() took too long (10s)"));
            return;
          }
        }
        process.nextTick(() => {
          stream[kImpl].finished = true;
          stream.emit("finish");
        });
      } catch (err) {
        destroy(stream, err);
      }
    }
    function writeSync(stream) {
      const cb = () => {
        if (stream[kImpl].ending) {
          end(stream);
        } else if (stream[kImpl].needDrain) {
          process.nextTick(drain, stream);
        }
      };
      stream[kImpl].flushing = false;
      while (stream[kImpl].buf.length !== 0) {
        const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
        let leftover = stream[kImpl].data.length - writeIndex;
        if (leftover === 0) {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          continue;
        } else if (leftover < 0) {
          throw new Error("overwritten");
        }
        let toWrite = stream[kImpl].buf.slice(0, leftover);
        let toWriteBytes = Buffer.byteLength(toWrite);
        if (toWriteBytes <= leftover) {
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        } else {
          flushSync(stream);
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          while (toWriteBytes > stream[kImpl].buf.length) {
            leftover = leftover / 2;
            toWrite = stream[kImpl].buf.slice(0, leftover);
            toWriteBytes = Buffer.byteLength(toWrite);
          }
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write(stream, toWrite, cb);
        }
      }
    }
    function flushSync(stream) {
      if (stream[kImpl].flushing) {
        throw new Error("unable to flush while flushing");
      }
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let spins = 0;
      while (true) {
        const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        if (readIndex === -2) {
          throw Error("_flushSync failed");
        }
        if (readIndex !== writeIndex) {
          Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
        } else {
          break;
        }
        if (++spins === 10) {
          throw new Error("_flushSync took too long (10s)");
        }
      }
    }
    module2.exports = ThreadStream;
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/transport.js
var require_transport = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/transport.js"(exports2, module2) {
    "use strict";
    var { createRequire } = require("module");
    var getCallers = require_caller();
    var { join, isAbsolute, sep } = require("node:path");
    var sleep = require_atomic_sleep();
    var onExit = require_on_exit_leak_free();
    var ThreadStream = require_thread_stream();
    function setupOnExit(stream) {
      onExit.register(stream, autoEnd);
      onExit.registerBeforeExit(stream, flush);
      stream.on("close", function() {
        onExit.unregister(stream);
      });
    }
    function buildStream(filename, workerData, workerOpts, sync) {
      const stream = new ThreadStream({
        filename,
        workerData,
        workerOpts,
        sync
      });
      stream.on("ready", onReady);
      stream.on("close", function() {
        process.removeListener("exit", onExit2);
      });
      process.on("exit", onExit2);
      function onReady() {
        process.removeListener("exit", onExit2);
        stream.unref();
        if (workerOpts.autoEnd !== false) {
          setupOnExit(stream);
        }
      }
      function onExit2() {
        if (stream.closed) {
          return;
        }
        stream.flushSync();
        sleep(100);
        stream.end();
      }
      return stream;
    }
    function autoEnd(stream) {
      stream.ref();
      stream.flushSync();
      stream.end();
      stream.once("close", function() {
        stream.unref();
      });
    }
    function flush(stream) {
      stream.flushSync();
    }
    function transport(fullOptions) {
      const { pipeline, targets, levels, dedupe, worker = {}, caller = getCallers(), sync = false } = fullOptions;
      const options = {
        ...fullOptions.options
      };
      const callers = typeof caller === "string" ? [caller] : caller;
      const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
      let target = fullOptions.target;
      if (target && targets) {
        throw new Error("only one of target or targets can be specified");
      }
      if (targets) {
        target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
        options.targets = targets.filter((dest) => dest.target).map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        });
        options.pipelines = targets.filter((dest) => dest.pipeline).map((dest) => {
          return dest.pipeline.map((t) => {
            return {
              ...t,
              level: dest.level,
              // duplicate the pipeline `level` property defined in the upper level
              target: fixTarget(t.target)
            };
          });
        });
      } else if (pipeline) {
        target = bundlerOverrides["pino-worker"] || join(__dirname, "worker.js");
        options.pipelines = [pipeline.map((dest) => {
          return {
            ...dest,
            target: fixTarget(dest.target)
          };
        })];
      }
      if (levels) {
        options.levels = levels;
      }
      if (dedupe) {
        options.dedupe = dedupe;
      }
      options.pinoWillSendConfig = true;
      return buildStream(fixTarget(target), options, worker, sync);
      function fixTarget(origin) {
        origin = bundlerOverrides[origin] || origin;
        if (isAbsolute(origin) || origin.indexOf("file://") === 0) {
          return origin;
        }
        if (origin === "pino/file") {
          return join(__dirname, "..", "file.js");
        }
        let fixTarget2;
        for (const filePath of callers) {
          try {
            const context = filePath === "node:repl" ? process.cwd() + sep : filePath;
            fixTarget2 = createRequire(context).resolve(origin);
            break;
          } catch (err) {
            continue;
          }
        }
        if (!fixTarget2) {
          throw new Error(`unable to determine transport target for "${origin}"`);
        }
        return fixTarget2;
      }
    }
    module2.exports = transport;
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/tools.js
var require_tools = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/tools.js"(exports2, module2) {
    "use strict";
    var diagChan = require("node:diagnostics_channel");
    var format = require_quick_format_unescaped();
    var { mapHttpRequest, mapHttpResponse } = require_pino_std_serializers();
    var SonicBoom = require_sonic_boom();
    var onExit = require_on_exit_leak_free();
    var {
      lsCacheSym,
      chindingsSym,
      writeSym,
      serializersSym,
      formatOptsSym,
      endSym,
      stringifiersSym,
      stringifySym,
      stringifySafeSym,
      wildcardFirstSym,
      nestedKeySym,
      formattersSym,
      messageKeySym,
      errorKeySym,
      nestedKeyStrSym,
      msgPrefixSym
    } = require_symbols();
    var { isMainThread } = require("worker_threads");
    var transport = require_transport();
    var asJsonChan;
    if (typeof diagChan.tracingChannel === "function") {
      asJsonChan = diagChan.tracingChannel("pino_asJson");
    } else {
      asJsonChan = {
        hasSubscribers: false,
        traceSync(fn, store, thisArg, ...args) {
          return fn.call(thisArg, ...args);
        }
      };
    }
    function noop() {
    }
    function genLog(level, hook) {
      if (!hook) return LOG;
      return function hookWrappedLog(...args) {
        hook.call(this, args, LOG, level);
      };
      function LOG(o, ...n) {
        if (typeof o === "object") {
          let msg = o;
          if (o !== null) {
            if (o.method && o.headers && o.socket) {
              o = mapHttpRequest(o);
            } else if (typeof o.setHeader === "function") {
              o = mapHttpResponse(o);
            }
          }
          let formatParams;
          if (msg === null && n.length === 0) {
            formatParams = [null];
          } else {
            msg = n.shift();
            formatParams = n;
          }
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](o, format(msg, formatParams, this[formatOptsSym]), level);
        } else {
          let msg = o === void 0 ? n.shift() : o;
          if (typeof this[msgPrefixSym] === "string" && msg !== void 0 && msg !== null) {
            msg = this[msgPrefixSym] + msg;
          }
          this[writeSym](null, format(msg, n, this[formatOptsSym]), level);
        }
      }
    }
    function asString(str) {
      let result = "";
      let last = 0;
      let found = false;
      let point = 255;
      const l = str.length;
      if (l > 100) {
        return JSON.stringify(str);
      }
      for (var i = 0; i < l && point >= 32; i++) {
        point = str.charCodeAt(i);
        if (point === 34 || point === 92) {
          result += str.slice(last, i) + "\\";
          last = i;
          found = true;
        }
      }
      if (!found) {
        result = str;
      } else {
        result += str.slice(last);
      }
      return point < 32 ? JSON.stringify(str) : '"' + result + '"';
    }
    function asJson(obj, msg, num, time) {
      if (asJsonChan.hasSubscribers === false) {
        return _asJson.call(this, obj, msg, num, time);
      }
      const store = { instance: this, arguments };
      return asJsonChan.traceSync(_asJson, store, this, obj, msg, num, time);
    }
    function _asJson(obj, msg, num, time) {
      const stringify2 = this[stringifySym];
      const stringifySafe = this[stringifySafeSym];
      const stringifiers = this[stringifiersSym];
      const end = this[endSym];
      const chindings = this[chindingsSym];
      const serializers = this[serializersSym];
      const formatters = this[formattersSym];
      const messageKey = this[messageKeySym];
      const errorKey = this[errorKeySym];
      let data = this[lsCacheSym][num] + time;
      data = data + chindings;
      let value;
      if (formatters.log) {
        obj = formatters.log(obj);
      }
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      let propStr = "";
      for (const key in obj) {
        value = obj[key];
        if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
          if (serializers[key]) {
            value = serializers[key](value);
          } else if (key === errorKey && serializers.err) {
            value = serializers.err(value);
          }
          const stringifier = stringifiers[key] || wildcardStringifier;
          switch (typeof value) {
            case "undefined":
            case "function":
              continue;
            case "number":
              if (Number.isFinite(value) === false) {
                value = null;
              }
            // this case explicitly falls through to the next one
            case "boolean":
              if (stringifier) value = stringifier(value);
              break;
            case "string":
              value = (stringifier || asString)(value);
              break;
            default:
              value = (stringifier || stringify2)(value, stringifySafe);
          }
          if (value === void 0) continue;
          const strKey = asString(key);
          propStr += "," + strKey + ":" + value;
        }
      }
      let msgStr = "";
      if (msg !== void 0) {
        value = serializers[messageKey] ? serializers[messageKey](msg) : msg;
        const stringifier = stringifiers[messageKey] || wildcardStringifier;
        switch (typeof value) {
          case "function":
            break;
          case "number":
            if (Number.isFinite(value) === false) {
              value = null;
            }
          // this case explicitly falls through to the next one
          case "boolean":
            if (stringifier) value = stringifier(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          case "string":
            value = (stringifier || asString)(value);
            msgStr = ',"' + messageKey + '":' + value;
            break;
          default:
            value = (stringifier || stringify2)(value, stringifySafe);
            msgStr = ',"' + messageKey + '":' + value;
        }
      }
      if (this[nestedKeySym] && propStr) {
        return data + this[nestedKeyStrSym] + propStr.slice(1) + "}" + msgStr + end;
      } else {
        return data + propStr + msgStr + end;
      }
    }
    function asChindings(instance, bindings) {
      let value;
      let data = instance[chindingsSym];
      const stringify2 = instance[stringifySym];
      const stringifySafe = instance[stringifySafeSym];
      const stringifiers = instance[stringifiersSym];
      const wildcardStringifier = stringifiers[wildcardFirstSym];
      const serializers = instance[serializersSym];
      const formatter = instance[formattersSym].bindings;
      bindings = formatter(bindings);
      for (const key in bindings) {
        value = bindings[key];
        const valid = (key.length < 5 || key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels") && bindings.hasOwnProperty(key) && value !== void 0;
        if (valid === true) {
          value = serializers[key] ? serializers[key](value) : value;
          value = (stringifiers[key] || wildcardStringifier || stringify2)(value, stringifySafe);
          if (value === void 0) continue;
          data += ',"' + key + '":' + value;
        }
      }
      return data;
    }
    function hasBeenTampered(stream) {
      return stream.write !== stream.constructor.prototype.write;
    }
    function buildSafeSonicBoom(opts) {
      const stream = new SonicBoom(opts);
      stream.on("error", filterBrokenPipe);
      if (!opts.sync && isMainThread) {
        onExit.register(stream, autoEnd);
        stream.on("close", function() {
          onExit.unregister(stream);
        });
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
        stream.emit("error", err);
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
    function createArgsNormalizer(defaultOptions) {
      return function normalizeArgs(instance, caller, opts = {}, stream) {
        if (typeof opts === "string") {
          stream = buildSafeSonicBoom({ dest: opts });
          opts = {};
        } else if (typeof stream === "string") {
          if (opts && opts.transport) {
            throw Error("only one of option.transport or stream can be specified");
          }
          stream = buildSafeSonicBoom({ dest: stream });
        } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
          stream = opts;
          opts = {};
        } else if (opts.transport) {
          if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
            throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
          }
          if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") {
            throw Error("option.transport.targets do not allow custom level formatters");
          }
          let customLevels;
          if (opts.customLevels) {
            customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
          }
          stream = transport({ caller, ...opts.transport, levels: customLevels });
        }
        opts = Object.assign({}, defaultOptions, opts);
        opts.serializers = Object.assign({}, defaultOptions.serializers, opts.serializers);
        opts.formatters = Object.assign({}, defaultOptions.formatters, opts.formatters);
        if (opts.prettyPrint) {
          throw new Error("prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)");
        }
        const { enabled, onChild } = opts;
        if (enabled === false) opts.level = "silent";
        if (!onChild) opts.onChild = noop;
        if (!stream) {
          if (!hasBeenTampered(process.stdout)) {
            stream = buildSafeSonicBoom({ fd: process.stdout.fd || 1 });
          } else {
            stream = process.stdout;
          }
        }
        return { opts, stream };
      };
    }
    function stringify(obj, stringifySafeFn) {
      try {
        return JSON.stringify(obj);
      } catch (_) {
        try {
          const stringify2 = stringifySafeFn || this[stringifySafeSym];
          return stringify2(obj);
        } catch (_2) {
          return '"[unable to serialize, circular reference is too complex to analyze]"';
        }
      }
    }
    function buildFormatters(level, bindings, log) {
      return {
        level,
        bindings,
        log
      };
    }
    function normalizeDestFileDescriptor(destination) {
      const fd = Number(destination);
      if (typeof destination === "string" && Number.isFinite(fd)) {
        return fd;
      }
      if (destination === void 0) {
        return 1;
      }
      return destination;
    }
    module2.exports = {
      noop,
      buildSafeSonicBoom,
      asChindings,
      asJson,
      genLog,
      createArgsNormalizer,
      stringify,
      buildFormatters,
      normalizeDestFileDescriptor
    };
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/constants.js"(exports2, module2) {
    var DEFAULT_LEVELS = {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60
    };
    var SORTING_ORDER = {
      ASC: "ASC",
      DESC: "DESC"
    };
    module2.exports = {
      DEFAULT_LEVELS,
      SORTING_ORDER
    };
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/levels.js
var require_levels = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/levels.js"(exports2, module2) {
    "use strict";
    var {
      lsCacheSym,
      levelValSym,
      useOnlyCustomLevelsSym,
      streamSym,
      formattersSym,
      hooksSym,
      levelCompSym
    } = require_symbols();
    var { noop, genLog } = require_tools();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var levelMethods = {
      fatal: (hook) => {
        const logFatal = genLog(DEFAULT_LEVELS.fatal, hook);
        return function(...args) {
          const stream = this[streamSym];
          logFatal.call(this, ...args);
          if (typeof stream.flushSync === "function") {
            try {
              stream.flushSync();
            } catch (e) {
            }
          }
        };
      },
      error: (hook) => genLog(DEFAULT_LEVELS.error, hook),
      warn: (hook) => genLog(DEFAULT_LEVELS.warn, hook),
      info: (hook) => genLog(DEFAULT_LEVELS.info, hook),
      debug: (hook) => genLog(DEFAULT_LEVELS.debug, hook),
      trace: (hook) => genLog(DEFAULT_LEVELS.trace, hook)
    };
    var nums = Object.keys(DEFAULT_LEVELS).reduce((o, k) => {
      o[DEFAULT_LEVELS[k]] = k;
      return o;
    }, {});
    var initialLsCache = Object.keys(nums).reduce((o, k) => {
      o[k] = '{"level":' + Number(k);
      return o;
    }, {});
    function genLsCache(instance) {
      const formatter = instance[formattersSym].level;
      const { labels } = instance.levels;
      const cache = {};
      for (const label in labels) {
        const level = formatter(labels[label], Number(label));
        cache[label] = JSON.stringify(level).slice(0, -1);
      }
      instance[lsCacheSym] = cache;
      return instance;
    }
    function isStandardLevel(level, useOnlyCustomLevels) {
      if (useOnlyCustomLevels) {
        return false;
      }
      switch (level) {
        case "fatal":
        case "error":
        case "warn":
        case "info":
        case "debug":
        case "trace":
          return true;
        default:
          return false;
      }
    }
    function setLevel(level) {
      const { labels, values } = this.levels;
      if (typeof level === "number") {
        if (labels[level] === void 0) throw Error("unknown level value" + level);
        level = labels[level];
      }
      if (values[level] === void 0) throw Error("unknown level " + level);
      const preLevelVal = this[levelValSym];
      const levelVal = this[levelValSym] = values[level];
      const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym];
      const levelComparison = this[levelCompSym];
      const hook = this[hooksSym].logMethod;
      for (const key in values) {
        if (levelComparison(values[key], levelVal) === false) {
          this[key] = noop;
          continue;
        }
        this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
      }
      this.emit(
        "level-change",
        level,
        levelVal,
        labels[preLevelVal],
        preLevelVal,
        this
      );
    }
    function getLevel(level) {
      const { levels, levelVal } = this;
      return levels && levels.labels ? levels.labels[levelVal] : "";
    }
    function isLevelEnabled(logLevel) {
      const { values } = this.levels;
      const logLevelVal = values[logLevel];
      return logLevelVal !== void 0 && this[levelCompSym](logLevelVal, this[levelValSym]);
    }
    function compareLevel(direction, current, expected) {
      if (direction === SORTING_ORDER.DESC) {
        return current <= expected;
      }
      return current >= expected;
    }
    function genLevelComparison(levelComparison) {
      if (typeof levelComparison === "string") {
        return compareLevel.bind(null, levelComparison);
      }
      return levelComparison;
    }
    function mappings(customLevels = null, useOnlyCustomLevels = false) {
      const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
        o[customLevels[k]] = k;
        return o;
      }, {}) : null;
      const labels = Object.assign(
        Object.create(Object.prototype, { Infinity: { value: "silent" } }),
        useOnlyCustomLevels ? null : nums,
        customNums
      );
      const values = Object.assign(
        Object.create(Object.prototype, { silent: { value: Infinity } }),
        useOnlyCustomLevels ? null : DEFAULT_LEVELS,
        customLevels
      );
      return { labels, values };
    }
    function assertDefaultLevelFound(defaultLevel, customLevels, useOnlyCustomLevels) {
      if (typeof defaultLevel === "number") {
        const values = [].concat(
          Object.keys(customLevels || {}).map((key) => customLevels[key]),
          useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level),
          Infinity
        );
        if (!values.includes(defaultLevel)) {
          throw Error(`default level:${defaultLevel} must be included in custom levels`);
        }
        return;
      }
      const labels = Object.assign(
        Object.create(Object.prototype, { silent: { value: Infinity } }),
        useOnlyCustomLevels ? null : DEFAULT_LEVELS,
        customLevels
      );
      if (!(defaultLevel in labels)) {
        throw Error(`default level:${defaultLevel} must be included in custom levels`);
      }
    }
    function assertNoLevelCollisions(levels, customLevels) {
      const { labels, values } = levels;
      for (const k in customLevels) {
        if (k in values) {
          throw Error("levels cannot be overridden");
        }
        if (customLevels[k] in labels) {
          throw Error("pre-existing level values cannot be used for new levels");
        }
      }
    }
    function assertLevelComparison(levelComparison) {
      if (typeof levelComparison === "function") {
        return;
      }
      if (typeof levelComparison === "string" && Object.values(SORTING_ORDER).includes(levelComparison)) {
        return;
      }
      throw new Error('Levels comparison should be one of "ASC", "DESC" or "function" type');
    }
    module2.exports = {
      initialLsCache,
      genLsCache,
      levelMethods,
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      assertNoLevelCollisions,
      assertDefaultLevelFound,
      genLevelComparison,
      assertLevelComparison
    };
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/meta.js
var require_meta = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/meta.js"(exports2, module2) {
    "use strict";
    module2.exports = { version: "9.14.0" };
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/proto.js
var require_proto = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/proto.js"(exports2, module2) {
    "use strict";
    var { EventEmitter } = require("node:events");
    var {
      lsCacheSym,
      levelValSym,
      setLevelSym,
      getLevelSym,
      chindingsSym,
      parsedChindingsSym,
      mixinSym,
      asJsonSym,
      writeSym,
      mixinMergeStrategySym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      serializersSym,
      formattersSym,
      errorKeySym,
      messageKeySym,
      useOnlyCustomLevelsSym,
      needsMetadataGsym,
      redactFmtSym,
      stringifySym,
      formatOptsSym,
      stringifiersSym,
      msgPrefixSym,
      hooksSym
    } = require_symbols();
    var {
      getLevel,
      setLevel,
      isLevelEnabled,
      mappings,
      initialLsCache,
      genLsCache,
      assertNoLevelCollisions
    } = require_levels();
    var {
      asChindings,
      asJson,
      buildFormatters,
      stringify,
      noop
    } = require_tools();
    var {
      version
    } = require_meta();
    var redaction = require_redaction();
    var constructor = class Pino {
    };
    var prototype = {
      constructor,
      child,
      bindings,
      setBindings,
      flush,
      isLevelEnabled,
      version,
      get level() {
        return this[getLevelSym]();
      },
      set level(lvl) {
        this[setLevelSym](lvl);
      },
      get levelVal() {
        return this[levelValSym];
      },
      set levelVal(n) {
        throw Error("levelVal is read-only");
      },
      get msgPrefix() {
        return this[msgPrefixSym];
      },
      get [Symbol.toStringTag]() {
        return "Pino";
      },
      [lsCacheSym]: initialLsCache,
      [writeSym]: write,
      [asJsonSym]: asJson,
      [getLevelSym]: getLevel,
      [setLevelSym]: setLevel
    };
    Object.setPrototypeOf(prototype, EventEmitter.prototype);
    module2.exports = function() {
      return Object.create(prototype);
    };
    var resetChildingsFormatter = (bindings2) => bindings2;
    function child(bindings2, options) {
      if (!bindings2) {
        throw Error("missing bindings for child Pino");
      }
      const serializers = this[serializersSym];
      const formatters = this[formattersSym];
      const instance = Object.create(this);
      if (options == null) {
        if (instance[formattersSym].bindings !== resetChildingsFormatter) {
          instance[formattersSym] = buildFormatters(
            formatters.level,
            resetChildingsFormatter,
            formatters.log
          );
        }
        instance[chindingsSym] = asChindings(instance, bindings2);
        instance[setLevelSym](this.level);
        if (this.onChild !== noop) {
          this.onChild(instance);
        }
        return instance;
      }
      if (options.hasOwnProperty("serializers") === true) {
        instance[serializersSym] = /* @__PURE__ */ Object.create(null);
        for (const k in serializers) {
          instance[serializersSym][k] = serializers[k];
        }
        const parentSymbols = Object.getOwnPropertySymbols(serializers);
        for (var i = 0; i < parentSymbols.length; i++) {
          const ks = parentSymbols[i];
          instance[serializersSym][ks] = serializers[ks];
        }
        for (const bk in options.serializers) {
          instance[serializersSym][bk] = options.serializers[bk];
        }
        const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
        for (var bi = 0; bi < bindingsSymbols.length; bi++) {
          const bks = bindingsSymbols[bi];
          instance[serializersSym][bks] = options.serializers[bks];
        }
      } else instance[serializersSym] = serializers;
      if (options.hasOwnProperty("formatters")) {
        const { level, bindings: chindings, log } = options.formatters;
        instance[formattersSym] = buildFormatters(
          level || formatters.level,
          chindings || resetChildingsFormatter,
          log || formatters.log
        );
      } else {
        instance[formattersSym] = buildFormatters(
          formatters.level,
          resetChildingsFormatter,
          formatters.log
        );
      }
      if (options.hasOwnProperty("customLevels") === true) {
        assertNoLevelCollisions(this.levels, options.customLevels);
        instance.levels = mappings(options.customLevels, instance[useOnlyCustomLevelsSym]);
        genLsCache(instance);
      }
      if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
        instance.redact = options.redact;
        const stringifiers = redaction(instance.redact, stringify);
        const formatOpts = { stringify: stringifiers[redactFmtSym] };
        instance[stringifySym] = stringify;
        instance[stringifiersSym] = stringifiers;
        instance[formatOptsSym] = formatOpts;
      }
      if (typeof options.msgPrefix === "string") {
        instance[msgPrefixSym] = (this[msgPrefixSym] || "") + options.msgPrefix;
      }
      instance[chindingsSym] = asChindings(instance, bindings2);
      const childLevel = options.level || this.level;
      instance[setLevelSym](childLevel);
      this.onChild(instance);
      return instance;
    }
    function bindings() {
      const chindings = this[chindingsSym];
      const chindingsJson = `{${chindings.substr(1)}}`;
      const bindingsFromJson = JSON.parse(chindingsJson);
      delete bindingsFromJson.pid;
      delete bindingsFromJson.hostname;
      return bindingsFromJson;
    }
    function setBindings(newBindings) {
      const chindings = asChindings(this, newBindings);
      this[chindingsSym] = chindings;
      delete this[parsedChindingsSym];
    }
    function defaultMixinMergeStrategy(mergeObject, mixinObject) {
      return Object.assign(mixinObject, mergeObject);
    }
    function write(_obj, msg, num) {
      const t = this[timeSym]();
      const mixin = this[mixinSym];
      const errorKey = this[errorKeySym];
      const messageKey = this[messageKeySym];
      const mixinMergeStrategy = this[mixinMergeStrategySym] || defaultMixinMergeStrategy;
      let obj;
      const streamWriteHook = this[hooksSym].streamWrite;
      if (_obj === void 0 || _obj === null) {
        obj = {};
      } else if (_obj instanceof Error) {
        obj = { [errorKey]: _obj };
        if (msg === void 0) {
          msg = _obj.message;
        }
      } else {
        obj = _obj;
        if (msg === void 0 && _obj[messageKey] === void 0 && _obj[errorKey]) {
          msg = _obj[errorKey].message;
        }
      }
      if (mixin) {
        obj = mixinMergeStrategy(obj, mixin(obj, num, this));
      }
      const s = this[asJsonSym](obj, msg, num, t);
      const stream = this[streamSym];
      if (stream[needsMetadataGsym] === true) {
        stream.lastLevel = num;
        stream.lastObj = obj;
        stream.lastMsg = msg;
        stream.lastTime = t.slice(this[timeSliceIndexSym]);
        stream.lastLogger = this;
      }
      stream.write(streamWriteHook ? streamWriteHook(s) : s);
    }
    function flush(cb) {
      if (cb != null && typeof cb !== "function") {
        throw Error("callback must be a function");
      }
      const stream = this[streamSym];
      if (typeof stream.flush === "function") {
        stream.flush(cb || noop);
      } else if (cb) cb();
    }
  }
});

// node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js
var require_safe_stable_stringify = __commonJS({
  "node_modules/.pnpm/safe-stable-stringify@2.5.0/node_modules/safe-stable-stringify/index.js"(exports2, module2) {
    "use strict";
    var { hasOwnProperty } = Object.prototype;
    var stringify = configure();
    stringify.configure = configure;
    stringify.stringify = stringify;
    stringify.default = stringify;
    exports2.stringify = stringify;
    exports2.configure = configure;
    module2.exports = stringify;
    var strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
    function strEscape(str) {
      if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) {
        return `"${str}"`;
      }
      return JSON.stringify(str);
    }
    function sort(array, comparator) {
      if (array.length > 200 || comparator) {
        return array.sort(comparator);
      }
      for (let i = 1; i < array.length; i++) {
        const currentValue = array[i];
        let position = i;
        while (position !== 0 && array[position - 1] > currentValue) {
          array[position] = array[position - 1];
          position--;
        }
        array[position] = currentValue;
      }
      return array;
    }
    var typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(
        Object.getPrototypeOf(
          new Int8Array()
        )
      ),
      Symbol.toStringTag
    ).get;
    function isTypedArrayWithEntries(value) {
      return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
    }
    function stringifyTypedArray(array, separator, maximumBreadth) {
      if (array.length < maximumBreadth) {
        maximumBreadth = array.length;
      }
      const whitespace = separator === "," ? "" : " ";
      let res = `"0":${whitespace}${array[0]}`;
      for (let i = 1; i < maximumBreadth; i++) {
        res += `${separator}"${i}":${whitespace}${array[i]}`;
      }
      return res;
    }
    function getCircularValueOption(options) {
      if (hasOwnProperty.call(options, "circularValue")) {
        const circularValue = options.circularValue;
        if (typeof circularValue === "string") {
          return `"${circularValue}"`;
        }
        if (circularValue == null) {
          return circularValue;
        }
        if (circularValue === Error || circularValue === TypeError) {
          return {
            toString() {
              throw new TypeError("Converting circular structure to JSON");
            }
          };
        }
        throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
      }
      return '"[Circular]"';
    }
    function getDeterministicOption(options) {
      let value;
      if (hasOwnProperty.call(options, "deterministic")) {
        value = options.deterministic;
        if (typeof value !== "boolean" && typeof value !== "function") {
          throw new TypeError('The "deterministic" argument must be of type boolean or comparator function');
        }
      }
      return value === void 0 ? true : value;
    }
    function getBooleanOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "boolean") {
          throw new TypeError(`The "${key}" argument must be of type boolean`);
        }
      }
      return value === void 0 ? true : value;
    }
    function getPositiveIntegerOption(options, key) {
      let value;
      if (hasOwnProperty.call(options, key)) {
        value = options[key];
        if (typeof value !== "number") {
          throw new TypeError(`The "${key}" argument must be of type number`);
        }
        if (!Number.isInteger(value)) {
          throw new TypeError(`The "${key}" argument must be an integer`);
        }
        if (value < 1) {
          throw new RangeError(`The "${key}" argument must be >= 1`);
        }
      }
      return value === void 0 ? Infinity : value;
    }
    function getItemCount(number) {
      if (number === 1) {
        return "1 item";
      }
      return `${number} items`;
    }
    function getUniqueReplacerSet(replacerArray) {
      const replacerSet = /* @__PURE__ */ new Set();
      for (const value of replacerArray) {
        if (typeof value === "string" || typeof value === "number") {
          replacerSet.add(String(value));
        }
      }
      return replacerSet;
    }
    function getStrictOption(options) {
      if (hasOwnProperty.call(options, "strict")) {
        const value = options.strict;
        if (typeof value !== "boolean") {
          throw new TypeError('The "strict" argument must be of type boolean');
        }
        if (value) {
          return (value2) => {
            let message = `Object can not safely be stringified. Received type ${typeof value2}`;
            if (typeof value2 !== "function") message += ` (${value2.toString()})`;
            throw new Error(message);
          };
        }
      }
    }
    function configure(options) {
      options = { ...options };
      const fail = getStrictOption(options);
      if (fail) {
        if (options.bigint === void 0) {
          options.bigint = false;
        }
        if (!("circularValue" in options)) {
          options.circularValue = Error;
        }
      }
      const circularValue = getCircularValueOption(options);
      const bigint = getBooleanOption(options, "bigint");
      const deterministic = getDeterministicOption(options);
      const comparator = typeof deterministic === "function" ? deterministic : void 0;
      const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
      const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
      function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
        let value = parent[key];
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        value = replacer.call(parent, key, value);
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            let join = ",";
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join;
              }
              const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let whitespace = "";
            let separator = "";
            if (spacer !== "") {
              indentation += spacer;
              join = `,
${indentation}`;
              whitespace = " ";
            }
            const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (deterministic && !isTypedArrayWithEntries(value)) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyFnReplacer(key2, value, stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
              separator = join;
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
        if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
          value = value.toJSON(key);
        }
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            let res = "";
            let join = ",";
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              if (spacer !== "") {
                indentation += spacer;
                res += `
${indentation}`;
                join = `,
${indentation}`;
              }
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += join;
              }
              const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `${join}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              if (spacer !== "") {
                res += `
${originalIndentation}`;
              }
              stack.pop();
              return `[${res}]`;
            }
            stack.push(value);
            let whitespace = "";
            if (spacer !== "") {
              indentation += spacer;
              join = `,
${indentation}`;
              whitespace = " ";
            }
            let separator = "";
            for (const key2 of replacer) {
              const tmp = stringifyArrayReplacer(key2, value[key2], stack, replacer, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
                separator = join;
              }
            }
            if (spacer !== "" && separator.length > 1) {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifyIndent(key, value, stack, spacer, indentation) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifyIndent(key, value, stack, spacer, indentation);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            const originalIndentation = indentation;
            if (Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              indentation += spacer;
              let res2 = `
${indentation}`;
              const join2 = `,
${indentation}`;
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
                res2 += tmp2 !== void 0 ? tmp2 : "null";
                res2 += join2;
              }
              const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
              res2 += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res2 += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
              }
              res2 += `
${originalIndentation}`;
              stack.pop();
              return `[${res2}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            indentation += spacer;
            const join = `,
${indentation}`;
            let res = "";
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, join, maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = join;
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifyIndent(key2, value[key2], stack, spacer, indentation);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}: ${tmp}`;
                separator = join;
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
              separator = join;
            }
            if (separator !== "") {
              res = `
${indentation}${res}
${originalIndentation}`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringifySimple(key, value, stack) {
        switch (typeof value) {
          case "string":
            return strEscape(value);
          case "object": {
            if (value === null) {
              return "null";
            }
            if (typeof value.toJSON === "function") {
              value = value.toJSON(key);
              if (typeof value !== "object") {
                return stringifySimple(key, value, stack);
              }
              if (value === null) {
                return "null";
              }
            }
            if (stack.indexOf(value) !== -1) {
              return circularValue;
            }
            let res = "";
            const hasLength = value.length !== void 0;
            if (hasLength && Array.isArray(value)) {
              if (value.length === 0) {
                return "[]";
              }
              if (maximumDepth < stack.length + 1) {
                return '"[Array]"';
              }
              stack.push(value);
              const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
              let i = 0;
              for (; i < maximumValuesToStringify - 1; i++) {
                const tmp2 = stringifySimple(String(i), value[i], stack);
                res += tmp2 !== void 0 ? tmp2 : "null";
                res += ",";
              }
              const tmp = stringifySimple(String(i), value[i], stack);
              res += tmp !== void 0 ? tmp : "null";
              if (value.length - 1 > maximumBreadth) {
                const removedKeys = value.length - maximumBreadth - 1;
                res += `,"... ${getItemCount(removedKeys)} not stringified"`;
              }
              stack.pop();
              return `[${res}]`;
            }
            let keys = Object.keys(value);
            const keyLength = keys.length;
            if (keyLength === 0) {
              return "{}";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Object]"';
            }
            let separator = "";
            let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
            if (hasLength && isTypedArrayWithEntries(value)) {
              res += stringifyTypedArray(value, ",", maximumBreadth);
              keys = keys.slice(value.length);
              maximumPropertiesToStringify -= value.length;
              separator = ",";
            }
            if (deterministic) {
              keys = sort(keys, comparator);
            }
            stack.push(value);
            for (let i = 0; i < maximumPropertiesToStringify; i++) {
              const key2 = keys[i];
              const tmp = stringifySimple(key2, value[key2], stack);
              if (tmp !== void 0) {
                res += `${separator}${strEscape(key2)}:${tmp}`;
                separator = ",";
              }
            }
            if (keyLength > maximumBreadth) {
              const removedKeys = keyLength - maximumBreadth;
              res += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
            }
            stack.pop();
            return `{${res}}`;
          }
          case "number":
            return isFinite(value) ? String(value) : fail ? fail(value) : "null";
          case "boolean":
            return value === true ? "true" : "false";
          case "undefined":
            return void 0;
          case "bigint":
            if (bigint) {
              return String(value);
            }
          // fallthrough
          default:
            return fail ? fail(value) : void 0;
        }
      }
      function stringify2(value, replacer, space) {
        if (arguments.length > 1) {
          let spacer = "";
          if (typeof space === "number") {
            spacer = " ".repeat(Math.min(space, 10));
          } else if (typeof space === "string") {
            spacer = space.slice(0, 10);
          }
          if (replacer != null) {
            if (typeof replacer === "function") {
              return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
            }
            if (Array.isArray(replacer)) {
              return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
            }
          }
          if (spacer.length !== 0) {
            return stringifyIndent("", value, [], spacer, "");
          }
        }
        return stringifySimple("", value, []);
      }
      return stringify2;
    }
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/multistream.js
var require_multistream = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/lib/multistream.js"(exports2, module2) {
    "use strict";
    var metadata = /* @__PURE__ */ Symbol.for("pino.metadata");
    var { DEFAULT_LEVELS } = require_constants();
    var DEFAULT_INFO_LEVEL = DEFAULT_LEVELS.info;
    function multistream(streamsArray, opts) {
      streamsArray = streamsArray || [];
      opts = opts || { dedupe: false };
      const streamLevels = Object.create(DEFAULT_LEVELS);
      streamLevels.silent = Infinity;
      if (opts.levels && typeof opts.levels === "object") {
        Object.keys(opts.levels).forEach((i) => {
          streamLevels[i] = opts.levels[i];
        });
      }
      const res = {
        write,
        add,
        remove,
        emit,
        flushSync,
        end,
        minLevel: 0,
        lastId: 0,
        streams: [],
        clone,
        [metadata]: true,
        streamLevels
      };
      if (Array.isArray(streamsArray)) {
        streamsArray.forEach(add, res);
      } else {
        add.call(res, streamsArray);
      }
      streamsArray = null;
      return res;
      function write(data) {
        let dest;
        const level = this.lastLevel;
        const { streams } = this;
        let recordedLevel = 0;
        let stream;
        for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
          dest = streams[i];
          if (dest.level <= level) {
            if (recordedLevel !== 0 && recordedLevel !== dest.level) {
              break;
            }
            stream = dest.stream;
            if (stream[metadata]) {
              const { lastTime, lastMsg, lastObj, lastLogger } = this;
              stream.lastLevel = level;
              stream.lastTime = lastTime;
              stream.lastMsg = lastMsg;
              stream.lastObj = lastObj;
              stream.lastLogger = lastLogger;
            }
            stream.write(data);
            if (opts.dedupe) {
              recordedLevel = dest.level;
            }
          } else if (!opts.dedupe) {
            break;
          }
        }
      }
      function emit(...args) {
        for (const { stream } of this.streams) {
          if (typeof stream.emit === "function") {
            stream.emit(...args);
          }
        }
      }
      function flushSync() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
        }
      }
      function add(dest) {
        if (!dest) {
          return res;
        }
        const isStream = typeof dest.write === "function" || dest.stream;
        const stream_ = dest.write ? dest : dest.stream;
        if (!isStream) {
          throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
        }
        const { streams, streamLevels: streamLevels2 } = this;
        let level;
        if (typeof dest.levelVal === "number") {
          level = dest.levelVal;
        } else if (typeof dest.level === "string") {
          level = streamLevels2[dest.level];
        } else if (typeof dest.level === "number") {
          level = dest.level;
        } else {
          level = DEFAULT_INFO_LEVEL;
        }
        const dest_ = {
          stream: stream_,
          level,
          levelVal: void 0,
          id: ++res.lastId
        };
        streams.unshift(dest_);
        streams.sort(compareByLevel);
        this.minLevel = streams[0].level;
        return res;
      }
      function remove(id) {
        const { streams } = this;
        const index = streams.findIndex((s) => s.id === id);
        if (index >= 0) {
          streams.splice(index, 1);
          streams.sort(compareByLevel);
          this.minLevel = streams.length > 0 ? streams[0].level : -1;
        }
        return res;
      }
      function end() {
        for (const { stream } of this.streams) {
          if (typeof stream.flushSync === "function") {
            stream.flushSync();
          }
          stream.end();
        }
      }
      function clone(level) {
        const streams = new Array(this.streams.length);
        for (let i = 0; i < streams.length; i++) {
          streams[i] = {
            level,
            stream: this.streams[i].stream
          };
        }
        return {
          write,
          add,
          remove,
          minLevel: level,
          streams,
          clone,
          emit,
          flushSync,
          [metadata]: true
        };
      }
    }
    function compareByLevel(a, b) {
      return a.level - b.level;
    }
    function initLoopVar(length, dedupe) {
      return dedupe ? length - 1 : 0;
    }
    function adjustLoopVar(i, dedupe) {
      return dedupe ? i - 1 : i + 1;
    }
    function checkLoopVar(i, length, dedupe) {
      return dedupe ? i >= 0 : i < length;
    }
    module2.exports = multistream;
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/pino.js
var require_pino = __commonJS({
  "node_modules/.pnpm/pino@9.14.0/node_modules/pino/pino.js"(exports2, module2) {
    function pinoBundlerAbsolutePath(p) {
      try {
        const path = require("path");
        const outputDir = "/Users/pasindumalinda/OPTIMIND_AI/Web_project/Ocean_Welligama/Ocean-Weligama/api";
        return path.resolve(outputDir, p.replace(/^\.\//, ""));
      } catch (e) {
        const f = new Function("p", "return new URL(p, import.meta.url).pathname");
        return f(p);
      }
    }
    globalThis.__bundlerPathsOverrides = { ...globalThis.__bundlerPathsOverrides || {}, "thread-stream-worker": pinoBundlerAbsolutePath("./thread-stream-worker.js"), "pino-worker": pinoBundlerAbsolutePath("./pino-worker.js"), "pino/file": pinoBundlerAbsolutePath("./pino-file.js"), "pino-pretty": pinoBundlerAbsolutePath("./pino-pretty.js") };
    var os = require("node:os");
    var stdSerializers = require_pino_std_serializers();
    var caller = require_caller();
    var redaction = require_redaction();
    var time = require_time();
    var proto = require_proto();
    var symbols = require_symbols();
    var { configure } = require_safe_stable_stringify();
    var { assertDefaultLevelFound, mappings, genLsCache, genLevelComparison, assertLevelComparison } = require_levels();
    var { DEFAULT_LEVELS, SORTING_ORDER } = require_constants();
    var {
      createArgsNormalizer,
      asChindings,
      buildSafeSonicBoom,
      buildFormatters,
      stringify,
      normalizeDestFileDescriptor,
      noop
    } = require_tools();
    var { version } = require_meta();
    var {
      chindingsSym,
      redactFmtSym,
      serializersSym,
      timeSym,
      timeSliceIndexSym,
      streamSym,
      stringifySym,
      stringifySafeSym,
      stringifiersSym,
      setLevelSym,
      endSym,
      formatOptsSym,
      messageKeySym,
      errorKeySym,
      nestedKeySym,
      mixinSym,
      levelCompSym,
      useOnlyCustomLevelsSym,
      formattersSym,
      hooksSym,
      nestedKeyStrSym,
      mixinMergeStrategySym,
      msgPrefixSym
    } = symbols;
    var { epochTime, nullTime } = time;
    var { pid } = process;
    var hostname = os.hostname();
    var defaultErrorSerializer = stdSerializers.err;
    var defaultOptions = {
      level: "info",
      levelComparison: SORTING_ORDER.ASC,
      levels: DEFAULT_LEVELS,
      messageKey: "msg",
      errorKey: "err",
      nestedKey: null,
      enabled: true,
      base: { pid, hostname },
      serializers: Object.assign(/* @__PURE__ */ Object.create(null), {
        err: defaultErrorSerializer
      }),
      formatters: Object.assign(/* @__PURE__ */ Object.create(null), {
        bindings(bindings) {
          return bindings;
        },
        level(label, number) {
          return { level: number };
        }
      }),
      hooks: {
        logMethod: void 0,
        streamWrite: void 0
      },
      timestamp: epochTime,
      name: void 0,
      redact: null,
      customLevels: null,
      useOnlyCustomLevels: false,
      depthLimit: 5,
      edgeLimit: 100
    };
    var normalize = createArgsNormalizer(defaultOptions);
    var serializers = Object.assign(/* @__PURE__ */ Object.create(null), stdSerializers);
    function pino2(...args) {
      const instance = {};
      const { opts, stream } = normalize(instance, caller(), ...args);
      if (opts.level && typeof opts.level === "string" && DEFAULT_LEVELS[opts.level.toLowerCase()] !== void 0) opts.level = opts.level.toLowerCase();
      const {
        redact,
        crlf,
        serializers: serializers2,
        timestamp,
        messageKey,
        errorKey,
        nestedKey,
        base,
        name,
        level,
        customLevels,
        levelComparison,
        mixin,
        mixinMergeStrategy,
        useOnlyCustomLevels,
        formatters,
        hooks,
        depthLimit,
        edgeLimit,
        onChild,
        msgPrefix
      } = opts;
      const stringifySafe = configure({
        maximumDepth: depthLimit,
        maximumBreadth: edgeLimit
      });
      const allFormatters = buildFormatters(
        formatters.level,
        formatters.bindings,
        formatters.log
      );
      const stringifyFn = stringify.bind({
        [stringifySafeSym]: stringifySafe
      });
      const stringifiers = redact ? redaction(redact, stringifyFn) : {};
      const formatOpts = redact ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
      const end = "}" + (crlf ? "\r\n" : "\n");
      const coreChindings = asChindings.bind(null, {
        [chindingsSym]: "",
        [serializersSym]: serializers2,
        [stringifiersSym]: stringifiers,
        [stringifySym]: stringify,
        [stringifySafeSym]: stringifySafe,
        [formattersSym]: allFormatters
      });
      let chindings = "";
      if (base !== null) {
        if (name === void 0) {
          chindings = coreChindings(base);
        } else {
          chindings = coreChindings(Object.assign({}, base, { name }));
        }
      }
      const time2 = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
      const timeSliceIndex = time2().indexOf(":") + 1;
      if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
      if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
      if (msgPrefix && typeof msgPrefix !== "string") throw Error(`Unknown msgPrefix type "${typeof msgPrefix}" - expected "string"`);
      assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
      const levels = mappings(customLevels, useOnlyCustomLevels);
      if (typeof stream.emit === "function") {
        stream.emit("message", { code: "PINO_CONFIG", config: { levels, messageKey, errorKey } });
      }
      assertLevelComparison(levelComparison);
      const levelCompFunc = genLevelComparison(levelComparison);
      Object.assign(instance, {
        levels,
        [levelCompSym]: levelCompFunc,
        [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
        [streamSym]: stream,
        [timeSym]: time2,
        [timeSliceIndexSym]: timeSliceIndex,
        [stringifySym]: stringify,
        [stringifySafeSym]: stringifySafe,
        [stringifiersSym]: stringifiers,
        [endSym]: end,
        [formatOptsSym]: formatOpts,
        [messageKeySym]: messageKey,
        [errorKeySym]: errorKey,
        [nestedKeySym]: nestedKey,
        // protect against injection
        [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
        [serializersSym]: serializers2,
        [mixinSym]: mixin,
        [mixinMergeStrategySym]: mixinMergeStrategy,
        [chindingsSym]: chindings,
        [formattersSym]: allFormatters,
        [hooksSym]: hooks,
        silent: noop,
        onChild,
        [msgPrefixSym]: msgPrefix
      });
      Object.setPrototypeOf(instance, proto());
      genLsCache(instance);
      instance[setLevelSym](level);
      return instance;
    }
    module2.exports = pino2;
    module2.exports.destination = (dest = process.stdout.fd) => {
      if (typeof dest === "object") {
        dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
        return buildSafeSonicBoom(dest);
      } else {
        return buildSafeSonicBoom({ dest: normalizeDestFileDescriptor(dest), minLength: 0 });
      }
    };
    module2.exports.transport = require_transport();
    module2.exports.multistream = require_multistream();
    module2.exports.levels = mappings();
    module2.exports.stdSerializers = serializers;
    module2.exports.stdTimeFunctions = Object.assign({}, time);
    module2.exports.symbols = symbols;
    module2.exports.version = version;
    module2.exports.default = pino2;
    module2.exports.pino = pino2;
  }
});

// node_modules/.pnpm/pino@9.14.0/node_modules/pino/file.js
var pino = require_pino();
var { once } = require("node:events");
module.exports = async function(opts = {}) {
  const destOpts = Object.assign({}, opts, { dest: opts.destination || 1, sync: false });
  delete destOpts.destination;
  const destination = pino.destination(destOpts);
  await once(destination, "ready");
  return destination;
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tc3RkLXNlcmlhbGl6ZXJzQDcuMS4wL25vZGVfbW9kdWxlcy9waW5vLXN0ZC1zZXJpYWxpemVycy9saWIvZXJyLWhlbHBlcnMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tc3RkLXNlcmlhbGl6ZXJzQDcuMS4wL25vZGVfbW9kdWxlcy9waW5vLXN0ZC1zZXJpYWxpemVycy9saWIvZXJyLXByb3RvLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXN0ZC1zZXJpYWxpemVyc0A3LjEuMC9ub2RlX21vZHVsZXMvcGluby1zdGQtc2VyaWFsaXplcnMvbGliL2Vyci5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1zdGQtc2VyaWFsaXplcnNANy4xLjAvbm9kZV9tb2R1bGVzL3Bpbm8tc3RkLXNlcmlhbGl6ZXJzL2xpYi9lcnItd2l0aC1jYXVzZS5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGluby1zdGQtc2VyaWFsaXplcnNANy4xLjAvbm9kZV9tb2R1bGVzL3Bpbm8tc3RkLXNlcmlhbGl6ZXJzL2xpYi9yZXEuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm8tc3RkLXNlcmlhbGl6ZXJzQDcuMS4wL25vZGVfbW9kdWxlcy9waW5vLXN0ZC1zZXJpYWxpemVycy9saWIvcmVzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vLXN0ZC1zZXJpYWxpemVyc0A3LjEuMC9ub2RlX21vZHVsZXMvcGluby1zdGQtc2VyaWFsaXplcnMvaW5kZXguanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm9AOS4xNC4wL25vZGVfbW9kdWxlcy9waW5vL2xpYi9jYWxsZXIuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0BwaW5vanMrcmVkYWN0QDAuNC4wL25vZGVfbW9kdWxlcy9AcGlub2pzL3JlZGFjdC9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGlub0A5LjE0LjAvbm9kZV9tb2R1bGVzL3Bpbm8vbGliL3N5bWJvbHMuanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm9AOS4xNC4wL25vZGVfbW9kdWxlcy9waW5vL2xpYi9yZWRhY3Rpb24uanMiLCAiLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3Bpbm9AOS4xNC4wL25vZGVfbW9kdWxlcy9waW5vL2xpYi90aW1lLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9xdWljay1mb3JtYXQtdW5lc2NhcGVkQDQuMC40L25vZGVfbW9kdWxlcy9xdWljay1mb3JtYXQtdW5lc2NhcGVkL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9hdG9taWMtc2xlZXBAMS4wLjAvbm9kZV9tb2R1bGVzL2F0b21pYy1zbGVlcC9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vc29uaWMtYm9vbUA0LjIuMS9ub2RlX21vZHVsZXMvc29uaWMtYm9vbS9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vb24tZXhpdC1sZWFrLWZyZWVAMi4xLjIvbm9kZV9tb2R1bGVzL29uLWV4aXQtbGVhay1mcmVlL2luZGV4LmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS90aHJlYWQtc3RyZWFtQDMuMS4wL25vZGVfbW9kdWxlcy90aHJlYWQtc3RyZWFtL3BhY2thZ2UuanNvbiIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vdGhyZWFkLXN0cmVhbUAzLjEuMC9ub2RlX21vZHVsZXMvdGhyZWFkLXN0cmVhbS9saWIvd2FpdC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vdGhyZWFkLXN0cmVhbUAzLjEuMC9ub2RlX21vZHVsZXMvdGhyZWFkLXN0cmVhbS9saWIvaW5kZXhlcy5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vdGhyZWFkLXN0cmVhbUAzLjEuMC9ub2RlX21vZHVsZXMvdGhyZWFkLXN0cmVhbS9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGlub0A5LjE0LjAvbm9kZV9tb2R1bGVzL3Bpbm8vbGliL3RyYW5zcG9ydC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGlub0A5LjE0LjAvbm9kZV9tb2R1bGVzL3Bpbm8vbGliL3Rvb2xzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vQDkuMTQuMC9ub2RlX21vZHVsZXMvcGluby9saWIvY29uc3RhbnRzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vQDkuMTQuMC9ub2RlX21vZHVsZXMvcGluby9saWIvbGV2ZWxzLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vQDkuMTQuMC9ub2RlX21vZHVsZXMvcGluby9saWIvbWV0YS5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGlub0A5LjE0LjAvbm9kZV9tb2R1bGVzL3Bpbm8vbGliL3Byb3RvLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9zYWZlLXN0YWJsZS1zdHJpbmdpZnlAMi41LjAvbm9kZV9tb2R1bGVzL3NhZmUtc3RhYmxlLXN0cmluZ2lmeS9pbmRleC5qcyIsICIuLi9ub2RlX21vZHVsZXMvLnBucG0vcGlub0A5LjE0LjAvbm9kZV9tb2R1bGVzL3Bpbm8vbGliL211bHRpc3RyZWFtLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vQDkuMTQuMC9ub2RlX21vZHVsZXMvcGluby9waW5vLmpzIiwgIi4uL25vZGVfbW9kdWxlcy8ucG5wbS9waW5vQDkuMTQuMC9ub2RlX21vZHVsZXMvcGluby9maWxlLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIndXNlIHN0cmljdCdcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogQ29kZSBpbml0aWFsbHkgY29waWVkL2FkYXB0ZWQgZnJvbSBcInBvbnktY2F1c2VcIiBucG0gbW9kdWxlICpcbi8vICogUGxlYXNlIHVwc3RyZWFtIGltcHJvdmVtZW50cyB0aGVyZSAgICAgICAgICAgICAgICAgICAgICAgICAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCBpc0Vycm9yTGlrZSA9IChlcnIpID0+IHtcbiAgcmV0dXJuIGVyciAmJiB0eXBlb2YgZXJyLm1lc3NhZ2UgPT09ICdzdHJpbmcnXG59XG5cbi8qKlxuICogQHBhcmFtIHtFcnJvcnx7IGNhdXNlPzogdW5rbm93bnwoKCk9PmVycil9fSBlcnJcbiAqIEByZXR1cm5zIHtFcnJvcnxPYmplY3R8dW5kZWZpbmVkfVxuICovXG5jb25zdCBnZXRFcnJvckNhdXNlID0gKGVycikgPT4ge1xuICBpZiAoIWVycikgcmV0dXJuXG5cbiAgLyoqIEB0eXBlIHt1bmtub3dufSAqL1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGNhdXNlID0gZXJyLmNhdXNlXG5cbiAgLy8gVkVycm9yIC8gTkVycm9yIHN0eWxlIGNhdXNlc1xuICBpZiAodHlwZW9mIGNhdXNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNhdXNlUmVzdWx0ID0gZXJyLmNhdXNlKClcblxuICAgIHJldHVybiBpc0Vycm9yTGlrZShjYXVzZVJlc3VsdClcbiAgICAgID8gY2F1c2VSZXN1bHRcbiAgICAgIDogdW5kZWZpbmVkXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGlzRXJyb3JMaWtlKGNhdXNlKVxuICAgICAgPyBjYXVzZVxuICAgICAgOiB1bmRlZmluZWRcbiAgfVxufVxuXG4vKipcbiAqIEludGVybmFsIG1ldGhvZCB0aGF0IGtlZXBzIGEgdHJhY2sgb2Ygd2hpY2ggZXJyb3Igd2UgaGF2ZSBhbHJlYWR5IGFkZGVkLCB0byBhdm9pZCBjaXJjdWxhciByZWN1cnNpb25cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtFcnJvcn0gZXJyXG4gKiBAcGFyYW0ge1NldDxFcnJvcj59IHNlZW5cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IF9zdGFja1dpdGhDYXVzZXMgPSAoZXJyLCBzZWVuKSA9PiB7XG4gIGlmICghaXNFcnJvckxpa2UoZXJyKSkgcmV0dXJuICcnXG5cbiAgY29uc3Qgc3RhY2sgPSBlcnIuc3RhY2sgfHwgJydcblxuICAvLyBFbnN1cmUgd2UgZG9uJ3QgZ28gY2lyY3VsYXIgb3IgY3JhemlseSBkZWVwXG4gIGlmIChzZWVuLmhhcyhlcnIpKSB7XG4gICAgcmV0dXJuIHN0YWNrICsgJ1xcbmNhdXNlcyBoYXZlIGJlY29tZSBjaXJjdWxhci4uLidcbiAgfVxuXG4gIGNvbnN0IGNhdXNlID0gZ2V0RXJyb3JDYXVzZShlcnIpXG5cbiAgaWYgKGNhdXNlKSB7XG4gICAgc2Vlbi5hZGQoZXJyKVxuICAgIHJldHVybiAoc3RhY2sgKyAnXFxuY2F1c2VkIGJ5OiAnICsgX3N0YWNrV2l0aENhdXNlcyhjYXVzZSwgc2VlbikpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0YWNrXG4gIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IHN0YWNrV2l0aENhdXNlcyA9IChlcnIpID0+IF9zdGFja1dpdGhDYXVzZXMoZXJyLCBuZXcgU2V0KCkpXG5cbi8qKlxuICogSW50ZXJuYWwgbWV0aG9kIHRoYXQga2VlcHMgYSB0cmFjayBvZiB3aGljaCBlcnJvciB3ZSBoYXZlIGFscmVhZHkgYWRkZWQsIHRvIGF2b2lkIGNpcmN1bGFyIHJlY3Vyc2lvblxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnJcbiAqIEBwYXJhbSB7U2V0PEVycm9yPn0gc2VlblxuICogQHBhcmFtIHtib29sZWFufSBbc2tpcF1cbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmNvbnN0IF9tZXNzYWdlV2l0aENhdXNlcyA9IChlcnIsIHNlZW4sIHNraXApID0+IHtcbiAgaWYgKCFpc0Vycm9yTGlrZShlcnIpKSByZXR1cm4gJydcblxuICBjb25zdCBtZXNzYWdlID0gc2tpcCA/ICcnIDogKGVyci5tZXNzYWdlIHx8ICcnKVxuXG4gIC8vIEVuc3VyZSB3ZSBkb24ndCBnbyBjaXJjdWxhciBvciBjcmF6aWx5IGRlZXBcbiAgaWYgKHNlZW4uaGFzKGVycikpIHtcbiAgICByZXR1cm4gbWVzc2FnZSArICc6IC4uLidcbiAgfVxuXG4gIGNvbnN0IGNhdXNlID0gZ2V0RXJyb3JDYXVzZShlcnIpXG5cbiAgaWYgKGNhdXNlKSB7XG4gICAgc2Vlbi5hZGQoZXJyKVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IHNraXBJZlZFcnJvclN0eWxlQ2F1c2UgPSB0eXBlb2YgZXJyLmNhdXNlID09PSAnZnVuY3Rpb24nXG5cbiAgICByZXR1cm4gKG1lc3NhZ2UgK1xuICAgICAgKHNraXBJZlZFcnJvclN0eWxlQ2F1c2UgPyAnJyA6ICc6ICcpICtcbiAgICAgIF9tZXNzYWdlV2l0aENhdXNlcyhjYXVzZSwgc2Vlbiwgc2tpcElmVkVycm9yU3R5bGVDYXVzZSkpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1lc3NhZ2VcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7RXJyb3J9IGVyclxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuY29uc3QgbWVzc2FnZVdpdGhDYXVzZXMgPSAoZXJyKSA9PiBfbWVzc2FnZVdpdGhDYXVzZXMoZXJyLCBuZXcgU2V0KCkpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0Vycm9yTGlrZSxcbiAgZ2V0RXJyb3JDYXVzZSxcbiAgc3RhY2tXaXRoQ2F1c2VzLFxuICBtZXNzYWdlV2l0aENhdXNlc1xufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBzZWVuID0gU3ltYm9sKCdjaXJjdWxhci1yZWYtdGFnJylcbmNvbnN0IHJhd1N5bWJvbCA9IFN5bWJvbCgncGluby1yYXctZXJyLXJlZicpXG5cbmNvbnN0IHBpbm9FcnJQcm90byA9IE9iamVjdC5jcmVhdGUoe30sIHtcbiAgdHlwZToge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IHVuZGVmaW5lZFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogdW5kZWZpbmVkXG4gIH0sXG4gIHN0YWNrOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogdW5kZWZpbmVkXG4gIH0sXG4gIGFnZ3JlZ2F0ZUVycm9yczoge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6IHVuZGVmaW5lZFxuICB9LFxuICByYXc6IHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzW3Jhd1N5bWJvbF1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgdGhpc1tyYXdTeW1ib2xdID0gdmFsXG4gICAgfVxuICB9XG59KVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHBpbm9FcnJQcm90bywgcmF3U3ltYm9sLCB7XG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZToge31cbn0pXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwaW5vRXJyUHJvdG8sXG4gIHBpbm9FcnJvclN5bWJvbHM6IHtcbiAgICBzZWVuLFxuICAgIHJhd1N5bWJvbFxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbm1vZHVsZS5leHBvcnRzID0gZXJyU2VyaWFsaXplclxuXG5jb25zdCB7IG1lc3NhZ2VXaXRoQ2F1c2VzLCBzdGFja1dpdGhDYXVzZXMsIGlzRXJyb3JMaWtlIH0gPSByZXF1aXJlKCcuL2Vyci1oZWxwZXJzJylcbmNvbnN0IHsgcGlub0VyclByb3RvLCBwaW5vRXJyb3JTeW1ib2xzIH0gPSByZXF1aXJlKCcuL2Vyci1wcm90bycpXG5jb25zdCB7IHNlZW4gfSA9IHBpbm9FcnJvclN5bWJvbHNcblxuY29uc3QgeyB0b1N0cmluZyB9ID0gT2JqZWN0LnByb3RvdHlwZVxuXG5mdW5jdGlvbiBlcnJTZXJpYWxpemVyIChlcnIpIHtcbiAgaWYgKCFpc0Vycm9yTGlrZShlcnIpKSB7XG4gICAgcmV0dXJuIGVyclxuICB9XG5cbiAgZXJyW3NlZW5dID0gdW5kZWZpbmVkIC8vIHRhZyB0byBwcmV2ZW50IHJlLWxvb2tpbmcgYXQgdGhpc1xuICBjb25zdCBfZXJyID0gT2JqZWN0LmNyZWF0ZShwaW5vRXJyUHJvdG8pXG4gIF9lcnIudHlwZSA9IHRvU3RyaW5nLmNhbGwoZXJyLmNvbnN0cnVjdG9yKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJ1xuICAgID8gZXJyLmNvbnN0cnVjdG9yLm5hbWVcbiAgICA6IGVyci5uYW1lXG4gIF9lcnIubWVzc2FnZSA9IG1lc3NhZ2VXaXRoQ2F1c2VzKGVycilcbiAgX2Vyci5zdGFjayA9IHN0YWNrV2l0aENhdXNlcyhlcnIpXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZXJyLmVycm9ycykpIHtcbiAgICBfZXJyLmFnZ3JlZ2F0ZUVycm9ycyA9IGVyci5lcnJvcnMubWFwKGVyciA9PiBlcnJTZXJpYWxpemVyKGVycikpXG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBpbiBlcnIpIHtcbiAgICBpZiAoX2VycltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGVycltrZXldXG4gICAgICBpZiAoaXNFcnJvckxpa2UodmFsKSkge1xuICAgICAgICAvLyBXZSBhcHBlbmQgY2F1c2UgbWVzc2FnZXMgYW5kIHN0YWNrcyB0byBfZXJyLCB0aGVyZWZvcmUgc2tpcHBpbmcgY2F1c2VzIGhlcmVcbiAgICAgICAgaWYgKGtleSAhPT0gJ2NhdXNlJyAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbCwgc2VlbikpIHtcbiAgICAgICAgICBfZXJyW2tleV0gPSBlcnJTZXJpYWxpemVyKHZhbClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2VycltrZXldID0gdmFsXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVsZXRlIGVycltzZWVuXSAvLyBjbGVhbiB1cCB0YWcgaW4gY2FzZSBlcnIgaXMgc2VyaWFsaXplZCBhZ2FpbiBsYXRlclxuICBfZXJyLnJhdyA9IGVyclxuICByZXR1cm4gX2VyclxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVycldpdGhDYXVzZVNlcmlhbGl6ZXJcblxuY29uc3QgeyBpc0Vycm9yTGlrZSB9ID0gcmVxdWlyZSgnLi9lcnItaGVscGVycycpXG5jb25zdCB7IHBpbm9FcnJQcm90bywgcGlub0Vycm9yU3ltYm9scyB9ID0gcmVxdWlyZSgnLi9lcnItcHJvdG8nKVxuY29uc3QgeyBzZWVuIH0gPSBwaW5vRXJyb3JTeW1ib2xzXG5cbmNvbnN0IHsgdG9TdHJpbmcgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuZnVuY3Rpb24gZXJyV2l0aENhdXNlU2VyaWFsaXplciAoZXJyKSB7XG4gIGlmICghaXNFcnJvckxpa2UoZXJyKSkge1xuICAgIHJldHVybiBlcnJcbiAgfVxuXG4gIGVycltzZWVuXSA9IHVuZGVmaW5lZCAvLyB0YWcgdG8gcHJldmVudCByZS1sb29raW5nIGF0IHRoaXNcbiAgY29uc3QgX2VyciA9IE9iamVjdC5jcmVhdGUocGlub0VyclByb3RvKVxuICBfZXJyLnR5cGUgPSB0b1N0cmluZy5jYWxsKGVyci5jb25zdHJ1Y3RvcikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSdcbiAgICA/IGVyci5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgOiBlcnIubmFtZVxuICBfZXJyLm1lc3NhZ2UgPSBlcnIubWVzc2FnZVxuICBfZXJyLnN0YWNrID0gZXJyLnN0YWNrXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZXJyLmVycm9ycykpIHtcbiAgICBfZXJyLmFnZ3JlZ2F0ZUVycm9ycyA9IGVyci5lcnJvcnMubWFwKGVyciA9PiBlcnJXaXRoQ2F1c2VTZXJpYWxpemVyKGVycikpXG4gIH1cblxuICBpZiAoaXNFcnJvckxpa2UoZXJyLmNhdXNlKSAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVyci5jYXVzZSwgc2VlbikpIHtcbiAgICBfZXJyLmNhdXNlID0gZXJyV2l0aENhdXNlU2VyaWFsaXplcihlcnIuY2F1c2UpXG4gIH1cblxuICBmb3IgKGNvbnN0IGtleSBpbiBlcnIpIHtcbiAgICBpZiAoX2VycltrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IHZhbCA9IGVycltrZXldXG4gICAgICBpZiAoaXNFcnJvckxpa2UodmFsKSkge1xuICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWwsIHNlZW4pKSB7XG4gICAgICAgICAgX2VycltrZXldID0gZXJyV2l0aENhdXNlU2VyaWFsaXplcih2YWwpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9lcnJba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlbGV0ZSBlcnJbc2Vlbl0gLy8gY2xlYW4gdXAgdGFnIGluIGNhc2UgZXJyIGlzIHNlcmlhbGl6ZWQgYWdhaW4gbGF0ZXJcbiAgX2Vyci5yYXcgPSBlcnJcbiAgcmV0dXJuIF9lcnJcbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1hcEh0dHBSZXF1ZXN0LFxuICByZXFTZXJpYWxpemVyXG59XG5cbmNvbnN0IHJhd1N5bWJvbCA9IFN5bWJvbCgncGluby1yYXctcmVxLXJlZicpXG5jb25zdCBwaW5vUmVxUHJvdG8gPSBPYmplY3QuY3JlYXRlKHt9LCB7XG4gIGlkOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogJydcbiAgfSxcbiAgbWV0aG9kOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogJydcbiAgfSxcbiAgdXJsOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogJydcbiAgfSxcbiAgcXVlcnk6IHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiAnJ1xuICB9LFxuICBwYXJhbXM6IHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiAnJ1xuICB9LFxuICBoZWFkZXJzOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZToge31cbiAgfSxcbiAgcmVtb3RlQWRkcmVzczoge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgd3JpdGFibGU6IHRydWUsXG4gICAgdmFsdWU6ICcnXG4gIH0sXG4gIHJlbW90ZVBvcnQ6IHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiAnJ1xuICB9LFxuICByYXc6IHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzW3Jhd1N5bWJvbF1cbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgdGhpc1tyYXdTeW1ib2xdID0gdmFsXG4gICAgfVxuICB9XG59KVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHBpbm9SZXFQcm90bywgcmF3U3ltYm9sLCB7XG4gIHdyaXRhYmxlOiB0cnVlLFxuICB2YWx1ZToge31cbn0pXG5cbmZ1bmN0aW9uIHJlcVNlcmlhbGl6ZXIgKHJlcSkge1xuICAvLyByZXEuaW5mbyBpcyBmb3IgaGFwaSBjb21wYXQuXG4gIGNvbnN0IGNvbm5lY3Rpb24gPSByZXEuaW5mbyB8fCByZXEuc29ja2V0XG4gIGNvbnN0IF9yZXEgPSBPYmplY3QuY3JlYXRlKHBpbm9SZXFQcm90bylcbiAgX3JlcS5pZCA9ICh0eXBlb2YgcmVxLmlkID09PSAnZnVuY3Rpb24nID8gcmVxLmlkKCkgOiAocmVxLmlkIHx8IChyZXEuaW5mbyA/IHJlcS5pbmZvLmlkIDogdW5kZWZpbmVkKSkpXG4gIF9yZXEubWV0aG9kID0gcmVxLm1ldGhvZFxuICAvLyByZXEub3JpZ2luYWxVcmwgaXMgZm9yIGV4cHJlc3NqcyBjb21wYXQuXG4gIGlmIChyZXEub3JpZ2luYWxVcmwpIHtcbiAgICBfcmVxLnVybCA9IHJlcS5vcmlnaW5hbFVybFxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBhdGggPSByZXEucGF0aFxuICAgIC8vIHBhdGggZm9yIHNhZmUgaGFwaSBjb21wYXQuXG4gICAgX3JlcS51cmwgPSB0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycgPyBwYXRoIDogKHJlcS51cmwgPyByZXEudXJsLnBhdGggfHwgcmVxLnVybCA6IHVuZGVmaW5lZClcbiAgfVxuXG4gIGlmIChyZXEucXVlcnkpIHtcbiAgICBfcmVxLnF1ZXJ5ID0gcmVxLnF1ZXJ5XG4gIH1cblxuICBpZiAocmVxLnBhcmFtcykge1xuICAgIF9yZXEucGFyYW1zID0gcmVxLnBhcmFtc1xuICB9XG5cbiAgX3JlcS5oZWFkZXJzID0gcmVxLmhlYWRlcnNcbiAgX3JlcS5yZW1vdGVBZGRyZXNzID0gY29ubmVjdGlvbiAmJiBjb25uZWN0aW9uLnJlbW90ZUFkZHJlc3NcbiAgX3JlcS5yZW1vdGVQb3J0ID0gY29ubmVjdGlvbiAmJiBjb25uZWN0aW9uLnJlbW90ZVBvcnRcbiAgLy8gcmVxLnJhdyBpcyAgZm9yIGhhcGkgY29tcGF0L2VxdWl2YWxlbmNlXG4gIF9yZXEucmF3ID0gcmVxLnJhdyB8fCByZXFcbiAgcmV0dXJuIF9yZXFcbn1cblxuZnVuY3Rpb24gbWFwSHR0cFJlcXVlc3QgKHJlcSkge1xuICByZXR1cm4ge1xuICAgIHJlcTogcmVxU2VyaWFsaXplcihyZXEpXG4gIH1cbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1hcEh0dHBSZXNwb25zZSxcbiAgcmVzU2VyaWFsaXplclxufVxuXG5jb25zdCByYXdTeW1ib2wgPSBTeW1ib2woJ3Bpbm8tcmF3LXJlcy1yZWYnKVxuY29uc3QgcGlub1Jlc1Byb3RvID0gT2JqZWN0LmNyZWF0ZSh7fSwge1xuICBzdGF0dXNDb2RlOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogMFxuICB9LFxuICBoZWFkZXJzOiB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICB2YWx1ZTogJydcbiAgfSxcbiAgcmF3OiB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpc1tyYXdTeW1ib2xdXG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIHRoaXNbcmF3U3ltYm9sXSA9IHZhbFxuICAgIH1cbiAgfVxufSlcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShwaW5vUmVzUHJvdG8sIHJhd1N5bWJvbCwge1xuICB3cml0YWJsZTogdHJ1ZSxcbiAgdmFsdWU6IHt9XG59KVxuXG5mdW5jdGlvbiByZXNTZXJpYWxpemVyIChyZXMpIHtcbiAgY29uc3QgX3JlcyA9IE9iamVjdC5jcmVhdGUocGlub1Jlc1Byb3RvKVxuICBfcmVzLnN0YXR1c0NvZGUgPSByZXMuaGVhZGVyc1NlbnQgPyByZXMuc3RhdHVzQ29kZSA6IG51bGxcbiAgX3Jlcy5oZWFkZXJzID0gcmVzLmdldEhlYWRlcnMgPyByZXMuZ2V0SGVhZGVycygpIDogcmVzLl9oZWFkZXJzXG4gIF9yZXMucmF3ID0gcmVzXG4gIHJldHVybiBfcmVzXG59XG5cbmZ1bmN0aW9uIG1hcEh0dHBSZXNwb25zZSAocmVzKSB7XG4gIHJldHVybiB7XG4gICAgcmVzOiByZXNTZXJpYWxpemVyKHJlcylcbiAgfVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBlcnJTZXJpYWxpemVyID0gcmVxdWlyZSgnLi9saWIvZXJyJylcbmNvbnN0IGVycldpdGhDYXVzZVNlcmlhbGl6ZXIgPSByZXF1aXJlKCcuL2xpYi9lcnItd2l0aC1jYXVzZScpXG5jb25zdCByZXFTZXJpYWxpemVycyA9IHJlcXVpcmUoJy4vbGliL3JlcScpXG5jb25zdCByZXNTZXJpYWxpemVycyA9IHJlcXVpcmUoJy4vbGliL3JlcycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlcnI6IGVyclNlcmlhbGl6ZXIsXG4gIGVycldpdGhDYXVzZTogZXJyV2l0aENhdXNlU2VyaWFsaXplcixcbiAgbWFwSHR0cFJlcXVlc3Q6IHJlcVNlcmlhbGl6ZXJzLm1hcEh0dHBSZXF1ZXN0LFxuICBtYXBIdHRwUmVzcG9uc2U6IHJlc1NlcmlhbGl6ZXJzLm1hcEh0dHBSZXNwb25zZSxcbiAgcmVxOiByZXFTZXJpYWxpemVycy5yZXFTZXJpYWxpemVyLFxuICByZXM6IHJlc1NlcmlhbGl6ZXJzLnJlc1NlcmlhbGl6ZXIsXG5cbiAgd3JhcEVycm9yU2VyaWFsaXplcjogZnVuY3Rpb24gd3JhcEVycm9yU2VyaWFsaXplciAoY3VzdG9tU2VyaWFsaXplcikge1xuICAgIGlmIChjdXN0b21TZXJpYWxpemVyID09PSBlcnJTZXJpYWxpemVyKSByZXR1cm4gY3VzdG9tU2VyaWFsaXplclxuICAgIHJldHVybiBmdW5jdGlvbiB3cmFwRXJyU2VyaWFsaXplciAoZXJyKSB7XG4gICAgICByZXR1cm4gY3VzdG9tU2VyaWFsaXplcihlcnJTZXJpYWxpemVyKGVycikpXG4gICAgfVxuICB9LFxuXG4gIHdyYXBSZXF1ZXN0U2VyaWFsaXplcjogZnVuY3Rpb24gd3JhcFJlcXVlc3RTZXJpYWxpemVyIChjdXN0b21TZXJpYWxpemVyKSB7XG4gICAgaWYgKGN1c3RvbVNlcmlhbGl6ZXIgPT09IHJlcVNlcmlhbGl6ZXJzLnJlcVNlcmlhbGl6ZXIpIHJldHVybiBjdXN0b21TZXJpYWxpemVyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWRSZXFTZXJpYWxpemVyIChyZXEpIHtcbiAgICAgIHJldHVybiBjdXN0b21TZXJpYWxpemVyKHJlcVNlcmlhbGl6ZXJzLnJlcVNlcmlhbGl6ZXIocmVxKSlcbiAgICB9XG4gIH0sXG5cbiAgd3JhcFJlc3BvbnNlU2VyaWFsaXplcjogZnVuY3Rpb24gd3JhcFJlc3BvbnNlU2VyaWFsaXplciAoY3VzdG9tU2VyaWFsaXplcikge1xuICAgIGlmIChjdXN0b21TZXJpYWxpemVyID09PSByZXNTZXJpYWxpemVycy5yZXNTZXJpYWxpemVyKSByZXR1cm4gY3VzdG9tU2VyaWFsaXplclxuICAgIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkUmVzU2VyaWFsaXplciAocmVzKSB7XG4gICAgICByZXR1cm4gY3VzdG9tU2VyaWFsaXplcihyZXNTZXJpYWxpemVycy5yZXNTZXJpYWxpemVyKHJlcykpXG4gICAgfVxuICB9XG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIG5vT3BQcmVwYXJlU3RhY2tUcmFjZSAoXywgc3RhY2spIHtcbiAgcmV0dXJuIHN0YWNrXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Q2FsbGVycyAoKSB7XG4gIGNvbnN0IG9yaWdpbmFsUHJlcGFyZSA9IEVycm9yLnByZXBhcmVTdGFja1RyYWNlXG4gIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gbm9PcFByZXBhcmVTdGFja1RyYWNlXG4gIGNvbnN0IHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2tcbiAgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBvcmlnaW5hbFByZXBhcmVcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoc3RhY2spKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG5cbiAgY29uc3QgZW50cmllcyA9IHN0YWNrLnNsaWNlKDIpXG5cbiAgY29uc3QgZmlsZU5hbWVzID0gW11cblxuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICBjb250aW51ZVxuICAgIH1cblxuICAgIGZpbGVOYW1lcy5wdXNoKGVudHJ5LmdldEZpbGVOYW1lKCkpXG4gIH1cblxuICByZXR1cm4gZmlsZU5hbWVzXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmZ1bmN0aW9uIGRlZXBDbG9uZSAob2JqKSB7XG4gIGlmIChvYmogPT09IG51bGwgfHwgdHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gb2JqXG4gIH1cblxuICBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgIHJldHVybiBuZXcgRGF0ZShvYmouZ2V0VGltZSgpKVxuICB9XG5cbiAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgY29uc3QgY2xvbmVkID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgY2xvbmVkW2ldID0gZGVlcENsb25lKG9ialtpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNsb25lZFxuICB9XG5cbiAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgY29uc3QgY2xvbmVkID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKSlcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSB7XG4gICAgICAgIGNsb25lZFtrZXldID0gZGVlcENsb25lKG9ialtrZXldKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2xvbmVkXG4gIH1cblxuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xuICBjb25zdCBwYXJ0cyA9IFtdXG4gIGxldCBjdXJyZW50ID0gJydcbiAgbGV0IGluQnJhY2tldHMgPSBmYWxzZVxuICBsZXQgaW5RdW90ZXMgPSBmYWxzZVxuICBsZXQgcXVvdGVDaGFyID0gJydcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGgubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjaGFyID0gcGF0aFtpXVxuXG4gICAgaWYgKCFpbkJyYWNrZXRzICYmIGNoYXIgPT09ICcuJykge1xuICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgcGFydHMucHVzaChjdXJyZW50KVxuICAgICAgICBjdXJyZW50ID0gJydcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoYXIgPT09ICdbJykge1xuICAgICAgaWYgKGN1cnJlbnQpIHtcbiAgICAgICAgcGFydHMucHVzaChjdXJyZW50KVxuICAgICAgICBjdXJyZW50ID0gJydcbiAgICAgIH1cbiAgICAgIGluQnJhY2tldHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChjaGFyID09PSAnXScgJiYgaW5CcmFja2V0cykge1xuICAgICAgLy8gQWx3YXlzIHB1c2ggdGhlIGN1cnJlbnQgdmFsdWUgd2hlbiBjbG9zaW5nIGJyYWNrZXRzLCBldmVuIGlmIGl0J3MgYW4gZW1wdHkgc3RyaW5nXG4gICAgICBwYXJ0cy5wdXNoKGN1cnJlbnQpXG4gICAgICBjdXJyZW50ID0gJydcbiAgICAgIGluQnJhY2tldHMgPSBmYWxzZVxuICAgICAgaW5RdW90ZXMgPSBmYWxzZVxuICAgIH0gZWxzZSBpZiAoKGNoYXIgPT09ICdcIicgfHwgY2hhciA9PT0gXCInXCIpICYmIGluQnJhY2tldHMpIHtcbiAgICAgIGlmICghaW5RdW90ZXMpIHtcbiAgICAgICAgaW5RdW90ZXMgPSB0cnVlXG4gICAgICAgIHF1b3RlQ2hhciA9IGNoYXJcbiAgICAgIH0gZWxzZSBpZiAoY2hhciA9PT0gcXVvdGVDaGFyKSB7XG4gICAgICAgIGluUXVvdGVzID0gZmFsc2VcbiAgICAgICAgcXVvdGVDaGFyID0gJydcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnQgKz0gY2hhclxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50ICs9IGNoYXJcbiAgICB9XG4gIH1cblxuICBpZiAoY3VycmVudCkge1xuICAgIHBhcnRzLnB1c2goY3VycmVudClcbiAgfVxuXG4gIHJldHVybiBwYXJ0c1xufVxuXG5mdW5jdGlvbiBzZXRWYWx1ZSAob2JqLCBwYXJ0cywgdmFsdWUpIHtcbiAgbGV0IGN1cnJlbnQgPSBvYmpcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIGNvbnN0IGtleSA9IHBhcnRzW2ldXG4gICAgLy8gVHlwZSBzYWZldHk6IENoZWNrIGlmIGN1cnJlbnQgaXMgYW4gb2JqZWN0IGJlZm9yZSB1c2luZyAnaW4nIG9wZXJhdG9yXG4gICAgaWYgKHR5cGVvZiBjdXJyZW50ICE9PSAnb2JqZWN0JyB8fCBjdXJyZW50ID09PSBudWxsIHx8ICEoa2V5IGluIGN1cnJlbnQpKSB7XG4gICAgICByZXR1cm4gZmFsc2UgLy8gUGF0aCBkb2Vzbid0IGV4aXN0LCBkb24ndCBjcmVhdGUgaXRcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjdXJyZW50W2tleV0gIT09ICdvYmplY3QnIHx8IGN1cnJlbnRba2V5XSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlIC8vIFBhdGggZG9lc24ndCBleGlzdCBwcm9wZXJseVxuICAgIH1cbiAgICBjdXJyZW50ID0gY3VycmVudFtrZXldXG4gIH1cblxuICBjb25zdCBsYXN0S2V5ID0gcGFydHNbcGFydHMubGVuZ3RoIC0gMV1cbiAgaWYgKGxhc3RLZXkgPT09ICcqJykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGN1cnJlbnQpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY3VycmVudFtpXSA9IHZhbHVlXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ29iamVjdCcgJiYgY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3VycmVudCkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1cnJlbnQsIGtleSkpIHtcbiAgICAgICAgICBjdXJyZW50W2tleV0gPSB2YWx1ZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFR5cGUgc2FmZXR5OiBDaGVjayBpZiBjdXJyZW50IGlzIGFuIG9iamVjdCBiZWZvcmUgdXNpbmcgJ2luJyBvcGVyYXRvclxuICAgIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ29iamVjdCcgJiYgY3VycmVudCAhPT0gbnVsbCAmJiBsYXN0S2V5IGluIGN1cnJlbnQgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1cnJlbnQsIGxhc3RLZXkpKSB7XG4gICAgICBjdXJyZW50W2xhc3RLZXldID0gdmFsdWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gcmVtb3ZlS2V5IChvYmosIHBhcnRzKSB7XG4gIGxldCBjdXJyZW50ID0gb2JqXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICBjb25zdCBrZXkgPSBwYXJ0c1tpXVxuICAgIC8vIFR5cGUgc2FmZXR5OiBDaGVjayBpZiBjdXJyZW50IGlzIGFuIG9iamVjdCBiZWZvcmUgdXNpbmcgJ2luJyBvcGVyYXRvclxuICAgIGlmICh0eXBlb2YgY3VycmVudCAhPT0gJ29iamVjdCcgfHwgY3VycmVudCA9PT0gbnVsbCB8fCAhKGtleSBpbiBjdXJyZW50KSkge1xuICAgICAgcmV0dXJuIGZhbHNlIC8vIFBhdGggZG9lc24ndCBleGlzdCwgZG9uJ3QgY3JlYXRlIGl0XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY3VycmVudFtrZXldICE9PSAnb2JqZWN0JyB8fCBjdXJyZW50W2tleV0gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZSAvLyBQYXRoIGRvZXNuJ3QgZXhpc3QgcHJvcGVybHlcbiAgICB9XG4gICAgY3VycmVudCA9IGN1cnJlbnRba2V5XVxuICB9XG5cbiAgY29uc3QgbGFzdEtleSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdXG4gIGlmIChsYXN0S2V5ID09PSAnKicpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50KSkge1xuICAgICAgLy8gRm9yIGFycmF5cywgd2UgY2FuJ3QgcmVhbGx5IFwicmVtb3ZlXCIgYWxsIGl0ZW1zIGFzIHRoYXQgd291bGQgY2hhbmdlIGluZGljZXNcbiAgICAgIC8vIEluc3RlYWQsIHdlIHNldCB0aGVtIHRvIHVuZGVmaW5lZCB3aGljaCB3aWxsIGJlIG9taXR0ZWQgYnkgSlNPTi5zdHJpbmdpZnlcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICBjdXJyZW50W2ldID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ29iamVjdCcgJiYgY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3VycmVudCkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1cnJlbnQsIGtleSkpIHtcbiAgICAgICAgICBkZWxldGUgY3VycmVudFtrZXldXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gVHlwZSBzYWZldHk6IENoZWNrIGlmIGN1cnJlbnQgaXMgYW4gb2JqZWN0IGJlZm9yZSB1c2luZyAnaW4nIG9wZXJhdG9yXG4gICAgaWYgKHR5cGVvZiBjdXJyZW50ID09PSAnb2JqZWN0JyAmJiBjdXJyZW50ICE9PSBudWxsICYmIGxhc3RLZXkgaW4gY3VycmVudCAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY3VycmVudCwgbGFzdEtleSkpIHtcbiAgICAgIGRlbGV0ZSBjdXJyZW50W2xhc3RLZXldXG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFNlbnRpbmVsIG9iamVjdCB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIHVuZGVmaW5lZCB2YWx1ZSBhbmQgbm9uLWV4aXN0ZW50IHBhdGhcbmNvbnN0IFBBVEhfTk9UX0ZPVU5EID0gU3ltYm9sKCdQQVRIX05PVF9GT1VORCcpXG5cbmZ1bmN0aW9uIGdldFZhbHVlSWZFeGlzdHMgKG9iaiwgcGFydHMpIHtcbiAgbGV0IGN1cnJlbnQgPSBvYmpcblxuICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICBpZiAoY3VycmVudCA9PT0gbnVsbCB8fCBjdXJyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBQQVRIX05PVF9GT1VORFxuICAgIH1cbiAgICAvLyBUeXBlIHNhZmV0eTogQ2hlY2sgaWYgY3VycmVudCBpcyBhbiBvYmplY3QgYmVmb3JlIHByb3BlcnR5IGFjY2Vzc1xuICAgIGlmICh0eXBlb2YgY3VycmVudCAhPT0gJ29iamVjdCcgfHwgY3VycmVudCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFBBVEhfTk9UX0ZPVU5EXG4gICAgfVxuICAgIC8vIENoZWNrIGlmIHRoZSBwcm9wZXJ0eSBleGlzdHMgYmVmb3JlIGFjY2Vzc2luZyBpdFxuICAgIGlmICghKHBhcnQgaW4gY3VycmVudCkpIHtcbiAgICAgIHJldHVybiBQQVRIX05PVF9GT1VORFxuICAgIH1cbiAgICBjdXJyZW50ID0gY3VycmVudFtwYXJ0XVxuICB9XG5cbiAgcmV0dXJuIGN1cnJlbnRcbn1cblxuZnVuY3Rpb24gZ2V0VmFsdWUgKG9iaiwgcGFydHMpIHtcbiAgbGV0IGN1cnJlbnQgPSBvYmpcblxuICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFydHMpIHtcbiAgICBpZiAoY3VycmVudCA9PT0gbnVsbCB8fCBjdXJyZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgLy8gVHlwZSBzYWZldHk6IENoZWNrIGlmIGN1cnJlbnQgaXMgYW4gb2JqZWN0IGJlZm9yZSBwcm9wZXJ0eSBhY2Nlc3NcbiAgICBpZiAodHlwZW9mIGN1cnJlbnQgIT09ICdvYmplY3QnIHx8IGN1cnJlbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgY3VycmVudCA9IGN1cnJlbnRbcGFydF1cbiAgfVxuXG4gIHJldHVybiBjdXJyZW50XG59XG5cbmZ1bmN0aW9uIHJlZGFjdFBhdGhzIChvYmosIHBhdGhzLCBjZW5zb3IsIHJlbW92ZSA9IGZhbHNlKSB7XG4gIGZvciAoY29uc3QgcGF0aCBvZiBwYXRocykge1xuICAgIGNvbnN0IHBhcnRzID0gcGFyc2VQYXRoKHBhdGgpXG5cbiAgICBpZiAocGFydHMuaW5jbHVkZXMoJyonKSkge1xuICAgICAgcmVkYWN0V2lsZGNhcmRQYXRoKG9iaiwgcGFydHMsIGNlbnNvciwgcGF0aCwgcmVtb3ZlKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAocmVtb3ZlKSB7XG4gICAgICAgIHJlbW92ZUtleShvYmosIHBhcnRzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR2V0IHZhbHVlIG9ubHkgaWYgcGF0aCBleGlzdHMgLSBzaW5nbGUgdHJhdmVyc2FsXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZ2V0VmFsdWVJZkV4aXN0cyhvYmosIHBhcnRzKVxuICAgICAgICBpZiAodmFsdWUgPT09IFBBVEhfTk9UX0ZPVU5EKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFjdHVhbENlbnNvciA9IHR5cGVvZiBjZW5zb3IgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICA/IGNlbnNvcih2YWx1ZSwgcGFydHMpXG4gICAgICAgICAgOiBjZW5zb3JcbiAgICAgICAgc2V0VmFsdWUob2JqLCBwYXJ0cywgYWN0dWFsQ2Vuc29yKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZWRhY3RXaWxkY2FyZFBhdGggKG9iaiwgcGFydHMsIGNlbnNvciwgb3JpZ2luYWxQYXRoLCByZW1vdmUgPSBmYWxzZSkge1xuICBjb25zdCB3aWxkY2FyZEluZGV4ID0gcGFydHMuaW5kZXhPZignKicpXG5cbiAgaWYgKHdpbGRjYXJkSW5kZXggPT09IHBhcnRzLmxlbmd0aCAtIDEpIHtcbiAgICBjb25zdCBwYXJlbnRQYXJ0cyA9IHBhcnRzLnNsaWNlKDAsIC0xKVxuICAgIGxldCBjdXJyZW50ID0gb2JqXG5cbiAgICBmb3IgKGNvbnN0IHBhcnQgb2YgcGFyZW50UGFydHMpIHtcbiAgICAgIGlmIChjdXJyZW50ID09PSBudWxsIHx8IGN1cnJlbnQgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAvLyBUeXBlIHNhZmV0eTogQ2hlY2sgaWYgY3VycmVudCBpcyBhbiBvYmplY3QgYmVmb3JlIHByb3BlcnR5IGFjY2Vzc1xuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50ICE9PSAnb2JqZWN0JyB8fCBjdXJyZW50ID09PSBudWxsKSByZXR1cm5cbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50W3BhcnRdXG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY3VycmVudCkpIHtcbiAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgLy8gRm9yIGFycmF5cywgc2V0IGFsbCBpdGVtcyB0byB1bmRlZmluZWQgd2hpY2ggd2lsbCBiZSBvbWl0dGVkIGJ5IEpTT04uc3RyaW5naWZ5XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGN1cnJlbnRbaV0gPSB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdXJyZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgaW5kZXhQYXRoID0gWy4uLnBhcmVudFBhcnRzLCBpLnRvU3RyaW5nKCldXG4gICAgICAgICAgY29uc3QgYWN0dWFsQ2Vuc29yID0gdHlwZW9mIGNlbnNvciA9PT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgICAgPyBjZW5zb3IoY3VycmVudFtpXSwgaW5kZXhQYXRoKVxuICAgICAgICAgICAgOiBjZW5zb3JcbiAgICAgICAgICBjdXJyZW50W2ldID0gYWN0dWFsQ2Vuc29yXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjdXJyZW50ID09PSAnb2JqZWN0JyAmJiBjdXJyZW50ICE9PSBudWxsKSB7XG4gICAgICBpZiAocmVtb3ZlKSB7XG4gICAgICAgIC8vIENvbGxlY3Qga2V5cyB0byBkZWxldGUgdG8gYXZvaWQgaXNzdWVzIHdpdGggZGVsZXRpbmcgZHVyaW5nIGl0ZXJhdGlvblxuICAgICAgICBjb25zdCBrZXlzVG9EZWxldGUgPSBbXVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdXJyZW50KSB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjdXJyZW50LCBrZXkpKSB7XG4gICAgICAgICAgICBrZXlzVG9EZWxldGUucHVzaChrZXkpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXNUb0RlbGV0ZSkge1xuICAgICAgICAgIGRlbGV0ZSBjdXJyZW50W2tleV1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY3VycmVudCkge1xuICAgICAgICAgIGNvbnN0IGtleVBhdGggPSBbLi4ucGFyZW50UGFydHMsIGtleV1cbiAgICAgICAgICBjb25zdCBhY3R1YWxDZW5zb3IgPSB0eXBlb2YgY2Vuc29yID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IGNlbnNvcihjdXJyZW50W2tleV0sIGtleVBhdGgpXG4gICAgICAgICAgICA6IGNlbnNvclxuICAgICAgICAgIGN1cnJlbnRba2V5XSA9IGFjdHVhbENlbnNvclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlZGFjdEludGVybWVkaWF0ZVdpbGRjYXJkKG9iaiwgcGFydHMsIGNlbnNvciwgd2lsZGNhcmRJbmRleCwgb3JpZ2luYWxQYXRoLCByZW1vdmUpXG4gIH1cbn1cblxuZnVuY3Rpb24gcmVkYWN0SW50ZXJtZWRpYXRlV2lsZGNhcmQgKG9iaiwgcGFydHMsIGNlbnNvciwgd2lsZGNhcmRJbmRleCwgb3JpZ2luYWxQYXRoLCByZW1vdmUgPSBmYWxzZSkge1xuICBjb25zdCBiZWZvcmVXaWxkY2FyZCA9IHBhcnRzLnNsaWNlKDAsIHdpbGRjYXJkSW5kZXgpXG4gIGNvbnN0IGFmdGVyV2lsZGNhcmQgPSBwYXJ0cy5zbGljZSh3aWxkY2FyZEluZGV4ICsgMSlcbiAgY29uc3QgcGF0aEFycmF5ID0gW10gLy8gQ2FjaGVkIGFycmF5IHRvIGF2b2lkIGFsbG9jYXRpb25zXG5cbiAgZnVuY3Rpb24gdHJhdmVyc2UgKGN1cnJlbnQsIHBhdGhMZW5ndGgpIHtcbiAgICBpZiAocGF0aExlbmd0aCA9PT0gYmVmb3JlV2lsZGNhcmQubGVuZ3RoKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjdXJyZW50KSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBwYXRoQXJyYXlbcGF0aExlbmd0aF0gPSBpLnRvU3RyaW5nKClcbiAgICAgICAgICB0cmF2ZXJzZShjdXJyZW50W2ldLCBwYXRoTGVuZ3RoICsgMSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgY3VycmVudCA9PT0gJ29iamVjdCcgJiYgY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjdXJyZW50KSB7XG4gICAgICAgICAgcGF0aEFycmF5W3BhdGhMZW5ndGhdID0ga2V5XG4gICAgICAgICAgdHJhdmVyc2UoY3VycmVudFtrZXldLCBwYXRoTGVuZ3RoICsgMSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocGF0aExlbmd0aCA8IGJlZm9yZVdpbGRjYXJkLmxlbmd0aCkge1xuICAgICAgY29uc3QgbmV4dEtleSA9IGJlZm9yZVdpbGRjYXJkW3BhdGhMZW5ndGhdXG4gICAgICAvLyBUeXBlIHNhZmV0eTogQ2hlY2sgaWYgY3VycmVudCBpcyBhbiBvYmplY3QgYmVmb3JlIHVzaW5nICdpbicgb3BlcmF0b3JcbiAgICAgIGlmIChjdXJyZW50ICYmIHR5cGVvZiBjdXJyZW50ID09PSAnb2JqZWN0JyAmJiBjdXJyZW50ICE9PSBudWxsICYmIG5leHRLZXkgaW4gY3VycmVudCkge1xuICAgICAgICBwYXRoQXJyYXlbcGF0aExlbmd0aF0gPSBuZXh0S2V5XG4gICAgICAgIHRyYXZlcnNlKGN1cnJlbnRbbmV4dEtleV0sIHBhdGhMZW5ndGggKyAxKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDaGVjayBpZiBhZnRlcldpbGRjYXJkIGNvbnRhaW5zIG1vcmUgd2lsZGNhcmRzXG4gICAgICBpZiAoYWZ0ZXJXaWxkY2FyZC5pbmNsdWRlcygnKicpKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGhhbmRsZSByZW1haW5pbmcgd2lsZGNhcmRzXG4gICAgICAgIC8vIFdyYXAgY2Vuc29yIHRvIHByZXBlbmQgY3VycmVudCBwYXRoIGNvbnRleHRcbiAgICAgICAgY29uc3Qgd3JhcHBlZENlbnNvciA9IHR5cGVvZiBjZW5zb3IgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICA/ICh2YWx1ZSwgcGF0aCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBmdWxsUGF0aCA9IFsuLi5wYXRoQXJyYXkuc2xpY2UoMCwgcGF0aExlbmd0aCksIC4uLnBhdGhdXG4gICAgICAgICAgICAgIHJldHVybiBjZW5zb3IodmFsdWUsIGZ1bGxQYXRoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDogY2Vuc29yXG4gICAgICAgIHJlZGFjdFdpbGRjYXJkUGF0aChjdXJyZW50LCBhZnRlcldpbGRjYXJkLCB3cmFwcGVkQ2Vuc29yLCBvcmlnaW5hbFBhdGgsIHJlbW92ZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIG1vcmUgd2lsZGNhcmRzLCBhcHBseSB0aGUgcmVkYWN0aW9uIGRpcmVjdGx5XG4gICAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgICByZW1vdmVLZXkoY3VycmVudCwgYWZ0ZXJXaWxkY2FyZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBhY3R1YWxDZW5zb3IgPSB0eXBlb2YgY2Vuc29yID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IGNlbnNvcihnZXRWYWx1ZShjdXJyZW50LCBhZnRlcldpbGRjYXJkKSwgWy4uLnBhdGhBcnJheS5zbGljZSgwLCBwYXRoTGVuZ3RoKSwgLi4uYWZ0ZXJXaWxkY2FyZF0pXG4gICAgICAgICAgICA6IGNlbnNvclxuICAgICAgICAgIHNldFZhbHVlKGN1cnJlbnQsIGFmdGVyV2lsZGNhcmQsIGFjdHVhbENlbnNvcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChiZWZvcmVXaWxkY2FyZC5sZW5ndGggPT09IDApIHtcbiAgICB0cmF2ZXJzZShvYmosIDApXG4gIH0gZWxzZSB7XG4gICAgbGV0IGN1cnJlbnQgPSBvYmpcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJlZm9yZVdpbGRjYXJkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBwYXJ0ID0gYmVmb3JlV2lsZGNhcmRbaV1cbiAgICAgIGlmIChjdXJyZW50ID09PSBudWxsIHx8IGN1cnJlbnQgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG4gICAgICAvLyBUeXBlIHNhZmV0eTogQ2hlY2sgaWYgY3VycmVudCBpcyBhbiBvYmplY3QgYmVmb3JlIHByb3BlcnR5IGFjY2Vzc1xuICAgICAgaWYgKHR5cGVvZiBjdXJyZW50ICE9PSAnb2JqZWN0JyB8fCBjdXJyZW50ID09PSBudWxsKSByZXR1cm5cbiAgICAgIGN1cnJlbnQgPSBjdXJyZW50W3BhcnRdXG4gICAgICBwYXRoQXJyYXlbaV0gPSBwYXJ0XG4gICAgfVxuICAgIGlmIChjdXJyZW50ICE9PSBudWxsICYmIGN1cnJlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHJhdmVyc2UoY3VycmVudCwgYmVmb3JlV2lsZGNhcmQubGVuZ3RoKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZFBhdGhTdHJ1Y3R1cmUgKHBhdGhzVG9DbG9uZSkge1xuICBpZiAocGF0aHNUb0Nsb25lLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBudWxsIC8vIE5vIHBhdGhzIHRvIHJlZGFjdFxuICB9XG5cbiAgLy8gUGFyc2UgYWxsIHBhdGhzIGFuZCBvcmdhbml6ZSBieSBkZXB0aFxuICBjb25zdCBwYXRoU3RydWN0dXJlID0gbmV3IE1hcCgpXG4gIGZvciAoY29uc3QgcGF0aCBvZiBwYXRoc1RvQ2xvbmUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHBhcnNlUGF0aChwYXRoKVxuICAgIGxldCBjdXJyZW50ID0gcGF0aFN0cnVjdHVyZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhcnQgPSBwYXJ0c1tpXVxuICAgICAgaWYgKCFjdXJyZW50LmhhcyhwYXJ0KSkge1xuICAgICAgICBjdXJyZW50LnNldChwYXJ0LCBuZXcgTWFwKCkpXG4gICAgICB9XG4gICAgICBjdXJyZW50ID0gY3VycmVudC5nZXQocGFydClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhdGhTdHJ1Y3R1cmVcbn1cblxuZnVuY3Rpb24gc2VsZWN0aXZlQ2xvbmUgKG9iaiwgcGF0aFN0cnVjdHVyZSkge1xuICBpZiAoIXBhdGhTdHJ1Y3R1cmUpIHtcbiAgICByZXR1cm4gb2JqIC8vIE5vIHBhdGhzIHRvIHJlZGFjdCwgcmV0dXJuIG9yaWdpbmFsXG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZVNlbGVjdGl2ZWx5IChzb3VyY2UsIHBhdGhNYXAsIGRlcHRoID0gMCkge1xuICAgIGlmICghcGF0aE1hcCB8fCBwYXRoTWFwLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiBzb3VyY2UgLy8gTm8gbW9yZSBwYXRocyB0byBjbG9uZSwgcmV0dXJuIHJlZmVyZW5jZVxuICAgIH1cblxuICAgIGlmIChzb3VyY2UgPT09IG51bGwgfHwgdHlwZW9mIHNvdXJjZSAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBzb3VyY2VcbiAgICB9XG5cbiAgICBpZiAoc291cmNlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuIG5ldyBEYXRlKHNvdXJjZS5nZXRUaW1lKCkpXG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgY29uc3QgY2xvbmVkID0gW11cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGluZGV4U3RyID0gaS50b1N0cmluZygpXG4gICAgICAgIGlmIChwYXRoTWFwLmhhcyhpbmRleFN0cikgfHwgcGF0aE1hcC5oYXMoJyonKSkge1xuICAgICAgICAgIGNsb25lZFtpXSA9IGNsb25lU2VsZWN0aXZlbHkoc291cmNlW2ldLCBwYXRoTWFwLmdldChpbmRleFN0cikgfHwgcGF0aE1hcC5nZXQoJyonKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbG9uZWRbaV0gPSBzb3VyY2VbaV0gLy8gU2hhcmUgcmVmZXJlbmNlIGZvciBub24tcmVkYWN0ZWQgaXRlbXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNsb25lZFxuICAgIH1cblxuICAgIC8vIEhhbmRsZSBvYmplY3RzXG4gICAgY29uc3QgY2xvbmVkID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc291cmNlKSlcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIGlmIChwYXRoTWFwLmhhcyhrZXkpIHx8IHBhdGhNYXAuaGFzKCcqJykpIHtcbiAgICAgICAgICBjbG9uZWRba2V5XSA9IGNsb25lU2VsZWN0aXZlbHkoc291cmNlW2tleV0sIHBhdGhNYXAuZ2V0KGtleSkgfHwgcGF0aE1hcC5nZXQoJyonKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbG9uZWRba2V5XSA9IHNvdXJjZVtrZXldIC8vIFNoYXJlIHJlZmVyZW5jZSBmb3Igbm9uLXJlZGFjdGVkIHByb3BlcnRpZXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2xvbmVkXG4gIH1cblxuICByZXR1cm4gY2xvbmVTZWxlY3RpdmVseShvYmosIHBhdGhTdHJ1Y3R1cmUpXG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlUGF0aCAocGF0aCkge1xuICBpZiAodHlwZW9mIHBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdQYXRocyBtdXN0IGJlIChub24tZW1wdHkpIHN0cmluZ3MnKVxuICB9XG5cbiAgaWYgKHBhdGggPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHJlZGFjdGlvbiBwYXRoICgpJylcbiAgfVxuXG4gIC8vIENoZWNrIGZvciBkb3VibGUgZG90c1xuICBpZiAocGF0aC5pbmNsdWRlcygnLi4nKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCByZWRhY3Rpb24gcGF0aCAoJHtwYXRofSlgKVxuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGNvbW1hLXNlcGFyYXRlZCBwYXRocyAoaW52YWxpZCBzeW50YXgpXG4gIGlmIChwYXRoLmluY2x1ZGVzKCcsJykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVkYWN0aW9uIHBhdGggKCR7cGF0aH0pYClcbiAgfVxuXG4gIC8vIENoZWNrIGZvciB1bm1hdGNoZWQgYnJhY2tldHNcbiAgbGV0IGJyYWNrZXRDb3VudCA9IDBcbiAgbGV0IGluUXVvdGVzID0gZmFsc2VcbiAgbGV0IHF1b3RlQ2hhciA9ICcnXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hhciA9IHBhdGhbaV1cblxuICAgIGlmICgoY2hhciA9PT0gJ1wiJyB8fCBjaGFyID09PSBcIidcIikgJiYgYnJhY2tldENvdW50ID4gMCkge1xuICAgICAgaWYgKCFpblF1b3Rlcykge1xuICAgICAgICBpblF1b3RlcyA9IHRydWVcbiAgICAgICAgcXVvdGVDaGFyID0gY2hhclxuICAgICAgfSBlbHNlIGlmIChjaGFyID09PSBxdW90ZUNoYXIpIHtcbiAgICAgICAgaW5RdW90ZXMgPSBmYWxzZVxuICAgICAgICBxdW90ZUNoYXIgPSAnJ1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2hhciA9PT0gJ1snICYmICFpblF1b3Rlcykge1xuICAgICAgYnJhY2tldENvdW50KytcbiAgICB9IGVsc2UgaWYgKGNoYXIgPT09ICddJyAmJiAhaW5RdW90ZXMpIHtcbiAgICAgIGJyYWNrZXRDb3VudC0tXG4gICAgICBpZiAoYnJhY2tldENvdW50IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcmVkYWN0aW9uIHBhdGggKCR7cGF0aH0pYClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoYnJhY2tldENvdW50ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJlZGFjdGlvbiBwYXRoICgke3BhdGh9KWApXG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVQYXRocyAocGF0aHMpIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhdGhzKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3BhdGhzIG11c3QgYmUgYW4gYXJyYXknKVxuICB9XG5cbiAgZm9yIChjb25zdCBwYXRoIG9mIHBhdGhzKSB7XG4gICAgdmFsaWRhdGVQYXRoKHBhdGgpXG4gIH1cbn1cblxuZnVuY3Rpb24gc2xvd1JlZGFjdCAob3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IHtcbiAgICBwYXRocyA9IFtdLFxuICAgIGNlbnNvciA9ICdbUkVEQUNURURdJyxcbiAgICBzZXJpYWxpemUgPSBKU09OLnN0cmluZ2lmeSxcbiAgICBzdHJpY3QgPSB0cnVlLFxuICAgIHJlbW92ZSA9IGZhbHNlXG4gIH0gPSBvcHRpb25zXG5cbiAgLy8gVmFsaWRhdGUgcGF0aHMgdXBmcm9udCB0byBtYXRjaCBmYXN0LXJlZGFjdCBiZWhhdmlvclxuICB2YWxpZGF0ZVBhdGhzKHBhdGhzKVxuXG4gIC8vIEJ1aWxkIHBhdGggc3RydWN0dXJlIG9uY2UgZHVyaW5nIHNldHVwLCBub3Qgb24gZXZlcnkgY2FsbFxuICBjb25zdCBwYXRoU3RydWN0dXJlID0gYnVpbGRQYXRoU3RydWN0dXJlKHBhdGhzKVxuXG4gIHJldHVybiBmdW5jdGlvbiByZWRhY3QgKG9iaikge1xuICAgIGlmIChzdHJpY3QgJiYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JykpIHtcbiAgICAgIGlmIChvYmogPT09IG51bGwgfHwgb2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZSA/IHNlcmlhbGl6ZShvYmopIDogb2JqXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZSA/IHNlcmlhbGl6ZShvYmopIDogb2JqXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gT25seSBjbG9uZSBwYXRocyB0aGF0IG5lZWQgcmVkYWN0aW9uXG4gICAgY29uc3QgY2xvbmVkID0gc2VsZWN0aXZlQ2xvbmUob2JqLCBwYXRoU3RydWN0dXJlKVxuICAgIGNvbnN0IG9yaWdpbmFsID0gb2JqIC8vIEtlZXAgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIGZvciByZXN0b3JlXG5cbiAgICBsZXQgYWN0dWFsQ2Vuc29yID0gY2Vuc29yXG4gICAgaWYgKHR5cGVvZiBjZW5zb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFjdHVhbENlbnNvciA9IGNlbnNvclxuICAgIH1cblxuICAgIHJlZGFjdFBhdGhzKGNsb25lZCwgcGF0aHMsIGFjdHVhbENlbnNvciwgcmVtb3ZlKVxuXG4gICAgaWYgKHNlcmlhbGl6ZSA9PT0gZmFsc2UpIHtcbiAgICAgIGNsb25lZC5yZXN0b3JlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZGVlcENsb25lKG9yaWdpbmFsKSAvLyBGdWxsIGNsb25lIG9ubHkgd2hlbiByZXN0b3JlIGlzIGNhbGxlZFxuICAgICAgfVxuICAgICAgcmV0dXJuIGNsb25lZFxuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc2VyaWFsaXplID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gc2VyaWFsaXplKGNsb25lZClcbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoY2xvbmVkKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2xvd1JlZGFjdFxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBzZXRMZXZlbFN5bSA9IFN5bWJvbCgncGluby5zZXRMZXZlbCcpXG5jb25zdCBnZXRMZXZlbFN5bSA9IFN5bWJvbCgncGluby5nZXRMZXZlbCcpXG5jb25zdCBsZXZlbFZhbFN5bSA9IFN5bWJvbCgncGluby5sZXZlbFZhbCcpXG5jb25zdCBsZXZlbENvbXBTeW0gPSBTeW1ib2woJ3Bpbm8ubGV2ZWxDb21wJylcbmNvbnN0IHVzZUxldmVsTGFiZWxzU3ltID0gU3ltYm9sKCdwaW5vLnVzZUxldmVsTGFiZWxzJylcbmNvbnN0IHVzZU9ubHlDdXN0b21MZXZlbHNTeW0gPSBTeW1ib2woJ3Bpbm8udXNlT25seUN1c3RvbUxldmVscycpXG5jb25zdCBtaXhpblN5bSA9IFN5bWJvbCgncGluby5taXhpbicpXG5cbmNvbnN0IGxzQ2FjaGVTeW0gPSBTeW1ib2woJ3Bpbm8ubHNDYWNoZScpXG5jb25zdCBjaGluZGluZ3NTeW0gPSBTeW1ib2woJ3Bpbm8uY2hpbmRpbmdzJylcblxuY29uc3QgYXNKc29uU3ltID0gU3ltYm9sKCdwaW5vLmFzSnNvbicpXG5jb25zdCB3cml0ZVN5bSA9IFN5bWJvbCgncGluby53cml0ZScpXG5jb25zdCByZWRhY3RGbXRTeW0gPSBTeW1ib2woJ3Bpbm8ucmVkYWN0Rm10JylcblxuY29uc3QgdGltZVN5bSA9IFN5bWJvbCgncGluby50aW1lJylcbmNvbnN0IHRpbWVTbGljZUluZGV4U3ltID0gU3ltYm9sKCdwaW5vLnRpbWVTbGljZUluZGV4JylcbmNvbnN0IHN0cmVhbVN5bSA9IFN5bWJvbCgncGluby5zdHJlYW0nKVxuY29uc3Qgc3RyaW5naWZ5U3ltID0gU3ltYm9sKCdwaW5vLnN0cmluZ2lmeScpXG5jb25zdCBzdHJpbmdpZnlTYWZlU3ltID0gU3ltYm9sKCdwaW5vLnN0cmluZ2lmeVNhZmUnKVxuY29uc3Qgc3RyaW5naWZpZXJzU3ltID0gU3ltYm9sKCdwaW5vLnN0cmluZ2lmaWVycycpXG5jb25zdCBlbmRTeW0gPSBTeW1ib2woJ3Bpbm8uZW5kJylcbmNvbnN0IGZvcm1hdE9wdHNTeW0gPSBTeW1ib2woJ3Bpbm8uZm9ybWF0T3B0cycpXG5jb25zdCBtZXNzYWdlS2V5U3ltID0gU3ltYm9sKCdwaW5vLm1lc3NhZ2VLZXknKVxuY29uc3QgZXJyb3JLZXlTeW0gPSBTeW1ib2woJ3Bpbm8uZXJyb3JLZXknKVxuY29uc3QgbmVzdGVkS2V5U3ltID0gU3ltYm9sKCdwaW5vLm5lc3RlZEtleScpXG5jb25zdCBuZXN0ZWRLZXlTdHJTeW0gPSBTeW1ib2woJ3Bpbm8ubmVzdGVkS2V5U3RyJylcbmNvbnN0IG1peGluTWVyZ2VTdHJhdGVneVN5bSA9IFN5bWJvbCgncGluby5taXhpbk1lcmdlU3RyYXRlZ3knKVxuY29uc3QgbXNnUHJlZml4U3ltID0gU3ltYm9sKCdwaW5vLm1zZ1ByZWZpeCcpXG5cbmNvbnN0IHdpbGRjYXJkRmlyc3RTeW0gPSBTeW1ib2woJ3Bpbm8ud2lsZGNhcmRGaXJzdCcpXG5cbi8vIHB1YmxpYyBzeW1ib2xzLCBubyBuZWVkIHRvIHVzZSB0aGUgc2FtZSBwaW5vXG4vLyB2ZXJzaW9uIGZvciB0aGVzZVxuY29uc3Qgc2VyaWFsaXplcnNTeW0gPSBTeW1ib2wuZm9yKCdwaW5vLnNlcmlhbGl6ZXJzJylcbmNvbnN0IGZvcm1hdHRlcnNTeW0gPSBTeW1ib2wuZm9yKCdwaW5vLmZvcm1hdHRlcnMnKVxuY29uc3QgaG9va3NTeW0gPSBTeW1ib2wuZm9yKCdwaW5vLmhvb2tzJylcbmNvbnN0IG5lZWRzTWV0YWRhdGFHc3ltID0gU3ltYm9sLmZvcigncGluby5tZXRhZGF0YScpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXRMZXZlbFN5bSxcbiAgZ2V0TGV2ZWxTeW0sXG4gIGxldmVsVmFsU3ltLFxuICBsZXZlbENvbXBTeW0sXG4gIHVzZUxldmVsTGFiZWxzU3ltLFxuICBtaXhpblN5bSxcbiAgbHNDYWNoZVN5bSxcbiAgY2hpbmRpbmdzU3ltLFxuICBhc0pzb25TeW0sXG4gIHdyaXRlU3ltLFxuICBzZXJpYWxpemVyc1N5bSxcbiAgcmVkYWN0Rm10U3ltLFxuICB0aW1lU3ltLFxuICB0aW1lU2xpY2VJbmRleFN5bSxcbiAgc3RyZWFtU3ltLFxuICBzdHJpbmdpZnlTeW0sXG4gIHN0cmluZ2lmeVNhZmVTeW0sXG4gIHN0cmluZ2lmaWVyc1N5bSxcbiAgZW5kU3ltLFxuICBmb3JtYXRPcHRzU3ltLFxuICBtZXNzYWdlS2V5U3ltLFxuICBlcnJvcktleVN5bSxcbiAgbmVzdGVkS2V5U3ltLFxuICB3aWxkY2FyZEZpcnN0U3ltLFxuICBuZWVkc01ldGFkYXRhR3N5bSxcbiAgdXNlT25seUN1c3RvbUxldmVsc1N5bSxcbiAgZm9ybWF0dGVyc1N5bSxcbiAgaG9va3NTeW0sXG4gIG5lc3RlZEtleVN0clN5bSxcbiAgbWl4aW5NZXJnZVN0cmF0ZWd5U3ltLFxuICBtc2dQcmVmaXhTeW1cbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgUmVkYWN0ID0gcmVxdWlyZSgnQHBpbm9qcy9yZWRhY3QnKVxuY29uc3QgeyByZWRhY3RGbXRTeW0sIHdpbGRjYXJkRmlyc3RTeW0gfSA9IHJlcXVpcmUoJy4vc3ltYm9scycpXG5cbi8vIEN1c3RvbSByeCByZWdleCBlcXVpdmFsZW50IHRvIGZhc3QtcmVkYWN0J3MgcnhcbmNvbnN0IHJ4ID0gL1teLltcXF1dK3xcXFsoW15bXFxdXSo/KVxcXS9nXG5cbmNvbnN0IENFTlNPUiA9ICdbUmVkYWN0ZWRdJ1xuY29uc3Qgc3RyaWN0ID0gZmFsc2UgLy8gVE9ETyBzaG91bGQgdGhpcyBiZSBjb25maWd1cmFibGU/XG5cbmZ1bmN0aW9uIHJlZGFjdGlvbiAob3B0cywgc2VyaWFsaXplKSB7XG4gIGNvbnN0IHsgcGF0aHMsIGNlbnNvciwgcmVtb3ZlIH0gPSBoYW5kbGUob3B0cylcblxuICBjb25zdCBzaGFwZSA9IHBhdGhzLnJlZHVjZSgobywgc3RyKSA9PiB7XG4gICAgcngubGFzdEluZGV4ID0gMFxuICAgIGNvbnN0IGZpcnN0ID0gcnguZXhlYyhzdHIpXG4gICAgY29uc3QgbmV4dCA9IHJ4LmV4ZWMoc3RyKVxuXG4gICAgLy8gbnMgaXMgdGhlIHRvcC1sZXZlbCBwYXRoIHNlZ21lbnQsIGJyYWNrZXRzICsgcXVvdGluZyByZW1vdmVkLlxuICAgIGxldCBucyA9IGZpcnN0WzFdICE9PSB1bmRlZmluZWRcbiAgICAgID8gZmlyc3RbMV0ucmVwbGFjZSgvXig/OlwifCd8YCkoLiopKD86XCJ8J3xgKSQvLCAnJDEnKVxuICAgICAgOiBmaXJzdFswXVxuXG4gICAgaWYgKG5zID09PSAnKicpIHtcbiAgICAgIG5zID0gd2lsZGNhcmRGaXJzdFN5bVxuICAgIH1cblxuICAgIC8vIHRvcCBsZXZlbCBrZXk6XG4gICAgaWYgKG5leHQgPT09IG51bGwpIHtcbiAgICAgIG9bbnNdID0gbnVsbFxuICAgICAgcmV0dXJuIG9cbiAgICB9XG5cbiAgICAvLyBwYXRoIHdpdGggYXQgbGVhc3QgdHdvIHNlZ21lbnRzOlxuICAgIC8vIGlmIG5zIGlzIGFscmVhZHkgcmVkYWN0ZWQgYXQgdGhlIHRvcCBsZXZlbCwgaWdub3JlIGxvd2VyIGxldmVsIHJlZGFjdGlvbnNcbiAgICBpZiAob1tuc10gPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBvXG4gICAgfVxuXG4gICAgY29uc3QgeyBpbmRleCB9ID0gbmV4dFxuICAgIGNvbnN0IG5leHRQYXRoID0gYCR7c3RyLnN1YnN0cihpbmRleCwgc3RyLmxlbmd0aCAtIDEpfWBcblxuICAgIG9bbnNdID0gb1tuc10gfHwgW11cblxuICAgIC8vIHNoYXBlIGlzIGEgbWl4IG9mIHBhdGhzIGJlZ2lubmluZyB3aXRoIGxpdGVyYWwgdmFsdWVzIGFuZCB3aWxkY2FyZFxuICAgIC8vIHBhdGhzIFsgXCJhLmIuY1wiLCBcIiouYi56XCIgXSBzaG91bGQgcmVkdWNlIHRvIGEgc2hhcGUgb2ZcbiAgICAvLyB7IFwiYVwiOiBbIFwiYi5jXCIsIFwiYi56XCIgXSwgKjogWyBcImIuelwiIF0gfVxuICAgIC8vIG5vdGU6IFwiYi56XCIgaXMgaW4gYm90aCBcImFcIiBhbmQgKiBhcnJheXMgYmVjYXVzZSBcImFcIiBtYXRjaGVzIHRoZSB3aWxkY2FyZC5cbiAgICAvLyAoKiBlbnRyeSBoYXMgd2lsZGNhcmRGaXJzdFN5bSBhcyBrZXkpXG4gICAgaWYgKG5zICE9PSB3aWxkY2FyZEZpcnN0U3ltICYmIG9bbnNdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gZmlyc3QgdGltZSBucydzIGdldCBhbGwgJyonIHJlZGFjdGlvbnMgc28gZmFyXG4gICAgICBvW25zXS5wdXNoKC4uLihvW3dpbGRjYXJkRmlyc3RTeW1dIHx8IFtdKSlcbiAgICB9XG5cbiAgICBpZiAobnMgPT09IHdpbGRjYXJkRmlyc3RTeW0pIHtcbiAgICAgIC8vIG5ldyAqIHBhdGggZ2V0cyBhZGRlZCB0byBhbGwgcHJldmlvdXNseSByZWdpc3RlcmVkIGxpdGVyYWwgbnMncy5cbiAgICAgIE9iamVjdC5rZXlzKG8pLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKG9ba10pIHtcbiAgICAgICAgICBvW2tdLnB1c2gobmV4dFBhdGgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgb1tuc10ucHVzaChuZXh0UGF0aClcbiAgICByZXR1cm4gb1xuICB9LCB7fSlcblxuICAvLyB0aGUgcmVkYWN0b3IgYXNzaWduZWQgdG8gdGhlIGZvcm1hdCBzeW1ib2wga2V5XG4gIC8vIHByb3ZpZGVzIHRvcCBsZXZlbCByZWRhY3Rpb24gZm9yIGluc3RhbmNlcyB3aGVyZVxuICAvLyBhbiBvYmplY3QgaXMgaW50ZXJwb2xhdGVkIGludG8gdGhlIG1zZyBzdHJpbmdcbiAgY29uc3QgcmVzdWx0ID0ge1xuICAgIFtyZWRhY3RGbXRTeW1dOiBSZWRhY3QoeyBwYXRocywgY2Vuc29yLCBzZXJpYWxpemUsIHN0cmljdCwgcmVtb3ZlIH0pXG4gIH1cblxuICBjb25zdCB0b3BDZW5zb3IgPSAoLi4uYXJncykgPT4ge1xuICAgIHJldHVybiB0eXBlb2YgY2Vuc29yID09PSAnZnVuY3Rpb24nID8gc2VyaWFsaXplKGNlbnNvciguLi5hcmdzKSkgOiBzZXJpYWxpemUoY2Vuc29yKVxuICB9XG5cbiAgcmV0dXJuIFsuLi5PYmplY3Qua2V5cyhzaGFwZSksIC4uLk9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc2hhcGUpXS5yZWR1Y2UoKG8sIGspID0+IHtcbiAgICAvLyB0b3AgbGV2ZWwga2V5OlxuICAgIGlmIChzaGFwZVtrXSA9PT0gbnVsbCkge1xuICAgICAgb1trXSA9ICh2YWx1ZSkgPT4gdG9wQ2Vuc29yKHZhbHVlLCBba10pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHdyYXBwZWRDZW5zb3IgPSB0eXBlb2YgY2Vuc29yID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gKHZhbHVlLCBwYXRoKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY2Vuc29yKHZhbHVlLCBbaywgLi4ucGF0aF0pXG4gICAgICAgICAgfVxuICAgICAgICA6IGNlbnNvclxuICAgICAgb1trXSA9IFJlZGFjdCh7XG4gICAgICAgIHBhdGhzOiBzaGFwZVtrXSxcbiAgICAgICAgY2Vuc29yOiB3cmFwcGVkQ2Vuc29yLFxuICAgICAgICBzZXJpYWxpemUsXG4gICAgICAgIHN0cmljdCxcbiAgICAgICAgcmVtb3ZlXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gb1xuICB9LCByZXN1bHQpXG59XG5cbmZ1bmN0aW9uIGhhbmRsZSAob3B0cykge1xuICBpZiAoQXJyYXkuaXNBcnJheShvcHRzKSkge1xuICAgIG9wdHMgPSB7IHBhdGhzOiBvcHRzLCBjZW5zb3I6IENFTlNPUiB9XG4gICAgcmV0dXJuIG9wdHNcbiAgfVxuICBsZXQgeyBwYXRocywgY2Vuc29yID0gQ0VOU09SLCByZW1vdmUgfSA9IG9wdHNcbiAgaWYgKEFycmF5LmlzQXJyYXkocGF0aHMpID09PSBmYWxzZSkgeyB0aHJvdyBFcnJvcigncGlubyBcdTIwMTMgcmVkYWN0IG11c3QgY29udGFpbiBhbiBhcnJheSBvZiBzdHJpbmdzJykgfVxuICBpZiAocmVtb3ZlID09PSB0cnVlKSBjZW5zb3IgPSB1bmRlZmluZWRcblxuICByZXR1cm4geyBwYXRocywgY2Vuc29yLCByZW1vdmUgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlZGFjdGlvblxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBudWxsVGltZSA9ICgpID0+ICcnXG5cbmNvbnN0IGVwb2NoVGltZSA9ICgpID0+IGAsXCJ0aW1lXCI6JHtEYXRlLm5vdygpfWBcblxuY29uc3QgdW5peFRpbWUgPSAoKSA9PiBgLFwidGltZVwiOiR7TWF0aC5yb3VuZChEYXRlLm5vdygpIC8gMTAwMC4wKX1gXG5cbmNvbnN0IGlzb1RpbWUgPSAoKSA9PiBgLFwidGltZVwiOlwiJHtuZXcgRGF0ZShEYXRlLm5vdygpKS50b0lTT1N0cmluZygpfVwiYCAvLyB1c2luZyBEYXRlLm5vdygpIGZvciB0ZXN0YWJpbGl0eVxuXG5jb25zdCBOU19QRVJfTVMgPSAxXzAwMF8wMDBuXG5jb25zdCBOU19QRVJfU0VDID0gMV8wMDBfMDAwXzAwMG5cblxuY29uc3Qgc3RhcnRXYWxsVGltZU5zID0gQmlnSW50KERhdGUubm93KCkpICogTlNfUEVSX01TXG5jb25zdCBzdGFydEhyVGltZSA9IHByb2Nlc3MuaHJ0aW1lLmJpZ2ludCgpXG5cbmNvbnN0IGlzb1RpbWVOYW5vID0gKCkgPT4ge1xuICBjb25zdCBlbGFwc2VkTnMgPSBwcm9jZXNzLmhydGltZS5iaWdpbnQoKSAtIHN0YXJ0SHJUaW1lXG4gIGNvbnN0IGN1cnJlbnRUaW1lTnMgPSBzdGFydFdhbGxUaW1lTnMgKyBlbGFwc2VkTnNcblxuICBjb25zdCBzZWNvbmRzU2luY2VFcG9jaCA9IGN1cnJlbnRUaW1lTnMgLyBOU19QRVJfU0VDXG4gIGNvbnN0IG5hbm9zV2l0aGluU2Vjb25kID0gY3VycmVudFRpbWVOcyAlIE5TX1BFUl9TRUNcblxuICBjb25zdCBtc1NpbmNlRXBvY2ggPSBOdW1iZXIoc2Vjb25kc1NpbmNlRXBvY2ggKiAxMDAwbiArIG5hbm9zV2l0aGluU2Vjb25kIC8gMV8wMDBfMDAwbilcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKG1zU2luY2VFcG9jaClcblxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRVVENGdWxsWWVhcigpXG4gIGNvbnN0IG1vbnRoID0gKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKVxuICBjb25zdCBkYXkgPSBkYXRlLmdldFVUQ0RhdGUoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJylcbiAgY29uc3QgaG91cnMgPSBkYXRlLmdldFVUQ0hvdXJzKCkudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpXG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlLmdldFVUQ01pbnV0ZXMoKS50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJylcbiAgY29uc3Qgc2Vjb25kcyA9IGRhdGUuZ2V0VVRDU2Vjb25kcygpLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKVxuXG4gIHJldHVybiBgLFwidGltZVwiOlwiJHt5ZWFyfS0ke21vbnRofS0ke2RheX1UJHtob3Vyc306JHttaW51dGVzfToke3NlY29uZHN9LiR7bmFub3NXaXRoaW5TZWNvbmRcbiAgICAudG9TdHJpbmcoKVxuICAgIC5wYWRTdGFydCg5LCAnMCcpfVpcImBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IG51bGxUaW1lLCBlcG9jaFRpbWUsIHVuaXhUaW1lLCBpc29UaW1lLCBpc29UaW1lTmFubyB9XG4iLCAiJ3VzZSBzdHJpY3QnXG5mdW5jdGlvbiB0cnlTdHJpbmdpZnkgKG8pIHtcbiAgdHJ5IHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG8pIH0gY2F0Y2goZSkgeyByZXR1cm4gJ1wiW0NpcmN1bGFyXVwiJyB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9ybWF0XG5cbmZ1bmN0aW9uIGZvcm1hdChmLCBhcmdzLCBvcHRzKSB7XG4gIHZhciBzcyA9IChvcHRzICYmIG9wdHMuc3RyaW5naWZ5KSB8fCB0cnlTdHJpbmdpZnlcbiAgdmFyIG9mZnNldCA9IDFcbiAgaWYgKHR5cGVvZiBmID09PSAnb2JqZWN0JyAmJiBmICE9PSBudWxsKSB7XG4gICAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoICsgb2Zmc2V0XG4gICAgaWYgKGxlbiA9PT0gMSkgcmV0dXJuIGZcbiAgICB2YXIgb2JqZWN0cyA9IG5ldyBBcnJheShsZW4pXG4gICAgb2JqZWN0c1swXSA9IHNzKGYpXG4gICAgZm9yICh2YXIgaW5kZXggPSAxOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgb2JqZWN0c1tpbmRleF0gPSBzcyhhcmdzW2luZGV4XSlcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpXG4gIH1cbiAgaWYgKHR5cGVvZiBmICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmXG4gIH1cbiAgdmFyIGFyZ0xlbiA9IGFyZ3MubGVuZ3RoXG4gIGlmIChhcmdMZW4gPT09IDApIHJldHVybiBmXG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgYSA9IDEgLSBvZmZzZXRcbiAgdmFyIGxhc3RQb3MgPSAtMVxuICB2YXIgZmxlbiA9IChmICYmIGYubGVuZ3RoKSB8fCAwXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmxlbjspIHtcbiAgICBpZiAoZi5jaGFyQ29kZUF0KGkpID09PSAzNyAmJiBpICsgMSA8IGZsZW4pIHtcbiAgICAgIGxhc3RQb3MgPSBsYXN0UG9zID4gLTEgPyBsYXN0UG9zIDogMFxuICAgICAgc3dpdGNoIChmLmNoYXJDb2RlQXQoaSArIDEpKSB7XG4gICAgICAgIGNhc2UgMTAwOiAvLyAnZCdcbiAgICAgICAgY2FzZSAxMDI6IC8vICdmJ1xuICAgICAgICAgIGlmIChhID49IGFyZ0xlbilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgaWYgKGFyZ3NbYV0gPT0gbnVsbCkgIGJyZWFrXG4gICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKVxuICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSlcbiAgICAgICAgICBzdHIgKz0gTnVtYmVyKGFyZ3NbYV0pXG4gICAgICAgICAgbGFzdFBvcyA9IGkgKyAyXG4gICAgICAgICAgaSsrXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAxMDU6IC8vICdpJ1xuICAgICAgICAgIGlmIChhID49IGFyZ0xlbilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgaWYgKGFyZ3NbYV0gPT0gbnVsbCkgIGJyZWFrXG4gICAgICAgICAgaWYgKGxhc3RQb3MgPCBpKVxuICAgICAgICAgICAgc3RyICs9IGYuc2xpY2UobGFzdFBvcywgaSlcbiAgICAgICAgICBzdHIgKz0gTWF0aC5mbG9vcihOdW1iZXIoYXJnc1thXSkpXG4gICAgICAgICAgbGFzdFBvcyA9IGkgKyAyXG4gICAgICAgICAgaSsrXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA3OTogLy8gJ08nXG4gICAgICAgIGNhc2UgMTExOiAvLyAnbydcbiAgICAgICAgY2FzZSAxMDY6IC8vICdqJ1xuICAgICAgICAgIGlmIChhID49IGFyZ0xlbilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgaWYgKGFyZ3NbYV0gPT09IHVuZGVmaW5lZCkgYnJlYWtcbiAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpXG4gICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKVxuICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGFyZ3NbYV1cbiAgICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHN0ciArPSAnXFwnJyArIGFyZ3NbYV0gKyAnXFwnJ1xuICAgICAgICAgICAgbGFzdFBvcyA9IGkgKyAyXG4gICAgICAgICAgICBpKytcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzdHIgKz0gYXJnc1thXS5uYW1lIHx8ICc8YW5vbnltb3VzPidcbiAgICAgICAgICAgIGxhc3RQb3MgPSBpICsgMlxuICAgICAgICAgICAgaSsrXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdHIgKz0gc3MoYXJnc1thXSlcbiAgICAgICAgICBsYXN0UG9zID0gaSArIDJcbiAgICAgICAgICBpKytcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDExNTogLy8gJ3MnXG4gICAgICAgICAgaWYgKGEgPj0gYXJnTGVuKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpXG4gICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKVxuICAgICAgICAgIHN0ciArPSBTdHJpbmcoYXJnc1thXSlcbiAgICAgICAgICBsYXN0UG9zID0gaSArIDJcbiAgICAgICAgICBpKytcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDM3OiAvLyAnJSdcbiAgICAgICAgICBpZiAobGFzdFBvcyA8IGkpXG4gICAgICAgICAgICBzdHIgKz0gZi5zbGljZShsYXN0UG9zLCBpKVxuICAgICAgICAgIHN0ciArPSAnJSdcbiAgICAgICAgICBsYXN0UG9zID0gaSArIDJcbiAgICAgICAgICBpKytcbiAgICAgICAgICBhLS1cbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgKythXG4gICAgfVxuICAgICsraVxuICB9XG4gIGlmIChsYXN0UG9zID09PSAtMSlcbiAgICByZXR1cm4gZlxuICBlbHNlIGlmIChsYXN0UG9zIDwgZmxlbikge1xuICAgIHN0ciArPSBmLnNsaWNlKGxhc3RQb3MpXG4gIH1cblxuICByZXR1cm4gc3RyXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbi8qIGdsb2JhbCBTaGFyZWRBcnJheUJ1ZmZlciwgQXRvbWljcyAqL1xuXG5pZiAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgQXRvbWljcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgY29uc3QgbmlsID0gbmV3IEludDMyQXJyYXkobmV3IFNoYXJlZEFycmF5QnVmZmVyKDQpKVxuXG4gIGZ1bmN0aW9uIHNsZWVwIChtcykge1xuICAgIC8vIGFsc28gZmlsdGVycyBvdXQgTmFOLCBub24tbnVtYmVyIHR5cGVzLCBpbmNsdWRpbmcgZW1wdHkgc3RyaW5ncywgYnV0IGFsbG93cyBiaWdpbnRzXG4gICAgY29uc3QgdmFsaWQgPSBtcyA+IDAgJiYgbXMgPCBJbmZpbml0eSBcbiAgICBpZiAodmFsaWQgPT09IGZhbHNlKSB7XG4gICAgICBpZiAodHlwZW9mIG1zICE9PSAnbnVtYmVyJyAmJiB0eXBlb2YgbXMgIT09ICdiaWdpbnQnKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcignc2xlZXA6IG1zIG11c3QgYmUgYSBudW1iZXInKVxuICAgICAgfVxuICAgICAgdGhyb3cgUmFuZ2VFcnJvcignc2xlZXA6IG1zIG11c3QgYmUgYSBudW1iZXIgdGhhdCBpcyBncmVhdGVyIHRoYW4gMCBidXQgbGVzcyB0aGFuIEluZmluaXR5JylcbiAgICB9XG5cbiAgICBBdG9taWNzLndhaXQobmlsLCAwLCAwLCBOdW1iZXIobXMpKVxuICB9XG4gIG1vZHVsZS5leHBvcnRzID0gc2xlZXBcbn0gZWxzZSB7XG5cbiAgZnVuY3Rpb24gc2xlZXAgKG1zKSB7XG4gICAgLy8gYWxzbyBmaWx0ZXJzIG91dCBOYU4sIG5vbi1udW1iZXIgdHlwZXMsIGluY2x1ZGluZyBlbXB0eSBzdHJpbmdzLCBidXQgYWxsb3dzIGJpZ2ludHNcbiAgICBjb25zdCB2YWxpZCA9IG1zID4gMCAmJiBtcyA8IEluZmluaXR5IFxuICAgIGlmICh2YWxpZCA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0eXBlb2YgbXMgIT09ICdudW1iZXInICYmIHR5cGVvZiBtcyAhPT0gJ2JpZ2ludCcpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdzbGVlcDogbXMgbXVzdCBiZSBhIG51bWJlcicpXG4gICAgICB9XG4gICAgICB0aHJvdyBSYW5nZUVycm9yKCdzbGVlcDogbXMgbXVzdCBiZSBhIG51bWJlciB0aGF0IGlzIGdyZWF0ZXIgdGhhbiAwIGJ1dCBsZXNzIHRoYW4gSW5maW5pdHknKVxuICAgIH1cbiAgICBjb25zdCB0YXJnZXQgPSBEYXRlLm5vdygpICsgTnVtYmVyKG1zKVxuICAgIHdoaWxlICh0YXJnZXQgPiBEYXRlLm5vdygpKXt9XG4gIH1cblxuICBtb2R1bGUuZXhwb3J0cyA9IHNsZWVwXG5cbn1cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgaW5oZXJpdHMgPSByZXF1aXJlKCd1dGlsJykuaW5oZXJpdHNcbmNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmNvbnN0IHNsZWVwID0gcmVxdWlyZSgnYXRvbWljLXNsZWVwJylcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG5cbmNvbnN0IEJVU1lfV1JJVEVfVElNRU9VVCA9IDEwMFxuY29uc3Qga0VtcHR5QnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKDApXG5cbi8vIDE2IEtCLiBEb24ndCB3cml0ZSBtb3JlIHRoYW4gZG9ja2VyIGJ1ZmZlciBzaXplLlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21vYnkvbW9ieS9ibG9iLzUxM2VjNzM4MzEyNjk5NDdkMzhhNjQ0YzI3OGNlM2NhYzM2NzgzYjIvZGFlbW9uL2xvZ2dlci9jb3BpZXIuZ28jTDEzXG5jb25zdCBNQVhfV1JJVEUgPSAxNiAqIDEwMjRcblxuY29uc3Qga0NvbnRlbnRNb2RlQnVmZmVyID0gJ2J1ZmZlcidcbmNvbnN0IGtDb250ZW50TW9kZVV0ZjggPSAndXRmOCdcblxuY29uc3QgW21ham9yLCBtaW5vcl0gPSAocHJvY2Vzcy52ZXJzaW9ucy5ub2RlIHx8ICcwLjAnKS5zcGxpdCgnLicpLm1hcChOdW1iZXIpXG5jb25zdCBrQ29weUJ1ZmZlciA9IG1ham9yID49IDIyICYmIG1pbm9yID49IDdcblxuZnVuY3Rpb24gb3BlbkZpbGUgKGZpbGUsIHNvbmljKSB7XG4gIHNvbmljLl9vcGVuaW5nID0gdHJ1ZVxuICBzb25pYy5fd3JpdGluZyA9IHRydWVcbiAgc29uaWMuX2FzeW5jRHJhaW5TY2hlZHVsZWQgPSBmYWxzZVxuXG4gIC8vIE5PVEU6ICdlcnJvcicgYW5kICdyZWFkeScgZXZlbnRzIGVtaXR0ZWQgYmVsb3cgb25seSByZWxldmFudCB3aGVuIHNvbmljLnN5bmM9PT1mYWxzZVxuICAvLyBmb3Igc3luYyBtb2RlLCB0aGVyZSBpcyBubyB3YXkgdG8gYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIHJlY2VpdmUgdGhlc2VcblxuICBmdW5jdGlvbiBmaWxlT3BlbmVkIChlcnIsIGZkKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgc29uaWMuX3Jlb3BlbmluZyA9IGZhbHNlXG4gICAgICBzb25pYy5fd3JpdGluZyA9IGZhbHNlXG4gICAgICBzb25pYy5fb3BlbmluZyA9IGZhbHNlXG5cbiAgICAgIGlmIChzb25pYy5zeW5jKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgICAgIGlmIChzb25pYy5saXN0ZW5lckNvdW50KCdlcnJvcicpID4gMCkge1xuICAgICAgICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCByZW9wZW5pbmcgPSBzb25pYy5fcmVvcGVuaW5nXG5cbiAgICBzb25pYy5mZCA9IGZkXG4gICAgc29uaWMuZmlsZSA9IGZpbGVcbiAgICBzb25pYy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgICBzb25pYy5fb3BlbmluZyA9IGZhbHNlXG4gICAgc29uaWMuX3dyaXRpbmcgPSBmYWxzZVxuXG4gICAgaWYgKHNvbmljLnN5bmMpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gc29uaWMuZW1pdCgncmVhZHknKSlcbiAgICB9IGVsc2Uge1xuICAgICAgc29uaWMuZW1pdCgncmVhZHknKVxuICAgIH1cblxuICAgIGlmIChzb25pYy5kZXN0cm95ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKCghc29uaWMuX3dyaXRpbmcgJiYgc29uaWMuX2xlbiA+IHNvbmljLm1pbkxlbmd0aCkgfHwgc29uaWMuX2ZsdXNoUGVuZGluZykge1xuICAgICAgc29uaWMuX2FjdHVhbFdyaXRlKClcbiAgICB9IGVsc2UgaWYgKHJlb3BlbmluZykge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBzb25pYy5lbWl0KCdkcmFpbicpKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGZsYWdzID0gc29uaWMuYXBwZW5kID8gJ2EnIDogJ3cnXG4gIGNvbnN0IG1vZGUgPSBzb25pYy5tb2RlXG5cbiAgaWYgKHNvbmljLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHNvbmljLm1rZGlyKSBmcy5ta2RpclN5bmMocGF0aC5kaXJuYW1lKGZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgICAgY29uc3QgZmQgPSBmcy5vcGVuU3luYyhmaWxlLCBmbGFncywgbW9kZSlcbiAgICAgIGZpbGVPcGVuZWQobnVsbCwgZmQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBmaWxlT3BlbmVkKGVycilcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgfSBlbHNlIGlmIChzb25pYy5ta2Rpcikge1xuICAgIGZzLm1rZGlyKHBhdGguZGlybmFtZShmaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGZpbGVPcGVuZWQoZXJyKVxuICAgICAgZnMub3BlbihmaWxlLCBmbGFncywgbW9kZSwgZmlsZU9wZW5lZClcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGZzLm9wZW4oZmlsZSwgZmxhZ3MsIG1vZGUsIGZpbGVPcGVuZWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gU29uaWNCb29tIChvcHRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb25pY0Jvb20pKSB7XG4gICAgcmV0dXJuIG5ldyBTb25pY0Jvb20ob3B0cylcbiAgfVxuXG4gIGxldCB7IGZkLCBkZXN0LCBtaW5MZW5ndGgsIG1heExlbmd0aCwgbWF4V3JpdGUsIHBlcmlvZGljRmx1c2gsIHN5bmMsIGFwcGVuZCA9IHRydWUsIG1rZGlyLCByZXRyeUVBR0FJTiwgZnN5bmMsIGNvbnRlbnRNb2RlLCBtb2RlIH0gPSBvcHRzIHx8IHt9XG5cbiAgZmQgPSBmZCB8fCBkZXN0XG5cbiAgdGhpcy5fbGVuID0gMFxuICB0aGlzLmZkID0gLTFcbiAgdGhpcy5fYnVmcyA9IFtdXG4gIHRoaXMuX2xlbnMgPSBbXVxuICB0aGlzLl93cml0aW5nID0gZmFsc2VcbiAgdGhpcy5fZW5kaW5nID0gZmFsc2VcbiAgdGhpcy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgdGhpcy5fYXN5bmNEcmFpblNjaGVkdWxlZCA9IGZhbHNlXG4gIHRoaXMuX2ZsdXNoUGVuZGluZyA9IGZhbHNlXG4gIHRoaXMuX2h3bSA9IE1hdGgubWF4KG1pbkxlbmd0aCB8fCAwLCAxNjM4NylcbiAgdGhpcy5maWxlID0gbnVsbFxuICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gIHRoaXMubWluTGVuZ3RoID0gbWluTGVuZ3RoIHx8IDBcbiAgdGhpcy5tYXhMZW5ndGggPSBtYXhMZW5ndGggfHwgMFxuICB0aGlzLm1heFdyaXRlID0gbWF4V3JpdGUgfHwgTUFYX1dSSVRFXG4gIHRoaXMuX3BlcmlvZGljRmx1c2ggPSBwZXJpb2RpY0ZsdXNoIHx8IDBcbiAgdGhpcy5fcGVyaW9kaWNGbHVzaFRpbWVyID0gdW5kZWZpbmVkXG4gIHRoaXMuc3luYyA9IHN5bmMgfHwgZmFsc2VcbiAgdGhpcy53cml0YWJsZSA9IHRydWVcbiAgdGhpcy5fZnN5bmMgPSBmc3luYyB8fCBmYWxzZVxuICB0aGlzLmFwcGVuZCA9IGFwcGVuZCB8fCBmYWxzZVxuICB0aGlzLm1vZGUgPSBtb2RlXG4gIHRoaXMucmV0cnlFQUdBSU4gPSByZXRyeUVBR0FJTiB8fCAoKCkgPT4gdHJ1ZSlcbiAgdGhpcy5ta2RpciA9IG1rZGlyIHx8IGZhbHNlXG5cbiAgbGV0IGZzV3JpdGVTeW5jXG4gIGxldCBmc1dyaXRlXG4gIGlmIChjb250ZW50TW9kZSA9PT0ga0NvbnRlbnRNb2RlQnVmZmVyKSB7XG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9IGtFbXB0eUJ1ZmZlclxuICAgIHRoaXMud3JpdGUgPSB3cml0ZUJ1ZmZlclxuICAgIHRoaXMuZmx1c2ggPSBmbHVzaEJ1ZmZlclxuICAgIHRoaXMuZmx1c2hTeW5jID0gZmx1c2hCdWZmZXJTeW5jXG4gICAgdGhpcy5fYWN0dWFsV3JpdGUgPSBhY3R1YWxXcml0ZUJ1ZmZlclxuICAgIGZzV3JpdGVTeW5jID0gKCkgPT4gZnMud3JpdGVTeW5jKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYpXG4gICAgZnNXcml0ZSA9ICgpID0+IGZzLndyaXRlKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYsIHRoaXMucmVsZWFzZSlcbiAgfSBlbHNlIGlmIChjb250ZW50TW9kZSA9PT0gdW5kZWZpbmVkIHx8IGNvbnRlbnRNb2RlID09PSBrQ29udGVudE1vZGVVdGY4KSB7XG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9ICcnXG4gICAgdGhpcy53cml0ZSA9IHdyaXRlXG4gICAgdGhpcy5mbHVzaCA9IGZsdXNoXG4gICAgdGhpcy5mbHVzaFN5bmMgPSBmbHVzaFN5bmNcbiAgICB0aGlzLl9hY3R1YWxXcml0ZSA9IGFjdHVhbFdyaXRlXG4gICAgZnNXcml0ZVN5bmMgPSAoKSA9PiB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHRoaXMuX3dyaXRpbmdCdWYpKSB7XG4gICAgICAgIHJldHVybiBmcy53cml0ZVN5bmModGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZilcbiAgICAgIH1cbiAgICAgIHJldHVybiBmcy53cml0ZVN5bmModGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgJ3V0ZjgnKVxuICAgIH1cbiAgICBmc1dyaXRlID0gKCkgPT4ge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih0aGlzLl93cml0aW5nQnVmKSkge1xuICAgICAgICByZXR1cm4gZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgdGhpcy5yZWxlYXNlKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZzLndyaXRlKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYsICd1dGY4JywgdGhpcy5yZWxlYXNlKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFNvbmljQm9vbSBzdXBwb3J0cyBcIiR7a0NvbnRlbnRNb2RlVXRmOH1cIiBhbmQgXCIke2tDb250ZW50TW9kZUJ1ZmZlcn1cIiwgYnV0IHBhc3NlZCAke2NvbnRlbnRNb2RlfWApXG4gIH1cblxuICBpZiAodHlwZW9mIGZkID09PSAnbnVtYmVyJykge1xuICAgIHRoaXMuZmQgPSBmZFxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gdGhpcy5lbWl0KCdyZWFkeScpKVxuICB9IGVsc2UgaWYgKHR5cGVvZiBmZCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcGVuRmlsZShmZCwgdGhpcylcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBzdXBwb3J0cyBvbmx5IGZpbGUgZGVzY3JpcHRvcnMgYW5kIGZpbGVzJylcbiAgfVxuICBpZiAodGhpcy5taW5MZW5ndGggPj0gdGhpcy5tYXhXcml0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbWluTGVuZ3RoIHNob3VsZCBiZSBzbWFsbGVyIHRoYW4gbWF4V3JpdGUgKCR7dGhpcy5tYXhXcml0ZX0pYClcbiAgfVxuXG4gIHRoaXMucmVsZWFzZSA9IChlcnIsIG4pID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBpZiAoKGVyci5jb2RlID09PSAnRUFHQUlOJyB8fCBlcnIuY29kZSA9PT0gJ0VCVVNZJykgJiYgdGhpcy5yZXRyeUVBR0FJTihlcnIsIHRoaXMuX3dyaXRpbmdCdWYubGVuZ3RoLCB0aGlzLl9sZW4gLSB0aGlzLl93cml0aW5nQnVmLmxlbmd0aCkpIHtcbiAgICAgICAgaWYgKHRoaXMuc3luYykge1xuICAgICAgICAgIC8vIFRoaXMgZXJyb3IgY29kZSBzaG91bGQgbm90IGhhcHBlbiBpbiBzeW5jIG1vZGUsIGJlY2F1c2UgaXQgaXNcbiAgICAgICAgICAvLyBub3QgdXNpbmcgdGhlIHVuZGVybGluaW5nIG9wZXJhdGluZyBzeXN0ZW0gYXN5bmNocm9ub3VzIGZ1bmN0aW9ucy5cbiAgICAgICAgICAvLyBIb3dldmVyIGl0IGhhcHBlbnMsIGFuZCBzbyB3ZSBoYW5kbGUgaXQuXG4gICAgICAgICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vcGlub2pzL3Bpbm8vaXNzdWVzLzc4M1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzbGVlcChCVVNZX1dSSVRFX1RJTUVPVVQpXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UodW5kZWZpbmVkLCAwKVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTGV0J3MgZ2l2ZSB0aGUgZGVzdGluYXRpb24gc29tZSB0aW1lIHRvIHByb2Nlc3MgdGhlIGNodW5rLlxuICAgICAgICAgIHNldFRpbWVvdXQoZnNXcml0ZSwgQlVTWV9XUklURV9USU1FT1VUKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl93cml0aW5nID0gZmFsc2VcblxuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5lbWl0KCd3cml0ZScsIG4pXG4gICAgY29uc3QgcmVsZWFzZWRCdWZPYmogPSByZWxlYXNlV3JpdGluZ0J1Zih0aGlzLl93cml0aW5nQnVmLCB0aGlzLl9sZW4sIG4pXG4gICAgdGhpcy5fbGVuID0gcmVsZWFzZWRCdWZPYmoubGVuXG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9IHJlbGVhc2VkQnVmT2JqLndyaXRpbmdCdWZcblxuICAgIGlmICh0aGlzLl93cml0aW5nQnVmLmxlbmd0aCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmMpIHtcbiAgICAgICAgZnNXcml0ZSgpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY29uc3QgbiA9IGZzV3JpdGVTeW5jKClcbiAgICAgICAgICBjb25zdCByZWxlYXNlZEJ1Zk9iaiA9IHJlbGVhc2VXcml0aW5nQnVmKHRoaXMuX3dyaXRpbmdCdWYsIHRoaXMuX2xlbiwgbilcbiAgICAgICAgICB0aGlzLl9sZW4gPSByZWxlYXNlZEJ1Zk9iai5sZW5cbiAgICAgICAgICB0aGlzLl93cml0aW5nQnVmID0gcmVsZWFzZWRCdWZPYmoud3JpdGluZ0J1ZlxuICAgICAgICB9IHdoaWxlICh0aGlzLl93cml0aW5nQnVmLmxlbmd0aClcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICB0aGlzLnJlbGVhc2UoZXJyKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZnN5bmMpIHtcbiAgICAgIGZzLmZzeW5jU3luYyh0aGlzLmZkKVxuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IHRoaXMuX2xlblxuICAgIGlmICh0aGlzLl9yZW9wZW5pbmcpIHtcbiAgICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucmVvcGVuKClcbiAgICB9IGVsc2UgaWYgKGxlbiA+IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgICB0aGlzLl9hY3R1YWxXcml0ZSgpXG4gICAgfSBlbHNlIGlmICh0aGlzLl9lbmRpbmcpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHRoaXMuX2FjdHVhbFdyaXRlKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZVxuICAgICAgICBhY3R1YWxDbG9zZSh0aGlzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl93cml0aW5nID0gZmFsc2VcbiAgICAgIGlmICh0aGlzLnN5bmMpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9hc3luY0RyYWluU2NoZWR1bGVkKSB7XG4gICAgICAgICAgdGhpcy5fYXN5bmNEcmFpblNjaGVkdWxlZCA9IHRydWVcbiAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGVtaXREcmFpbiwgdGhpcylcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0KCdkcmFpbicpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy5vbignbmV3TGlzdGVuZXInLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIGlmIChuYW1lID09PSAnZHJhaW4nKSB7XG4gICAgICB0aGlzLl9hc3luY0RyYWluU2NoZWR1bGVkID0gZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgaWYgKHRoaXMuX3BlcmlvZGljRmx1c2ggIT09IDApIHtcbiAgICB0aGlzLl9wZXJpb2RpY0ZsdXNoVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB0aGlzLmZsdXNoKG51bGwpLCB0aGlzLl9wZXJpb2RpY0ZsdXNoKVxuICAgIHRoaXMuX3BlcmlvZGljRmx1c2hUaW1lci51bnJlZigpXG4gIH1cbn1cblxuLyoqXG4gKiBSZWxlYXNlIHRoZSB3cml0aW5nQnVmIGFmdGVyIGZzLndyaXRlIG4gYnl0ZXMgZGF0YVxuICogQHBhcmFtIHtzdHJpbmcgfCBCdWZmZXJ9IHdyaXRpbmdCdWYgLSBjdXJyZW50bHkgd3JpdGluZyBidWZmZXIsIHVzdWFsbHkgYmUgaW5zdGFuY2UuX3dyaXRpbmdCdWYuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuIC0gY3VycmVudGx5IGJ1ZmZlciBsZW5ndGgsIHVzdWFsbHkgYmUgaW5zdGFuY2UuX2xlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gbnVtYmVyIG9mIGJ5dGVzIGZzIGFscmVhZHkgd3JpdHRlblxuICogQHJldHVybnMge3t3cml0aW5nQnVmOiBzdHJpbmcgfCBCdWZmZXIsIGxlbjogbnVtYmVyfX0gcmVsZWFzZWQgd3JpdGluZ0J1ZiBhbmQgbGVuZ3RoXG4gKi9cbmZ1bmN0aW9uIHJlbGVhc2VXcml0aW5nQnVmICh3cml0aW5nQnVmLCBsZW4sIG4pIHtcbiAgaWYgKHR5cGVvZiB3cml0aW5nQnVmID09PSAnc3RyaW5nJykge1xuICAgIHdyaXRpbmdCdWYgPSBCdWZmZXIuZnJvbSh3cml0aW5nQnVmKVxuICB9XG5cbiAgbGVuID0gTWF0aC5tYXgobGVuIC0gbiwgMClcbiAgd3JpdGluZ0J1ZiA9IHdyaXRpbmdCdWYuc3ViYXJyYXkobilcbiAgcmV0dXJuIHsgd3JpdGluZ0J1ZiwgbGVuIH1cbn1cblxuZnVuY3Rpb24gZW1pdERyYWluIChzb25pYykge1xuICBjb25zdCBoYXNMaXN0ZW5lcnMgPSBzb25pYy5saXN0ZW5lckNvdW50KCdkcmFpbicpID4gMFxuICBpZiAoIWhhc0xpc3RlbmVycykgcmV0dXJuXG4gIHNvbmljLl9hc3luY0RyYWluU2NoZWR1bGVkID0gZmFsc2VcbiAgc29uaWMuZW1pdCgnZHJhaW4nKVxufVxuXG5pbmhlcml0cyhTb25pY0Jvb20sIEV2ZW50RW1pdHRlcilcblxuZnVuY3Rpb24gbWVyZ2VCdWYgKGJ1ZnMsIGxlbikge1xuICBpZiAoYnVmcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ga0VtcHR5QnVmZmVyXG4gIH1cblxuICBpZiAoYnVmcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gYnVmc1swXVxuICB9XG5cbiAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoYnVmcywgbGVuKVxufVxuXG5mdW5jdGlvbiB3cml0ZSAoZGF0YSkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgZGF0YSA9ICcnICsgZGF0YVxuICBjb25zdCBkYXRhTGVuID0gQnVmZmVyLmJ5dGVMZW5ndGgoZGF0YSlcbiAgY29uc3QgbGVuID0gdGhpcy5fbGVuICsgZGF0YUxlblxuICBjb25zdCBidWZzID0gdGhpcy5fYnVmc1xuXG4gIGlmICh0aGlzLm1heExlbmd0aCAmJiBsZW4gPiB0aGlzLm1heExlbmd0aCkge1xuICAgIHRoaXMuZW1pdCgnZHJvcCcsIGRhdGEpXG4gICAgcmV0dXJuIHRoaXMuX2xlbiA8IHRoaXMuX2h3bVxuICB9XG5cbiAgaWYgKFxuICAgIGJ1ZnMubGVuZ3RoID09PSAwIHx8XG4gICAgQnVmZmVyLmJ5dGVMZW5ndGgoYnVmc1tidWZzLmxlbmd0aCAtIDFdKSArIGRhdGFMZW4gPiB0aGlzLm1heFdyaXRlXG4gICkge1xuICAgIGJ1ZnMucHVzaChkYXRhKVxuICB9IGVsc2Uge1xuICAgIGJ1ZnNbYnVmcy5sZW5ndGggLSAxXSArPSBkYXRhXG4gIH1cblxuICB0aGlzLl9sZW4gPSBsZW5cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fbGVuID49IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgdGhpcy5fYWN0dWFsV3JpdGUoKVxuICB9XG5cbiAgcmV0dXJuIHRoaXMuX2xlbiA8IHRoaXMuX2h3bVxufVxuXG5mdW5jdGlvbiB3cml0ZUJ1ZmZlciAoZGF0YSkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgY29uc3QgbGVuID0gdGhpcy5fbGVuICsgZGF0YS5sZW5ndGhcbiAgY29uc3QgYnVmcyA9IHRoaXMuX2J1ZnNcbiAgY29uc3QgbGVucyA9IHRoaXMuX2xlbnNcblxuICBpZiAodGhpcy5tYXhMZW5ndGggJiYgbGVuID4gdGhpcy5tYXhMZW5ndGgpIHtcbiAgICB0aGlzLmVtaXQoJ2Ryb3AnLCBkYXRhKVxuICAgIHJldHVybiB0aGlzLl9sZW4gPCB0aGlzLl9od21cbiAgfVxuXG4gIGlmIChcbiAgICBidWZzLmxlbmd0aCA9PT0gMCB8fFxuICAgIGxlbnNbbGVucy5sZW5ndGggLSAxXSArIGRhdGEubGVuZ3RoID4gdGhpcy5tYXhXcml0ZVxuICApIHtcbiAgICBidWZzLnB1c2goW2RhdGFdKVxuICAgIGxlbnMucHVzaChkYXRhLmxlbmd0aClcbiAgfSBlbHNlIHtcbiAgICBidWZzW2J1ZnMubGVuZ3RoIC0gMV0ucHVzaChkYXRhKVxuICAgIGxlbnNbbGVucy5sZW5ndGggLSAxXSArPSBkYXRhLmxlbmd0aFxuICB9XG5cbiAgdGhpcy5fbGVuID0gbGVuXG5cbiAgaWYgKCF0aGlzLl93cml0aW5nICYmIHRoaXMuX2xlbiA+PSB0aGlzLm1pbkxlbmd0aCkge1xuICAgIHRoaXMuX2FjdHVhbFdyaXRlKClcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9sZW4gPCB0aGlzLl9od21cbn1cblxuZnVuY3Rpb24gY2FsbEZsdXNoQ2FsbGJhY2tPbkRyYWluIChjYikge1xuICB0aGlzLl9mbHVzaFBlbmRpbmcgPSB0cnVlXG4gIGNvbnN0IG9uRHJhaW4gPSAoKSA9PiB7XG4gICAgLy8gb25seSBpZiBfZnN5bmMgaXMgZmFsc2UgdG8gYXZvaWQgZG91YmxlIGZzeW5jXG4gICAgaWYgKCF0aGlzLl9mc3luYykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZnMuZnN5bmModGhpcy5mZCwgKGVycikgPT4ge1xuICAgICAgICAgIHRoaXMuX2ZsdXNoUGVuZGluZyA9IGZhbHNlXG4gICAgICAgICAgY2IoZXJyKVxuICAgICAgICB9KVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNiKGVycilcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZmx1c2hQZW5kaW5nID0gZmFsc2VcbiAgICAgIGNiKClcbiAgICB9XG4gICAgdGhpcy5vZmYoJ2Vycm9yJywgb25FcnJvcilcbiAgfVxuICBjb25zdCBvbkVycm9yID0gKGVycikgPT4ge1xuICAgIHRoaXMuX2ZsdXNoUGVuZGluZyA9IGZhbHNlXG4gICAgY2IoZXJyKVxuICAgIHRoaXMub2ZmKCdkcmFpbicsIG9uRHJhaW4pXG4gIH1cblxuICB0aGlzLm9uY2UoJ2RyYWluJywgb25EcmFpbilcbiAgdGhpcy5vbmNlKCdlcnJvcicsIG9uRXJyb3IpXG59XG5cbmZ1bmN0aW9uIGZsdXNoIChjYikge1xuICBpZiAoY2IgIT0gbnVsbCAmJiB0eXBlb2YgY2IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2ZsdXNoIGNiIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gIH1cblxuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gICAgaWYgKGNiKSB7XG4gICAgICBjYihlcnJvcilcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRocm93IGVycm9yXG4gIH1cblxuICBpZiAodGhpcy5taW5MZW5ndGggPD0gMCkge1xuICAgIGNiPy4oKVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKGNiKSB7XG4gICAgY2FsbEZsdXNoQ2FsbGJhY2tPbkRyYWluLmNhbGwodGhpcywgY2IpXG4gIH1cblxuICBpZiAodGhpcy5fd3JpdGluZykge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHRoaXMuX2J1ZnMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5fYnVmcy5wdXNoKCcnKVxuICB9XG5cbiAgdGhpcy5fYWN0dWFsV3JpdGUoKVxufVxuXG5mdW5jdGlvbiBmbHVzaEJ1ZmZlciAoY2IpIHtcbiAgaWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmbHVzaCBjYiBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICB9XG5cbiAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICAgIGlmIChjYikge1xuICAgICAgY2IoZXJyb3IpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aHJvdyBlcnJvclxuICB9XG5cbiAgaWYgKHRoaXMubWluTGVuZ3RoIDw9IDApIHtcbiAgICBjYj8uKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChjYikge1xuICAgIGNhbGxGbHVzaENhbGxiYWNrT25EcmFpbi5jYWxsKHRoaXMsIGNiKVxuICB9XG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9idWZzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2J1ZnMucHVzaChbXSlcbiAgICB0aGlzLl9sZW5zLnB1c2goMClcbiAgfVxuXG4gIHRoaXMuX2FjdHVhbFdyaXRlKClcbn1cblxuU29uaWNCb29tLnByb3RvdHlwZS5yZW9wZW4gPSBmdW5jdGlvbiAoZmlsZSkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgaWYgKHRoaXMuX29wZW5pbmcpIHtcbiAgICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy5yZW9wZW4oZmlsZSlcbiAgICB9KVxuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKHRoaXMuX2VuZGluZykge1xuICAgIHJldHVyblxuICB9XG5cbiAgaWYgKCF0aGlzLmZpbGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byByZW9wZW4gYSBmaWxlIGRlc2NyaXB0b3IsIHlvdSBtdXN0IHBhc3MgYSBmaWxlIHRvIFNvbmljQm9vbScpXG4gIH1cblxuICBpZiAoZmlsZSkge1xuICAgIHRoaXMuZmlsZSA9IGZpbGVcbiAgfVxuICB0aGlzLl9yZW9wZW5pbmcgPSB0cnVlXG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGNvbnN0IGZkID0gdGhpcy5mZFxuICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgIGlmIChmZCAhPT0gdGhpcy5mZCkge1xuICAgICAgZnMuY2xvc2UoZmQsIChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2Vycm9yJywgZXJyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICBvcGVuRmlsZSh0aGlzLmZpbGUsIHRoaXMpXG59XG5cblNvbmljQm9vbS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgaWYgKHRoaXMuX29wZW5pbmcpIHtcbiAgICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy5lbmQoKVxuICAgIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLl9lbmRpbmcgPSB0cnVlXG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9sZW4gPiAwICYmIHRoaXMuZmQgPj0gMCkge1xuICAgIHRoaXMuX2FjdHVhbFdyaXRlKClcbiAgfSBlbHNlIHtcbiAgICBhY3R1YWxDbG9zZSh0aGlzKVxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoU3luYyAoKSB7XG4gIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gIH1cblxuICBpZiAodGhpcy5mZCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvbmljIGJvb20gaXMgbm90IHJlYWR5IHlldCcpXG4gIH1cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fd3JpdGluZ0J1Zi5sZW5ndGggPiAwKSB7XG4gICAgdGhpcy5fYnVmcy51bnNoaWZ0KHRoaXMuX3dyaXRpbmdCdWYpXG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9ICcnXG4gIH1cblxuICBsZXQgYnVmID0gJydcbiAgd2hpbGUgKHRoaXMuX2J1ZnMubGVuZ3RoIHx8IGJ1Zi5sZW5ndGgpIHtcbiAgICBpZiAoYnVmLmxlbmd0aCA8PSAwKSB7XG4gICAgICBidWYgPSB0aGlzLl9idWZzWzBdXG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBuID0gQnVmZmVyLmlzQnVmZmVyKGJ1ZilcbiAgICAgICAgPyBmcy53cml0ZVN5bmModGhpcy5mZCwgYnVmKVxuICAgICAgICA6IGZzLndyaXRlU3luYyh0aGlzLmZkLCBidWYsICd1dGY4JylcbiAgICAgIGNvbnN0IHJlbGVhc2VkQnVmT2JqID0gcmVsZWFzZVdyaXRpbmdCdWYoYnVmLCB0aGlzLl9sZW4sIG4pXG4gICAgICBidWYgPSByZWxlYXNlZEJ1Zk9iai53cml0aW5nQnVmXG4gICAgICB0aGlzLl9sZW4gPSByZWxlYXNlZEJ1Zk9iai5sZW5cbiAgICAgIGlmIChidWYubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgdGhpcy5fYnVmcy5zaGlmdCgpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zdCBzaG91bGRSZXRyeSA9IGVyci5jb2RlID09PSAnRUFHQUlOJyB8fCBlcnIuY29kZSA9PT0gJ0VCVVNZJ1xuICAgICAgaWYgKHNob3VsZFJldHJ5ICYmICF0aGlzLnJldHJ5RUFHQUlOKGVyciwgYnVmLmxlbmd0aCwgdGhpcy5fbGVuIC0gYnVmLmxlbmd0aCkpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG5cbiAgICAgIHNsZWVwKEJVU1lfV1JJVEVfVElNRU9VVClcbiAgICB9XG4gIH1cblxuICB0cnkge1xuICAgIGZzLmZzeW5jU3luYyh0aGlzLmZkKVxuICB9IGNhdGNoIHtcbiAgICAvLyBTa2lwIHRoZSBlcnJvci4gVGhlIGZkIG1pZ2h0IG5vdCBzdXBwb3J0IGZzeW5jLlxuICB9XG59XG5cbmZ1bmN0aW9uIGZsdXNoQnVmZmVyU3luYyAoKSB7XG4gIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gIH1cblxuICBpZiAodGhpcy5mZCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NvbmljIGJvb20gaXMgbm90IHJlYWR5IHlldCcpXG4gIH1cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fd3JpdGluZ0J1Zi5sZW5ndGggPiAwKSB7XG4gICAgdGhpcy5fYnVmcy51bnNoaWZ0KFt0aGlzLl93cml0aW5nQnVmXSlcbiAgICB0aGlzLl93cml0aW5nQnVmID0ga0VtcHR5QnVmZmVyXG4gIH1cblxuICBsZXQgYnVmID0ga0VtcHR5QnVmZmVyXG4gIHdoaWxlICh0aGlzLl9idWZzLmxlbmd0aCB8fCBidWYubGVuZ3RoKSB7XG4gICAgaWYgKGJ1Zi5sZW5ndGggPD0gMCkge1xuICAgICAgYnVmID0gbWVyZ2VCdWYodGhpcy5fYnVmc1swXSwgdGhpcy5fbGVuc1swXSlcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG4gPSBmcy53cml0ZVN5bmModGhpcy5mZCwgYnVmKVxuICAgICAgYnVmID0gYnVmLnN1YmFycmF5KG4pXG4gICAgICB0aGlzLl9sZW4gPSBNYXRoLm1heCh0aGlzLl9sZW4gLSBuLCAwKVxuICAgICAgaWYgKGJ1Zi5sZW5ndGggPD0gMCkge1xuICAgICAgICB0aGlzLl9idWZzLnNoaWZ0KClcbiAgICAgICAgdGhpcy5fbGVucy5zaGlmdCgpXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zdCBzaG91bGRSZXRyeSA9IGVyci5jb2RlID09PSAnRUFHQUlOJyB8fCBlcnIuY29kZSA9PT0gJ0VCVVNZJ1xuICAgICAgaWYgKHNob3VsZFJldHJ5ICYmICF0aGlzLnJldHJ5RUFHQUlOKGVyciwgYnVmLmxlbmd0aCwgdGhpcy5fbGVuIC0gYnVmLmxlbmd0aCkpIHtcbiAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG5cbiAgICAgIHNsZWVwKEJVU1lfV1JJVEVfVElNRU9VVClcbiAgICB9XG4gIH1cbn1cblxuU29uaWNCb29tLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICBhY3R1YWxDbG9zZSh0aGlzKVxufVxuXG5mdW5jdGlvbiBhY3R1YWxXcml0ZSAoKSB7XG4gIGNvbnN0IHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VcbiAgdGhpcy5fd3JpdGluZyA9IHRydWVcbiAgdGhpcy5fd3JpdGluZ0J1ZiA9IHRoaXMuX3dyaXRpbmdCdWYubGVuZ3RoID8gdGhpcy5fd3JpdGluZ0J1ZiA6IHRoaXMuX2J1ZnMuc2hpZnQoKSB8fCAnJ1xuXG4gIGlmICh0aGlzLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgd3JpdHRlbiA9IEJ1ZmZlci5pc0J1ZmZlcih0aGlzLl93cml0aW5nQnVmKVxuICAgICAgICA/IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmKVxuICAgICAgICA6IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmLCAndXRmOCcpXG4gICAgICByZWxlYXNlKG51bGwsIHdyaXR0ZW4pXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZWxlYXNlKGVycilcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgcmVsZWFzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhY3R1YWxXcml0ZUJ1ZmZlciAoKSB7XG4gIGNvbnN0IHJlbGVhc2UgPSB0aGlzLnJlbGVhc2VcbiAgdGhpcy5fd3JpdGluZyA9IHRydWVcbiAgdGhpcy5fd3JpdGluZ0J1ZiA9IHRoaXMuX3dyaXRpbmdCdWYubGVuZ3RoID8gdGhpcy5fd3JpdGluZ0J1ZiA6IG1lcmdlQnVmKHRoaXMuX2J1ZnMuc2hpZnQoKSwgdGhpcy5fbGVucy5zaGlmdCgpKVxuXG4gIGlmICh0aGlzLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgd3JpdHRlbiA9IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmKVxuICAgICAgcmVsZWFzZShudWxsLCB3cml0dGVuKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmVsZWFzZShlcnIpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIGZzLndyaXRlIHdpbGwgbmVlZCB0byBjb3B5IHN0cmluZyB0byBidWZmZXIgYW55d2F5IHNvXG4gICAgLy8gd2UgZG8gaXQgaGVyZSB0byBhdm9pZCB0aGUgb3ZlcmhlYWQgb2YgY2FsY3VsYXRpbmcgdGhlIGJ1ZmZlciBzaXplXG4gICAgLy8gaW4gcmVsZWFzZVdyaXRpbmdCdWYuXG4gICAgaWYgKGtDb3B5QnVmZmVyKSB7XG4gICAgICB0aGlzLl93cml0aW5nQnVmID0gQnVmZmVyLmZyb20odGhpcy5fd3JpdGluZ0J1ZilcbiAgICB9XG4gICAgZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgcmVsZWFzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhY3R1YWxDbG9zZSAoc29uaWMpIHtcbiAgaWYgKHNvbmljLmZkID09PSAtMSkge1xuICAgIHNvbmljLm9uY2UoJ3JlYWR5JywgYWN0dWFsQ2xvc2UuYmluZChudWxsLCBzb25pYykpXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAoc29uaWMuX3BlcmlvZGljRmx1c2hUaW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgY2xlYXJJbnRlcnZhbChzb25pYy5fcGVyaW9kaWNGbHVzaFRpbWVyKVxuICB9XG5cbiAgc29uaWMuZGVzdHJveWVkID0gdHJ1ZVxuICBzb25pYy5fYnVmcyA9IFtdXG4gIHNvbmljLl9sZW5zID0gW11cblxuICBhc3NlcnQodHlwZW9mIHNvbmljLmZkID09PSAnbnVtYmVyJywgYHNvbmljLmZkIG11c3QgYmUgYSBudW1iZXIsIGdvdCAke3R5cGVvZiBzb25pYy5mZH1gKVxuICB0cnkge1xuICAgIGZzLmZzeW5jKHNvbmljLmZkLCBjbG9zZVdyYXBwZWQpXG4gIH0gY2F0Y2gge1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VXcmFwcGVkICgpIHtcbiAgICAvLyBXZSBza2lwIGVycm9ycyBpbiBmc3luY1xuXG4gICAgaWYgKHNvbmljLmZkICE9PSAxICYmIHNvbmljLmZkICE9PSAyKSB7XG4gICAgICBmcy5jbG9zZShzb25pYy5mZCwgZG9uZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZG9uZSgpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZG9uZSAoZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoc29uaWMuX2VuZGluZyAmJiAhc29uaWMuX3dyaXRpbmcpIHtcbiAgICAgIHNvbmljLmVtaXQoJ2ZpbmlzaCcpXG4gICAgfVxuICAgIHNvbmljLmVtaXQoJ2Nsb3NlJylcbiAgfVxufVxuXG4vKipcbiAqIFRoZXNlIGV4cG9ydCBjb25maWd1cmF0aW9ucyBlbmFibGUgSlMgYW5kIFRTIGRldmVsb3BlcnNcbiAqIHRvIGNvbnN1bWVyIFNvbmljQm9vbSBpbiB3aGF0ZXZlciB3YXkgYmVzdCBzdWl0cyB0aGVpciBuZWVkcy5cbiAqIFNvbWUgZXhhbXBsZXMgb2Ygc3VwcG9ydGVkIGltcG9ydCBzeW50YXggaW5jbHVkZXM6XG4gKiAtIGBjb25zdCBTb25pY0Jvb20gPSByZXF1aXJlKCdTb25pY0Jvb20nKWBcbiAqIC0gYGNvbnN0IHsgU29uaWNCb29tIH0gPSByZXF1aXJlKCdTb25pY0Jvb20nKWBcbiAqIC0gYGltcG9ydCAqIGFzIFNvbmljQm9vbSBmcm9tICdTb25pY0Jvb20nYFxuICogLSBgaW1wb3J0IHsgU29uaWNCb29tIH0gZnJvbSAnU29uaWNCb29tJ2BcbiAqIC0gYGltcG9ydCBTb25pY0Jvb20gZnJvbSAnU29uaWNCb29tJ2BcbiAqL1xuU29uaWNCb29tLlNvbmljQm9vbSA9IFNvbmljQm9vbVxuU29uaWNCb29tLmRlZmF1bHQgPSBTb25pY0Jvb21cbm1vZHVsZS5leHBvcnRzID0gU29uaWNCb29tXG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHJlZnMgPSB7XG4gIGV4aXQ6IFtdLFxuICBiZWZvcmVFeGl0OiBbXVxufVxuY29uc3QgZnVuY3Rpb25zID0ge1xuICBleGl0OiBvbkV4aXQsXG4gIGJlZm9yZUV4aXQ6IG9uQmVmb3JlRXhpdFxufVxuXG5sZXQgcmVnaXN0cnlcblxuZnVuY3Rpb24gZW5zdXJlUmVnaXN0cnkgKCkge1xuICBpZiAocmVnaXN0cnkgPT09IHVuZGVmaW5lZCkge1xuICAgIHJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KGNsZWFyKVxuICB9XG59XG5cbmZ1bmN0aW9uIGluc3RhbGwgKGV2ZW50KSB7XG4gIGlmIChyZWZzW2V2ZW50XS5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBwcm9jZXNzLm9uKGV2ZW50LCBmdW5jdGlvbnNbZXZlbnRdKVxufVxuXG5mdW5jdGlvbiB1bmluc3RhbGwgKGV2ZW50KSB7XG4gIGlmIChyZWZzW2V2ZW50XS5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgZnVuY3Rpb25zW2V2ZW50XSlcbiAgaWYgKHJlZnMuZXhpdC5sZW5ndGggPT09IDAgJiYgcmVmcy5iZWZvcmVFeGl0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJlZ2lzdHJ5ID0gdW5kZWZpbmVkXG4gIH1cbn1cblxuZnVuY3Rpb24gb25FeGl0ICgpIHtcbiAgY2FsbFJlZnMoJ2V4aXQnKVxufVxuXG5mdW5jdGlvbiBvbkJlZm9yZUV4aXQgKCkge1xuICBjYWxsUmVmcygnYmVmb3JlRXhpdCcpXG59XG5cbmZ1bmN0aW9uIGNhbGxSZWZzIChldmVudCkge1xuICBmb3IgKGNvbnN0IHJlZiBvZiByZWZzW2V2ZW50XSkge1xuICAgIGNvbnN0IG9iaiA9IHJlZi5kZXJlZigpXG4gICAgY29uc3QgZm4gPSByZWYuZm5cblxuICAgIC8vIFRoaXMgc2hvdWxkIGFsd2F5cyBoYXBwZW4sIGhvd2V2ZXIgR0MgaXNcbiAgICAvLyB1bmRldGVybWluaXN0aWMgc28gaXQgbWlnaHQgbm90IGhhcHBlbi5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChvYmogIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm4ob2JqLCBldmVudClcbiAgICB9XG4gIH1cbiAgcmVmc1tldmVudF0gPSBbXVxufVxuXG5mdW5jdGlvbiBjbGVhciAocmVmKSB7XG4gIGZvciAoY29uc3QgZXZlbnQgb2YgWydleGl0JywgJ2JlZm9yZUV4aXQnXSkge1xuICAgIGNvbnN0IGluZGV4ID0gcmVmc1tldmVudF0uaW5kZXhPZihyZWYpXG4gICAgcmVmc1tldmVudF0uc3BsaWNlKGluZGV4LCBpbmRleCArIDEpXG4gICAgdW5pbnN0YWxsKGV2ZW50KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9yZWdpc3RlciAoZXZlbnQsIG9iaiwgZm4pIHtcbiAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgb2JqZWN0IGNhblxcJ3QgYmUgdW5kZWZpbmVkJylcbiAgfVxuICBpbnN0YWxsKGV2ZW50KVxuICBjb25zdCByZWYgPSBuZXcgV2Vha1JlZihvYmopXG4gIHJlZi5mbiA9IGZuXG5cbiAgZW5zdXJlUmVnaXN0cnkoKVxuICByZWdpc3RyeS5yZWdpc3RlcihvYmosIHJlZilcbiAgcmVmc1tldmVudF0ucHVzaChyZWYpXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyIChvYmosIGZuKSB7XG4gIF9yZWdpc3RlcignZXhpdCcsIG9iaiwgZm4pXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQmVmb3JlRXhpdCAob2JqLCBmbikge1xuICBfcmVnaXN0ZXIoJ2JlZm9yZUV4aXQnLCBvYmosIGZuKVxufVxuXG5mdW5jdGlvbiB1bnJlZ2lzdGVyIChvYmopIHtcbiAgaWYgKHJlZ2lzdHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICByZWdpc3RyeS51bnJlZ2lzdGVyKG9iailcbiAgZm9yIChjb25zdCBldmVudCBvZiBbJ2V4aXQnLCAnYmVmb3JlRXhpdCddKSB7XG4gICAgcmVmc1tldmVudF0gPSByZWZzW2V2ZW50XS5maWx0ZXIoKHJlZikgPT4ge1xuICAgICAgY29uc3QgX29iaiA9IHJlZi5kZXJlZigpXG4gICAgICByZXR1cm4gX29iaiAmJiBfb2JqICE9PSBvYmpcbiAgICB9KVxuICAgIHVuaW5zdGFsbChldmVudClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcmVnaXN0ZXIsXG4gIHJlZ2lzdGVyQmVmb3JlRXhpdCxcbiAgdW5yZWdpc3RlclxufVxuIiwgIntcbiAgXCJuYW1lXCI6IFwidGhyZWFkLXN0cmVhbVwiLFxuICBcInZlcnNpb25cIjogXCIzLjEuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiQSBzdHJlYW1pbmcgd2F5IHRvIHNlbmQgZGF0YSB0byBhIE5vZGUuanMgV29ya2VyIFRocmVhZFwiLFxuICBcIm1haW5cIjogXCJpbmRleC5qc1wiLFxuICBcInR5cGVzXCI6IFwiaW5kZXguZC50c1wiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJyZWFsLXJlcXVpcmVcIjogXCJeMC4yLjBcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMC4xLjBcIixcbiAgICBcIkB0eXBlcy90YXBcIjogXCJeMTUuMC4wXCIsXG4gICAgXCJAeWFvLXBrZy9wa2dcIjogXCJeNS4xMS41XCIsXG4gICAgXCJkZXNtXCI6IFwiXjEuMy4wXCIsXG4gICAgXCJmYXN0YmVuY2hcIjogXCJeMS4wLjFcIixcbiAgICBcImh1c2t5XCI6IFwiXjkuMC42XCIsXG4gICAgXCJwaW5vLWVsYXN0aWNzZWFyY2hcIjogXCJeOC4wLjBcIixcbiAgICBcInNvbmljLWJvb21cIjogXCJeNC4wLjFcIixcbiAgICBcInN0YW5kYXJkXCI6IFwiXjE3LjAuMFwiLFxuICAgIFwidGFwXCI6IFwiXjE2LjIuMFwiLFxuICAgIFwidHMtbm9kZVwiOiBcIl4xMC44LjBcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4zLjJcIixcbiAgICBcIndoeS1pcy1ub2RlLXJ1bm5pbmdcIjogXCJeMi4yLjJcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJ0c2MgLS1ub0VtaXRcIixcbiAgICBcInRlc3RcIjogXCJzdGFuZGFyZCAmJiBucG0gcnVuIGJ1aWxkICYmIG5wbSBydW4gdHJhbnNwaWxlICYmIHRhcCBcXFwidGVzdC8qKi8qLnRlc3QuKmpzXFxcIiAmJiB0YXAgLS10cyB0ZXN0LyoudGVzdC4qdHNcIixcbiAgICBcInRlc3Q6Y2lcIjogXCJzdGFuZGFyZCAmJiBucG0gcnVuIHRyYW5zcGlsZSAmJiBucG0gcnVuIHRlc3Q6Y2k6anMgJiYgbnBtIHJ1biB0ZXN0OmNpOnRzXCIsXG4gICAgXCJ0ZXN0OmNpOmpzXCI6IFwidGFwIC0tbm8tY2hlY2stY292ZXJhZ2UgLS10aW1lb3V0PTEyMCAtLWNvdmVyYWdlLXJlcG9ydD1sY292b25seSBcXFwidGVzdC8qKi8qLnRlc3QuKmpzXFxcIlwiLFxuICAgIFwidGVzdDpjaTp0c1wiOiBcInRhcCAtLXRzIC0tbm8tY2hlY2stY292ZXJhZ2UgLS1jb3ZlcmFnZS1yZXBvcnQ9bGNvdm9ubHkgXFxcInRlc3QvKiovKi50ZXN0Lip0c1xcXCJcIixcbiAgICBcInRlc3Q6eWFyblwiOiBcIm5wbSBydW4gdHJhbnNwaWxlICYmIHRhcCBcXFwidGVzdC8qKi8qLnRlc3QuanNcXFwiIC0tbm8tY2hlY2stY292ZXJhZ2VcIixcbiAgICBcInRyYW5zcGlsZVwiOiBcInNoIC4vdGVzdC90cy90cmFuc3BpbGUuc2hcIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreSBpbnN0YWxsXCJcbiAgfSxcbiAgXCJzdGFuZGFyZFwiOiB7XG4gICAgXCJpZ25vcmVcIjogW1xuICAgICAgXCJ0ZXN0L3RzLyoqLypcIixcbiAgICAgIFwidGVzdC9zeW50YXgtZXJyb3IubWpzXCJcbiAgICBdXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL21jb2xsaW5hL3RocmVhZC1zdHJlYW0uZ2l0XCJcbiAgfSxcbiAgXCJrZXl3b3Jkc1wiOiBbXG4gICAgXCJ3b3JrZXJcIixcbiAgICBcInRocmVhZFwiLFxuICAgIFwidGhyZWFkc1wiLFxuICAgIFwic3RyZWFtXCJcbiAgXSxcbiAgXCJhdXRob3JcIjogXCJNYXR0ZW8gQ29sbGluYSA8aGVsbG9AbWF0dGVvY29sbGluYS5jb20+XCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL21jb2xsaW5hL3RocmVhZC1zdHJlYW0vaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9tY29sbGluYS90aHJlYWQtc3RyZWFtI3JlYWRtZVwiXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IE1BWF9USU1FT1VUID0gMTAwMFxuXG5mdW5jdGlvbiB3YWl0IChzdGF0ZSwgaW5kZXgsIGV4cGVjdGVkLCB0aW1lb3V0LCBkb25lKSB7XG4gIGNvbnN0IG1heCA9IERhdGUubm93KCkgKyB0aW1lb3V0XG4gIGxldCBjdXJyZW50ID0gQXRvbWljcy5sb2FkKHN0YXRlLCBpbmRleClcbiAgaWYgKGN1cnJlbnQgPT09IGV4cGVjdGVkKSB7XG4gICAgZG9uZShudWxsLCAnb2snKVxuICAgIHJldHVyblxuICB9XG4gIGxldCBwcmlvciA9IGN1cnJlbnRcbiAgY29uc3QgY2hlY2sgPSAoYmFja29mZikgPT4ge1xuICAgIGlmIChEYXRlLm5vdygpID4gbWF4KSB7XG4gICAgICBkb25lKG51bGwsICd0aW1lZC1vdXQnKVxuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgcHJpb3IgPSBjdXJyZW50XG4gICAgICAgIGN1cnJlbnQgPSBBdG9taWNzLmxvYWQoc3RhdGUsIGluZGV4KVxuICAgICAgICBpZiAoY3VycmVudCA9PT0gcHJpb3IpIHtcbiAgICAgICAgICBjaGVjayhiYWNrb2ZmID49IE1BWF9USU1FT1VUID8gTUFYX1RJTUVPVVQgOiBiYWNrb2ZmICogMilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY3VycmVudCA9PT0gZXhwZWN0ZWQpIGRvbmUobnVsbCwgJ29rJylcbiAgICAgICAgICBlbHNlIGRvbmUobnVsbCwgJ25vdC1lcXVhbCcpXG4gICAgICAgIH1cbiAgICAgIH0sIGJhY2tvZmYpXG4gICAgfVxuICB9XG4gIGNoZWNrKDEpXG59XG5cbi8vIGxldCB3YWl0RGlmZkNvdW50ID0gMFxuZnVuY3Rpb24gd2FpdERpZmYgKHN0YXRlLCBpbmRleCwgZXhwZWN0ZWQsIHRpbWVvdXQsIGRvbmUpIHtcbiAgLy8gY29uc3QgaWQgPSB3YWl0RGlmZkNvdW50KytcbiAgLy8gcHJvY2Vzcy5fcmF3RGVidWcoYD4+PiB3YWl0RGlmZiAke2lkfWApXG4gIGNvbnN0IG1heCA9IERhdGUubm93KCkgKyB0aW1lb3V0XG4gIGxldCBjdXJyZW50ID0gQXRvbWljcy5sb2FkKHN0YXRlLCBpbmRleClcbiAgaWYgKGN1cnJlbnQgIT09IGV4cGVjdGVkKSB7XG4gICAgZG9uZShudWxsLCAnb2snKVxuICAgIHJldHVyblxuICB9XG4gIGNvbnN0IGNoZWNrID0gKGJhY2tvZmYpID0+IHtcbiAgICAvLyBwcm9jZXNzLl9yYXdEZWJ1ZyhgJHtpZH0gJHtpbmRleH0gY3VycmVudCAke2N1cnJlbnR9IGV4cGVjdGVkICR7ZXhwZWN0ZWR9YClcbiAgICAvLyBwcm9jZXNzLl9yYXdEZWJ1ZygnJyArIGJhY2tvZmYpXG4gICAgaWYgKERhdGUubm93KCkgPiBtYXgpIHtcbiAgICAgIGRvbmUobnVsbCwgJ3RpbWVkLW91dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjdXJyZW50ID0gQXRvbWljcy5sb2FkKHN0YXRlLCBpbmRleClcbiAgICAgICAgaWYgKGN1cnJlbnQgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgICAgZG9uZShudWxsLCAnb2snKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoZWNrKGJhY2tvZmYgPj0gTUFYX1RJTUVPVVQgPyBNQVhfVElNRU9VVCA6IGJhY2tvZmYgKiAyKVxuICAgICAgICB9XG4gICAgICB9LCBiYWNrb2ZmKVxuICAgIH1cbiAgfVxuICBjaGVjaygxKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHsgd2FpdCwgd2FpdERpZmYgfVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBXUklURV9JTkRFWCA9IDRcbmNvbnN0IFJFQURfSU5ERVggPSA4XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBXUklURV9JTkRFWCxcbiAgUkVBRF9JTkRFWFxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB7IHZlcnNpb24gfSA9IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJylcbmNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgeyBXb3JrZXIgfSA9IHJlcXVpcmUoJ3dvcmtlcl90aHJlYWRzJylcbmNvbnN0IHsgam9pbiB9ID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCB7IHBhdGhUb0ZpbGVVUkwgfSA9IHJlcXVpcmUoJ3VybCcpXG5jb25zdCB7IHdhaXQgfSA9IHJlcXVpcmUoJy4vbGliL3dhaXQnKVxuY29uc3Qge1xuICBXUklURV9JTkRFWCxcbiAgUkVBRF9JTkRFWFxufSA9IHJlcXVpcmUoJy4vbGliL2luZGV4ZXMnKVxuY29uc3QgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJylcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG5cbmNvbnN0IGtJbXBsID0gU3ltYm9sKCdrSW1wbCcpXG5cbi8vIFY4IGxpbWl0IGZvciBzdHJpbmcgc2l6ZVxuY29uc3QgTUFYX1NUUklORyA9IGJ1ZmZlci5jb25zdGFudHMuTUFYX1NUUklOR19MRU5HVEhcblxuY2xhc3MgRmFrZVdlYWtSZWYge1xuICBjb25zdHJ1Y3RvciAodmFsdWUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlXG4gIH1cblxuICBkZXJlZiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlXG4gIH1cbn1cblxuY2xhc3MgRmFrZUZpbmFsaXphdGlvblJlZ2lzdHJ5IHtcbiAgcmVnaXN0ZXIgKCkge31cblxuICB1bnJlZ2lzdGVyICgpIHt9XG59XG5cbi8vIEN1cnJlbnRseSB1c2luZyBGaW5hbGl6YXRpb25SZWdpc3RyeSB3aXRoIGNvZGUgY292ZXJhZ2UgYnJlYWtzIHRoZSB3b3JsZFxuLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzQ5MzQ0XG5jb25zdCBGaW5hbGl6YXRpb25SZWdpc3RyeSA9IHByb2Nlc3MuZW52Lk5PREVfVjhfQ09WRVJBR0UgPyBGYWtlRmluYWxpemF0aW9uUmVnaXN0cnkgOiBnbG9iYWwuRmluYWxpemF0aW9uUmVnaXN0cnkgfHwgRmFrZUZpbmFsaXphdGlvblJlZ2lzdHJ5XG5jb25zdCBXZWFrUmVmID0gcHJvY2Vzcy5lbnYuTk9ERV9WOF9DT1ZFUkFHRSA/IEZha2VXZWFrUmVmIDogZ2xvYmFsLldlYWtSZWYgfHwgRmFrZVdlYWtSZWZcblxuY29uc3QgcmVnaXN0cnkgPSBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkoKHdvcmtlcikgPT4ge1xuICBpZiAod29ya2VyLmV4aXRlZCkge1xuICAgIHJldHVyblxuICB9XG4gIHdvcmtlci50ZXJtaW5hdGUoKVxufSlcblxuZnVuY3Rpb24gY3JlYXRlV29ya2VyIChzdHJlYW0sIG9wdHMpIHtcbiAgY29uc3QgeyBmaWxlbmFtZSwgd29ya2VyRGF0YSB9ID0gb3B0c1xuXG4gIGNvbnN0IGJ1bmRsZXJPdmVycmlkZXMgPSAnX19idW5kbGVyUGF0aHNPdmVycmlkZXMnIGluIGdsb2JhbFRoaXMgPyBnbG9iYWxUaGlzLl9fYnVuZGxlclBhdGhzT3ZlcnJpZGVzIDoge31cbiAgY29uc3QgdG9FeGVjdXRlID0gYnVuZGxlck92ZXJyaWRlc1sndGhyZWFkLXN0cmVhbS13b3JrZXInXSB8fCBqb2luKF9fZGlybmFtZSwgJ2xpYicsICd3b3JrZXIuanMnKVxuXG4gIGNvbnN0IHdvcmtlciA9IG5ldyBXb3JrZXIodG9FeGVjdXRlLCB7XG4gICAgLi4ub3B0cy53b3JrZXJPcHRzLFxuICAgIHRyYWNrVW5tYW5hZ2VkRmRzOiBmYWxzZSxcbiAgICB3b3JrZXJEYXRhOiB7XG4gICAgICBmaWxlbmFtZTogZmlsZW5hbWUuaW5kZXhPZignZmlsZTovLycpID09PSAwXG4gICAgICAgID8gZmlsZW5hbWVcbiAgICAgICAgOiBwYXRoVG9GaWxlVVJMKGZpbGVuYW1lKS5ocmVmLFxuICAgICAgZGF0YUJ1Zjogc3RyZWFtW2tJbXBsXS5kYXRhQnVmLFxuICAgICAgc3RhdGVCdWY6IHN0cmVhbVtrSW1wbF0uc3RhdGVCdWYsXG4gICAgICB3b3JrZXJEYXRhOiB7XG4gICAgICAgICRjb250ZXh0OiB7XG4gICAgICAgICAgdGhyZWFkU3RyZWFtVmVyc2lvbjogdmVyc2lvblxuICAgICAgICB9LFxuICAgICAgICAuLi53b3JrZXJEYXRhXG4gICAgICB9XG4gICAgfVxuICB9KVxuXG4gIC8vIFdlIGtlZXAgYSBzdHJvbmcgcmVmZXJlbmNlIGZvciBub3csXG4gIC8vIHdlIG5lZWQgdG8gc3RhcnQgd3JpdGluZyBmaXJzdFxuICB3b3JrZXIuc3RyZWFtID0gbmV3IEZha2VXZWFrUmVmKHN0cmVhbSlcblxuICB3b3JrZXIub24oJ21lc3NhZ2UnLCBvbldvcmtlck1lc3NhZ2UpXG4gIHdvcmtlci5vbignZXhpdCcsIG9uV29ya2VyRXhpdClcbiAgcmVnaXN0cnkucmVnaXN0ZXIoc3RyZWFtLCB3b3JrZXIpXG5cbiAgcmV0dXJuIHdvcmtlclxufVxuXG5mdW5jdGlvbiBkcmFpbiAoc3RyZWFtKSB7XG4gIGFzc2VydCghc3RyZWFtW2tJbXBsXS5zeW5jKVxuICBpZiAoc3RyZWFtW2tJbXBsXS5uZWVkRHJhaW4pIHtcbiAgICBzdHJlYW1ba0ltcGxdLm5lZWREcmFpbiA9IGZhbHNlXG4gICAgc3RyZWFtLmVtaXQoJ2RyYWluJylcbiAgfVxufVxuXG5mdW5jdGlvbiBuZXh0Rmx1c2ggKHN0cmVhbSkge1xuICBjb25zdCB3cml0ZUluZGV4ID0gQXRvbWljcy5sb2FkKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYKVxuICBsZXQgbGVmdG92ZXIgPSBzdHJlYW1ba0ltcGxdLmRhdGEubGVuZ3RoIC0gd3JpdGVJbmRleFxuXG4gIGlmIChsZWZ0b3ZlciA+IDApIHtcbiAgICBpZiAoc3RyZWFtW2tJbXBsXS5idWYubGVuZ3RoID09PSAwKSB7XG4gICAgICBzdHJlYW1ba0ltcGxdLmZsdXNoaW5nID0gZmFsc2VcblxuICAgICAgaWYgKHN0cmVhbVtrSW1wbF0uZW5kaW5nKSB7XG4gICAgICAgIGVuZChzdHJlYW0pXG4gICAgICB9IGVsc2UgaWYgKHN0cmVhbVtrSW1wbF0ubmVlZERyYWluKSB7XG4gICAgICAgIHByb2Nlc3MubmV4dFRpY2soZHJhaW4sIHN0cmVhbSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgbGV0IHRvV3JpdGUgPSBzdHJlYW1ba0ltcGxdLmJ1Zi5zbGljZSgwLCBsZWZ0b3ZlcilcbiAgICBsZXQgdG9Xcml0ZUJ5dGVzID0gQnVmZmVyLmJ5dGVMZW5ndGgodG9Xcml0ZSlcbiAgICBpZiAodG9Xcml0ZUJ5dGVzIDw9IGxlZnRvdmVyKSB7XG4gICAgICBzdHJlYW1ba0ltcGxdLmJ1ZiA9IHN0cmVhbVtrSW1wbF0uYnVmLnNsaWNlKGxlZnRvdmVyKVxuICAgICAgLy8gcHJvY2Vzcy5fcmF3RGVidWcoJ3dyaXRpbmcgJyArIHRvV3JpdGUubGVuZ3RoKVxuICAgICAgd3JpdGUoc3RyZWFtLCB0b1dyaXRlLCBuZXh0Rmx1c2guYmluZChudWxsLCBzdHJlYW0pKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBtdWx0aS1ieXRlIHV0Zi04XG4gICAgICBzdHJlYW0uZmx1c2goKCkgPT4ge1xuICAgICAgICAvLyBlcnIgaXMgYWxyZWFkeSBoYW5kbGVkIGluIGZsdXNoKClcbiAgICAgICAgaWYgKHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIEF0b21pY3Muc3RvcmUoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgUkVBRF9JTkRFWCwgMClcbiAgICAgICAgQXRvbWljcy5zdG9yZShzdHJlYW1ba0ltcGxdLnN0YXRlLCBXUklURV9JTkRFWCwgMClcblxuICAgICAgICAvLyBGaW5kIGEgdG9Xcml0ZSBsZW5ndGggdGhhdCBmaXRzIHRoZSBidWZmZXJcbiAgICAgICAgLy8gaXQgbXVzdCBleGlzdHMgYXMgdGhlIGJ1ZmZlciBpcyBhdCBsZWFzdCA0IGJ5dGVzIGxlbmd0aFxuICAgICAgICAvLyBhbmQgdGhlIG1heCB1dGYtOCBsZW5ndGggZm9yIGEgY2hhciBpcyA0IGJ5dGVzLlxuICAgICAgICB3aGlsZSAodG9Xcml0ZUJ5dGVzID4gc3RyZWFtW2tJbXBsXS5kYXRhLmxlbmd0aCkge1xuICAgICAgICAgIGxlZnRvdmVyID0gbGVmdG92ZXIgLyAyXG4gICAgICAgICAgdG9Xcml0ZSA9IHN0cmVhbVtrSW1wbF0uYnVmLnNsaWNlKDAsIGxlZnRvdmVyKVxuICAgICAgICAgIHRvV3JpdGVCeXRlcyA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHRvV3JpdGUpXG4gICAgICAgIH1cbiAgICAgICAgc3RyZWFtW2tJbXBsXS5idWYgPSBzdHJlYW1ba0ltcGxdLmJ1Zi5zbGljZShsZWZ0b3ZlcilcbiAgICAgICAgd3JpdGUoc3RyZWFtLCB0b1dyaXRlLCBuZXh0Rmx1c2guYmluZChudWxsLCBzdHJlYW0pKVxuICAgICAgfSlcbiAgICB9XG4gIH0gZWxzZSBpZiAobGVmdG92ZXIgPT09IDApIHtcbiAgICBpZiAod3JpdGVJbmRleCA9PT0gMCAmJiBzdHJlYW1ba0ltcGxdLmJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIHdlIGhhZCBhIGZsdXNoU3luYyBpbiB0aGUgbWVhbndoaWxlXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgc3RyZWFtLmZsdXNoKCgpID0+IHtcbiAgICAgIEF0b21pY3Muc3RvcmUoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgUkVBRF9JTkRFWCwgMClcbiAgICAgIEF0b21pY3Muc3RvcmUoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgV1JJVEVfSU5ERVgsIDApXG4gICAgICBuZXh0Rmx1c2goc3RyZWFtKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgLy8gVGhpcyBzaG91bGQgbmV2ZXIgaGFwcGVuXG4gICAgZGVzdHJveShzdHJlYW0sIG5ldyBFcnJvcignb3ZlcndyaXR0ZW4nKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBvbldvcmtlck1lc3NhZ2UgKG1zZykge1xuICBjb25zdCBzdHJlYW0gPSB0aGlzLnN0cmVhbS5kZXJlZigpXG4gIGlmIChzdHJlYW0gPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuZXhpdGVkID0gdHJ1ZVxuICAgIC8vIFRlcm1pbmF0ZSB0aGUgd29ya2VyLlxuICAgIHRoaXMudGVybWluYXRlKClcbiAgICByZXR1cm5cbiAgfVxuXG4gIHN3aXRjaCAobXNnLmNvZGUpIHtcbiAgICBjYXNlICdSRUFEWSc6XG4gICAgICAvLyBSZXBsYWNlIHRoZSBGYWtlV2Vha1JlZiB3aXRoIGFcbiAgICAgIC8vIHByb3BlciBvbmUuXG4gICAgICB0aGlzLnN0cmVhbSA9IG5ldyBXZWFrUmVmKHN0cmVhbSlcblxuICAgICAgc3RyZWFtLmZsdXNoKCgpID0+IHtcbiAgICAgICAgc3RyZWFtW2tJbXBsXS5yZWFkeSA9IHRydWVcbiAgICAgICAgc3RyZWFtLmVtaXQoJ3JlYWR5JylcbiAgICAgIH0pXG4gICAgICBicmVha1xuICAgIGNhc2UgJ0VSUk9SJzpcbiAgICAgIGRlc3Ryb3koc3RyZWFtLCBtc2cuZXJyKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdFVkVOVCc6XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShtc2cuYXJncykpIHtcbiAgICAgICAgc3RyZWFtLmVtaXQobXNnLm5hbWUsIC4uLm1zZy5hcmdzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyZWFtLmVtaXQobXNnLm5hbWUsIG1zZy5hcmdzKVxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdXQVJOSU5HJzpcbiAgICAgIHByb2Nlc3MuZW1pdFdhcm5pbmcobXNnLmVycilcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIGRlc3Ryb3koc3RyZWFtLCBuZXcgRXJyb3IoJ3RoaXMgc2hvdWxkIG5vdCBoYXBwZW46ICcgKyBtc2cuY29kZSkpXG4gIH1cbn1cblxuZnVuY3Rpb24gb25Xb3JrZXJFeGl0IChjb2RlKSB7XG4gIGNvbnN0IHN0cmVhbSA9IHRoaXMuc3RyZWFtLmRlcmVmKClcbiAgaWYgKHN0cmVhbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gTm90aGluZyB0byBkbywgdGhlIHdvcmtlciBhbHJlYWR5IGV4aXRcbiAgICByZXR1cm5cbiAgfVxuICByZWdpc3RyeS51bnJlZ2lzdGVyKHN0cmVhbSlcbiAgc3RyZWFtLndvcmtlci5leGl0ZWQgPSB0cnVlXG4gIHN0cmVhbS53b3JrZXIub2ZmKCdleGl0Jywgb25Xb3JrZXJFeGl0KVxuICBkZXN0cm95KHN0cmVhbSwgY29kZSAhPT0gMCA/IG5ldyBFcnJvcigndGhlIHdvcmtlciB0aHJlYWQgZXhpdGVkJykgOiBudWxsKVxufVxuXG5jbGFzcyBUaHJlYWRTdHJlYW0gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIoKVxuXG4gICAgaWYgKG9wdHMuYnVmZmVyU2l6ZSA8IDQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYnVmZmVyU2l6ZSBtdXN0IGF0IGxlYXN0IGZpdCBhIDQtYnl0ZSB1dGYtOCBjaGFyJylcbiAgICB9XG5cbiAgICB0aGlzW2tJbXBsXSA9IHt9XG4gICAgdGhpc1trSW1wbF0uc3RhdGVCdWYgPSBuZXcgU2hhcmVkQXJyYXlCdWZmZXIoMTI4KVxuICAgIHRoaXNba0ltcGxdLnN0YXRlID0gbmV3IEludDMyQXJyYXkodGhpc1trSW1wbF0uc3RhdGVCdWYpXG4gICAgdGhpc1trSW1wbF0uZGF0YUJ1ZiA9IG5ldyBTaGFyZWRBcnJheUJ1ZmZlcihvcHRzLmJ1ZmZlclNpemUgfHwgNCAqIDEwMjQgKiAxMDI0KVxuICAgIHRoaXNba0ltcGxdLmRhdGEgPSBCdWZmZXIuZnJvbSh0aGlzW2tJbXBsXS5kYXRhQnVmKVxuICAgIHRoaXNba0ltcGxdLnN5bmMgPSBvcHRzLnN5bmMgfHwgZmFsc2VcbiAgICB0aGlzW2tJbXBsXS5lbmRpbmcgPSBmYWxzZVxuICAgIHRoaXNba0ltcGxdLmVuZGVkID0gZmFsc2VcbiAgICB0aGlzW2tJbXBsXS5uZWVkRHJhaW4gPSBmYWxzZVxuICAgIHRoaXNba0ltcGxdLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpc1trSW1wbF0uZmx1c2hpbmcgPSBmYWxzZVxuICAgIHRoaXNba0ltcGxdLnJlYWR5ID0gZmFsc2VcbiAgICB0aGlzW2tJbXBsXS5maW5pc2hlZCA9IGZhbHNlXG4gICAgdGhpc1trSW1wbF0uZXJyb3JlZCA9IG51bGxcbiAgICB0aGlzW2tJbXBsXS5jbG9zZWQgPSBmYWxzZVxuICAgIHRoaXNba0ltcGxdLmJ1ZiA9ICcnXG5cbiAgICAvLyBUT0RPIChmaXgpOiBNYWtlIHByaXZhdGU/XG4gICAgdGhpcy53b3JrZXIgPSBjcmVhdGVXb3JrZXIodGhpcywgb3B0cykgLy8gVE9ETyAoZml4KTogbWFrZSBwcml2YXRlXG4gICAgdGhpcy5vbignbWVzc2FnZScsIChtZXNzYWdlLCB0cmFuc2Zlckxpc3QpID0+IHtcbiAgICAgIHRoaXMud29ya2VyLnBvc3RNZXNzYWdlKG1lc3NhZ2UsIHRyYW5zZmVyTGlzdClcbiAgICB9KVxuICB9XG5cbiAgd3JpdGUgKGRhdGEpIHtcbiAgICBpZiAodGhpc1trSW1wbF0uZGVzdHJveWVkKSB7XG4gICAgICBlcnJvcih0aGlzLCBuZXcgRXJyb3IoJ3RoZSB3b3JrZXIgaGFzIGV4aXRlZCcpKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXNba0ltcGxdLmVuZGluZykge1xuICAgICAgZXJyb3IodGhpcywgbmV3IEVycm9yKCd0aGUgd29ya2VyIGlzIGVuZGluZycpKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXNba0ltcGxdLmZsdXNoaW5nICYmIHRoaXNba0ltcGxdLmJ1Zi5sZW5ndGggKyBkYXRhLmxlbmd0aCA+PSBNQVhfU1RSSU5HKSB7XG4gICAgICB0cnkge1xuICAgICAgICB3cml0ZVN5bmModGhpcylcbiAgICAgICAgdGhpc1trSW1wbF0uZmx1c2hpbmcgPSB0cnVlXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZGVzdHJveSh0aGlzLCBlcnIpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXNba0ltcGxdLmJ1ZiArPSBkYXRhXG5cbiAgICBpZiAodGhpc1trSW1wbF0uc3luYykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgd3JpdGVTeW5jKHRoaXMpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgZGVzdHJveSh0aGlzLCBlcnIpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpc1trSW1wbF0uZmx1c2hpbmcpIHtcbiAgICAgIHRoaXNba0ltcGxdLmZsdXNoaW5nID0gdHJ1ZVxuICAgICAgc2V0SW1tZWRpYXRlKG5leHRGbHVzaCwgdGhpcylcbiAgICB9XG5cbiAgICB0aGlzW2tJbXBsXS5uZWVkRHJhaW4gPSB0aGlzW2tJbXBsXS5kYXRhLmxlbmd0aCAtIHRoaXNba0ltcGxdLmJ1Zi5sZW5ndGggLSBBdG9taWNzLmxvYWQodGhpc1trSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYKSA8PSAwXG4gICAgcmV0dXJuICF0aGlzW2tJbXBsXS5uZWVkRHJhaW5cbiAgfVxuXG4gIGVuZCAoKSB7XG4gICAgaWYgKHRoaXNba0ltcGxdLmRlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpc1trSW1wbF0uZW5kaW5nID0gdHJ1ZVxuICAgIGVuZCh0aGlzKVxuICB9XG5cbiAgZmx1c2ggKGNiKSB7XG4gICAgaWYgKHRoaXNba0ltcGxdLmRlc3Ryb3llZCkge1xuICAgICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGNiLCBuZXcgRXJyb3IoJ3RoZSB3b3JrZXIgaGFzIGV4aXRlZCcpKVxuICAgICAgfVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVE9ETyB3cml0ZSBhbGwgLmJ1ZlxuICAgIGNvbnN0IHdyaXRlSW5kZXggPSBBdG9taWNzLmxvYWQodGhpc1trSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYKVxuICAgIC8vIHByb2Nlc3MuX3Jhd0RlYnVnKGAoZmx1c2gpIHJlYWRJbmRleCAoJHtBdG9taWNzLmxvYWQodGhpcy5zdGF0ZSwgUkVBRF9JTkRFWCl9KSB3cml0ZUluZGV4ICgke0F0b21pY3MubG9hZCh0aGlzLnN0YXRlLCBXUklURV9JTkRFWCl9KWApXG4gICAgd2FpdCh0aGlzW2tJbXBsXS5zdGF0ZSwgUkVBRF9JTkRFWCwgd3JpdGVJbmRleCwgSW5maW5pdHksIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBkZXN0cm95KHRoaXMsIGVycilcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYiwgZXJyKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmIChyZXMgPT09ICdub3QtZXF1YWwnKSB7XG4gICAgICAgIC8vIFRPRE8gaGFuZGxlIGRlYWRsb2NrXG4gICAgICAgIHRoaXMuZmx1c2goY2IpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjYilcbiAgICB9KVxuICB9XG5cbiAgZmx1c2hTeW5jICgpIHtcbiAgICBpZiAodGhpc1trSW1wbF0uZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB3cml0ZVN5bmModGhpcylcbiAgICBmbHVzaFN5bmModGhpcylcbiAgfVxuXG4gIHVucmVmICgpIHtcbiAgICB0aGlzLndvcmtlci51bnJlZigpXG4gIH1cblxuICByZWYgKCkge1xuICAgIHRoaXMud29ya2VyLnJlZigpXG4gIH1cblxuICBnZXQgcmVhZHkgKCkge1xuICAgIHJldHVybiB0aGlzW2tJbXBsXS5yZWFkeVxuICB9XG5cbiAgZ2V0IGRlc3Ryb3llZCAoKSB7XG4gICAgcmV0dXJuIHRoaXNba0ltcGxdLmRlc3Ryb3llZFxuICB9XG5cbiAgZ2V0IGNsb3NlZCAoKSB7XG4gICAgcmV0dXJuIHRoaXNba0ltcGxdLmNsb3NlZFxuICB9XG5cbiAgZ2V0IHdyaXRhYmxlICgpIHtcbiAgICByZXR1cm4gIXRoaXNba0ltcGxdLmRlc3Ryb3llZCAmJiAhdGhpc1trSW1wbF0uZW5kaW5nXG4gIH1cblxuICBnZXQgd3JpdGFibGVFbmRlZCAoKSB7XG4gICAgcmV0dXJuIHRoaXNba0ltcGxdLmVuZGluZ1xuICB9XG5cbiAgZ2V0IHdyaXRhYmxlRmluaXNoZWQgKCkge1xuICAgIHJldHVybiB0aGlzW2tJbXBsXS5maW5pc2hlZFxuICB9XG5cbiAgZ2V0IHdyaXRhYmxlTmVlZERyYWluICgpIHtcbiAgICByZXR1cm4gdGhpc1trSW1wbF0ubmVlZERyYWluXG4gIH1cblxuICBnZXQgd3JpdGFibGVPYmplY3RNb2RlICgpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGdldCB3cml0YWJsZUVycm9yZWQgKCkge1xuICAgIHJldHVybiB0aGlzW2tJbXBsXS5lcnJvcmVkXG4gIH1cbn1cblxuZnVuY3Rpb24gZXJyb3IgKHN0cmVhbSwgZXJyKSB7XG4gIHNldEltbWVkaWF0ZSgoKSA9PiB7XG4gICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKVxuICB9KVxufVxuXG5mdW5jdGlvbiBkZXN0cm95IChzdHJlYW0sIGVycikge1xuICBpZiAoc3RyZWFtW2tJbXBsXS5kZXN0cm95ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuICBzdHJlYW1ba0ltcGxdLmRlc3Ryb3llZCA9IHRydWVcblxuICBpZiAoZXJyKSB7XG4gICAgc3RyZWFtW2tJbXBsXS5lcnJvcmVkID0gZXJyXG4gICAgZXJyb3Ioc3RyZWFtLCBlcnIpXG4gIH1cblxuICBpZiAoIXN0cmVhbS53b3JrZXIuZXhpdGVkKSB7XG4gICAgc3RyZWFtLndvcmtlci50ZXJtaW5hdGUoKVxuICAgICAgLmNhdGNoKCgpID0+IHt9KVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBzdHJlYW1ba0ltcGxdLmNsb3NlZCA9IHRydWVcbiAgICAgICAgc3RyZWFtLmVtaXQoJ2Nsb3NlJylcbiAgICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgc2V0SW1tZWRpYXRlKCgpID0+IHtcbiAgICAgIHN0cmVhbVtrSW1wbF0uY2xvc2VkID0gdHJ1ZVxuICAgICAgc3RyZWFtLmVtaXQoJ2Nsb3NlJylcbiAgICB9KVxuICB9XG59XG5cbmZ1bmN0aW9uIHdyaXRlIChzdHJlYW0sIGRhdGEsIGNiKSB7XG4gIC8vIGRhdGEgaXMgc21hbGxlciB0aGFuIHRoZSBzaGFyZWQgYnVmZmVyIGxlbmd0aFxuICBjb25zdCBjdXJyZW50ID0gQXRvbWljcy5sb2FkKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYKVxuICBjb25zdCBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChkYXRhKVxuICBzdHJlYW1ba0ltcGxdLmRhdGEud3JpdGUoZGF0YSwgY3VycmVudClcbiAgQXRvbWljcy5zdG9yZShzdHJlYW1ba0ltcGxdLnN0YXRlLCBXUklURV9JTkRFWCwgY3VycmVudCArIGxlbmd0aClcbiAgQXRvbWljcy5ub3RpZnkoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgV1JJVEVfSU5ERVgpXG4gIGNiKClcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gZW5kIChzdHJlYW0pIHtcbiAgaWYgKHN0cmVhbVtrSW1wbF0uZW5kZWQgfHwgIXN0cmVhbVtrSW1wbF0uZW5kaW5nIHx8IHN0cmVhbVtrSW1wbF0uZmx1c2hpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuICBzdHJlYW1ba0ltcGxdLmVuZGVkID0gdHJ1ZVxuXG4gIHRyeSB7XG4gICAgc3RyZWFtLmZsdXNoU3luYygpXG5cbiAgICBsZXQgcmVhZEluZGV4ID0gQXRvbWljcy5sb2FkKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFJFQURfSU5ERVgpXG5cbiAgICAvLyBwcm9jZXNzLl9yYXdEZWJ1Zygnd3JpdGluZyBpbmRleCcpXG4gICAgQXRvbWljcy5zdG9yZShzdHJlYW1ba0ltcGxdLnN0YXRlLCBXUklURV9JTkRFWCwgLTEpXG4gICAgLy8gcHJvY2Vzcy5fcmF3RGVidWcoYChlbmQpIHJlYWRJbmRleCAoJHtBdG9taWNzLmxvYWQoc3RyZWFtLnN0YXRlLCBSRUFEX0lOREVYKX0pIHdyaXRlSW5kZXggKCR7QXRvbWljcy5sb2FkKHN0cmVhbS5zdGF0ZSwgV1JJVEVfSU5ERVgpfSlgKVxuICAgIEF0b21pY3Mubm90aWZ5KHN0cmVhbVtrSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYKVxuXG4gICAgLy8gV2FpdCBmb3IgdGhlIHByb2Nlc3MgdG8gY29tcGxldGVcbiAgICBsZXQgc3BpbnMgPSAwXG4gICAgd2hpbGUgKHJlYWRJbmRleCAhPT0gLTEpIHtcbiAgICAgIC8vIHByb2Nlc3MuX3Jhd0RlYnVnKGByZWFkID0gJHtyZWFkfWApXG4gICAgICBBdG9taWNzLndhaXQoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgUkVBRF9JTkRFWCwgcmVhZEluZGV4LCAxMDAwKVxuICAgICAgcmVhZEluZGV4ID0gQXRvbWljcy5sb2FkKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFJFQURfSU5ERVgpXG5cbiAgICAgIGlmIChyZWFkSW5kZXggPT09IC0yKSB7XG4gICAgICAgIGRlc3Ryb3koc3RyZWFtLCBuZXcgRXJyb3IoJ2VuZCgpIGZhaWxlZCcpKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCsrc3BpbnMgPT09IDEwKSB7XG4gICAgICAgIGRlc3Ryb3koc3RyZWFtLCBuZXcgRXJyb3IoJ2VuZCgpIHRvb2sgdG9vIGxvbmcgKDEwcyknKSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBzdHJlYW1ba0ltcGxdLmZpbmlzaGVkID0gdHJ1ZVxuICAgICAgc3RyZWFtLmVtaXQoJ2ZpbmlzaCcpXG4gICAgfSlcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgZGVzdHJveShzdHJlYW0sIGVycilcbiAgfVxuICAvLyBwcm9jZXNzLl9yYXdEZWJ1ZygnZW5kIGZpbmlzaGVkLi4uJylcbn1cblxuZnVuY3Rpb24gd3JpdGVTeW5jIChzdHJlYW0pIHtcbiAgY29uc3QgY2IgPSAoKSA9PiB7XG4gICAgaWYgKHN0cmVhbVtrSW1wbF0uZW5kaW5nKSB7XG4gICAgICBlbmQoc3RyZWFtKVxuICAgIH0gZWxzZSBpZiAoc3RyZWFtW2tJbXBsXS5uZWVkRHJhaW4pIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZHJhaW4sIHN0cmVhbSlcbiAgICB9XG4gIH1cbiAgc3RyZWFtW2tJbXBsXS5mbHVzaGluZyA9IGZhbHNlXG5cbiAgd2hpbGUgKHN0cmVhbVtrSW1wbF0uYnVmLmxlbmd0aCAhPT0gMCkge1xuICAgIGNvbnN0IHdyaXRlSW5kZXggPSBBdG9taWNzLmxvYWQoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgV1JJVEVfSU5ERVgpXG4gICAgbGV0IGxlZnRvdmVyID0gc3RyZWFtW2tJbXBsXS5kYXRhLmxlbmd0aCAtIHdyaXRlSW5kZXhcbiAgICBpZiAobGVmdG92ZXIgPT09IDApIHtcbiAgICAgIGZsdXNoU3luYyhzdHJlYW0pXG4gICAgICBBdG9taWNzLnN0b3JlKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFJFQURfSU5ERVgsIDApXG4gICAgICBBdG9taWNzLnN0b3JlKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYLCAwKVxuICAgICAgY29udGludWVcbiAgICB9IGVsc2UgaWYgKGxlZnRvdmVyIDwgMCkge1xuICAgICAgLy8gc3RyZWFtIHNob3VsZCBuZXZlciBoYXBwZW5cbiAgICAgIHRocm93IG5ldyBFcnJvcignb3ZlcndyaXR0ZW4nKVxuICAgIH1cblxuICAgIGxldCB0b1dyaXRlID0gc3RyZWFtW2tJbXBsXS5idWYuc2xpY2UoMCwgbGVmdG92ZXIpXG4gICAgbGV0IHRvV3JpdGVCeXRlcyA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHRvV3JpdGUpXG4gICAgaWYgKHRvV3JpdGVCeXRlcyA8PSBsZWZ0b3Zlcikge1xuICAgICAgc3RyZWFtW2tJbXBsXS5idWYgPSBzdHJlYW1ba0ltcGxdLmJ1Zi5zbGljZShsZWZ0b3ZlcilcbiAgICAgIC8vIHByb2Nlc3MuX3Jhd0RlYnVnKCd3cml0aW5nICcgKyB0b1dyaXRlLmxlbmd0aClcbiAgICAgIHdyaXRlKHN0cmVhbSwgdG9Xcml0ZSwgY2IpXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG11bHRpLWJ5dGUgdXRmLThcbiAgICAgIGZsdXNoU3luYyhzdHJlYW0pXG4gICAgICBBdG9taWNzLnN0b3JlKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFJFQURfSU5ERVgsIDApXG4gICAgICBBdG9taWNzLnN0b3JlKHN0cmVhbVtrSW1wbF0uc3RhdGUsIFdSSVRFX0lOREVYLCAwKVxuXG4gICAgICAvLyBGaW5kIGEgdG9Xcml0ZSBsZW5ndGggdGhhdCBmaXRzIHRoZSBidWZmZXJcbiAgICAgIC8vIGl0IG11c3QgZXhpc3RzIGFzIHRoZSBidWZmZXIgaXMgYXQgbGVhc3QgNCBieXRlcyBsZW5ndGhcbiAgICAgIC8vIGFuZCB0aGUgbWF4IHV0Zi04IGxlbmd0aCBmb3IgYSBjaGFyIGlzIDQgYnl0ZXMuXG4gICAgICB3aGlsZSAodG9Xcml0ZUJ5dGVzID4gc3RyZWFtW2tJbXBsXS5idWYubGVuZ3RoKSB7XG4gICAgICAgIGxlZnRvdmVyID0gbGVmdG92ZXIgLyAyXG4gICAgICAgIHRvV3JpdGUgPSBzdHJlYW1ba0ltcGxdLmJ1Zi5zbGljZSgwLCBsZWZ0b3ZlcilcbiAgICAgICAgdG9Xcml0ZUJ5dGVzID0gQnVmZmVyLmJ5dGVMZW5ndGgodG9Xcml0ZSlcbiAgICAgIH1cbiAgICAgIHN0cmVhbVtrSW1wbF0uYnVmID0gc3RyZWFtW2tJbXBsXS5idWYuc2xpY2UobGVmdG92ZXIpXG4gICAgICB3cml0ZShzdHJlYW0sIHRvV3JpdGUsIGNiKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBmbHVzaFN5bmMgKHN0cmVhbSkge1xuICBpZiAoc3RyZWFtW2tJbXBsXS5mbHVzaGluZykge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGZsdXNoIHdoaWxlIGZsdXNoaW5nJylcbiAgfVxuXG4gIC8vIHByb2Nlc3MuX3Jhd0RlYnVnKCdmbHVzaFN5bmMgc3RhcnRlZCcpXG5cbiAgY29uc3Qgd3JpdGVJbmRleCA9IEF0b21pY3MubG9hZChzdHJlYW1ba0ltcGxdLnN0YXRlLCBXUklURV9JTkRFWClcblxuICBsZXQgc3BpbnMgPSAwXG5cbiAgLy8gVE9ETyBoYW5kbGUgZGVhZGxvY2tcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCByZWFkSW5kZXggPSBBdG9taWNzLmxvYWQoc3RyZWFtW2tJbXBsXS5zdGF0ZSwgUkVBRF9JTkRFWClcblxuICAgIGlmIChyZWFkSW5kZXggPT09IC0yKSB7XG4gICAgICB0aHJvdyBFcnJvcignX2ZsdXNoU3luYyBmYWlsZWQnKVxuICAgIH1cblxuICAgIC8vIHByb2Nlc3MuX3Jhd0RlYnVnKGAoZmx1c2hTeW5jKSByZWFkSW5kZXggKCR7cmVhZEluZGV4fSkgd3JpdGVJbmRleCAoJHt3cml0ZUluZGV4fSlgKVxuICAgIGlmIChyZWFkSW5kZXggIT09IHdyaXRlSW5kZXgpIHtcbiAgICAgIC8vIFRPRE8gc3RyZWFtIHRpbWVvdXRzIGZvciBzb21lIHJlYXNvbi5cbiAgICAgIEF0b21pY3Mud2FpdChzdHJlYW1ba0ltcGxdLnN0YXRlLCBSRUFEX0lOREVYLCByZWFkSW5kZXgsIDEwMDApXG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgaWYgKCsrc3BpbnMgPT09IDEwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ19mbHVzaFN5bmMgdG9vayB0b28gbG9uZyAoMTBzKScpXG4gICAgfVxuICB9XG4gIC8vIHByb2Nlc3MuX3Jhd0RlYnVnKCdmbHVzaFN5bmMgZmluaXNoZWQnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRocmVhZFN0cmVhbVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCB7IGNyZWF0ZVJlcXVpcmUgfSA9IHJlcXVpcmUoJ21vZHVsZScpXG5jb25zdCBnZXRDYWxsZXJzID0gcmVxdWlyZSgnLi9jYWxsZXInKVxuY29uc3QgeyBqb2luLCBpc0Fic29sdXRlLCBzZXAgfSA9IHJlcXVpcmUoJ25vZGU6cGF0aCcpXG5jb25zdCBzbGVlcCA9IHJlcXVpcmUoJ2F0b21pYy1zbGVlcCcpXG5jb25zdCBvbkV4aXQgPSByZXF1aXJlKCdvbi1leGl0LWxlYWstZnJlZScpXG5jb25zdCBUaHJlYWRTdHJlYW0gPSByZXF1aXJlKCd0aHJlYWQtc3RyZWFtJylcblxuZnVuY3Rpb24gc2V0dXBPbkV4aXQgKHN0cmVhbSkge1xuICAvLyBUaGlzIGlzIGxlYWsgZnJlZSwgaXQgZG9lcyBub3QgbGVhdmUgZXZlbnQgaGFuZGxlcnNcbiAgb25FeGl0LnJlZ2lzdGVyKHN0cmVhbSwgYXV0b0VuZClcbiAgb25FeGl0LnJlZ2lzdGVyQmVmb3JlRXhpdChzdHJlYW0sIGZsdXNoKVxuXG4gIHN0cmVhbS5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgb25FeGl0LnVucmVnaXN0ZXIoc3RyZWFtKVxuICB9KVxufVxuXG5mdW5jdGlvbiBidWlsZFN0cmVhbSAoZmlsZW5hbWUsIHdvcmtlckRhdGEsIHdvcmtlck9wdHMsIHN5bmMpIHtcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFRocmVhZFN0cmVhbSh7XG4gICAgZmlsZW5hbWUsXG4gICAgd29ya2VyRGF0YSxcbiAgICB3b3JrZXJPcHRzLFxuICAgIHN5bmNcbiAgfSlcblxuICBzdHJlYW0ub24oJ3JlYWR5Jywgb25SZWFkeSlcbiAgc3RyZWFtLm9uKCdjbG9zZScsIGZ1bmN0aW9uICgpIHtcbiAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdleGl0Jywgb25FeGl0KVxuICB9KVxuXG4gIHByb2Nlc3Mub24oJ2V4aXQnLCBvbkV4aXQpXG5cbiAgZnVuY3Rpb24gb25SZWFkeSAoKSB7XG4gICAgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcignZXhpdCcsIG9uRXhpdClcbiAgICBzdHJlYW0udW5yZWYoKVxuXG4gICAgaWYgKHdvcmtlck9wdHMuYXV0b0VuZCAhPT0gZmFsc2UpIHtcbiAgICAgIHNldHVwT25FeGl0KHN0cmVhbSlcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkV4aXQgKCkge1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHN0cmVhbS5jbG9zZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBzdHJlYW0uZmx1c2hTeW5jKClcbiAgICAvLyBBcHBhcmVudGx5IHRoZXJlIGlzIGEgdmVyeSBzcG9yYWRpYyByYWNlIGNvbmRpdGlvblxuICAgIC8vIHRoYXQgaW4gY2VydGFpbiBPUyB3b3VsZCBwcmV2ZW50IHRoZSBtZXNzYWdlcyB0byBiZSBmbHVzaGVkXG4gICAgLy8gYmVjYXVzZSB0aGUgdGhyZWFkIG1pZ2h0IG5vdCBoYXZlIGJlZW4gY3JlYXRlZCBzdGlsbC5cbiAgICAvLyBVbmZvcnR1bmF0ZWx5IHdlIG5lZWQgdG8gc2xlZXAoMTAwKSBpbiB0aGlzIGNhc2UuXG4gICAgc2xlZXAoMTAwKVxuICAgIHN0cmVhbS5lbmQoKVxuICB9XG5cbiAgcmV0dXJuIHN0cmVhbVxufVxuXG5mdW5jdGlvbiBhdXRvRW5kIChzdHJlYW0pIHtcbiAgc3RyZWFtLnJlZigpXG4gIHN0cmVhbS5mbHVzaFN5bmMoKVxuICBzdHJlYW0uZW5kKClcbiAgc3RyZWFtLm9uY2UoJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgIHN0cmVhbS51bnJlZigpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGZsdXNoIChzdHJlYW0pIHtcbiAgc3RyZWFtLmZsdXNoU3luYygpXG59XG5cbmZ1bmN0aW9uIHRyYW5zcG9ydCAoZnVsbE9wdGlvbnMpIHtcbiAgY29uc3QgeyBwaXBlbGluZSwgdGFyZ2V0cywgbGV2ZWxzLCBkZWR1cGUsIHdvcmtlciA9IHt9LCBjYWxsZXIgPSBnZXRDYWxsZXJzKCksIHN5bmMgPSBmYWxzZSB9ID0gZnVsbE9wdGlvbnNcblxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLmZ1bGxPcHRpb25zLm9wdGlvbnNcbiAgfVxuXG4gIC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gIGNvbnN0IGNhbGxlcnMgPSB0eXBlb2YgY2FsbGVyID09PSAnc3RyaW5nJyA/IFtjYWxsZXJdIDogY2FsbGVyXG5cbiAgLy8gVGhpcyB3aWxsIGJlIGV2ZW50dWFsbHkgbW9kaWZpZWQgYnkgYnVuZGxlcnNcbiAgY29uc3QgYnVuZGxlck92ZXJyaWRlcyA9ICdfX2J1bmRsZXJQYXRoc092ZXJyaWRlcycgaW4gZ2xvYmFsVGhpcyA/IGdsb2JhbFRoaXMuX19idW5kbGVyUGF0aHNPdmVycmlkZXMgOiB7fVxuXG4gIGxldCB0YXJnZXQgPSBmdWxsT3B0aW9ucy50YXJnZXRcblxuICBpZiAodGFyZ2V0ICYmIHRhcmdldHMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ29ubHkgb25lIG9mIHRhcmdldCBvciB0YXJnZXRzIGNhbiBiZSBzcGVjaWZpZWQnKVxuICB9XG5cbiAgaWYgKHRhcmdldHMpIHtcbiAgICB0YXJnZXQgPSBidW5kbGVyT3ZlcnJpZGVzWydwaW5vLXdvcmtlciddIHx8IGpvaW4oX19kaXJuYW1lLCAnd29ya2VyLmpzJylcbiAgICBvcHRpb25zLnRhcmdldHMgPSB0YXJnZXRzLmZpbHRlcihkZXN0ID0+IGRlc3QudGFyZ2V0KS5tYXAoKGRlc3QpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRlc3QsXG4gICAgICAgIHRhcmdldDogZml4VGFyZ2V0KGRlc3QudGFyZ2V0KVxuICAgICAgfVxuICAgIH0pXG4gICAgb3B0aW9ucy5waXBlbGluZXMgPSB0YXJnZXRzLmZpbHRlcihkZXN0ID0+IGRlc3QucGlwZWxpbmUpLm1hcCgoZGVzdCkgPT4ge1xuICAgICAgcmV0dXJuIGRlc3QucGlwZWxpbmUubWFwKCh0KSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4udCxcbiAgICAgICAgICBsZXZlbDogZGVzdC5sZXZlbCwgLy8gZHVwbGljYXRlIHRoZSBwaXBlbGluZSBgbGV2ZWxgIHByb3BlcnR5IGRlZmluZWQgaW4gdGhlIHVwcGVyIGxldmVsXG4gICAgICAgICAgdGFyZ2V0OiBmaXhUYXJnZXQodC50YXJnZXQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSBlbHNlIGlmIChwaXBlbGluZSkge1xuICAgIHRhcmdldCA9IGJ1bmRsZXJPdmVycmlkZXNbJ3Bpbm8td29ya2VyJ10gfHwgam9pbihfX2Rpcm5hbWUsICd3b3JrZXIuanMnKVxuICAgIG9wdGlvbnMucGlwZWxpbmVzID0gW3BpcGVsaW5lLm1hcCgoZGVzdCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZGVzdCxcbiAgICAgICAgdGFyZ2V0OiBmaXhUYXJnZXQoZGVzdC50YXJnZXQpXG4gICAgICB9XG4gICAgfSldXG4gIH1cblxuICBpZiAobGV2ZWxzKSB7XG4gICAgb3B0aW9ucy5sZXZlbHMgPSBsZXZlbHNcbiAgfVxuXG4gIGlmIChkZWR1cGUpIHtcbiAgICBvcHRpb25zLmRlZHVwZSA9IGRlZHVwZVxuICB9XG5cbiAgb3B0aW9ucy5waW5vV2lsbFNlbmRDb25maWcgPSB0cnVlXG5cbiAgcmV0dXJuIGJ1aWxkU3RyZWFtKGZpeFRhcmdldCh0YXJnZXQpLCBvcHRpb25zLCB3b3JrZXIsIHN5bmMpXG5cbiAgZnVuY3Rpb24gZml4VGFyZ2V0IChvcmlnaW4pIHtcbiAgICBvcmlnaW4gPSBidW5kbGVyT3ZlcnJpZGVzW29yaWdpbl0gfHwgb3JpZ2luXG5cbiAgICBpZiAoaXNBYnNvbHV0ZShvcmlnaW4pIHx8IG9yaWdpbi5pbmRleE9mKCdmaWxlOi8vJykgPT09IDApIHtcbiAgICAgIHJldHVybiBvcmlnaW5cbiAgICB9XG5cbiAgICBpZiAob3JpZ2luID09PSAncGluby9maWxlJykge1xuICAgICAgcmV0dXJuIGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnZmlsZS5qcycpXG4gICAgfVxuXG4gICAgbGV0IGZpeFRhcmdldFxuXG4gICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBjYWxsZXJzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gZmlsZVBhdGggPT09ICdub2RlOnJlcGwnXG4gICAgICAgICAgPyBwcm9jZXNzLmN3ZCgpICsgc2VwXG4gICAgICAgICAgOiBmaWxlUGF0aFxuXG4gICAgICAgIGZpeFRhcmdldCA9IGNyZWF0ZVJlcXVpcmUoY29udGV4dCkucmVzb2x2ZShvcmlnaW4pXG4gICAgICAgIGJyZWFrXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gU2lsZW50IGNhdGNoXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmaXhUYXJnZXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdW5hYmxlIHRvIGRldGVybWluZSB0cmFuc3BvcnQgdGFyZ2V0IGZvciBcIiR7b3JpZ2lufVwiYClcbiAgICB9XG5cbiAgICByZXR1cm4gZml4VGFyZ2V0XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmFuc3BvcnRcbiIsICIndXNlIHN0cmljdCdcblxuLyogZXNsaW50IG5vLXByb3RvdHlwZS1idWlsdGluczogMCAqL1xuXG5jb25zdCBkaWFnQ2hhbiA9IHJlcXVpcmUoJ25vZGU6ZGlhZ25vc3RpY3NfY2hhbm5lbCcpXG5jb25zdCBmb3JtYXQgPSByZXF1aXJlKCdxdWljay1mb3JtYXQtdW5lc2NhcGVkJylcbmNvbnN0IHsgbWFwSHR0cFJlcXVlc3QsIG1hcEh0dHBSZXNwb25zZSB9ID0gcmVxdWlyZSgncGluby1zdGQtc2VyaWFsaXplcnMnKVxuY29uc3QgU29uaWNCb29tID0gcmVxdWlyZSgnc29uaWMtYm9vbScpXG5jb25zdCBvbkV4aXQgPSByZXF1aXJlKCdvbi1leGl0LWxlYWstZnJlZScpXG5jb25zdCB7XG4gIGxzQ2FjaGVTeW0sXG4gIGNoaW5kaW5nc1N5bSxcbiAgd3JpdGVTeW0sXG4gIHNlcmlhbGl6ZXJzU3ltLFxuICBmb3JtYXRPcHRzU3ltLFxuICBlbmRTeW0sXG4gIHN0cmluZ2lmaWVyc1N5bSxcbiAgc3RyaW5naWZ5U3ltLFxuICBzdHJpbmdpZnlTYWZlU3ltLFxuICB3aWxkY2FyZEZpcnN0U3ltLFxuICBuZXN0ZWRLZXlTeW0sXG4gIGZvcm1hdHRlcnNTeW0sXG4gIG1lc3NhZ2VLZXlTeW0sXG4gIGVycm9yS2V5U3ltLFxuICBuZXN0ZWRLZXlTdHJTeW0sXG4gIG1zZ1ByZWZpeFN5bVxufSA9IHJlcXVpcmUoJy4vc3ltYm9scycpXG5jb25zdCB7IGlzTWFpblRocmVhZCB9ID0gcmVxdWlyZSgnd29ya2VyX3RocmVhZHMnKVxuY29uc3QgdHJhbnNwb3J0ID0gcmVxdWlyZSgnLi90cmFuc3BvcnQnKVxuXG5sZXQgYXNKc29uQ2hhblxuLy8gTm9kZSA+PSAxOC4xOSBzdXBwb3J0cyBkaWFnbm9zdGljc19jaGFubmVsLnRyYWNpbmdDaGFubmVsXG5pZiAodHlwZW9mIGRpYWdDaGFuLnRyYWNpbmdDaGFubmVsID09PSAnZnVuY3Rpb24nKSB7XG4gIGFzSnNvbkNoYW4gPSBkaWFnQ2hhbi50cmFjaW5nQ2hhbm5lbCgncGlub19hc0pzb24nKVxufSBlbHNlIHtcbiAgLy8gT2xkZXIgTm9kZSAxOC54IChlLmcuIDE4LjE4KSwgcHJvdmlkZWQgYSBuby1vcCBmYWxsYmFja1xuICBhc0pzb25DaGFuID0ge1xuICAgIGhhc1N1YnNjcmliZXJzOiBmYWxzZSxcbiAgICB0cmFjZVN5bmMgKGZuLCBzdG9yZSwgdGhpc0FyZywgLi4uYXJncykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhpc0FyZywgLi4uYXJncylcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gbm9vcCAoKSB7XG59XG5cbmZ1bmN0aW9uIGdlbkxvZyAobGV2ZWwsIGhvb2spIHtcbiAgaWYgKCFob29rKSByZXR1cm4gTE9HXG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGhvb2tXcmFwcGVkTG9nICguLi5hcmdzKSB7XG4gICAgaG9vay5jYWxsKHRoaXMsIGFyZ3MsIExPRywgbGV2ZWwpXG4gIH1cblxuICBmdW5jdGlvbiBMT0cgKG8sIC4uLm4pIHtcbiAgICBpZiAodHlwZW9mIG8gPT09ICdvYmplY3QnKSB7XG4gICAgICBsZXQgbXNnID0gb1xuICAgICAgaWYgKG8gIT09IG51bGwpIHtcbiAgICAgICAgaWYgKG8ubWV0aG9kICYmIG8uaGVhZGVycyAmJiBvLnNvY2tldCkge1xuICAgICAgICAgIG8gPSBtYXBIdHRwUmVxdWVzdChvKVxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBvLnNldEhlYWRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIG8gPSBtYXBIdHRwUmVzcG9uc2UobylcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IGZvcm1hdFBhcmFtc1xuICAgICAgaWYgKG1zZyA9PT0gbnVsbCAmJiBuLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmb3JtYXRQYXJhbXMgPSBbbnVsbF1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IG4uc2hpZnQoKVxuICAgICAgICBmb3JtYXRQYXJhbXMgPSBuXG4gICAgICB9XG4gICAgICAvLyBXZSBkbyBub3QgdXNlIGEgY29lcmNpdmUgY2hlY2sgZm9yIGBtc2dgIGFzIGl0IGlzXG4gICAgICAvLyBtZWFzdXJhYmx5IHNsb3dlciB0aGFuIHRoZSBleHBsaWNpdCBjaGVja3MuXG4gICAgICBpZiAodHlwZW9mIHRoaXNbbXNnUHJlZml4U3ltXSA9PT0gJ3N0cmluZycgJiYgbXNnICE9PSB1bmRlZmluZWQgJiYgbXNnICE9PSBudWxsKSB7XG4gICAgICAgIG1zZyA9IHRoaXNbbXNnUHJlZml4U3ltXSArIG1zZ1xuICAgICAgfVxuICAgICAgdGhpc1t3cml0ZVN5bV0obywgZm9ybWF0KG1zZywgZm9ybWF0UGFyYW1zLCB0aGlzW2Zvcm1hdE9wdHNTeW1dKSwgbGV2ZWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBtc2cgPSBvID09PSB1bmRlZmluZWQgPyBuLnNoaWZ0KCkgOiBvXG5cbiAgICAgIC8vIFdlIGRvIG5vdCB1c2UgYSBjb2VyY2l2ZSBjaGVjayBmb3IgYG1zZ2AgYXMgaXQgaXNcbiAgICAgIC8vIG1lYXN1cmFibHkgc2xvd2VyIHRoYW4gdGhlIGV4cGxpY2l0IGNoZWNrcy5cbiAgICAgIGlmICh0eXBlb2YgdGhpc1ttc2dQcmVmaXhTeW1dID09PSAnc3RyaW5nJyAmJiBtc2cgIT09IHVuZGVmaW5lZCAmJiBtc2cgIT09IG51bGwpIHtcbiAgICAgICAgbXNnID0gdGhpc1ttc2dQcmVmaXhTeW1dICsgbXNnXG4gICAgICB9XG4gICAgICB0aGlzW3dyaXRlU3ltXShudWxsLCBmb3JtYXQobXNnLCBuLCB0aGlzW2Zvcm1hdE9wdHNTeW1dKSwgbGV2ZWwpXG4gICAgfVxuICB9XG59XG5cbi8vIG1hZ2ljYWxseSBlc2NhcGUgc3RyaW5ncyBmb3IganNvblxuLy8gcmVseWluZyBvbiB0aGVpciBjaGFyQ29kZUF0XG4vLyBldmVyeXRoaW5nIGJlbG93IDMyIG5lZWRzIEpTT04uc3RyaW5naWZ5KClcbi8vIDM0IGFuZCA5MiBoYXBwZW5zIGFsbCB0aGUgdGltZSwgc28gd2Vcbi8vIGhhdmUgYSBmYXN0IGNhc2UgZm9yIHRoZW1cbmZ1bmN0aW9uIGFzU3RyaW5nIChzdHIpIHtcbiAgbGV0IHJlc3VsdCA9ICcnXG4gIGxldCBsYXN0ID0gMFxuICBsZXQgZm91bmQgPSBmYWxzZVxuICBsZXQgcG9pbnQgPSAyNTVcbiAgY29uc3QgbCA9IHN0ci5sZW5ndGhcbiAgaWYgKGwgPiAxMDApIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc3RyKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbCAmJiBwb2ludCA+PSAzMjsgaSsrKSB7XG4gICAgcG9pbnQgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChwb2ludCA9PT0gMzQgfHwgcG9pbnQgPT09IDkyKSB7XG4gICAgICByZXN1bHQgKz0gc3RyLnNsaWNlKGxhc3QsIGkpICsgJ1xcXFwnXG4gICAgICBsYXN0ID0gaVxuICAgICAgZm91bmQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGlmICghZm91bmQpIHtcbiAgICByZXN1bHQgPSBzdHJcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgKz0gc3RyLnNsaWNlKGxhc3QpXG4gIH1cbiAgcmV0dXJuIHBvaW50IDwgMzIgPyBKU09OLnN0cmluZ2lmeShzdHIpIDogJ1wiJyArIHJlc3VsdCArICdcIidcbn1cblxuLyoqXG4gKiBgYXNKc29uYCB3cmFwcyBgX2FzSnNvbmAgaW4gb3JkZXIgdG8gZmFjaWxpdGF0ZSBnZW5lcmF0aW5nIGRpYWdub3N0aWNzLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmogVGhlIG1lcmdpbmcgb2JqZWN0IHBhc3NlZCB0byB0aGUgbG9nIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgVGhlIGxvZyBtZXNzYWdlIHBhc3NlZCB0byB0aGUgbG9nIG1ldGhvZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gVGhlIGxvZyBsZXZlbCBudW1iZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZSBUaGUgbG9nIHRpbWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGFzSnNvbiAob2JqLCBtc2csIG51bSwgdGltZSkge1xuICBpZiAoYXNKc29uQ2hhbi5oYXNTdWJzY3JpYmVycyA9PT0gZmFsc2UpIHtcbiAgICByZXR1cm4gX2FzSnNvbi5jYWxsKHRoaXMsIG9iaiwgbXNnLCBudW0sIHRpbWUpXG4gIH1cblxuICBjb25zdCBzdG9yZSA9IHsgaW5zdGFuY2U6IHRoaXMsIGFyZ3VtZW50cyB9XG4gIHJldHVybiBhc0pzb25DaGFuLnRyYWNlU3luYyhfYXNKc29uLCBzdG9yZSwgdGhpcywgb2JqLCBtc2csIG51bSwgdGltZSlcbn1cblxuLyoqXG4gKiBgX2FzSnNvbmAgcGFyc2VzIGFsbCBjb2xsZWN0ZWQgZGF0YSBhbmQgZ2VuZXJhdGVzIHRoZSBmaW5hbGl6ZWQgbmV3bGluZVxuICogZGVsaW1pdGVkIEpTT04gc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmogVGhlIG1lcmdpbmcgb2JqZWN0IHBhc3NlZCB0byB0aGUgbG9nIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtc2cgVGhlIGxvZyBtZXNzYWdlIHBhc3NlZCB0byB0aGUgbG9nIG1ldGhvZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBudW0gVGhlIGxvZyBsZXZlbCBudW1iZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZSBUaGUgbG9nIHRpbWUgaW4gbWlsbGlzZWNvbmRzLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmaW5hbGl6ZWQgbG9nIHN0cmluZyB0ZXJtaW5hdGVkIHdpdGggYSBuZXdsaW5lLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2FzSnNvbiAob2JqLCBtc2csIG51bSwgdGltZSkge1xuICBjb25zdCBzdHJpbmdpZnkgPSB0aGlzW3N0cmluZ2lmeVN5bV1cbiAgY29uc3Qgc3RyaW5naWZ5U2FmZSA9IHRoaXNbc3RyaW5naWZ5U2FmZVN5bV1cbiAgY29uc3Qgc3RyaW5naWZpZXJzID0gdGhpc1tzdHJpbmdpZmllcnNTeW1dXG4gIGNvbnN0IGVuZCA9IHRoaXNbZW5kU3ltXVxuICBjb25zdCBjaGluZGluZ3MgPSB0aGlzW2NoaW5kaW5nc1N5bV1cbiAgY29uc3Qgc2VyaWFsaXplcnMgPSB0aGlzW3NlcmlhbGl6ZXJzU3ltXVxuICBjb25zdCBmb3JtYXR0ZXJzID0gdGhpc1tmb3JtYXR0ZXJzU3ltXVxuICBjb25zdCBtZXNzYWdlS2V5ID0gdGhpc1ttZXNzYWdlS2V5U3ltXVxuICBjb25zdCBlcnJvcktleSA9IHRoaXNbZXJyb3JLZXlTeW1dXG4gIGxldCBkYXRhID0gdGhpc1tsc0NhY2hlU3ltXVtudW1dICsgdGltZVxuXG4gIC8vIHdlIG5lZWQgdGhlIGNoaWxkIGJpbmRpbmdzIGFkZGVkIHRvIHRoZSBvdXRwdXQgZmlyc3Qgc28gaW5zdGFuY2UgbG9nZ2VkXG4gIC8vIG9iamVjdHMgY2FuIHRha2UgcHJlY2VkZW5jZSB3aGVuIEpTT04ucGFyc2UtaW5nIHRoZSByZXN1bHRpbmcgbG9nIGxpbmVcbiAgZGF0YSA9IGRhdGEgKyBjaGluZGluZ3NcblxuICBsZXQgdmFsdWVcbiAgaWYgKGZvcm1hdHRlcnMubG9nKSB7XG4gICAgb2JqID0gZm9ybWF0dGVycy5sb2cob2JqKVxuICB9XG4gIGNvbnN0IHdpbGRjYXJkU3RyaW5naWZpZXIgPSBzdHJpbmdpZmllcnNbd2lsZGNhcmRGaXJzdFN5bV1cbiAgbGV0IHByb3BTdHIgPSAnJ1xuICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICB2YWx1ZSA9IG9ialtrZXldXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHNlcmlhbGl6ZXJzW2tleV0pIHtcbiAgICAgICAgdmFsdWUgPSBzZXJpYWxpemVyc1trZXldKHZhbHVlKVxuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IGVycm9yS2V5ICYmIHNlcmlhbGl6ZXJzLmVycikge1xuICAgICAgICB2YWx1ZSA9IHNlcmlhbGl6ZXJzLmVycih2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RyaW5naWZpZXIgPSBzdHJpbmdpZmllcnNba2V5XSB8fCB3aWxkY2FyZFN0cmluZ2lmaWVyXG5cbiAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgIC8qIGVzbGludCBuby1mYWxsdGhyb3VnaDogXCJvZmZcIiAqL1xuICAgICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUodmFsdWUpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdmFsdWUgPSBudWxsXG4gICAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGNhc2UgZXhwbGljaXRseSBmYWxscyB0aHJvdWdoIHRvIHRoZSBuZXh0IG9uZVxuICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICBpZiAoc3RyaW5naWZpZXIpIHZhbHVlID0gc3RyaW5naWZpZXIodmFsdWUpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICB2YWx1ZSA9IChzdHJpbmdpZmllciB8fCBhc1N0cmluZykodmFsdWUpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB2YWx1ZSA9IChzdHJpbmdpZmllciB8fCBzdHJpbmdpZnkpKHZhbHVlLCBzdHJpbmdpZnlTYWZlKVxuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIGNvbnRpbnVlXG4gICAgICBjb25zdCBzdHJLZXkgPSBhc1N0cmluZyhrZXkpXG4gICAgICBwcm9wU3RyICs9ICcsJyArIHN0cktleSArICc6JyArIHZhbHVlXG4gICAgfVxuICB9XG5cbiAgbGV0IG1zZ1N0ciA9ICcnXG4gIGlmIChtc2cgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbHVlID0gc2VyaWFsaXplcnNbbWVzc2FnZUtleV0gPyBzZXJpYWxpemVyc1ttZXNzYWdlS2V5XShtc2cpIDogbXNnXG4gICAgY29uc3Qgc3RyaW5naWZpZXIgPSBzdHJpbmdpZmllcnNbbWVzc2FnZUtleV0gfHwgd2lsZGNhcmRTdHJpbmdpZmllclxuXG4gICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIC8qIGVzbGludCBuby1mYWxsdGhyb3VnaDogXCJvZmZcIiAqL1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHZhbHVlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICB2YWx1ZSA9IG51bGxcbiAgICAgICAgfVxuICAgICAgLy8gdGhpcyBjYXNlIGV4cGxpY2l0bHkgZmFsbHMgdGhyb3VnaCB0byB0aGUgbmV4dCBvbmVcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICBpZiAoc3RyaW5naWZpZXIpIHZhbHVlID0gc3RyaW5naWZpZXIodmFsdWUpXG4gICAgICAgIG1zZ1N0ciA9ICcsXCInICsgbWVzc2FnZUtleSArICdcIjonICsgdmFsdWVcbiAgICAgICAgYnJlYWtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHZhbHVlID0gKHN0cmluZ2lmaWVyIHx8IGFzU3RyaW5nKSh2YWx1ZSlcbiAgICAgICAgbXNnU3RyID0gJyxcIicgKyBtZXNzYWdlS2V5ICsgJ1wiOicgKyB2YWx1ZVxuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsdWUgPSAoc3RyaW5naWZpZXIgfHwgc3RyaW5naWZ5KSh2YWx1ZSwgc3RyaW5naWZ5U2FmZSlcbiAgICAgICAgbXNnU3RyID0gJyxcIicgKyBtZXNzYWdlS2V5ICsgJ1wiOicgKyB2YWx1ZVxuICAgIH1cbiAgfVxuXG4gIGlmICh0aGlzW25lc3RlZEtleVN5bV0gJiYgcHJvcFN0cikge1xuICAgIC8vIHBsYWNlIGFsbCB0aGUgb2JqIHByb3BlcnRpZXMgdW5kZXIgdGhlIHNwZWNpZmllZCBrZXlcbiAgICAvLyB0aGUgbmVzdGVkIGtleSBpcyBhbHJlYWR5IGZvcm1hdHRlZCBmcm9tIHRoZSBjb25zdHJ1Y3RvclxuICAgIHJldHVybiBkYXRhICsgdGhpc1tuZXN0ZWRLZXlTdHJTeW1dICsgcHJvcFN0ci5zbGljZSgxKSArICd9JyArIG1zZ1N0ciArIGVuZFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBkYXRhICsgcHJvcFN0ciArIG1zZ1N0ciArIGVuZFxuICB9XG59XG5cbmZ1bmN0aW9uIGFzQ2hpbmRpbmdzIChpbnN0YW5jZSwgYmluZGluZ3MpIHtcbiAgbGV0IHZhbHVlXG4gIGxldCBkYXRhID0gaW5zdGFuY2VbY2hpbmRpbmdzU3ltXVxuICBjb25zdCBzdHJpbmdpZnkgPSBpbnN0YW5jZVtzdHJpbmdpZnlTeW1dXG4gIGNvbnN0IHN0cmluZ2lmeVNhZmUgPSBpbnN0YW5jZVtzdHJpbmdpZnlTYWZlU3ltXVxuICBjb25zdCBzdHJpbmdpZmllcnMgPSBpbnN0YW5jZVtzdHJpbmdpZmllcnNTeW1dXG4gIGNvbnN0IHdpbGRjYXJkU3RyaW5naWZpZXIgPSBzdHJpbmdpZmllcnNbd2lsZGNhcmRGaXJzdFN5bV1cbiAgY29uc3Qgc2VyaWFsaXplcnMgPSBpbnN0YW5jZVtzZXJpYWxpemVyc1N5bV1cbiAgY29uc3QgZm9ybWF0dGVyID0gaW5zdGFuY2VbZm9ybWF0dGVyc1N5bV0uYmluZGluZ3NcbiAgYmluZGluZ3MgPSBmb3JtYXR0ZXIoYmluZGluZ3MpXG5cbiAgZm9yIChjb25zdCBrZXkgaW4gYmluZGluZ3MpIHtcbiAgICB2YWx1ZSA9IGJpbmRpbmdzW2tleV1cbiAgICBjb25zdCB2YWxpZCA9IChrZXkubGVuZ3RoIDwgNSB8fCAoa2V5ICE9PSAnbGV2ZWwnICYmXG4gICAgICBrZXkgIT09ICdzZXJpYWxpemVycycgJiZcbiAgICAgIGtleSAhPT0gJ2Zvcm1hdHRlcnMnICYmXG4gICAgICBrZXkgIT09ICdjdXN0b21MZXZlbHMnKSkgJiZcbiAgICAgIGJpbmRpbmdzLmhhc093blByb3BlcnR5KGtleSkgJiZcbiAgICAgIHZhbHVlICE9PSB1bmRlZmluZWRcbiAgICBpZiAodmFsaWQgPT09IHRydWUpIHtcbiAgICAgIHZhbHVlID0gc2VyaWFsaXplcnNba2V5XSA/IHNlcmlhbGl6ZXJzW2tleV0odmFsdWUpIDogdmFsdWVcbiAgICAgIHZhbHVlID0gKHN0cmluZ2lmaWVyc1trZXldIHx8IHdpbGRjYXJkU3RyaW5naWZpZXIgfHwgc3RyaW5naWZ5KSh2YWx1ZSwgc3RyaW5naWZ5U2FmZSlcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSBjb250aW51ZVxuICAgICAgZGF0YSArPSAnLFwiJyArIGtleSArICdcIjonICsgdmFsdWVcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRhdGFcbn1cblxuZnVuY3Rpb24gaGFzQmVlblRhbXBlcmVkIChzdHJlYW0pIHtcbiAgcmV0dXJuIHN0cmVhbS53cml0ZSAhPT0gc3RyZWFtLmNvbnN0cnVjdG9yLnByb3RvdHlwZS53cml0ZVxufVxuXG5mdW5jdGlvbiBidWlsZFNhZmVTb25pY0Jvb20gKG9wdHMpIHtcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFNvbmljQm9vbShvcHRzKVxuICBzdHJlYW0ub24oJ2Vycm9yJywgZmlsdGVyQnJva2VuUGlwZSlcbiAgLy8gSWYgd2UgYXJlIHN5bmM6IGZhbHNlLCB3ZSBtdXN0IGZsdXNoIG9uIGV4aXRcbiAgaWYgKCFvcHRzLnN5bmMgJiYgaXNNYWluVGhyZWFkKSB7XG4gICAgb25FeGl0LnJlZ2lzdGVyKHN0cmVhbSwgYXV0b0VuZClcblxuICAgIHN0cmVhbS5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBvbkV4aXQudW5yZWdpc3RlcihzdHJlYW0pXG4gICAgfSlcbiAgfVxuICByZXR1cm4gc3RyZWFtXG5cbiAgZnVuY3Rpb24gZmlsdGVyQnJva2VuUGlwZSAoZXJyKSB7XG4gICAgLy8gSW1wb3NzaWJsZSB0byByZXBsaWNhdGUgYWNyb3NzIGFsbCBvcGVyYXRpbmcgc3lzdGVtc1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKGVyci5jb2RlID09PSAnRVBJUEUnKSB7XG4gICAgICAvLyBJZiB3ZSBnZXQgRVBJUEUsIHdlIHNob3VsZCBzdG9wIGxvZ2dpbmcgaGVyZVxuICAgICAgLy8gaG93ZXZlciB3ZSBoYXZlIG5vIGNvbnRyb2wgdG8gdGhlIGNvbnN1bWVyIG9mXG4gICAgICAvLyBTb25pY0Jvb20sIHNvIHdlIGp1c3Qgb3ZlcndyaXRlIHRoZSB3cml0ZSBtZXRob2RcbiAgICAgIHN0cmVhbS53cml0ZSA9IG5vb3BcbiAgICAgIHN0cmVhbS5lbmQgPSBub29wXG4gICAgICBzdHJlYW0uZmx1c2hTeW5jID0gbm9vcFxuICAgICAgc3RyZWFtLmRlc3Ryb3kgPSBub29wXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgc3RyZWFtLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGZpbHRlckJyb2tlblBpcGUpXG4gICAgc3RyZWFtLmVtaXQoJ2Vycm9yJywgZXJyKVxuICB9XG59XG5cbmZ1bmN0aW9uIGF1dG9FbmQgKHN0cmVhbSwgZXZlbnROYW1lKSB7XG4gIC8vIFRoaXMgY2hlY2sgaXMgbmVlZGVkIG9ubHkgb24gc29tZSBwbGF0Zm9ybXNcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKHN0cmVhbS5kZXN0cm95ZWQpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmIChldmVudE5hbWUgPT09ICdiZWZvcmVFeGl0Jykge1xuICAgIC8vIFdlIHN0aWxsIGhhdmUgYW4gZXZlbnQgbG9vcCwgbGV0J3MgdXNlIGl0XG4gICAgc3RyZWFtLmZsdXNoKClcbiAgICBzdHJlYW0ub24oJ2RyYWluJywgZnVuY3Rpb24gKCkge1xuICAgICAgc3RyZWFtLmVuZCgpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3Igc29tZSByZWFzb24gaXN0YW5idWwgaXMgbm90IGRldGVjdGluZyB0aGlzLCBidXQgaXQncyB0aGVyZVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgLy8gV2UgZG8gbm90IGhhdmUgYW4gZXZlbnQgbG9vcCwgc28gZmx1c2ggc3luY2hyb25vdXNseVxuICAgIHN0cmVhbS5mbHVzaFN5bmMoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUFyZ3NOb3JtYWxpemVyIChkZWZhdWx0T3B0aW9ucykge1xuICByZXR1cm4gZnVuY3Rpb24gbm9ybWFsaXplQXJncyAoaW5zdGFuY2UsIGNhbGxlciwgb3B0cyA9IHt9LCBzdHJlYW0pIHtcbiAgICAvLyBzdXBwb3J0IHN0cmVhbSBhcyBhIHN0cmluZ1xuICAgIGlmICh0eXBlb2Ygb3B0cyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN0cmVhbSA9IGJ1aWxkU2FmZVNvbmljQm9vbSh7IGRlc3Q6IG9wdHMgfSlcbiAgICAgIG9wdHMgPSB7fVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHN0cmVhbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChvcHRzICYmIG9wdHMudHJhbnNwb3J0KSB7XG4gICAgICAgIHRocm93IEVycm9yKCdvbmx5IG9uZSBvZiBvcHRpb24udHJhbnNwb3J0IG9yIHN0cmVhbSBjYW4gYmUgc3BlY2lmaWVkJylcbiAgICAgIH1cbiAgICAgIHN0cmVhbSA9IGJ1aWxkU2FmZVNvbmljQm9vbSh7IGRlc3Q6IHN0cmVhbSB9KVxuICAgIH0gZWxzZSBpZiAob3B0cyBpbnN0YW5jZW9mIFNvbmljQm9vbSB8fCBvcHRzLndyaXRhYmxlIHx8IG9wdHMuX3dyaXRhYmxlU3RhdGUpIHtcbiAgICAgIHN0cmVhbSA9IG9wdHNcbiAgICAgIG9wdHMgPSB7fVxuICAgIH0gZWxzZSBpZiAob3B0cy50cmFuc3BvcnQpIHtcbiAgICAgIGlmIChvcHRzLnRyYW5zcG9ydCBpbnN0YW5jZW9mIFNvbmljQm9vbSB8fCBvcHRzLnRyYW5zcG9ydC53cml0YWJsZSB8fCBvcHRzLnRyYW5zcG9ydC5fd3JpdGFibGVTdGF0ZSkge1xuICAgICAgICB0aHJvdyBFcnJvcignb3B0aW9uLnRyYW5zcG9ydCBkbyBub3QgYWxsb3cgc3RyZWFtLCBwbGVhc2UgcGFzcyB0byBvcHRpb24gZGlyZWN0bHkuIGUuZy4gcGlubyh0cmFuc3BvcnQpJylcbiAgICAgIH1cbiAgICAgIGlmIChvcHRzLnRyYW5zcG9ydC50YXJnZXRzICYmIG9wdHMudHJhbnNwb3J0LnRhcmdldHMubGVuZ3RoICYmIG9wdHMuZm9ybWF0dGVycyAmJiB0eXBlb2Ygb3B0cy5mb3JtYXR0ZXJzLmxldmVsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdvcHRpb24udHJhbnNwb3J0LnRhcmdldHMgZG8gbm90IGFsbG93IGN1c3RvbSBsZXZlbCBmb3JtYXR0ZXJzJylcbiAgICAgIH1cblxuICAgICAgbGV0IGN1c3RvbUxldmVsc1xuICAgICAgaWYgKG9wdHMuY3VzdG9tTGV2ZWxzKSB7XG4gICAgICAgIGN1c3RvbUxldmVscyA9IG9wdHMudXNlT25seUN1c3RvbUxldmVscyA/IG9wdHMuY3VzdG9tTGV2ZWxzIDogT2JqZWN0LmFzc2lnbih7fSwgb3B0cy5sZXZlbHMsIG9wdHMuY3VzdG9tTGV2ZWxzKVxuICAgICAgfVxuICAgICAgc3RyZWFtID0gdHJhbnNwb3J0KHsgY2FsbGVyLCAuLi5vcHRzLnRyYW5zcG9ydCwgbGV2ZWxzOiBjdXN0b21MZXZlbHMgfSlcbiAgICB9XG4gICAgb3B0cyA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRPcHRpb25zLCBvcHRzKVxuICAgIG9wdHMuc2VyaWFsaXplcnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucy5zZXJpYWxpemVycywgb3B0cy5zZXJpYWxpemVycylcbiAgICBvcHRzLmZvcm1hdHRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0T3B0aW9ucy5mb3JtYXR0ZXJzLCBvcHRzLmZvcm1hdHRlcnMpXG5cbiAgICBpZiAob3B0cy5wcmV0dHlQcmludCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwcmV0dHlQcmludCBvcHRpb24gaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgc2VlIHRoZSBwaW5vLXByZXR0eSBwYWNrYWdlIChodHRwczovL2dpdGh1Yi5jb20vcGlub2pzL3Bpbm8tcHJldHR5KScpXG4gICAgfVxuXG4gICAgY29uc3QgeyBlbmFibGVkLCBvbkNoaWxkIH0gPSBvcHRzXG4gICAgaWYgKGVuYWJsZWQgPT09IGZhbHNlKSBvcHRzLmxldmVsID0gJ3NpbGVudCdcbiAgICBpZiAoIW9uQ2hpbGQpIG9wdHMub25DaGlsZCA9IG5vb3BcbiAgICBpZiAoIXN0cmVhbSkge1xuICAgICAgaWYgKCFoYXNCZWVuVGFtcGVyZWQocHJvY2Vzcy5zdGRvdXQpKSB7XG4gICAgICAgIC8vIElmIHByb2Nlc3Muc3Rkb3V0LmZkIGlzIHVuZGVmaW5lZCwgaXQgbWVhbnMgdGhhdCB3ZSBhcmUgcnVubmluZ1xuICAgICAgICAvLyBpbiBhIHdvcmtlciB0aHJlYWQuIExldCdzIGFzc3VtZSB3ZSBhcmUgbG9nZ2luZyB0byBmaWxlIGRlc2NyaXB0b3IgMS5cbiAgICAgICAgc3RyZWFtID0gYnVpbGRTYWZlU29uaWNCb29tKHsgZmQ6IHByb2Nlc3Muc3Rkb3V0LmZkIHx8IDEgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IG9wdHMsIHN0cmVhbSB9XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5IChvYmosIHN0cmluZ2lmeVNhZmVGbikge1xuICB0cnkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopXG4gIH0gY2F0Y2ggKF8pIHtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RyaW5naWZ5ID0gc3RyaW5naWZ5U2FmZUZuIHx8IHRoaXNbc3RyaW5naWZ5U2FmZVN5bV1cbiAgICAgIHJldHVybiBzdHJpbmdpZnkob2JqKVxuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgIHJldHVybiAnXCJbdW5hYmxlIHRvIHNlcmlhbGl6ZSwgY2lyY3VsYXIgcmVmZXJlbmNlIGlzIHRvbyBjb21wbGV4IHRvIGFuYWx5emVdXCInXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGJ1aWxkRm9ybWF0dGVycyAobGV2ZWwsIGJpbmRpbmdzLCBsb2cpIHtcbiAgcmV0dXJuIHtcbiAgICBsZXZlbCxcbiAgICBiaW5kaW5ncyxcbiAgICBsb2dcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgaW50ZWdlciBmaWxlIGRlc2NyaXB0b3IgdG8gYSBwcm9wZXIgbmF0aXZlIGludGVnZXJcbiAqIGZpbGUgZGVzY3JpcHRvci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzdGluYXRpb24gVGhlIGZpbGUgZGVzY3JpcHRvciBzdHJpbmcgdG8gYXR0ZW1wdCB0byBjb252ZXJ0LlxuICpcbiAqIEByZXR1cm5zIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZURlc3RGaWxlRGVzY3JpcHRvciAoZGVzdGluYXRpb24pIHtcbiAgY29uc3QgZmQgPSBOdW1iZXIoZGVzdGluYXRpb24pXG4gIGlmICh0eXBlb2YgZGVzdGluYXRpb24gPT09ICdzdHJpbmcnICYmIE51bWJlci5pc0Zpbml0ZShmZCkpIHtcbiAgICByZXR1cm4gZmRcbiAgfVxuICAvLyBkZXN0aW5hdGlvbiBjb3VsZCBiZSB1bmRlZmluZWQgaWYgd2UgYXJlIGluIGEgd29ya2VyXG4gIGlmIChkZXN0aW5hdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gVGhpcyBpcyBzdGRvdXQgaW4gVU5JWCBzeXN0ZW1zXG4gICAgcmV0dXJuIDFcbiAgfVxuICByZXR1cm4gZGVzdGluYXRpb25cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG5vb3AsXG4gIGJ1aWxkU2FmZVNvbmljQm9vbSxcbiAgYXNDaGluZGluZ3MsXG4gIGFzSnNvbixcbiAgZ2VuTG9nLFxuICBjcmVhdGVBcmdzTm9ybWFsaXplcixcbiAgc3RyaW5naWZ5LFxuICBidWlsZEZvcm1hdHRlcnMsXG4gIG5vcm1hbGl6ZURlc3RGaWxlRGVzY3JpcHRvclxufVxuIiwgIi8qKlxuICogUmVwcmVzZW50cyBkZWZhdWx0IGxvZyBsZXZlbCB2YWx1ZXNcbiAqXG4gKiBAZW51bSB7bnVtYmVyfVxuICovXG5jb25zdCBERUZBVUxUX0xFVkVMUyA9IHtcbiAgdHJhY2U6IDEwLFxuICBkZWJ1ZzogMjAsXG4gIGluZm86IDMwLFxuICB3YXJuOiA0MCxcbiAgZXJyb3I6IDUwLFxuICBmYXRhbDogNjBcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIHNvcnQgb3JkZXIgZGlyZWN0aW9uOiBgYXNjZW5kaW5nYCBvciBgZGVzY2VuZGluZ2BcbiAqXG4gKiBAZW51bSB7c3RyaW5nfVxuICovXG5jb25zdCBTT1JUSU5HX09SREVSID0ge1xuICBBU0M6ICdBU0MnLFxuICBERVNDOiAnREVTQydcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIERFRkFVTFRfTEVWRUxTLFxuICBTT1JUSU5HX09SREVSXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG4vKiBlc2xpbnQgbm8tcHJvdG90eXBlLWJ1aWx0aW5zOiAwICovXG5jb25zdCB7XG4gIGxzQ2FjaGVTeW0sXG4gIGxldmVsVmFsU3ltLFxuICB1c2VPbmx5Q3VzdG9tTGV2ZWxzU3ltLFxuICBzdHJlYW1TeW0sXG4gIGZvcm1hdHRlcnNTeW0sXG4gIGhvb2tzU3ltLFxuICBsZXZlbENvbXBTeW1cbn0gPSByZXF1aXJlKCcuL3N5bWJvbHMnKVxuY29uc3QgeyBub29wLCBnZW5Mb2cgfSA9IHJlcXVpcmUoJy4vdG9vbHMnKVxuY29uc3QgeyBERUZBVUxUX0xFVkVMUywgU09SVElOR19PUkRFUiB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuXG5jb25zdCBsZXZlbE1ldGhvZHMgPSB7XG4gIGZhdGFsOiAoaG9vaykgPT4ge1xuICAgIGNvbnN0IGxvZ0ZhdGFsID0gZ2VuTG9nKERFRkFVTFRfTEVWRUxTLmZhdGFsLCBob29rKVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgY29uc3Qgc3RyZWFtID0gdGhpc1tzdHJlYW1TeW1dXG4gICAgICBsb2dGYXRhbC5jYWxsKHRoaXMsIC4uLmFyZ3MpXG4gICAgICBpZiAodHlwZW9mIHN0cmVhbS5mbHVzaFN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzdHJlYW0uZmx1c2hTeW5jKClcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9waW5vanMvcGluby9wdWxsLzc0MCNkaXNjdXNzaW9uX3IzNDY3ODgzMTNcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZXJyb3I6IChob29rKSA9PiBnZW5Mb2coREVGQVVMVF9MRVZFTFMuZXJyb3IsIGhvb2spLFxuICB3YXJuOiAoaG9vaykgPT4gZ2VuTG9nKERFRkFVTFRfTEVWRUxTLndhcm4sIGhvb2spLFxuICBpbmZvOiAoaG9vaykgPT4gZ2VuTG9nKERFRkFVTFRfTEVWRUxTLmluZm8sIGhvb2spLFxuICBkZWJ1ZzogKGhvb2spID0+IGdlbkxvZyhERUZBVUxUX0xFVkVMUy5kZWJ1ZywgaG9vayksXG4gIHRyYWNlOiAoaG9vaykgPT4gZ2VuTG9nKERFRkFVTFRfTEVWRUxTLnRyYWNlLCBob29rKVxufVxuXG5jb25zdCBudW1zID0gT2JqZWN0LmtleXMoREVGQVVMVF9MRVZFTFMpLnJlZHVjZSgobywgaykgPT4ge1xuICBvW0RFRkFVTFRfTEVWRUxTW2tdXSA9IGtcbiAgcmV0dXJuIG9cbn0sIHt9KVxuXG5jb25zdCBpbml0aWFsTHNDYWNoZSA9IE9iamVjdC5rZXlzKG51bXMpLnJlZHVjZSgobywgaykgPT4ge1xuICBvW2tdID0gJ3tcImxldmVsXCI6JyArIE51bWJlcihrKVxuICByZXR1cm4gb1xufSwge30pXG5cbmZ1bmN0aW9uIGdlbkxzQ2FjaGUgKGluc3RhbmNlKSB7XG4gIGNvbnN0IGZvcm1hdHRlciA9IGluc3RhbmNlW2Zvcm1hdHRlcnNTeW1dLmxldmVsXG4gIGNvbnN0IHsgbGFiZWxzIH0gPSBpbnN0YW5jZS5sZXZlbHNcbiAgY29uc3QgY2FjaGUgPSB7fVxuICBmb3IgKGNvbnN0IGxhYmVsIGluIGxhYmVscykge1xuICAgIGNvbnN0IGxldmVsID0gZm9ybWF0dGVyKGxhYmVsc1tsYWJlbF0sIE51bWJlcihsYWJlbCkpXG4gICAgY2FjaGVbbGFiZWxdID0gSlNPTi5zdHJpbmdpZnkobGV2ZWwpLnNsaWNlKDAsIC0xKVxuICB9XG4gIGluc3RhbmNlW2xzQ2FjaGVTeW1dID0gY2FjaGVcbiAgcmV0dXJuIGluc3RhbmNlXG59XG5cbmZ1bmN0aW9uIGlzU3RhbmRhcmRMZXZlbCAobGV2ZWwsIHVzZU9ubHlDdXN0b21MZXZlbHMpIHtcbiAgaWYgKHVzZU9ubHlDdXN0b21MZXZlbHMpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHN3aXRjaCAobGV2ZWwpIHtcbiAgICBjYXNlICdmYXRhbCc6XG4gICAgY2FzZSAnZXJyb3InOlxuICAgIGNhc2UgJ3dhcm4nOlxuICAgIGNhc2UgJ2luZm8nOlxuICAgIGNhc2UgJ2RlYnVnJzpcbiAgICBjYXNlICd0cmFjZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRMZXZlbCAobGV2ZWwpIHtcbiAgY29uc3QgeyBsYWJlbHMsIHZhbHVlcyB9ID0gdGhpcy5sZXZlbHNcbiAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAobGFiZWxzW2xldmVsXSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcigndW5rbm93biBsZXZlbCB2YWx1ZScgKyBsZXZlbClcbiAgICBsZXZlbCA9IGxhYmVsc1tsZXZlbF1cbiAgfVxuICBpZiAodmFsdWVzW2xldmVsXSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBFcnJvcigndW5rbm93biBsZXZlbCAnICsgbGV2ZWwpXG4gIGNvbnN0IHByZUxldmVsVmFsID0gdGhpc1tsZXZlbFZhbFN5bV1cbiAgY29uc3QgbGV2ZWxWYWwgPSB0aGlzW2xldmVsVmFsU3ltXSA9IHZhbHVlc1tsZXZlbF1cbiAgY29uc3QgdXNlT25seUN1c3RvbUxldmVsc1ZhbCA9IHRoaXNbdXNlT25seUN1c3RvbUxldmVsc1N5bV1cbiAgY29uc3QgbGV2ZWxDb21wYXJpc29uID0gdGhpc1tsZXZlbENvbXBTeW1dXG4gIGNvbnN0IGhvb2sgPSB0aGlzW2hvb2tzU3ltXS5sb2dNZXRob2RcblxuICBmb3IgKGNvbnN0IGtleSBpbiB2YWx1ZXMpIHtcbiAgICBpZiAobGV2ZWxDb21wYXJpc29uKHZhbHVlc1trZXldLCBsZXZlbFZhbCkgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzW2tleV0gPSBub29wXG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICB0aGlzW2tleV0gPSBpc1N0YW5kYXJkTGV2ZWwoa2V5LCB1c2VPbmx5Q3VzdG9tTGV2ZWxzVmFsKSA/IGxldmVsTWV0aG9kc1trZXldKGhvb2spIDogZ2VuTG9nKHZhbHVlc1trZXldLCBob29rKVxuICB9XG5cbiAgdGhpcy5lbWl0KFxuICAgICdsZXZlbC1jaGFuZ2UnLFxuICAgIGxldmVsLFxuICAgIGxldmVsVmFsLFxuICAgIGxhYmVsc1twcmVMZXZlbFZhbF0sXG4gICAgcHJlTGV2ZWxWYWwsXG4gICAgdGhpc1xuICApXG59XG5cbmZ1bmN0aW9uIGdldExldmVsIChsZXZlbCkge1xuICBjb25zdCB7IGxldmVscywgbGV2ZWxWYWwgfSA9IHRoaXNcbiAgLy8gcHJvdGVjdGlvbiBhZ2FpbnN0IHBvdGVudGlhbCBsb3NzIG9mIFBpbm8gc2NvcGUgZnJvbSBzZXJpYWxpemVycyAoZWRnZSBjYXNlIHdpdGggY2lyY3VsYXIgcmVmcyAtIGh0dHBzOi8vZ2l0aHViLmNvbS9waW5vanMvcGluby9pc3N1ZXMvODMzKVxuICByZXR1cm4gKGxldmVscyAmJiBsZXZlbHMubGFiZWxzKSA/IGxldmVscy5sYWJlbHNbbGV2ZWxWYWxdIDogJydcbn1cblxuZnVuY3Rpb24gaXNMZXZlbEVuYWJsZWQgKGxvZ0xldmVsKSB7XG4gIGNvbnN0IHsgdmFsdWVzIH0gPSB0aGlzLmxldmVsc1xuICBjb25zdCBsb2dMZXZlbFZhbCA9IHZhbHVlc1tsb2dMZXZlbF1cbiAgcmV0dXJuIGxvZ0xldmVsVmFsICE9PSB1bmRlZmluZWQgJiYgdGhpc1tsZXZlbENvbXBTeW1dKGxvZ0xldmVsVmFsLCB0aGlzW2xldmVsVmFsU3ltXSlcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlIGdpdmVuIGBjdXJyZW50YCBsZXZlbCBpcyBlbmFibGVkIGJ5IGNvbXBhcmluZyBpdFxuICogYWdhaW5zdCB0aGUgY3VycmVudCB0aHJlc2hvbGQgKGBleHBlY3RlZGApLlxuICpcbiAqIEBwYXJhbSB7U09SVElOR19PUkRFUn0gZGlyZWN0aW9uIGNvbXBhcmlzb24gZGlyZWN0aW9uIFwiQVNDXCIgb3IgXCJERVNDXCJcbiAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50IGN1cnJlbnQgbG9nIGxldmVsIG51bWJlciByZXByZXNlbnRhdGlvblxuICogQHBhcmFtIHtudW1iZXJ9IGV4cGVjdGVkIHRocmVzaG9sZCB2YWx1ZSB0byBjb21wYXJlIHdpdGhcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjb21wYXJlTGV2ZWwgKGRpcmVjdGlvbiwgY3VycmVudCwgZXhwZWN0ZWQpIHtcbiAgaWYgKGRpcmVjdGlvbiA9PT0gU09SVElOR19PUkRFUi5ERVNDKSB7XG4gICAgcmV0dXJuIGN1cnJlbnQgPD0gZXhwZWN0ZWRcbiAgfVxuXG4gIHJldHVybiBjdXJyZW50ID49IGV4cGVjdGVkXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbGV2ZWwgY29tcGFyaXNvbiBmdW5jdGlvbiBiYXNlZCBvbiBgbGV2ZWxDb21wYXJpc29uYFxuICogaXQgY291bGQgYSBkZWZhdWx0IGZ1bmN0aW9uIHdoaWNoIGNvbXBhcmVzIGxldmVscyBlaXRoZXIgaW4gXCJhc2NlbmRpbmdcIiBvciBcImRlc2NlbmRpbmdcIiBvcmRlciBvciBjdXN0b20gY29tcGFyaXNvbiBmdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7U09SVElOR19PUkRFUiB8IEZ1bmN0aW9ufSBsZXZlbENvbXBhcmlzb24gc29ydCBsZXZlbHMgb3JkZXIgZGlyZWN0aW9uIG9yIGN1c3RvbSBjb21wYXJpc29uIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyBGdW5jdGlvblxuICovXG5mdW5jdGlvbiBnZW5MZXZlbENvbXBhcmlzb24gKGxldmVsQ29tcGFyaXNvbikge1xuICBpZiAodHlwZW9mIGxldmVsQ29tcGFyaXNvbiA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gY29tcGFyZUxldmVsLmJpbmQobnVsbCwgbGV2ZWxDb21wYXJpc29uKVxuICB9XG5cbiAgcmV0dXJuIGxldmVsQ29tcGFyaXNvblxufVxuXG5mdW5jdGlvbiBtYXBwaW5ncyAoY3VzdG9tTGV2ZWxzID0gbnVsbCwgdXNlT25seUN1c3RvbUxldmVscyA9IGZhbHNlKSB7XG4gIGNvbnN0IGN1c3RvbU51bXMgPSBjdXN0b21MZXZlbHNcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgID8gT2JqZWN0LmtleXMoY3VzdG9tTGV2ZWxzKS5yZWR1Y2UoKG8sIGspID0+IHtcbiAgICAgICAgb1tjdXN0b21MZXZlbHNba11dID0ga1xuICAgICAgICByZXR1cm4gb1xuICAgICAgfSwge30pXG4gICAgOiBudWxsXG4gICAgLyogZXNsaW50LWVuYWJsZSAqL1xuXG4gIGNvbnN0IGxhYmVscyA9IE9iamVjdC5hc3NpZ24oXG4gICAgT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlLCB7IEluZmluaXR5OiB7IHZhbHVlOiAnc2lsZW50JyB9IH0pLFxuICAgIHVzZU9ubHlDdXN0b21MZXZlbHMgPyBudWxsIDogbnVtcyxcbiAgICBjdXN0b21OdW1zXG4gIClcbiAgY29uc3QgdmFsdWVzID0gT2JqZWN0LmFzc2lnbihcbiAgICBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUsIHsgc2lsZW50OiB7IHZhbHVlOiBJbmZpbml0eSB9IH0pLFxuICAgIHVzZU9ubHlDdXN0b21MZXZlbHMgPyBudWxsIDogREVGQVVMVF9MRVZFTFMsXG4gICAgY3VzdG9tTGV2ZWxzXG4gIClcbiAgcmV0dXJuIHsgbGFiZWxzLCB2YWx1ZXMgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnREZWZhdWx0TGV2ZWxGb3VuZCAoZGVmYXVsdExldmVsLCBjdXN0b21MZXZlbHMsIHVzZU9ubHlDdXN0b21MZXZlbHMpIHtcbiAgaWYgKHR5cGVvZiBkZWZhdWx0TGV2ZWwgPT09ICdudW1iZXInKSB7XG4gICAgY29uc3QgdmFsdWVzID0gW10uY29uY2F0KFxuICAgICAgT2JqZWN0LmtleXMoY3VzdG9tTGV2ZWxzIHx8IHt9KS5tYXAoa2V5ID0+IGN1c3RvbUxldmVsc1trZXldKSxcbiAgICAgIHVzZU9ubHlDdXN0b21MZXZlbHMgPyBbXSA6IE9iamVjdC5rZXlzKG51bXMpLm1hcChsZXZlbCA9PiArbGV2ZWwpLFxuICAgICAgSW5maW5pdHlcbiAgICApXG4gICAgaWYgKCF2YWx1ZXMuaW5jbHVkZXMoZGVmYXVsdExldmVsKSkge1xuICAgICAgdGhyb3cgRXJyb3IoYGRlZmF1bHQgbGV2ZWw6JHtkZWZhdWx0TGV2ZWx9IG11c3QgYmUgaW5jbHVkZWQgaW4gY3VzdG9tIGxldmVsc2ApXG4gICAgfVxuICAgIHJldHVyblxuICB9XG5cbiAgY29uc3QgbGFiZWxzID0gT2JqZWN0LmFzc2lnbihcbiAgICBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUsIHsgc2lsZW50OiB7IHZhbHVlOiBJbmZpbml0eSB9IH0pLFxuICAgIHVzZU9ubHlDdXN0b21MZXZlbHMgPyBudWxsIDogREVGQVVMVF9MRVZFTFMsXG4gICAgY3VzdG9tTGV2ZWxzXG4gIClcbiAgaWYgKCEoZGVmYXVsdExldmVsIGluIGxhYmVscykpIHtcbiAgICB0aHJvdyBFcnJvcihgZGVmYXVsdCBsZXZlbDoke2RlZmF1bHRMZXZlbH0gbXVzdCBiZSBpbmNsdWRlZCBpbiBjdXN0b20gbGV2ZWxzYClcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnROb0xldmVsQ29sbGlzaW9ucyAobGV2ZWxzLCBjdXN0b21MZXZlbHMpIHtcbiAgY29uc3QgeyBsYWJlbHMsIHZhbHVlcyB9ID0gbGV2ZWxzXG4gIGZvciAoY29uc3QgayBpbiBjdXN0b21MZXZlbHMpIHtcbiAgICBpZiAoayBpbiB2YWx1ZXMpIHtcbiAgICAgIHRocm93IEVycm9yKCdsZXZlbHMgY2Fubm90IGJlIG92ZXJyaWRkZW4nKVxuICAgIH1cbiAgICBpZiAoY3VzdG9tTGV2ZWxzW2tdIGluIGxhYmVscykge1xuICAgICAgdGhyb3cgRXJyb3IoJ3ByZS1leGlzdGluZyBsZXZlbCB2YWx1ZXMgY2Fubm90IGJlIHVzZWQgZm9yIG5ldyBsZXZlbHMnKVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRlcyB3aGV0aGVyIGBsZXZlbENvbXBhcmlzb25gIGlzIGNvcnJlY3RcbiAqXG4gKiBAdGhyb3dzIEVycm9yXG4gKiBAcGFyYW0ge1NPUlRJTkdfT1JERVIgfCBGdW5jdGlvbn0gbGV2ZWxDb21wYXJpc29uIC0gdmFsdWUgdG8gdmFsaWRhdGVcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGFzc2VydExldmVsQ29tcGFyaXNvbiAobGV2ZWxDb21wYXJpc29uKSB7XG4gIGlmICh0eXBlb2YgbGV2ZWxDb21wYXJpc29uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAodHlwZW9mIGxldmVsQ29tcGFyaXNvbiA9PT0gJ3N0cmluZycgJiYgT2JqZWN0LnZhbHVlcyhTT1JUSU5HX09SREVSKS5pbmNsdWRlcyhsZXZlbENvbXBhcmlzb24pKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoJ0xldmVscyBjb21wYXJpc29uIHNob3VsZCBiZSBvbmUgb2YgXCJBU0NcIiwgXCJERVNDXCIgb3IgXCJmdW5jdGlvblwiIHR5cGUnKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5pdGlhbExzQ2FjaGUsXG4gIGdlbkxzQ2FjaGUsXG4gIGxldmVsTWV0aG9kcyxcbiAgZ2V0TGV2ZWwsXG4gIHNldExldmVsLFxuICBpc0xldmVsRW5hYmxlZCxcbiAgbWFwcGluZ3MsXG4gIGFzc2VydE5vTGV2ZWxDb2xsaXNpb25zLFxuICBhc3NlcnREZWZhdWx0TGV2ZWxGb3VuZCxcbiAgZ2VuTGV2ZWxDb21wYXJpc29uLFxuICBhc3NlcnRMZXZlbENvbXBhcmlzb25cbn1cbiIsICIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICc5LjE0LjAnIH1cbiIsICIndXNlIHN0cmljdCdcblxuLyogZXNsaW50IG5vLXByb3RvdHlwZS1idWlsdGluczogMCAqL1xuXG5jb25zdCB7IEV2ZW50RW1pdHRlciB9ID0gcmVxdWlyZSgnbm9kZTpldmVudHMnKVxuY29uc3Qge1xuICBsc0NhY2hlU3ltLFxuICBsZXZlbFZhbFN5bSxcbiAgc2V0TGV2ZWxTeW0sXG4gIGdldExldmVsU3ltLFxuICBjaGluZGluZ3NTeW0sXG4gIHBhcnNlZENoaW5kaW5nc1N5bSxcbiAgbWl4aW5TeW0sXG4gIGFzSnNvblN5bSxcbiAgd3JpdGVTeW0sXG4gIG1peGluTWVyZ2VTdHJhdGVneVN5bSxcbiAgdGltZVN5bSxcbiAgdGltZVNsaWNlSW5kZXhTeW0sXG4gIHN0cmVhbVN5bSxcbiAgc2VyaWFsaXplcnNTeW0sXG4gIGZvcm1hdHRlcnNTeW0sXG4gIGVycm9yS2V5U3ltLFxuICBtZXNzYWdlS2V5U3ltLFxuICB1c2VPbmx5Q3VzdG9tTGV2ZWxzU3ltLFxuICBuZWVkc01ldGFkYXRhR3N5bSxcbiAgcmVkYWN0Rm10U3ltLFxuICBzdHJpbmdpZnlTeW0sXG4gIGZvcm1hdE9wdHNTeW0sXG4gIHN0cmluZ2lmaWVyc1N5bSxcbiAgbXNnUHJlZml4U3ltLFxuICBob29rc1N5bVxufSA9IHJlcXVpcmUoJy4vc3ltYm9scycpXG5jb25zdCB7XG4gIGdldExldmVsLFxuICBzZXRMZXZlbCxcbiAgaXNMZXZlbEVuYWJsZWQsXG4gIG1hcHBpbmdzLFxuICBpbml0aWFsTHNDYWNoZSxcbiAgZ2VuTHNDYWNoZSxcbiAgYXNzZXJ0Tm9MZXZlbENvbGxpc2lvbnNcbn0gPSByZXF1aXJlKCcuL2xldmVscycpXG5jb25zdCB7XG4gIGFzQ2hpbmRpbmdzLFxuICBhc0pzb24sXG4gIGJ1aWxkRm9ybWF0dGVycyxcbiAgc3RyaW5naWZ5LFxuICBub29wXG59ID0gcmVxdWlyZSgnLi90b29scycpXG5jb25zdCB7XG4gIHZlcnNpb25cbn0gPSByZXF1aXJlKCcuL21ldGEnKVxuY29uc3QgcmVkYWN0aW9uID0gcmVxdWlyZSgnLi9yZWRhY3Rpb24nKVxuXG4vLyBub3RlOiB1c2Ugb2YgY2xhc3MgaXMgc2F0aXJpY2FsXG4vLyBodHRwczovL2dpdGh1Yi5jb20vcGlub2pzL3Bpbm8vcHVsbC80MzMjcHVsbHJlcXVlc3RyZXZpZXctMTI3NzAzMTI3XG5jb25zdCBjb25zdHJ1Y3RvciA9IGNsYXNzIFBpbm8ge31cbmNvbnN0IHByb3RvdHlwZSA9IHtcbiAgY29uc3RydWN0b3IsXG4gIGNoaWxkLFxuICBiaW5kaW5ncyxcbiAgc2V0QmluZGluZ3MsXG4gIGZsdXNoLFxuICBpc0xldmVsRW5hYmxlZCxcbiAgdmVyc2lvbixcbiAgZ2V0IGxldmVsICgpIHsgcmV0dXJuIHRoaXNbZ2V0TGV2ZWxTeW1dKCkgfSxcbiAgc2V0IGxldmVsIChsdmwpIHsgdGhpc1tzZXRMZXZlbFN5bV0obHZsKSB9LFxuICBnZXQgbGV2ZWxWYWwgKCkgeyByZXR1cm4gdGhpc1tsZXZlbFZhbFN5bV0gfSxcbiAgc2V0IGxldmVsVmFsIChuKSB7IHRocm93IEVycm9yKCdsZXZlbFZhbCBpcyByZWFkLW9ubHknKSB9LFxuICBnZXQgbXNnUHJlZml4ICgpIHsgcmV0dXJuIHRoaXNbbXNnUHJlZml4U3ltXSB9LFxuICBnZXQgW1N5bWJvbC50b1N0cmluZ1RhZ10gKCkgeyByZXR1cm4gJ1Bpbm8nIH0sXG4gIFtsc0NhY2hlU3ltXTogaW5pdGlhbExzQ2FjaGUsXG4gIFt3cml0ZVN5bV06IHdyaXRlLFxuICBbYXNKc29uU3ltXTogYXNKc29uLFxuICBbZ2V0TGV2ZWxTeW1dOiBnZXRMZXZlbCxcbiAgW3NldExldmVsU3ltXTogc2V0TGV2ZWxcbn1cblxuT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb3RvdHlwZSwgRXZlbnRFbWl0dGVyLnByb3RvdHlwZSlcblxuLy8gZXhwb3J0aW5nIGFuZCBjb25zdW1pbmcgdGhlIHByb3RvdHlwZSBvYmplY3QgdXNpbmcgZmFjdG9yeSBwYXR0ZXJuIGZpeGVzIHNjb3BpbmcgaXNzdWVzIHdpdGggZ2V0dGVycyB3aGVuIHNlcmlhbGl6aW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUocHJvdG90eXBlKVxufVxuXG5jb25zdCByZXNldENoaWxkaW5nc0Zvcm1hdHRlciA9IGJpbmRpbmdzID0+IGJpbmRpbmdzXG5mdW5jdGlvbiBjaGlsZCAoYmluZGluZ3MsIG9wdGlvbnMpIHtcbiAgaWYgKCFiaW5kaW5ncykge1xuICAgIHRocm93IEVycm9yKCdtaXNzaW5nIGJpbmRpbmdzIGZvciBjaGlsZCBQaW5vJylcbiAgfVxuICBjb25zdCBzZXJpYWxpemVycyA9IHRoaXNbc2VyaWFsaXplcnNTeW1dXG4gIGNvbnN0IGZvcm1hdHRlcnMgPSB0aGlzW2Zvcm1hdHRlcnNTeW1dXG4gIGNvbnN0IGluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZSh0aGlzKVxuXG4gIC8vIElmIGFuIGBvcHRpb25zYCBvYmplY3Qgd2FzIG5vdCBzdXBwbGllZCwgd2UgY2FuIGltcHJvdmVcbiAgLy8gdGhlIHBlcmZvcm1hbmNlIG9mIGNoaWxkIGNyZWF0aW9uIGJ5IHNraXBwaW5nXG4gIC8vIHRoZSBjaGVja3MgZm9yIHNldCBvcHRpb25zIGFuZCBzaW1wbHkgcmV0dXJuXG4gIC8vIGEgYmFzZWxpbmUgaW5zdGFuY2UuXG4gIGlmIChvcHRpb25zID09IG51bGwpIHtcbiAgICBpZiAoaW5zdGFuY2VbZm9ybWF0dGVyc1N5bV0uYmluZGluZ3MgIT09IHJlc2V0Q2hpbGRpbmdzRm9ybWF0dGVyKSB7XG4gICAgICBpbnN0YW5jZVtmb3JtYXR0ZXJzU3ltXSA9IGJ1aWxkRm9ybWF0dGVycyhcbiAgICAgICAgZm9ybWF0dGVycy5sZXZlbCxcbiAgICAgICAgcmVzZXRDaGlsZGluZ3NGb3JtYXR0ZXIsXG4gICAgICAgIGZvcm1hdHRlcnMubG9nXG4gICAgICApXG4gICAgfVxuXG4gICAgaW5zdGFuY2VbY2hpbmRpbmdzU3ltXSA9IGFzQ2hpbmRpbmdzKGluc3RhbmNlLCBiaW5kaW5ncylcblxuICAgIC8vIEFsd2F5cyBjYWxsIHNldExldmVsIHRvIGVuc3VyZSBjaGlsZCBnZXRzIG93biBtZXRob2QgcmVmZXJlbmNlc1xuICAgIC8vIFRoaXMgcHJldmVudHMgaXNzdWVzIHdoZW4gcGFyZW50IG1ldGhvZHMgYXJlIHdyYXBwZWQgKGUuZy4sIGJ5IFNpbm9uKVxuICAgIGluc3RhbmNlW3NldExldmVsU3ltXSh0aGlzLmxldmVsKVxuXG4gICAgaWYgKHRoaXMub25DaGlsZCAhPT0gbm9vcCkge1xuICAgICAgdGhpcy5vbkNoaWxkKGluc3RhbmNlKVxuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW5jZVxuICB9XG5cbiAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3NlcmlhbGl6ZXJzJykgPT09IHRydWUpIHtcbiAgICBpbnN0YW5jZVtzZXJpYWxpemVyc1N5bV0gPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cbiAgICBmb3IgKGNvbnN0IGsgaW4gc2VyaWFsaXplcnMpIHtcbiAgICAgIGluc3RhbmNlW3NlcmlhbGl6ZXJzU3ltXVtrXSA9IHNlcmlhbGl6ZXJzW2tdXG4gICAgfVxuICAgIGNvbnN0IHBhcmVudFN5bWJvbHMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNlcmlhbGl6ZXJzKVxuICAgIC8qIGVzbGludCBuby12YXI6IG9mZiAqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyZW50U3ltYm9scy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qga3MgPSBwYXJlbnRTeW1ib2xzW2ldXG4gICAgICBpbnN0YW5jZVtzZXJpYWxpemVyc1N5bV1ba3NdID0gc2VyaWFsaXplcnNba3NdXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBiayBpbiBvcHRpb25zLnNlcmlhbGl6ZXJzKSB7XG4gICAgICBpbnN0YW5jZVtzZXJpYWxpemVyc1N5bV1bYmtdID0gb3B0aW9ucy5zZXJpYWxpemVyc1tia11cbiAgICB9XG4gICAgY29uc3QgYmluZGluZ3NTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvcHRpb25zLnNlcmlhbGl6ZXJzKVxuICAgIGZvciAodmFyIGJpID0gMDsgYmkgPCBiaW5kaW5nc1N5bWJvbHMubGVuZ3RoOyBiaSsrKSB7XG4gICAgICBjb25zdCBia3MgPSBiaW5kaW5nc1N5bWJvbHNbYmldXG4gICAgICBpbnN0YW5jZVtzZXJpYWxpemVyc1N5bV1bYmtzXSA9IG9wdGlvbnMuc2VyaWFsaXplcnNbYmtzXVxuICAgIH1cbiAgfSBlbHNlIGluc3RhbmNlW3NlcmlhbGl6ZXJzU3ltXSA9IHNlcmlhbGl6ZXJzXG4gIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KCdmb3JtYXR0ZXJzJykpIHtcbiAgICBjb25zdCB7IGxldmVsLCBiaW5kaW5nczogY2hpbmRpbmdzLCBsb2cgfSA9IG9wdGlvbnMuZm9ybWF0dGVyc1xuICAgIGluc3RhbmNlW2Zvcm1hdHRlcnNTeW1dID0gYnVpbGRGb3JtYXR0ZXJzKFxuICAgICAgbGV2ZWwgfHwgZm9ybWF0dGVycy5sZXZlbCxcbiAgICAgIGNoaW5kaW5ncyB8fCByZXNldENoaWxkaW5nc0Zvcm1hdHRlcixcbiAgICAgIGxvZyB8fCBmb3JtYXR0ZXJzLmxvZ1xuICAgIClcbiAgfSBlbHNlIHtcbiAgICBpbnN0YW5jZVtmb3JtYXR0ZXJzU3ltXSA9IGJ1aWxkRm9ybWF0dGVycyhcbiAgICAgIGZvcm1hdHRlcnMubGV2ZWwsXG4gICAgICByZXNldENoaWxkaW5nc0Zvcm1hdHRlcixcbiAgICAgIGZvcm1hdHRlcnMubG9nXG4gICAgKVxuICB9XG4gIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KCdjdXN0b21MZXZlbHMnKSA9PT0gdHJ1ZSkge1xuICAgIGFzc2VydE5vTGV2ZWxDb2xsaXNpb25zKHRoaXMubGV2ZWxzLCBvcHRpb25zLmN1c3RvbUxldmVscylcbiAgICBpbnN0YW5jZS5sZXZlbHMgPSBtYXBwaW5ncyhvcHRpb25zLmN1c3RvbUxldmVscywgaW5zdGFuY2VbdXNlT25seUN1c3RvbUxldmVsc1N5bV0pXG4gICAgZ2VuTHNDYWNoZShpbnN0YW5jZSlcbiAgfVxuXG4gIC8vIHJlZGFjdCBtdXN0IHBsYWNlIGJlZm9yZSBhc0NoaW5kaW5ncyBhbmQgb25seSByZXBsYWNlIGlmIGV4aXN0XG4gIGlmICgodHlwZW9mIG9wdGlvbnMucmVkYWN0ID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLnJlZGFjdCAhPT0gbnVsbCkgfHwgQXJyYXkuaXNBcnJheShvcHRpb25zLnJlZGFjdCkpIHtcbiAgICBpbnN0YW5jZS5yZWRhY3QgPSBvcHRpb25zLnJlZGFjdCAvLyByZXBsYWNlIHJlZGFjdCBkaXJlY3RseVxuICAgIGNvbnN0IHN0cmluZ2lmaWVycyA9IHJlZGFjdGlvbihpbnN0YW5jZS5yZWRhY3QsIHN0cmluZ2lmeSlcbiAgICBjb25zdCBmb3JtYXRPcHRzID0geyBzdHJpbmdpZnk6IHN0cmluZ2lmaWVyc1tyZWRhY3RGbXRTeW1dIH1cbiAgICBpbnN0YW5jZVtzdHJpbmdpZnlTeW1dID0gc3RyaW5naWZ5XG4gICAgaW5zdGFuY2Vbc3RyaW5naWZpZXJzU3ltXSA9IHN0cmluZ2lmaWVyc1xuICAgIGluc3RhbmNlW2Zvcm1hdE9wdHNTeW1dID0gZm9ybWF0T3B0c1xuICB9XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLm1zZ1ByZWZpeCA9PT0gJ3N0cmluZycpIHtcbiAgICBpbnN0YW5jZVttc2dQcmVmaXhTeW1dID0gKHRoaXNbbXNnUHJlZml4U3ltXSB8fCAnJykgKyBvcHRpb25zLm1zZ1ByZWZpeFxuICB9XG5cbiAgaW5zdGFuY2VbY2hpbmRpbmdzU3ltXSA9IGFzQ2hpbmRpbmdzKGluc3RhbmNlLCBiaW5kaW5ncylcbiAgY29uc3QgY2hpbGRMZXZlbCA9IG9wdGlvbnMubGV2ZWwgfHwgdGhpcy5sZXZlbFxuICBpbnN0YW5jZVtzZXRMZXZlbFN5bV0oY2hpbGRMZXZlbClcbiAgdGhpcy5vbkNoaWxkKGluc3RhbmNlKVxuICByZXR1cm4gaW5zdGFuY2Vcbn1cblxuZnVuY3Rpb24gYmluZGluZ3MgKCkge1xuICBjb25zdCBjaGluZGluZ3MgPSB0aGlzW2NoaW5kaW5nc1N5bV1cbiAgY29uc3QgY2hpbmRpbmdzSnNvbiA9IGB7JHtjaGluZGluZ3Muc3Vic3RyKDEpfX1gIC8vIGF0IGxlYXN0IGNvbnRhaW5zICxcInBpZFwiOjcwNjgsXCJob3N0bmFtZVwiOlwibXlNYWNcIlxuICBjb25zdCBiaW5kaW5nc0Zyb21Kc29uID0gSlNPTi5wYXJzZShjaGluZGluZ3NKc29uKVxuICBkZWxldGUgYmluZGluZ3NGcm9tSnNvbi5waWRcbiAgZGVsZXRlIGJpbmRpbmdzRnJvbUpzb24uaG9zdG5hbWVcbiAgcmV0dXJuIGJpbmRpbmdzRnJvbUpzb25cbn1cblxuZnVuY3Rpb24gc2V0QmluZGluZ3MgKG5ld0JpbmRpbmdzKSB7XG4gIGNvbnN0IGNoaW5kaW5ncyA9IGFzQ2hpbmRpbmdzKHRoaXMsIG5ld0JpbmRpbmdzKVxuICB0aGlzW2NoaW5kaW5nc1N5bV0gPSBjaGluZGluZ3NcbiAgZGVsZXRlIHRoaXNbcGFyc2VkQ2hpbmRpbmdzU3ltXVxufVxuXG4vKipcbiAqIERlZmF1bHQgc3RyYXRlZ3kgZm9yIGNyZWF0aW5nIGBtZXJnZU9iamVjdGAgZnJvbSBhcmd1bWVudHMgYW5kIHRoZSByZXN1bHQgZnJvbSBgbWl4aW4oKWAuXG4gKiBGaWVsZHMgZnJvbSBgbWVyZ2VPYmplY3RgIGhhdmUgaGlnaGVyIHByaW9yaXR5IGluIHRoaXMgc3RyYXRlZ3kuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG1lcmdlT2JqZWN0IFRoZSBvYmplY3QgYSB1c2VyIGhhcyBzdXBwbGllZCB0byB0aGUgbG9nZ2luZyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBtaXhpbk9iamVjdCBUaGUgcmVzdWx0IG9mIHRoZSBgbWl4aW5gIG1ldGhvZC5cbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gZGVmYXVsdE1peGluTWVyZ2VTdHJhdGVneSAobWVyZ2VPYmplY3QsIG1peGluT2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKG1peGluT2JqZWN0LCBtZXJnZU9iamVjdClcbn1cblxuZnVuY3Rpb24gd3JpdGUgKF9vYmosIG1zZywgbnVtKSB7XG4gIGNvbnN0IHQgPSB0aGlzW3RpbWVTeW1dKClcbiAgY29uc3QgbWl4aW4gPSB0aGlzW21peGluU3ltXVxuICBjb25zdCBlcnJvcktleSA9IHRoaXNbZXJyb3JLZXlTeW1dXG4gIGNvbnN0IG1lc3NhZ2VLZXkgPSB0aGlzW21lc3NhZ2VLZXlTeW1dXG4gIGNvbnN0IG1peGluTWVyZ2VTdHJhdGVneSA9IHRoaXNbbWl4aW5NZXJnZVN0cmF0ZWd5U3ltXSB8fCBkZWZhdWx0TWl4aW5NZXJnZVN0cmF0ZWd5XG4gIGxldCBvYmpcbiAgY29uc3Qgc3RyZWFtV3JpdGVIb29rID0gdGhpc1tob29rc1N5bV0uc3RyZWFtV3JpdGVcblxuICBpZiAoX29iaiA9PT0gdW5kZWZpbmVkIHx8IF9vYmogPT09IG51bGwpIHtcbiAgICBvYmogPSB7fVxuICB9IGVsc2UgaWYgKF9vYmogaW5zdGFuY2VvZiBFcnJvcikge1xuICAgIG9iaiA9IHsgW2Vycm9yS2V5XTogX29iaiB9XG4gICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBtc2cgPSBfb2JqLm1lc3NhZ2VcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgb2JqID0gX29ialxuICAgIGlmIChtc2cgPT09IHVuZGVmaW5lZCAmJiBfb2JqW21lc3NhZ2VLZXldID09PSB1bmRlZmluZWQgJiYgX29ialtlcnJvcktleV0pIHtcbiAgICAgIG1zZyA9IF9vYmpbZXJyb3JLZXldLm1lc3NhZ2VcbiAgICB9XG4gIH1cblxuICBpZiAobWl4aW4pIHtcbiAgICBvYmogPSBtaXhpbk1lcmdlU3RyYXRlZ3kob2JqLCBtaXhpbihvYmosIG51bSwgdGhpcykpXG4gIH1cblxuICBjb25zdCBzID0gdGhpc1thc0pzb25TeW1dKG9iaiwgbXNnLCBudW0sIHQpXG5cbiAgY29uc3Qgc3RyZWFtID0gdGhpc1tzdHJlYW1TeW1dXG4gIGlmIChzdHJlYW1bbmVlZHNNZXRhZGF0YUdzeW1dID09PSB0cnVlKSB7XG4gICAgc3RyZWFtLmxhc3RMZXZlbCA9IG51bVxuICAgIHN0cmVhbS5sYXN0T2JqID0gb2JqXG4gICAgc3RyZWFtLmxhc3RNc2cgPSBtc2dcbiAgICBzdHJlYW0ubGFzdFRpbWUgPSB0LnNsaWNlKHRoaXNbdGltZVNsaWNlSW5kZXhTeW1dKVxuICAgIHN0cmVhbS5sYXN0TG9nZ2VyID0gdGhpcyAvLyBmb3IgY2hpbGQgbG9nZ2Vyc1xuICB9XG4gIHN0cmVhbS53cml0ZShzdHJlYW1Xcml0ZUhvb2sgPyBzdHJlYW1Xcml0ZUhvb2socykgOiBzKVxufVxuXG5mdW5jdGlvbiBmbHVzaCAoY2IpIHtcbiAgaWYgKGNiICE9IG51bGwgJiYgdHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgRXJyb3IoJ2NhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gIH1cblxuICBjb25zdCBzdHJlYW0gPSB0aGlzW3N0cmVhbVN5bV1cblxuICBpZiAodHlwZW9mIHN0cmVhbS5mbHVzaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHN0cmVhbS5mbHVzaChjYiB8fCBub29wKVxuICB9IGVsc2UgaWYgKGNiKSBjYigpXG59XG4iLCAiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IHsgaGFzT3duUHJvcGVydHkgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuY29uc3Qgc3RyaW5naWZ5ID0gY29uZmlndXJlKClcblxuLy8gQHRzLWV4cGVjdC1lcnJvclxuc3RyaW5naWZ5LmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZVxuLy8gQHRzLWV4cGVjdC1lcnJvclxuc3RyaW5naWZ5LnN0cmluZ2lmeSA9IHN0cmluZ2lmeVxuXG4vLyBAdHMtZXhwZWN0LWVycm9yXG5zdHJpbmdpZnkuZGVmYXVsdCA9IHN0cmluZ2lmeVxuXG4vLyBAdHMtZXhwZWN0LWVycm9yIHVzZWQgZm9yIG5hbWVkIGV4cG9ydFxuZXhwb3J0cy5zdHJpbmdpZnkgPSBzdHJpbmdpZnlcbi8vIEB0cy1leHBlY3QtZXJyb3IgdXNlZCBmb3IgbmFtZWQgZXhwb3J0XG5leHBvcnRzLmNvbmZpZ3VyZSA9IGNvbmZpZ3VyZVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ2lmeVxuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udHJvbC1yZWdleFxuY29uc3Qgc3RyRXNjYXBlU2VxdWVuY2VzUmVnRXhwID0gL1tcXHUwMDAwLVxcdTAwMWZcXHUwMDIyXFx1MDA1Y1xcdWQ4MDAtXFx1ZGZmZl0vXG5cbi8vIEVzY2FwZSBDMCBjb250cm9sIGNoYXJhY3RlcnMsIGRvdWJsZSBxdW90ZXMsIHRoZSBiYWNrc2xhc2ggYW5kIGV2ZXJ5IGNvZGVcbi8vIHVuaXQgd2l0aCBhIG51bWVyaWMgdmFsdWUgaW4gdGhlIGluY2x1c2l2ZSByYW5nZSAweEQ4MDAgdG8gMHhERkZGLlxuZnVuY3Rpb24gc3RyRXNjYXBlIChzdHIpIHtcbiAgLy8gU29tZSBtYWdpYyBudW1iZXJzIHRoYXQgd29ya2VkIG91dCBmaW5lIHdoaWxlIGJlbmNobWFya2luZyB3aXRoIHY4IDguMFxuICBpZiAoc3RyLmxlbmd0aCA8IDUwMDAgJiYgIXN0ckVzY2FwZVNlcXVlbmNlc1JlZ0V4cC50ZXN0KHN0cikpIHtcbiAgICByZXR1cm4gYFwiJHtzdHJ9XCJgXG4gIH1cbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHN0cilcbn1cblxuZnVuY3Rpb24gc29ydCAoYXJyYXksIGNvbXBhcmF0b3IpIHtcbiAgLy8gSW5zZXJ0aW9uIHNvcnQgaXMgdmVyeSBlZmZpY2llbnQgZm9yIHNtYWxsIGlucHV0IHNpemVzLCBidXQgaXQgaGFzIGEgYmFkXG4gIC8vIHdvcnN0IGNhc2UgY29tcGxleGl0eS4gVGh1cywgdXNlIG5hdGl2ZSBhcnJheSBzb3J0IGZvciBiaWdnZXIgdmFsdWVzLlxuICBpZiAoYXJyYXkubGVuZ3RoID4gMmUyIHx8IGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gYXJyYXkuc29ydChjb21wYXJhdG9yKVxuICB9XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50VmFsdWUgPSBhcnJheVtpXVxuICAgIGxldCBwb3NpdGlvbiA9IGlcbiAgICB3aGlsZSAocG9zaXRpb24gIT09IDAgJiYgYXJyYXlbcG9zaXRpb24gLSAxXSA+IGN1cnJlbnRWYWx1ZSkge1xuICAgICAgYXJyYXlbcG9zaXRpb25dID0gYXJyYXlbcG9zaXRpb24gLSAxXVxuICAgICAgcG9zaXRpb24tLVxuICAgIH1cbiAgICBhcnJheVtwb3NpdGlvbl0gPSBjdXJyZW50VmFsdWVcbiAgfVxuICByZXR1cm4gYXJyYXlcbn1cblxuY29uc3QgdHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnID1cbiAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoXG4gICAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YoXG4gICAgICAgIG5ldyBJbnQ4QXJyYXkoKVxuICAgICAgKVxuICAgICksXG4gICAgU3ltYm9sLnRvU3RyaW5nVGFnXG4gICkuZ2V0XG5cbmZ1bmN0aW9uIGlzVHlwZWRBcnJheVdpdGhFbnRyaWVzICh2YWx1ZSkge1xuICByZXR1cm4gdHlwZWRBcnJheVByb3RvdHlwZUdldFN5bWJvbFRvU3RyaW5nVGFnLmNhbGwodmFsdWUpICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoICE9PSAwXG59XG5cbmZ1bmN0aW9uIHN0cmluZ2lmeVR5cGVkQXJyYXkgKGFycmF5LCBzZXBhcmF0b3IsIG1heGltdW1CcmVhZHRoKSB7XG4gIGlmIChhcnJheS5sZW5ndGggPCBtYXhpbXVtQnJlYWR0aCkge1xuICAgIG1heGltdW1CcmVhZHRoID0gYXJyYXkubGVuZ3RoXG4gIH1cbiAgY29uc3Qgd2hpdGVzcGFjZSA9IHNlcGFyYXRvciA9PT0gJywnID8gJycgOiAnICdcbiAgbGV0IHJlcyA9IGBcIjBcIjoke3doaXRlc3BhY2V9JHthcnJheVswXX1gXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbWF4aW11bUJyZWFkdGg7IGkrKykge1xuICAgIHJlcyArPSBgJHtzZXBhcmF0b3J9XCIke2l9XCI6JHt3aGl0ZXNwYWNlfSR7YXJyYXlbaV19YFxuICB9XG4gIHJldHVybiByZXNcbn1cblxuZnVuY3Rpb24gZ2V0Q2lyY3VsYXJWYWx1ZU9wdGlvbiAob3B0aW9ucykge1xuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCAnY2lyY3VsYXJWYWx1ZScpKSB7XG4gICAgY29uc3QgY2lyY3VsYXJWYWx1ZSA9IG9wdGlvbnMuY2lyY3VsYXJWYWx1ZVxuICAgIGlmICh0eXBlb2YgY2lyY3VsYXJWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBgXCIke2NpcmN1bGFyVmFsdWV9XCJgXG4gICAgfVxuICAgIGlmIChjaXJjdWxhclZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjaXJjdWxhclZhbHVlXG4gICAgfVxuICAgIGlmIChjaXJjdWxhclZhbHVlID09PSBFcnJvciB8fCBjaXJjdWxhclZhbHVlID09PSBUeXBlRXJyb3IpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvU3RyaW5nICgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJjaXJjdWxhclZhbHVlXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIHN0cmluZyBvciB0aGUgdmFsdWUgbnVsbCBvciB1bmRlZmluZWQnKVxuICB9XG4gIHJldHVybiAnXCJbQ2lyY3VsYXJdXCInXG59XG5cbmZ1bmN0aW9uIGdldERldGVybWluaXN0aWNPcHRpb24gKG9wdGlvbnMpIHtcbiAgbGV0IHZhbHVlXG4gIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsICdkZXRlcm1pbmlzdGljJykpIHtcbiAgICB2YWx1ZSA9IG9wdGlvbnMuZGV0ZXJtaW5pc3RpY1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImRldGVybWluaXN0aWNcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbiBvciBjb21wYXJhdG9yIGZ1bmN0aW9uJylcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB0cnVlIDogdmFsdWVcbn1cblxuZnVuY3Rpb24gZ2V0Qm9vbGVhbk9wdGlvbiAob3B0aW9ucywga2V5KSB7XG4gIGxldCB2YWx1ZVxuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvcHRpb25zLCBrZXkpKSB7XG4gICAgdmFsdWUgPSBvcHRpb25zW2tleV1cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBcIiR7a2V5fVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBib29sZWFuYClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB0cnVlIDogdmFsdWVcbn1cblxuZnVuY3Rpb24gZ2V0UG9zaXRpdmVJbnRlZ2VyT3B0aW9uIChvcHRpb25zLCBrZXkpIHtcbiAgbGV0IHZhbHVlXG4gIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsIGtleSkpIHtcbiAgICB2YWx1ZSA9IG9wdGlvbnNba2V5XVxuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBUaGUgXCIke2tleX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyYClcbiAgICB9XG4gICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgVGhlIFwiJHtrZXl9XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBpbnRlZ2VyYClcbiAgICB9XG4gICAgaWYgKHZhbHVlIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFRoZSBcIiR7a2V5fVwiIGFyZ3VtZW50IG11c3QgYmUgPj0gMWApXG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gSW5maW5pdHkgOiB2YWx1ZVxufVxuXG5mdW5jdGlvbiBnZXRJdGVtQ291bnQgKG51bWJlcikge1xuICBpZiAobnVtYmVyID09PSAxKSB7XG4gICAgcmV0dXJuICcxIGl0ZW0nXG4gIH1cbiAgcmV0dXJuIGAke251bWJlcn0gaXRlbXNgXG59XG5cbmZ1bmN0aW9uIGdldFVuaXF1ZVJlcGxhY2VyU2V0IChyZXBsYWNlckFycmF5KSB7XG4gIGNvbnN0IHJlcGxhY2VyU2V0ID0gbmV3IFNldCgpXG4gIGZvciAoY29uc3QgdmFsdWUgb2YgcmVwbGFjZXJBcnJheSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHJlcGxhY2VyU2V0LmFkZChTdHJpbmcodmFsdWUpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVwbGFjZXJTZXRcbn1cblxuZnVuY3Rpb24gZ2V0U3RyaWN0T3B0aW9uIChvcHRpb25zKSB7XG4gIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9wdGlvbnMsICdzdHJpY3QnKSkge1xuICAgIGNvbnN0IHZhbHVlID0gb3B0aW9ucy5zdHJpY3RcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcInN0cmljdFwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBib29sZWFuJylcbiAgICB9XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgICAgIGxldCBtZXNzYWdlID0gYE9iamVjdCBjYW4gbm90IHNhZmVseSBiZSBzdHJpbmdpZmllZC4gUmVjZWl2ZWQgdHlwZSAke3R5cGVvZiB2YWx1ZX1gXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIG1lc3NhZ2UgKz0gYCAoJHt2YWx1ZS50b1N0cmluZygpfSlgXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb25maWd1cmUgKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHsgLi4ub3B0aW9ucyB9XG4gIGNvbnN0IGZhaWwgPSBnZXRTdHJpY3RPcHRpb24ob3B0aW9ucylcbiAgaWYgKGZhaWwpIHtcbiAgICBpZiAob3B0aW9ucy5iaWdpbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0aW9ucy5iaWdpbnQgPSBmYWxzZVxuICAgIH1cbiAgICBpZiAoISgnY2lyY3VsYXJWYWx1ZScgaW4gb3B0aW9ucykpIHtcbiAgICAgIG9wdGlvbnMuY2lyY3VsYXJWYWx1ZSA9IEVycm9yXG4gICAgfVxuICB9XG4gIGNvbnN0IGNpcmN1bGFyVmFsdWUgPSBnZXRDaXJjdWxhclZhbHVlT3B0aW9uKG9wdGlvbnMpXG4gIGNvbnN0IGJpZ2ludCA9IGdldEJvb2xlYW5PcHRpb24ob3B0aW9ucywgJ2JpZ2ludCcpXG4gIGNvbnN0IGRldGVybWluaXN0aWMgPSBnZXREZXRlcm1pbmlzdGljT3B0aW9uKG9wdGlvbnMpXG4gIGNvbnN0IGNvbXBhcmF0b3IgPSB0eXBlb2YgZGV0ZXJtaW5pc3RpYyA9PT0gJ2Z1bmN0aW9uJyA/IGRldGVybWluaXN0aWMgOiB1bmRlZmluZWRcbiAgY29uc3QgbWF4aW11bURlcHRoID0gZ2V0UG9zaXRpdmVJbnRlZ2VyT3B0aW9uKG9wdGlvbnMsICdtYXhpbXVtRGVwdGgnKVxuICBjb25zdCBtYXhpbXVtQnJlYWR0aCA9IGdldFBvc2l0aXZlSW50ZWdlck9wdGlvbihvcHRpb25zLCAnbWF4aW11bUJyZWFkdGgnKVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeUZuUmVwbGFjZXIgKGtleSwgcGFyZW50LCBzdGFjaywgcmVwbGFjZXIsIHNwYWNlciwgaW5kZW50YXRpb24pIHtcbiAgICBsZXQgdmFsdWUgPSBwYXJlbnRba2V5XVxuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oa2V5KVxuICAgIH1cbiAgICB2YWx1ZSA9IHJlcGxhY2VyLmNhbGwocGFyZW50LCBrZXksIHZhbHVlKVxuXG4gICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiBzdHJFc2NhcGUodmFsdWUpXG4gICAgICBjYXNlICdvYmplY3QnOiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiAnbnVsbCdcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhY2suaW5kZXhPZih2YWx1ZSkgIT09IC0xKSB7XG4gICAgICAgICAgcmV0dXJuIGNpcmN1bGFyVmFsdWVcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXMgPSAnJ1xuICAgICAgICBsZXQgam9pbiA9ICcsJ1xuICAgICAgICBjb25zdCBvcmlnaW5hbEluZGVudGF0aW9uID0gaW5kZW50YXRpb25cblxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1tdJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobWF4aW11bURlcHRoIDwgc3RhY2subGVuZ3RoICsgMSkge1xuICAgICAgICAgICAgcmV0dXJuICdcIltBcnJheV1cIidcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhY2sucHVzaCh2YWx1ZSlcbiAgICAgICAgICBpZiAoc3BhY2VyICE9PSAnJykge1xuICAgICAgICAgICAgaW5kZW50YXRpb24gKz0gc3BhY2VyXG4gICAgICAgICAgICByZXMgKz0gYFxcbiR7aW5kZW50YXRpb259YFxuICAgICAgICAgICAgam9pbiA9IGAsXFxuJHtpbmRlbnRhdGlvbn1gXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IG1heGltdW1WYWx1ZXNUb1N0cmluZ2lmeSA9IE1hdGgubWluKHZhbHVlLmxlbmd0aCwgbWF4aW11bUJyZWFkdGgpXG4gICAgICAgICAgbGV0IGkgPSAwXG4gICAgICAgICAgZm9yICg7IGkgPCBtYXhpbXVtVmFsdWVzVG9TdHJpbmdpZnkgLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IHN0cmluZ2lmeUZuUmVwbGFjZXIoU3RyaW5nKGkpLCB2YWx1ZSwgc3RhY2ssIHJlcGxhY2VyLCBzcGFjZXIsIGluZGVudGF0aW9uKVxuICAgICAgICAgICAgcmVzICs9IHRtcCAhPT0gdW5kZWZpbmVkID8gdG1wIDogJ251bGwnXG4gICAgICAgICAgICByZXMgKz0gam9pblxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB0bXAgPSBzdHJpbmdpZnlGblJlcGxhY2VyKFN0cmluZyhpKSwgdmFsdWUsIHN0YWNrLCByZXBsYWNlciwgc3BhY2VyLCBpbmRlbnRhdGlvbilcbiAgICAgICAgICByZXMgKz0gdG1wICE9PSB1bmRlZmluZWQgPyB0bXAgOiAnbnVsbCdcbiAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoIC0gMSA+IG1heGltdW1CcmVhZHRoKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkS2V5cyA9IHZhbHVlLmxlbmd0aCAtIG1heGltdW1CcmVhZHRoIC0gMVxuICAgICAgICAgICAgcmVzICs9IGAke2pvaW59XCIuLi4gJHtnZXRJdGVtQ291bnQocmVtb3ZlZEtleXMpfSBub3Qgc3RyaW5naWZpZWRcImBcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHNwYWNlciAhPT0gJycpIHtcbiAgICAgICAgICAgIHJlcyArPSBgXFxuJHtvcmlnaW5hbEluZGVudGF0aW9ufWBcbiAgICAgICAgICB9XG4gICAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgICByZXR1cm4gYFske3Jlc31dYFxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSlcbiAgICAgICAgY29uc3Qga2V5TGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICAgaWYgKGtleUxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAne30nXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heGltdW1EZXB0aCA8IHN0YWNrLmxlbmd0aCArIDEpIHtcbiAgICAgICAgICByZXR1cm4gJ1wiW09iamVjdF1cIidcbiAgICAgICAgfVxuICAgICAgICBsZXQgd2hpdGVzcGFjZSA9ICcnXG4gICAgICAgIGxldCBzZXBhcmF0b3IgPSAnJ1xuICAgICAgICBpZiAoc3BhY2VyICE9PSAnJykge1xuICAgICAgICAgIGluZGVudGF0aW9uICs9IHNwYWNlclxuICAgICAgICAgIGpvaW4gPSBgLFxcbiR7aW5kZW50YXRpb259YFxuICAgICAgICAgIHdoaXRlc3BhY2UgPSAnICdcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXhpbXVtUHJvcGVydGllc1RvU3RyaW5naWZ5ID0gTWF0aC5taW4oa2V5TGVuZ3RoLCBtYXhpbXVtQnJlYWR0aClcbiAgICAgICAgaWYgKGRldGVybWluaXN0aWMgJiYgIWlzVHlwZWRBcnJheVdpdGhFbnRyaWVzKHZhbHVlKSkge1xuICAgICAgICAgIGtleXMgPSBzb3J0KGtleXMsIGNvbXBhcmF0b3IpXG4gICAgICAgIH1cbiAgICAgICAgc3RhY2sucHVzaCh2YWx1ZSlcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhpbXVtUHJvcGVydGllc1RvU3RyaW5naWZ5OyBpKyspIHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldXG4gICAgICAgICAgY29uc3QgdG1wID0gc3RyaW5naWZ5Rm5SZXBsYWNlcihrZXksIHZhbHVlLCBzdGFjaywgcmVwbGFjZXIsIHNwYWNlciwgaW5kZW50YXRpb24pXG4gICAgICAgICAgaWYgKHRtcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXMgKz0gYCR7c2VwYXJhdG9yfSR7c3RyRXNjYXBlKGtleSl9OiR7d2hpdGVzcGFjZX0ke3RtcH1gXG4gICAgICAgICAgICBzZXBhcmF0b3IgPSBqb2luXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChrZXlMZW5ndGggPiBtYXhpbXVtQnJlYWR0aCkge1xuICAgICAgICAgIGNvbnN0IHJlbW92ZWRLZXlzID0ga2V5TGVuZ3RoIC0gbWF4aW11bUJyZWFkdGhcbiAgICAgICAgICByZXMgKz0gYCR7c2VwYXJhdG9yfVwiLi4uXCI6JHt3aGl0ZXNwYWNlfVwiJHtnZXRJdGVtQ291bnQocmVtb3ZlZEtleXMpfSBub3Qgc3RyaW5naWZpZWRcImBcbiAgICAgICAgICBzZXBhcmF0b3IgPSBqb2luXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNwYWNlciAhPT0gJycgJiYgc2VwYXJhdG9yLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICByZXMgPSBgXFxuJHtpbmRlbnRhdGlvbn0ke3Jlc31cXG4ke29yaWdpbmFsSW5kZW50YXRpb259YFxuICAgICAgICB9XG4gICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgIHJldHVybiBgeyR7cmVzfX1gXG4gICAgICB9XG4gICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICByZXR1cm4gaXNGaW5pdGUodmFsdWUpID8gU3RyaW5nKHZhbHVlKSA6IGZhaWwgPyBmYWlsKHZhbHVlKSA6ICdudWxsJ1xuICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdHJ1ZSA/ICd0cnVlJyA6ICdmYWxzZSdcbiAgICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIGNhc2UgJ2JpZ2ludCc6XG4gICAgICAgIGlmIChiaWdpbnQpIHtcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKVxuICAgICAgICB9XG4gICAgICAgIC8vIGZhbGx0aHJvdWdoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZmFpbCA/IGZhaWwodmFsdWUpIDogdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3RyaW5naWZ5QXJyYXlSZXBsYWNlciAoa2V5LCB2YWx1ZSwgc3RhY2ssIHJlcGxhY2VyLCBzcGFjZXIsIGluZGVudGF0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oa2V5KVxuICAgIH1cblxuICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICByZXR1cm4gc3RyRXNjYXBlKHZhbHVlKVxuICAgICAgY2FzZSAnb2JqZWN0Jzoge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gJ251bGwnXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YWNrLmluZGV4T2YodmFsdWUpICE9PSAtMSkge1xuICAgICAgICAgIHJldHVybiBjaXJjdWxhclZhbHVlXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcmlnaW5hbEluZGVudGF0aW9uID0gaW5kZW50YXRpb25cbiAgICAgICAgbGV0IHJlcyA9ICcnXG4gICAgICAgIGxldCBqb2luID0gJywnXG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICdbXSdcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKG1heGltdW1EZXB0aCA8IHN0YWNrLmxlbmd0aCArIDEpIHtcbiAgICAgICAgICAgIHJldHVybiAnXCJbQXJyYXldXCInXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YWNrLnB1c2godmFsdWUpXG4gICAgICAgICAgaWYgKHNwYWNlciAhPT0gJycpIHtcbiAgICAgICAgICAgIGluZGVudGF0aW9uICs9IHNwYWNlclxuICAgICAgICAgICAgcmVzICs9IGBcXG4ke2luZGVudGF0aW9ufWBcbiAgICAgICAgICAgIGpvaW4gPSBgLFxcbiR7aW5kZW50YXRpb259YFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBtYXhpbXVtVmFsdWVzVG9TdHJpbmdpZnkgPSBNYXRoLm1pbih2YWx1ZS5sZW5ndGgsIG1heGltdW1CcmVhZHRoKVxuICAgICAgICAgIGxldCBpID0gMFxuICAgICAgICAgIGZvciAoOyBpIDwgbWF4aW11bVZhbHVlc1RvU3RyaW5naWZ5IC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCB0bXAgPSBzdHJpbmdpZnlBcnJheVJlcGxhY2VyKFN0cmluZyhpKSwgdmFsdWVbaV0sIHN0YWNrLCByZXBsYWNlciwgc3BhY2VyLCBpbmRlbnRhdGlvbilcbiAgICAgICAgICAgIHJlcyArPSB0bXAgIT09IHVuZGVmaW5lZCA/IHRtcCA6ICdudWxsJ1xuICAgICAgICAgICAgcmVzICs9IGpvaW5cbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgdG1wID0gc3RyaW5naWZ5QXJyYXlSZXBsYWNlcihTdHJpbmcoaSksIHZhbHVlW2ldLCBzdGFjaywgcmVwbGFjZXIsIHNwYWNlciwgaW5kZW50YXRpb24pXG4gICAgICAgICAgcmVzICs9IHRtcCAhPT0gdW5kZWZpbmVkID8gdG1wIDogJ251bGwnXG4gICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCAtIDEgPiBtYXhpbXVtQnJlYWR0aCkge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZEtleXMgPSB2YWx1ZS5sZW5ndGggLSBtYXhpbXVtQnJlYWR0aCAtIDFcbiAgICAgICAgICAgIHJlcyArPSBgJHtqb2lufVwiLi4uICR7Z2V0SXRlbUNvdW50KHJlbW92ZWRLZXlzKX0gbm90IHN0cmluZ2lmaWVkXCJgXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzcGFjZXIgIT09ICcnKSB7XG4gICAgICAgICAgICByZXMgKz0gYFxcbiR7b3JpZ2luYWxJbmRlbnRhdGlvbn1gXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgcmV0dXJuIGBbJHtyZXN9XWBcbiAgICAgICAgfVxuICAgICAgICBzdGFjay5wdXNoKHZhbHVlKVxuICAgICAgICBsZXQgd2hpdGVzcGFjZSA9ICcnXG4gICAgICAgIGlmIChzcGFjZXIgIT09ICcnKSB7XG4gICAgICAgICAgaW5kZW50YXRpb24gKz0gc3BhY2VyXG4gICAgICAgICAgam9pbiA9IGAsXFxuJHtpbmRlbnRhdGlvbn1gXG4gICAgICAgICAgd2hpdGVzcGFjZSA9ICcgJ1xuICAgICAgICB9XG4gICAgICAgIGxldCBzZXBhcmF0b3IgPSAnJ1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiByZXBsYWNlcikge1xuICAgICAgICAgIGNvbnN0IHRtcCA9IHN0cmluZ2lmeUFycmF5UmVwbGFjZXIoa2V5LCB2YWx1ZVtrZXldLCBzdGFjaywgcmVwbGFjZXIsIHNwYWNlciwgaW5kZW50YXRpb24pXG4gICAgICAgICAgaWYgKHRtcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXMgKz0gYCR7c2VwYXJhdG9yfSR7c3RyRXNjYXBlKGtleSl9OiR7d2hpdGVzcGFjZX0ke3RtcH1gXG4gICAgICAgICAgICBzZXBhcmF0b3IgPSBqb2luXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzcGFjZXIgIT09ICcnICYmIHNlcGFyYXRvci5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgcmVzID0gYFxcbiR7aW5kZW50YXRpb259JHtyZXN9XFxuJHtvcmlnaW5hbEluZGVudGF0aW9ufWBcbiAgICAgICAgfVxuICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICByZXR1cm4gYHske3Jlc319YFxuICAgICAgfVxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiBmYWlsID8gZmFpbCh2YWx1ZSkgOiAnbnVsbCdcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgPyAndHJ1ZScgOiAnZmFsc2UnXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBjYXNlICdiaWdpbnQnOlxuICAgICAgICBpZiAoYmlnaW50KSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICAvLyBmYWxsdGhyb3VnaFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhaWwgPyBmYWlsKHZhbHVlKSA6IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeUluZGVudCAoa2V5LCB2YWx1ZSwgc3RhY2ssIHNwYWNlciwgaW5kZW50YXRpb24pIHtcbiAgICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgcmV0dXJuIHN0ckVzY2FwZSh2YWx1ZSlcbiAgICAgIGNhc2UgJ29iamVjdCc6IHtcbiAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuICdudWxsJ1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUudG9KU09OID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oa2V5KVxuICAgICAgICAgIC8vIFByZXZlbnQgY2FsbGluZyBgdG9KU09OYCBhZ2Fpbi5cbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmeUluZGVudChrZXksIHZhbHVlLCBzdGFjaywgc3BhY2VyLCBpbmRlbnRhdGlvbilcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ251bGwnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFjay5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gY2lyY3VsYXJWYWx1ZVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsSW5kZW50YXRpb24gPSBpbmRlbnRhdGlvblxuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnW10nXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtYXhpbXVtRGVwdGggPCBzdGFjay5sZW5ndGggKyAxKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1wiW0FycmF5XVwiJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKVxuICAgICAgICAgIGluZGVudGF0aW9uICs9IHNwYWNlclxuICAgICAgICAgIGxldCByZXMgPSBgXFxuJHtpbmRlbnRhdGlvbn1gXG4gICAgICAgICAgY29uc3Qgam9pbiA9IGAsXFxuJHtpbmRlbnRhdGlvbn1gXG4gICAgICAgICAgY29uc3QgbWF4aW11bVZhbHVlc1RvU3RyaW5naWZ5ID0gTWF0aC5taW4odmFsdWUubGVuZ3RoLCBtYXhpbXVtQnJlYWR0aClcbiAgICAgICAgICBsZXQgaSA9IDBcbiAgICAgICAgICBmb3IgKDsgaSA8IG1heGltdW1WYWx1ZXNUb1N0cmluZ2lmeSAtIDE7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdG1wID0gc3RyaW5naWZ5SW5kZW50KFN0cmluZyhpKSwgdmFsdWVbaV0sIHN0YWNrLCBzcGFjZXIsIGluZGVudGF0aW9uKVxuICAgICAgICAgICAgcmVzICs9IHRtcCAhPT0gdW5kZWZpbmVkID8gdG1wIDogJ251bGwnXG4gICAgICAgICAgICByZXMgKz0gam9pblxuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB0bXAgPSBzdHJpbmdpZnlJbmRlbnQoU3RyaW5nKGkpLCB2YWx1ZVtpXSwgc3RhY2ssIHNwYWNlciwgaW5kZW50YXRpb24pXG4gICAgICAgICAgcmVzICs9IHRtcCAhPT0gdW5kZWZpbmVkID8gdG1wIDogJ251bGwnXG4gICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCAtIDEgPiBtYXhpbXVtQnJlYWR0aCkge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZEtleXMgPSB2YWx1ZS5sZW5ndGggLSBtYXhpbXVtQnJlYWR0aCAtIDFcbiAgICAgICAgICAgIHJlcyArPSBgJHtqb2lufVwiLi4uICR7Z2V0SXRlbUNvdW50KHJlbW92ZWRLZXlzKX0gbm90IHN0cmluZ2lmaWVkXCJgXG4gICAgICAgICAgfVxuICAgICAgICAgIHJlcyArPSBgXFxuJHtvcmlnaW5hbEluZGVudGF0aW9ufWBcbiAgICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICAgIHJldHVybiBgWyR7cmVzfV1gXG4gICAgICAgIH1cblxuICAgICAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKVxuICAgICAgICBjb25zdCBrZXlMZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgICBpZiAoa2V5TGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuICd7fSdcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF4aW11bURlcHRoIDwgc3RhY2subGVuZ3RoICsgMSkge1xuICAgICAgICAgIHJldHVybiAnXCJbT2JqZWN0XVwiJ1xuICAgICAgICB9XG4gICAgICAgIGluZGVudGF0aW9uICs9IHNwYWNlclxuICAgICAgICBjb25zdCBqb2luID0gYCxcXG4ke2luZGVudGF0aW9ufWBcbiAgICAgICAgbGV0IHJlcyA9ICcnXG4gICAgICAgIGxldCBzZXBhcmF0b3IgPSAnJ1xuICAgICAgICBsZXQgbWF4aW11bVByb3BlcnRpZXNUb1N0cmluZ2lmeSA9IE1hdGgubWluKGtleUxlbmd0aCwgbWF4aW11bUJyZWFkdGgpXG4gICAgICAgIGlmIChpc1R5cGVkQXJyYXlXaXRoRW50cmllcyh2YWx1ZSkpIHtcbiAgICAgICAgICByZXMgKz0gc3RyaW5naWZ5VHlwZWRBcnJheSh2YWx1ZSwgam9pbiwgbWF4aW11bUJyZWFkdGgpXG4gICAgICAgICAga2V5cyA9IGtleXMuc2xpY2UodmFsdWUubGVuZ3RoKVxuICAgICAgICAgIG1heGltdW1Qcm9wZXJ0aWVzVG9TdHJpbmdpZnkgLT0gdmFsdWUubGVuZ3RoXG4gICAgICAgICAgc2VwYXJhdG9yID0gam9pblxuICAgICAgICB9XG4gICAgICAgIGlmIChkZXRlcm1pbmlzdGljKSB7XG4gICAgICAgICAga2V5cyA9IHNvcnQoa2V5cywgY29tcGFyYXRvcilcbiAgICAgICAgfVxuICAgICAgICBzdGFjay5wdXNoKHZhbHVlKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heGltdW1Qcm9wZXJ0aWVzVG9TdHJpbmdpZnk7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV1cbiAgICAgICAgICBjb25zdCB0bXAgPSBzdHJpbmdpZnlJbmRlbnQoa2V5LCB2YWx1ZVtrZXldLCBzdGFjaywgc3BhY2VyLCBpbmRlbnRhdGlvbilcbiAgICAgICAgICBpZiAodG1wICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlcyArPSBgJHtzZXBhcmF0b3J9JHtzdHJFc2NhcGUoa2V5KX06ICR7dG1wfWBcbiAgICAgICAgICAgIHNlcGFyYXRvciA9IGpvaW5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleUxlbmd0aCA+IG1heGltdW1CcmVhZHRoKSB7XG4gICAgICAgICAgY29uc3QgcmVtb3ZlZEtleXMgPSBrZXlMZW5ndGggLSBtYXhpbXVtQnJlYWR0aFxuICAgICAgICAgIHJlcyArPSBgJHtzZXBhcmF0b3J9XCIuLi5cIjogXCIke2dldEl0ZW1Db3VudChyZW1vdmVkS2V5cyl9IG5vdCBzdHJpbmdpZmllZFwiYFxuICAgICAgICAgIHNlcGFyYXRvciA9IGpvaW5cbiAgICAgICAgfVxuICAgICAgICBpZiAoc2VwYXJhdG9yICE9PSAnJykge1xuICAgICAgICAgIHJlcyA9IGBcXG4ke2luZGVudGF0aW9ufSR7cmVzfVxcbiR7b3JpZ2luYWxJbmRlbnRhdGlvbn1gXG4gICAgICAgIH1cbiAgICAgICAgc3RhY2sucG9wKClcbiAgICAgICAgcmV0dXJuIGB7JHtyZXN9fWBcbiAgICAgIH1cbiAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgIHJldHVybiBpc0Zpbml0ZSh2YWx1ZSkgPyBTdHJpbmcodmFsdWUpIDogZmFpbCA/IGZhaWwodmFsdWUpIDogJ251bGwnXG4gICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlID8gJ3RydWUnIDogJ2ZhbHNlJ1xuICAgICAgY2FzZSAndW5kZWZpbmVkJzpcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgY2FzZSAnYmlnaW50JzpcbiAgICAgICAgaWYgKGJpZ2ludCkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpXG4gICAgICAgIH1cbiAgICAgICAgLy8gZmFsbHRocm91Z2hcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmYWlsID8gZmFpbCh2YWx1ZSkgOiB1bmRlZmluZWRcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdHJpbmdpZnlTaW1wbGUgKGtleSwgdmFsdWUsIHN0YWNrKSB7XG4gICAgc3dpdGNoICh0eXBlb2YgdmFsdWUpIHtcbiAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgIHJldHVybiBzdHJFc2NhcGUodmFsdWUpXG4gICAgICBjYXNlICdvYmplY3QnOiB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiAnbnVsbCdcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKGtleSlcbiAgICAgICAgICAvLyBQcmV2ZW50IGNhbGxpbmcgYHRvSlNPTmAgYWdhaW5cbiAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ2lmeVNpbXBsZShrZXksIHZhbHVlLCBzdGFjaylcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gJ251bGwnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChzdGFjay5pbmRleE9mKHZhbHVlKSAhPT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gY2lyY3VsYXJWYWx1ZVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlcyA9ICcnXG5cbiAgICAgICAgY29uc3QgaGFzTGVuZ3RoID0gdmFsdWUubGVuZ3RoICE9PSB1bmRlZmluZWRcbiAgICAgICAgaWYgKGhhc0xlbmd0aCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAnW10nXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChtYXhpbXVtRGVwdGggPCBzdGFjay5sZW5ndGggKyAxKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1wiW0FycmF5XVwiJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdGFjay5wdXNoKHZhbHVlKVxuICAgICAgICAgIGNvbnN0IG1heGltdW1WYWx1ZXNUb1N0cmluZ2lmeSA9IE1hdGgubWluKHZhbHVlLmxlbmd0aCwgbWF4aW11bUJyZWFkdGgpXG4gICAgICAgICAgbGV0IGkgPSAwXG4gICAgICAgICAgZm9yICg7IGkgPCBtYXhpbXVtVmFsdWVzVG9TdHJpbmdpZnkgLSAxOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHRtcCA9IHN0cmluZ2lmeVNpbXBsZShTdHJpbmcoaSksIHZhbHVlW2ldLCBzdGFjaylcbiAgICAgICAgICAgIHJlcyArPSB0bXAgIT09IHVuZGVmaW5lZCA/IHRtcCA6ICdudWxsJ1xuICAgICAgICAgICAgcmVzICs9ICcsJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB0bXAgPSBzdHJpbmdpZnlTaW1wbGUoU3RyaW5nKGkpLCB2YWx1ZVtpXSwgc3RhY2spXG4gICAgICAgICAgcmVzICs9IHRtcCAhPT0gdW5kZWZpbmVkID8gdG1wIDogJ251bGwnXG4gICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCAtIDEgPiBtYXhpbXVtQnJlYWR0aCkge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZEtleXMgPSB2YWx1ZS5sZW5ndGggLSBtYXhpbXVtQnJlYWR0aCAtIDFcbiAgICAgICAgICAgIHJlcyArPSBgLFwiLi4uICR7Z2V0SXRlbUNvdW50KHJlbW92ZWRLZXlzKX0gbm90IHN0cmluZ2lmaWVkXCJgXG4gICAgICAgICAgfVxuICAgICAgICAgIHN0YWNrLnBvcCgpXG4gICAgICAgICAgcmV0dXJuIGBbJHtyZXN9XWBcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpXG4gICAgICAgIGNvbnN0IGtleUxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgICAgIGlmIChrZXlMZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gJ3t9J1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhpbXVtRGVwdGggPCBzdGFjay5sZW5ndGggKyAxKSB7XG4gICAgICAgICAgcmV0dXJuICdcIltPYmplY3RdXCInXG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNlcGFyYXRvciA9ICcnXG4gICAgICAgIGxldCBtYXhpbXVtUHJvcGVydGllc1RvU3RyaW5naWZ5ID0gTWF0aC5taW4oa2V5TGVuZ3RoLCBtYXhpbXVtQnJlYWR0aClcbiAgICAgICAgaWYgKGhhc0xlbmd0aCAmJiBpc1R5cGVkQXJyYXlXaXRoRW50cmllcyh2YWx1ZSkpIHtcbiAgICAgICAgICByZXMgKz0gc3RyaW5naWZ5VHlwZWRBcnJheSh2YWx1ZSwgJywnLCBtYXhpbXVtQnJlYWR0aClcbiAgICAgICAgICBrZXlzID0ga2V5cy5zbGljZSh2YWx1ZS5sZW5ndGgpXG4gICAgICAgICAgbWF4aW11bVByb3BlcnRpZXNUb1N0cmluZ2lmeSAtPSB2YWx1ZS5sZW5ndGhcbiAgICAgICAgICBzZXBhcmF0b3IgPSAnLCdcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGV0ZXJtaW5pc3RpYykge1xuICAgICAgICAgIGtleXMgPSBzb3J0KGtleXMsIGNvbXBhcmF0b3IpXG4gICAgICAgIH1cbiAgICAgICAgc3RhY2sucHVzaCh2YWx1ZSlcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXhpbXVtUHJvcGVydGllc1RvU3RyaW5naWZ5OyBpKyspIHtcbiAgICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2ldXG4gICAgICAgICAgY29uc3QgdG1wID0gc3RyaW5naWZ5U2ltcGxlKGtleSwgdmFsdWVba2V5XSwgc3RhY2spXG4gICAgICAgICAgaWYgKHRtcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXMgKz0gYCR7c2VwYXJhdG9yfSR7c3RyRXNjYXBlKGtleSl9OiR7dG1wfWBcbiAgICAgICAgICAgIHNlcGFyYXRvciA9ICcsJ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5TGVuZ3RoID4gbWF4aW11bUJyZWFkdGgpIHtcbiAgICAgICAgICBjb25zdCByZW1vdmVkS2V5cyA9IGtleUxlbmd0aCAtIG1heGltdW1CcmVhZHRoXG4gICAgICAgICAgcmVzICs9IGAke3NlcGFyYXRvcn1cIi4uLlwiOlwiJHtnZXRJdGVtQ291bnQocmVtb3ZlZEtleXMpfSBub3Qgc3RyaW5naWZpZWRcImBcbiAgICAgICAgfVxuICAgICAgICBzdGFjay5wb3AoKVxuICAgICAgICByZXR1cm4gYHske3Jlc319YFxuICAgICAgfVxuICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgcmV0dXJuIGlzRmluaXRlKHZhbHVlKSA/IFN0cmluZyh2YWx1ZSkgOiBmYWlsID8gZmFpbCh2YWx1ZSkgOiAnbnVsbCdcbiAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgPyAndHJ1ZScgOiAnZmFsc2UnXG4gICAgICBjYXNlICd1bmRlZmluZWQnOlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICBjYXNlICdiaWdpbnQnOlxuICAgICAgICBpZiAoYmlnaW50KSB7XG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICAvLyBmYWxsdGhyb3VnaFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZhaWwgPyBmYWlsKHZhbHVlKSA6IHVuZGVmaW5lZFxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHN0cmluZ2lmeSAodmFsdWUsIHJlcGxhY2VyLCBzcGFjZSkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgbGV0IHNwYWNlciA9ICcnXG4gICAgICBpZiAodHlwZW9mIHNwYWNlID09PSAnbnVtYmVyJykge1xuICAgICAgICBzcGFjZXIgPSAnICcucmVwZWF0KE1hdGgubWluKHNwYWNlLCAxMCkpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgc3BhY2VyID0gc3BhY2Uuc2xpY2UoMCwgMTApXG4gICAgICB9XG4gICAgICBpZiAocmVwbGFjZXIgIT0gbnVsbCkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcGxhY2VyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIHN0cmluZ2lmeUZuUmVwbGFjZXIoJycsIHsgJyc6IHZhbHVlIH0sIFtdLCByZXBsYWNlciwgc3BhY2VyLCAnJylcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXBsYWNlcikpIHtcbiAgICAgICAgICByZXR1cm4gc3RyaW5naWZ5QXJyYXlSZXBsYWNlcignJywgdmFsdWUsIFtdLCBnZXRVbmlxdWVSZXBsYWNlclNldChyZXBsYWNlciksIHNwYWNlciwgJycpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzcGFjZXIubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdpZnlJbmRlbnQoJycsIHZhbHVlLCBbXSwgc3BhY2VyLCAnJylcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZ2lmeVNpbXBsZSgnJywgdmFsdWUsIFtdKVxuICB9XG5cbiAgcmV0dXJuIHN0cmluZ2lmeVxufVxuIiwgIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBtZXRhZGF0YSA9IFN5bWJvbC5mb3IoJ3Bpbm8ubWV0YWRhdGEnKVxuY29uc3QgeyBERUZBVUxUX0xFVkVMUyB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKVxuXG5jb25zdCBERUZBVUxUX0lORk9fTEVWRUwgPSBERUZBVUxUX0xFVkVMUy5pbmZvXG5cbmZ1bmN0aW9uIG11bHRpc3RyZWFtIChzdHJlYW1zQXJyYXksIG9wdHMpIHtcbiAgc3RyZWFtc0FycmF5ID0gc3RyZWFtc0FycmF5IHx8IFtdXG4gIG9wdHMgPSBvcHRzIHx8IHsgZGVkdXBlOiBmYWxzZSB9XG5cbiAgY29uc3Qgc3RyZWFtTGV2ZWxzID0gT2JqZWN0LmNyZWF0ZShERUZBVUxUX0xFVkVMUylcbiAgc3RyZWFtTGV2ZWxzLnNpbGVudCA9IEluZmluaXR5XG4gIGlmIChvcHRzLmxldmVscyAmJiB0eXBlb2Ygb3B0cy5sZXZlbHMgPT09ICdvYmplY3QnKSB7XG4gICAgT2JqZWN0LmtleXMob3B0cy5sZXZlbHMpLmZvckVhY2goaSA9PiB7XG4gICAgICBzdHJlYW1MZXZlbHNbaV0gPSBvcHRzLmxldmVsc1tpXVxuICAgIH0pXG4gIH1cblxuICBjb25zdCByZXMgPSB7XG4gICAgd3JpdGUsXG4gICAgYWRkLFxuICAgIHJlbW92ZSxcbiAgICBlbWl0LFxuICAgIGZsdXNoU3luYyxcbiAgICBlbmQsXG4gICAgbWluTGV2ZWw6IDAsXG4gICAgbGFzdElkOiAwLFxuICAgIHN0cmVhbXM6IFtdLFxuICAgIGNsb25lLFxuICAgIFttZXRhZGF0YV06IHRydWUsXG4gICAgc3RyZWFtTGV2ZWxzXG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShzdHJlYW1zQXJyYXkpKSB7XG4gICAgc3RyZWFtc0FycmF5LmZvckVhY2goYWRkLCByZXMpXG4gIH0gZWxzZSB7XG4gICAgYWRkLmNhbGwocmVzLCBzdHJlYW1zQXJyYXkpXG4gIH1cblxuICAvLyBjbGVhbiB0aGlzIG9iamVjdCB1cFxuICAvLyBvciBpdCB3aWxsIHN0YXkgYWxsb2NhdGVkIGZvcmV2ZXJcbiAgLy8gYXMgaXQgaXMgY2xvc2VkIG9uIHRoZSBmb2xsb3dpbmcgY2xvc3VyZXNcbiAgc3RyZWFtc0FycmF5ID0gbnVsbFxuXG4gIHJldHVybiByZXNcblxuICAvLyB3ZSBjYW4gZXhpdCBlYXJseSBiZWNhdXNlIHRoZSBzdHJlYW1zIGFyZSBvcmRlcmVkIGJ5IGxldmVsXG4gIGZ1bmN0aW9uIHdyaXRlIChkYXRhKSB7XG4gICAgbGV0IGRlc3RcbiAgICBjb25zdCBsZXZlbCA9IHRoaXMubGFzdExldmVsXG4gICAgY29uc3QgeyBzdHJlYW1zIH0gPSB0aGlzXG4gICAgLy8gZm9yIGhhbmRsaW5nIHNpdHVhdGlvbiB3aGVuIHNldmVyYWwgc3RyZWFtcyBoYXMgdGhlIHNhbWUgbGV2ZWxcbiAgICBsZXQgcmVjb3JkZWRMZXZlbCA9IDBcbiAgICBsZXQgc3RyZWFtXG5cbiAgICAvLyBpZiBkZWR1cGUgc2V0IHRvIHRydWUgd2Ugc2VuZCBsb2dzIHRvIHRoZSBzdHJlYW0gd2l0aCB0aGUgaGlnaGVzdCBsZXZlbFxuICAgIC8vIHRoZXJlZm9yZSwgd2UgaGF2ZSB0byBjaGFuZ2Ugc29ydGluZyBvcmRlclxuICAgIGZvciAobGV0IGkgPSBpbml0TG9vcFZhcihzdHJlYW1zLmxlbmd0aCwgb3B0cy5kZWR1cGUpOyBjaGVja0xvb3BWYXIoaSwgc3RyZWFtcy5sZW5ndGgsIG9wdHMuZGVkdXBlKTsgaSA9IGFkanVzdExvb3BWYXIoaSwgb3B0cy5kZWR1cGUpKSB7XG4gICAgICBkZXN0ID0gc3RyZWFtc1tpXVxuICAgICAgaWYgKGRlc3QubGV2ZWwgPD0gbGV2ZWwpIHtcbiAgICAgICAgaWYgKHJlY29yZGVkTGV2ZWwgIT09IDAgJiYgcmVjb3JkZWRMZXZlbCAhPT0gZGVzdC5sZXZlbCkge1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgc3RyZWFtID0gZGVzdC5zdHJlYW1cbiAgICAgICAgaWYgKHN0cmVhbVttZXRhZGF0YV0pIHtcbiAgICAgICAgICBjb25zdCB7IGxhc3RUaW1lLCBsYXN0TXNnLCBsYXN0T2JqLCBsYXN0TG9nZ2VyIH0gPSB0aGlzXG4gICAgICAgICAgc3RyZWFtLmxhc3RMZXZlbCA9IGxldmVsXG4gICAgICAgICAgc3RyZWFtLmxhc3RUaW1lID0gbGFzdFRpbWVcbiAgICAgICAgICBzdHJlYW0ubGFzdE1zZyA9IGxhc3RNc2dcbiAgICAgICAgICBzdHJlYW0ubGFzdE9iaiA9IGxhc3RPYmpcbiAgICAgICAgICBzdHJlYW0ubGFzdExvZ2dlciA9IGxhc3RMb2dnZXJcbiAgICAgICAgfVxuICAgICAgICBzdHJlYW0ud3JpdGUoZGF0YSlcbiAgICAgICAgaWYgKG9wdHMuZGVkdXBlKSB7XG4gICAgICAgICAgcmVjb3JkZWRMZXZlbCA9IGRlc3QubGV2ZWxcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghb3B0cy5kZWR1cGUpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlbWl0ICguLi5hcmdzKSB7XG4gICAgZm9yIChjb25zdCB7IHN0cmVhbSB9IG9mIHRoaXMuc3RyZWFtcykge1xuICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZW1pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzdHJlYW0uZW1pdCguLi5hcmdzKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoU3luYyAoKSB7XG4gICAgZm9yIChjb25zdCB7IHN0cmVhbSB9IG9mIHRoaXMuc3RyZWFtcykge1xuICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZmx1c2hTeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHN0cmVhbS5mbHVzaFN5bmMoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZCAoZGVzdCkge1xuICAgIGlmICghZGVzdCkge1xuICAgICAgcmV0dXJuIHJlc1xuICAgIH1cblxuICAgIC8vIENoZWNrIHRoYXQgZGVzdCBpbXBsZW1lbnRzIGVpdGhlciBTdHJlYW1FbnRyeSBvciBEZXN0aW5hdGlvblN0cmVhbVxuICAgIGNvbnN0IGlzU3RyZWFtID0gdHlwZW9mIGRlc3Qud3JpdGUgPT09ICdmdW5jdGlvbicgfHwgZGVzdC5zdHJlYW1cbiAgICBjb25zdCBzdHJlYW1fID0gZGVzdC53cml0ZSA/IGRlc3QgOiBkZXN0LnN0cmVhbVxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIHByb3ZpZGUgYSBtZWFuaW5nZnVsIGVycm9yIG1lc3NhZ2UsIG90aGVyd2lzZSBpdCB0aHJvd3Mgc29tZXdoZXJlIGluc2lkZSB3cml0ZSgpXG4gICAgaWYgKCFpc1N0cmVhbSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ3N0cmVhbSBvYmplY3QgbmVlZHMgdG8gaW1wbGVtZW50IGVpdGhlciBTdHJlYW1FbnRyeSBvciBEZXN0aW5hdGlvblN0cmVhbSBpbnRlcmZhY2UnKVxuICAgIH1cblxuICAgIGNvbnN0IHsgc3RyZWFtcywgc3RyZWFtTGV2ZWxzIH0gPSB0aGlzXG5cbiAgICBsZXQgbGV2ZWxcbiAgICBpZiAodHlwZW9mIGRlc3QubGV2ZWxWYWwgPT09ICdudW1iZXInKSB7XG4gICAgICBsZXZlbCA9IGRlc3QubGV2ZWxWYWxcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXN0LmxldmVsID09PSAnc3RyaW5nJykge1xuICAgICAgbGV2ZWwgPSBzdHJlYW1MZXZlbHNbZGVzdC5sZXZlbF1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZXN0LmxldmVsID09PSAnbnVtYmVyJykge1xuICAgICAgbGV2ZWwgPSBkZXN0LmxldmVsXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldmVsID0gREVGQVVMVF9JTkZPX0xFVkVMXG4gICAgfVxuXG4gICAgY29uc3QgZGVzdF8gPSB7XG4gICAgICBzdHJlYW06IHN0cmVhbV8sXG4gICAgICBsZXZlbCxcbiAgICAgIGxldmVsVmFsOiB1bmRlZmluZWQsXG4gICAgICBpZDogKytyZXMubGFzdElkXG4gICAgfVxuXG4gICAgc3RyZWFtcy51bnNoaWZ0KGRlc3RfKVxuICAgIHN0cmVhbXMuc29ydChjb21wYXJlQnlMZXZlbClcblxuICAgIHRoaXMubWluTGV2ZWwgPSBzdHJlYW1zWzBdLmxldmVsXG5cbiAgICByZXR1cm4gcmVzXG4gIH1cblxuICBmdW5jdGlvbiByZW1vdmUgKGlkKSB7XG4gICAgY29uc3QgeyBzdHJlYW1zIH0gPSB0aGlzXG4gICAgY29uc3QgaW5kZXggPSBzdHJlYW1zLmZpbmRJbmRleChzID0+IHMuaWQgPT09IGlkKVxuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIHN0cmVhbXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgc3RyZWFtcy5zb3J0KGNvbXBhcmVCeUxldmVsKVxuICAgICAgdGhpcy5taW5MZXZlbCA9IHN0cmVhbXMubGVuZ3RoID4gMCA/IHN0cmVhbXNbMF0ubGV2ZWwgOiAtMVxuICAgIH1cblxuICAgIHJldHVybiByZXNcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZCAoKSB7XG4gICAgZm9yIChjb25zdCB7IHN0cmVhbSB9IG9mIHRoaXMuc3RyZWFtcykge1xuICAgICAgaWYgKHR5cGVvZiBzdHJlYW0uZmx1c2hTeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHN0cmVhbS5mbHVzaFN5bmMoKVxuICAgICAgfVxuICAgICAgc3RyZWFtLmVuZCgpXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2xvbmUgKGxldmVsKSB7XG4gICAgY29uc3Qgc3RyZWFtcyA9IG5ldyBBcnJheSh0aGlzLnN0cmVhbXMubGVuZ3RoKVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJlYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzdHJlYW1zW2ldID0ge1xuICAgICAgICBsZXZlbCxcbiAgICAgICAgc3RyZWFtOiB0aGlzLnN0cmVhbXNbaV0uc3RyZWFtXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHdyaXRlLFxuICAgICAgYWRkLFxuICAgICAgcmVtb3ZlLFxuICAgICAgbWluTGV2ZWw6IGxldmVsLFxuICAgICAgc3RyZWFtcyxcbiAgICAgIGNsb25lLFxuICAgICAgZW1pdCxcbiAgICAgIGZsdXNoU3luYyxcbiAgICAgIFttZXRhZGF0YV06IHRydWVcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGFyZUJ5TGV2ZWwgKGEsIGIpIHtcbiAgcmV0dXJuIGEubGV2ZWwgLSBiLmxldmVsXG59XG5cbmZ1bmN0aW9uIGluaXRMb29wVmFyIChsZW5ndGgsIGRlZHVwZSkge1xuICByZXR1cm4gZGVkdXBlID8gbGVuZ3RoIC0gMSA6IDBcbn1cblxuZnVuY3Rpb24gYWRqdXN0TG9vcFZhciAoaSwgZGVkdXBlKSB7XG4gIHJldHVybiBkZWR1cGUgPyBpIC0gMSA6IGkgKyAxXG59XG5cbmZ1bmN0aW9uIGNoZWNrTG9vcFZhciAoaSwgbGVuZ3RoLCBkZWR1cGUpIHtcbiAgcmV0dXJuIGRlZHVwZSA/IGkgPj0gMCA6IGkgPCBsZW5ndGhcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtdWx0aXN0cmVhbVxuIiwgIlxuICAgICAgICAgIGZ1bmN0aW9uIHBpbm9CdW5kbGVyQWJzb2x1dGVQYXRoKHApIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgICAgIC8vIEFsd2F5cyByZXNvbHZlIHRvIHRoZSBhYnNvbHV0ZSBvdXRwdXQgZGlyZWN0b3J5IHdoZXJlIHdvcmtlciBmaWxlcyBhcmUgbG9jYXRlZFxuICAgICAgICAgICAgICBjb25zdCBvdXRwdXREaXIgPSBcIi9Vc2Vycy9wYXNpbmR1bWFsaW5kYS9PUFRJTUlORF9BSS9XZWJfcHJvamVjdC9PY2Vhbl9XZWxsaWdhbWEvT2NlYW4tV2VsaWdhbWEvYXBpXCI7XG4gICAgICAgICAgICAgIHJldHVybiBwYXRoLnJlc29sdmUob3V0cHV0RGlyLCBwLnJlcGxhY2UoL15cXC5cXC8vLCAnJykpO1xuICAgICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAgIC8vIEVTTSBmYWxsYmFjazogcmVzb2x2ZSByZWxhdGl2ZSB0byB0aGlzIGJ1bmRsZSdzIGxvY2F0aW9uICBcbiAgICAgICAgICAgICAgY29uc3QgZiA9IG5ldyBGdW5jdGlvbigncCcsICdyZXR1cm4gbmV3IFVSTChwLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lJyk7XG4gICAgICAgICAgICAgIHJldHVybiBmKHApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICAgZ2xvYmFsVGhpcy5fX2J1bmRsZXJQYXRoc092ZXJyaWRlcyA9IHsgLi4uKGdsb2JhbFRoaXMuX19idW5kbGVyUGF0aHNPdmVycmlkZXMgfHwge30pLCAndGhyZWFkLXN0cmVhbS13b3JrZXInOiBwaW5vQnVuZGxlckFic29sdXRlUGF0aCgnLi90aHJlYWQtc3RyZWFtLXdvcmtlci5qcycpLCdwaW5vLXdvcmtlcic6IHBpbm9CdW5kbGVyQWJzb2x1dGVQYXRoKCcuL3Bpbm8td29ya2VyLmpzJyksJ3Bpbm8vZmlsZSc6IHBpbm9CdW5kbGVyQWJzb2x1dGVQYXRoKCcuL3Bpbm8tZmlsZS5qcycpLCdwaW5vLXByZXR0eSc6IHBpbm9CdW5kbGVyQWJzb2x1dGVQYXRoKCcuL3Bpbm8tcHJldHR5LmpzJyl9XG4gICAgICAgICd1c2Ugc3RyaWN0J1xuXG5jb25zdCBvcyA9IHJlcXVpcmUoJ25vZGU6b3MnKVxuY29uc3Qgc3RkU2VyaWFsaXplcnMgPSByZXF1aXJlKCdwaW5vLXN0ZC1zZXJpYWxpemVycycpXG5jb25zdCBjYWxsZXIgPSByZXF1aXJlKCcuL2xpYi9jYWxsZXInKVxuY29uc3QgcmVkYWN0aW9uID0gcmVxdWlyZSgnLi9saWIvcmVkYWN0aW9uJylcbmNvbnN0IHRpbWUgPSByZXF1aXJlKCcuL2xpYi90aW1lJylcbmNvbnN0IHByb3RvID0gcmVxdWlyZSgnLi9saWIvcHJvdG8nKVxuY29uc3Qgc3ltYm9scyA9IHJlcXVpcmUoJy4vbGliL3N5bWJvbHMnKVxuY29uc3QgeyBjb25maWd1cmUgfSA9IHJlcXVpcmUoJ3NhZmUtc3RhYmxlLXN0cmluZ2lmeScpXG5jb25zdCB7IGFzc2VydERlZmF1bHRMZXZlbEZvdW5kLCBtYXBwaW5ncywgZ2VuTHNDYWNoZSwgZ2VuTGV2ZWxDb21wYXJpc29uLCBhc3NlcnRMZXZlbENvbXBhcmlzb24gfSA9IHJlcXVpcmUoJy4vbGliL2xldmVscycpXG5jb25zdCB7IERFRkFVTFRfTEVWRUxTLCBTT1JUSU5HX09SREVSIH0gPSByZXF1aXJlKCcuL2xpYi9jb25zdGFudHMnKVxuY29uc3Qge1xuICBjcmVhdGVBcmdzTm9ybWFsaXplcixcbiAgYXNDaGluZGluZ3MsXG4gIGJ1aWxkU2FmZVNvbmljQm9vbSxcbiAgYnVpbGRGb3JtYXR0ZXJzLFxuICBzdHJpbmdpZnksXG4gIG5vcm1hbGl6ZURlc3RGaWxlRGVzY3JpcHRvcixcbiAgbm9vcFxufSA9IHJlcXVpcmUoJy4vbGliL3Rvb2xzJylcbmNvbnN0IHsgdmVyc2lvbiB9ID0gcmVxdWlyZSgnLi9saWIvbWV0YScpXG5jb25zdCB7XG4gIGNoaW5kaW5nc1N5bSxcbiAgcmVkYWN0Rm10U3ltLFxuICBzZXJpYWxpemVyc1N5bSxcbiAgdGltZVN5bSxcbiAgdGltZVNsaWNlSW5kZXhTeW0sXG4gIHN0cmVhbVN5bSxcbiAgc3RyaW5naWZ5U3ltLFxuICBzdHJpbmdpZnlTYWZlU3ltLFxuICBzdHJpbmdpZmllcnNTeW0sXG4gIHNldExldmVsU3ltLFxuICBlbmRTeW0sXG4gIGZvcm1hdE9wdHNTeW0sXG4gIG1lc3NhZ2VLZXlTeW0sXG4gIGVycm9yS2V5U3ltLFxuICBuZXN0ZWRLZXlTeW0sXG4gIG1peGluU3ltLFxuICBsZXZlbENvbXBTeW0sXG4gIHVzZU9ubHlDdXN0b21MZXZlbHNTeW0sXG4gIGZvcm1hdHRlcnNTeW0sXG4gIGhvb2tzU3ltLFxuICBuZXN0ZWRLZXlTdHJTeW0sXG4gIG1peGluTWVyZ2VTdHJhdGVneVN5bSxcbiAgbXNnUHJlZml4U3ltXG59ID0gc3ltYm9sc1xuY29uc3QgeyBlcG9jaFRpbWUsIG51bGxUaW1lIH0gPSB0aW1lXG5jb25zdCB7IHBpZCB9ID0gcHJvY2Vzc1xuY29uc3QgaG9zdG5hbWUgPSBvcy5ob3N0bmFtZSgpXG5jb25zdCBkZWZhdWx0RXJyb3JTZXJpYWxpemVyID0gc3RkU2VyaWFsaXplcnMuZXJyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgbGV2ZWw6ICdpbmZvJyxcbiAgbGV2ZWxDb21wYXJpc29uOiBTT1JUSU5HX09SREVSLkFTQyxcbiAgbGV2ZWxzOiBERUZBVUxUX0xFVkVMUyxcbiAgbWVzc2FnZUtleTogJ21zZycsXG4gIGVycm9yS2V5OiAnZXJyJyxcbiAgbmVzdGVkS2V5OiBudWxsLFxuICBlbmFibGVkOiB0cnVlLFxuICBiYXNlOiB7IHBpZCwgaG9zdG5hbWUgfSxcbiAgc2VyaWFsaXplcnM6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShudWxsKSwge1xuICAgIGVycjogZGVmYXVsdEVycm9yU2VyaWFsaXplclxuICB9KSxcbiAgZm9ybWF0dGVyczogT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKG51bGwpLCB7XG4gICAgYmluZGluZ3MgKGJpbmRpbmdzKSB7XG4gICAgICByZXR1cm4gYmluZGluZ3NcbiAgICB9LFxuICAgIGxldmVsIChsYWJlbCwgbnVtYmVyKSB7XG4gICAgICByZXR1cm4geyBsZXZlbDogbnVtYmVyIH1cbiAgICB9XG4gIH0pLFxuICBob29rczoge1xuICAgIGxvZ01ldGhvZDogdW5kZWZpbmVkLFxuICAgIHN0cmVhbVdyaXRlOiB1bmRlZmluZWRcbiAgfSxcbiAgdGltZXN0YW1wOiBlcG9jaFRpbWUsXG4gIG5hbWU6IHVuZGVmaW5lZCxcbiAgcmVkYWN0OiBudWxsLFxuICBjdXN0b21MZXZlbHM6IG51bGwsXG4gIHVzZU9ubHlDdXN0b21MZXZlbHM6IGZhbHNlLFxuICBkZXB0aExpbWl0OiA1LFxuICBlZGdlTGltaXQ6IDEwMFxufVxuXG5jb25zdCBub3JtYWxpemUgPSBjcmVhdGVBcmdzTm9ybWFsaXplcihkZWZhdWx0T3B0aW9ucylcblxuY29uc3Qgc2VyaWFsaXplcnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUobnVsbCksIHN0ZFNlcmlhbGl6ZXJzKVxuXG5mdW5jdGlvbiBwaW5vICguLi5hcmdzKSB7XG4gIGNvbnN0IGluc3RhbmNlID0ge31cbiAgY29uc3QgeyBvcHRzLCBzdHJlYW0gfSA9IG5vcm1hbGl6ZShpbnN0YW5jZSwgY2FsbGVyKCksIC4uLmFyZ3MpXG5cbiAgaWYgKG9wdHMubGV2ZWwgJiYgdHlwZW9mIG9wdHMubGV2ZWwgPT09ICdzdHJpbmcnICYmIERFRkFVTFRfTEVWRUxTW29wdHMubGV2ZWwudG9Mb3dlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkgb3B0cy5sZXZlbCA9IG9wdHMubGV2ZWwudG9Mb3dlckNhc2UoKVxuXG4gIGNvbnN0IHtcbiAgICByZWRhY3QsXG4gICAgY3JsZixcbiAgICBzZXJpYWxpemVycyxcbiAgICB0aW1lc3RhbXAsXG4gICAgbWVzc2FnZUtleSxcbiAgICBlcnJvcktleSxcbiAgICBuZXN0ZWRLZXksXG4gICAgYmFzZSxcbiAgICBuYW1lLFxuICAgIGxldmVsLFxuICAgIGN1c3RvbUxldmVscyxcbiAgICBsZXZlbENvbXBhcmlzb24sXG4gICAgbWl4aW4sXG4gICAgbWl4aW5NZXJnZVN0cmF0ZWd5LFxuICAgIHVzZU9ubHlDdXN0b21MZXZlbHMsXG4gICAgZm9ybWF0dGVycyxcbiAgICBob29rcyxcbiAgICBkZXB0aExpbWl0LFxuICAgIGVkZ2VMaW1pdCxcbiAgICBvbkNoaWxkLFxuICAgIG1zZ1ByZWZpeFxuICB9ID0gb3B0c1xuXG4gIGNvbnN0IHN0cmluZ2lmeVNhZmUgPSBjb25maWd1cmUoe1xuICAgIG1heGltdW1EZXB0aDogZGVwdGhMaW1pdCxcbiAgICBtYXhpbXVtQnJlYWR0aDogZWRnZUxpbWl0XG4gIH0pXG5cbiAgY29uc3QgYWxsRm9ybWF0dGVycyA9IGJ1aWxkRm9ybWF0dGVycyhcbiAgICBmb3JtYXR0ZXJzLmxldmVsLFxuICAgIGZvcm1hdHRlcnMuYmluZGluZ3MsXG4gICAgZm9ybWF0dGVycy5sb2dcbiAgKVxuXG4gIGNvbnN0IHN0cmluZ2lmeUZuID0gc3RyaW5naWZ5LmJpbmQoe1xuICAgIFtzdHJpbmdpZnlTYWZlU3ltXTogc3RyaW5naWZ5U2FmZVxuICB9KVxuICBjb25zdCBzdHJpbmdpZmllcnMgPSByZWRhY3QgPyByZWRhY3Rpb24ocmVkYWN0LCBzdHJpbmdpZnlGbikgOiB7fVxuICBjb25zdCBmb3JtYXRPcHRzID0gcmVkYWN0XG4gICAgPyB7IHN0cmluZ2lmeTogc3RyaW5naWZpZXJzW3JlZGFjdEZtdFN5bV0gfVxuICAgIDogeyBzdHJpbmdpZnk6IHN0cmluZ2lmeUZuIH1cbiAgY29uc3QgZW5kID0gJ30nICsgKGNybGYgPyAnXFxyXFxuJyA6ICdcXG4nKVxuICBjb25zdCBjb3JlQ2hpbmRpbmdzID0gYXNDaGluZGluZ3MuYmluZChudWxsLCB7XG4gICAgW2NoaW5kaW5nc1N5bV06ICcnLFxuICAgIFtzZXJpYWxpemVyc1N5bV06IHNlcmlhbGl6ZXJzLFxuICAgIFtzdHJpbmdpZmllcnNTeW1dOiBzdHJpbmdpZmllcnMsXG4gICAgW3N0cmluZ2lmeVN5bV06IHN0cmluZ2lmeSxcbiAgICBbc3RyaW5naWZ5U2FmZVN5bV06IHN0cmluZ2lmeVNhZmUsXG4gICAgW2Zvcm1hdHRlcnNTeW1dOiBhbGxGb3JtYXR0ZXJzXG4gIH0pXG5cbiAgbGV0IGNoaW5kaW5ncyA9ICcnXG4gIGlmIChiYXNlICE9PSBudWxsKSB7XG4gICAgaWYgKG5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY2hpbmRpbmdzID0gY29yZUNoaW5kaW5ncyhiYXNlKVxuICAgIH0gZWxzZSB7XG4gICAgICBjaGluZGluZ3MgPSBjb3JlQ2hpbmRpbmdzKE9iamVjdC5hc3NpZ24oe30sIGJhc2UsIHsgbmFtZSB9KSlcbiAgICB9XG4gIH1cblxuICBjb25zdCB0aW1lID0gKHRpbWVzdGFtcCBpbnN0YW5jZW9mIEZ1bmN0aW9uKVxuICAgID8gdGltZXN0YW1wXG4gICAgOiAodGltZXN0YW1wID8gZXBvY2hUaW1lIDogbnVsbFRpbWUpXG4gIGNvbnN0IHRpbWVTbGljZUluZGV4ID0gdGltZSgpLmluZGV4T2YoJzonKSArIDFcblxuICBpZiAodXNlT25seUN1c3RvbUxldmVscyAmJiAhY3VzdG9tTGV2ZWxzKSB0aHJvdyBFcnJvcignY3VzdG9tTGV2ZWxzIGlzIHJlcXVpcmVkIGlmIHVzZU9ubHlDdXN0b21MZXZlbHMgaXMgc2V0IHRydWUnKVxuICBpZiAobWl4aW4gJiYgdHlwZW9mIG1peGluICE9PSAnZnVuY3Rpb24nKSB0aHJvdyBFcnJvcihgVW5rbm93biBtaXhpbiB0eXBlIFwiJHt0eXBlb2YgbWl4aW59XCIgLSBleHBlY3RlZCBcImZ1bmN0aW9uXCJgKVxuICBpZiAobXNnUHJlZml4ICYmIHR5cGVvZiBtc2dQcmVmaXggIT09ICdzdHJpbmcnKSB0aHJvdyBFcnJvcihgVW5rbm93biBtc2dQcmVmaXggdHlwZSBcIiR7dHlwZW9mIG1zZ1ByZWZpeH1cIiAtIGV4cGVjdGVkIFwic3RyaW5nXCJgKVxuXG4gIGFzc2VydERlZmF1bHRMZXZlbEZvdW5kKGxldmVsLCBjdXN0b21MZXZlbHMsIHVzZU9ubHlDdXN0b21MZXZlbHMpXG4gIGNvbnN0IGxldmVscyA9IG1hcHBpbmdzKGN1c3RvbUxldmVscywgdXNlT25seUN1c3RvbUxldmVscylcblxuICBpZiAodHlwZW9mIHN0cmVhbS5lbWl0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc3RyZWFtLmVtaXQoJ21lc3NhZ2UnLCB7IGNvZGU6ICdQSU5PX0NPTkZJRycsIGNvbmZpZzogeyBsZXZlbHMsIG1lc3NhZ2VLZXksIGVycm9yS2V5IH0gfSlcbiAgfVxuXG4gIGFzc2VydExldmVsQ29tcGFyaXNvbihsZXZlbENvbXBhcmlzb24pXG4gIGNvbnN0IGxldmVsQ29tcEZ1bmMgPSBnZW5MZXZlbENvbXBhcmlzb24obGV2ZWxDb21wYXJpc29uKVxuXG4gIE9iamVjdC5hc3NpZ24oaW5zdGFuY2UsIHtcbiAgICBsZXZlbHMsXG4gICAgW2xldmVsQ29tcFN5bV06IGxldmVsQ29tcEZ1bmMsXG4gICAgW3VzZU9ubHlDdXN0b21MZXZlbHNTeW1dOiB1c2VPbmx5Q3VzdG9tTGV2ZWxzLFxuICAgIFtzdHJlYW1TeW1dOiBzdHJlYW0sXG4gICAgW3RpbWVTeW1dOiB0aW1lLFxuICAgIFt0aW1lU2xpY2VJbmRleFN5bV06IHRpbWVTbGljZUluZGV4LFxuICAgIFtzdHJpbmdpZnlTeW1dOiBzdHJpbmdpZnksXG4gICAgW3N0cmluZ2lmeVNhZmVTeW1dOiBzdHJpbmdpZnlTYWZlLFxuICAgIFtzdHJpbmdpZmllcnNTeW1dOiBzdHJpbmdpZmllcnMsXG4gICAgW2VuZFN5bV06IGVuZCxcbiAgICBbZm9ybWF0T3B0c1N5bV06IGZvcm1hdE9wdHMsXG4gICAgW21lc3NhZ2VLZXlTeW1dOiBtZXNzYWdlS2V5LFxuICAgIFtlcnJvcktleVN5bV06IGVycm9yS2V5LFxuICAgIFtuZXN0ZWRLZXlTeW1dOiBuZXN0ZWRLZXksXG4gICAgLy8gcHJvdGVjdCBhZ2FpbnN0IGluamVjdGlvblxuICAgIFtuZXN0ZWRLZXlTdHJTeW1dOiBuZXN0ZWRLZXkgPyBgLCR7SlNPTi5zdHJpbmdpZnkobmVzdGVkS2V5KX06e2AgOiAnJyxcbiAgICBbc2VyaWFsaXplcnNTeW1dOiBzZXJpYWxpemVycyxcbiAgICBbbWl4aW5TeW1dOiBtaXhpbixcbiAgICBbbWl4aW5NZXJnZVN0cmF0ZWd5U3ltXTogbWl4aW5NZXJnZVN0cmF0ZWd5LFxuICAgIFtjaGluZGluZ3NTeW1dOiBjaGluZGluZ3MsXG4gICAgW2Zvcm1hdHRlcnNTeW1dOiBhbGxGb3JtYXR0ZXJzLFxuICAgIFtob29rc1N5bV06IGhvb2tzLFxuICAgIHNpbGVudDogbm9vcCxcbiAgICBvbkNoaWxkLFxuICAgIFttc2dQcmVmaXhTeW1dOiBtc2dQcmVmaXhcbiAgfSlcblxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoaW5zdGFuY2UsIHByb3RvKCkpXG5cbiAgZ2VuTHNDYWNoZShpbnN0YW5jZSlcblxuICBpbnN0YW5jZVtzZXRMZXZlbFN5bV0obGV2ZWwpXG5cbiAgcmV0dXJuIGluc3RhbmNlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGlub1xuXG5tb2R1bGUuZXhwb3J0cy5kZXN0aW5hdGlvbiA9IChkZXN0ID0gcHJvY2Vzcy5zdGRvdXQuZmQpID0+IHtcbiAgaWYgKHR5cGVvZiBkZXN0ID09PSAnb2JqZWN0Jykge1xuICAgIGRlc3QuZGVzdCA9IG5vcm1hbGl6ZURlc3RGaWxlRGVzY3JpcHRvcihkZXN0LmRlc3QgfHwgcHJvY2Vzcy5zdGRvdXQuZmQpXG4gICAgcmV0dXJuIGJ1aWxkU2FmZVNvbmljQm9vbShkZXN0KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBidWlsZFNhZmVTb25pY0Jvb20oeyBkZXN0OiBub3JtYWxpemVEZXN0RmlsZURlc2NyaXB0b3IoZGVzdCksIG1pbkxlbmd0aDogMCB9KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLnRyYW5zcG9ydCA9IHJlcXVpcmUoJy4vbGliL3RyYW5zcG9ydCcpXG5tb2R1bGUuZXhwb3J0cy5tdWx0aXN0cmVhbSA9IHJlcXVpcmUoJy4vbGliL211bHRpc3RyZWFtJylcblxubW9kdWxlLmV4cG9ydHMubGV2ZWxzID0gbWFwcGluZ3MoKVxubW9kdWxlLmV4cG9ydHMuc3RkU2VyaWFsaXplcnMgPSBzZXJpYWxpemVyc1xubW9kdWxlLmV4cG9ydHMuc3RkVGltZUZ1bmN0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRpbWUpXG5tb2R1bGUuZXhwb3J0cy5zeW1ib2xzID0gc3ltYm9sc1xubW9kdWxlLmV4cG9ydHMudmVyc2lvbiA9IHZlcnNpb25cblxuLy8gRW5hYmxlcyBkZWZhdWx0IGFuZCBuYW1lIGV4cG9ydCB3aXRoIFR5cGVTY3JpcHQgYW5kIEJhYmVsXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gcGlub1xubW9kdWxlLmV4cG9ydHMucGlubyA9IHBpbm9cbiIsICIndXNlIHN0cmljdCdcblxuY29uc3QgcGlubyA9IHJlcXVpcmUoJy4vcGlubycpXG5jb25zdCB7IG9uY2UgfSA9IHJlcXVpcmUoJ25vZGU6ZXZlbnRzJylcblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiAob3B0cyA9IHt9KSB7XG4gIGNvbnN0IGRlc3RPcHRzID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0cywgeyBkZXN0OiBvcHRzLmRlc3RpbmF0aW9uIHx8IDEsIHN5bmM6IGZhbHNlIH0pXG4gIGRlbGV0ZSBkZXN0T3B0cy5kZXN0aW5hdGlvblxuICBjb25zdCBkZXN0aW5hdGlvbiA9IHBpbm8uZGVzdGluYXRpb24oZGVzdE9wdHMpXG4gIGF3YWl0IG9uY2UoZGVzdGluYXRpb24sICdyZWFkeScpXG4gIHJldHVybiBkZXN0aW5hdGlvblxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQSx1R0FBQUEsVUFBQUMsU0FBQTtBQUFBO0FBT0EsUUFBTSxjQUFjLENBQUMsUUFBUTtBQUMzQixhQUFPLE9BQU8sT0FBTyxJQUFJLFlBQVk7QUFBQSxJQUN2QztBQU1BLFFBQU0sZ0JBQWdCLENBQUMsUUFBUTtBQUM3QixVQUFJLENBQUMsSUFBSztBQUlWLFlBQU0sUUFBUSxJQUFJ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YW1lcyI6IFsiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXJyIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImVyciIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJjbG9uZWQiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXJyIiwgIm4iLCAicmVsZWFzZWRCdWZPYmoiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiRmluYWxpemF0aW9uUmVnaXN0cnkiLCAiV2Vha1JlZiIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJvbkV4aXQiLCAiZml4VGFyZ2V0IiwgImV4cG9ydHMiLCAibW9kdWxlIiwgInN0cmluZ2lmeSIsICJfIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgImJpbmRpbmdzIiwgImV4cG9ydHMiLCAibW9kdWxlIiwgInZhbHVlIiwgInRtcCIsICJrZXkiLCAicmVzIiwgImpvaW4iLCAic3RyaW5naWZ5IiwgImV4cG9ydHMiLCAibW9kdWxlIiwgInN0cmVhbUxldmVscyIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJwaW5vIiwgInNlcmlhbGl6ZXJzIiwgInRpbWUiXQp9Cg==
