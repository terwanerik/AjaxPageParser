## AjaxPageParser - Load pages asynchronously with ease

Please note: this project is over 2 years old, and has not been tested with newer versions of jQuery.

This plugin loads a page or some part of it from a website via AJAX, adjusts the page title and URL. With before, finished and error callbacks, to show loaders, update menu items etc. It works best if you use some kind of MVC structure, so the URL that is being called is a standalone website

## Demo
A live demo is available on [Github Pages](http://terwanerik.github.io/AjaxPageParser).

## Usage
The plugin is really simple, add the jquery.pageparser-[version].min.js to your project folder and include it.

```html
<script src="src/jquery.pageparser-0.1.1.min.js" type="text/javascript"></script>
```

Place a container anywhere on your page, a div is preferred.

```html
<div id="container">
	<div class="page">
		<h1>This is the part of the page i would like to change</h1>
		<p>Without the parseElement option set, it loads the complete page into the container div.</p>
	</div>
</div>
```

Now have a number of links (or at least elements) on your page, a menu, etc.
```html
<ul class="menu">
	<li><a href="http://absolute.url/to/page.php"></a></li>
	<li><a href="http://absolute.url/to/another/page.php"></a></li>
	<li><a href="http://absolute.url/to/some/page.php"></a></li>
</ul>
```

Now call the .pageParser() function on the links or elements, you need to pass at least an container. Do this after the page has finished loading.

```javascript
$(function(){
  $("ul.menu a").pageParser({
    container: $("#container"), //required
    parseElement: ".page" //optional, but very handy
  });
});
```

## Options
There are a number of options you can pass to the pageParser, if you need a preview on how to do that, check the [live demo](http://terwanerik.github.io/AjaxPageParser).

| Option Name | Type | Default | Description |
| ----------- | ---- | ------- | ----------- |
| container | jQuery Object | null | The container for the page to be inserted into. - REQUIRED |
| dynamicUrl | Boolean | true | If false, the plugin doesn't update the URL to match the loaded page, a refresh then returns the original page.  |
| initialElement| jQuery Object | null | The object that is active on page-load. This is needed if you want to use dynamicUrl's and still be able to use the back-button. You can find a preview on how to use it in the demo. |
| parseElement | String | null | The element on the page to get, if null the complete page will be loaded into the container. The format is a string with a jQuery selector (e.g. ".someDiv", "#container .innerDiv") |
| setTitle | Boolean | true | If true, the title of the page will be updated according to the loaded page. |
| trigger | String | 'click' | The event to trigger the load on, default is click, but could be 'mouseenter' etc. |
| urlAttribute | String | 'href' | The attribute where the URL is stored, default is href (for a href="") but can be any HTML attribute. |
| before | Callback | none | The function that is called before the loading begins, say for displaying a loading screen. 'this' returns the element that was triggered, see the demo for more info. |
| finished | Callback | none | The function that is called when everything is finished, say for hiding a loading screen. 'this' returns the element that was triggered, see the demo for more info. |
| error | Callback | none | The function that is called when the page cannot be loaded. 'this' returns the xhr status. |

## Known issues
You need to have a wrapper for your page in the container, if not, the container from the new page is inserted into the container, instead of the page, this is only valid when using the parseElement option. Basically; you cannot have the same container and parseElement.
