//Ensure only one copy of the RD namespace exists.
'use strict';
/**
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */
var RD = window.RD || { __namespace: true };
RD.Libraries = RD.Libraries || { __namespace: true };
if (typeof RD.Libraries.CustomActionExecutor == 'undefined') {
    RD.Libraries.CustomActionExecutor = {
        Execute: function Execute(opts) {
            if (opts.async !== true) {
                return this.__ExecuteSync(opts);
            } else {
                var req = new XMLHttpRequest();
                req.open("POST", RD.Libraries.CustomActionExecutor.GetServiceUrl(), !!opts.async);

                try {
                    req.responseType = 'msxml-document';
                } catch (e) {}
                req.setRequestHeader("Accept", "application/xml, text/xml, */*");
                req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
                req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
                req.onreadystatechange = function () {
                    if (req.readyState == 4) {
                        // "complete"
                        if (req.status == 200) {
                            // "OK"
                            RD.Libraries.CustomActionExecutor.ProcessSoapResponse(req.responseXML, opts.successCallback, opts.errorCallback);
                        } else {
                            opts.errorCallback(RD.Libraries.CustomActionExecutor.ProcessSoapError(req.responseXML));
                        }
                    }
                };
                req.send(opts.requestXml);
            }
        },
        __ExecuteSync: function __ExecuteSync(opts) {
            var req = new XMLHttpRequest();
            req.open("POST", RD.Libraries.CustomActionExecutor.GetServiceUrl(), !!opts.async);

            try {
                req.responseType = 'msxml-document';
            } catch (e) {}
            req.setRequestHeader("Accept", "application/xml, text/xml, */*");
            req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
            req.send(opts.requestXml);
            if (req.status == 200 && req.responseXML != null) {
                return RD.Libraries.CustomActionExecutor.ProcessSoapResponse(req.responseXML);
            } else if (req.responseXML != null) {
                return RD.Libraries.CustomActionExecutor.ProcessSoapError(req.responseXML);
            } else {
                return "Error!";
            }
        },
        GenerateActionXML: function GenerateActionXML(requestName, entityId, entityName, parameters, isCRM2013) {
            // Creating the request XML for calling the Action
            var requestXML = "";
            requestXML += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
            requestXML += "  <s:Body>";
            requestXML += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
            requestXML += "      <request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
            requestXML += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";

            if (entityId != null && entityName != null) {
                requestXML += "          <a:KeyValuePairOfstringanyType>";
                requestXML += "            <b:key>Target</b:key>";
                requestXML += "            <b:value i:type=\"a:EntityReference\">";
                requestXML += "              <a:Id>" + entityId + "</a:Id>";
                requestXML += "              <a:LogicalName>" + entityName + "</a:LogicalName>";
                requestXML += "              <a:Name i:nil=\"true\" />";
                requestXML += "            </b:value>";
                requestXML += "          </a:KeyValuePairOfstringanyType>";
            } else if (isCRM2013 == true) {
                return "A target is required! (for global actions try using the current user id.)";
            }

            for (var param in parameters) {
                requestXML += "          <a:KeyValuePairOfstringanyType>";
                requestXML += "            <b:key>" + parameters[param].key + "</b:key>";

                if (parameters[param].type == "EntityReference") {
                    requestXML += "            <b:value i:type=\"a:EntityReference\">";
                    requestXML += "              <a:Id>" + parameters[param].entityId + "</a:Id>";
                    requestXML += "              <a:LogicalName>" + parameters[param].entityName + "</a:LogicalName>";
                    requestXML += "              <a:Name i:nil=\"true\" />";
                    requestXML += "            </b:value>";
                } else {

                    requestXML += "            <b:value i:type=\"c:" + parameters[param].type + "\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" + parameters[param].value + "</b:value>";
                }

                requestXML += "          </a:KeyValuePairOfstringanyType>";
            }

            requestXML += "        </a:Parameters>";
            requestXML += "        <a:RequestId i:nil=\"true\" />";
            requestXML += "        <a:RequestName>" + requestName + "</a:RequestName>";
            requestXML += "      </request>";
            requestXML += "    </Execute>";
            requestXML += "  </s:Body>";
            requestXML += "</s:Envelope>";

            return requestXML;
        },
        ProcessSoapResponse: function ProcessSoapResponse(responseXml, successCallback) {
            try {
                var namespaces = ["xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'", "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'", "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'", "xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'", "xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'"];
                responseXml.setProperty("SelectionNamespaces", namespaces.join(" "));
            } catch (e) {}

            var resultNodes = RD.Libraries.CustomActionExecutor._selectNodes(responseXml, "//a:Results/a:KeyValuePairOfstringanyType");
            if (typeof successCallback !== "undefined") {
                successCallback(RD.Libraries.CustomActionExecutor.ObjectifyNodes(resultNodes));
            } else {
                return RD.Libraries.CustomActionExecutor.ObjectifyNodes(resultNodes);
            }
        },
        ProcessSoapError: function ProcessSoapError(responseXml) {
            try {
                var namespaces = ["xmlns:s='http://schemas.xmlsoap.org/soap/envelope/'", "xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts'", "xmlns:i='http://www.w3.org/2001/XMLSchema-instance'", "xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'", "xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'"];
                responseXml.setProperty("SelectionNamespaces", namespaces.join(" "));
            } catch (e) {}

            var errorNode = RD.Libraries.CustomActionExecutor._selectSingleNode(responseXml, "//s:Fault/faultstring");
            return new Error(RD.Libraries.CustomActionExecutor._getNodeText(errorNode));
        },
        ObjectifyNodes: function ObjectifyNodes(nodes) {
            var result = {};

            for (var i = 0; i < nodes.length; i++) {
                var fieldName = RD.Libraries.CustomActionExecutor._getNodeText(nodes[i].firstChild);
                var fieldValue = nodes[i].childNodes[1];
                result[fieldName] = RD.Libraries.CustomActionExecutor.ObjectifyNode(fieldValue);
            }

            return result;
        },
        ObjectifyNode: function ObjectifyNode(node) {
            if (node.attributes != null) {
                if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").nodeValue == "true") {
                    return null;
                }

                var nodeTypeName = node.attributes.getNamedItem("i:type") == null ? "c:string" : node.attributes.getNamedItem("i:type").nodeValue;

                switch (nodeTypeName) {
                    case "a:EntityReference":
                        return RD.Libraries.CustomActionExecutor.ObjectifyEntityReference(node);
                    /*
                    return {
                    id: RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[0]),
                    entityType: RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[1])
                    };
                    */
                    case "a:Entity":
                        return RD.Libraries.CustomActionExecutor.ObjectifyRecord(node);
                    case "a:EntityCollection":
                        return RD.Libraries.CustomActionExecutor.ObjectifyCollection(node.firstChild);
                    case "c:dateTime":
                        return RD.Libraries.CustomActionExecutor.ParseIsoDate(RD.Libraries.CustomActionExecutor._getNodeText(node));
                    case "c:guid":
                    case "c:string":
                        return RD.Libraries.CustomActionExecutor._getNodeText(node);
                    case "c:int":
                        return parseInt(RD.Libraries.CustomActionExecutor._getNodeText(node));
                    case "a:OptionSetValue":
                        return parseInt(RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[0]));
                    case "c:boolean":
                        return RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[0]) == "true";
                    case "c:double":
                    case "c:decimal":
                    case "a:Money":
                        return parseFloat(RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[0]));
                    default:
                        return null;
                }
            }

            return null;
        },
        ObjectifyEntityReference: function ObjectifyEntityReference(node) {
            var entityRef = { id: '', entityType: '' };
            for (var i = 0; i < node.childNodes.length; i++) {
                switch (node.childNodes[i].tagName) {
                    case "a:Id":
                        entityRef.id = RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[i]);
                        break;
                    case "a:LogicalName":
                        entityRef.entityType = RD.Libraries.CustomActionExecutor._getNodeText(node.childNodes[i]);
                        break;
                    default:
                        break;
                }
                if (entityRef.id && entityRef.entityType) break;
            }
            return entityRef;
        },
        ObjectifyCollection: function ObjectifyCollection(node) {
            var result = [];

            for (var i = 0; i < node.childNodes.length; i++) {
                result.push(RD.Libraries.CustomActionExecutor.ObjectifyRecord(node.childNodes[i]));
            }

            return result;
        },
        ObjectifyRecord: function ObjectifyRecord(node) {
            var result = {};

            result.logicalName = node.childNodes[4].text !== undefined ? node.childNodes[4].text : node.childNodes[4].textContent;
            result.id = node.childNodes[3].text !== undefined ? node.childNodes[3].text : node.childNodes[3].textContent;

            result.attributes = RD.Libraries.CustomActionExecutor.ObjectifyNodes(node.childNodes[0].childNodes);
            result.formattedValues = RD.Libraries.CustomActionExecutor.ObjectifyNodes(node.childNodes[2].childNodes);

            return result;
        },
        ParseIsoDate: function ParseIsoDate(s) {
            if (s == null || !s.match(RD.Libraries.CustomActionExecutor.isoDateExpression)) return null;

            var dateParts = RD.Libraries.CustomActionExecutor.isoDateExpression.exec(s);
            return new Date(Date.UTC(parseInt(dateParts[1], 10), parseInt(dateParts[2], 10) - 1, parseInt(dateParts[3], 10), parseInt(dateParts[4], 10) - (dateParts[8] == "" || dateParts[8] == "Z" ? 0 : parseInt(dateParts[8])), parseInt(dateParts[5], 10), parseInt(dateParts[6], 10)));
        },
        GetServiceUrl: function GetServiceUrl() {
            var context = null;

            if (typeof GetGlobalContext == 'function') {
                context = GetGlobalContext();
            } else if (typeof Xrm != 'undefined') {
                context = Xrm.Page.context;
            }

            return context.getClientUrl() + "/XRMServices/2011/Organization.svc/web";
        },
        _selectNodes: function _selectNodes(node, xPathExpression) {
            if (typeof node.selectNodes != "undefined") {
                return node.selectNodes(xPathExpression);
            } else {
                var output = [];
                var xPathResults = node.evaluate(xPathExpression, node, RD.Libraries.CustomActionExecutor._NSResolver, XPathResult.ANY_TYPE, null);
                var result = xPathResults.iterateNext();
                while (result) {
                    output.push(result);
                    result = xPathResults.iterateNext();
                }
                return output;
            }
        },
        _selectSingleNode: function _selectSingleNode(node, xpathExpr) {
            if (typeof node.selectSingleNode != "undefined") {
                return node.selectSingleNode(xpathExpr);
            } else {
                var xpe = new XPathEvaluator();
                var xPathNode = xpe.evaluate(xpathExpr, node, RD.Libraries.CustomActionExecutor._NSResolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                return xPathNode != null ? xPathNode.singleNodeValue : null;
            }
        },
        _getNodeText: function _getNodeText(node) {
            if (typeof node.text != "undefined") {
                return node.text;
            } else {
                return node.textContent;
            }
        },
        _isNodeNull: function _isNodeNull(node) {
            if (node == null) {
                return true;
            }

            if (node.attributes.getNamedItem("i:nil") != null && node.attributes.getNamedItem("i:nil").value == "true") {
                return true;
            }
            return false;
        },
        _getNodeName: function _getNodeName(node) {
            if (typeof node.baseName != "undefined") {
                return node.baseName;
            } else {
                return node.localName;
            }
        },
        _NSResolver: function _NSResolver(prefix) {
            var ns = {
                "s": "http://schemas.xmlsoap.org/soap/envelope/",
                "a": "http://schemas.microsoft.com/xrm/2011/Contracts",
                "i": "http://www.w3.org/2001/XMLSchema-instance",
                "b": "http://schemas.microsoft.com/crm/2011/Contracts",
                "c": "http://schemas.datacontract.org/2004/07/System.Collections.Generic"
            };
            return ns[prefix] || null;
        },
        isoDateExpression: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.?(\d*)?(Z|[+-]\d{2}?(:\d{2})?)?$/,
        __namespace: true
    };
}

