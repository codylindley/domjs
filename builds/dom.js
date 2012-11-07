/*dom - v0.1 - 2012-11-07
* http://http://domenlightenment.com/#12
* Copyright (c) 2012 Cody Lindley; Licensed MIT */

(function(win){

'use strict';

var global = win;
var doc = global.document;

var dom = function(params,context){
	return new GetOrMakeDom(params,context);
};

var regXContainsTag = /^\s*<(\w+|!)[^>]*>/;

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
	if(typeof params === 'string' && regXContainsTag.test(params)){//yup its forsure html string
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
