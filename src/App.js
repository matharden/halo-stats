import React, { useEffect, useState } from 'react';
import { matchResult, playerMatchHistory } from './api';
import { format } from 'date-fns'
import _ from 'lodash';

import Medal from './components/Medal';
import { getMedalCount } from './lookups';
// import maps from './maps'
import './App.css';


// TODO(harden): Replace with real metadata.
const teams = [
  "Red",
  "Blue",
];

const displayDate = date => {
  return format(new Date(date), 'eee dd MMM yyyy h:mmaaa');
};

// const getPlayerEmblem = gamertag => {
//   async function fetchData() {
//     const result = await playerEmblemImage(gamertag);
//     return result;
//   }
//   return fetchData().then(response => response);
// };

function App() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [player] = useState('ithica77');

  useEffect(() => {
    async function fetchData() {
      const gamesSet = await playerMatchHistory(player, page, 1);
      setGames(games => games.concat(gamesSet));
    }
    fetchData();
  }, [page, player]);

  const loadMatch = id => {
    async function fetchData() {
      const result = await matchResult(id);
      // Push the result into the game object.
      setGames(games => games.map(game => {
        const match = game.Id.MatchId;
        if (match === id) {
          return {
            ...game,
            result,
          }
        } else {
          return game;
        }
      }));
    }
    fetchData();
  };

  const winner = game => _.find(game.Teams, {'Rank': 1});

  return (
    <div className="App">
      <h1>Matches: {player}</h1>
      <ol>
        {games.map((game, key) => (
          <li key={key} onClick={() => !game.result && loadMatch(game.Id.MatchId)}>
            {displayDate(game.MatchCompletedDate.ISO8601Date)}
            {/* <div>Map: {maps[game.MapId]}</div> */}
            <div style={{ color: teams[game.Players[0].TeamId] }}>
              {teams[game.Players[0].TeamId]} team:
              {game.Players[0].TeamId === winner(game).Id ? 'Victory 🥇' : 'Defeat 👎'}
            </div>
            <div>{_.sortBy(game.Teams, 'Rank').map((team, key) => (
              <span key={key}
                style={{ color: teams[team.Id] }}
              >{teams[team.Id]}: {team.Score}</span>
            ))}</div>
            {game.result && <MatchResult result={game.result} />}
            <hr />
          </li>
        ))}
      </ol>
      <button onClick={() => setPage(page + 1)}>Load more</button>
    </div>
  );
};

const MatchResult = ({ result }) => {
  const [more, setMore] = useState([]);

  const calcKda = p => {
    const num = p.TotalKills - p.TotalDeaths + p.TotalAssists / 3;
    return Math.round(num * 10) / 10;
  };

  const toggleMore = id => (
    setMore(more => more.includes(id)
        ? more.filter(i => i !== id) // remove id
        : [ ...more, id ]
    )
  );

  return (
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
          <th>Kills</th>
          <th>Deaths</th>
          <th>Assists</th>
          <th>KDA</th>
          <th title="Headshots">🎯</th>
          <th title="Perfect Kills">⭐️</th>
        </tr>
      </thead>
      <tbody>
        {_.sortBy(result.PlayerStats, 'Rank').map((player, key) => (
          <React.Fragment key={key}>
            <tr key={key}
                style={{ color: teams[player.TeamId], cursor: 'pointer' }}
                onClick={() => toggleMore(key)}>
              <td>{player.Player.Gamertag}</td>
              <td>{player.PlayerScore}</td>
              <td>{player.TotalKills}</td>
              <td>{player.TotalDeaths}</td>
              <td>{player.TotalAssists}</td>
              <td>{calcKda(player)}</td>
              <td>{player.TotalHeadshots}</td>
              <td>{getMedalCount(player.MedalAwards, 'Perfect Kill')}</td>
            </tr>
            {more.includes(key) && <tr>
              <td colSpan="8">
                {player.MedalAwards.map((medal, key) => (
                  <span key={key}>
                    <Medal id={medal.MedalId}
                      anchor={player.Player.Gamertag} small /> {medal.Count}
                  </span>
                ))}
              </td>
            </tr>}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
};

export default App;
