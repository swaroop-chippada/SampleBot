var restify = require('restify');
var builder = require('botbuilder');
var messages = require('./messages');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
	appId : process.env.MICROSOFT_APP_ID,
	appPassword : process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond

var bot = new builder.UniversalBot(connector, [
		function(session) {
			var msg = messages.welcomeMessage(session);
			session.send("Welcome to Yes bot !");
			builder.Prompts.text(session, msg);
		},
		function(session, results) {
			if (results.response == 'recharge') {
				msg = messages.topUpOptionsMessage(session);
			} else if (results.response == 'usage') {
				var adaptiveCardMessage = messages.usageCard(session, "Swap", "1GB" , "500MB");
				session.send(adaptiveCardMessage);
			}
			// Process request and display reservation details
			// session.send("selected Service: %s",
			// session.dialogData.serviceType);
			// builder.Prompts.text(session, msg);
		},
		function(session, results) {
			session.endConversation("Thank you for using our services %s!",
					results.response)
			session.endDialog();

		} ]);