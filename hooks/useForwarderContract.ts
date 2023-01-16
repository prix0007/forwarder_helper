import FORWARDER_ABI from "../contracts/Forwarder.json";
import type { Forwarder } from "../contracts/types";
import useContract from "./useContract";

export default function useForwarderContract(forwarderAddress: string) {
  return useContract<Forwarder>(forwarderAddress, FORWARDER_ABI);
}
