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
    pokemonValue.party5.value
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

      resolve(data);
    });
  });
};
