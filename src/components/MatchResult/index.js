import React, { useState } from 'react';
import cn from 'classnames';
import _ from 'lodash';

import Medal from 'components/Medal';
import { getMedalCount } from 'lookups';
import styles from './MatchResult.module.css';


const qG = new URLSearchParams(window.location.search).get('g') || '';

const MatchResult = ({ result }) => {
  const [more, setMore] = useState([]);
  const [gamertag] = useState(qG);

  const calcKda = p => {
    const num = p.TotalKills - p.TotalDeaths + p.TotalAssists / 3;
    return Math.round(num * 10) / 10;
  };

  const calcAccuracy = p => (
    parseFloat(p.TotalShotsLanded / p.TotalShotsFired * 100).toFixed(1)
  );

  const calcDamage = p => (
    parseInt(p.TotalMeleeDamage + p.TotalShoulderBashDamage + p.TotalWeaponDamage)
  );

  const calcPerfectKills = p => (
    getMedalCount(p.MedalAwards, 'Perfect Kill')
  );

  const isBestAssists = (playerStats, p) => (
    _.maxBy(playerStats, 'TotalAssists').Player.Gamertag.toLowerCase() === p.Player.Gamertag.toLowerCase()
  );

  const isCurrentGamer = p => (
    p.Player.Gamertag.toLowerCase() === gamertag.toLowerCase()
  )

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
          <th>Spartan/Score</th>
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
              [styles.currentGamer]: isCurrentGamer(player),
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
              [styles.currentGamer]: isCurrentGamer(player),
                })}>
              {/* <td>{player.Player.Gamertag}</td> */}
              <td>{player.PlayerScore}</td>
              <td>{player.TotalKills}</td>
              <td>{player.TotalDeaths}</td>
              <td className={cn({
                [styles.best]: isBestAssists(result.PlayerStats, player),
              })}>{player.TotalAssists}</td>
              <td className={styles.colDark}>{calcKda(player)}</td>
              <td className={styles.colDark}>{calcAccuracy(player)}</td>
              <td className={styles.colDark}>{calcDamage(player)}</td>
              <td className={styles.colDarker}>{player.TotalHeadshots}</td>
              <td className={styles.colDarker}>{calcPerfectKills(player)}</td>
              <td className={styles.colDarker}>{player.TotalGrenadeKills}</td>
              <td className={styles.colDarker}>{parseInt(player.TotalGrenadeDamage)}</td>
            </tr>
            {more.includes(i) && <tr className={cn(
              i % 2 === 0 ? styles.rowEven : styles.rowOdd, {
              [styles.dnf]: player.DNF,
              [styles.redTeam]: player.TeamId === 0,
              [styles.blueTeam]: player.TeamId === 1,
              [styles.currentGamer]: isCurrentGamer(player),
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

export default MatchResult;
