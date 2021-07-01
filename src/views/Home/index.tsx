// libs
import { useState } from 'react'
import ReactModal from 'react-modal'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Styled from 'styled-components'
import renderLoader from '../../components/renderLoader';
import { IPrefab } from '../../models';
import { getPrefabs, groupBy } from '../../prefabService'

import logo from './../../assets/logo.png'
import renderPrefabs from '../../components/renderPrefabs';

ReactModal.setAppElement('#root')

const HomeView = (): JSX.Element => {
  const [query, setQuery] = useState<string>('')
  const [prefabs, setPrefabs] = useState<{ [key: string]: Array<IPrefab> } | null>(null)
  const [activePrefab, setActivePrefab] = useState<IPrefab | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const handleSearchClicked = async () => {
    setActivePrefab(null)
    setIsFetching(true)
    const response = await getPrefabs(query)

    if (response.data && response.data.success) {
      setPrefabs(groupBy(response.data.data, (x: IPrefab) => x.pack))
    }

    setIsFetching(false)
  }

  return (
    <Home.Layout>
      <Home.Top>
        <Home.Title>Synty Search</Home.Title>
        <Home.Input value={query} onChange={(e) => setQuery(e.currentTarget.value)}></Home.Input>
        <Home.Search onClick={() => handleSearchClicked()}>Search</Home.Search>
      </Home.Top>
      <Home.Bottom>
        <Home.SwitchTransition mode="out-in">
          <Home.Transition
            key={`state-${isFetching}`}
            in={isFetching}
            classNames="fade"
            component="div"
            timeout={150}>
            {
              isFetching ? renderLoader({ isFetching, logo }) : renderPrefabs({ prefabs, activePrefab })
            }
          </Home.Transition>
        </Home.SwitchTransition>
      </Home.Bottom>
    </Home.Layout >
  );
};

const Home = {
  Layout: Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  position: relative;
  `,
  Top: Styled.div`
  display: flex;
  width: 100%;
  height: 30%;
  transition: all .2s;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  `,
  Bottom: Styled.div`
  margin-top: 50px;
  display: flex;
  width: 100%;
  height: 70%;
  transition: all .2s;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  `,
  Details: Styled(ReactModal)`
  display: flex;
  width: 75%;
  height: 75%;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
  background-color: ${props => props.theme.colors.background};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid ${props => props.theme.colors.black};
  `,
  DetailsRow: Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  `,
  DetailsHeader: Styled.span`
  display: flex;
  color: ${props => props.theme.colors.black};
  font-size: ${props => props.theme.font.size.smaller};
  font-weight: bold;
  `,
  DetailsValue: Styled.span`
  display: flex;
  color: ${props => props.theme.colors.black};
  font-size: ${props => props.theme.font.size.smaller};
  `,
  Title: Styled.h1`
  display: flex;
  color: ${props => props.theme.colors.black};
  `,
  Input: Styled.input`
  display: flex;
  width: 250px;
  height: 35px;
  border-radius: 5px;
  font-size: ${props => props.theme.font.size.smaller};
  `,
  Search: Styled.button`
  margin-top: 20px;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-block;
  width: 200px;
  height: 50px;
  border: 2px solid ${props => props.theme.colors.black};
  border-radius: 5px;
  background-color: ${props => props.theme.colors.black};
  color: ${props => props.theme.colors.background};
  text-align: center;
  -webkit-transition: all .2s;
  transition: all .2s;
  font-size: ${props => props.theme.font.size.smaller};
  font-weight: 600;

  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.black};
  }
  `,
  SwitchTransition: Styled(SwitchTransition)`
  display: flex;
  width: 100%;
  `,
  Transition: Styled(CSSTransition)`
  display: flex;
  width: 100%;
  `
}

export default HomeView
