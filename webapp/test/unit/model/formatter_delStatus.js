//learning Qunit testing in here!
sap.ui.define([
	"com/sodogan/manage_products/test/unit/helper/FakeI18nModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/base/ManagedObject",
	"com/sodogan/manage_products/model/formatter",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (FakeI18nModel, ResourceModel, ManagedObject, formatter) {
	"use strict";

	var _fakeResourceData = {
		deliveryByMail: "Delivery By Mail",
		deliveryByParcel: "Delivery By Parcel",
		deliveryByFreight: "Delivery By Freight"
	};

	/* formatter.delivery has dependancy to getModel and getResourceBundle
	 * getResourceBundle also calls getText()
	 * So we need a way to mock the 
	 *	delivery: function (sMeasure, iWeight) {
			var oModel = this.getModel("i18n");
            debugger;
				var  oResourceBundle = oModel.getResourceBundle(),
				sResult = "";
			if (sMeasure === "G") {
				iWeight = iWeight / 1000;
			}
			if (iWeight < 0.5) {
				sResult = oResourceBundle.getText("deliveryByMail");
			} else if (iWeight < 5) {
				sResult = oResourceBundle.getText("deliveryByParcel");
			} else {
				sResult = oResourceBundle.getText("deliveryByFreight");
			}

			return sResult;
		},
		*/
	QUnit.module("Delivery", {
		beforeEach: function () {
			//Now create a fake controller which will have a getModel method
			console.log('Inside beforeEach');
			var fakeResourceModel = new FakeI18nModel(_fakeResourceData);
			//When its calle with i18n args it will return the fake Resouce which is ours!
			/* You can use  this fake controller or a managedObject is fine too
			var fakeController = {
				getModel: function () {
					//empty 
				}
			};
			*/
			var fakeController = new ManagedObject({});
			//intercept the getModel method and return a Fake ResouceModel 
			this._stub = sinon.stub(fakeController, "getModel").withArgs("i18n").returns(fakeResourceModel);
			//bind the function to the fakeController!
			this._fnFakeDelivery = formatter.delivery.bind(fakeController);
		},
		afterEach: function () {
			console.log('Inside afterEach');
			this._fnFakeDelivery = null;
		}
	});

	var _runner = function (assert, actual, expected, message) {
		debugger;

      //check the length of the strings
		assert.ok(expected.length > 0, "Expected length > 0");
		assert.ok(actual.length > 0, "Actual length > 0");

		//check that they are equal!
		assert.strictEqual(actual, expected, message);
	};

	/* 
	 * Using the FakeModel which is created for testing as  a Fake model
	 * Notice that its is required
	 */
	QUnit.test("O.1 KG will be delivered by Mail", function (assert) {
		//Given
		//When
		let actual = this._fnFakeDelivery("KG", 0.2);
		//Then
		let expected = _fakeResourceData.deliveryByMail;
		_runner.call(this, assert, actual, expected, "Should be Mail delivery");
		//Then-check its called once!
		sinon.assert.calledOnce(this._stub);
		//check that
		assert.ok(this._stub.calledWith("i18n"), "Stub must be called with i18n args");
	});

	/* 
	 * Using our own ResourceModel which is created for testing as  a Fake model
	 * Notice that its is required
	 */
	QUnit.test("O.5 KG will be delivered by Mail", function (assert) {
		//Given
		//When
		var fakeResourceModel = new ResourceModel({
			bundleName: "com.sodogan.manage_products.i18n.i18n"
		});

		//debugger;
		var fakeController = {
			getModel: sinon.stub().withArgs("i18n").returns(fakeResourceModel)
		};
		//When its calle with i18n args it will return the fake Resouce which is ours!
		//bind the function to the fakeController!
		var fakeDelivery = formatter.delivery.bind(fakeController);
		let actual = fakeDelivery("KG", 0.2);
		//Then
		let expected = _fakeResourceData.deliveryByMail;
		_runner.call(this, assert, actual, expected, "Should be Mail delivery");
	});

});