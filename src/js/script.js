var uniqueName = "Trigger Event Html";
var version = "1.1";

function init()
{
	GFSpotBase.sendLog(uniqueName + ": " + version + " started...");
	var bgColor = GFSpotBase.findUrlParam("bgColor");
	if(bgColor != null && bgColor != "")
	{
		if(bgColor.indexOf("x") > -1)
			document.body.style.background = "#" + bgColor.substring(bgColor.indexOf("x")+1);
		else if(bgColor.indexOf("#") == -1)
			document.body.style.background = "#" + Number(bgColor).toString(16);
		else
			document.body.style.background = bgColor;
	}

	GFSpotBase.receivePlayCommand = function(value)
	{
		GFSpotBase.sendLog("Got Play command: " + value);
		if(value == "Play")
			start();
	};

	try
	{
		if(GFSpotBase.getHasPreload())
			GFSpotBase.sendLog("Preloading enabled, waiting for PlaySpot command...");
		else
		{
			GFSpotBase.sendLog("Preloading disabled, starting immediately...");
			start();
		}
	}
	catch (error)
	{
		if(error)
			GFSpotBase.sendLog("Error " + error.message);
	}
}

function start()
{
	var eventName = GFSpotBase.findUrlParam("eventName");
	var eventTypeNr = GFSpotBase.findUrlParam("eventType");

	GFSpotBase.sendLog("TriggerEvent: " + eventName + " (" + eventTypeNr + ")");
	if(eventName != null && eventName != "")
		GFSpotBase.sendEventCommand(eventTypeNr, decodeURIComponent(eventName));

	if(GFSpotBase.findUrlParam("quitAfter") == "true")
		GFSpotBase.quit();
}