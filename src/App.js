import { useEffect, useState } from 'react';
import { getMatches } from './api';


function App() {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(0);
  const [player] = useState('ithica77');

  useEffect(() => {
    async function fetchData() {
      const gamesSet = await getMatches(player, page);
      setGames(games => games.concat(gamesSet));
    }
    fetchData();
  }, [page, player]);

  return (
    <div className="App">
      <h1>Matches</h1>
      <ol>
        {games.map((game, i) => (
          <li key={i}>{game.MatchCompletedDate.ISO8601Date}</li>
        ))}
      </ol>
      <button onClick={() => setPage(page + 1)}>Load more</button>
    </div>
  );
}

export default App;
