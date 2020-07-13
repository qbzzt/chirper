pragma solidity ^0.6.2;

// SPDX-License-Identifier: MIT OR Apache-2.0

import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@opengsn/gsn/contracts/interfaces/IKnowForwarderAddress.sol";

contract Chirper is BaseRelayRecipient, IKnowForwarderAddress {

	event Message(address _sender, string _message);

	function chirp(string memory _msg) public {
		emit Message(msg.sender, _msg);
	}

	function freeChirp(string memory _msg) public {
		emit Message(_msgSender(), _msg);
	}




	// GSN definitions

	constructor(address _forwarder) public {
		trustedForwarder = _forwarder;
	}

	function versionRecipient() external virtual view
	override returns (string memory) {
		return "2.0";
	}

	function getTrustedForwarder() public view
	override returns(address) {
		return trustedForwarder;
	}
}
