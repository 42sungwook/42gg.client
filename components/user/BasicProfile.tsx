import Image from 'next/image';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userState } from 'utils/recoil/layout';
import { modalState } from 'utils/recoil/modal';
import PlayerImage from 'components/PlayerImage';
import useBasicProfile from 'hooks/users/useBasicProfile';
import { AiOutlineEdit } from 'react-icons/ai';
import styles from 'styles/user/Profile.module.scss';
interface ProfileProps {
  profileId: string;
}

export default function BasicProfile({ profileId }: ProfileProps) {
  const user = useRecoilValue(userState);
  const setModal = useSetRecoilState(modalState);
  const {
    intraId,
    userImageUri,
    racketType,
    statusMessage,
    level,
    currentExp,
    maxExp,
    expRate,
    MAX_LEVEL,
  } = useBasicProfile({ profileId });

  return (
    <div className={styles.container}>
      <div className={styles.level}>LV.{level}</div>
      <div className={styles.bar}>
        <span
          className={styles.expCurrent}
          style={{ width: `${expRate}%` }}
        ></span>
        <span
          className={styles.expLeft}
          style={{ width: `${100 - expRate}%` }}
        ></span>
      </div>
      {intraId && (
        <PlayerImage src={userImageUri} styleName={'mainProfile'} size={30} />
      )}
      <div className={styles.idContainer}>
        <div></div>
        <div className={styles.intraId}>{intraId}</div>
        <div className={styles.buttons}>
          {user.intraId === profileId && (
            <>
              <AiOutlineEdit
                onClick={() => {
                  setModal({ modalName: 'USER-PROFILE_EDIT' });
                }}
                size='30'
              />
              <div
                className={styles.kakao}
                onClick={() => {
                  setModal({ modalName: 'USER-KAKAO_EDIT' });
                }}
              >
                <Image
                  src='/image/kakao.png'
                  alt='kakao_login'
                  width='30'
                  height='30'
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className={styles.statusMessage}>
        <div className={styles.messaage}>
          {user.intraId === profileId && statusMessage.length === 0
            ? '상태메시지를 입력해보세요!'
            : statusMessage}
        </div>
      </div>
      <div className={styles.boxContainer}>
        <div className={styles.expbox}>
          {level !== MAX_LEVEL
            ? `${currentExp} / ${maxExp}exp`
            : `${currentExp} / Max Exp`}
        </div>
        <div className={styles.racket}>{racketType.toUpperCase()}</div>
      </div>
    </div>
  );
}
