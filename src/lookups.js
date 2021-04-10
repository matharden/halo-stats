import { filter, find } from 'lodash';
import medals from './metadata/medals';
import variants from './metadata/gamevariants';


export const getGameVariant = id => find(variants, {id});

export const getMedalByName = name => find(medals, {name});

export const getMedalById = id => find(medals, {'id': `${id}`});

export const getMedalCount = (awards, name) => {
  const possibleMedals = filter(medals, {name});
  const sum = possibleMedals.reduce((acc, cur) => {
    const award = find(awards, {'MedalId': parseInt(cur.id, 10)});
    return award ? acc + award.Count : acc;
  }, 0);
  return sum;
};

// TODO(harden):
// export const getMapById = (awards, name) => {
//   const possibleMedals = _.filter(medals, {name});
//   const sum = possibleMedals.reduce((acc, cur) => {
//     const award = _.find(awards, {'MedalId': parseInt(cur.id, 10)});
//     return award ? acc + award.Count : acc;
//   }, 0);
//   return sum;
// };
