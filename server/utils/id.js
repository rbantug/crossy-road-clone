import { nanoid } from "nanoid";

const identity = Object.freeze({
    makeRoomId: () => nanoid(),
    makeLobbyUrl: () => nanoid(7),
    makeGameUrl: () => nanoid(9),
})

export default identity