/// <reference path="scripts/RD.Libraries.BL.js" />
/// <reference path="../RD.CSL.js" />
//Ensure only one copy of the RD namespace exists.
"use strict";
var RD = window.RD || { _namespace: true };
RD.Libraries = RD.Libraries || { _namespace: true };

//getGlobalContext only exist in CRM version >= 9.0
var CRM_Version9 = typeof Xrm !== "undefined" && typeof Xrm.Utility !== "undefined" && typeof Xrm.Utility.getGlobalContext !== "undefined";

/**
 * @description RD.FormType holds properties to help determine the current form type
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */
RD.Libraries.FormType = RD.Libraries.FormType || { _namespace: true };
(function () {
    // All CRM Formtypes (source: https://msdn.microsoft.com/en-us/library/gg327828.aspx#BKMK_getFormType)
    
    /**
     * @description Compares the current form type to a value
     * @param {object} executionContext The execution context as first parameter (check)
     * @param {int} value Value to check against the formtype
     * @returns {boolean} 
    */
    this._isFormType = function (value) {
        // switch to new object for CRM version >= 9
        var pageOrFormContext = RD.SetExecutionContext == null ? Xrm.Page : RD.SetExecutionContext.getFormContext().ui;
        var formType = pageOrFormContext.getFormType();
        
        return formType === value;
    };
}).call(RD.Libraries.FormType);
// Returns true if the current form type equals "Undefined"
Object.defineProperty(RD.Libraries.FormType, "UNDEFINED", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(0);
    }
});
// Returns true if the current form type equals "Create"
Object.defineProperty(RD.Libraries.FormType, "CREATE", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(1);
    }
});
// Returns true if the current form type equals "Update"
Object.defineProperty(RD.Libraries.FormType, "UPDATE", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(2);
    }
});
// Returns true if the current form type equals "Read Only"
Object.defineProperty(RD.Libraries.FormType, "READONLY", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(3);
    }
});
// Returns true if the current form type equals "Disabled"
Object.defineProperty(RD.Libraries.FormType, "DISABLED", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(4);
    }
});
// Returns true if the current form type equals "Quick Create"
Object.defineProperty(RD.Libraries.FormType, "QUICKCREATE", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(5);
    }
});
// Returns true if the current form type equals "Bulk Edit"
Object.defineProperty(RD.Libraries.FormType, "BULKEDIT", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(6);
    }
});
// Returns true if the current form type equals "Read Optimized"
Object.defineProperty(RD.Libraries.FormType, "READOPTIMIZED", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(11);
    }
});
// Returns true if the script is loaded in a webresource
Object.defineProperty(RD.Libraries.FormType, "WEBRESOURCE", {
    get: function get() {
        return RD.Libraries.FormType._isFormType(null);
    }
});

