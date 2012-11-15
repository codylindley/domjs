
dom.fn.html = function(htmlStringOrTextString){
	if(htmlStringOrTextString){
		return this.each(function(){
			this.innerHTML = htmlStringOrTextString;
		});
	}else{
		return this[0].innerHTML;
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

dom.fn.append = function(stringOrObject){
	return this.each(function(){
		if(typeof stringOrObject === 'string'){
			this.insertAdjacentHTML('beforeend',stringOrObject);
		}else{
			var that = this;
			dom(stringOrObject).each(function(name,value){
				that.insertAdjacentHTML('beforeend',value.outerHTML);
			});
		}
	});
};

