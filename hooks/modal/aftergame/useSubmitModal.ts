import { useSetRecoilState } from 'recoil';
import axios from 'axios';
import { modalState } from 'utils/recoil/modal';
import { errorState } from 'utils/recoil/error';
import { AfterGame, TeamScore } from 'types/scoreTypes';
import { instance } from 'utils/axios';
import { MatchMode } from 'types/mainType';

type rankRequest = {
  gameId: number;
  myTeamId: number;
  myTeamScore: number | '';
  enemyTeamId: number;
  enemyTeamScore: number | '';
};

type normalRequest = {
  gameId: number;
  myTeamId: number;
  enemyTeamId: number;
};

type responseTypes = Record<'SUCCESS' | 'DUPLICATED', string>;

type errorResponse = {
  status: number;
  message: string;
  code: string;
};

const useSubmitModal = (currentGame: AfterGame) => {
  const setError = useSetRecoilState(errorState);
  const setModal = useSetRecoilState(modalState);
  const { gameId, matchTeamsInfo, mode } = currentGame;
  const { myTeam, enemyTeam } = matchTeamsInfo;

  const rankResponse: responseTypes = {
    SUCCESS: '결과 입력이 완료되었습니다.',
    DUPLICATED: '상대가 이미 점수를 입력했습니다.',
  };

  const submitRankHandler = async (result: TeamScore) => {
    try {
      const requestBody: rankRequest = {
        gameId: gameId,
        myTeamId: myTeam.teamId,
        myTeamScore: result.myTeamScore,
        enemyTeamId: enemyTeam.teamId,
        enemyTeamScore: result.enemyTeamScore,
      };
      await instance.post(`/pingpong/games/rank`, requestBody);
      alert(rankResponse['SUCCESS']);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const { code } = e.response.data as unknown as errorResponse;
        if (code == 'GM202' || code == 'GM204') {
          alert(rankResponse['DUPLICATED']);
          location.reload(); // 현재 유저 event 상태 재확인
        }
      } else {
        setError('JH04');
      }
      return;
    }
    openStatChangeModal();
  };

  const submitNormalHandler = async () => {
    const requestBody: normalRequest = {
      gameId: gameId,
      myTeamId: myTeam.teamId,
      enemyTeamId: enemyTeam.teamId,
    };
    try {
      await instance.post(`/pingpong/games/normal`, requestBody);
    } catch (e) {
      setError('KP04');
      return;
    }
    openStatChangeModal();
  };

  const openStatChangeModal = () => {
    setModal({
      modalName: 'FIXED-STAT',
      exp: {
        gameId: gameId,
        mode: mode,
      },
    });
  };

  return {
    submitRankHandler,
    submitNormalHandler,
    openStatChangeModal,
  };
};

export default useSubmitModal;
