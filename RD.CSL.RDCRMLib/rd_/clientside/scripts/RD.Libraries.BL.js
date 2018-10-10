/// <reference path="../RD.CSL.js" />
"use strict";
var RD = window.RD || { _namespace: true };
RD.Libraries = RD.Libraries || { _namespace: true };

//getGlobalContext only exist in CRM version >= 9.0
var CRM_Version9 = typeof Xrm !== "undefined" && typeof Xrm.Utility !== "undefined" && typeof Xrm.Utility.getGlobalContext !== "undefined";

/**
 * @description RD.BL contains functionality specific for Belgium
 * BL = Belgium Library
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */

RD.Libraries.BL = RD.Libraries.BL || { _namespace: true };
(function () {
    /**
     * Checks if the VAT code is valid
     * @param {string} countryCode The country code. e.g. "BE"
     * @param {string} vatnumber    The VAT number without punctuation 
     * @returns {boolean} 
     */
    this.ValidateVAT = function (countryCode, numbers) {
        /*
            Voor belgische btw nummers is er volgens mij alleen controle dat:
            -	een btw nummer moet bestaan uit 10 cijfers 
            -	en moet beginnen met een 0.
            -	en controle mod 97
            Bijv. BTWnr. BE0898.458.243
            -	0898458243
            -	8984582 controle getal 43
            -	Rest van 8984582/97 = 54
            -	97 – 54 = 43 = controlegetal
        */
        //BE check uitvoeren				
        var btwnr = numbers;
        if (btwnr.indexOf(".") != -1) {
            btwnr = btwnr.replace(/\./g, "");
        }
        if (btwnr.substring(0, 2).toUpperCase() == countryCode) {
            btwnr = btwnr.substring(2, btwnr.length);
        }
        if (btwnr.length != 10) {
            return RD.Libraries.BL.GetError("BL003");
        } else if (btwnr.substring(0, 1) != 0) {
            //altijd beginnen met 0
            return RD.Libraries.BL.GetError("BL004");
        } else if (97 - btwnr.slice(0, 8) % 97 != btwnr.slice(8, 10)) {
            // Modulus 97 check on last nine digits
            return RD.Libraries.BL.GetError("BL001");
        }
        return true;
    };

    /**
     * Validates the Social security number
     * @param {string} fieldname The fieldname of the attribute containing the Social security number.
     * @param {string} birthdateFieldname The fieldname of the birthdate
     * @returns {boolean} 
     */
    this.ValidateRijksregister = function (fieldname, birthdateFieldname) {
        this.ValidateRijksregister(null, fieldname, birthdateFieldname);
    }

    /**
     * Validates the Social security number
     * @param {object} executionContext The execution context as first parameter (check)
     * @param {string} fieldname The fieldname of the attribute containing the Social security number.
     * @param {string} birthdateFieldname The fieldname of the birthdate
     * @returns {boolean} 
     */
    this.ValidateRijksregister = function (executionContext, fieldname, birthdateFieldname) {
        // switch to new object for CRM version >= 9
        var pageOrFormContext = executionContext == null ? Xrm.Page : executionContext.getFormContext();
        var att = pageOrFormContext.getAttribute(fieldname);                        
        var rgr;
        if (att != null) {
            rgr = att.getValue();
            rgr = rgr.replace(/[^a-zA-Z0-9 ]/g, "");
            if (rgr.length != 11) {
                return RD.Libraries.BL.GetError("BL006");
            } else {
                var valid = false;
                var birthdateField = null;
                var socialsecuritynr = rgr;
                if (birthdateFieldname != null)
                {                    
                    birthdateField = pageOrFormContext.getAttribute(birthdateFieldname);
                }

                if (birthdateField != null && birthdateField.getValue() != null) {
                    var birthdate = birthdateField.getValue();
                    if (birthdate.getFullYear() < 2000) {
                        //	regular check
                        valid = this.SocialSecurityCheckSum(socialsecuritynr);
                    } else {
                        //	Check with 2 prefix
                        //For people born after 2000 the check has to happen with prefix 2.
                        valid = this.SocialSecurityCheckSum("2" + socialsecuritynr);
                    }
                } else {
                    //	regular check
                    valid = this.SocialSecurityCheckSum(socialsecuritynr);
                    if (!valid) {
                        //	Check with 2 prefix
                        valid = this.SocialSecurityCheckSum("2" + socialsecuritynr);
                    }
                }
                if (!valid) {
                    return RD.Libraries.BL.GetError("BL006");
                }
                return true;
            }
        }
    };
    /**
     * Modulo checksum for the social security number
     * @param {string} socialsecuritynr Social security number to perform checksum on
     * @returns {boolean} 
     */
    this.SocialSecurityCheckSum = function (socialsecuritynr) {
        var checknumber = socialsecuritynr.substr(socialsecuritynr.length - 2, socialsecuritynr.length);
        var check = socialsecuritynr.substr(0, socialsecuritynr.length - 2);

        if (97 - check % 97 == checknumber) {
            return true;
        } else {
            return false;
        }
    };
    /**
     * Shows the associated error
     * @param {string} code The errorcode of which to look for the errortext
     * @returns {} 
     */
    this.GetError = function (code) {
        // switch to new object for CRM version >= 9
        var userLcid = null;
        if (!CRM_Version9) {
            userLcid = Xrm.Page.context.getUserLcid();            
        }
        else {
            userLcid = Xrm.Utility.getGlobalContext().userSettings.languageId;
        }           

        var messages = {
            BL001: {
                1031: "UID ist ungültig.",
                1033: "VAT number is invalid.",
                1036: "Numéro de TVA est invalide.",
                1043: "BTW-nummer is ongeldig."
            },
            BL002: {
                1031: "Online UID validierung fehlgeschlagen.",
                1033: "Online VAT number validation failed.",
                1036: "Numéro de TVA de validation en ligne a échoué.",
                1043: "Online BTW-nummer validatie is mislukt."
            },
            BL003: {
                1031: "UID muss Länge von 10 haben.",
                1033: "VAT number must have length 10.",
                1036: "Numéro de TVA doit avoir une longueur de 10.",
                1043: "BTW-nummer moet lengte 10 hebben."
            },
            BL004: {
                1031: "UID muss mit einer 0 beginnen.",
                1033: "VAT number must start with a 0.",
                1036: "Numéro de TVA doit commencer par un 0.",
                1043: "BTW-nummer moet met een 0 beginnen."
            },
            BL005: {
                1031: "Sozialversicherungsnummer muss Länge von 10 haben.",
                1033: "Social Security number must have length 11.",
                1036: "Numéro de Sécurité Sociale doit avoir une longueur de 11.",
                1043: "Rijksregister nummer moet lengte 11 hebben."
            },
            BL006: {
                1031: "Sozialversicherungsnummer ist ungültig.",
                1033: "Invalid social security number.",
                1036: "Numéro de Sécurité Sociale est invalide.",
                1043: "Rijksregister nummer is ongeldig."
            }
        };
        var message = "";
        try {
            message = messages[code];
            message = message[userLcid];
        } catch (e) {
            message = "An Error has occurred, please contact your system administrator";
            code = "BL000";
        }
        return { "ERROR": message, "ERRORCODE": code };
    };
}).call(RD.Libraries.BL);

