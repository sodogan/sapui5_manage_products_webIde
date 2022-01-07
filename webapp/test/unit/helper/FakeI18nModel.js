sap.ui.define([
"sap/ui/model/Model"
], function (Model) {
"use strict";

return Model.extend("com.sodogan.manage_products.test.unit.helper.Fakei18nModel", {

	constructor: function (mTexts) {
		Model.call(this);
		this.mTexts = mTexts || {};
	},

	getResourceBundle: function () {
		debugger;
		var _handler = function (sTextName) {
			return this.mTexts[sTextName];
		}
		console.log(this);

		var _bundle = {
			getText: _handler.bind(this)
		};

		return _bundle;
	}

});

});