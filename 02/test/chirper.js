const Chirper = artifacts.require("Chirper");
const ChirperPaymaster = artifacts.require("ChirperPaymaster");

var nonce = 0;

const nextMsg = () => `Hello, world ${nonce++}`

contract("Chirper", async accounts => {
	it("Should emit a Message in response to a chirp", async () => {
		// For the Kovan network. In this case the value doesn't matter
		var chirper = await Chirper.new('0x6453D37248Ab2C16eBd1A8f782a2CBC65860E60B')
		var message;
		var events;

		// Run the test multiple times
		for(var i=0; i<2; i++) {
			// Check chirp
			message = nextMsg();
			await chirper.chirp(message)
			events = await chirper.getPastEvents()
			assert.equal(events[0].returnValues["_message"], message,
				"Wrong message (chirp)")
			assert.equal(events[0].returnValues["_sender"], accounts[0],
				"Wrong sender (chirp)")

			// Check freeChirp (without GSN)
			message = nextMsg();
			await chirper.freeChirp(message)
			events = await chirper.getPastEvents()
			assert.equal(events[0].returnValues["_message"], message,
				"Wrong message (freeChirp)")
			assert.equal(events[0].returnValues["_sender"], accounts[0],
				"Wrong sender (freeChirp)")
		} // for(var i=0...)

	})   // it should emit the message in an event for chirp and freeChirp
		// (freeChirp called normally, not with GSN) 
})   // contract("Chirper"...)

