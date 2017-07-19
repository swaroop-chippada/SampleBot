var restify = require('restify');
var builder = require('botbuilder');
var messages = require('./messages');
var request = require("request");




// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log('%s listening to %s', server.name, server.url);
});

var optionsget = {
    host : 'http://10.24.3.175:8881/', // here only the domain name
    // (no http/https !)
    port : 443,
    path : '/selfcare/isAuthenticate.do?loginId=1135646723@yes.my', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};


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
var isPasswordInput = 'false';
var bot = new builder.UniversalBot(connector, [
		
	function(session) {
			session.send("Hi " +messages.onloadMessage(session));
			session.beginDialog('userIdDialog');
		},
		function(session, results) {
				userId = results.response;
			console.log(userId);
			request("http://10.24.3.175:8881/selfcare/isAuthenticate.do?loginId="+results.response, function(error, response, body) {
			 //console.log(body);
			//console.log(error);
			//console.log(response);
			if(body == 'true'){
				isPasswordInput='false';
				session.beginDialog('welcomeMessage');
			}else{
					session.beginDialog('passwordDailog');		
				}
			});

			
			
		},function(session,results){
			password = results.response;
			console.log("topup--->"+results.response);
			console.log("passowrd--->"+isPasswordInput);
			if(isPasswordInput == 'true'){
				
			request("http://10.24.3.175:8881/selfcare/authenticate.do?loginId="+userId+"&pword="+results.response , function(error, response, body) {
			 console.log(body);
			//console.log(error);
			//console.log(response);
			if(body == 'true'){
				session.beginDialog('welcomeMessage');
			}else{
					session.endConversation("Password is incorrect, please input any value to relogin",
						results.response);
					session.endDialog();		
				}
			});
			}else if (results.response == 'recharge') {
				session.beginDialog('rechargeDailog');
			} else if (results.response == 'usage') {
				session.beginDialog('usageDailog');
			}
		},function(session,results){
			console.log("rc--->"+results.response);
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