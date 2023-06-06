import { useCallback, useEffect, useState } from 'react';
import PageNation from 'components/Pagination';
import { IGames, IGameLog } from 'types/admin/gameLogTypes';
import { instanceInManage } from 'utils/axios';
import { getFormattedDateToString } from 'utils/handleTime';
import AdminSearchBar from '../common/AdminSearchBar';
import styles from 'styles/admin/games/GamesTable.module.scss';
import ScoreModifyForm from './ScoreModifyForm';

export default function GamesTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [intraId, setIntraId] = useState<string>('');
  const [gameInfo, setGameInfo] = useState<IGames>({
    gameLog: [],
    totalPage: 1,
    // currentPage: 1,
  });

  const initSearch = useCallback((intraId?: string) => {
    setIntraId(intraId || '');
    setCurrentPage(1);
  }, []);

  const getAllGames = useCallback(async () => {
    try {
      const res = await instanceInManage.get(
        `/games?season=0&page=${currentPage}&size=5`
      );

      setGameInfo({
        gameLog: res.data.gameLogList.map((game: IGameLog) => {
          const { year, month, date, hour, min } = getFormattedDateToString(
            new Date(game.startAt)
          );
          return {
            ...game,
            startAt: `${year}-${month}-${date} ${hour}:${min}`,
          };
        }),
        totalPage: res.data.totalPage,
        // currentPage: res.data.currentPage,
      });
    } catch (e) {
      console.error('MS07');
    }
  }, [currentPage]);

  const getUserGames = useCallback(async () => {
    try {
      const res = await instanceInManage.get(
        `/games/users?intraId=${intraId}&page=${currentPage}&size=5`
      );
      setGameInfo({
        gameLog: res.data.gameLogList.map((game: IGameLog) => {
          const { year, month, date, hour, min } = getFormattedDateToString(
            new Date(game.startAt)
          );
          return {
            ...game,
            startAt: `${year}-${month}-${date} ${hour}:${min}`,
          };
        }),
        totalPage: res.data.totalPage,
        // currentPage: res.data.currentPage,
      });
    } catch (e) {
      console.error('MS08');
    }
  }, [intraId, currentPage]);

  useEffect(() => {
    intraId ? getUserGames() : getAllGames();
  }, [intraId, getAllGames, getUserGames]);

  return (
    <>
      <div className={styles.gamesWrap}>
        <div className={styles.header}>
          <div className={styles.title}>게임 관리</div>
          <AdminSearchBar initSearch={initSearch} />
        </div>
        <div className={styles.tableWrap}>
          {gameInfo.gameLog.map((game: IGameLog) => {
            const { team1, team2 } = game;
            return (
              <div className={styles.tableRow} key={game.gameId}>
                <div className={styles.gameId}>{game.gameId}</div>
                <div className={styles.gameInfo}>
                  <div>
                    시작 날짜: {game.startAt.toLocaleString().split(' ')[0]}
                  </div>
                  <div>게임 모드: {game.mode}</div>
                  <div>슬롯 시간: {game.slotTime}분</div>
                  <div>
                    {game.mode === 'RANK' && (
                      <ScoreModifyForm
                        gameId={game.gameId}
                        team1={team1}
                        team2={team2}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.tableTeam}>
                  <div>team1</div>
                  <div
                    className={
                      game.mode === 'NORMAL'
                        ? styles.normal
                        : game.team1.score === 2
                        ? styles.win
                        : styles.lose
                    }
                  >
                    {game.team1.intraId1} {game.team1.intraId2}
                  </div>
                </div>
                <div className={styles.tableTeam}>
                  <div>team2</div>
                  <div
                    className={
                      game.mode === 'NORMAL'
                        ? styles.normal
                        : game.team2.score === 2
                        ? styles.win
                        : styles.lose
                    }
                  >
                    {game.team2.intraId1} {game.team2.intraId2}
                  </div>
                </div>
                <button
                  type='submit'
                  form='Score-Modify-Form'
                  disabled={game.mode === 'NORMAL'}
                >
                  수정
                </button>
              </div>
            );
          })}
        </div>
        <div className={styles.pageNationContainer}>
          <PageNation
            curPage={currentPage}
            totalPages={gameInfo.totalPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
}
