//@ts-check

import Joi from "joi";

import identity from "../../utils/id.js";
import buildMakeRoom from "./room.js";

const makeRoom = buildMakeRoom({ id: identity, Joi })

export default makeRoom