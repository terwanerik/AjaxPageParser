/* 
 * AjaxPageParser jQuery Plugin
 * Made by Erik Terwan
 * 6 February 2015 - 0.1.2
 * 
 * This plugin is provided as-is and released under the terms of the MIT license.
 */

(function($){
	$.fn.pageParser = function(options){
		/*
		 *  VARIABLES
		 */
		
		// Set the default options
		var settings = $.extend({
			container: null, //the container for the data to be displayed in, cannot be null - required
			dynamicUrl: true, //if false, the plugin doesn't update the URL to match the loaded page
			initialElement: null, //the element that is active / the page is loaded from on initial load. Needed to go back to the first page in with popstate. Only usefull if you use dynamic urls
			parseElement: null, //the element on the page you want to implement, if empty it loads the whole page
			setTitle: true, //set the title of the page to the one you are loading
			trigger: 'click', //when to trigger the loading, default is on click
			urlAttribute: 'href', //the attribute to be checked for the url, default is href (for a tags)
			
			before : function(){}, //the callback that gets called before loading, say for displaying a loader. 'this' returns the clicked button
			finished : function(){}, //the callback that gets called after everything is loaded, say to hide the loader, toggle button state.  'this' returns the clicked button
			error : function(){} //the callback that gets called after an error, do custom error handling here. Returns the xhr status.
		}, options);
		
		var $thisElement = this; //for use inside private functions etc.
		
		/*
		 *  PRIVATE METHODS
		 */
		
		//initialize
		function init()
		{
			$thisElement.each(function(count){
				//set the 'on' trigger
				var $hrefElement = $(this);
				
				$(this).attr('data-ppid', count + 1); //set unique id for the popstate
				
				$(this).on(settings.trigger, function(e){
					loadPage($hrefElement); //do the magic
					
					e.preventDefault(); //prevent default  behaviour
					
					return false; //also return false
				});
			});
			
			//check for initial element, to fix the popstate
			if(settings.initialElement != null){
				if(settings.dynamicUrl){
					var originalUrl = $(settings.initialElement).attr(settings.urlAttribute);
					var state = {name: originalUrl, page: document.title, id: $(settings.initialElement).attr('data-ppid')};
					
					history.pushState(state, document.title, originalUrl); //push the state so we can get back to this state
				}
			}
			
			$(window).on("popstate", function(){
				//if its a pushed state we dynamicly load the previous page
				if(history.state){
					if($("*[data-ppid="+history.state.id+"]").length > 0){ //if exists then load
						loadPage($("*[data-ppid="+history.state.id+"]"), true);
					}
				}
			});
			
			return $thisElement; //return self for chaining
		}
		
		function loadPage($hrefElement, popped)
		{
			settings.before.call($hrefElement); //call the 'before' callback
			
			var originalUrl = $hrefElement.attr(settings.urlAttribute);
			var urlToLoad = originalUrl;
			var elementId = $hrefElement.attr('data-ppid');
			
			if(settings.parseElement != null){
				urlToLoad += " "+settings.parseElement; //append the 
			}
			
			$(settings.container).load(urlToLoad, function(response, status, xhr){
			  if(status == "success"){
			  	var titlePart = response.split("title>"); //dirty little trick to get an html element
			  	titlePart = titlePart[1].split("</"); //since the <title> element is always the same, this is possible
			  	var title = titlePart[0];
			  		
			  	if(settings.dynamicUrl && popped != true){
			  		var state = {name: urlToLoad, page: title, id:elementId};
			  		
			  		history.pushState(state, title, originalUrl); //change url to the one provided
			  	}
			  	
			  	if(settings.setTitle){
			  		document.title = title; //set the title
			  	}
			  	
			  	settings.finished.call($hrefElement); //call the 'finished' callback
			  } else if(status == "error"){
			    settings.error.call(xhr.status); //call the 'error' callback, 'this' = xhr.status
			  }
			});
		}
		
		return init(); //return init > this for chaining
	};
}(jQuery));
