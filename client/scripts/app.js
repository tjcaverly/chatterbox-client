// YOUR CODE HERE:
var app;
$(function() {
	app = {};
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
		    displayMessage(data);
		  },
		  error: function (data) {
		    console.error('chatterbox: Failed to retrieve messages');
		  }
		});
	};

	app.handleSubmit = function(){


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
			app.addRoom(i);
		}
	}

	app.addFriend = function(username) {
		console.log(username);
		app.friends[_.escape(username)] = true;
	}

	app.clearMessages = function(){
		$('#chats').empty();
	}

	app.clearRooms = function(){
		$('#roomSelect').empty();

	}

	app.addMessage = function(message) {
		app.roomnames[message.roomname] = true;
		if (message.roomname === app.currentRoomName) {


			if (_.escape(message.username) in app.friends) {
				var textNode = "<span class='text friend'>" + _.escape(message.text) + "</span>";
		  } else {
		  	var textNode = "<span class='text'>" + _.escape(message.text) + "</span>";
		  }
		  var userNameNode = "<span class='username'>" + _.escape(message.username) + "</span>";


		  var node = "<p>" + userNameNode + ": " + textNode +  " <span class='time'>" + 
				  _.escape(message.createdAt)+"</span></p>";

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

	//select rooms
	$('#roomSelect').click(function(e){
		app.currentRoomName = _.unescape(e.target.innerHTML);
	});

	//adding Room
	app.addRoom = function(room){
		$('#roomSelect').append("<p>"+_.escape(room)+"</p>");
	}
	app.init = function(){
		//submit button for message
		debugger;
		$("#send .submit").on('click', function(e){
			app.handleSubmit();

			e.preventDefault();
		});
		setInterval(app.fetch, 1000);
		app.fetch();
	}

	app.init();
});




