/*RD.CSL.js 2.0
* Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

"use strict";

var RD = window.RD || { _namespace: true };
(function () {
    if (RD._loaded && RD._loaded["rd_/clientside/RD.CSL.js"]) {
        console.log("Ensures single execution");
        return; //Ensures single execution
    }
    /**
     * @description RD._loaded holds the list of loaded scripts
     */
    RD._loaded = {
        "rd_/clientside/RD.CSL.js": true
    };
    /**
     * @description Get the XRM Context from either the current Form or the ClientGlobalContext.js.aspx Page
     * @returns {XRMContext} The Xrm.Page.context object.
     */
    RD.GetContext = function () {
        if (typeof Xrm !== "undefined") return Xrm.Page.context;
        if (typeof GetGlobalContext !== "undefined") return GetGlobalContext();
        this.Log("Context is not available. Please contact your system administrator.");
    };

    /**
    * @description Retrieves the current Client URL
    * @returns {string} The current Client Url.
    */
    RD.GetClientURL = function () {
        return RD.GetContext().getClientUrl();
    };
    /**
    * @description Loads the library passed in the parameter
    * @param {string} scriptname The path and name of the library to load
    */
    RD.LoadScript = function (scriptname) {
        // Loads and parses a JavaScript WebResource if it was not loaded before.
        if (RD._loaded[scriptname] === true) return;

        var cache_url = "";
        if (typeof WEB_RESOURCE_ORG_VERSION_NUMBER !== "undefined") cache_url = "/" + encodeURIComponent(WEB_RESOURCE_ORG_VERSION_NUMBER);else if (typeof parent.WEB_RESOURCE_ORG_VERSION_NUMBER !== "undefined") cache_url = "/" + encodeURIComponent(parent.WEB_RESOURCE_ORG_VERSION_NUMBER);

        var url = RD.GetClientURL() + cache_url + "/WebResources/" + scriptname;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.setRequestHeader("Content-Type", "text/javascript");
        xmlhttp.send();

        if (xmlhttp.response === "") {
            this.Log(scriptname + " not found!");
            throw new Error(scriptname + " not found!");
        }
        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        // We use execScript on Internet Explorer
        // We use an anonymous function so that context is window
        // rather than jQuery in Firefox
        (window.execScript || function (data) {
            window["eval"].call(window, data);
        })(xmlhttp.response);

        RD._loaded[scriptname] = true;
    };
    //Loads the Helper Library from the scripts
    Object.defineProperty(RD, "Helpers", {
        get: function get() {
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.Helpers.js");
            return RD.Libraries.Helpers;
        }
    });
    //Loads the FormType Library from the scripts
    Object.defineProperty(RD, "FormType", {
        get: function get() {
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.FormType.js");
            return RD.Libraries.FormType;
        }
    });
    //Loads het Belgian Library from the scripts
    Object.defineProperty(RD, "BL", {
        get: function get() {
            // Loads the Belgian Library from the RD Solution.
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.BL.js");
            return RD.Libraries.BL;
        }
    });
    //Loads the IBAN library
    Object.defineProperty(RD, "IBAN", {
        get: function get() {
            // Loads the Belgian Library from the RD Solution.
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.IBAN.js");
            return RD.Libraries.IBAN;
        }
    });
    //Loads the PhoneFormat library
    Object.defineProperty(RD, "PhoneFormat", {
        get: function get() {
            // Loads the PhoneFormat Library from the RD Solution.
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.PhoneFormat.js");
            return RD.Libraries.PhoneFormat;
        }
    });
    //Loads the customControls library from the scripts
    Object.defineProperty(RD, "CustomControls", {
        get: function get() {
            // Loads the CustomControls Library from the RD Solution.
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.CRMControls.js");
            return RD.Libraries.CustomControls;
        }
    });
    //Loads the customActionExecutor library from the scripts
    Object.defineProperty(RD, "CustomActionExecutor", {
        get: function get() {
            // Loads the CustomActionExecutor Library from the RD Solution.
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.CustomActionExecutor.js");
            return RD.Libraries.CustomActionExecutor;
        }
    });

    //Loads the momentJS Library as a function
    //moment.js should be defined as a function and not a property
    RD.moment = function () {
        RD.LoadScript("rd_/clientside/scripts/moment.js");
        return moment.apply(null, arguments);
    };
    //Loads the CRMFetchKit library from the scripts
    Object.defineProperty(RD, "CRMFetchKit", {
        get: function get() {
            RD.LoadScript("rd_/clientside/scripts/CrmFetchKit.bundle.js");
            return CrmFetchKit;
        }
    });
    //Loads the REST library from the scripts
    Object.defineProperty(RD, "REST", {
        get: function get() {
            RD.LoadScript("rd_/clientside/scripts/SDK.REST.js");
            return SDK.REST;
        }
    });
    //Loads the WEB API from the scripts
    Object.defineProperty(RD, "WebAPI", {
        get: function get() {
            RD.LoadScript("rd_/clientside/scripts/RD.Libraries.WebAPI.js");
            return RD.Libraries.WebAPI;
        }
    });
}).call(RD);

