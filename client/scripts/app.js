// YOUR CODE HERE:

var app = {};
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.roomnames = {};



app.fetch = function(roomname){


	$.ajax({
  	// This is the url you should use to communicate with the parse API server.
	  url: app.server,
	  type: 'GET',
	  data: 'order=-createdAt',//&where={"roomname":{"$in":["'+roomname+'"]}}',
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
$("#submit").click (function(){
	var get = function (name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
	}
	var text = $("#textField").val();
	var message = {
		username: get("username"),
		text: text,
		roomname: '4chan'
	}

	app.send(message);
	$('#textField').val(''); //empty textfield
});



//adding message by current user
app.send = function(text) {

	$.ajax({
	  // This is the url you should use to communicate with the parse API server.
	  url: app.server,
	  type: 'POST',
	  data: JSON.stringify(text),
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
	app.clearMessages();
	app.clearRooms();

	for (var i=0; i<data.results.length; i++){
		app.addMessage(data.results[i]);

	}
}

app.clearMessages = function(){
	$('#chats').empty();
}

app.clearRooms = function(){
	$('#roomSelect').empty();
	app.roomnames = {};
}

app.addMessage = function(message) {

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



		if (! (message.roomname in app.roomnames) ){
			app.addRoom(escapeHtml(message.roomname));
			app.roomnames[message.roomname] = true;
		}

		$('#chats').append("<p>" + "<span class='username'>" + escapeHtml(message.username) + 
			"</span>: <span class='text'>" + escapeHtml(message.text) + "</span> <span class='time'>" + 
			escapeHtml(message.createdAt)+"</span></p>");
}

//Adding Room
$("#addRoom").click(function(){
	var room = prompt("Enter name of room to add: ");
	app.addRoom(room);
});

app.addRoom = function(room){
	$('#roomSelect').append("<p>"+room+"</p>");
}
app.init = function(){
	setInterval(app.fetch, 1000);
	app.fetch();
}

app.init();




