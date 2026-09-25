import {createPublicClient,http,parseAbi} from "viem";
import {GENERATION_SPRITE_MANIFEST} from "@rarefriends/friendsdk/sprites";
// Fixed read-only NFT metadata. Identity/ownership remains enforced by the SDK host.
export const PROFILE_ABI=parseAbi([
 "function generation(uint256 tokenId) view returns (uint8)",
 "function activationManager() view returns (address)",
 "function positions(address collection,uint256 tokenId) view returns (uint8 tier,uint256 weight)",
]);
export async function readFriendProfile(friendId:bigint){
 const client=createPublicClient({transport:http(GENERATION_SPRITE_MANIFEST.rpcUrl,{timeout:12000,retryCount:1})});
 if(await client.getChainId()!==GENERATION_SPRITE_MANIFEST.chainId)throw new Error("Réseau incorrect.");
 const blockNumber=await client.getBlockNumber({cacheTime:0}),address=GENERATION_SPRITE_MANIFEST.generations;
 const [generation,manager]=await Promise.all([
  client.readContract({address,abi:PROFILE_ABI,functionName:"generation",args:[friendId],blockNumber}),
  client.readContract({address,abi:PROFILE_ABI,functionName:"activationManager",blockNumber}),
 ]);
 const [tier]=await client.readContract({address:manager,abi:PROFILE_ABI,functionName:"positions",args:[address,friendId],blockNumber});
 if(!Number.isInteger(generation)||generation<1||generation>6||!Number.isInteger(tier)||tier<0||tier>4)throw new Error("GEN ou tier officiel non pris en charge.");
 return {friendId,generation,tier,blockNumber};
}
