pragma solidity >=0.5.0 <0.7.0;

contract Chirper {

	event Message(address _sender, string _message);

	function chirp(string memory _msg) public {
		emit Message(msg.sender, _msg);
	}

}
