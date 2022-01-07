sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/ui/test/matchers/AggregationEmpty",
	"sap/ui/test/matchers/Ancestor",
	"./Common",
	"./shareOptions"
], function (Opa5, Press, EnterText, AggregationFilled, AggregationEmpty, Ancestor, Common, shareOptions) {
	"use strict";

	var sViewName = "Worklist",
		sTableId = "table",
		sSearchFieldId = "searchField",
		sAddButtonId = "addButton";

	Opa5.createPageObjects({

		onTheWorklistPage: {
			baseClass: Common,
			viewName: sViewName,

			actions: Object.assign({
				iSearchForValue: function (sSearchString) {
					return this.waitFor({
						id: sSearchFieldId,
						actions: [
							new EnterText({
								text: sSearchString
							}),
							new Press()
						],
						errorMessage: "Did not find the search field with ID " + sSearchFieldId
					});
				},
				iPressAdd: function () {
					return this.waitFor({
						id: sAddButtonId,
						viewName: sViewName,
						actions: new Press(),
						errorMessage: "Add button not found"
					});
				}

			}, shareOptions.createActions(sViewName)),

			assertions: Object.assign({

				iShouldSeeTheTable: function () {

					var _wait = this.waitFor({
						id: sTableId,
						success: function (oTable) {
							Opa5.assert.ok(oTable, "Found the object Table");
						},
						errorMessage: "Did not find table with ID " + sTableId
					});
					return _wait;
				},

				theTableShowsOnlyObjectsWithTheSearchStringInTheirTitle: function () {
					return this.waitFor({
						id: sSearchFieldId,
						success: function (oSearchField) {
							var sSearchFieldValue = oSearchField.getValue();
							return this.waitFor({
								id: sTableId,
								success: function (oTable) {
									return this.waitFor({
										controlType: "sap.m.ObjectIdentifier",
										matchers: new Ancestor(oTable),
										success: function (aIdentifiers) {
											Opa5.assert.ok(aIdentifiers.every(function (oIdentifier) {
												return oIdentifier.getTitle().indexOf(sSearchFieldValue) > -1;
											}), "All table entries match the search term");
										},
										errorMessage: "Did not find entries for table with ID " + sTableId
									});
								},
								errorMessage: "Did not find table with ID " + sTableId
							});
						},
						errorMessage: "Did not find search field with ID " + sSearchFieldId
					});
				},

				theTableHasEntries: function () {
					return this.waitFor({
						id: sTableId,
						matchers: new AggregationFilled({
							name: "items"
						}),
						success: function () {
							Opa5.assert.ok(true, "The table with ID " + sTableId + " has entries");
						},
						errorMessage: "The table with ID " + sTableId + " had no entries"
					});
				},

				theTableShouldHaveAllEntries: function () {
					return this.waitFor({
						id: sTableId,
						success: function (oTable) {
							return this.waitFor({
								controlType: "sap.m.ColumnListItem",
								matchers: new Ancestor(oTable),
								success: function (aItems) {
									var aAllEntities = this.getEntitySet("ProductSet");
									var iExpectedNumberOfItems = Math.min(oTable.getGrowingThreshold(), aAllEntities.length);
									Opa5.assert.strictEqual(aItems.length, iExpectedNumberOfItems, "The growing Table has " + iExpectedNumberOfItems +
										" items");
								}
							});
						},
						errorMessage: "Did not find table with ID " + sTableId
					});
				},

				theTitleShouldDisplayTheTotalAmountOfItems: function () {
					return this.waitFor({
						id: sTableId,
						success: function (oTable) {
							var iItems = oTable.getBinding("items").getLength(); // all items, incuding the growing list
							return this.waitFor({
								id: "tableHeader",
								matchers: new Ancestor(oTable),
								success: function (oHeader) {
									var sExpectedText = oTable.getModel("i18n").getResourceBundle().getText("worklistTableTitleCount", [iItems]);
									Opa5.assert.strictEqual(oHeader.getText(), sExpectedText, "The table has a title containing the number " + iItems);
								},
								errorMessage: "The table header does not container the number of items " + iItems
							});
						},
						errorMessage: "Did not find table with ID " + sTableId
					});
				},

				theTableShouldContainOnlyFormattedUnitNumbers: function () {
					return this.theUnitNumbersShouldHaveTwoDecimals("sap.m.ObjectNumber",
						sViewName,
						"Object numbers are properly formatted",
						"Table has no entries which can be checked for their formatting");
				},

				iShouldSeeTheNoDataTextForNoSearchResults: function () {
					return this.waitFor({
						id: sTableId,
						matchers: new AggregationEmpty({
							name: "items"
						}),
						success: function (oTable) {
							debugger;
							Opa5.assert.strictEqual(
								oTable.getNoDataText(),
								oTable.getModel("i18n").getProperty("worklistNoDataWithSearchText"),
								"The table with ID " + sTableId + " should show the no data text for search");
						},
						errorMessage: "Did not find table with ID " + sTableId
					});
				}
			}, shareOptions.createAssertions(sViewName))

		}

	});

});