import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import ETHBalance from "../components/ETHBalance";
import Signature from "../components/Signature";
import TokenBalance from "../components/TokenBalance";
import useEagerConnect from "../hooks/useEagerConnect";

const DAI_TOKEN_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const FORWARDER_ADDRESS = "0xd4D655CF5382bC70b7B6531578E19a21716F443b";
const STATUS_ADDRESS = "0x25D9F82A52e79cE6a9269813A53174224cCC27dc";

function Home() {
  const { account, chainId, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <div>
      <Head>
        <title>Understanding MetaTx</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <Link href="/">Understanding MetaTx</Link>

          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>
      <main>
        {isConnected && (
          <section>
            <ETHBalance />

            <Signature address={FORWARDER_ADDRESS} contractAddress={STATUS_ADDRESS} />
          </section>
        )}
      </main>
      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
