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
var userId;
var password;
var isPasswordInput;
var bot = new builder.UniversalBot(connector, [
		
	function(session) {
			session.send("Hi " +messages.onloadMessage(session));
			session.beginDialog('userIdDialog');
		},
		function(session, results) {
				userId = results.response;
			console.log(userId);
			if(results.response == '0185920001'){
				session.beginDialog('welcomeMessage');
			}else{
			session.beginDialog('passwordDailog');

			}
			
		},function(session,results){
			password = results.response;
			if(isPasswordInput == 'true'){
				if(results.response == "12345"){
					session.beginDialog('welcomeMessage');	
				}else{
					session.endConversation("Password is incorrect, please input any value to relogin",
						results.response);
					session.endDialog();		
				}
			}else if (results.response == 'recharge') {
				session.beginDialog('rechargeDailog');
			} else if (results.response == 'usage') {
				session.beginDialog('usageDailog');
			}
		},function(session,results){
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
bot.dialog('userIdDialog', [
    function (session) {
    	//var msg = messages.welcomeMessage(session);
		//	var msg = new builder.Message(session).addAttachment(messages.createSigninCard(session));
		builder.Prompts.text(session, 'I need to autthenticae you. Please enter you YesMobile Number');
		
    },
    function (session, results) {
	
        session.endDialogWithResult(results);
    }
]);

bot.dialog('welcomeMessage', [
    function (session) {
    	var msg = messages.welcomeMessage(session);
    	builder.Prompts.text(session, msg);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('passwordDailog', [
    function (session) {
    	//var msg = messages.welcomeMessage(session);
		//	var msg = new builder.Message(session).addAttachment(messages.createSigninCard(session));
		builder.Prompts.text(session, 'Please enter OTP');
		isPasswordInput = 'true';
    },
    function (session, results) {
	
        session.endDialogWithResult(results);
    }
]);


//Dialog to rechargeDailog
bot.dialog('rechargeDailog', [
    function (session) {
		console.log("suerid---->"+userId);
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
    	
    	var adaptiveCardMessage = messages.usageCard(session, "Swap", "1GB" , "500MB");
		session.send(adaptiveCardMessage);
		var msg = messages.topUpOptionsMessage2(session);
    	builder.Prompts.text(session, msg);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);