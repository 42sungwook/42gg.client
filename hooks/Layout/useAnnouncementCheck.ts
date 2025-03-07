import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { Modal } from 'types/modalTypes';
import { modalState } from 'utils/recoil/modal';
import useAxiosGet from 'hooks/useAxiosGet';

const useAnnouncementCheck = (presentPath: string) => {
  const setModal = useSetRecoilState<Modal>(modalState);
  const announcementTime: string | null =
    localStorage.getItem('announcementTime');

  const getAnnouncementHandler = useAxiosGet<any>({
    url: '/pingpong/announcement',
    setState: (data) => {
      data.content !== '' &&
        setModal({
          modalName: 'EVENT-ANNOUNCEMENT',
          announcement: data,
        });
    },
    err: 'RJ01',
    type: 'setError',
  });

  useEffect(() => {
    if (presentPath === '/') {
      if (
        !announcementTime ||
        Date.parse(announcementTime) < Date.parse(new Date().toString())
      )
        getAnnouncementHandler();
    } else {
      setModal({ modalName: null });
    }
  }, [presentPath]);
};

export default useAnnouncementCheck;
