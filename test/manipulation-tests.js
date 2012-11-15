module('manipulation.js');

test('dom.html()',function(){
	dom('#qunit-fixture li').html('<strong>one</strong>');
	equal(dom('#qunit-fixture li').html(),'<strong>one</strong>');
});

test('dom.text()',function(){
	dom('#qunit-fixture li:last-child').text('three');
	equal(dom('#qunit-fixture li:last-child').text(),'three');
});

test('dom.append()',function(){
	dom('#qunit-fixture ul').append('<li>4</li>');
	equal(dom('#qunit-fixture li').length,4);

	dom('#qunit-fixture ul').append(document.createElement('li'));
	equal(dom('#qunit-fixture li').length,5);
});