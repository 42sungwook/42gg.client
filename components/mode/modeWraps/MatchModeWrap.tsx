import React from 'react';
import { useRecoilValue } from 'recoil';
import { NewMatchMode } from 'types/mainType';
import { seasonListState } from 'utils/recoil/seasons';
import ModeToggle from 'components/mode/modeItems/ModeToggle';
import useModeToggle from 'hooks/mode/useModeToggle';
import styles from 'styles/mode/ModeWrap.module.scss';

interface MatchModeWrapProps {
  children: React.ReactNode;
  toggleMode: NewMatchMode;
  //setToggleMode: React.Dispatch<React.SetStateAction<MatchMode>>;
}

export default function MatchModeWrap({
  children,
  toggleMode,
}: MatchModeWrapProps) {
  const { seasonMode } = useRecoilValue(seasonListState);
  const { onToggle, Mode } = useModeToggle(toggleMode);

  return (
    <div>
      {seasonMode === 'both' && (
        <div className={styles.matchModeWrap}>
          <ModeToggle
            checked={Mode === 'RANK'}
            onToggle={onToggle}
            id={'matchToggle'}
            text={Mode === 'RANK' ? '랭크' : '일반'}
          />
        </div>
      )}
      {React.cloneElement(children as React.ReactElement, {
        toggleMode: Mode,
      })}
    </div>
  );
}
