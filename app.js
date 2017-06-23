var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond

var bot = new builder.UniversalBot(connector, [
    function(session) {
        var msg = new builder.Message(session)
            .text("I can provide below services to you ")
            .suggestedActions(
                builder.SuggestedActions.create(
                    session, [
                        builder.CardAction.imBack(session, "recharge", "TopUp/Recharge"),
                        builder.CardAction.imBack(session, "usage", "Show current usage")
                    ]
                ));
        session.send("Welcome to Yes bot !");
        builder.Prompts.text(session, msg);
    },
    function(session, results) {

        if (results.response == 'recharge') {
            msg = new builder.Message(session)
                .text("Please select Top up amount")
                .suggestedActions(
                    builder.SuggestedActions.create(
                        session, [
                            builder.CardAction.imBack(session, "10", "10RM"),
                            builder.CardAction.imBack(session, "20", "20RM"),
                            builder.CardAction.imBack(session, "50", "50RM"),
                            builder.CardAction.imBack(session, "100", "100RM")
                        ]
                    ));
        } else if (results.response == 'usage') {
            msg = new builder.Message(session)
                .text("Please select any option ")
                .suggestedActions(
                    builder.SuggestedActions.create(
                        session, [
                            builder.CardAction.imBack(session, "voice", "Show balance"),
                            builder.CardAction.imBack(session, "data", "Show data balance")
                        ]
                    ));
        }

        // Process request and display reservation details
        //session.send("selected Service: %s", session.dialogData.serviceType);
        builder.Prompts.text(session, msg);

    },
    function(session, results) {

        session.endConversation("Thank you for using our services %s!", results.response)
        session.endDialog();

    }
]);