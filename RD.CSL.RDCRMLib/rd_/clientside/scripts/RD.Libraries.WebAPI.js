//Ensure only one copy of the RD namespace exists.
"use strict";

var RD = window.RD || { __namespace: true };

//Ensure only one copy of the RD.Libraries namespace exists.
RD.Libraries = RD.Libraries || { __namespace: true };

//Ensure only one copy of the RD.Libraries.WebAPI namespace exists.
/**
 * @description RD.WebAPI provides WebAPI functionality
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */
RD.Libraries.WebAPI = RD.Libraries.WebAPI || { __namespace: true };

(function () {

    /** @description Create a new entity
    * @param {object} entity An object with the properties for the entity you want to create..
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.create = function (entity, successCallBack, errorCallBack) {
        /// <summary>Create a new entity</summary>
        /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>
        /// <param name="successCallBack" type="Function">The function to call when the entity is created. The Uri of the created entity is passed to this function.</param>
        /// <param name="errorCallBack" type="Function">The function to call when there is an error. The error will be passed to this function.</param>

        if (isNullOrUndefined(entity)) {
            throw new Error("RD.WebAPI.create entity parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.create successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.create errorCallBack parameter must be a function or null.");
        }

        if (isNullOrUndefined(entity.logicalName)) {
            throw new Error("entity parameter must contain a logicalName");
        }
        if (isNullOrUndefined(entity.attributes)) {
            throw new Error("entity parameter must contain attributes");
        }

        var logicalName = entity.logicalName + "s";

        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(getWebAPIPath() + logicalName), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send(JSON.stringify(entity.attributes));
    };

    /** @description update an entity
    * @param {object} entity An object with the properties for the entity you want to update..
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.update = function (entity, successCallBack, errorCallBack) {
        if (isNullOrUndefined(entity)) {
            throw new Error("RD.WebAPI.update entity parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.update successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.update errorCallBack parameter must be a function or null.");
        }

        if (isNullOrUndefined(entity.logicalName)) {
            throw new Error("entity parameter must contain a logicalName");
        }
        if (isNullOrUndefined(entity.attributes)) {
            throw new Error("entity parameter must contain attributes");
        }

        var logicalName = entity.logicalName + "s";
        var id = entity.id.replace("{", "").replace("}", "");
        var queryString = logicalName + "(" + id + ")";

        var req = new XMLHttpRequest();
        req.open("PATCH", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send(JSON.stringify(entity.attributes));
    };

    /** @description retrieve a single record
    * @param {string} logicalName Lhe logical name of the record you want to retrieve
    * @param {string} id The id of the record you want to retrieve
    * @param {array} columnset An array with the columns you want to retrieve. Use '.' to retrieve columns form n-1 related records
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.retrieve = function (logicalName, id, columnset, successCallBack, errorCallBack) {
        if (isNullOrUndefined(logicalName)) {
            throw new Error("RD.WebAPI.retrieve logicalName parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(id)) {
            throw new Error("RD.WebAPI.retrieve id parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(columnset)) {
            throw new Error("RD.WebAPI.retrieve columnset parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.retrieve successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.retrieve errorCallBack parameter must be a function or null.");
        }

        logicalName = logicalName + "s";
        id = id.replace("{", "").replace("}", "");
        var select = "";
        var expand = "";
        var expandDictionary = [];

        if (columnset === true) {
            select = "*";
        } else {
            columnset.forEach(function (column) {
                if (column.indexOf(".") < 0) {
                    if (select.length > 0) select = select + ", ";
                    select = select + column;
                } else {
                    var columnSplit = column.split(".");
                    if (expandDictionary[columnSplit[0]]) {
                        expandDictionary[columnSplit[0]] = expandDictionary[columnSplit[0]] + ", " + columnSplit[1];
                    } else {
                        expandDictionary[columnSplit[0]] = columnSplit[1];
                    }
                }
            });
        }

        for (var key in expandDictionary) {
            if (typeof expandDictionary[key] !== 'function') {
                if (expand.length > 0) expand = expand + ", ";
                expand = expand + key + "($select=" + expandDictionary[key] + ")";
            }
        }

        var req = new XMLHttpRequest();
        var queryString = logicalName + "(" + id + ")?$select=" + select;
        if (expand != "") queryString = queryString + "&$expand=" + expand;
        req.open("GET", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send();
    };

    /** @description retrieve a list of records
    * @param {object} query The query you want to use to retrieve the records. Should contain: logicalName (string), columnset (array of strings), filters (array of filters)
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.retrieveMultiple = function (query, successCallBack, errorCallBack) {

        if (isNullOrUndefined(query)) {
            throw new Error("RD.WebAPI.retrieveMultiple query parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.retrieveMultiple successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.retrieveMultiple errorCallBack parameter must be a function or null.");
        }

        if (isNullOrUndefined(query.logicalName)) {
            throw new Error("query should contain a logicalName.");
        }
        if (isNullOrUndefined(query.columnset)) {
            throw new Error("query should contain a columnset (array of strings).");
        }
        if (isNullOrUndefined(query.filters)) {
            throw new Error("query should contain a filters (array of filters).");
        }

        logicalName = query.logicalName + "s";
        var select = "";
        var expand = "";
        var queryFilter = "";
        var expandDictionary = [];

        if (query.columnset === true) {
            select = "*";
        } else {
            query.columnset.forEach(function (column) {
                if (column.indexOf(".") < 0) {
                    if (select.length > 0) select = select + ", ";
                    select = select + column;
                } else {
                    var columnSplit = column.split(".");
                    if (expandDictionary[columnSplit[0]]) {
                        expandDictionary[columnSplit[0]] = expandDictionary[columnSplit[0]] + ", " + columnSplit[1];
                    } else {
                        expandDictionary[columnSplit[0]] = columnSplit[1];
                    }
                }
            });
        }

        query.filters.forEach(function (filter) {
            queryFilter = appendFilterToQueryFilter(filter, queryFilter);
        });

        for (var key in expandDictionary) {
            if (typeof expandDictionary[key] !== 'function') {
                if (expand.length > 0) expand = expand + ", ";
                expand = expand + key + "($select=" + expandDictionary[key] + ")";
            }
        }

        var req = new XMLHttpRequest();
        var queryString = logicalName + "?$select=" + select;
        if (expand != "") queryString = queryString + "&$expand=" + expand;
        if (queryFilter != "") queryString = queryString + "&$filter=" + queryFilter;
        req.open("GET", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send();
    };

    function appendFilterToQueryFilter(filter, queryFilter) {
        var filterOperator = filter.filterOperator ? filter.filterOperator : "and";
        var conditionString = "";

        filter.conditions.forEach(function (condition) {
            if (conditionString.length > 0) conditionString = conditionString + " " + filterOperator;
            if (standardFilterFunctions.indexOf(condition.operator) >= 0) {
                conditionString = conditionString + " " + condition.operator + "(" + condition.attribute + ",'" + condition.value + "')";
            } else if (dynamicsFilterFunctions.indexOf(condition.operator) >= 0) {
                if (condition.value) {
                    conditionString = conditionString + " Microsoft.Dynamics.CRM." + condition.operator + "(PropertyName='" + condition.attribute + "',PropertyValue='" + condition.value + "')";
                } else if (condition.values) {
                    var values = "";
                    condition.values.forEach(function (value) {
                        if (values.length > 0) {
                            values = values + ",";
                        }
                        values = values + "\"" + values + "\"";
                    });
                    conditionString = conditionString + " Microsoft.Dynamics.CRM." + condition.operator + "(PropertyName='" + condition.attribute + "',PropertyValues=[" + values + "])";
                } else {
                    conditionString = conditionString + " Microsoft.Dynamics.CRM." + condition.operator + "(PropertyName='" + condition.attribute + "')";
                }
            } else if (condition.value) {
                if (isNaN(condition.value)) {
                    conditionString = conditionString + " " + condition.attribute + " " + condition.operator + " '" + condition.value + "'";
                } else {
                    conditionString = conditionString + " " + condition.attribute + " " + condition.operator + " " + condition.value;
                }
            }
        });

        queryFilter = queryFilter + "(" + conditionString + ")";

        if (filter.filters) {
            filter.filters.forEach(function (innerFilter) {
                queryFilter = appendFilterToQueryFilter(innerFilter, queryFilter);
            });
        }

        return queryFilter;
    }

    /** @description count a list of records
    * @param {object} query The query you want to use to retrieve the records. Should contain: logicalName (string), filters (array of filters)
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.count = function (query, successCallBack, errorCallBack) {

        if (isNullOrUndefined(query)) {
            throw new Error("RD.WebAPI.count query parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.count successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.count errorCallBack parameter must be a function or null.");
        }

        if (isNullOrUndefined(query.logicalName)) {
            throw new Error("query should contain a logicalName.");
        }
        if (isNullOrUndefined(query.filters)) {
            throw new Error("query should contain a columnset (array of filters).");
        }

        logicalName = query.logicalName + "s";
        var queryFilter = "";

        query.filters.forEach(function (filter) {
            queryFilter = appendFilterToQueryFilter(filter, queryFilter);
        });

        var req = new XMLHttpRequest();
        var queryString = logicalName + "?$count=true";
        if (queryFilter != "") queryString = queryString + "&$filter=" + queryFilter;
        req.open("GET", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send();
    };

    /** @description delete a single record
    * @param {string} logicalName The logical name of the record you want to delete
    * @param {string} id The id of the record you want to delete
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this["delete"] = function (logicalName, id, successCallBack, errorCallBack) {

        if (isNullOrUndefined(logicalName)) {
            throw new Error("RD.WebAPI.delete logicalName parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(id)) {
            throw new Error("RD.WebAPI.delete id parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.delete successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.delete errorCallBack parameter must be a function or null.");
        }

        var queryString = logicalName + "s(" + id + ")";

        var req = new XMLHttpRequest();
        req.open("DELETE", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send();
    };

    /** @description execute a saved query or user query
    * @param {string} logicalName The logical name of the record you want to delete
    * @param {string} queryId The id of the saved Query or user query you want use to retrieve results
    * @param {string} savedOrUser 'savedQuery' or 'userQuery', optional param, default savedQuery
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.executeSavedQuery = function (logicalName, queryId, savedOrUser, successCallBack, errorCallBack) {

        if (isNullOrUndefined(logicalName)) {
            throw new Error("RD.WebAPI.executeSavedQuery logicalName parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(queryId)) {
            throw new Error("RD.WebAPI.executeSavedQuery queryId parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.executeSavedQuery successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.executeSavedQuery errorCallBack parameter must be a function or null.");
        }

        if (isNullOrUndefined(savedOrUser)) savedOrUser = "savedQuery";

        logicalName = logicalName + "s";
        var queryString = logicalName + "?" + savedOrUser + "=" + queryId;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send();
    };

    /** @description execute a fetchxml request
    * @param {string} logicalName The logical name of the record you want to delete
    * @param {string} fetchxml The fetchxml expression you want to execute
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.executeFetch = function (logicalName, fetchXml, successCallBack, errorCallBack) {

        if (isNullOrUndefined(logicalName)) {
            throw new Error("RD.WebAPI.executeFetch logicalName parameter must not be null or undefined.");
        }
        if (isNullOrUndefined(fetchXml)) {
            throw new Error("RD.WebAPI.executeFetch fetchXml parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.executeFetch successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.executeFetch errorCallBack parameter must be a function or null.");
        }

        logicalName = logicalName + "s";
        var queryString = logicalName + "?fetchXml=" + fetchXml;

        var req = new XMLHttpRequest();
        req.open("GET", encodeURI(getWebAPIPath() + queryString), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", 'odata.include-annotations="*"');
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send();
    };

    /** @description execute custom action
    * @param {string} actionName The unique name of your action
    * @param {object} parameters The parameters your action expect to get
    * @param {function} successCallBack The function to call when the entity is created. The Uri of the created entity is passed to this function.
    * @param {function} errorCallBack The function to call when there is an error. The error will be passed to this function.
    */
    this.executeCustomAction = function (actionName, parameters, successCallBack, errorCallBack) {

        if (isNullOrUndefined(actionName)) {
            throw new Error("RD.WebAPI.executeFetch actionName parameter must not be null or undefined.");
        }
        if (!isFunctionOrNull(successCallBack)) {
            throw new Error("RD.WebAPI.executeFetch successCallBack parameter must be a function or null.");
        }
        if (!isFunctionOrNull(errorCallBack)) {
            throw new Error("RD.WebAPI.executeFetch errorCallBack parameter must be a function or null.");
        }

        if (isNullOrUndefined(parameters)) parameters = {};

        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(getWebAPIPath() + actionName), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.onreadystatechange = function () {
            if (this.readyState == 4) {
                req.onreadystatechange = null;
                evalReadyState(this, successCallBack, errorCallBack);
            }
        };
        req.send(JSON.stringify(parameters));
    };

    function evalReadyState(state, successCallBack, errorCallBack) {
        if (state.status == 200) {
            var data = JSON.parse(state.response);
            if (typeof data["@odata.count"] !== "undefined") {
                successCallBack(data["@odata.count"]);
            } else {
                successCallBack(data);
            }
        } else if (state.status == 204) {
            var entityid = state.getResponseHeader("odata-entityid");
            if (entityid) {
                entityid = entityid.substring(entityid.indexOf("(") + 1).substring(0, 36);
                successCallBack(entityid);
            } else {
                successCallBack();
            }
        } else {
            var error = JSON.parse(state.response).error;
            errorCallBack(error);
        }
    }

    function getClientUrl() {
        //Get the organization URL
        if (typeof GetGlobalContext == "function" && typeof GetGlobalContext().getClientUrl == "function") {
            return GetGlobalContext().getClientUrl();
        } else {
            //If GetGlobalContext is not defined check for Xrm.Page.context;
            if (typeof Xrm != "undefined" && typeof Xrm.Page != "undefined" && typeof Xrm.Page.context != "undefined" && typeof Xrm.Page.context.getClientUrl == "function") {
                try {
                    return Xrm.Page.context.getClientUrl();
                } catch (e) {
                    throw new Error("Xrm.Page.context.getClientUrl is not available.");
                }
            } else {
                throw new Error("Context is not available.");
            }
        }
    }

    function getWebAPIPath() {
        return getClientUrl() + "/api/data/v8.0/";
    }

    this.dateReviver = function (key, value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    };

    //Internal validation functions
    function isString(obj) {
        if (typeof obj === "string") {
            return true;
        }
        return false;
    }
    function isNull(obj) {
        if (obj === null) {
            return true;
        }
        return false;
    }
    function isUndefined(obj) {
        if (typeof obj === "undefined") {
            return true;
        }
        return false;
    }
    function isFunction(obj) {
        if (typeof obj === "function") {
            return true;
        }
        return false;
    }
    function isNullOrUndefined(obj) {
        if (isNull(obj) || isUndefined(obj)) {
            return true;
        }
        return false;
    }
    function isFunctionOrNull(obj) {
        if (isNull(obj)) {
            return true;
        }
        if (isFunction(obj)) {
            return true;
        }
        return false;
    }

    this.errorHandler = function (resp) {
        try {
            return JSON.parse(resp).error;
        } catch (e) {
            return new Error("Unexpected Error");
        }
    };

    var standardFilterFunctions = ["contains", "endswith", "startswith"];
    var dynamicsFilterFunctions = ["Above", "AboveOrEqual", "Between", "Contains", "EqualBusinessId", "EqualUserId", "EqualUserLanguage", "EqualUserOrUserHierarchy", "EqualUserOrUserHierarchyAndTeams", "EqualUserOrUserTeams", "EqualUserTeams", "In", "InFiscalPeriod", "InFiscalPeriodAndYear", "InFiscalYear", "InOrAfterFiscalPeriodAndYear", "InOrBeforeFiscalPeriodAndYear", "Last7Days", "LastFiscalPeriod", "LastFiscalYear", "LastMonth", "LastWeek", "LastXDays", "LastXFiscalPeriods", "LastXFiscalYears", "LastXHours", "LastXMonths", "LastXWeeks", "LastXYears", "LastYear", "Next7Days", "NextFiscalPeriod", "NextFiscalYear", "NextMonth", "NextWeek", "NextXDays", "NextXFiscalPeriods", "NextXFiscalYears", "NextXHours", "NextXMonths", "NextXWeeks", "NextXYears", "NextYear", "NotBetween", "NotEqualBusinessId", "NotEqualUserId", "NotIn", "NotUnder", "OlderThanXDays", "OlderThanXHours", "OlderThanXMinutes", "OlderThanXMonths", "OlderThanXWeeks", "OlderThanXYears", "On", "OnOrAfter", "OnOrBefore", "ThisFiscalPeriod", "ThisFiscalYear", "ThisMonth", "ThisWeek", "ThisYear", "Today", "Tomorrow", "Under", "UnderOrEqual", "Yesterday"];
}).call(RD.Libraries.WebAPI);

