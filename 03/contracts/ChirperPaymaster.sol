pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

// SPDX-License-Identifier: MIT OR Apache-2.0

import "@opengsn/gsn/contracts/BasePaymaster.sol";



contract ChirperPaymaster is BasePaymaster {
	address public ourTarget;   // The target contract we are willing to pay for

	// allow the owner to set ourTarget
	event TargetSet(address _target);
	function setTarget(address target) external onlyOwner {
		ourTarget = target;
		emit TargetSet(target);
	}

	// GNSTypes.RelayRequest is defined in GNSTypes.sol.
	// The relevant fields for us are:
	// target - the address of the target contract
	// encodedFunction - the called function's name and parameters
	// relayData.senderAddress - the sender's address
	function acceptRelayedCall(
		GSNTypes.RelayRequest calldata relayRequest,
		bytes calldata signature,
		bytes calldata approvalData,
		uint256 maxPossibleGas
	) external view override returns (bytes memory) {
		(signature, approvalData, maxPossibleGas);  // avoid a warning

		require(relayRequest.target == ourTarget);

		return "X";
	}

	function preRelayedCall(
		bytes calldata context
	) external relayHubOnly override returns(bytes32) {
		(context);  // avoid a warning
		return bytes32(0);
	}

	event GasUsed(uint);

	function postRelayedCall(
		bytes calldata context,
		bool success,
		bytes32 preRetVal,
		uint256 gasUse,
		GSNTypes.GasData calldata gasData
	) external relayHubOnly override {
		(context, success, preRetVal, gasUse, gasData);
		emit GasUsed(gasUse);
	}

        function versionPaymaster() external virtual view 
	override returns (string memory) {
                return "1.0";
        }

} 



