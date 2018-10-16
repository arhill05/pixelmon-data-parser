import * as fs from 'fs';
import * as path from 'path';
import * as nbt from 'nbt';

export const getPlayerUUIDsAsync = async () => {
  return new Promise(resolve => {
    const filePath = path.resolve(process.cwd(), 'usernamecache.json');
    const raw = fs.readFileSync(filePath, { encoding: 'utf8' });
    const players = JSON.parse(raw);
    resolve(players);
  });
};

export const getPlayerDataAsync = async (uuid: string) => {
  const playerData = readNbtFile(uuid, 'playerdata', 'dat');
  return playerData;
};

export const getPlayerPokemonAsync = async (uuid: string) => {
  const pokemon: any = await readNbtFile(uuid, 'pokemon', 'pk');
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
};

export const getPlayerStatsAsync = async (uuid: string) => {
  return new Promise(resolve => {
    const filePath = path.resolve(process.cwd(), 'stats', `${uuid}.json`);
    const raw = fs.readFileSync(filePath, { encoding: 'utf8' });
    const playerStats = JSON.parse(raw);
    resolve(playerStats);
  });
};

const readNbtFile = (uuid: string, folder: string, fileExtension: string) => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(process.cwd(), folder, `${uuid}.${fileExtension}`);
    const fileData = fs.readFileSync(filePath);
    nbt.parse(fileData, (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      data = toCamel(data).value;
      console.log(data);
      data = stripValue(data);
    });
  });
};

const nbtDataFormatter = (data: any) => {
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
  } else {
    return Object.assign(
      {},
      ...Object.keys(data).map(key => ({
        [key]: typeof data[key].value === 'object' ? stripValue(data[key].value) : data[key].value,
      })),
    );
  }
};

const fixKey = (key: string): string => {
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
  } else {
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
