import config from './config';

const { primary_key } = config;

export const getMatches = (player, page, count=10) => {
  const start = page * count;
  const params = new URLSearchParams({
    count,
    'include-times': true,
    modes: 'arena',
    start,
  }).toString();
  const url = `https://www.haloapi.com/stats/h5/players/${player}/matches?${params}`;
  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": primary_key,
    }
  };
  return fetch(url, headers).then(response => response.json()).then(data => {
    console.log(data);
    return data.Results;
  });
};
