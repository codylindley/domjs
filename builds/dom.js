/*dom - v0.1.0 - 2012-11-08
* http://http://domenlightenment.com/#12
* Copyright (c) 2012 Cody Lindley; Licensed MIT */

(function(win){

'use strict';

var global = win;
var doc = global.document;

var dom = function(params,context){
	return new GetOrMakeDom(params,context);
};

var GetOrMakeDom = function(params,context){

	var currentContext = doc;
	if(context){
		if(context.nodeType){
			currentContext = context;
		}else{
			currentContext = doc.querySelector(context);
		}
	}

	//if no params, return empty dom() object
	if(!params || params === '' || typeof params === 'string' && params.trim() === ''){
		this.length = 0;
		return this;
	}

	//if HTML string, construct domfragment, fill object, then return object
	if(typeof params === 'string' && /^\s*<(\w+|!)[^>]*>/.test(params)){//yup its forsure html string
		//create div & docfrag, append div to docfrag, then set its div's innerHTML to the string, then get first child
		var divElm = currentContext.createElement('div');
		divElm.className = 'hippo-doc-frag-wrapper';
		var docFrag = currentContext.createDocumentFragment();
		docFrag.appendChild(divElm);
		var queryDiv = docFrag.querySelector('div');
		queryDiv.innerHTML = params;
		var numberOfChildren = queryDiv.children.length;
		//loop over nodelist and fill object, needs to be done because a string of html can be passed with siblings
		for (var z = 0; z < numberOfChildren; z++) {
			this[z] = queryDiv.children[z];
		}
		//give the object a length value
		this.length = numberOfChildren;
		//return object
		return this; //return e.g. {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}
	}

	//if a single node reference is passed, fill object, return object
	if(typeof params === 'object' && params.nodeName){
		this.length = 1;
		this[0] = params;
		return this;
	}

	//if its an object but not a node assume nodelist or array, else its a string selector, so create nodelist
	var nodes;
	if(typeof params !== 'string'){//nodelist or array
		nodes = params;
	}else{ //ok string
		nodes = currentContext.querySelectorAll(params.trim());
	}
	//loop over array or nodelist created above and fill object
	var nodeLength = nodes.length;
	for (var i = 0; i < nodeLength; i++) {
		this[i] = nodes[i];
	}
	//give the object a length value
	this.length = nodeLength;
	//return  object
	return this; //return e.g. {0:ELEMENT_NODE,1:ELEMENT_NODE,length:2}

};

//expose dom to global scope
global.dom = dom;

//global short cut to prototype
dom.fn = GetOrMakeDom.prototype;


})(window);


dom.fn.each = function (callback) {
	var len = this.length;
	for(var i = 0; i < len; i++){
		callback.call(this[i], i, this[i]);
	}
	return this;
};

dom.fn.replaceWith = function(value){
	if(!value){return this;}
	return this.each(function(){
		if(/^\s*<(\w+|!)[^>]*>/.exec(value) !== null){ //html string
			this.outerHTML = value;
		}else if(typeof value === 'string' && document.querySelectorAll(value).length === 0){//text node
			this.outerHTML = value;
		}else if(typeof value === 'string'){ //selector
			this.outerHTML = dom(value)[0].outerHTML;
		}else if(value.nodeName){ //node
			this.outerHTML = value.outerHTML;
		}else{//if dom object
			this.outerHTML = value[0].outerHTML;
		}
	});
};

dom.fn.empty = function(){
	return this.each(function(){
		this.innerHTML = '';
	});
};

dom.fn.remove = function(){
	return this.each(function(){
		if(this.parentNode){
			this.parentNode.removeChild(this);
		}
	});
};

dom.fn.before = function(htmlStringOrNodeOrSelector){
	return this.each(function(){
		if(/^\s*<(\w+|!)[^>]*>/.exec(htmlStringOrNodeOrSelector) !== null){ //html string
			this.insertAdjacentHTML('beforebegin',htmlStringOrNodeOrSelector);
		}else if(typeof htmlStringOrNodeOrSelector === 'string'){ //selector
			this.insertAdjacentHTML('beforebegin',dom(htmlStringOrNodeOrSelector)[0].outerHTML);
		}else if(htmlStringOrNodeOrSelector.nodeName){ //node
			this.insertAdjacentHTML('beforebegin',htmlStringOrNodeOrSelector.outerHTML);
		}else{//if dom object
			var that = this;
			htmlStringOrNodeOrSelector.each(function(name,value){
				that.insertAdjacentHTML('beforebegin',value.outerHTML);
			});
		}
	});
};

dom.fn.insertBefore = function(htmlStringOrNodeOrSelector){
	//deal with inserting a doc frag, infront of another doc frag i.e. dom('<li></li>').insertBefore('<li class="test"><li>')
	if(this[0].parentNode.className === 'dom-doc-frag-wrapper' && /^\s*<(\w+|!)[^>]*>/.exec(htmlStringOrNodeOrSelector) !== null){
		return dom(this[0]).add(htmlStringOrNodeOrSelector,true);
	}
	//else, do a normal insertBefore
	return this.each(function(){
		dom(htmlStringOrNodeOrSelector).before(this);
	});
};

dom.fn.after = function(htmlStringOrNodeOrSelector){
	return this.each(function(){
		if(/^\s*<(\w+|!)[^>]*>/.exec(htmlStringOrNodeOrSelector) !== null){ //html string
			this.insertAdjacentHTML('afterend',htmlStringOrNodeOrSelector);
		}else if(typeof htmlStringOrNodeOrSelector === 'string'){ //selector
			this.insertAdjacentHTML('afterend',dom(htmlStringOrNodeOrSelector)[0].outerHTML);
		}else if(htmlStringOrNodeOrSelector.nodeName){ //node
			this.insertAdjacentHTML('afterend',htmlStringOrNodeOrSelector.outerHTML);
		}else{//if dom object
			var that = this;
			htmlStringOrNodeOrSelector.each(function(name,value){
				that.insertAdjacentHTML('afterend',value.outerHTML);
			});
		}
	});
};

dom.fn.insertAfter = function(htmlStringOrNodeOrSelector){
	//deal with inserting a doc frag, infront of another doc frag i.e. dom('<li></li>').insertBefore('<li class="test"><li>')
	if(this[0].parentNode.className === 'dom-doc-frag-wrapper' && /^\s*<(\w+|!)[^>]*>/.exec(htmlStringOrNodeOrSelector) !== null){
		return dom(this[0]).add(htmlStringOrNodeOrSelector);
	}
	//else, do a normal insertBefore
	return this.each(function(){
		dom(htmlStringOrNodeOrSelector).after(this);
	});
};

dom.fn.append = function(htmlStringOrtextStringOrNode){
	return this.each(function(){
		if(typeof htmlStringOrtextStringOrNode === 'string'){ //selector
			this.insertAdjacentHTML('beforeend',htmlStringOrtextStringOrNode);
		}else if(htmlStringOrtextStringOrNode.nodeName){ //node
			this.insertAdjacentHTML('beforeend',htmlStringOrtextStringOrNode.outerHTML);
		}else{//if dom object
			var that = this;
			htmlStringOrtextStringOrNode.each(function(name,value){
				that.insertAdjacentHTML('beforeend',value.outerHTML);
			});
		}
	});
};

dom.fn.appendTo = function(selector){
	return this.each(function(){
		dom(selector).append(this);
	});
};

dom.fn.prepend = function(htmlStringOrtextStringOrNode){
	return this.each(function(){
		if(typeof htmlStringOrtextStringOrNode === 'string'){ //selector
			this.insertAdjacentHTML('afterbegin',htmlStringOrtextStringOrNode);
		}else if(htmlStringOrtextStringOrNode.nodeName){ //node
			this.insertAdjacentHTML('afterbegin',htmlStringOrtextStringOrNode.outerHTML);
		}else{//if dom object
			var that = this;
			htmlStringOrtextStringOrNode.each(function(name,value){
				that.insertAdjacentHTML('afterbegin',value.outerHTML);
			});
		}
	});
};

dom.fn.prependTo = function(selector){
	return this.each(function(){
		dom(selector).prepend(this);
	});
};

dom.fn.wrap = function(string){
	return this.each(function(){
		dom(this).replaceWith(dom(string).append(this));
	});
};

dom.fn.wrapInner = function(string){
	return this.each(function(){
		this.innerHTML = dom(string).append(this)[0].outerHTML;
	});

};

 dom.fn.html = function(htmlStringOrTextString){
	if(htmlStringOrTextString){
		return this.each(function(){
			this.innerHTML = htmlStringOrTextString;
		});
	}else{
		return this[0].innerHTML;
	}
};

 dom.fn.outerHtml = function(htmlStringOrTextString){
	if(htmlStringOrTextString){
		return this.each(function(){
			this.outerHTML = htmlStringOrTextString;
		});
	}else{
		return this[0].outerHTML;
	}
};

dom.fn.text = function(textString){
	if(textString){
		return this.each(function(){
			this.textContent = textString;
		});
	}else{
		return this[0].textContent.trim();
	}
};

