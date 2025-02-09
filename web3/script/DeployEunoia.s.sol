// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {Script} from "forge-std/Script.sol";
import {Eunoia} from "src/Eunoia.sol";

contract DeployEunoia is Script {
    function run() external {
        vm.startBroadcast();
        Eunoia eunoia = new Eunoia();
        vm.stopBroadcast();
    }
}