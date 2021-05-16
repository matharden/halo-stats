import config from 'config';

const { primary_key } = config;

export const playerMatchHistory = (player, page, count=10) => {
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
  return fetch(url, headers).then(response => response.json()).then(data => (
    data.Results
  )).catch(error => console.log('API fetch error',error));
};

export const matchResult = matchId => {
  const url = `https://www.haloapi.com/stats/h5/arena/matches/${matchId}`;
  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": primary_key,
    }
  };
  return fetch(url, headers)
    .then(response => response.json())
    .then(data => data);
};

// CORS error on this.
export const playerEmblemImage = gamertag => {
  const url = `https://www.haloapi.com/profile/h5/profiles/${gamertag}/emblem`;
  const headers = {
    headers: {
      "Ocp-Apim-Subscription-Key": primary_key,
      // mode: 'no-cors',
      // redirect: 'follow',
      credentials: 'include',
    }
  };
  return fetch(url, headers).then(response => response.json()).then(data => {
    console.log(data);
    return data;
  });
};
