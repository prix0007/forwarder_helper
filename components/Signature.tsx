import React, { useCallback, useState } from "react";

import { SignTypedDataVersion, signTypedData } from "@metamask/eth-sig-util";
import Wallet from "ethereumjs-wallet";
import useForwarderContract from "../hooks/useForwarderContract";
import useETHBalance from "../hooks/useETHBalance";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const wallet = Wallet.generate();

const Signature: React.FC<{ address: string; contractAddress: string }> = ({
  address,
  contractAddress,
}) => {
  const forwarderContract = useForwarderContract(address);

  const { account } = useWeb3React();

  const { data } = useETHBalance(wallet.getAddressString());

  const [request, setRequest] = useState({
    from: account,
    to: contractAddress,
    value: "0",
    gas: "100000",
    data: "",
  });

  const [signature, setSignature] = useState("");

  const handleSign = () => {
    console.log("signing data: ", {
      privateKey: wallet.getPrivateKey(),
      data: {
        types: {
          EIP712Domain,
          ForwardRequest: [
            { name: "from", type: "address" },
            { name: "to", type: "address" },
            { name: "value", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "data", type: "bytes" },
          ],
        },
        domain: {
          name: "Forwarder",
          version: "0.0.1",
          chainId: 80001,
          verifyingContract: address,
        },
        primaryType: "ForwardRequest",
        message: request,
      },
      version: SignTypedDataVersion.V4,
    });
    setSignature(
      signTypedData({
        privateKey: wallet.getPrivateKey(),
        data: {
          types: {
            EIP712Domain,
            ForwardRequest: [
              { name: "from", type: "address" },
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "data", type: "bytes" },
            ],
          },
          domain: {
            name: "Forwarder",
            version: "0.0.1",
            chainId: 80001,
            verifyingContract: address,
          },
          primaryType: "ForwardRequest",
          message: request,
        },
        version: SignTypedDataVersion.V4,
      })
    );
  };

  const sendTx = async () => {
    const provider = new ethers.providers.AlchemyProvider("maticmum");
    const tx = await forwarderContract
      .connect(new ethers.Wallet(wallet.getPrivateKey(), provider))
      .execute(request, signature);
    console.log({ tx });
    const txReceipt = await tx.wait();
    console.log({ txReceipt });
  };

  return (
    <div>
      <h1>Signature Component</h1>
      <p>-------------------------</p>
      <p>ChainId: 80001</p>
      <p>Contract Address: {address}</p>
      <p>
        Your address: {wallet.getAddressString()} | Balance:{" "}
        {ethers.utils.formatEther(data || "0")}
      </p>
      <p>Your private Key address: {wallet.getPrivateKeyString()}</p>

      <p>------------------------==================------------------</p>
      <div style={{ width: "800px" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", width: "80%", margin: "10px 0px" }}>
            <p>From Address: </p>
            <input
              style={{ width: "100%" }}
              type="text"
              value={request.from}
              onChange={(e) => {}}
              disabled
            />
          </div>

          <div style={{ display: "flex", width: "80%", margin: "10px 0px" }}>
            <p>To Address: </p>
            <input
              style={{ width: "100%" }}
              type="text"
              value={request.to}
              onChange={(e) => {
                setRequest({ ...request, to: e.target.value });
              }}
            />
          </div>

          <div style={{ display: "flex", width: "80%", margin: "10px 0px" }}>
            <p>Data: </p>
            <input
              style={{ width: "100%" }}
              type="text"
              onChange={(e) => {
                setRequest({
                  ...request,
                  data: ethers.utils.hexlify(
                    ethers.utils.toUtf8Bytes(e.target.value)
                  ),
                });
              }}
            />
          </div>
          <p>Hex Data Value: {request.data}</p>
        </div>
      </div>
      <p>{JSON.stringify(request)}</p>
      <div>
        <button onClick={handleSign}>Sign with shown Private Key</button>
      </div>
      <div>{signature && <p>Signature: {signature}</p>}</div>
      <div>{signature && <button onClick={sendTx}>Send</button>}</div>
    </div>
  );
};

export default Signature;
