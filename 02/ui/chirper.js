const conf = {
	chirper:     '0x705b5cE44bf6b48f3802037F0dB5677E12c8a253',
	paymaster:   '0x38489512d064106f5A7AD3d9e13268Aaf777A41c', // TestPaymasterEverythingAccepted
			// our paymaster '0xb0937c9b2e7A9403c3F4ebfF5ab723d4b6c6124c',
	relayhub:    '0x2E0d94754b348D208D64d52d78BcD443aFA9fa52',
	stakemgr:    '0x0ecf783407C5C80D71CFEa37938C0b60BD255FF8',
	gasPrice:  20000000000,   // 20 Gwei
	lookBack:    1000
}



const Gsn = require("@opengsn/gsn/dist/src/relayclient/")
const RelayProvider = Gsn.RelayProvider



const configureGSN = 
	require('@opengsn/gsn/dist/src/relayclient/GSNConfigurator').configureGSN

const ethers = require("ethers")


const gsnConfig = configureGSN({
	relayHubAddress: conf.relayhub,
	paymasterAddress: conf.paymaster,
	stakeManagerAddress: conf.stakemgr,
	gasPriceFactorPercent: 70,
	methodSuffix: '_v4',
	jsonStringifyRequest: true,
	chainId: 42,
	relayLookupWindowBlocks: 1e5
})    // gsnConfig



const origProvider = window.ethereum;
const gsnNormalProvider = new RelayProvider(origProvider, gsnConfig);
const gsnProvider = new ethers.providers.Web3Provider(gsnNormalProvider);
const provider = new ethers.providers.Web3Provider(origProvider);



const chirperAbi = 
[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_forwarder",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "Message",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "forwarder",
          "type": "address"
        }
      ],
      "name": "isTrustedForwarder",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_msg",
          "type": "string"
        }
      ],
      "name": "chirp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_msg",
          "type": "string"
        }
      ],
      "name": "freeChirp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "versionRecipient",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTrustedForwarder",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }];  // chirperAbi



var contract = false




// listenChirps is supposed to be called once, before
// sendMsg is called - so it can do the setup stuff
// itself
const listenChirps = async ($scope) => {
        await window.ethereum.enable()

        contract = await new ethers.Contract(
        	conf.chirper,
                chirperAbi,
	        provider.getSigner())

	gsnContract = await new ethers.Contract(
		conf.chirper,
		chirperAbi,
		gsnProvider.getSigner())

	window.app.contract = contract

        // Read messages from the last lookBack blocks
        provider.resetEventsBlock(provider.blockNumber-conf.lookBack)

        contract.on(
        	contract.filters.Message,    // Changed in ethers 5
                evt => {
                	const eventData = 
				contract.interface.parseLog(evt)
                        $scope.messages.unshift({
                        	message: eventData.args._message,
                                sender: eventData.args._sender,
                                txn: evt.transactionHash
                        })
                        $scope.$apply()    // update the UI
                }
        )    // contract.on ( Message event )
}   // listenChirps



const sendMsg = async msg => {
	await contract.chirp(msg)
}  // sendMsg


const sendFreeMsg = async msg => {
	await gsnContract.freeChirp(msg)
} // sendFreeMsg




window.app = {
	sendMsg: sendMsg,
	sendFreeMsg: sendFreeMsg,
	listenChirps: listenChirps,

	// For debugging
	contract: contract,
	provider: provider,
	chirperAbi: chirperAbi
}
