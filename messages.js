var builder = require('botbuilder');
var moment = require('moment');

exports.onloadMessage = function(session){
console.log(moment().hour());
var hours = moment().hour();
if(hours >=0 && hours<12){
return "Good Morning ";
}else if(hours >=12 && hours < 17){
	return "Good Afternoon";
}else{
	return "Good Evening";
}

};
exports.welcomeMessage = function(session) {
	return new builder.Message(session).text(
			"I can provide below services to you ").suggestedActions(
			builder.SuggestedActions.create(session, [
					builder.CardAction.imBack(session, "recharge",
							"TopUp/Recharge"),
					builder.CardAction.imBack(session, "usage",
							"Show current usage") ]));
};

exports.payActionMessage = function(session) {
	return new builder.Message(session).text("Please select Top up amount")
			.suggestedActions(
					builder.SuggestedActions.create(session,
							[
									builder.CardAction.imBack(session, "pay",
											"PAY"),
									builder.CardAction.imBack(session, "cancel",
											"Cancel") ]));
};
exports.topUpOptionsMessage = function(session) {
	return new builder.Message(session).text("Please select Top up amount")
			.suggestedActions(
					builder.SuggestedActions.create(session,
							[
									builder.CardAction.imBack(session, "10",
											"10RM"),
									builder.CardAction.imBack(session, "20",
											"20RM"),
									builder.CardAction.imBack(session, "50",
											"50RM"),
									builder.CardAction.imBack(session, "100",
											"100RM") ]));
};

exports.dataOptionsMessage = function(session) {
	return new builder.Message(session).text("Do you wish to addon data ?")
			.suggestedActions(
					builder.SuggestedActions.create(session, [
							builder.CardAction
									.imBack(session, "500MB", "500MB"),
							builder.CardAction.imBack(session, "1GB", "1GB"),
							builder.CardAction.imBack(session, "NoThanks",
									"No Thanks") ]));
};

exports.usageCard = function(session, data, credit) {
	return new builder.Message(session)
			.addAttachment({
				contentType : "application/vnd.microsoft.card.adaptive",
				content : {
					"$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
					"type": "AdaptiveCard",
					"speak": "<s>Your Plan Usage Details.</s><s>It will not leave until 10:10 AM.</s>",
					"body": [
						{
							"type": "ColumnSet",
							"columns": [
								{
									"type": "Column",
									"size": "auto",
									"items": [
										{
									"type": "TextBlock",
									"text": "Usage Details",
									"weight": "bolder",
									"size": "medium"
										}
									]
								}
							]
						},
						{
							"type": "ColumnSet",
							"separation": "strong",
							"columns": [
								{
									"type": "Column",
									"size": "stretch",
									"items": [
										{
											"type": "TextBlock",
											"text": "Unused Data",
											"isSubtle": true
										},
										{
											"type": "TextBlock",
											"text": "Credit Balance"
										},
										{
											"type": "TextBlock",
											"text": "SMS"
										},
										{
											"type": "TextBlock",
											"text": "Contract Period"
										}
									]
								},
								{
									"type": "Column",
									"size": "auto",
									"items": [
										{
											"type": "TextBlock",
											"text": data,
											"horizontalAlignment": "right",
											"isSubtle": true
										},
										{
											"type": "TextBlock",
											"text": credit,
											"horizontalAlignment": "right"
										},
										{
											"type": "TextBlock",
											"text": "200 SMS",
											"horizontalAlignment": "right"
										},
										{
											"type": "TextBlock",
											"text": "1 Year",
											"horizontalAlignment": "right"
										}
									]
								}
							]
						}
					]
				}
			});
};


exports.paycard = function(session, userName, limit, usage) {
	return new builder.Message(session)
			.addAttachment({
				contentType : "application/vnd.microsoft.card.adaptive",
				content : {
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "type": "AdaptiveCard",
  "version": "0.5",
  "body": [
    {
      "type": "ColumnSet",
      "columns": [
        {
          "type": "Column",
          "size": 2,
          "items": [
            {
              "type": "TextBlock",
              "text": "Please enter card details",
              "weight": "bolder",
              "size": "large"
            },
            {
              "type": "TextBlock",
              "text": "i am robot, i don't remember user details until told!",
              "isSubtle": true,
              "wrap": true
            },
            {
              "type": "TextBlock",
              "text": "Don't worry, we'll never share or store your information.",
              "isSubtle": true,
              "wrap": true,
              "size": "small"
            },
            {
              "type": "TextBlock",
              "text": "Card Number",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "cardNumber",
              "placeholder": "411 XXX"
            },
            {
              "type": "TextBlock",
              "text": "Card Type",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "cardType",
              "placeholder": "visa/master",
              "style": "email"
            },
            {
              "type": "TextBlock",
              "text": "CVV"
            },
            {
              "type": "Input.Text",
              "id": "cvv",
              "placeholder": "xxx.xxx.xxxx"
            },
            {
              "type": "TextBlock",
              "text": "Valid Until",
              "wrap": true
            },
            {
              "type": "Input.Text",
              "id": "cardType",
              "placeholder": "01-01-2001"
            }
          ]
        },
        {
          "type": "Column",
          "size": 1,
          "items": [
            {
              "type": "Image",
              "url": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Diver_Silhouette%2C_Great_Barrier_Reef.jpg",
              "size": "auto"
            }
          ]
        }
      ]
    }
  ]
}
			});
};


exports.topUpOptionsMessage2 = function(session) {
	return new builder.Message(session).text("Would You like to ?")
			.suggestedActions(
					builder.SuggestedActions.create(session,
							[
									builder.CardAction.imBack(session, "10",
											"10RM"),
									builder.CardAction.imBack(session, "20",
											"20RM"),
									builder.CardAction.imBack(session, "50",
											"50RM"),
									builder.CardAction.imBack(session, "100",
											"100RM") ]));
};