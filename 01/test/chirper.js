const Chirper = artifacts.require("Chirper");

var nonce = 0;

const nextMsg = () => `Hello, world ${nonce++}`

contract("Chirper", async accounts => {
	it("Should emit a Message in response to a chirp", async () => {
		var chirper = await Chirper.new()
		const message = nextMsg()
		await chirper.chirp(message)
		const events = await chirper.getPastEvents()
		assert.equal(events[0].returnValues["_message"], message,
			"Wrong message")
		assert.equal(events[0].returnValues["_sender"], accounts[0],
			"Wrong sender")
	})   // it should emit an event in response to a message
})
