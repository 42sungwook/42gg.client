import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import PageNation from 'components/Pagination';
import { tableFormat } from 'constants/admin/table';
import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import instance from 'utils/axios';
import { modalState } from 'utils/recoil/modal';
import AdminSearchBar from '../common/AdminSearchBar';
import style from 'styles/admin/feedback/FeedbackTable.module.scss';

interface IFeedback {
  id: number;
  intraId: string;
  category: number; // 1: bug, 2: suggestion, 3: question
  content: string;
  createdTime: Date;
  isSolved: boolean;
}

interface IFeedbackTable {
  feedbackList: IFeedback[];
  totalPage: number;
  currentPage: number;
}

export default function FeedbackTable() {
  const [feedbackInfo, setFeedbackInfo] = useState<IFeedbackTable>({
    feedbackList: [],
    totalPage: 0,
    currentPage: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [intraId, setIntraId] = useState<string>('');
  const setModal = useSetRecoilState(modalState);

  const getUserFeedbacks = useCallback(async () => {
    try {
      // TODO : api 수정 필요
      const res = await instance.get(
        `/pingpong/admin/feedback/users/${intraId}?page=${currentPage}&size=10`
      );
      setIntraId(intraId);
      setFeedbackInfo({ ...res.data });
    } catch (e) {
      console.error('MS04');
    }
  }, [intraId, currentPage]);

  const getAllFeedbacks = useCallback(async () => {
    try {
      const res = await instance.get(
        `/pingpong/admin/feedback?page=${currentPage}&size=10`
      );
      setFeedbackInfo({ ...res.data });
    } catch (e) {
      console.error('MS03');
    }
  }, [currentPage]);

  const initSearch = useCallback((intraId?: string) => {
    setIntraId(intraId || '');
    setCurrentPage(1);
  }, []);

  const solvingFeedback = (
    e: React.ChangeEvent<HTMLSelectElement>,
    feedback: IFeedback
  ) => {
    setModal({
      modalName: 'ADMIN-CHECK_FEEDBACK',
      intraId: feedback.intraId,
    });
  };

  useEffect(() => {
    intraId ? getUserFeedbacks() : getAllFeedbacks();
  }, [intraId, getUserFeedbacks, getAllFeedbacks]);

  return (
    <>
      <div className={style.feedbackWrap}>
        <div className={style.header}>
          <span className={style.title}>알림 관리</span>
          <AdminSearchBar initSearch={initSearch} />
        </div>
        <TableContainer className={style.tableContainer} component={Paper}>
          <Table className={style.table} aria-label='customized table'>
            <TableHead className={style.tableHeader}>
              <TableRow>
                {tableFormat['feedback'].columns.map((columnName) => (
                  <TableCell className={style.tableHeaderItem} key={columnName}>
                    {columnName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={style.tableBody}>
              {feedbackInfo.feedbackList.map((feedback: IFeedback) => (
                <TableRow key={feedback.id}>
                  {tableFormat['feedback'].columns.map(
                    (columnName: string, index: number) => {
                      const value = feedback[columnName as keyof IFeedback];
                      return (
                        <TableCell className={style.tableBodyItem} key={index}>
                          {typeof value === 'boolean' ? (
                            <select
                              value={feedback.isSolved ? 1 : 0}
                              onChange={(e) => solvingFeedback(e, feedback)}
                            >
                              <option value='0'>처리중</option>
                              <option value='1'>처리완료</option>
                            </select>
                          ) : (
                            value.toString()
                          )}
                        </TableCell>
                      );
                    }
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={style.pageNationContainer}>
          <PageNation
            curPage={feedbackInfo.currentPage}
            totalPages={feedbackInfo.totalPage}
            pageChangeHandler={(pageNumber: number) => {
              setCurrentPage(pageNumber);
            }}
          />
        </div>
      </div>
    </>
  );
}
