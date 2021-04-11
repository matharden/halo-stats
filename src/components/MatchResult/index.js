import React, { useState } from 'react';
import cn from 'classnames';
import { maxBy, sortBy } from 'lodash';
import { useParams } from 'react-router-dom';

import Medal from 'components/Medal';
import { getMedalCount, getWeaponById } from 'lookups';
import styles from './MatchResult.module.css';


const MatchResult = ({ result }) => {
  const [more, setMore] = useState([]);
  const { player: gamertag } = useParams();

  const calcKda = p => {
    const num = p.TotalKills - p.TotalDeaths + p.TotalAssists / 3;
    return Math.round(num * 10) / 10;
  };

  const calcAccuracy = i => {
    const a = parseFloat(i.TotalShotsLanded / i.TotalShotsFired * 100).toFixed(1);
    return isNaN(a) ? 'n/a' : a;
  };

  const calcDamage = p => (
    parseInt(p.TotalMeleeDamage + p.TotalShoulderBashDamage + p.TotalWeaponDamage)
  );

  const calcTotalDamage = p => (
    parseInt(
      p.TotalGrenadeDamage +
      p.TotalGroundPoundDamage +
      p.TotalMeleeDamage +
      p.TotalShoulderBashDamage +
      p.TotalWeaponDamage
    )
  );

  const calcPerfectKills = p => (
    getMedalCount(p.MedalAwards, 'Perfect Kill')
  );

  const isBestAssists = (playerStats, p) => (
    maxBy(playerStats, 'TotalAssists').Player.Gamertag.toLowerCase() === p.Player.Gamertag.toLowerCase()
  );

  const isCurrentGamer = p => (
    p.Player.Gamertag.toLowerCase() === gamertag.toLowerCase()
  );

  const toggleMore = id => (
    setMore(more => more.includes(id)
        ? more.filter(i => i !== id) // remove id
        : [ ...more, id ]
    )
  );

  const rowStyles = (player, row) => {
    return cn(row % 2 === 0 ? styles.rowOdd : styles.rowEven, {
      [styles.dnf]: player.DNF,
      [styles.redTeam]: player.TeamId === 0,
      [styles.blueTeam]: player.TeamId === 1,
      [styles.currentGamer]: isCurrentGamer(player),
    });
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {/* <th>Spartan</th> */}
          <th>Score</th>
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
          <th title="Total Damage">TDam</th>
        </tr>
      </thead>
      <tbody>
        {sortBy(result.PlayerStats, 'Rank').map((player, i) => (
          <React.Fragment key={i}>
            <tr className={rowStyles(player, i)}>
              <th colSpan="4" onClick={() => toggleMore(i)}>
                {player.Player.Gamertag}
              </th>
              <th colSpan="3" className={styles.colDark} />
              <th colSpan="5" className={styles.colDarker} />
            </tr>
            <tr onClick={() => toggleMore(i)} className={rowStyles(player, i)}>
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
              <td className={styles.colDarker}>{calcTotalDamage(player)}</td>
            </tr>
            {more.includes(i) && <><tr className={rowStyles(player, i)}>
              <td colSpan="12" className={styles.colDark}>
                {player.MedalAwards.map((medal, key) => (
                  <span key={key} className={styles.award}>
                    <Medal id={medal.MedalId}
                      anchor={player.Player.Gamertag} small />
                    <span className={styles.awardCount}>{medal.Count}</span>
                  </span>
                ))}
              </td>
            </tr><tr className={rowStyles(player, i)}>
              <td colSpan="12" className={styles.colDark}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Damage</th>
                      <th>Kill</th>
                      <th>Headshots</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortBy(player.WeaponStats, 'TotalDamageDealt').reverse().map(stats => {
                      const weapon = getWeaponById(stats.WeaponId.StockId);
                      if (weapon && stats.TotalDamageDealt) {
                        return (
                          <tr key={stats.WeaponId.StockId}>
                            <td className={styles.title}>{weapon.name.toLowerCase()}</td>
                            <td>{parseInt(stats.TotalDamageDealt)}</td>
                            <td>{stats.TotalKills}</td>
                            <td>{stats.TotalHeadshots}</td>
                            <td>{calcAccuracy(stats)}</td>
                          </tr>
                        )
                      } else {
                        return null;
                      }
                    })}
                  </tbody>
                </table>
              </td>
            </tr></>}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )
};

export default MatchResult;
