import { mplTokenMetadata, createV1, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { userKeypair } from "./helpers";
import { createFungible, mintV1 } from "@metaplex-foundation/mpl-token-metadata";
import { base58 } from '@metaplex-foundation/umi/serializers';
//import { mintV1 } from "@metaplex-foundation/mpl-bubblegum";
//import { mintV1 } from "@metaplex-foundation/js";

const main = async () => {
    const umi = createUmi('https://api.devnet.solana.com');

    const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);

    umi.use(keypairIdentity(keypair))
        .use(mplTokenMetadata())

        const metadata = {
            name: "Solana Jekerzz Coin ",
            symbol: "JEKERCOIN",
            uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
        };
        
        const mint = generateSigner(umi);
        async function createMetadataDetails() {
            await createV1(umi, {
                mint,
                authority: umi.identity,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                sellerFeeBasisPoints: percentAmount(0),
                decimals: 9,
                tokenStandard: TokenStandard.Fungible,
            }).sendAndConfirm(umi)
        }

        async function mintToken() {
            await mintV1(umi, {
                mint: mint.publicKey,
                authority: umi.identity,
                amount: 10_000,
                tokenOwner: umi.identity.publicKey,
                tokenStandard: TokenStandard.Fungible,
            }).sendAndConfirm(umi)
        }

        const Result = await createFungible(umi, {
            mint,
            authority: umi.identity,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: percentAmount(0),
            decimals: 9,
        }).sendAndConfirm(umi);
        console.log(base58.deserialize(Result.signature)[0]);
};

main().catch(err => {
    console.error('Unhandled Error:', err);
});