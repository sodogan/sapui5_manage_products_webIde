sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History"
], function (BaseController, History) {
	"use strict";
	return BaseController.extend("com.sodogan.manage_products.controller.Supplier", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sodogan.manage_products.view.Supplier
		 */
		onInit: function () {
			debugger;
			this.getRouter().getRoute("supplier").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			debugger;
			let sSupplierId = oEvent.getParameters().arguments.supplierId;
			let handler = function (oParam) {
					debugger;
					/*
					var sObjectPath = this.getModel().createKey("ProductSet", {
						ProductID: sProductId
					});
					*/
					var sObjectPath = this.getModel().createKey("BusinessPartnerSet", {
						BusinessPartnerID: sSupplierId
					});
					
					this._bindView("/" + sObjectPath);
				}.bind(this);
			
			//Now we need to bind the data!
			this.getModel()
				.metadataLoaded()
				.then(handler);

		},
		_bindView: function (sObjectPath) {
			debugger;
			this.getView().bindElement({
				path: sObjectPath,
				/*
				parameters: {
					expand: "ToSupplier"
				}
				*/
			});

		},

		/**
		 * Event handler for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function () {

			var oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("worklist", {}, bReplace);
			}
		}

	});
});