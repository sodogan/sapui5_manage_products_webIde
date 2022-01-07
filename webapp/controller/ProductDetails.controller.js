sap.ui.define([
	"com/sodogan/manage_products/controller/Worklist.controller"
], function (WorkList, Fragment) {
	"use strict";

	let _controller = WorkList.extend("com.sodogan.manage_products.controller.ProductDetails", {
		onInit: function () {
			console.log('Inside the prodcutDetails controller');
		}

	});

	return _controller;

});