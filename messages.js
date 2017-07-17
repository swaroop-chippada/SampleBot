var builder = require('botbuilder');

exports.welcomeMessage = function(session) {
	return new builder.Message(session).text(
			"I can provide below services to you ").suggestedActions(
			builder.SuggestedActions.create(session, [
					builder.CardAction.imBack(session, "recharge",
							"TopUp/Recharge"),
					builder.CardAction.imBack(session, "usage",
							"Show current usage") ]));
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

exports.usageCard = function(session, userName, limit, usage) {
	return new builder.Message(session)
			.addAttachment({
				contentType : "application/vnd.microsoft.card.adaptive",
				content : {
					"$schema" : "http://adaptivecards.io/schemas/adaptive-card.json",
					"type" : "AdaptiveCard",
					"version" : "0.5",
					"speak" : "<s>Your usage balance is" + usage + "</s>",
					"body" : [
							{
								"type" : "Container",
								"items" : [ {
									"type" : "TextBlock",
									"text" : "Hi " + userName
											+ ", your available Data limit",
									"isSubtle" : true
								} ]
							},
							{
								"type" : "Container",
								"items" : [ {
									"type" : "ColumnSet",
									"columns" : [
											{
												"type" : "Column",
												"size" : "auto",
												"items" : [ {
													"type" : "Image",
													"url" : "http://vik.kompas.com/merapah-trans-jawa-2/images/preload.gif",
													"size" : "medium",
													"horizontalAlignment" : "center"
												} ]
											},
											{
												"type" : "Column",
												"size" : "auto",
												"items" : [
														{
															"type" : "ColumnSet",
															"columns" : [ {
																"type" : "Column",
																"size" : "auto",
																"items" : [ {
																	"type" : "TextBlock",
																	"text" : usage
																			+ " left",
																	"size" : "extraLarge"
																} ]
															} ]
														},
														{
															"type" : "TextBlock",
															"text" : "Out of "
																	+ limit,
															"weight" : "bolder"
														} ]
											} ]
								} ]
							} ]
				}
			});
};