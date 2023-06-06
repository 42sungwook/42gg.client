import { NextRouter, useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { loginState } from 'utils/recoil/login';
import { firstVisitedState } from 'utils/recoil/modal';
import Cookies from 'js-cookie';

type useLoginCheckReturn = [boolean, boolean, boolean];

const useLoginCheck = (): useLoginCheckReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useRecoilState<boolean>(loginState);
  const [firstVisited, setFirestVisited] =
    useRecoilState<boolean>(firstVisitedState);

  const router: NextRouter = useRouter();
  // const presentPath: string = router.asPath;
  // const token: string = presentPath.split('?token=')[1]; // 토근을 refresh token으로 받아 삭제가능

  useEffect(() => {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      setFirestVisited(true);
      router.replace('/');
      setLoggedIn(true); // api 요청을 보내서 로그인 상태인지 확인
    }
    setIsLoading(false);
  }, []);

  return [isLoading, loggedIn, firstVisited];
};

export default useLoginCheck;
