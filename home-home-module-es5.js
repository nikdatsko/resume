(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "./node_modules/deepmerge/dist/umd.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/umd.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, function () { 'use strict';

	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};

	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}

	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);

		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}

	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}

	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}

	function cloneUnlessOtherwiseSpecified(value, options) {
		return (options.clone !== false && options.isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, options)
			: value
	}

	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options)
		})
	}

	function getMergeFunction(key, options) {
		if (!options.customMerge) {
			return deepmerge
		}
		var customMerge = options.customMerge(key);
		return typeof customMerge === 'function' ? customMerge : deepmerge
	}

	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols
			? Object.getOwnPropertySymbols(target).filter(function(symbol) {
				return target.propertyIsEnumerable(symbol)
			})
			: []
	}

	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
	}

	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) {
			getKeys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
			});
		}
		getKeys(source).forEach(function(key) {
			if (!options.isMergeableObject(source[key]) || !target[key]) {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
			} else {
				destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			}
		});
		return destination
	}

	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;

		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, options)
		} else if (sourceIsArray) {
			return options.arrayMerge(target, source, options)
		} else {
			return mergeObject(target, source, options)
		}
	}

	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}

		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options)
		}, {})
	};

	var deepmerge_1 = deepmerge;

	return deepmerge_1;

}));


/***/ }),

/***/ "./node_modules/ngrx-store-localstorage/dist/index.js":
/*!************************************************************!*\
  !*** ./node_modules/ngrx-store-localstorage/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var deepmerge = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/umd.js");
var INIT_ACTION = '@ngrx/store/init';
var UPDATE_ACTION = '@ngrx/store/update-reducers';
var detectDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
// correctly parse dates from local storage
exports.dateReviver = function (key, value) {
    if (typeof value === 'string' && detectDate.test(value)) {
        return new Date(value);
    }
    return value;
};
var dummyReviver = function (key, value) { return value; };
var checkIsBrowserEnv = function () {
    return typeof window !== 'undefined';
};
var validateStateKeys = function (keys) {
    return keys.map(function (key) {
        var attr = key;
        if (typeof key === 'object') {
            attr = Object.keys(key)[0];
        }
        if (typeof attr !== 'string') {
            throw new TypeError("localStorageSync Unknown Parameter Type: " +
                ("Expected type of string, got " + typeof attr));
        }
        return key;
    });
};
exports.rehydrateApplicationState = function (keys, storage, storageKeySerializer, restoreDates) {
    return keys.reduce(function (acc, curr) {
        var key = curr;
        var reviver = restoreDates ? exports.dateReviver : dummyReviver;
        var deserialize = undefined;
        var decrypt = undefined;
        if (typeof key === 'object') {
            key = Object.keys(key)[0];
            // use the custom reviver function
            if (typeof curr[key] === 'function') {
                reviver = curr[key];
            }
            else {
                // use custom reviver function if available
                if (curr[key].reviver) {
                    reviver = curr[key].reviver;
                }
                // use custom serialize function if available
                if (curr[key].deserialize) {
                    deserialize = curr[key].deserialize;
                }
            }
            // Ensure that encrypt and decrypt functions are both presents
            if (curr[key].encrypt && curr[key].decrypt) {
                if (typeof curr[key].encrypt === 'function' &&
                    typeof curr[key].decrypt === 'function') {
                    decrypt = curr[key].decrypt;
                }
                else {
                    console.error("Either encrypt or decrypt is not a function on '" + curr[key] + "' key object.");
                }
            }
            else if (curr[key].encrypt || curr[key].decrypt) {
                // Let know that one of the encryption functions is not provided
                console.error("Either encrypt or decrypt function is not present on '" + curr[key] + "' key object.");
            }
        }
        if (storage !== undefined) {
            var stateSlice = storage.getItem(storageKeySerializer(key));
            if (stateSlice) {
                // Use provided decrypt function
                if (decrypt) {
                    stateSlice = decrypt(stateSlice);
                }
                var isObjectRegex = new RegExp('{|\\[');
                var raw = stateSlice;
                if (stateSlice === 'null' || isObjectRegex.test(stateSlice.charAt(0))) {
                    raw = JSON.parse(stateSlice, reviver);
                }
                return Object.assign({}, acc, (_a = {},
                    _a[key] = deserialize ? deserialize(raw) : raw,
                    _a));
            }
        }
        return acc;
        var _a;
    }, {});
};
exports.syncStateUpdate = function (state, keys, storage, storageKeySerializer, removeOnUndefined, syncCondition) {
    if (syncCondition) {
        try {
            if (syncCondition(state) !== true) {
                return;
            }
        }
        catch (e) {
            // Treat TypeError as do not sync
            if (e instanceof TypeError) {
                return;
            }
            throw e;
        }
    }
    keys.forEach(function (key) {
        var stateSlice = state[key];
        var replacer = undefined;
        var space = undefined;
        var encrypt = undefined;
        if (typeof key === 'object') {
            var name_1 = Object.keys(key)[0];
            stateSlice = state[name_1];
            if (typeof stateSlice !== 'undefined' && key[name_1]) {
                // use serialize function if specified.
                if (key[name_1].serialize) {
                    stateSlice = key[name_1].serialize(stateSlice);
                }
                else {
                    // if serialize function is not specified filter on fields if an array has been provided.
                    var filter = undefined;
                    if (key[name_1].reduce) {
                        filter = key[name_1];
                    }
                    else if (key[name_1].filter) {
                        filter = key[name_1].filter;
                    }
                    if (filter) {
                        stateSlice = filter.reduce(function (memo, attr) {
                            memo[attr] = stateSlice[attr];
                            return memo;
                        }, {});
                    }
                    // Check if encrypt and decrypt are present, also checked at this#rehydrateApplicationState()
                    if (key[name_1].encrypt && key[name_1].decrypt) {
                        if (typeof key[name_1].encrypt === 'function') {
                            encrypt = key[name_1].encrypt;
                        }
                    }
                    else if (key[name_1].encrypt || key[name_1].decrypt) {
                        // If one of those is not present, then let know that one is missing
                        console.error("Either encrypt or decrypt function is not present on '" + key[name_1] + "' key object.");
                    }
                }
                /*
                            Replacer and space arguments to pass to JSON.stringify.
                            If these fields don't exist, undefined will be passed.
                        */
                replacer = key[name_1].replacer;
                space = key[name_1].space;
            }
            key = name_1;
        }
        if (typeof stateSlice !== 'undefined' && storage !== undefined) {
            try {
                if (encrypt) {
                    // ensure that a string message is passed
                    stateSlice = encrypt(typeof stateSlice === 'string'
                        ? stateSlice
                        : JSON.stringify(stateSlice, replacer, space));
                }
                storage.setItem(storageKeySerializer(key), typeof stateSlice === 'string'
                    ? stateSlice
                    : JSON.stringify(stateSlice, replacer, space));
            }
            catch (e) {
                console.warn('Unable to save state to localStorage:', e);
            }
        }
        else if (typeof stateSlice === 'undefined' && removeOnUndefined) {
            try {
                storage.removeItem(storageKeySerializer(key));
            }
            catch (e) {
                console.warn("Exception on removing/cleaning undefined '" + key + "' state", e);
            }
        }
    });
};
exports.localStorageSync = function (config) { return function (reducer) {
    if (config.storage === undefined &&
        !config.checkStorageAvailability || (config.checkStorageAvailability && checkIsBrowserEnv())) {
        config.storage = localStorage || window.localStorage;
    }
    if (config.storageKeySerializer === undefined) {
        config.storageKeySerializer = function (key) { return key; };
    }
    if (config.restoreDates === undefined) {
        config.restoreDates = true;
    }
    var stateKeys = validateStateKeys(config.keys);
    var rehydratedState = config.rehydrate
        ? exports.rehydrateApplicationState(stateKeys, config.storage, config.storageKeySerializer, config.restoreDates)
        : undefined;
    return function (state, action) {
        var nextState;
        // If state arrives undefined, we need to let it through the supplied reducer
        // in order to get a complete state as defined by user
        if ((action.type === INIT_ACTION) && !state) {
            nextState = reducer(state, action);
        }
        else {
            nextState = __assign({}, state);
        }
        if ((action.type === INIT_ACTION || action.type === UPDATE_ACTION) && rehydratedState) {
            var overwriteMerge = function (destinationArray, sourceArray, options) { return sourceArray; };
            var options = {
                arrayMerge: overwriteMerge
            };
            nextState = deepmerge(nextState, rehydratedState, options);
        }
        nextState = reducer(nextState, action);
        if (action.type !== INIT_ACTION) {
            exports.syncStateUpdate(nextState, stateKeys, config.storage, config.storageKeySerializer, config.removeOnUndefined, config.syncCondition);
        }
        return nextState;
    };
}; };
/*
    @deprecated: Use localStorageSync(LocalStorageConfig)

    Wraps localStorageSync functionality acepting the removeOnUndefined boolean parameter in order
    to clean/remove the state from the browser on situations like state reset or logout.
    Defines localStorage as default storage.
*/
exports.localStorageSyncAndClean = function (keys, rehydrate, removeOnUndefined) {
    if (rehydrate === void 0) { rehydrate = false; }
    if (removeOnUndefined === void 0) { removeOnUndefined = false; }
    return function (reducer) {
        var config = {
            keys: keys,
            rehydrate: rehydrate,
            storage: localStorage,
            removeOnUndefined: removeOnUndefined
        };
        return _this.localStorageSync(config);
    };
};
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/home/home.component.html":
/*!********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/home/home.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<header class=\"header\">\r\n  <h1 itemprop=\"jobTitle\">Front-end developer</h1>\r\n  <a class=\"portfolio not4print\" routerLink=\"/portfolio\">portfolio</a>\r\n  <a class=\"print not4print\" title=\"PDF\" href=\"//niklenburg.com/nik/assets/Nik_Datsko.pdf\" target=\"_blank\">\r\n    <svg width=\"30\" height=\"30\" xmlns=\"https://www.w3.org/2000/svg\" xmlns:xlink=\"https://www.w3.org/1999/xlink\" viewBox=\"0 0 512 512\" xml:space=\"preserve\">\r\n      <path fill=\"#231F20\" d=\"M246.8,44.8L224.5,6H113.4v38.8H77v354.3L184.6,506H435V44.8H246.8z M128.6,140.5c3.3-4.3,9-4.7,12.7-0.9l17.9,18.2V75.2   c0-5.7,4-10.4,9-10.4s9,4.6,9,10.4v82.6l17.9-18.2c3.7-3.8,9.4-3.4,12.7,0.9c3.3,4.3,3,10.8-0.8,14.6l-32.8,33.4c0,0,0,0,0,0   l-0.1,0.1c-0.2,0.2-0.4,0.4-0.7,0.6c-0.1,0.1-0.2,0.1-0.2,0.2c-0.2,0.1-0.3,0.3-0.5,0.4c-0.1,0.1-0.2,0.1-0.3,0.2   c-0.2,0.1-0.3,0.2-0.5,0.3c-0.1,0.1-0.2,0.1-0.3,0.1c-0.2,0.1-0.4,0.2-0.5,0.2c-0.1,0-0.2,0.1-0.3,0.1c-0.2,0.1-0.4,0.1-0.6,0.2   c-0.1,0-0.2,0.1-0.3,0.1c-0.2,0-0.4,0.1-0.6,0.1c-0.1,0-0.2,0-0.2,0c-0.3,0-0.6,0.1-0.9,0.1c0,0,0,0,0,0s0,0,0,0   c-0.3,0-0.6,0-0.9-0.1c-0.1,0-0.2,0-0.2,0c-0.2,0-0.4-0.1-0.6-0.1c-0.1,0-0.2,0-0.3-0.1c-0.2-0.1-0.4-0.1-0.6-0.2   c-0.1,0-0.2-0.1-0.3-0.1c-0.2-0.1-0.4-0.1-0.5-0.2c-0.1,0-0.2-0.1-0.3-0.1c-0.2-0.1-0.3-0.2-0.5-0.3c-0.1-0.1-0.2-0.1-0.3-0.2   c-0.2-0.1-0.4-0.3-0.5-0.4c-0.1-0.1-0.2-0.1-0.2-0.2c-0.2-0.2-0.5-0.4-0.7-0.6l-0.1-0.1c0,0,0,0,0,0l-32.8-33.4   C125.6,151.3,125.3,144.8,128.6,140.5z M415.9,486.9H193.6v-97.1H96.1V63.9h17.3v121.5l55.5,50.3l55.5-50.3V63.9h191.4V486.9z\" />\r\n      <rect fill=\"#908E8F\" height=\"21.3\" width=\"132.6\" x=\"256\" y=\"114.5\" />\r\n      <rect fill=\"#908E8F\" height=\"21.3\" width=\"132.6\" x=\"256\" y=\"187.1\" />\r\n      <rect fill=\"#908E8F\" height=\"21.3\" width=\"267\" x=\"121.6\" y=\"332.4\" />\r\n      <rect fill=\"#908E8F\" height=\"21.3\" width=\"267\" x=\"121.6\" y=\"259.7\" />\r\n      <path fill=\"#231F20\" d=\"M254.9,394.6h-22.4v58.5h9.8v-22.2h12.7c6.5,0,11.5-1.7,15.2-5c3.7-3.3,5.5-7.7,5.5-13.2c0-5.4-1.8-9.8-5.5-13.2   C266.4,396.2,261.4,394.6,254.9,394.6z M263.1,420.2c-1.8,1.9-4.5,2.9-8.2,2.9h-12.7v-20.7h12.7c3.6,0,6.3,1,8.2,3   c1.8,2,2.7,4.5,2.7,7.4C265.8,415.8,264.9,418.2,263.1,420.2z\" />\r\n      <path fill=\"#231F20\" d=\"M306.7,394.6h-19.3v58.5h19.3c7.4,0,13.5-2.3,18.1-6.9c4.6-4.6,7-10.6,7-17.9v-8.9c0-7.3-2.3-13.3-7-17.9   C320.2,396.9,314.1,394.6,306.7,394.6z M322,428.3c0,5-1.4,9.1-4.1,12.2c-2.8,3.2-6.5,4.8-11.2,4.8h-9.6v-42.9h9.6   c4.7,0,8.4,1.6,11.2,4.8c2.8,3.2,4.1,7.2,4.1,12.2V428.3z\" />\r\n      <polygon fill=\"#231F20\" points=\"345,453.1 354.8,453.1 354.8,428.1 378.4,428.1 378.4,420.3 354.8,420.3 354.8,402.4 382.5,402.4 382.5,394.6    345,394.6  \" />\r\n    </svg>\r\n  </a>\r\n</header>\r\n<div class=\"content\">\r\n  <main>\r\n    <app-section *ngIf=\"!!(experienceStream | async)?.length\" className=\"top_section\">\r\n      <ng-container article>\r\n        <div class=\"heading\">\r\n          <h2>Experience</h2>\r\n          <span class=\"total\"> > 7 years</span>\r\n        </div>\r\n        <app-place class=\"no-pagebreak\" *ngFor=\"let place of (experienceStream | async)\" [place]=\"place\"></app-place>\r\n      </ng-container>\r\n    </app-section>\r\n  </main>\r\n  <aside>\r\n    <app-section *ngIf=\"!!(skillsStream | async)\">\r\n      <ng-container article>\r\n        <div class=\"heading\">\r\n          <h2>Skills</h2>\r\n        </div>\r\n        <div class=\"skillset\" *ngFor=\"let skillset of (skillsStream | async) | keyvalue : disableReorder\">\r\n          <h3>{{skillset.key}}</h3>\r\n          <div class=\"skill\" *ngFor=\"let skill of skillset.value\">{{skill}}</div>\r\n        </div>\r\n      </ng-container>\r\n    </app-section>\r\n  </aside>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/home/home-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/home/home-routing.module.ts ***!
  \*********************************************/
/*! exports provided: HomeRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeRoutingModule", function() { return HomeRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _home_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home.component */ "./src/app/home/home.component.ts");




var routes = [
    {
        path: '',
        component: _home_component__WEBPACK_IMPORTED_MODULE_3__["HomeComponent"]
    }
];
var HomeRoutingModule = /** @class */ (function () {
    function HomeRoutingModule() {
    }
    HomeRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], HomeRoutingModule);
    return HomeRoutingModule;
}());



/***/ }),

/***/ "./src/app/home/home.component.scss":
/*!******************************************!*\
  !*** ./src/app/home/home.component.scss ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@charset \"UTF-8\";\n:host {\n  display: flex;\n  flex-direction: column;\n}\nheader {\n  display: flex;\n  padding: 10px;\n  align-items: center;\n}\nheader h1 {\n  margin-right: auto;\n}\n@media (max-width: 600px) {\n  header {\n    flex-direction: column-reverse;\n  }\n  header h1 {\n    margin-top: 20px;\n    text-align: center;\n  }\n}\n@media print and (max-width: 600px) {\n  header h1 {\n    margin-top: 0;\n  }\n}\n.portfolio {\n  margin-left: 10px;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-size: 1.1em;\n  text-shadow: 0.5px 0.1px 0 #006295;\n}\n.print {\n  width: 30px;\n  height: 30px;\n  margin-left: 20px;\n  padding: 0;\n  background: none;\n  border: none;\n  cursor: pointer;\n  outline: none;\n}\n.print:hover rect {\n  fill: #231f20;\n}\n.print:active {\n  -webkit-transform: translateY(1px);\n          transform: translateY(1px);\n}\n@media (max-width: 600px) {\n  .print {\n    display: none;\n  }\n}\n.content {\n  display: flex;\n}\n@media print, (max-width: 1000px) {\n  .content {\n    flex-direction: column;\n  }\n}\naside {\n  width: 200px;\n}\n@media print, (max-width: 1000px) {\n  aside {\n    width: auto;\n    margin-top: 10px;\n  }\n}\nmain {\n  flex: 1;\n}\n.skillset {\n  margin-bottom: 10px;\n}\n.skill {\n  line-height: 1.2em;\n  font-size: 0.85em;\n}\n@media print, (max-width: 1000px) {\n  .skill {\n    display: inline-block;\n    font-size: 1em;\n  }\n  .skill:not(:last-child):after {\n    content: \", \";\n  }\n}\n.heading {\n  display: flex;\n  align-items: center;\n  margin: -10px -10px 0.5em;\n  padding: 10px;\n  border-bottom: 1px #f2f2e9 solid;\n}\nh2 {\n  text-shadow: none;\n  margin: 0;\n}\n.total {\n  margin-left: auto;\n  margin-right: 10px;\n  width: 80px;\n  text-align: center;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaG9tZS9ob21lLmNvbXBvbmVudC5zY3NzIiwic3JjL2FwcC9ob21lL0M6XFxVc2Vyc1xcTXlreXRhX0RhdHNrb1xcUHJvamVjdHNcXG5pa1xcbmlrZGF0c2tvLmdpdGh1Yi5pby9zcmNcXGFwcFxcaG9tZVxcaG9tZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUNFaEI7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7QURBRjtBQ0dBO0VBQ0UsYUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBREFGO0FDRUU7RUFDRSxrQkFBQTtBREFKO0FDR0U7RUFURjtJQVVJLDhCQUFBO0VEQUY7RUNFRTtJQUNFLGdCQUFBO0lBQ0Esa0JBQUE7RURBSjtBQUNGO0FDQ007RUFKRjtJQUtJLGFBQUE7RURFTjtBQUNGO0FDR0E7RUFDRSxpQkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtDQUFBO0FEQUY7QUNHQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7QURBRjtBQ0dJO0VBQ0UsYUFBQTtBREROO0FDS0U7RUFDRSxrQ0FBQTtVQUFBLDBCQUFBO0FESEo7QUNNRTtFQXBCRjtJQXFCSSxhQUFBO0VESEY7QUFDRjtBQ01BO0VBQ0UsYUFBQTtBREhGO0FDS0U7RUFIRjtJQUlJLHNCQUFBO0VERkY7QUFDRjtBQ0tBO0VBQ0UsWUFBQTtBREZGO0FDSUU7RUFIRjtJQUlJLFdBQUE7SUFDQSxnQkFBQTtFRERGO0FBQ0Y7QUNJQTtFQUNFLE9BQUE7QURERjtBQ0lBO0VBQ0UsbUJBQUE7QURERjtBQ0lBO0VBQ0Usa0JBQUE7RUFDQSxpQkFBQTtBRERGO0FDR0U7RUFKRjtJQUtJLHFCQUFBO0lBQ0EsY0FBQTtFREFGO0VDR0k7SUFDRSxhQUFBO0VERE47QUFDRjtBQ01BO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxhQUFBO0VBQ0EsZ0NBQUE7QURIRjtBQ01BO0VBQ0UsaUJBQUE7RUFDQSxTQUFBO0FESEY7QUNNQTtFQUNFLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QURIRiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIkBjaGFyc2V0IFwiVVRGLThcIjtcbjpob3N0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgcGFkZGluZzogMTBweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbmhlYWRlciBoMSB7XG4gIG1hcmdpbi1yaWdodDogYXV0bztcbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xuICBoZWFkZXIge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcbiAgfVxuICBoZWFkZXIgaDEge1xuICAgIG1hcmdpbi10b3A6IDIwcHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICB9XG59XG5AbWVkaWEgcHJpbnQgYW5kIChtYXgtd2lkdGg6IDYwMHB4KSB7XG4gIGhlYWRlciBoMSB7XG4gICAgbWFyZ2luLXRvcDogMDtcbiAgfVxufVxuXG4ucG9ydGZvbGlvIHtcbiAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjFlbTtcbiAgZm9udC1zaXplOiAxLjFlbTtcbiAgdGV4dC1zaGFkb3c6IDAuNXB4IDAuMXB4IDAgIzAwNjI5NTtcbn1cblxuLnByaW50IHtcbiAgd2lkdGg6IDMwcHg7XG4gIGhlaWdodDogMzBweDtcbiAgbWFyZ2luLWxlZnQ6IDIwcHg7XG4gIHBhZGRpbmc6IDA7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBvdXRsaW5lOiBub25lO1xufVxuLnByaW50OmhvdmVyIHJlY3Qge1xuICBmaWxsOiAjMjMxZjIwO1xufVxuLnByaW50OmFjdGl2ZSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxcHgpO1xufVxuQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XG4gIC5wcmludCB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxufVxuXG4uY29udGVudCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5AbWVkaWEgcHJpbnQsIChtYXgtd2lkdGg6IDEwMDBweCkge1xuICAuY29udGVudCB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxufVxuXG5hc2lkZSB7XG4gIHdpZHRoOiAyMDBweDtcbn1cbkBtZWRpYSBwcmludCwgKG1heC13aWR0aDogMTAwMHB4KSB7XG4gIGFzaWRlIHtcbiAgICB3aWR0aDogYXV0bztcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICB9XG59XG5cbm1haW4ge1xuICBmbGV4OiAxO1xufVxuXG4uc2tpbGxzZXQge1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xufVxuXG4uc2tpbGwge1xuICBsaW5lLWhlaWdodDogMS4yZW07XG4gIGZvbnQtc2l6ZTogMC44NWVtO1xufVxuQG1lZGlhIHByaW50LCAobWF4LXdpZHRoOiAxMDAwcHgpIHtcbiAgLnNraWxsIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgZm9udC1zaXplOiAxZW07XG4gIH1cbiAgLnNraWxsOm5vdCg6bGFzdC1jaGlsZCk6YWZ0ZXIge1xuICAgIGNvbnRlbnQ6IFwiLMKgXCI7XG4gIH1cbn1cblxuLmhlYWRpbmcge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBtYXJnaW46IC0xMHB4IC0xMHB4IDAuNWVtO1xuICBwYWRkaW5nOiAxMHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggI2YyZjJlOSBzb2xpZDtcbn1cblxuaDIge1xuICB0ZXh0LXNoYWRvdzogbm9uZTtcbiAgbWFyZ2luOiAwO1xufVxuXG4udG90YWwge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICB3aWR0aDogODBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufSIsIkBpbXBvcnQgJ35zcmMvYXNzZXRzL3N0eWxlcy92YXJpYWJsZXMnO1xyXG5cclxuOmhvc3Qge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxufVxyXG5cclxuaGVhZGVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIHBhZGRpbmc6IDEwcHg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuXHJcbiAgaDEge1xyXG4gICAgbWFyZ2luLXJpZ2h0OiBhdXRvO1xyXG4gIH1cclxuXHJcbiAgQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XHJcblxyXG4gICAgaDEge1xyXG4gICAgICBtYXJnaW4tdG9wOiAyMHB4O1xyXG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcblxyXG4gICAgICBAbWVkaWEgcHJpbnQge1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi5wb3J0Zm9saW8ge1xyXG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xyXG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMWVtO1xyXG4gIGZvbnQtc2l6ZTogMS4xZW07XHJcbiAgdGV4dC1zaGFkb3c6IDAuNXB4IDAuMXB4IDAgJGJsdWU7XHJcbn1cclxuXHJcbi5wcmludCB7XHJcbiAgd2lkdGg6IDMwcHg7XHJcbiAgaGVpZ2h0OiAzMHB4O1xyXG4gIG1hcmdpbi1sZWZ0OiAyMHB4O1xyXG4gIHBhZGRpbmc6IDA7XHJcbiAgYmFja2dyb3VuZDogbm9uZTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcblxyXG4gICY6aG92ZXIge1xyXG4gICAgcmVjdCB7XHJcbiAgICAgIGZpbGw6ICMyMzFmMjA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAmOmFjdGl2ZSB7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMXB4KTtcclxuICB9XHJcblxyXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xyXG4gICAgZGlzcGxheTogbm9uZTtcclxuICB9XHJcbn1cclxuXHJcbi5jb250ZW50IHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG5cclxuICBAbWVkaWEgcHJpbnQsIChtYXgtd2lkdGg6IDEwMDBweCkge1xyXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICB9XHJcbn1cclxuXHJcbmFzaWRlIHtcclxuICB3aWR0aDogMjAwcHg7XHJcblxyXG4gIEBtZWRpYSBwcmludCwgKG1heC13aWR0aDogMTAwMHB4KSB7XHJcbiAgICB3aWR0aDogYXV0bztcclxuICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgfVxyXG59XHJcblxyXG5tYWluIHtcclxuICBmbGV4OiAxO1xyXG59XHJcblxyXG4uc2tpbGxzZXQge1xyXG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XHJcbn1cclxuXHJcbi5za2lsbCB7XHJcbiAgbGluZS1oZWlnaHQ6IDEuMmVtO1xyXG4gIGZvbnQtc2l6ZTogMC44NWVtO1xyXG5cclxuICBAbWVkaWEgcHJpbnQsIChtYXgtd2lkdGg6IDEwMDBweCkge1xyXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xyXG4gICAgZm9udC1zaXplOiAxZW07XHJcblxyXG4gICAgJjpub3QoOmxhc3QtY2hpbGQpIHtcclxuICAgICAgJjphZnRlciB7XHJcbiAgICAgICAgY29udGVudDogJyxcXDAwYTAnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4uaGVhZGluZyB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIG1hcmdpbjogLTEwcHggLTEwcHggMC41ZW07XHJcbiAgcGFkZGluZzogMTBweDtcclxuICBib3JkZXItYm90dG9tOiAxcHggJGdyYXktYmcgc29saWQ7XHJcbn1cclxuXHJcbmgyIHtcclxuICB0ZXh0LXNoYWRvdzogbm9uZTtcclxuICBtYXJnaW46IDA7XHJcbn1cclxuXHJcbi50b3RhbCB7XHJcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xyXG4gIHdpZHRoOiA4MHB4O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/home/home.component.ts":
/*!****************************************!*\
  !*** ./src/app/home/home.component.ts ***!
  \****************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store */ "./src/app/home/store/index.ts");




var HomeComponent = /** @class */ (function () {
    function HomeComponent(store) {
        this.store = store;
        this.experienceStream = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(_store__WEBPACK_IMPORTED_MODULE_3__["getExperience"]));
        this.skillsStream = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(_store__WEBPACK_IMPORTED_MODULE_3__["getSkills"]));
        this.disableReorder = function () { return 0; };
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_3__["LoadData"]('experience'));
        this.store.dispatch(new _store__WEBPACK_IMPORTED_MODULE_3__["LoadData"]('skills'));
    }
    HomeComponent.ctorParameters = function () { return [
        { type: _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"] }
    ]; };
    HomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(/*! raw-loader!./home.component.html */ "./node_modules/raw-loader/index.js!./src/app/home/home.component.html"),
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            styles: [__webpack_require__(/*! ./home.component.scss */ "./src/app/home/home.component.scss")]
        })
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/home/home.module.ts":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomeModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeModule", function() { return HomeModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var _home_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./home.component */ "./src/app/home/home.component.ts");
/* harmony import */ var _home_routing_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home-routing.module */ "./src/app/home/home-routing.module.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./store */ "./src/app/home/store/index.ts");









var HomeModule = /** @class */ (function () {
    function HomeModule() {
    }
    HomeModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_home_component__WEBPACK_IMPORTED_MODULE_5__["HomeComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _home_routing_module__WEBPACK_IMPORTED_MODULE_6__["HomeRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_7__["SharedModule"],
                _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreModule"].forFeature('home', _store__WEBPACK_IMPORTED_MODULE_8__["reducers"], { metaReducers: [_store__WEBPACK_IMPORTED_MODULE_8__["homeStorage"]] }),
                _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsModule"].forFeature(_store__WEBPACK_IMPORTED_MODULE_8__["effects"])
            ]
        })
    ], HomeModule);
    return HomeModule;
}());



/***/ }),

/***/ "./src/app/home/home.service.ts":
/*!**************************************!*\
  !*** ./src/app/home/home.service.ts ***!
  \**************************************/
/*! exports provided: HomeService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeService", function() { return HomeService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var HomeService = /** @class */ (function () {
    function HomeService(http) {
        this.http = http;
    }
    HomeService.prototype.getData = function (type) {
        return this.http.get("/assets/data/" + type + ".json");
    };
    HomeService.ctorParameters = function () { return [
        { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
    ]; };
    HomeService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
    ], HomeService);
    return HomeService;
}());



/***/ }),

/***/ "./src/app/home/store/actions/home.actions.ts":
/*!****************************************************!*\
  !*** ./src/app/home/store/actions/home.actions.ts ***!
  \****************************************************/
/*! exports provided: LOAD_DATA, LOAD_DATA_SUCCESS, LOAD_DATA_FAIL, LoadData, LoadDataSuccess, LoadDataFail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA", function() { return LOAD_DATA; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA_SUCCESS", function() { return LOAD_DATA_SUCCESS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA_FAIL", function() { return LOAD_DATA_FAIL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadData", function() { return LoadData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadDataSuccess", function() { return LoadDataSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadDataFail", function() { return LoadDataFail; });
var LOAD_DATA = '[Home] Load Data';
var LOAD_DATA_SUCCESS = '[Home] Load Data Success';
var LOAD_DATA_FAIL = '[Home] Load Data Fail';
var LoadData = /** @class */ (function () {
    function LoadData(payload) {
        this.payload = payload;
        this.type = LOAD_DATA;
    }
    LoadData.ctorParameters = function () { return [
        { type: String }
    ]; };
    return LoadData;
}());

var LoadDataSuccess = /** @class */ (function () {
    function LoadDataSuccess(payload) {
        this.payload = payload;
        this.type = LOAD_DATA_SUCCESS;
    }
    LoadDataSuccess.ctorParameters = function () { return [
        { type: undefined }
    ]; };
    return LoadDataSuccess;
}());

var LoadDataFail = /** @class */ (function () {
    function LoadDataFail() {
        this.type = LOAD_DATA_FAIL;
    }
    return LoadDataFail;
}());



/***/ }),

/***/ "./src/app/home/store/actions/index.ts":
/*!*********************************************!*\
  !*** ./src/app/home/store/actions/index.ts ***!
  \*********************************************/
/*! exports provided: LOAD_DATA, LOAD_DATA_SUCCESS, LOAD_DATA_FAIL, LoadData, LoadDataSuccess, LoadDataFail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.actions */ "./src/app/home/store/actions/home.actions.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA", function() { return _home_actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_DATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA_SUCCESS", function() { return _home_actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_DATA_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA_FAIL", function() { return _home_actions__WEBPACK_IMPORTED_MODULE_0__["LOAD_DATA_FAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadData", function() { return _home_actions__WEBPACK_IMPORTED_MODULE_0__["LoadData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadDataSuccess", function() { return _home_actions__WEBPACK_IMPORTED_MODULE_0__["LoadDataSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadDataFail", function() { return _home_actions__WEBPACK_IMPORTED_MODULE_0__["LoadDataFail"]; });




/***/ }),

/***/ "./src/app/home/store/effects/home.effects.ts":
/*!****************************************************!*\
  !*** ./src/app/home/store/effects/home.effects.ts ***!
  \****************************************************/
/*! exports provided: HomeEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeEffects", function() { return HomeEffects; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/effects */ "./node_modules/@ngrx/effects/fesm5/effects.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _home_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../home.service */ "./src/app/home/home.service.ts");
/* harmony import */ var _actions_home_actions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../actions/home.actions */ "./src/app/home/store/actions/home.actions.ts");







var HomeEffects = /** @class */ (function () {
    function HomeEffects(actionStream, homeService) {
        var _this = this;
        this.actionStream = actionStream;
        this.homeService = homeService;
        this.loadData = this.actionStream.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["ofType"])(_actions_home_actions__WEBPACK_IMPORTED_MODULE_6__["LOAD_DATA"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (action) { return action.payload; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["mergeMap"])(function (type) {
            return _this.homeService
                .getData(type)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (data) { return new _actions_home_actions__WEBPACK_IMPORTED_MODULE_6__["LoadDataSuccess"]({ type: type, data: data }); }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(function (error) { return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["from"])([new _actions_home_actions__WEBPACK_IMPORTED_MODULE_6__["LoadDataFail"]()]); }));
        }));
    }
    HomeEffects.ctorParameters = function () { return [
        { type: _ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Actions"] },
        { type: _home_service__WEBPACK_IMPORTED_MODULE_5__["HomeService"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_2__["Effect"])()
    ], HomeEffects.prototype, "loadData", void 0);
    HomeEffects = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
    ], HomeEffects);
    return HomeEffects;
}());



/***/ }),

/***/ "./src/app/home/store/effects/index.ts":
/*!*********************************************!*\
  !*** ./src/app/home/store/effects/index.ts ***!
  \*********************************************/
/*! exports provided: effects, HomeEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "effects", function() { return effects; });
/* harmony import */ var _home_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.effects */ "./src/app/home/store/effects/home.effects.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HomeEffects", function() { return _home_effects__WEBPACK_IMPORTED_MODULE_0__["HomeEffects"]; });


var effects = [_home_effects__WEBPACK_IMPORTED_MODULE_0__["HomeEffects"]];



/***/ }),

/***/ "./src/app/home/store/index.ts":
/*!*************************************!*\
  !*** ./src/app/home/store/index.ts ***!
  \*************************************/
/*! exports provided: reducers, getHomeRootState, homeStorage, effects, LOAD_DATA, LOAD_DATA_SUCCESS, LOAD_DATA_FAIL, LoadData, LoadDataSuccess, LoadDataFail, getHomeState, getExperience, getSkills, HomeEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reducers */ "./src/app/home/store/reducers/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return _reducers__WEBPACK_IMPORTED_MODULE_0__["reducers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHomeRootState", function() { return _reducers__WEBPACK_IMPORTED_MODULE_0__["getHomeRootState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "homeStorage", function() { return _reducers__WEBPACK_IMPORTED_MODULE_0__["homeStorage"]; });

/* harmony import */ var _actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actions */ "./src/app/home/store/actions/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA", function() { return _actions__WEBPACK_IMPORTED_MODULE_1__["LOAD_DATA"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA_SUCCESS", function() { return _actions__WEBPACK_IMPORTED_MODULE_1__["LOAD_DATA_SUCCESS"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LOAD_DATA_FAIL", function() { return _actions__WEBPACK_IMPORTED_MODULE_1__["LOAD_DATA_FAIL"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadData", function() { return _actions__WEBPACK_IMPORTED_MODULE_1__["LoadData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadDataSuccess", function() { return _actions__WEBPACK_IMPORTED_MODULE_1__["LoadDataSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LoadDataFail", function() { return _actions__WEBPACK_IMPORTED_MODULE_1__["LoadDataFail"]; });

/* harmony import */ var _selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors */ "./src/app/home/store/selectors/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHomeState", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getHomeState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getExperience", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getExperience"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSkills", function() { return _selectors__WEBPACK_IMPORTED_MODULE_2__["getSkills"]; });

/* harmony import */ var _effects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./effects */ "./src/app/home/store/effects/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "effects", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["effects"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "HomeEffects", function() { return _effects__WEBPACK_IMPORTED_MODULE_3__["HomeEffects"]; });







/***/ }),

/***/ "./src/app/home/store/reducers/home.reducer.ts":
/*!*****************************************************!*\
  !*** ./src/app/home/store/reducers/home.reducer.ts ***!
  \*****************************************************/
/*! exports provided: initialState, reducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducer", function() { return reducer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _actions_home_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../actions/home.actions */ "./src/app/home/store/actions/home.actions.ts");


var initialState = {
    experience: [],
    skills: null
};
function reducer(state, action) {
    var _a;
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case _actions_home_actions__WEBPACK_IMPORTED_MODULE_1__["LOAD_DATA_SUCCESS"]:
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__assign"]({}, state, (_a = {}, _a[action.payload.type] = action.payload.data, _a));
        default:
            return state;
    }
}


/***/ }),

/***/ "./src/app/home/store/reducers/index.ts":
/*!**********************************************!*\
  !*** ./src/app/home/store/reducers/index.ts ***!
  \**********************************************/
/*! exports provided: reducers, getHomeRootState, homeStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return reducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHomeRootState", function() { return getHomeRootState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "homeStorage", function() { return homeStorage; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var ngrx_store_localstorage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngrx-store-localstorage */ "./node_modules/ngrx-store-localstorage/dist/index.js");
/* harmony import */ var ngrx_store_localstorage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ngrx_store_localstorage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _home_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./home.reducer */ "./src/app/home/store/reducers/home.reducer.ts");



var reducers = {
    home: _home_reducer__WEBPACK_IMPORTED_MODULE_2__["reducer"]
};
var getHomeRootState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])('home');
function homeStorage(reducer) {
    var config = {
        keys: [
            {
                home: ['experience', 'skills']
            }
        ],
        rehydrate: true,
        removeOnUndefined: true
    };
    return Object(ngrx_store_localstorage__WEBPACK_IMPORTED_MODULE_1__["localStorageSync"])(config)(reducer);
}


/***/ }),

/***/ "./src/app/home/store/selectors/home.selectors.ts":
/*!********************************************************!*\
  !*** ./src/app/home/store/selectors/home.selectors.ts ***!
  \********************************************************/
/*! exports provided: getHomeState, getExperience, getSkills */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getHomeState", function() { return getHomeState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExperience", function() { return getExperience; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSkills", function() { return getSkills; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../reducers */ "./src/app/home/store/reducers/index.ts");


var getHomeState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_reducers__WEBPACK_IMPORTED_MODULE_1__["getHomeRootState"], function (state) { return (state ? state.home : null); });
var getExperience = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getHomeState, function (state) { return state.experience; });
var getSkills = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getHomeState, function (_a) {
    var skills = _a.skills;
    return skills;
});


/***/ }),

/***/ "./src/app/home/store/selectors/index.ts":
/*!***********************************************!*\
  !*** ./src/app/home/store/selectors/index.ts ***!
  \***********************************************/
/*! exports provided: getHomeState, getExperience, getSkills */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./home.selectors */ "./src/app/home/store/selectors/home.selectors.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getHomeState", function() { return _home_selectors__WEBPACK_IMPORTED_MODULE_0__["getHomeState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getExperience", function() { return _home_selectors__WEBPACK_IMPORTED_MODULE_0__["getExperience"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getSkills", function() { return _home_selectors__WEBPACK_IMPORTED_MODULE_0__["getSkills"]; });




/***/ })

}]);
//# sourceMappingURL=home-home-module-es5.js.map