"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const nbt = require("nbt");
exports.getPlayerUUIDsAsync = () => __awaiter(this, void 0, void 0, function* () {
    return new Promise(resolve => {
        const filePath = path.resolve(process.cwd(), 'usernamecache.json');
        const raw = fs.readFileSync(filePath, { encoding: 'utf8' });
        const players = JSON.parse(raw);
        resolve(players);
    });
});
exports.getPlayerDataAsync = (uuid) => __awaiter(this, void 0, void 0, function* () {
    const playerData = readNbtFile(uuid, 'playerdata', 'dat');
    return playerData;
});
exports.getPlayerPokemonAsync = (uuid) => __awaiter(this, void 0, void 0, function* () {
    const pokemon = yield readNbtFile(uuid, 'pokemon', 'pk');
    const pokemonValue = pokemon.value;
    const pokemonArray = [
        pokemonValue.party0.value,
        pokemonValue.party1.value,
        pokemonValue.party2.value,
        pokemonValue.party3.value,
        pokemonValue.party4.value,
        pokemonValue.party5.value,
    ];
    return pokemonArray;
});
exports.getPlayerStatsAsync = (uuid) => __awaiter(this, void 0, void 0, function* () {
    return new Promise(resolve => {
        const filePath = path.resolve(process.cwd(), 'stats', `${uuid}.json`);
        const raw = fs.readFileSync(filePath, { encoding: 'utf8' });
        const playerStats = JSON.parse(raw);
        resolve(playerStats);
    });
});
const readNbtFile = (uuid, folder, fileExtension) => {
    return new Promise((resolve, reject) => {
        const filePath = path.resolve(process.cwd(), folder, `${uuid}.${fileExtension}`);
        const fileData = fs.readFileSync(filePath);
        nbt.parse(fileData, (err, data) => {
            if (err) {
                reject(err);
            }
            data = toCamel(data).value;
            console.log(data);
            data = stripValue(data);
        });
    });
};
const nbtDataFormatter = (data) => {
    return Object.assign({}, ...Object.keys(data).map(key => ({ [toCamel(key)]: toCamel(data[key]) })));
};
const stripValue = data => {
    if (data instanceof Array) {
        return data.map(item => {
            if (typeof item === 'object') {
                item = stripValue(item);
            }
            return item;
        });
    }
    else {
        return Object.assign({}, ...Object.keys(data).map(key => ({
            [key]: typeof data[key].value === 'object' ? stripValue(data[key].value) : data[key].value,
        })));
    }
};
const fixKey = (key) => {
    const split = key.split('');
    split[0] = split[0].toLowerCase();
    return split.join('').toString();
};
function toCamel(o) {
    let newO, origKey, newKey, value;
    if (o instanceof Array) {
        return o.map(value => {
            if (typeof value === 'object') {
                value = toCamel(value);
            }
            return value;
        });
    }
    else {
        newO = {};
        for (origKey in o) {
            if (o.hasOwnProperty(origKey)) {
                newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                value = o[origKey];
                if (value instanceof Array || (value !== null && value.constructor === Object)) {
                    value = toCamel(value);
                }
                newO[newKey] = value;
            }
        }
    }
    return newO;
}
//# sourceMappingURL=index.js.map