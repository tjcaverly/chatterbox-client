// YOUR CODE HERE:

var retrieveMessages = function(){
	$.ajax({
  	// This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'GET',
	  data: 'order=-createdAt',
	  contentType: 'application/json',
	  success: function (data) {
	  	//debugger;
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

//submit button for message
$("button").click (function(){
	var text = $("#textField").val();
	addMessage(text);
	$('#textField').val(''); //empty textfield
});



//adding message by current user
var addMessage = function(text) {
	//get username
	var get = function (name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
	}

	var message = {
	  username: get("username"),
	  text: text,
	  roomname: '4chan'
	};


	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: 'https://api.parse.com/1/classes/chatterbox',
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
	    console.error('chatterbox: Failed to send message');
	  }
	});
};



var displayMessage = function(data) {
	var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

	var escapeHtml = function(string) {
	  return String(string).replace(/[&<>"'\/]/g, function (s) {
	    return entityMap[s];
	  });
	}
	$('.content').empty();

	for (var i=0; i<data.results.length; i++){
		var message = data.results[i];
		$('.content').append("<p>" + "<span class='username'>" + escapeHtml(message.username) + 
			"</span>: <span class='text'>" + escapeHtml(message.text) + "</span> <span class='time'>" + escapeHtml(message.createdAt)+"</span></p>");
	}
}


setInterval(retrieveMessages, 1000);

retrieveMessages();




