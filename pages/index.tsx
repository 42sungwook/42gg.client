import type { NextPage } from 'next';
import SearchBar from 'components/main/SearchBar';
import Section from 'components/main/Section';
import styles from 'styles/main/Home.module.scss';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <SearchBar />
      </div>
      <div className={styles.rank}>
        <Section path='rank' sectionTitle={'Ranking'} />
      </div>
      <div className={styles.game}>
        <Section path='game' sectionTitle={'Current Play'} />
      </div>
    </div>
  );
};

export default Home;
