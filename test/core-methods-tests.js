module('core-methods.js');

test('dom.each()',function(){
	dom('#qunit-fixture li').each(function(index,value){
		value.textContent = '0';
	});
	equal(dom('#qunit-fixture li')[0].textContent,'0');
});
