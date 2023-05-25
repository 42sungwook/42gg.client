import { Cancel } from 'types/modalTypes';
import styles from 'styles/modal/match/MatchCancelModal.module.scss';
import useMatchCancelModal from 'hooks/modal/match/useMatchCancelModal';

export default function MatchCancelModal({ startTime, isMatched }: Cancel) {
  const {
    content,
    contentType,
    rejectCancel,
    onCancel,
    currentMatchList,
    onReturn,
  } = useMatchCancelModal({ startTime, isMatched });

  const getCurrentMatch = () => {
    for (const currentMatch of currentMatchList) {
      if (currentMatch.startTime === startTime) {
        return currentMatch;
      }
      return currentMatchList[0];
    }
  };

  const currentMatch = getCurrentMatch();

  return (
    <div className={styles.container}>
      <div className={styles.phrase}>
        <div className={styles.emoji}>{content[contentType].emoji}</div>
        {content[contentType].main}
        {(rejectCancel || (!rejectCancel && currentMatch?.isMatched)) && (
          <div className={styles.subContent}>{content[contentType].sub}</div>
        )}
      </div>
      <div className={styles.buttons}>
        {rejectCancel ? (
          <div className={styles.positive}>
            <input onClick={onReturn} type='button' value='확인' />
          </div>
        ) : (
          <>
            <div className={styles.negative}>
              <input onClick={onReturn} type='button' value='아니오' />
            </div>
            <div className={styles.positive}>
              <input onClick={onCancel} type='button' value='예' />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
