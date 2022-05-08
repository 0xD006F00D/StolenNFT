// SPDX-License-Identifier: MIT
// Based on OpenZeppelin Contracts v4.4.1 (utils/Create2.sol)

pragma solidity ^0.8.0;

/**
 * @dev Helper to make usage of the `CREATE2` EVM opcode easier and safer.
 * `CREATE2` can be used to compute in advance the address where a smart
 * contract will be deployed, which allows for interesting new mechanisms known
 * as 'counterfactual interactions'.
 *
 * See the https://eips.ethereum.org/EIPS/eip-1014#motivation[EIP] for more
 * information.
 */
contract Create2Deployer {
	/**
	 * @dev Deploys a contract using `CREATE2`. The address where the contract
	 * will be deployed can be known in advance via {computeAddress}.
	 *
	 * The bytecode for a contract can be obtained from Solidity with
	 * `type(contractName).creationCode`.
	 *
	 * Requirements:
	 *
	 * - `bytecode` must not be empty.
	 * - `salt` must have not been used for `bytecode` already.
	 */
	function deploy(bytes32 salt, bytes memory code) external returns (address addr) {
		assembly {
			addr := create2(0, add(code, 0x20), mload(code), salt)
			if iszero(extcodesize(addr)) {
				revert(0, 0)
			}
		}
	}
}
