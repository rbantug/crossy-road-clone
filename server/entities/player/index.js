//@ts-check

import Joi from "joi";

import { buildMakePlayer } from "./player.js";

const makePlayer = buildMakePlayer({ Joi });

export default makePlayer;