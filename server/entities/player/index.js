//@ts-check

import Joi from "joi";

import { buildMakePlayer } from "./player";

const makePlayer = buildMakePlayer({ Joi });

export default makePlayer;