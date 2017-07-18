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
			session.send("Welcome to Yes bot !");
			session.beginDialog('welcomeMessage');
		},
		function(session, results) {
			if (results.response == 'recharge') {
				session.beginDialog('rechargeDailog');
			} else if (results.response == 'usage') {
				session.beginDialog('usageDailog');
			}
		},
		function(session, results) {
			session.endConversation("Thank you for using our services %s!",
					results.response)
			session.endDialog();

		} ]);


//Dialog to welcome
bot.dialog('welcomeMessage', [
    function (session) {
    	var msg = messages.welcomeMessage(session);
    	builder.Prompts.text(session, msg);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);


//Dialog to rechargeDailog
bot.dialog('rechargeDailog', [
    function (session) {
    	var msg = messages.topUpOptionsMessage(session);
    	builder.Prompts.text(session, msg);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);


//Dialog to usageDailog
bot.dialog('usageDailog', [
    function (session) {
    	console.log('id : %s', messages.from.id);
    	var adaptiveCardMessage = messages.usageCard(session, "Swap", "1GB" , "500MB");
		session.send(adaptiveCardMessage);
		var msg = messages.topUpOptionsMessage2(session);
    	builder.Prompts.text(session, msg);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);