module('core.js');

test('invoke dom() with no parameter',function(){
	equal(typeof dom(),'object','dom() returns an object');
	equal( dom('').length, 0, "dom('')" );
});

test('invoke dom()',function(){
	equal(typeof dom('body'),'object');
	equal(typeof dom('<p>Hellow</p><p> World!</p>'),'object');
	equal(typeof dom(document.body),'object');
	equal(typeof dom([document.body]),'object');
	equal(typeof dom('document.body.children'),'object');
	equal(typeof dom(dom('body')),'object');
	equal(dom('body').length > 0,true);
	equal(dom('<p>Hellow</p><p> World!</p>').length  > 0,true);
	equal(dom(document.body).length  > 0,true);
	equal(dom([document.body]).length  > 0,true);
	equal(dom(document.body.children).length  > 0,true);
	equal(dom(dom('body')).length  > 0,true);
});

test('dom.html()',function(){
	equal(typeof dom('#qunit-fixture').html('<p>hi</p>'),'object');
	equal(dom('#qunit-fixture').html(),'<p>hi</p>');
});

test('dom.text()',function(){
	equal(typeof dom('#qunit-fixture li:first-child').text('blue'),'object');
	equal(dom('#qunit-fixture li').text(''),'blue');
});

test('dom.append()',function(){
	dom('#qunit-fixture ul').append('<li>4</li>');
	equal(dom('#qunit-fixture li').length,4);

	dom('#qunit-fixture ul').append(document.createElement('li'));
	equal(dom('#qunit-fixture li').length,5);
});
