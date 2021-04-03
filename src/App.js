import React, { useEffect, useState } from 'react';
import { matchResult, playerMatchHistory } from './api';
import { format } from 'date-fns'
import _ from 'lodash';
import cn from 'classnames';

import Medal from './components/Medal';
import { getMedalCount } from './lookups';
// import maps from './maps'
import styles from './App.module.css';


const displayDate = date => {
  return format(new Date(date), 'eee dd MMM HH:mm');
};

// const getPlayerEmblem = gamertag => {
//   async function fetchData() {
//     const result = await playerEmblemImage(gamertag);
//     return result;
//   }
//   return fetchData().then(response => response);
// };

const qG = new URLSearchParams(window.location.search).get('g') || '';

function App() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [player, setPlayer] = useState(qG);
  const [gamertag, setGamertag] = useState();

  useEffect(() => {
    async function fetchData() {
      const gamesSet = await playerMatchHistory(player, page);
      setGames(games => games.concat(gamesSet));
    }
    player && fetchData();
  }, [page, player]);

  const toggleMatch = id => {
    async function fetchData(matchId) {
      const result = await matchResult(matchId);
      // Push the result into the game object.
      setGames(games => games.map(game => {
        const match = game.Id.MatchId;
        if (match === id) {
          return {
            ...game,
            result,
            showResult: true,
          }
        } else {
          return game;
        }
      }));
    };
    // Show/hide.
    const flipResult = (show=false) => {
      setGames(games => games.map(game => {
        if (game.Id.MatchId === id) {
          return {
            ...game,
            showResult: show,
          }
        } else {
          return game;
        }
      }));
    };
    // Check.
    const mygame = _.find(games, {'Id':{'MatchId':id}});
    if (mygame.showResult) {
      flipResult(false);
    } else {
      if (mygame.result) {
        flipResult(true);
      } else {
        fetchData(id);
      }
    }
  };

  const winner = game => _.find(game.Teams, {'Rank': 1});

  return (
    <div className="App">
      {!player && <div>
        <form action="/">
          <input
            type="text"
            name="g"
            className={styles.input}
            placeholder="Gamertag"
            value={gamertag}
            onChange={e => setGamertag(e.target.value)}
          />
          <input type="submit" value="Enter"
            onSubmit={() => setPlayer(gamertag)}
          />
        </form>
      </div>}
      {player && !games.length && <p>No matches found.</p>}
      {!!games.length && <>
        <ol className={styles.match}>
          {games.map((game, key) => (
            <li key={game.Id.MatchId}>
              {/* <div>Map: {maps[game.MapId]}</div> */}
              <dl className={styles.summary} onClick={() => toggleMatch(game.Id.MatchId)}>
                <div>
                  <dt>Date</dt>
                  <dd>{displayDate(game.MatchCompletedDate.ISO8601Date)}</dd>
                </div>
                <div>
                  <dt>Result</dt>
                  <dd>{game.Players[0].TeamId === winner(game).Id ? 'Victory' : 'Defeat'}</dd>
                </div>
                <div>
                  <dt>Score</dt>
                  <dd>{_.sortBy(game.Teams, 'Rank').map(team => team.Score).join(' - ')}</dd>
                </div>
                {/* <div>
                  <dt>Game</dt>
                  <dd>{getGameVariant(game.GameVariant.ResourceId)?.name}</dd>
                </div> */}
              </dl>
              {game.showResult && <MatchResult result={game.result} />}
              <hr />
            </li>
          ))}
        </ol>
        <div className={styles.more}>
          <button onClick={() => setPage(page + 1)}>
            Load more
          </button>
        </div>
      </>}
    </div>
  );
};

const MatchResult = ({ result }) => {
  const [more, setMore] = useState([]);
  const [gamertag] = useState(qG);

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
    <table className={styles.table}>
      <thead>
        <tr>
          {/* <th>Spartan</th> */}
          <th>S</th>
          <th>K</th>
          <th>D</th>
          <th>A</th>
          <th>KDA</th>
          <th>Acc</th>
          <th>Dam</th>
          <th title="Headshots">🎯</th>
          <th title="Perfect Kills">⭐️</th>
          <th title="Grenade Kills">🍍</th>
          <th title="Grenade Damage">🍍Dam</th>
        </tr>
      </thead>
      <tbody>
        {_.sortBy(result.PlayerStats, 'Rank').map((player, i) => (
          <React.Fragment key={i}>
            <tr className={cn(i % 2 === 0 ? styles.rowEven : styles.rowOdd, {
              [styles.dnf]: player.DNF,
              [styles.redTeam]: player.TeamId === 0,
              [styles.blueTeam]: player.TeamId === 1,
              [styles.currentGamer]:
                  player.Player.Gamertag.toLowerCase() === gamertag.toLowerCase(),
            })}>
              <th colSpan="4" onClick={() => toggleMore(i)}>
                {player.Player.Gamertag}
              </th>
              <th colSpan="3" className={styles.colDark} />
              <th colSpan="4" className={styles.colDarker} />
            </tr>
            <tr onClick={() => toggleMore(i)}
                className={cn(i % 2 === 0 ? styles.rowEven : styles.rowOdd, {
              [styles.dnf]: player.DNF,
              [styles.redTeam]: player.TeamId === 0,
              [styles.blueTeam]: player.TeamId === 1,
              [styles.currentGamer]:
                  player.Player.Gamertag.toLowerCase() === gamertag.toLowerCase(),
                })}>
              {/* <td>{player.Player.Gamertag}</td> */}
              <td>{player.PlayerScore}</td>
              <td>{player.TotalKills}</td>
              <td>{player.TotalDeaths}</td>
              <td>{player.TotalAssists}</td>
              <td className={styles.colDark}>{calcKda(player)}</td>
              <td className={styles.colDark}>{parseFloat(player.TotalShotsLanded / player.TotalShotsFired * 100).toFixed(1)}</td>
              <td className={styles.colDark}>{parseInt(player.TotalMeleeDamage + player.TotalShoulderBashDamage + player.TotalWeaponDamage)}</td>
              <td className={styles.colDarker}>{player.TotalHeadshots}</td>
              <td className={styles.colDarker}>{getMedalCount(player.MedalAwards, 'Perfect Kill')}</td>
              <td className={styles.colDarker}>{player.TotalGrenadeKills}</td>
              <td className={styles.colDarker}>{parseInt(player.TotalGrenadeDamage)}</td>
            </tr>
            {more.includes(i) && <tr className={cn(
              i % 2 === 0 ? styles.rowEven : styles.rowOdd, {
              [styles.dnf]: player.DNF,
              [styles.redTeam]: player.TeamId === 0,
              [styles.blueTeam]: player.TeamId === 1,
              [styles.currentGamer]:
                  player.Player.Gamertag.toLowerCase() === gamertag.toLowerCase(),
                })}>
              <td colSpan="11" className={styles.colDark}>
                {player.MedalAwards.map((medal, key) => (
                  <span key={key} className={styles.award}>
                    <Medal id={medal.MedalId}
                      anchor={player.Player.Gamertag} small />
                    <span className={styles.awardCount}>{medal.Count}</span>
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
