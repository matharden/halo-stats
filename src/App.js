import React, { useEffect, useState } from 'react';
import { matchResult, playerMatchHistory } from './api';
import { format } from 'date-fns'
import _ from 'lodash';

import MatchResult from 'components/MatchResult';
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
                  <dt>#</dt>
                  <dd>{key + 1}</dd>
                </div>
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

export default App;
