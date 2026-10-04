import {createFriendReader} from '@rarefriends/friendsdk/sprites';
// The SDK caches immutable artwork by chain/registry/Friend and retries failures.
// Sharing this reader avoids fetching the same art when changing game screens.
export const friendArt=createFriendReader();
