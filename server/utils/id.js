import { nanoid } from "nanoid";

const identity = Object.freeze({
    makeRoomId: () => nanoid(), // 21 char
    makeLobbyUrl: () => nanoid(7),
    makeGameUrl: () => nanoid(9),
    roomIdIsValid: (id) => id.trim().length === 21
})

export default identity