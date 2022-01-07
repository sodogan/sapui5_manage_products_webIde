sap.ui.define([
	"./BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel"
], function (BaseController, History, JSONModel) {
	"use strict";
	return BaseController.extend("com.sodogan.manage_products.controller.Add", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.sodogan.manage_products.view.Supplier
		 */
		onInit: function () {
			debugger;

			var oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});
            let iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.getRouter().getRoute("add").attachPatternMatched(this._onRouteMatched, this);

			//set the Model
			this.setModel(oViewModel, "addView");

            var fnSetAppNotBusy = function() {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};
			
			//make sure that the metadata iş loaded
			this.getOwnerComponent().getModel().metadataLoaded()
				.then(fnSetAppNotBusy);

		},
		_onRouteMatched: function (oEvent) {
			debugger;
			// register for metadata loaded events
			/*
			var oModel = this.getModel();
			oModel.metadataLoaded()
			       .then(this._onMetadataLoaded.bind(this)
			            );
               */

			let oModel = this.getModel();
			//read the arguments
			oModel.metadataLoaded()
				.then(function () {
					//	this.getModel("addView").setProperty("/busy",false);
					debugger;

					// create default properties
					var oNewProduct = {
						ProductID: "" + parseInt(Math.random() * 1000000000, 10),
						TypeCode: "PR",
						TaxTarifCode: 1,
						CurrencyCode: "EUR",
						MeasureUnit: "EA",
						NameLanguage: "EN"
					};

					this._oContext = this.getModel().createEntry("/ProductSet", {
						properties: oNewProduct,
						success: this._onCreateSuccess.bind(this),
						error: this._onCreateFailed.bind(this)
					});

					this._bindView(this._oContext);
					this.getModel("addView").setProperty("/busy", false);
				}.bind(this));

		},
		_bindView: function (sContext) {
			debugger;
			//bind the view
			this.getView().setBindingContext(sContext);
		},
		_onMetadataLoaded: function () {
			debugger;

			// create default properties
			var oProperties = {
				ProductID: "" + parseInt(Math.random() * 1000000000, 10),
				TypeCode: "PR",
				TaxTarifCode: 1,
				CurrencyCode: "EUR",
				MeasureUnit: "EA"
			};

			// create new entry in the model
			this._oContext = this.getModel().createEntry("/ProductSet", {
				properties: oProperties,
				success: this._onCreateSuccess.bind(this),
				error: this._onCreateFailed.bind(this)
			});

			// bind the view to the new entry
			this.getView().setBindingContext(this._oContext);
		},

		_onCreateSuccess: function (oProduct) {
			debugger;
			let productId = oProduct.productID;
			//Need to call the object route from here!
			this.getRouter().navTo('object', {
				productId: productId
			});
		},
		_onCreateFailed: function (oProduct) {
			debugger;

		},
		/**
		 * Event handler for the save action
		 * @public
		 */
		onSave: function () {
			debugger;
			this.getModel().submitChanges();
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