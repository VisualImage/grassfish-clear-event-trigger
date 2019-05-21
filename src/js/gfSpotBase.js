/**
 * Grassfish JavaScript SpotBase (Grassifsh 2015)
 */

/**
 * Global callback function for grassfish players, do not use this function directly in your code!
 * Use registerXxxCallback functions
 * @param {null}
 * @return {null}
 */
var grassfishGlobalPlayerToJSCallbackFunction = null;
var GFSpotBase = function()
{
	var that = function GFSpotBase()
	{
		//registerCallBackFunctions
	};

	//PROPERTIES
	that.version = "1.0.3.0";
	that.delimiter = "|+_-*|";
	that.logLevels = {ERROR: "Error", WARNING: "Warning", INFO: "Info", DEBUG: "Debug"};
	that.messages = {};

	//SENDING CONSTANTS
	that.messages.GET_ALL_SPOTS = "GetAllSpots"
	that.messages.HEARTBEAT = "Heartbeat";
	that.messages.LOG = "Log";
	that.messages.PLAY_SPOT = "PlaySpot";
	that.messages.READFILE = "ReadFile";
	that.messages.READY_FOR_SPOT_TO_SPOT_MESSAGE = "ReadyForSpotToSpotMessage";
	that.messages.SELECT = "Select";
	that.messages.SEND_EMAIL_STANDARD = "SendEmailStandard";
	that.messages.SEND_EVENT_COMMAND = "SendEventCommand";
	that.messages.SEND_SPOT_TO_SPOT_MESSAGE = "SendSpotToSpotMessage";
	that.messages.QUIT = "Quit";
	that.messages.WRITEFILE = "WriteFile";

	//RECEIVING CONSTANTS
	that.messages.ON_GET_ALL_SPOTS = "OnGetAllSpots";
	that.messages.ON_READFILE = "OnReadFile";
	that.messages.PLAY_COMMAND = "PlayCommand";
	that.messages.RECEIVE_SPOT_TO_SPOT_MESSAGE = "ReceiveSpotToSpotMessage";

	//JAVASCRIPT TO PLAYER

	that.sendMessageToPlayer = function()
	{
		try
		{
			if(arguments[0] && arguments[0] != "")
			{

				var data = "";
				if(arguments.length > 1)
				{
					for(var i = 1; i < arguments.length; i++)
					{
						data += ((data != "") ? that.delimiter : "") + arguments[i];
					}
				}
				
				if(parent && parent.CallFromJavaScript != null)
				{
					parent.CallFromJavaScript(arguments[0], data);
				}
				else if(window.external != null)
				{
					if(typeof(window.external.CallFromJavaScript) != 'undefined')
						window.external.CallFromJavaScript(arguments[0], data);
					else if(typeof(window.external.callFromJavaScript) != 'undefined')
						window.external.callFromJavaScript(arguments[0], data);
					else
						that.spotBaseLog("Player has no valid listener function, communication does not work!");
				}
			}
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	//GLOBAL CALLBACK

	that.grassfishPlayerToJSCallbackFunction = function()
	{
		if(arguments && arguments[0] && arguments[0] != "")
		{
			var data;
			if(arguments[1] && arguments[1] != "")
			{
				data = arguments[1].split(that.delimiter);
			}
			switch(arguments[0])
			{
				case that.messages.ON_GET_ALL_SPOTS:
					that.receiveOnGetAllSpots(data[0]);
					break;
				case that.messages.ON_READFILE:
					that.receiveOnReadFile(data[0], data[1]);
					break;
				case that.messages.PLAY_COMMAND:
					that.receivePlayCommand(data[0]);
					break;
				case that.messages.RECEIVE_SPOT_TO_SPOT_MESSAGE:
					that.receiveSpotToSpotMessage(data[0], data[1]);
					break;
				default:
					break;
			}
		}
	};

	if(!grassfishGlobalPlayerToJSCallbackFunction)
		grassfishGlobalPlayerToJSCallbackFunction = that.grassfishPlayerToJSCallbackFunction;


	//CALLBACK METHODS - OVERRIDE TO USE!!!

	/**
	 * Callback to get all spots from the player
	 * Override this method like this:
	 *
	 * GFSpotBase.receiveOnGetAllSpots = function(data)
	 * {
	 * 		//do something
	 * };
	 *
	 * @param data list of current spots
	 *
	 * */
	that.receiveOnGetAllSpots = function(data)
	{
	};
	
	/**
	 * Callback to readFile
	 * Override this method like this:
	 *
	 * GFSpotBase.receiveOnReadFile = function(fileName, data)
	 * {
	 * 		//do something
	 * };
	 *
	 * @param fileName name of the file
	 * @param data content of the file
	 *
	 * */
	that.receiveOnReadFile = function(fileName, data)
	{
	};

	/**
	 * Callback to the play event of the player, if preloading is supported and enabled
	 * If the player supports preloading the spots receives a URL parameter "&usePreload=true".
	 * If the URL parameter usePreload is not set or if it is false, start your animations immediately onload.
	 *
	 * Override this method like this:
	 *
	 * GFSpotBase.receivePlayCommand = function(value)
	 * {
	 * 		if(value == "Play")
	 * 			resetAndStartYourAnimations();
	 * };
	 *
	 * @param value The value can be "Play" or "Stop", "Play" is used when the spot is actually displayed after it has been preloaded
	 *
	 */
	that.receivePlayCommand = function(value)
	{

	};

	/**
	 * Callback to a spot to spot message
	 * Override this method like this:
	 *
	 * GFSpotBase.receiveSpotToSpotMessage = function(uniqueID, value)
	 * {
	 * 		//do something
	 * };
	 *
	 * Important: Don't forget to call GFSpotBase.readyForSpotToSpotMessage(); otherwise you will not receive any messages!
	 *
	 * @param uniqueID a unique key to distinguish the message from other messages
	 * @param value a string containing some data (e.g. xml or json)
	 *
	 * */
	that.receiveSpotToSpotMessage = function(uniqueID, value)
	{
	};

	/**
	 * override this to integrate error messages within the spotBase into your own logging system.
	 *
	 * GFSpotBase.spotBaseLog = function(msg)
	 * {
	 * 		yourOwnLogging(msg);
	 * };
	 *
	 * @param msg is the log message
	 */
	that.spotBaseLog = function(msg)
	{

	};


	//HELPER METHODS

	that.findUrlParam = function(paramName)
	{
		try
		{
			var query_string = {};
			var query = window.location.search.substring(1);
			var vars = query.split("&");
			for(var i = 0; i < vars.length; i++)
			{
				var pair = vars[i].split("=");
				if(pair[0] == paramName)
				{
					return pair[1];
				}
			}
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}

		return null;
	};

	that.getVersion = function()
	{
		return that.version;
	};

	that.getHasPreload = function()
	{
		var preloadEnabled = that.findUrlParam("usePreload");
		if(preloadEnabled && preloadEnabled == "true")
			return true;
		else
			return false;
	};

	//WRAPPER METHODS
/**
	 * Get the current spots from the device
	 *
	 * */
	that.getAllSpots = function()
	{
		try 
		{
			that.sendMessageToPlayer(that.messages.GET_ALL_SPOTS);
		} catch(error) 
		{
			if (error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	}
	
	/**
	 * Jump to a spot in the current playlist
	 *
	 * @param spotName the name of the spot to jump to. If a spot occurs more than once the jump is to the next match in the playlist
	 *
	 * */
	that.jumpToSpot = function(spotName)
	{
		try
		{
			if(!spotName || spotName == "")
				return;

			that.sendMessageToPlayer(that.messages.PLAY_SPOT, spotName);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Read a file on the player previously written with writeFile().
	 * You must override GFSpotBase.receiveOnReadFile first to receive data!
	 *
	 * @param directory subdirectory where the file is stored.
	 * @param fileName name of the file
	 *
	 * */
	that.readFile = function(directory, fileName)
	{
		try
		{
			if(!fileName || fileName == "")
				return;

			if(!directory)
				directory = "";

			that.sendMessageToPlayer(that.messages.READFILE, directory, fileName);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};
	/**
	 * If you want to receive spot to spot messages, you must first tell the player with this method
	 * */
	that.readyForSpotToSpotMessage = function()
	{
		try
		{
			that.sendMessageToPlayer(that.messages.READY_FOR_SPOT_TO_SPOT_MESSAGE);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Sends a heartbeat to the player in order to verify that the spot is alive.
	 * The first time the heartbeat is sent it activates the mechanism on the player for this spot.
	 * It is recommended that you send the heartbeat 2 or 3 times more often then the interval to ignore small lags
	 *
	 * @param interval specifies the time in milliseconds the heartbeat needs to be resent by the html-app
	 *
	 */
	that.sendHeartbeat = function(interval)
	{
		try
		{
			if(!interval || interval == 0)
				return;

			that.sendMessageToPlayer(that.messages.HEARTBEAT, interval);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Sends a email from a player to a configured email address
	 *
	 * @param headerText A header text (subject) must be defined.
	 * @param email If no email is defined, the email will be sent to a preconfigured email address
	 * @param bodyTextLines is an Array where you can put in n Strings. Each String in that array will be put in a separate line in the email
	 */
	that.sendEmail = function(headerText, email, bodyTextLines)
	{
		if(!headerText || headerText == "")
			return;
		try
		{
			var delimiter = "_|_";

			var emailText = headerText;
			if(email && email.length > 0)
			{
				emailText += delimiter + email;
			}
			if(bodyTextLines)
			{
				for(var i = 0; i < bodyTextLines.length; i++)
				{
					emailText += delimiter + bodyTextLines[i].toString();
				}
			}

			that.sendMessageToPlayer(that.messages.SEND_EMAIL_STANDARD, emailText);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Trigger a event on the player
	 *
	 * eventTypes:
	 * Start
	 * StartLoop
	 * StopLoop
	 *
	 * @param eventType is either a start event (runs once) or a loop event (doesn't stop until StopLoop is called)
	 * @param value is the name (String) of the event
	 */
	that.sendEventCommand = function(eventType, value)
	{
		try
		{
			if(!eventType || eventType == "")
				return;
			that.sendMessageToPlayer(that.messages.SEND_EVENT_COMMAND, eventType, value);

		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Broadcast a message from one spot to another (or multiple).
	 * The other spots may either be on the same player in different Splitscreens or on other players.
	 *
	 * @param ip the IP of the target player. default is 127.0.0.1
	 * @param uniqueID a unique key to distinguish the message from other messages
	 * @param value a string containing some data (e.g. xml or json)
	 *
	 * */
	that.sendSpotToSpotMessage = function(ip, uniqueID, value)
	{
		try
		{
			that.sendMessageToPlayer(that.messages.SEND_SPOT_TO_SPOT_MESSAGE, ip, uniqueID, value);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Write a file on the player to store data for later or to share data between spots
	 *
	 * @param directory subdirectory where the file is stored.
	 * @param fileName name of the file
	 * @param data content of the file
	 *
	 * */
	that.writeFile = function(directory, fileName, data)
	{
		try
		{
			if(!fileName || fileName == "")
				return;

			if(!directory)
				directory = "";

			that.sendMessageToPlayer(that.messages.WRITEFILE, directory, fileName, data);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Writes the value in the statistic csv on the player. This file will be regularly transferred to the server.
	 *
	 * @param value is the string you want to write in the statistic file. If the value is null or empty nothing will happen. If you want to enter multiple values you may separate them with a semicolon: ;
	 *
	 * */
	that.writeStatistic = function(value)
	{
		try
		{
			if(!value || value == "")
				return;

			that.sendMessageToPlayer(that.messages.SELECT, value);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * End the spot
	 * */
	that.quit = function()
	{
		try
		{
			that.sendMessageToPlayer(that.messages.QUIT);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	/**
	 * Send a log line to the player
	 *
	 * @param msg is the message to send to the player
	 * @param level is an optional parameter which may be one of the following values: Error, Warning, Info, Debug
	 *
	 * */
	that.sendLog = function(msg, severity)
	{
		try
		{
			if(!msg || msg == "")
				return;

			var sendWithSeverity = that.logLevels.DEBUG;

			if(severity && (severity == that.logLevels.ERROR || severity == that.logLevels.WARNING || severity == that.logLevels.INFO ||
				severity == that.logLevels.DEBUG))
				sendWithSeverity = severity;

			that.sendMessageToPlayer(that.messages.LOG, msg, sendWithSeverity);
			that.spotBaseLog(msg + " " + severity);
		}
		catch(error)
		{
			if(error)
				that.spotBaseLog("SpotBase Error: " + error.message);
		}
	};

	return that;
}();