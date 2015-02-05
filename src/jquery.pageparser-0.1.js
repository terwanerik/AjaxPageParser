/* 
 * AjaxPageParser jQuery Plugin
 * Made by Erik Terwan
 * 5 February 2015
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
			$thisElement.each(function(){
				//set the 'on' trigger
				var $hrefElement = $(this);
				
				$(this).on(settings.trigger, function(e){
					loadPage($hrefElement); //do the magic
					
					e.preventDefault(); //prevent default  behaviour
					
					return false; //also return false
				});
			});
			
			return $thisElement; //return self for chaining
		}
		
		function loadPage($hrefElement)
		{
			settings.before.call($hrefElement); //call the 'before' callback
			
			var originalUrl = $hrefElement.attr(settings.urlAttribute);
			var urlToLoad = originalUrl;
			
			if(settings.parseElement != null){
				urlToLoad += " "+settings.parseElement; //append the 
			}
			
			$(settings.container).load(urlToLoad, function(response, status, xhr){
			  if(status == "success"){
			  	if(settings.dynamicUrl){
			  		history.pushState(null, null, originalUrl); //change url to the one provided
			  	}
			  	
			  	if(settings.setTitle){
			  		var titlePart = response.split("title>"); //dirty little trick to get an html element
			  		titlePart = titlePart[1].split("</"); //since the <title> element is always the same, this is possible
			  		
			  		document.title = titlePart[0]; //set the title
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
