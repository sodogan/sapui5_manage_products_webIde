sap.ui.define([
	"sap/ui/core/Control",
	"sap/m/InputBase",
	"sap/m/Button",
	"sap/ui/core/IconPool",
	"sap/m/ButtonRenderer"
], function (Control, InputBase, Button,IconPool) {

	"use strict";

	return Button.extend("com.sodogan.manage_products.control.CustomButton", {

		metadata: {
			events: {
				valueSubmit: {
					parameters: {
						value: {
							type: "string"
						}
					}
				}
			}
		},

		init: function () {
			//This is necessary for the standard controls 
			Button.prototype.init.apply(this, arguments);
			var _icon = IconPool.getIconURI("sys-help");
			this.setIcon(_icon);
			
			this.setText();
			//Attach out handler to the firepress event!
			this.firePress = this._onValueSubmit.bind(this);
		},
		_onValueSubmit: function (oEvent) {
			debugger;
			var _text = this.getText();
			this.fireEvent("valueSubmit", {
				value: _text
			});
		},
		renderer: "sap.m.ButtonRenderer"

	});
});