var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

jQuery(function($){

	/*$(window).resize(function() {
		jGithub.resizeTextareas();
	});*/

	Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
	    if (arguments.length < 3)
	        throw new Error("Handlebars Helper equal needs 2 parameters");
	    if( lvalue!=rvalue ) {
	        return options.inverse(this);
	    } else {
	        return options.fn(this);
	    }
	});

	$('head').append(
		'<style type="text/css">'
		+'.repo-header h3{margin:0;padding:10px 10px 10px 30px;background:url('+jGithub.box_title_png+') 7px center no-repeat;}'
		+'</style>'
	);

	var templateSource = $("#jGithub-template").html();
	var template = Handlebars.compile(templateSource);

	$(".jGithub").each(function(index, element) {

		var $self = $(this);

		var repo = $(this).data("repo");

		$self.on("click", ".js-file", function() {
			var fileUrl = $(this).data("url");
			jGithub.loadFile(fileUrl, function(data) {
				console.log(data);
				var content = Base64.decode(data.content);
				content = jGithub.htmlEncode(content);
				$self.find(".file-viewer .codes").html(content);
				jGithub.generateLineNumbers($self.find(".file-viewer"));
			});
		});

		jGithub.loadRepo(repo, function(repoData) {

			jGithub.loadBranches(repo, function(branchesData) {

				jGithub.loadContents(repo, function(contentsData) {
					var context = {
						repo:repoData,
						branches:branchesData,
						contents:contentsData
					};
					console.log(context);
					var html = template(context);

					$self.append(html);
				});
				
			});
			
		});

	});

});

jGithub = {
	apiUrl:"https://api.github.com",
	box_title_png: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAXCAMAAAAx3e/WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEQjIyNkJERkM0NjYxMUUxOEFDQzk3ODcxRDkzRjhCRSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEQjIyNkJFMEM0NjYxMUUxOEFDQzk3ODcxRDkzRjhCRSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkRCMjI2QkREQzQ2NjExRTE4QUNDOTc4NzFEOTNGOEJFIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkRCMjI2QkRFQzQ2NjExRTE4QUNDOTc4NzFEOTNGOEJFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dka2KgAAAEVQTFRFxMTEyMjI0tLSvb29vr6+zc3Ny8vLxcXFz8/P6enp3t7ex8fH0dHR1NTUw8PDwMDAzs7OvLy8wcHBu7u7v7+/zMzM////budQFwAAABd0Uk5T/////////////////////////////wDmQOZeAAAAcklEQVR42tSQSQ7DMAwD6chOukWs5eX/Ty2coo0T9wOdEzEgdRBuzNmnDofgja52JDyz5TCqUp0O6kfrb4bzSXkRiTviEZZ6JKLMJ5VQ2v8iGbtbfEwXmjFMG0VwdQo10hQNxYqtLMv9O6xvpZ/QeAkwAKjwHiJLaJc3AAAAAElFTkSuQmCC',
}

jGithub.loadRepo = function(repoName, callback) {
	var url = jGithub.apiUrl + "/repos/" + repoName;
	jGithub.requestData(url, function(data) {
		callback(data);
	});
}

jGithub.loadBranches = function(repoName, callback) {
	var url = jGithub.apiUrl + "/repos/" + repoName + "/branches";
	jGithub.requestData(url, function(data) {
		callback(data);
	});
}

jGithub.loadContents = function(repoName, callback) {
	var url = jGithub.apiUrl + "/repos/" + repoName + "/contents";
	jGithub.requestData(url, function(data) {
		callback(data);
	});
}

jGithub.loadFile = function(url, callback) {
	jGithub.requestData(url, function(data) {
		callback(data);
	});
}

jGithub.requestData = function(url, callback) {
	$.getJSON(url)
	.done(function(data) {
		callback(data);
	})
	.fail(function(data) {
		// if error, check response
		if(data.responseText) {
			jGithub.error(data.responseText);
		}
	});
}

jGithub.error = function(errorMessage) {
	console.log("ERROR: " + errorMessage);
}

jGithub.generateLineNumbers = function(fileViewer) {
	var $codelines = fileViewer.find(".code-lines");
	var $codes = fileViewer.find(".codes");

	var numOfLines = $codes.height() / parseInt($codes.css("line-height"));

	console.log(numOfLines);

	$codelines.html("");

	for(var i = 0; i < numOfLines; i++) {
		$codelines.append("<div class='text-muted'>" + (i+1) + "</div>");
	}
}

jGithub.htmlEncode = function(value){
  return $('<div/>').text(value).html();
}