sap.ui.define([
"sap/ui/model/Model"
], function (Model) {
"use strict";

return Model.extend("com.sodogan.manage_products.test.unit.helper.BasicModel", {

	constructor: function (mTexts) {
		Model.call(this);
		this.mTexts = mTexts || {};
	},
	test: function(sName){
		var result;
		debugger;
		if(sName){
			result = this.mTexts[sName];
		}
		return result;
	},
	


});

});