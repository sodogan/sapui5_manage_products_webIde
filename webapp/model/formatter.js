sap.ui.define([], function () {
	"use strict";

	var _formatter = {
		_APIKEY: 'AIzaSyA4lPLtfRGxN2WB6pzmN3yhSubhwxYZAxE',
		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		/**
		 * Formats an address to a static google maps image
		 * @public
		 * @param {string} sStreet the street
		 * @param {string} sZIP the postal code
		 * @param {string} sCity the city
		 * @param {string} sCountry the country
		 * @returns {string} sValue a google maps URL that can be bound to an image
		 */
		formatMapUrl: function (sStreet, sZIP, sCity, sCountry) {
			if (sStreet && sZIP && sCity && sCountry) {
				return "https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=640x640&markers=" + jQuery.sap.encodeURL(sStreet + ", " + sZIP +
					" " + sCity + ", " + sCountry) + '&key=' + _formatter._APIKEY;
			}
		},
		/**
		 * @public
		 * Determines a delivery method based on the weight of a product
		 * @param {string} sMeasure the measure of the weight to be formatted
		 * @param {integer} iWeight the weight to be formatted
		 * @returns {string} sValue the delivery method
		 */
		delivery: function (sMeasure, iWeight) {
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

	};

	return _formatter;

}, true);