!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.SegregateLocalStorage=t():e.SegregateLocalStorage=t()}(window,(function(){return function(e){var t={};function s(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,s),r.l=!0,r.exports}return s.m=e,s.c=t,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)s.d(n,r,function(t){return e[t]}.bind(null,r));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=0)}([function(e,t,s){"use strict";s.r(t);var n=class{constructor(e="",t=!1){this.allEvents=new Set,this.events={},this.onceCallbacks={},this.eventsPrefix=e,this.autoPrefix=t}getEventName(e,t=this.autoPrefix){return this.eventsPrefix&&t?`${this.eventsPrefix}:${e}`:e}on(e,t){let s=this.getEventName(e);return this.events[s]=this.events[s]||new Set,this.events[s].add(t),this}off(e,t){let s=this.getEventName(e);return this.events[s]?(this.events[s].delete(t),this):this}one(e,t){let s=this.getEventName(e);return this.events[s]=new Set([t]),this}once(e,t){let s=this.getEventName(e);return this.events[s]=this.events[s]||new Set,this.events[s].add(t),this.onceCallbacks[s]=this.onceCallbacks[s]||new Set,this.onceCallbacks[s].add(t),this}onAll(e){return this.allEvents.add(e),this}offAll(e){return this.allEvents.delete(e),this}emit(e,t){let s=this.getEventName(e,!0);return this.allEvents.forEach(s=>s(e,t)),this.events[s]&&this.events[s].forEach(n=>{var r,i;n(t),(null===(i=null===(r=this.onceCallbacks[s])||void 0===r?void 0:r.has)||void 0===i?void 0:i.call(r,n))&&(this.off(e,n),this.onceCallbacks[s].delete(n))}),this}};const r={},i={},o=e=>"object"==typeof e&&null!==e&&!Array.isArray(e);t.default=class extends n{constructor(e,t={},s=!1,n=localStorage){return super(),this.name="",r[e]?r[e]:(this.init(e,t,s,n),this)}set(e,t){if(this.isDestroyed)return;if(void 0===t)return;const s=JSON.parse(this.storage.getItem(this.name));if(!s)return;const n=s[e];s[e]=t;const r=this.storage.setItem(this.name,JSON.stringify(s));return this.emit("set",{key:e,val:t,oldVal:n}),this.emit(e,t),r}get(e){if(this.isDestroyed)return;const t=JSON.parse(this.storage.getItem(this.name));if(!t)return;const s=t[e];return this.emit("get",{key:e,val:s}),s}getAll(){var e;if(this.isDestroyed)return;const t=JSON.parse(null!==(e=this.storage.getItem(this.name))&&void 0!==e?e:"{}");return this.emit("getAll",t),t}remove(e){if(this.isDestroyed)return;const t=JSON.parse(this.storage.getItem(this.name));if(!t)return;const s=t[e];delete t[e];const n=this.storage.setItem(this.name,JSON.stringify(t));return this.emit("remove",{key:e,val:s}),n}clear(){if(!this.isDestroyed)return this.emit("clear"),this.storage.removeItem(this.name)}destroy(){this.isDestroyed||(i[this.name]=!0,delete r[this.name],this.emit("destroy"))}get isDestroyed(){return!!i[this.name]}init(e,t={},s=!1,n=localStorage){return delete i[e],this.name=e,this.storage=n,((e,t,s,n)=>{const r=n.getItem(e);if(!r)return n.setItem(e,JSON.stringify(t)),!0;try{const i=JSON.parse(r);if(!r||!o(r)||!o(t))return!1;if(s){const e=new Set(Object.keys(t));Object.keys(i).forEach(t=>{e.has(t)||delete i[t]})}const a=Object.assign(Object.assign({},t),i);n.setItem(e,JSON.stringify(a))}catch(e){}})(e,t,s,n),r[e]=this,this.emit("init"),this}}}]).default}));