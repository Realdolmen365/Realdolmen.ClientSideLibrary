/// <reference path="../RD.CSL.js" />
'use strict';
var RD = window.RD || { _namespace: true };
RD.Libraries = RD.Libraries || { _namespace: true };

//getGlobalContext only exist in CRM version >= 9.0
var CRM_Version9 = typeof Xrm !== "undefined" && typeof Xrm.Utility !== "undefined" && typeof Xrm.Utility.getGlobalContext !== "undefined";

/**
 * @description Helpers library contains all common functionality
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */
RD.Libraries.Helpers = RD.Libraries.Helpers || { _namespace: true };
/*Realdolmen library that contains several helper functions*/
(function () {
    /**
     * @description Logs a message to the console
     * @param {string} loggingText Text to log to the console.
     * @returns {} 
     */
    this.Log = function (loggingText) {
        if (window.console && window.console.log) console.log(loggingText);
    };
    /**
     * @description Filters one optionSet based on another field
     * @param {string} parentFieldName Name of the parent field
     * @param {string} dependantFieldName Name of the dependant field
     * @param {string} mapping Filtered values
     * @returns {} 
     */
    this.DependantPicklists = function (parentFieldName, dependantFieldName, mapping) {
        this.DependantPicklist(null, parentFieldName, dependantFieldName, mapping);
    }

     /**
     * @description Filters one optionSet based on another field
     * @param {object} executionContext The execution context as first parameter (check)
     * @param {string} parentFieldName Name of the parent field
     * @param {string} dependantFieldName Name of the dependant field
     * @param {string} mapping Filtered values
     * @returns {} 
     */

    this.DependantPicklists = function (executionContext, parentFieldName, dependantFieldName, mapping) {
        // switch to new object for CRM version >= 9
        var pageOrFormContext = executionContext == null ? Xrm.Page : executionContext.getFormContext();
        var onChangeHandler = function onChangeHandler(parentFieldName, dependantFieldName, mapping) {
            //store all options in _originalOptions            
                       
            if (!pageOrFormContext.getControl(dependantFieldName)._originalOptions) {
                pageOrFormContext.getControl(dependantFieldName)._originalOptions = pageOrFormContext.getControl(dependantFieldName).getAttribute().getOptions();
            }
                                  
            //onload reset value after list filtering
            var valueToRestore = pageOrFormContext.getAttribute(dependantFieldName).getValue();
   
            //construct filtered array
            var filteredValues = mapping["" + pageOrFormContext.getAttribute(parentFieldName).getValue()];
            if (!filteredValues) filteredValues = [];
            //clear all options
            pageOrFormContext.getControl(dependantFieldName).clearOptions();
            //loop through filtered array
            for (var a = 0; a < filteredValues.length; a++) {
                var optSetValue = filteredValues[a];
                //loop through full array, searching for matching value
                for (var b = 0; b < pageOrFormContext.getControl(dependantFieldName)._originalOptions.length; b++) {
                    var option = pageOrFormContext.getControl(dependantFieldName)._originalOptions[b];
                    if (option.value == optSetValue) {
                        pageOrFormContext.getControl(dependantFieldName).addOption(option);
                    }
                }
            }
            if (filteredValues.indexOf(valueToRestore) != -1) {
                pageOrFormContext.getAttribute(dependantFieldName).setValue(valueToRestore);
            } else {
                pageOrFormContext.getAttribute(dependantFieldName).setValue(null);
            }
        };
        //attach onChange event
        pageOrFormContext.getAttribute(parentFieldName).addOnChange(function () {
            onChangeHandler(parentFieldName, dependantFieldName, mapping);
        });
        //execute 1st time
        onChangeHandler(parentFieldName, dependantFieldName, mapping);
    };
    /**
     * Compares two GUIDs to see if they are completely equal
     * @param {string} guid1 
     * @param {string} guid2 
     * @returns {boolean} True or False if the GUIDs are equal
     */
    this.GuidsAreEqual = function (guid1, guid2) {
        // compares two guids
        var isEqual = false;
        if (guid1 == null || guid2 == null) {
            isEqual = false;
        } else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() == guid2.replace(/[{}]/g, "").toLowerCase();
        }
        return isEqual;
    };
}).call(RD.Libraries.Helpers);

