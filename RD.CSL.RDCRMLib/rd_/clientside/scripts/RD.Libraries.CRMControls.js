"use strict";

var RD = window.RD || { __namespace: true };
RD.Libraries = RD.Libraries || { __namespace: true };
/**
 * @description Contains custom controls to mimic CRM form in HTML file
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 * Realdolmen clientside library on GitHub: https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary
 */
RD.Libraries.CustomControls = RD.Libraries.CustomControls || { __namespace: true };

(function () {
	this.fieldPlaceholder = "--", this.Initialize = function () {
		if (typeof $ === "undefined") {
			RD.Helpers.Log("jQuery is required for the CRM Custom controls to work.");
			return;
		}
		//set the width for the label columns
		$("label").parent().addClass("labelcol");
		if (typeof $.datepicker === "undefined") {
			RD.Helpers.Log("jQuery UI datepicker widget is not available.");
		} else {
			//initialize jQuery Datepicker
			$('.datetime').datepicker({
				inline: true,
				nextText: '&rarr;',
				prevText: '&larr;',
				showOtherMonths: true,
				dateFormat: 'dd/mm/yy',
				dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
				showOn: "button",
				buttonImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAVCAYAAADb2McgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAADeSURBVEhL7ZZRCoMwEEQ3vVL6o7TXiWdKrlPwKzmT3Q1L2BK1RoMo5EFwnORj2FFRTQhcnAdfL00LWYtbhMxeHPV0rPYxecOqHllI546FNKZ+SKCQEmstq2O6JuXPZAighwGCUnGRJm8r/btn9cuSTxTVHTCMwX2HlWqtZ721umWQ8TOyWvYTcZ6CtSo9Hfc+P4Me7Ul/ie7VpTV3P8fpn6CiCTKn1i3ZGjAS5ynIqmSS5mrlIo/YUrdkrWJJed04rWAtaCyAFmny9vB3gswtPuZZyCvS/oJq0ULWAeALRYQdLZ4CEX0AAAAASUVORK5CYII=",
				buttonImageOnly: true
			});
			var clickedElement = null;
			$(".ui-datepicker-trigger").mousedown(function () {
				//set the clicked element to the image
				clickedElement = $(this);
				//keep the image visible (firefox)
				$(this).css("visibility", "visible");
			});
			$('.datetime').blur(function (event) {
				if (clickedElement != null && $(this).next()[0] == clickedElement[0]) {
					//if the image is clicked refocus on the field so the image stays visible
					//stop the blur event
					event.preventDefault();

					$(this).focus();
					//reset the clickedelement
					clickedElement = null;
				} else {
					//remove the @runtime style from the image
					$(this).next().removeAttr("style");
				}
			});
			$(".datetime").parent().addClass("relativePosition");
		}
		/*
  * URL Fields (website, tel, email)
  **************************************/
		$("a[data-inlineEdit] span").click(function (event) {
			//get the url from the span innerHTML
			var url = $(this).text();
			//if the value is equal to the placeholder cancel the window open
			if (url == RD.Libraries.CustomControls.fieldPlaceholder) return;
			//fallback incase initial value does not contain a valid prefix
			var datatype = $(this).parent().attr("data-type");
			if (datatype == "url") {
				if (url.indexOf("http://") != 0 && url.indexOf("https://") != 0) url = "http://" + url;
				//open the url in a new window
				window.open(url, '_blank');
			} else if (datatype == "tel") {
				if (url.indexOf("tel:") != 0) url = "tel:" + url;
				window.location.href = url;
			} else if (datatype == "email") {
				if (url.indexOf("mailto:") != 0) url = "mailto:" + url;
				window.location.href = url;
			} else if (datatype == "lookup") {
				//get the id from the hidden input
				var id = $(this).prev().val();
				//get the entity name
				var entityname = $(this).parent().attr("data-entity");
				if (typeof Xrm !== "undefined") {
					//open the entity form
					var windowOptions = {
						openInNewWindow: true
					};
					Xrm.Utility.openEntityForm(entityname, id, null, windowOptions);
				}
			}
			//prevent event from bubling up event tree, this way the input will not be shown
			event.stopPropagation();
		});
		$("a[data-inlineEdit='true']").click(function () {
			//get the link element that was clicked on
			var element = $(this);
			//get the span element inside the clicked link element
			var valueElement = $(this).children("span");
			var readonly = $(this).attr("readonly");
			if (typeof readonly !== "undefined") return;
			//hide the link element
			element.hide();
			//create an input element after the link element
			var type = typeof element.attr("data-type") == "undefined" ? "url" : element.attr("data-type");
			var replacement = element.next();
			//get the input element object
			replacement.css("z-index", 150);
			//set the value of the input element to the link span element text (empty if it equals the placeholder)
			replacement.val(valueElement.text() == RD.Libraries.CustomControls.fieldPlaceholder ? "" : valueElement.text());
			//place the cursor focus in the new input element
			replacement.focus();
			//attach an event when the input element loses focus
			replacement.blur(function () {
				//remove the input element from the DOM
				$(this).remove();
				var value = $(this).val();
				if (value == "") {
					//value is empty, replace by placeholder string
					value = RD.Libraries.CustomControls.fieldPlaceholder;
				} else if (type == "url" && value.indexOf("http://") != 0 && value.indexOf("https://") != 0) {
					//automaticaly prepend http:// if no http or https prefix is found
					value = "http://" + value;
				}
				//set the changed value in the link span element
				valueElement.text(value);
				//show the link element containing the (changed) value
				element.show();
			});
		});
		$("select").parent().addClass("relativePosition");
		$(".selectValue").click(function (event) {
			//$(this).hide();
			var value = $(this);
			var select = value.next("select");
			select.show();
			select.focus();
			select.change(function (event) {
				var text = $(this).children("option:selected").first().text();
				if (text == "") text = RD.CustomControls.fieldPlaceholder;
				value.text(text);
				select.hide();
			});
			select.blur(function () {
				select.hide();
			});
		});
		//add the lookup icon to the DOM
		$(".lookupicon").remove();
		$("a[data-type='lookup']").after('<img class="lookupicon" src="data:image/gif;base64,R0lGODlhFAAVAEAAACH5BAEAABAALAAAAAAUABUAhwAAAAAAMwAAZgAAmQAAzAAA/wArAAArMwArZgArmQArzAAr/wBVAABVMwBVZgBVmQBVzABV/wCAAACAMwCAZgCAmQCAzACA/wCqAACqMwCqZgCqmQCqzACq/wDVAADVMwDVZgDVmQDVzADV/wD/AAD/MwD/ZgD/mQD/zAD//zMAADMAMzMAZjMAmTMAzDMA/zMrADMrMzMrZjMrmTMrzDMr/zNVADNVMzNVZjNVmTNVzDNV/zOAADOAMzOAZjOAmTOAzDOA/zOqADOqMzOqZjOqmTOqzDOq/zPVADPVMzPVZjPVmTPVzDPV/zP/ADP/MzP/ZjP/mTP/zDP//2YAAGYAM2YAZmYAmWYAzGYA/2YrAGYrM2YrZmYrmWYrzGYr/2ZVAGZVM2ZVZmZVmWZVzGZV/2aAAGaAM2aAZmaAmWaAzGaA/2aqAGaqM2aqZmaqmWaqzGaq/2bVAGbVM2bVZmbVmWbVzGbV/2b/AGb/M2b/Zmb/mWb/zGb//5kAAJkAM5kAZpkAmZkAzJkA/5krAJkrM5krZpkrmZkrzJkr/5lVAJlVM5lVZplVmZlVzJlV/5mAAJmAM5mAZpmAmZmAzJmA/5mqAJmqM5mqZpmqmZmqzJmq/5nVAJnVM5nVZpnVmZnVzJnV/5n/AJn/M5n/Zpn/mZn/zJn//8wAAMwAM8wAZswAmcwAzMwA/8wrAMwrM8wrZswrmcwrzMwr/8xVAMxVM8xVZsxVmcxVzMxV/8yAAMyAM8yAZsyAmcyAzMyA/8yqAMyqM8yqZsyqmcyqzMyq/8zVAMzVM8zVZszVmczVzMzV/8z/AMz/M8z/Zsz/mcz/zMz///8AAP8AM/8AZv8Amf8AzP8A//8rAP8rM/8rZv8rmf8rzP8r//9VAP9VM/9VZv9Vmf9VzP9V//+AAP+AM/+AZv+Amf+AzP+A//+qAP+qM/+qZv+qmf+qzP+q///VAP/VM//VZv/Vmf/VzP/V////AP//M///Zv//mf//zP///wAAAAAAAAAAAAAAAAhuAPcJHEiwoMGDCBMqXMhQoTJimYg13KcMjRgxFsUoYzhJDDFoFC1uTEjsxkiByjAqzCTGIEuFFg0S05jwZUE3LUmKyURwJs+EKTESU8YSzUmDKdFkvDgJJMKgP6Epc5rQ4s+JAiVi3cq1q9eEAQEAOw=="/>');
		//make the parent relative so the lookup can be postitioned correctly
		$("a[data-type='lookup']").parent().addClass("relativePosition");
		//on hover the field hover style should be shown
		$(".lookupicon").hover(function () {
			$(this).prev().addClass("hover");
		}).mouseleave(function () {
			//remove the hover style from the field
			$(this).prev().removeClass("hover");
		}).click(function () {
			//get the hidden input field
			var input = $(this).prev().children("input:hidden");
			//get the link element
			var lookupControl = $(this).prev();
			//get the span text element
			var spanControl = $(this).prev().children("input:text");
			if (typeof Xrm !== "undefined") {
				var entityTypeCode = $(this).prev().attr("data-typecode");
				var defaultViewId = $(this).prev().attr("data-defaultviewid");
				var disableViewPicker = $(this).prev().attr("data-disableviewpicker");
				var DialogOptions = new Xrm.DialogOptions();
				DialogOptions.width = 800;
				DialogOptions.height = 600;
				var serverurl = Xrm.Page.context.getClientUrl();
				var url = serverurl;
				url += "/_controls/lookup/lookupsingle.aspx?";
				url += "&browse=0";
				url += "&ShowNewButton=0";
				url += "&ShowPropButton=1";
				url += "&DefaultType=" + entityTypeCode;
				url += "&objecttypes=" + entityTypeCode;
				if (defaultViewId) url += "&DefaultViewId=" + defaultViewId;
				if (disableViewPicker) url += "&DisableViewPicker=" + disableViewPicker;
				url += "&AllowFilterOff=0";
				url += "&DisableQuickFind=0";
				Xrm.Internal.openDialog(url, DialogOptions, null, null, function (returnValue) {
					//Callback
					var name = returnValue.items[0].name;
					var id = returnValue.items[0].id;
					//update the text in the span
					spanControl.val(name).change();
					//update the id in the hidden input element.
					input.val(id).change();
				});
			}
		});
		//defer the content check untill everything is loaded to make sure the field is empty
		$("a[data-inlineEdit='true'] span").each(function (index) {
			if ($(this).text() == "") {
				//if the field is empty fill it with the placeholder
				$(this).text(RD.Libraries.CustomControls.fieldPlaceholder);
			}
		});
	};
}).call(RD.Libraries.CustomControls);

