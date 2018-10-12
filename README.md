<html>
<head>
</head>
<body>
<h1>Realdolmen ClientSide library</h1>
<p>The Realdolmen ClientSide library is a common library for usage with Microsoft Dynamics CRM and Dynamics 365. v2.0 Tested on: </br>
<ul>
	<li>CRM 7.0 (2015 On-premise)</li>
	<li>CRM 7.1 (2015 Online)</li>
	<li>CRM 8.0 (2016 On-premise)</li>
	<li>CRM 8.1 (2016 Online)</li>
	<li>CRM 8.2 (Dynamics 365 Online)</li>
	<li>CRM 9.0 (Dynamics 365 Online) BETA</li>
</ul>
</p>
<h2>Realdolmen.ClientSide</h2>
<p>
All files are accessible via the 
<a href="https://github.com/Realdolmen365/Realdolmen.ClientSideLibrary">Realdolmen ClientSide library on GitHub.</a>
</p>
<h2>Usage</h2>
<p>
Download the files and add the complete "rd_" folder and all it's content to a new solution in your Dynamics 365 environment.
The library can be used by including the "rd_/clientside/RD.CSL.js" as the first script on the form. After which the "RD" namespace will be available in your scripts. This can be done by simply dragging the RD.CSL.js file in your new js file in Visual Studio. Visual Studio will auto generate a reference tag.</br>

The scripts contains JSDoc comment tags. So when adding the RD.CSL.js library as a reference when scripting a new JS file you are provided with information about code elements.
</br>
<p>
There is a testscript to check all the functionalities contained in the Realdolmen ClientSide library. To execute the test:
<ul>
	<li>Add RD.CSL.JS and RD.CSL.Test.js libraries onload in a form in CRM</li>
	<li>Execute "RD.Test.TestRDCSL" function onload</li>
</ul>
You will get an overview of all passed and failed tests in the console and a pass rate in percentages.
</p>
</p>
<h2>Documentation &amp; Samples</h2>
<p>
Documentation is available as a configuration.html file that can be added as the config in your CRM solution.</br>
The configuration.html also links to a samples.html file that contains information and code examples about the available functionality.
</p>
<h2>License</h2>
The Realdolmen ClientSide library is provided under the <a href="https://opensource.org/licenses/MIT">MIT license</a>.
<p>
website: <a href="http://www.realdolmen.com/">www.realdolmen.com</a>	
</p>
</body>
</html>
