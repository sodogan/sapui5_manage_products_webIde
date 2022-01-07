sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/core/Fragment'
], function (BaseController, JSONModel, Filter, FilterOperator, Fragment) {
	"use strict";

	return BaseController.extend("com.sodogan.manage_products.controller.Worklist", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0,
				//add the counters for the filters-cheap-medium and expensive!
				cheapCount: 0,
				mediumCount: 0,
				expensiveCount: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		/**
		 * Event handler when the add button gets pressed
		 * @public
		 */
		onAdd: function () {
			debugger;
			this.getRouter().navTo("add");
		},

		onLinkPressedToSupplierInfo: function (oEvent) {
			debugger;
			let context = oEvent.getSource().getBindingContext();
			let sSupplierIdPath = context.getProperty("SupplierID");
			this.getRouter().navTo("supplier", {
			supplierId: sSupplierIdPath
			});
		},
		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPressTable: function (oEvent) {
			// The source is the list item that got pressed
			let oListItem = oEvent.getSource();
			this._showObject(oListItem);
		},

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function (oItem) {
			debugger;
			let sProductIdPath = oItem.getBindingContext().getProperty("ProductID");

			this.getRouter().navTo("object", {
				productId: sProductIdPath
			});
		},
		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser history
		 * @public
		 */
		onNavBack: function () {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},

		onSearch: function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("ProductID", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function (aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		},
		_mFilters: {
			cheap: new Filter({
				path: "Price",
				operator: FilterOperator.LT,
				value1: 500
			}),
			medium: new Filter({
				path: "Price",
				operator: FilterOperator.BT,
				value1: 500,
				value2: 1500
			}),
			expensive: new Filter({
				path: "Price",
				operator: FilterOperator.GT,
				value1: 1500
			})
		},
		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			//debugger;
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total"),
				oModel = this.getModel(),
				oViewModel = this.getModel("worklistView");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);

				jQuery.each(this._mFilters, function (sFilterKey, oFilter) {
					console.log(sFilterKey, oFilter);

					oModel.read("/ProductSet/$count", {
						filters: [oFilter],
						success: function (oData) {
							//debugger;
							var sPath = "/" + sFilterKey + "Count";
							oViewModel.setProperty(sPath, oData);
						},
						error: function (err) {
							console.log(err);
						}
					});
				});

			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			oViewModel.setProperty("/worklistTableTitle", sTitle);

			// iterate the filters and request the count from the server

			/*
			let selectedKey = oEvent.getSource().getParent().getSelectedKey();
			if (selectedKey === 'cheap') {
				this.getModel("worklistView").setProperty("/numberOfCheap", iTotalItems);
			} else if (selectedKey === 'medium') {
				this.getModel("worklistView").setProperty("/numberOfMedium", iTotalItems);
			} else if (selectedKey === 'expensive') {
				this.getModel("worklistView").setProperty("/numberOfExpensive", iTotalItems);
			} else {

			}
			*/
		},

		onFilterSelect: function (oEvent) {
			debugger;
			let filters = [];

			let _list = this.byId('table');
			//get the binding
			let _binding = _list.getBinding('items');

			let filterTypes = this._mFilters;
			//create the Filter

			//the key is cheap,medium or expensive
			let selection = oEvent.getParameters().selectedKey;
			//dynamic selection of the  object filterTypes["cheap"] or filterTypes.cheap
			filters.push(filterTypes[selection]);
			/*No need to use if else as use an object called _mFilters
			switch (selection) {
			case 'cheap':
				// code block
				filters.push(filterTypes.cheap);
				break;
			case 'medium':
				// code block
				filters.push(filterTypes.medium);
				break;
			case 'expensive':
				// code block
				filters.push(filterTypes.expensive);
				break;

			default:
				// clear all the filters
			} //end switch
            */
			//			_binding.filter(filters);
			_binding.filter(filterTypes[selection]);
		},
		onShowMessagePopOver: function (oEvent) {
			debugger;
			var oOpener = oEvent.getSource(),
				oView = this.getView(),
				sPath = oEvent.getSource().getBindingContext().getPath();
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "com.sodogan.manage_products.view.fragments.ProductPopOver",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			//binding should be at the last as the pop over can be called from diffrent places!
			this._pPopover.then(function (oPopover) {
				oPopover.bindElement(sPath);
				oPopover.openBy(oOpener);
			});
		}

	});
});