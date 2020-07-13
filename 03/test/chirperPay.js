const ChirperPaymaster = artifacts.require("ChirperPaymaster");


contract("ChirperPaymaster", async accounts => {
	const targetAddr = '0x0000000000000000000000000000000000000000'
	var events
	var paymaster

	console.log(accounts)

        it("Should set owner correctly", async () => {
        	paymaster = await ChirperPaymaster.new()
                events = await paymaster.getPastEvents()
		assert.equal(events[0].returnValues["newOwner"], accounts[0],
				"Owner not set correctly")
	})   // it should set owner correctly

	it("Should set target correctly", async () => {
                await paymaster.setTarget(targetAddr)
                events = await paymaster.getPastEvents()
                assert.equal(events[0].returnValues["_target"], targetAddr,
                                "Target not set correctly")
        })  // it should emit a message when the target is set

})   // contract("ChirperPaymaster"...)


