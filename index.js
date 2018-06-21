const MAM = require('./lib/mam.client.js')
const IOTA = require('iota.lib.js')
const iotaClient = new IOTA({
    host: 'http://node01.iotatoken.nl:14265',
    port: 14265
})

// Initialise MAM State
let mamState = MAM.init(iotaClient);

// ROOT
let root = MAM.getRoot(mamState);

// Publish to tangle
// Create MAM Payload - STRING OF TRYTES
const publish = async packet => {
	console.log("Publishing into MAM. Message:", "'" + packet + "'");
	
	const trytes = iotaClient.utils.toTrytes(packet)
    const message = MAM.create(mamState, trytes)
    mamState = message.state
    console.log('Root: ', message.root)
    console.log('Address: ', message.address)

    // Attach the payload.
    await MAM.attach(message.payload, message.address)
}

const logData = data => console.log("Reading from MAM... Message:", "'" + iotaClient.utils.fromTrytes(data) + "'")

const listen = async listenRoot => {
    resp = await MAM.fetch(listenRoot, 'public', null, logData)
}

/************** MAIN *****************/
const execute = function() {
    // Publish
	setTimeout(function() {
		publish("Hello world");
	}, 5000);
};

var args = process.argv.slice(2);

if(args[0] == "execute") {
	console.log("Executing with root", root);
	execute();
} else {
	console.log("Listening on root", args[1]);
	listen(args[1]);
}