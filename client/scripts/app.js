// YOUR CODE HERE:

var retrieveMessages = function(){
	$.ajax({
  	// This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'GET',
	  data: 'order=-createdAt',
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message retrieved');
	    console.log(data);

	    displayMessage(data);
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to retrieve messages');

	  }
	});
};

var addMessage = function(message) {};

var updateMessages = function() {}
var displayMessage = function(data) {

	for (var i=0; i<data.results.length; i++){
		var message = data.results[i];
		$('.content').append("<p>" + "<span class='username'>" + message.username + 
			"</span>: <span class='text'>" + message.text+ "</span> <span class='time'>" + message.createdAt+"</span></p>");
	}
}
setInterval(updateMessages, 2000);

retrieveMessages();