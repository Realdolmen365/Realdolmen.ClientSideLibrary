/// <reference path="scripts/RD.Libraries.BL.js" />
/// <reference path="scripts/RD.Libraries.Helpers.js" />
/// <reference path="RD.CSL.js" />
var RD = window.RD || { _namespace: true };
/**
 * @description RD.Test is a library used for testing purposes. The library
 * contains several functions to test the complete Realdolmen ClientSide library
 * USAGE:
 * Load the RD.Test in a form on CRM and execute the TestRDCSL function onload to perform the tests
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */
RD.Test = RD.Test || { _namespace: true };
(function () {
    this.overallPass = true;
    RD.Test._numberPassed = 0;
    RD.Test._numberFailed = 0;

    this._log = function (name, pass) {
        if (pass == true) {
            RD.Test._numberPassed ++;
            this._pass(name);
        } else {
            RD.Test._numberFailed ++;
            this._fail(name);
        }
    }
    this._pass = function (name) {
        console.log("PASS\t" + name);
    }
    this._fail = function (name) {
        console.log("FAIL\t" + name);
        this.overallPass = false;
    }
    //This function contains all tests to be handled
    this.TestRDCSL = function (executionContext) {
        try {
            console.log("Start executing all tests.");
            this.ExecuteBasicTests();
            this.ExecuteFormTypeTests(executionContext);
            this.ExecuteLibrariesTests();
            this.ExecuteHelperTests();
            this.ExecuteBLTests();

            //Show test results
            var totalTests = (RD.Test._numberFailed + RD.Test._numberPassed);
            if (totalTests == 0) {
                console.log("The Realdolmen clientside library did not execute any tests.");
                alert("The Realdolmen clientside library did not execute any tests.");
            } else {
                console.log("The Realdolmen clientside library tests ended with a PASS rate of " + (RD.Test._numberPassed / totalTests)*100 + "% \r Check the console for details");
                alert("The Realdolmen clientside library tests ended with a PASS rate of " + (RD.Test._numberPassed / totalTests) * 100 + "% \r Check the console for details");
            }          
            
        } catch (e) {
            console.log(e);
        }
    }
    this.ExecuteBLTests = function () {
        //RD.BL.ValidateVAT
        if (this.isNull(RD.BL.ValidateVAT) || this.isUndefined(RD.BL.ValidateVAT)) {
            this._fail("RD.BL.ValidateVAT is null or undefined");
        } else {
            var isVATValid = RD.BL.ValidateVAT("BE", "BE0429037235");
            this._log("RD.BL.ValidateVAT", isVATValid);
        }
        //RD.BL.ValidateRijksregister
        if (this.isNull(RD.BL.ValidateRijksregister) || this.isUndefined(RD.BL.ValidateRijksregister)) {
            this._fail("RD.BL.ValidateRijksregister is null or undefined.");
        } else {
            this._pass("RD.BL.ValidateRijksregister is present");
            //No test will be added here because there are dependencies to fields on the form
        }
    }
    this.ExecuteHelperTests = function () {
        //RD.Helpers.Log
        if (this.isNull(RD.Helpers.Log) || this.isUndefined(RD.Helpers.Log)) {
            this._fail("RD.Helpers.Log is null or undefined");
        } else {
            this._pass("RD.Helpers.Log");
        }
        //RD.Helpers.GuidsAreEqual
        if (this.isNull(RD.Helpers.GuidsAreEqual) || this.isUndefined(RD.Helpers.GuidsAreEqual)) {
            this.__fail("RD.Helpers.GuidsAreEqual is null or undefined!");
        } else {
            var guidsAreEqualDifferentFromatting = RD.Helpers.GuidsAreEqual("{239B63F7-67E2-406E-A7DB-40C7AC4A2F62}", "239b63f7-67e2-406e-a7db-40c7ac4a2f62");
            this._log("RD.Helpers.GuidsAreEqual => Different formatting", guidsAreEqualDifferentFromatting);
            var guidsAreEqualCaps = RD.Helpers.GuidsAreEqual("239B63F7-67E2-406E-A7DB-40C7AC4A2F62", "239b63f7-67e2-406e-a7db-40c7ac4a2f62");
            this._log("RD.Helpers.GuidsAreEqual => With and without caps", guidsAreEqualCaps);
            var guidsAreEqual = RD.Helpers.GuidsAreEqual("239B63F7-67E2-406E-A7DB-40C7AC4A2F62", "239B63F7-67E2-406E-A7DB-40C7AC4A2F62");
            this._log("RD.Helpers.GuidsAreEqual => Equal Guids", guidsAreEqual);
            var guidsAreNotEqual = RD.Helpers.GuidsAreEqual("{88F0E451-C336-48A5-8473-C37C20C95ED5}", "BF34E536-57F6-4AC9-9E7B-012DCF101181");
            this._log("RD.Helpers.GuidsAreEqual => Not equal Guids", !guidsAreNotEqual);
            var guidsIncorrectFormat = RD.Helpers.GuidsAreEqual("{-C336-48A5-8473-C37C20C95ED5}", "BF34E536-57F6-4AC9-9E7B-012DCF101181");
            this._log("RD.Helpers.GuidsAreEqual => Incorrect Format", !(guidsIncorrectFormat === "{-C336-48A5-8473-C37C20C95ED5} is not a valid Guid!"));
        }
    }
    this.ExecuteLibrariesTests = function () {
        var helpers = RD.Helpers;
        this._log("RD.Helpers", (!this.isNull(helpers) && this.isObject(helpers)));
        var rest = RD.REST;
        this._log("RD.REST", (!this.isNull(rest) && this.isObject(rest)));
        var phoneformat = RD.PhoneFormat;
        this._log("RD.PhoneFormat", (!this.isNull(phoneformat) && this.isObject(phoneformat)));
        var bl = RD.BL;
        this._log("RD.BL", (!this.isNull(bl) && this.isObject(bl)));
        var crmcontrols = RD.CustomControls;
        this._log("RD.CustomControls", (!this.isNull(crmcontrols) && this.isObject(crmcontrols)));
        var iban = RD.IBAN;
        this._log("RD.IBAN", (!this.isNull(iban) && this.isObject(iban)));
        var fetch = RD.CRMFetchKit;
        this._log("RD.CRMFetchKit", (!this.isNull(fetch) && this.isObject(fetch)));
        var moment = RD.moment;
        this._log("RD.moment", this.isFunction(moment));
        var cae = RD.CustomActionExecutor;
        this._log("RD.CustomActionExecutor", (!this.isNull(cae) && this.isObject(cae)));
        var webapi = RD.WebAPI;
        this._log("RD.WebAPI", (!this.isNull(webapi) && this.isObject(webapi)));
        var webAPI2 = RD.WebAPI;
        this._log("RD.WebAPI", !(this.isNull(webAPI2) && this.isObject(webAPI2)));//libraries will only be loaded once
        this.listLoadedScripts();
    }
    this.ExecuteFormTypeTests = function (executionContext){
        console.log("Execute Formtype tests");
        var formtype = null;
        if (Xrm != null && Xrm.Page != null && Xrm.Page.ui != null && this.isFunction(Xrm.Page.ui.getFormType)) {
            formtype = Xrm.Page.ui.getFormType();
        }
        var create = RD.FormType.CREATE;
        if (formtype == 1 && create == true)
        this._log("RD.FormType.CREATE", (formtype == 1 && create == true));
        var bulkedit = RD.FormType.BULKEDIT;
        if (formtype == 6 && bulkedit == true)
        this._log("RD.FormType.BULKEDIT", (formtype == 6 && bulkedit == true));
        var disabled = RD.FormType.DISABLED;
        if (formtype == 4 && disabled == true)
        this._log("RD.FormType.DISABLED", (formtype == 4 && disabled == true));
        var quickcreate = RD.FormType.QUICKCREATE;
        if (formtype == 5 && quickcreate == true)
        this._log("RD.FormType.QUICKCREATE", (formtype == 5 && quickcreate == true));
        var readonly = RD.FormType.READONLY;
        if (formtype == 3 && readonly == true)
        this._log("RD.FormType.READONLY", (formtype == 3 && readonly == true));
        var readoptimized = RD.FormType.READOPTIMIZED;
        if (formtype == 11 && readoptimized == true)
        this._log("RD.FormType.READOPTIMIZED", (formtype == 11 && readoptimized == true));
        var undefined = RD.FormType.UNDEFINED;
        if (formtype == 0 && undefined == true)
        this._log("RD.FormType.UNDEFINED", (formtype == 0 && undefined == true));
        var update = RD.FormType.UPDATE;
        if (formtype == 2 && update == true)
        this._log("RD.FormType.UPDATE", (formtype == 2 && update == true));
        var webresource = RD.FormType.WEBRESOURCE;
        if (this.isNull(formtype) && webresource == true)
        this._log("RD.FormType.WEBRESOURCE", (this.isNull(formtype) && webresource == true));
    }
    this.ExecuteBasicTests = function () {
        console.log("Execute Basic tests");
        this._log("RD._loaded", this.listLoadedScripts());
        var context = RD.GetContext();
        this._log("RD.GetContext()", (!this.isNull(context) && this.isObject(context) && !this.isUndefined(context.getUserId)));
        var clientUrl = RD.GetClientURL();
        this._log("RD.GetClientURL()", (!this.isNull(clientUrl) && this.isString(clientUrl)));
    }
    //Internal validation functions
    this.isString = function (obj) {
        if (typeof obj === "string") {
            return true;
        }
        return false;
    }
    this.isNull = function (obj) {
        if (obj === null)
        { return true; }
        return false;
    }
    this.isUndefined = function (obj) {
        if (typeof obj === "undefined") {
            return true;
        }
        return false;
    }
    this.isFunction = function (obj) {
        if (typeof obj === "function") {
            return true;
        }
        return false;
    }
    this.isObject = function (obj) {
        if (typeof obj === "object") {
            return true;
        }
        return false;
    }
    this.listLoadedScripts = function () {
        if (this.isNull(RD._loaded)) {
            this._log("RD._loaded", false);
            return false;
        }
        for (var property in RD._loaded) {
            console.log("Library loaded: "+property);
        }
        return true;
    }
}).call(RD.Test);
