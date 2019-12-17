/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var sfc$ = {/*$sfc$*/}, customElements_;

var root = ((typeof window !== 'undefined') ? window : (((typeof global !== 'undefined') ? global : null)));

var imba = {
	version: '2.0.0',
	global: root,
	ctx: null,
	document: root.document
};

root.imba = imba;

var raf = root.requestAnimationFrame || function(blk) { return setTimeout(blk,1000 / 60); };

(customElements_ = root.customElements) || (root.customElements = {
	define: function() { return console.log('no custom elements'); },
	get: function() { return console.log('no custom elements'); }
});

imba.setTimeout = function(fn,ms) {
	return setTimeout(function() {
		fn();
		return imba.commit();
	},ms);
};

imba.setInterval = function(fn,ms) {
	return setInterval(function() {
		fn();
		return imba.commit();
	},ms);
};

imba.clearInterval = root.clearInterval;
imba.clearTimeout = root.clearTimeout;

imba.q$ = function (query,ctx){
	return ((ctx instanceof Element) ? ctx : document).querySelector(query);
};

imba.q$$ = function (query,ctx){
	return ((ctx instanceof Element) ? ctx : document).querySelectorAll(query);
};

imba.inlineStyles = function (styles){
	var el = document.createElement('style');
	el.textContent = styles;
	document.head.appendChild(el);
	return;
};

var dashRegex = /-./g;

imba.toCamelCase = function (str){
	if (str.indexOf('-') >= 0) {
		return str.replace(dashRegex,function(m) { return m.charAt(1).toUpperCase(); });
	} else {
		return str;
	};
};

var setterCache = {};


imba.toSetter = function (str){
	return setterCache[str] || (setterCache[str] = imba.toCamelCase('set-' + str));
};


var emit__ = function(event,args,node) {
	// var node = cbs[event]
	var prev,cb,ret;
	
	while ((prev = node) && (node = node.next)){
		if (cb = node.listener) {
			if (node.path && cb[node.path]) {
				ret = args ? cb[node.path].apply(cb,args) : cb[node.path]();
			} else {
				// check if it is a method?
				ret = args ? cb.apply(node,args) : cb.call(node);
			};
		};
		
		if (node.times && (node.times = node.times - 1) <= 0) {
			prev.next = node.next;
			node.listener = null;
		};
	};
	return;
};


imba.listen = function (obj,event,listener,path){
	var __listeners___;
	var cbs,list,tail;
	cbs = (__listeners___ = obj.__listeners__) || (obj.__listeners__ = {});
	list = cbs[event] || (cbs[event] = {});
	tail = list.tail || (list.tail = (list.next = {}));
	tail.listener = listener;
	tail.path = path;
	list.tail = tail.next = {};
	return tail;
};


imba.once = function (obj,event,listener){
	var tail = imba.listen(obj,event,listener);
	tail.times = 1;
	return tail;
};


imba.unlisten = function (obj,event,cb,meth){
	var node,prev;
	var meta = obj.__listeners__;
	if (!meta) { return };
	
	if (node = meta[event]) {
		while ((prev = node) && (node = node.next)){
			if (node == cb || node.listener == cb) {
				prev.next = node.next;
				
				node.listener = null;
				break;
			};
		};
	};
	return;
};


imba.emit = function (obj,event,params){
	var cb;
	if (cb = obj.__listeners__) {
		if (cb[event]) { emit__(event,params,cb[event]) };
		if (cb.all) { emit__(event,[event,params],cb.all) };
	};
	return;
};



function Scheduler(){
	var self2 = this;
	self2.queue = [];
	self2.stage = -1;
	self2.batch = 0;
	self2.scheduled = false;
	self2.listeners = {};
	
	self2.__ticker = function(e) {
		self2.scheduled = false;
		return self2.tick(e);
	};
	self2;
};

Scheduler.prototype.add = function (item,force){
	if (force || this.queue.indexOf(item) == -1) {
		this.queue.push(item);
	};
	
	if (!this.scheduled) { return this.schedule() };
};

Scheduler.prototype.listen = function (ns,item){
	this.listeners[ns] || (this.listeners[ns] = new Set());
	return this.listeners[ns].add(item);
};

Scheduler.prototype.unlisten = function (ns,item){
	this.listeners[ns] || (this.listeners[ns] = new Set());
	return this.listeners[ns].remove(item);
};

Object.defineProperty(Scheduler.prototype,'promise',{get: function(){
	var self2 = this;
	return new Promise(function(resolve) { return self2.add(resolve); });
}, configurable: true});

Scheduler.prototype.tick = function (timestamp){
	var self2 = this;
	var items = self2.queue;
	if (!self2.ts) { self2.ts = timestamp };
	self2.dt = timestamp - self2.ts;
	self2.ts = timestamp;
	self2.queue = [];
	self2.stage = 1;
	self2.batch++;
	
	if (items.length) {
		for (let i = 0, ary = iter$(items), len = ary.length, item; i < len; i++) {
			item = ary[i];
			if (typeof item === 'string' && self2.listeners[item]) {
				self2.listeners[item].forEach(function(item) {
					if (item.tick instanceof Function) {
						return item.tick(self2);
					} else if (item instanceof Function) {
						return item(self2);
					};
				});
			} else if (item instanceof Function) {
				item(self2.dt,self2);
			} else if (item.tick) {
				item.tick(self2.dt,self2);
			};
		};
	};
	self2.stage = 2;
	self2.stage = self2.scheduled ? 0 : (-1);
	return self2;
};

Scheduler.prototype.schedule = function (){
	if (!this.scheduled) {
		this.scheduled = true;
		if (this.stage == -1) {
			this.stage = 0;
		};
		raf(this.__ticker);
	};
	return this;
};

imba.scheduler = new Scheduler();
imba.commit = function() { return imba.scheduler.add('render'); };




imba.createElement = function (name,bitflags,parent,flags,text,sfc){
	var el = root.document.createElement(name);
	
	if ((bitflags & 4) || (bitflags === undefined && el.__f != undefined)) {
		if (el.__sfc) {
			el.setAttribute('data-' + el.__sfc,'');
		};
		el.__f = bitflags;
		
		if (text !== null) {
			el.slot$('__').text$(text);
			text = null;
		};
	};
	
	if (flags) { el.className = flags };
	
	if (sfc && sfc.id) {
		el.setAttribute('data-' + sfc.id,'');
	};
	
	if (text !== null) {
		el.text$(text);
	};
	
	if (parent && (parent instanceof Node)) {
		el.insertInto$(parent);
	};
	
	return el;
};




imba.mount = function (element,into){
	// automatic scheduling of element - even before
	element.__schedule = true;
	return (into || document.body).appendChild(element);
};

function ImbaElementRegistry(){ };

ImbaElementRegistry.prototype.get = function (name){
	return root.customElements.get(name);
};

ImbaElementRegistry.prototype.define = function (name,supr,body,options){
	var connectedCallback_, disconnectedCallback_;
	supr || (supr = 'imba-element');
	
	var superklass = HTMLElement;
	
	if ((typeof supr=='string'||supr instanceof String)) {
		if (supr == 'component') {
			supr = 'imba-component';
		};
		
		superklass = this.get(supr);
	};
	
	var klass = class extends superklass {};
	
	
	if (body) { body(klass) };
	
	var proto = klass.prototype;
	
	
	
	proto.__sfc = options && options.id || null;
	
	if (proto.mount) {
		(connectedCallback_ = proto.connectedCallback) || (proto.connectedCallback = function() { return this.mount(); });
	};
	
	if (proto.unmount) {
		(disconnectedCallback_ = proto.disconnectedCallback) || (proto.disconnectedCallback = function() { return this.unmount(); });
	};
	
	root.customElements.define(name,klass);
	return klass;
};

root.imbaElements = new ImbaElementRegistry();

var keyCodes = {
	esc: [27],
	tab: [9],
	enter: [13],
	space: [32],
	up: [38],
	down: [40],
	del: [8,46]
};


function EventHandler(params,closure){
	this.params = params;
	this.closure = closure;
};

EventHandler.prototype.getHandlerForMethod = function (el,name){
	if (!el) { return null };
	return el[name] ? el : this.getHandlerForMethod(el.parentNode,name);
};

EventHandler.prototype.handleEvent = function (event){
	var target = event.target;
	var parts = this.params;
	var i = 0;
	
	for (let i = 0, items = iter$(this.params), len = items.length; i < len; i++) {
		let handler = items[i];
		let args = [event];
		let res;
		let context = null;
		
		if (handler instanceof Array) {
			args = handler.slice(1);
			handler = handler[0];
			
			for (let i = 0, ary = iter$(args), len = ary.length, param; i < len; i++) {
				// what about fully nested arrays and objects?
				// ought to redirect this
				param = ary[i];
				if (typeof param == 'string' && param[0] == '~') {
					let name = param.slice(2);
					
					if (param[1] == '$') {
						// reference to a cache slot
						args[i] = this[name];
					} else if (param[1] == '@') {
						if (name == 'event') {
							args[i] = event;
						} else if (name == 'this') {
							args[i] = this.element;
						} else {
							args[i] = event[name];
						};
					};
				};
			};
		};
		
		
		if (handler == 'stop') {
			event.stopImmediatePropagation();
		} else if (handler == 'prevent') {
			event.preventDefault();
		} else if (handler == 'ctrl') {
			if (!event.ctrlKey) { break; };
		} else if (handler == 'alt') {
			if (!event.altKey) { break; };
		} else if (handler == 'shift') {
			if (!event.shiftKey) { break; };
		} else if (handler == 'meta') {
			if (!event.metaKey) { break; };
		} else if (handler == 'self') {
			if (target != event.currentTarget) { break; };
		} else if (handler == 'once') {
			event.currentTarget.removeEventListener(event.type,this);
		} else if (keyCodes[handler]) {
			if (keyCodes[handler].indexOf(event.keyCode) < 0) {
				break;
			};
		} else if (typeof handler == 'string') {
			if (handler[0] == '@') {
				handler = handler.slice(1);
				context = this.closure;
			} else {
				context = this.getHandlerForMethod(event.currentTarget,handler);
			};
		};
		
		if (context) {
			res = context[handler].apply(context,args);
		} else if (handler instanceof Function) {
			res = handler.apply(event.currentTarget,args);
		};
	};
	
	imba.commit();
	
	return;
};


	// replace this with something else
	Node.prototype.replaceWith$ = function (other){
		this.parentNode.replaceChild(other,this);
		return other;
	};
	
	Node.prototype.insertInto$ = function (parent){
		parent.appendChild$(this);
		return this;
	};
	
	Node.prototype.insertBeforeBegin$ = function (other){
		return this.parentNode.insertBefore(other,this);
	};
	
	Node.prototype.insertAfterEnd$ = function (other){
		if (this.nextSibling) {
			return this.nextSibling.insertBeforeBegin$(other);
		} else {
			return this.parentNode.appendChild(other);
		};
	};




	
	Element.prototype.on$ = function (type,parts,scope){
		var handler = new EventHandler(parts,scope);
		var capture = parts.indexOf('capture') >= 0;
		
		this.addEventListener(type,handler,capture);
		return handler;
	};
	
	
	Element.prototype.text$ = function (item){
		this.textContent = item;
		return this;
	};
	
	Element.prototype.insert$ = function (item,f,prev){
		let type = typeof item;
		
		if (type === 'undefined' || item === null) {
			let el = document.createComment('');
			prev ? prev.replaceWith$(el) : el.insertInto$(this);
			return el;
		} else if (type !== 'object') {
			let res;
			let txt = item;
			
			if ((f & 128) && (f & 256)) {
				// FIXME what if the previous one was not text? Possibly dangerous
				// when we set this on a fragment - it essentially replaces the whole
				// fragment?
				this.textContent = txt;
				return;
			};
			
			if (prev) {
				if (prev instanceof Text) {
					prev.textContent = txt;
					return prev;
				} else {
					res = document.createTextNode(txt);
					prev.replaceWith$(res,this);
					return res;
				};
			} else {
				this.appendChild$(res = document.createTextNode(txt));
				return res;
			};
		} else if (item instanceof Node) {
			prev ? prev.replaceWith$(item,this) : item.insertInto$(this);
			return item;
		};
		return;
	};
	
	Element.prototype.flag$ = function (str){
		this.className = str;
		return;
	};
	
	Element.prototype.flagSelf$ = function (str){
		// if a tag receives flags from inside <self> we need to
		// redefine the flag-methods to later use both
		var self2 = this;
		self2.flag$ = function(str) { return self2.flagSync$(self2.__extflags = str); };
		self2.flagSelf$ = function(str) { return self2.flagSync$(self2.__ownflags = str); };
		self2.className = (self2.className || '') + ' ' + (self2.__ownflags = str);
		return;
	};
	
	Element.prototype.flagSync$ = function (){
		return this.className = ((this.__extflags || '') + ' ' + (this.__ownflags || ''));
	};
	
	Element.prototype.open$ = function (){
		return this;
	};
	
	Element.prototype.close$ = function (){
		return this;
	};
	
	Element.prototype.end$ = function (){
		if (this.render) { this.render() };
		return;
	};


Element.prototype.appendChild$ = Element.prototype.appendChild;
Element.prototype.insertBefore$ = Element.prototype.insertBefore;
Element.prototype.replaceChild$ = Element.prototype.replaceChild;

__webpack_require__(1);


var ImbaElement = class extends HTMLElement {
	constructor(){
		super();
		this.setup$();
		if(this.initialize) this.initialize();
		if(this.build) this.build();
	}
};


	ImbaElement.prototype.setup$ = function (){
		this.__slots = {};
		return this.__f = 0;
	};
	
	
	ImbaElement.prototype.slot$ = function (name,ctx){
		// if the component has no render method
		// we can simply pass through
		if (name == '__' && !this.render) {
			return this;
		};
		
		return this.__slots[name] || (this.__slots[name] = imba.createLiveFragment());
	};
	
	ImbaElement.prototype.schedule = function (){
		imba.scheduler.listen('render',this);
		this.__scheduled = true;
		return this.tick();
	};
	
	ImbaElement.prototype.unschedule = function (){
		imba.scheduler.unlisten('render',this);
		return this.__scheduled = false;
	};
	
	ImbaElement.prototype.connectedCallback = function (){
		if (!this.__f) {
			this.__f = 8;
			this.awaken();
		};
		if (this.__schedule) { this.schedule() };
		if (this.mount) { return this.mount() };
	};
	
	ImbaElement.prototype.disconnectedCallback = function (){
		if (this.__scheduled) { this.unschedule() };
		if (this.unmount) { return this.unmount() };
	};
	
	ImbaElement.prototype.tick = function (){
		return this.render && this.render();
	};
	
	ImbaElement.prototype.awaken = function (){
		return this.__schedule = true;
	};


var ImbaComponent = class extends ImbaElement {
	
};

root.customElements.define('imba-element',ImbaElement);
root.customElements.define('imba-component',ImbaComponent);


imba.createProxyProperty = function (target){
	function getter(){
		return target[0] ? target[0][target[1]] : undefined;
	};
	
	function setter(v){
		return target[0] ? ((target[0][target[1]] = v)) : null;
	};
	
	return {
		get: getter,
		set: setter
	};
};

var isArray = function(val) {
	return val && val.splice && val.sort;
};

var isGroup = function(obj) {
	return (obj instanceof Array) || (obj && (obj.has instanceof Function));
};

var bindHas = function(object,value) {
	if (object instanceof Array) {
		return object.indexOf(value) >= 0;
	} else if (object && (object.has instanceof Function)) {
		return object.has(value);
	} else if (object && (object.contains instanceof Function)) {
		return object.contains(value);
	} else if (object == value) {
		return true;
	} else {
		return false;
	};
};

var bindAdd = function(object,value) {
	if (object instanceof Array) {
		return object.push(value);
	} else if (object && (object.add instanceof Function)) {
		return object.add(value);
	};
};

var bindRemove = function(object,value) {
	if (object instanceof Array) {
		let idx = object.indexOf(value);
		if (idx >= 0) { return object.splice(idx,1) };
	} else if (object && (object.delete instanceof Function)) {
		return object.delete(value);
	};
};




	Element.prototype.getRichValue = function (){
		return this.value;
	};
	
	Element.prototype.setRichValue = function (value){
		return this.value = value;
	};
	
	Element.prototype.bind$ = function (key,mods,value){
		let o = value || [];
		
		if (key == 'model') {
			if (!(this.__f & 16384)) {
				this.__f |= 16384;
				if (this.change$) { this.on$('change',[this.change$],this) };
				if (this.input$) { this.on$('input',['capture',this.input$],this) };
			};
		};
		
		Object.defineProperty(this,key,(o instanceof Array) ? imba.createProxyProperty(o) : o);
		return o;
	};


Object.defineProperty(Element.prototype,'richValue',{
	get: function(){
		return this.getRichValue();
	},
	set: function(v){
		return this.setRichValue(v);
	}
});


	
	HTMLSelectElement.prototype.change$ = function (e){
		if (!(this.__f & 16384)) { return };
		
		let model = this.model;
		let prev = this.__richValue;
		this.__richValue = undefined;
		let values = this.getRichValue();
		
		if (this.multiple) {
			if (prev) {
				for (let i = 0, items = iter$(prev), len = items.length, value; i < len; i++) {
					value = items[i];
					if (values.indexOf(value) != -1) { continue; };
					bindRemove(model,value);
				};
			};
			
			for (let i = 0, items = iter$(values), len = items.length, value; i < len; i++) {
				value = items[i];
				if (!prev || prev.indexOf(value) == -1) {
					bindAdd(model,value);
				};
			};
		} else {
			this.model = values[0];
		};
		return this;
	};
	
	HTMLSelectElement.prototype.getRichValue = function (){
		if (this.__richValue) {
			return this.__richValue;
		};
		
		let res = [];
		for (let i = 0, items = iter$(this.selectedOptions), len = items.length; i < len; i++) {
			res.push(items[i].richValue);
		};
		return this.__richValue = res;
	};
	
	HTMLSelectElement.prototype.syncValue = function (){
		let model = this.model;
		
		if (this.multiple) {
			let vals = [];
			for (let i = 0, items = iter$(this.options), len = items.length, option; i < len; i++) {
				option = items[i];
				let val = option.richValue;
				let sel = bindHas(model,val);
				option.selected = sel;
				if (sel) { vals.push(val) };
			};
			this.__richValue = vals;
		} else {
			for (let i = 0, items = iter$(this.options), len = items.length; i < len; i++) {
				let val = items[i].richValue;
				if (val == model) {
					this.__richValue = [val];
					this.selectedIndex = i;break;
				};
			};
		};
		return;
	};
	
	HTMLSelectElement.prototype.end$ = function (){
		return this.syncValue();
	};



	HTMLOptionElement.prototype.setRichValue = function (value){
		this.__richValue = value;
		return this.value = value;
	};
	
	HTMLOptionElement.prototype.getRichValue = function (){
		if (this.__richValue !== undefined) {
			return this.__richValue;
		};
		return this.value;
	};



	HTMLTextAreaElement.prototype.setRichValue = function (value){
		this.__richValue = value;
		return this.value = value;
	};
	
	HTMLTextAreaElement.prototype.getRichValue = function (){
		if (this.__richValue !== undefined) {
			return this.__richValue;
		};
		return this.value;
	};
	
	HTMLTextAreaElement.prototype.input$ = function (e){
		return this.model = this.value;
	};
	
	HTMLTextAreaElement.prototype.end$ = function (){
		return this.value = this.model;
	};



	
	HTMLInputElement.prototype.input$ = function (e){
		if (!(this.__f & 16384)) { return };
		let typ = this.type;
		
		if (typ == 'checkbox' || typ == 'radio') {
			return;
		};
		
		this.__richValue = undefined;
		return this.model = this.richValue;
	};
	
	HTMLInputElement.prototype.change$ = function (e){
		if (!(this.__f & 16384)) { return };
		
		let model = this.model;
		let val = this.richValue;
		
		if (this.type == 'checkbox' || this.type == 'radio') {
			let checked = this.checked;
			if (isGroup(model)) {
				return checked ? bindAdd(model,val) : bindRemove(model,val);
			} else {
				return this.model = checked ? val : false;
			};
		};
	};
	
	HTMLInputElement.prototype.setRichValue = function (value){
		this.__richValue = value;
		return this.value = value;
	};
	
	HTMLInputElement.prototype.getRichValue = function (){
		if (this.__richValue !== undefined) {
			return this.__richValue;
		};
		
		let value = this.value;
		let typ = this.type;
		
		if (typ == 'range' || typ == 'number') {
			value = this.valueAsNumber;
			if (Number.isNaN(value)) { value = null };
		} else if (typ == 'checkbox') {
			if (value == undefined || value === 'on') { value = true };
		};
		
		return value;
	};
	
	HTMLInputElement.prototype.end$ = function (){
		if (this.__f & 16384) {
			if (this.type == 'checkbox' || this.type == 'radio') {
				return this.checked = bindHas(this.model,this.richValue);
			} else {
				return this.richValue = this.model;
			};
		};
	};




/***/ }),
/* 1 */
/***/ (function(module, exports) {

// helper for subclassing
function subclass$(obj,sup) {
	for (var k in sup) {
		if (sup.hasOwnProperty(k)) obj[k] = sup[k];
	};
	// obj.__super__ = sup;
	obj.prototype = Object.create(sup.prototype);
	obj.__super__ = obj.prototype.__super__ = sup.prototype;
	obj.prototype.initialize = obj.prototype.constructor = obj;
};

var sfc$ = {/*$sfc$*/};



	
	// Called to make a documentFragment become a live fragment
	DocumentFragment.prototype.setup$ = function (flags,options){
		this.__start = imba.document.createComment('start');
		this.__end = imba.document.createComment('end');
		
		this.__end.replaceWith$ = function(other) {
			this.parentNode.insertBefore(other,this);
			return other;
		};
		
		this.appendChild(this.__start);
		return this.appendChild(this.__end);
	};
	
	
	
	DocumentFragment.prototype.text$ = function (item){
		if (!this.__text) {
			this.__text = this.insert$(item);
		} else {
			this.__text.textContent = item;
		};
		return;
	};
	
	DocumentFragment.prototype.insert$ = function (item,options,toReplace){
		if (this.__parent) {
			// if the fragment is attached to a parent
			// we can just proxy the call through
			return this.__parent.insert$(item,options,toReplace || this.__end);
		} else {
			return Element.prototype.insert$.call(this,item,options,toReplace || this.__end);
		};
	};
	
	DocumentFragment.prototype.insertInto$ = function (parent){
		if (!this.__parent) {
			this.__parent = parent;
			parent.appendChild$(this);
		};
		return this;
	};
	
	DocumentFragment.prototype.replaceWith$ = function (other){
		this.__start.insertBeforeBegin$(other);
		var el = this.__start;
		while (el){
			let next = el.nextSibling;
			this.appendChild(el);
			if (el == this.__end) { break; };
			el = next;
		};
		
		return other;
	};
	
	DocumentFragment.prototype.appendChild$ = function (child){
		this.__end.insertBeforeBegin$(child);
		return child;
	};
	
	DocumentFragment.prototype.removeChild$ = function (child){
		child.parentNode && child.parentNode.removeChild(child);
		return this;
	};


imba.createLiveFragment = function (bitflags,options){
	var el = imba.document.createDocumentFragment();
	el.setup$(bitflags,options);
	return el;
};


function TagFragment(f,parent){
	this.__f = f;
	this.__parent = parent;
	
	if (!(f & 128) && (this instanceof KeyedTagFragment)) {
		this.__start = imba.document.createComment('start');
		if (this.__parent) { this.__parent.appendChild(this.__start) };
	};
	
	if (!(f & 256)) {
		this.__end = imba.document.createComment('end');
		if (parent) { parent.appendChild(this.__end) };
	};
	
	this.setup();
};

TagFragment.prototype.appendChild$ = function (item,index){
	// we know that these items are dom elements
	if (this.__end) {
		this.__end.insertBeforeBegin$(item);
	} else {
		this.__parent.appendChild(item);
	};
	return;
};

TagFragment.prototype.setup = function (){
	return this;
};

function KeyedTagFragment(){ return TagFragment.apply(this,arguments) };

subclass$(KeyedTagFragment,TagFragment);
KeyedTagFragment.prototype.setup = function (){
	this.array = [];
	this.changes = new Map();
	this.dirty = false;
	return this.$ = {};
};

KeyedTagFragment.prototype.push = function (item,idx){
	// on first iteration we can merely run through
	if (!(this.__f & 8)) {
		this.array.push(item);
		this.appendChild$(item);
		return;
	};
	
	let toReplace = this.array[idx];
	
	if (toReplace === item) {
		true;
	} else {
		this.dirty = true;
		
		let prevIndex = this.array.indexOf(item);
		let changed = this.changes.get(item);
		
		if (prevIndex === -1) {
			// should we mark the one currently in slot as removed?
			this.array.splice(idx,0,item);
			this.insertChild(item,idx);
		} else if (prevIndex === idx + 1) {
			if (toReplace) {
				this.changes.set(toReplace,-1);
			};
			this.array.splice(idx,1);
		} else {
			if (prevIndex >= 0) { this.array.splice(prevIndex,1) };
			this.array.splice(idx,0,item);
			this.insertChild(item,idx);
		};
		
		if (changed == -1) {
			this.changes.delete(item);
		};
	};
	return;
};

KeyedTagFragment.prototype.insertChild = function (item,index){
	if (index > 0) {
		let other = this.array[index - 1];
		
		other.insertAdjacentElement('afterend',item);
	} else if (this.__start) {
		this.__start.insertAfterEnd$(item);
	} else {
		this.__parent.insertAdjacentElement('afterbegin',item);
	};
	return;
};

KeyedTagFragment.prototype.removeChild = function (item,index){
	// @map.delete(item)
	// what if this is a fragment or virtual node?
	if (item.parentNode == this.__parent) {
		this.__parent.removeChild(item);
	};
	return;
};

KeyedTagFragment.prototype.end$ = function (index){
	var self2 = this;
	if (!(self2.__f & 8)) {
		self2.__f |= 8;
		return;
	};
	
	if (self2.dirty) {
		self2.changes.forEach(function(pos,item) {
			if (pos == -1) {
				return self2.removeChild(item);
			};
		});
		self2.changes.clear();
		self2.dirty = false;
	};
	
	
	if (self2.array.length > index) {
		
		// remove the children below
		while (self2.array.length > index){
			let item = self2.array.pop();
			self2.removeChild(item);
		};
		
	};
	return;
};

function IndexedTagFragment(){ return TagFragment.apply(this,arguments) };

subclass$(IndexedTagFragment,TagFragment);
IndexedTagFragment.prototype.setup = function (){
	this.$ = [];
	return this.length = 0;
};

IndexedTagFragment.prototype.push = function (item,idx){
	return;
};

IndexedTagFragment.prototype.end$ = function (len){
	let from = this.length;
	if (from == len) { return };
	let array = this.$;
	
	if (from > len) {
		while (from > len){
			this.removeChild(array[--from]);
		};
	} else if (len > from) {
		while (len > from){
			this.appendChild$(array[from++]);
		};
	};
	this.length = len;
	return;
};

IndexedTagFragment.prototype.insertInto = function (parent,slot){
	return this;
};

IndexedTagFragment.prototype.removeChild = function (item,index){
	// item need to be able to be added
	this.__parent.removeChild(item);
	return;
};



imba.createFragment = function (bitflags,parent){
	if (bitflags & 32768) {
		return new IndexedTagFragment(bitflags,parent);
	} else {
		return new KeyedTagFragment(bitflags,parent);
	};
};




/***/ })
/******/ ]);
imba.inlineStyles("body{font-family:'Source Sans Pro',sans-serif;margin:0;}\np[data-if3a896fc]{color:red;}.day[data-if3a896fc]{font-size:2.0rem;display:grid;grid-template:1fr / 1fr 1fr;border-bottom:1px solid gray;grid-gap:1rem;}ruby[data-if3a896fc]{border-right:1px solid gray;text-align:center;}.hello-world[data-if3a896fc]{display:grid;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;padding:1rem;}h1[data-if3a896fc],footer[data-if3a896fc]{text-align:center;padding-bottom:1rem;}footer[data-if3a896fc]{padding-bottom:1rem;}footer a[data-if3a896fc]{-webkit-text-decoration:none;text-decoration:none;color:hotpink;}\n");
var sfc$ = {"id":"if3a896fc"}, t$0, d$0;
/* css
body {
	font-family: 'Source Sans Pro', sans-serif;
	margin: 0;
}
*/


var counter = 0;

imbaElements.define('hello-world', null, function(tag){
	/* css scoped
		p {
			color: red;
		}
		
		.day {
			font-size: 2.0rem;
			display: grid;
			grid-template: 1fr /  1fr 1fr;
			border-bottom: 1px solid gray;
			grid-gap: 1rem;
		}
		ruby {
			border-right: 1px solid gray;
			text-align: center;
		}
	
		
		.hello-world {
			display: grid;
			justify-content: center;
			padding: 1rem;
		}
	
		h1, footer {
			text-align: center;
			padding-bottom: 1rem;
		}
	
		footer {
			padding-bottom: 1rem;
		}
		footer a {
			text-decoration: none;
			color: hotpink;
		}
		
		*/
	
	tag.prototype.incr = function (){
		return counter++;
	};
	
	tag.prototype.render = function (){
		var t$0, c$0, b$0, d$0, t$1, t$2, t$3;
		t$0=this;
		t$0.open$();
		c$0 = (b$0=d$0=1,t$0.$) || (b$0=d$0=0,t$0.$={});
		((!b$0||d$0&2) && t$0.flagSelf$('hello-world'));
		b$0 || (t$1=imba.createElement('link',128,t$0,null,null,sfc$));
		b$0 || (t$1.href="https://fonts.googleapis.com/css?family=Sawarabi+Mincho|Source+Sans+Pro&display=swap");
		b$0 || (t$1.rel="stylesheet");
		b$0 || (t$1=imba.createElement('header',0,t$0,null,null,sfc$));
		b$0 || (t$2=imba.createElement('h1',384,t$1,null,"Japanese Weekdays",sfc$));
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("日曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"にちようび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("🌞 Sunday");
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("月曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"げつようび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("🌚 Monday");
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("火曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"かようび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("🔥 Tuesday");
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("水曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"すいようび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("💧 Wednesday");
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("木曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"もくようび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("🌲 Thursday");
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("金曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"きにょうび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("🥈 Friday");
		b$0 || (t$1=imba.createElement('div',0,t$0,'day',null,sfc$));
		b$0 || (t$2=imba.createElement('ruby',128,t$1,null,null,sfc$));
		b$0 || t$2.insert$("土曜日");
		b$0 || (t$3=imba.createElement('rp',0,t$2,null,"(",sfc$));
		b$0 || (t$3=imba.createElement('rt',0,t$2,null,"どようび",sfc$));
		b$0 || (t$3=imba.createElement('rp',256,t$2,null,")",sfc$));
		b$0 || t$1.insert$("🚜 Saturday");
		b$0 || (t$1=imba.createElement('footer',256,t$0,null,null,sfc$));
		b$0 || (t$2=imba.createElement('span',384,t$1,null,null,sfc$));
		b$0 || t$2.insert$("Built by ");
		b$0 || (t$3=imba.createElement('a',0,t$2,null,"scanf",sfc$));
		b$0 || (t$3.href="https://github.com/scanf");
		b$0 || t$2.insert$(" with ");
		b$0 || (t$3=imba.createElement('a',256,t$2,null,"Imba v2.0.0-alpha.9",sfc$));
		b$0 || (t$3.href="https://github.com/imba/imba");
		t$0.close$(d$0);
		return t$0;
	};
}, sfc$);


imba.mount(((t$0=imba.createElement('hello-world',4,null,null,null,sfc$)),
t$0.end$(d$0),
t$0));
