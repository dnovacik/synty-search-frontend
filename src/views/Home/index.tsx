// libs
import React, { useState } from 'react'
import ReactModal from 'react-modal'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Styled, { css } from 'styled-components'
import { IPrefab } from '../../models';
import { getPrefabs, groupBy } from '../../prefabService'

import logo from './../../assets/logo.png'

interface PrefabProps {
  imagePath: string
  isActive: boolean
}

interface LoaderProps {
  fetching: boolean
}

ReactModal.setAppElement('#root')

const HomeView = (): JSX.Element => {
  const [query, setQuery] = useState<string>('')
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [prefabs, setPrefabs] = useState<{ [key: string]: Array<IPrefab> } | null>(null)
  const [activePrefab, setActivePrefab] = useState<IPrefab | null>(null)

  const handleSearchClicked = async () => {
    setActivePrefab(null)
    setIsFetching(true)
    const response = await getPrefabs(query)

    if (response.data && response.data.success) {
      setPrefabs(groupBy(response.data.data, (x: IPrefab) => x.pack))
    }

    setIsFetching(false)
  }

  const renderLoader = () => {
    return (
      <Home.Loader>
        <Home.Logo fetching={isFetching} src={logo} />
      </Home.Loader>
    )
  }

  const renderPrefabs = () => {
    return (
      <>
        {prefabs &&
          Object.entries(prefabs).map(([key, value]) =>
            <Home.PrefabsWrapper key={`wrapper-${key}`}>
              <Home.PrefabsTypeTitle>{key}</Home.PrefabsTypeTitle>
              <Home.PrefabsRow>
                {
                  value.map((prefab, index) =>
                    <Home.PrefabBox key={`prefab-${index}`} isActive={activePrefab === prefab}
                      onClick={activePrefab === prefab ? () => setActivePrefab(null) : () => setActivePrefab(prefab)}
                      imagePath={`http://localhost:4040/${prefab.imagePath}`}>
                      <Home.PrefabMetaData>
                        <span>{prefab.type}</span>
                        <span>{prefab.name}</span>
                        <Home.PrefabPackLink href={prefab.packStoreUrl} target='_blank'>{prefab.pack}</Home.PrefabPackLink>
                      </Home.PrefabMetaData>
                    </Home.PrefabBox>
                  )
                }
              </Home.PrefabsRow>
            </Home.PrefabsWrapper>
          )
        }
      </>
    )
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
              isFetching
                ? renderLoader()
                : renderPrefabs()
            }
          </Home.Transition>
        </Home.SwitchTransition>
      </Home.Bottom>
      {/* {
        activePrefab &&
        <Home.Details
          isOpen={activePrefab !== null}
          onRequestClose={() => setActivePrefab(null)}
          shouldCloseOnOverlayClick={true}>
          <Home.DetailsRow>
            <Home.DetailsHeader>Prefab Name:</Home.DetailsHeader>
            <Home.DetailsValue>{activePrefab.name.slice(0, -4)}</Home.DetailsValue>
          </Home.DetailsRow>
          <Home.DetailsRow>
            <Home.DetailsHeader>Pack Name:</Home.DetailsHeader>
            <Home.DetailsValue>{activePrefab.pack}</Home.DetailsValue>
          </Home.DetailsRow>
          <Home.DetailsRow>
            <Home.DetailsHeader>Prefab Type:</Home.DetailsHeader>
            <Home.DetailsValue>{activePrefab.type}</Home.DetailsValue>
          </Home.DetailsRow>
        </Home.Details>
      } */}
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
  `,
  PrefabsWrapper: Styled.div`
  display: flex;
  width: 90%;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 50px;
  `,
  PrefabsTypeTitle: Styled.h2`
  display: flex;
  color: ${props => props.theme.colors.black};
  margin-bottom: 20px;
  align-self: center;
  `,
  PrefabsRow: Styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  `,
  PrefabBox: Styled.div<PrefabProps>`
  display: flex;
  width: 200px;
  height: 250px;
  background-image: url(${props => props.imagePath});
  background-repeat: no-repeat;
  background-size: 200px 200px;
  position: relative;
  margin-right: 20px;
  margin-bottom: 30px;
  border-radius: 5px;
  cursor: pointer;
  transition: all .2s;

  &:hover {
    filter: drop-shadow(0 0 0.75rem ${props => props.theme.colors.yellow});

    a {
      color: ${props => props.theme.colors.yellow};
    }
  }

  ${props => props.isActive && css`
    filter: drop-shadow(0 0 0.75rem ${props => props.theme.colors.yellow});
  `};
  `,
  PrefabMetaData: Styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
  flex-direction: column;
  font-size: ${props => props.theme.font.size.smallest};
  font-weight: bold;
  align-items: flex-end;
  justify-content: flex-end;
  `,
  PrefabPackLink: Styled.a`
  display: flex;
  text-decoration: none;
  color: ${props => props.theme.colors.black};
  transition: all .2s;

  &:visited, :active {
    text-decoration: none;
    color: ${props => props.theme.colors.black};
  }

  &:hover {
    color: ${props => props.theme.colors.yellow};
  }
  `,
  Loader: Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  `,
  Logo: Styled.img<LoaderProps>`
  width: 60px;
  height: auto;
  margin-bottom: 15px;

  ${props => props.fetching && css`
  animation: rotateY 1.5s infinite;
  `}
  `
}

export default HomeView