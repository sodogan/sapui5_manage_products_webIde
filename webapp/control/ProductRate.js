sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/RatingIndicator",
	"sap/m/Button"
], function (Control, RatingIndicator, Button) {

	"use strict";

	return Control.extend("com.sodogan.manage_products.control.ProductRate", {

		metadata: {
			properties: {
				rating: {
					type: "float",
					defaultValue: 0
				}
			},
			aggregations: {
				_button: {
					type: "sap.m.Button",
					multiple: false,
					visibility: "hidden"
				},
				_ratingIndicator: {
					type: "sap.m.RatingIndicator",
					multiple: false,
					visibility: "hidden"
				}
			},
			events: {
				valueSubmit: {
					parameters: {
						rating: {
							type: "float"
						}
					}
				}

			}

		},

		init: function () {
			
			var _ratingIndicator = new RatingIndicator({
				value: this.getRating(),
				maxValue: 5,
				//liveChange event is fired when user presses the RatingIndicator
				liveChange: this._onRate.bind(this)
			});
			_ratingIndicator.addStyleClass("sapUiTinyMarginEnd");
			this.setAggregation("_ratingIndicator", _ratingIndicator);
             
           /*
			this.setAggregation("_ratingIndicator", new RatingIndicator({
				value: this.getRating(),
				maxValue: 5,
				liveChange: this._onRate.bind(this)
			}).addStyleClass("sapUiTinyMarginEnd"));
            */
			//The press event of the Button is bound to the new event in this object!
			this.setAggregation("_button", new Button({
				text: "{i18n>productRatingButtonText}",
				press: this._onSubmit.bind(this),
				enabled:false
			}));

		},
		_onRate: function (oEvent) {
			debugger;
			//if (oEvent && oEvent.hasOwnProperty('getParameter')) {
			var _rating = oEvent.getParameter("value");
			//set the rating here
			this.setRating(_rating);
			//Now enable the button 
			this.getAggregation("_button").setEnabled(true);

		},
		_onSubmit: function (oEvent) {
			debugger;
			var _currentRating = this.getRating();
			this.fireEvent("valueSubmit", {
				rating: _currentRating
			});
			this.getAggregation("_button").setEnabled(false);
		},

		renderer: function (oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("sapUiSmallMarginBeginEnd");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.getAggregation("_ratingIndicator"));
			oRm.renderControl(oControl.getAggregation("_button"));

			oRm.write("</div>");

		}

	});
});