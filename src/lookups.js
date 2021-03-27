import _ from 'lodash';
import medals from './metadata/medals';


export const getMedalByName = name => _.find(medals, {'name': name});

export const getMedalById = id => _.find(medals, {'id': `${id}`});

export const getMedalCount = (awards, medal) => {
  const award = _.find(awards, {'MedalId': _.find(medals, {'name': medal})});
  return award ? award.Count : 0;
};
