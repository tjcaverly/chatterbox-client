// YOUR CODE HERE:

var app = {};
// This is the url you should use to communicate with the parse API server.
app.server = 'https://api.parse.com/1/classes/chatterbox';
app.roomnames = {};
app.friends = {};
//Setting current room
app.currentRoomName = "lobby";

app.fetch = function(roomname){
	$.ajax({
	  url: app.server,
	  type: 'GET',
	  data: 'order=-createdAt',
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message retrieved');
	    displayMessage(data);
	    console.log(data);
	  },
	  error: function (data) {
	    console.error('chatterbox: Failed to retrieve messages');
	  }
	});
};

app.handleSubmit = function(evt){
	console.log('handleSubmit');
	evt.preventDefault();

	var get = function (name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
	}

	var text = $("#message").val();
	var message = {
		username: get("username"),
		text: text,
		roomname: app.currentRoomName
	}
	app.send(message);
	$('#message').val(''); //empty textfield


}




//adding message by current user
app.send = function(text) {

	$.ajax({
	  url: app.server,
	  type: 'POST',
	  data: JSON.stringify(text),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    console.error('chatterbox: Failed to send message');
	  }
	});
};



var displayMessage = function(data) {
	app.clearMessages();

	for (var i=0; i<data.results.length; i++){
		app.addMessage(data.results[i]);
	}



	app.clearRooms();
	for (var i in app.roomnames) {
		app.addRoom(escapeHtml(i));
	}
}

app.addFriend = function(username) {
	console.log(username);
	app.friends[escapeHtml(username)] = true;
}

app.clearMessages = function(){
	$('#chats').empty();
}

app.clearRooms = function(){
	$('#roomSelect').empty();

}

//escaping 
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



app.addMessage = function(message) {
	app.roomnames[message.roomname] = true;

	if (message.roomname === app.currentRoomName) {


		if (escapeHtml(message.username) in app.friends) {
			var textNode = "<span class='text friend'>" + escapeHtml(message.text) + "</span>";
	  } else {
	  	var textNode = "<span class='text'>" + escapeHtml(message.text) + "</span>";
	  }
	  var userNameNode = "<span class='username'>" + escapeHtml(message.username) + "</span>";


	  var node = "<p>" + userNameNode + ": " + textNode +  " <span class='time'>" + 
			  escapeHtml(message.createdAt)+"</span></p>";

	  $('#chats').append(node).find('.username').on('click', function(){ 
	  	app.addFriend($(this).text());
	  });

	}
}

//Adding Room
$("#addRoom").click(function(){
  var room = prompt("Enter name of room to add: ");
  app.roomnames[room] = true;
});
/*
$(".clickable").click(function(){
	alert("hi");
	$(this).toggleClass('clickable');
    e.preventDefault();
});
*/


//select rooms
$('#roomSelect').click(function(e){
	app.currentRoomName = e.target.innerHTML;
});

//adding Room
app.addRoom = function(room){
	$('#roomSelect').append("<p>"+room+"</p>");
}
app.init = function(){
//submit button for message
$("#send").on('submit', app.handleSubmit);
	setInterval(app.fetch, 1000);
	app.fetch();
}

app.init();




