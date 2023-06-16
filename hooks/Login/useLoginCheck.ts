import { NextRouter, useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { loginState } from 'utils/recoil/login';
import { firstVisitedState } from 'utils/recoil/modal';
import Cookies from 'js-cookie';

type useLoginCheckReturn = [boolean, boolean, boolean];

const baseURL = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}`;

const useLoginCheck = (): useLoginCheckReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useRecoilState<boolean>(loginState);
  const [firstVisited, setFirstVisited] =
    useRecoilState<boolean>(firstVisitedState);

  const router: NextRouter = useRouter();

  useEffect(() => {
    const refreshToken = Cookies.get('refreshToken');
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/pingpong/users/accesstoken?refreshToken=${refreshToken}`
        );
        if (response?.data.access_token) {
          setFirstVisited(true);
          router.replace('/');
          setLoggedIn(true);
        }
      } catch (error) {
        //error
      }
      setIsLoading(false);
    };

    if (refreshToken) {
      fetchAccessToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return [isLoading, loggedIn, firstVisited];
};

export default useLoginCheck;
