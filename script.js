
jQuery(function($){

	$(".jGithub").each(function(index, element) {

		var repo = $(this).data("repo");

		jGithub.loadRepo(repo, function(data) {
			console.log(data);
		});

	});

});

jGithub = {
	apiUrl:"https://api.github.com",
}

jGithub.loadRepo = function(repoName, callback) {
	var url = jGithub.apiUrl + "/repos/" + repoName;
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