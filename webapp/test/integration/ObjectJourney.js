/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"./pages/Worklist",
	"./pages/Browser",
	"./pages/Object",
	"./pages/App",
	"./pages/NewProduct"
], function (opaTest) {
	"use strict";

	QUnit.module("Object");

	opaTest("Should remember the first item", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		//Actions
		When.onTheWorklistPage.iRememberTableItemAtPosition(1);

		// Assertions
		Then.onTheWorklistPage.theTitleShouldDisplayTheTotalAmountOfItems();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should start the app with remembered item", function (Given, When, Then) {
		// Arrangements
		Given.iRestartTheAppWithTheRememberedItem({
			delay: 1000
		});

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheRememberedObject().
			and.theObjectViewShouldContainOnlyFormattedUnitNumbers();

		// Cleanup
		Then.iTeardownMyApp();
	});
	
	opaTest("Should see the 'New Product' view after pressing the 'Add' button", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			//Actions
			When.onTheWorklistPage.iWaitUntilTheTableIsLoaded().and.iPressAdd();
			//Assertions
			Then.onTheNewProductPage.iShouldSeeThePage().and.iTeardownMyAppFrame();
		});



});
