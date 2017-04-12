
/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require("express");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require("cfenv");

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + "/public"));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


// Step 1 ==================================
var Ibc1 = require("ibm-blockchain-js");
var ibc = new Ibc1(/*logger*/);             //you can pass a logger such as winston here - optional
var chaincode = {};

// ==================================
// configure ibc-js sdk
// ==================================
var options = 	{
	network:{
		peers:   [
		{
            "discovery_host":"39c3c57244b2494384cc719a33522255-vp0.us.blockchain.ibm.com",
            "discovery_port":30003,
            "api_host":"39c3c57244b2494384cc719a33522255-vp0.us.blockchain.ibm.com",
            "api_port_tls":5003,
            "api_port":5003,
            "event_host":"39c3c57244b2494384cc719a33522255-vp0.us.blockchain.ibm.com",
            "event_port":31003,
            "type":"peer",
            "network_id":"39c3c57244b2494384cc719a33522255",
            "container_id":"e78de85e64e7af03fc3dbc67f6e11e45e63e3ee1a908ae3d17ccc23be267893b",
            "id":"39c3c57244b2494384cc719a33522255-vp0",
            "api_url":"http://39c3c57244b2494384cc719a33522255-vp0.us.blockchain.ibm.com:5003"
         },
         {
            "discovery_host":"39c3c57244b2494384cc719a33522255-vp2.us.blockchain.ibm.com",
            "discovery_port":30003,
            "api_host":"39c3c57244b2494384cc719a33522255-vp2.us.blockchain.ibm.com",
            "api_port_tls":5003,
            "api_port":5003,
            "event_host":"39c3c57244b2494384cc719a33522255-vp2.us.blockchain.ibm.com",
            "event_port":31003,
            "type":"peer",
            "network_id":"39c3c57244b2494384cc719a33522255",
            "container_id":"506e1421b161860c4aef2cccc22fc806019e6e9c639f9e3576537216922f1954",
            "id":"39c3c57244b2494384cc719a33522255-vp2",
            "api_url":"http://39c3c57244b2494384cc719a33522255-vp2.us.blockchain.ibm.com:5003"
         }],
		users:  [
		{
            "enrollId":"admin",
            "enrollSecret":"78c7b80448",
            "affiliation":"group1",
            "username":"admin",
            "secret":"78c7b80448"
         },
         {
            "enrollId":"WebAppAdmin",
            "enrollSecret":"011599709b",
            "affiliation":"group1",
            "username":"WebAppAdmin",
            "secret":"011599709b"
         },
         {
            "enrollId":"user_type1_0",
            "enrollSecret":"71caf6f90d",
            "affiliation":"group1",
            "username":"user_type1_0",
            "secret":"71caf6f90d"
         },
         {
            "enrollId":"user_type1_1",
            "enrollSecret":"a144bfd5d4",
            "affiliation":"group1",
            "username":"user_type1_1",
            "secret":"a144bfd5d4"
         }],
		options: {							//this is optional
			quiet: true, 
			timeout: 60000
		}
	},
	chaincode:{
		zip_url: "https://github.com/bbenjamin11/learn-chaincode/archive/master.zip",
		unzip_dir: "learn-chaincode-master/finished",
		git_url: "https://github.com/bbenjamin11/learn-chaincode/finished",
		
		deployed_name: "61995bc15ecb594a463be3a1b7a1e6565bc5bb60e4dd3d19b81dd14d48a8b81967227e30ca5697b9088b456f6561ada505ab7b47cc23de8d1e45965209ad4bef"
	}
};

console.log("xxxxxxxxxxxxxxxx LOAD xxxxxxxxxxxxxxxxxxxx");
console.log("x            \          /                x");
console.log("x             \        /                 x");
console.log("x              \      /                  x");
console.log("x               \    /                   x");
console.log("x                \__/                    x");
console.log("xxxxxxxxxxxxxxxx ---- xxxxxxxxxxxxxxxxxxxx");
// Step 2 ==================================
ibc.load(options, function(err,chainecode){
	console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
	console.log("icb_load : ");
	if(err)
		console.log("ERRRRRR : ", err);
	else{
		console.log(chainecode);
		
		
		console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
		/*console.log("icb_load 2 : ");
		ibc.chain_stats(function(e, stats){
			console.log("-\-\-\-\-\-\-\-\-\-\ got some stats : ");
			if(e)
				console.log(e);
			else
				console.log(stats);
			
		});
		*/
		ibc.block_stats(function(e, stats){
			console.log("-\-\-\-\-\-\-\-\-\-\ got some stats : ");
			if(e)
				console.log(e);
			else
				console.log(stats);
			
		});
		
		chainecode.query.read(["hello_world"]);
	}
});

// Step 3 ==================================
function cb_ready(cc){								//response has chaincode functions
	console.log("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-");
	console.log("cb_ready : ");

// Step 4 ==================================
	if(cc.details.deployed_name == undefined){				//decide if I need to deploy or not
		console.log("deployment ---> ");
		cc.deploy("init", ["97"], null, function(err){
			cc.query.read(["hello_world"]);
		});
	}
	else{
		console.log("chaincode summary file indicates chaincode has been previously deployed");
		cb_deployed(cc);
	}
}

// Step 5 ==================================
function cb_deployed(cc){
	console.log("sdk has deployed code and waited");
	cc.query.read(["hello_world"]);
}
