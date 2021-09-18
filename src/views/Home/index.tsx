// libs
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactModal from 'react-modal'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import Styled, { css } from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, /*faCoffee,*/ faChevronDown, faPlus, faMinus /*faExternalLinkAlt, faSlidersH */ } from '@fortawesome/free-solid-svg-icons'
import { IPrefab, PrefabsWrapper, Categories, Category } from '../../models';
import { getPrefabs, getCategories, getPacks } from '../../services/prefabService'
import { isQueryCorrectLength } from '../../services/utilsService'
import { MultiSelect } from "react-multi-select-component";

import logo from './../../assets/logo.png'
import theme from '../../theme/theme'

type OptionType = InstanceType<typeof Option>;

interface PrefabProps {
  imagePath: string
  isActive: boolean
}

interface IsActiveProps {
  isActive: boolean
}

interface PrefabArrowProps {
  isLeft: boolean
  isDisabled: boolean
  isActive: boolean
}

interface LoaderProps {
  fetching: boolean
}

interface ErrorStateProps {
  hasError: boolean
}

const ALLOWED_CHARS_REGEX = /^[a-zA-Z(\"\'\s)]+$/

const DEFAULT_ERROR_STATE = {
  hasError: false,
  errorMessage: ''
}

ReactModal.setAppElement('#root')

const HomeView = (): JSX.Element => {
  const { searchParam } = useParams<{ searchParam: string }>()
  const [query, setQuery] = useState<string>(searchParam || '')
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [prefabs, setPrefabs] = useState<PrefabsWrapper | null>(null)
  const [filteredPrefabs, setFilteredPrefabs] = useState<PrefabsWrapper | null>(null)
  const [categoriesShown, setCategoriesShown] = useState<boolean>(false)
  const [categories, setCategories] = useState<Categories | null>(null)
  const [activePrefab, setActivePrefab] = useState<IPrefab | null>(null)
  const [errorState, setErrorState] = useState<{ hasError: boolean, errorMessage: string }>(DEFAULT_ERROR_STATE)
  const [selectedValues, setSelectedValues] = useState<OptionType[]>([]);
  const [filteredPackIdentifiers, setFilteredPackIdentifiers] = useState<string[]>([]);
  const [packNames, setPackNames] = useState<OptionType[]>([]);

  useEffect(() => {
    if (query) {
      handleSearchClicked()
    }
  }, [searchParam])

  useEffect(() => {
    if (prefabs && categories) {
      if (categories.active) {
        setFilteredPrefabs(Object.fromEntries(Object.entries(prefabs).filter(([key, value]) => value.pack.category.some(c => c === categories.active?.name))))
      } else {
        setFilteredPrefabs(prefabs)
      }
    }
  }, [categories])

  useEffect(() => {
    handleGetPacks();
  }, [])

  const handleGetPacks = async () => {
    const packs = await getPacks();

    if (packs.data.success) {
      setPackNames(packs.data.data.map<OptionType>((elem) => {
        return { label: elem.name.substring('Polygon'.length), value: elem.identifier } as OptionType
      }, packNames));

      const previousSelection = localStorage.getItem("packSelection");
      if (previousSelection)
        setSelectedValues(JSON.parse(previousSelection))
    }
  }

  const handlePackSelectionChanges = (selection: OptionType[]) => {
    setSelectedValues(selection)
    localStorage.setItem("packSelection", JSON.stringify(selection))
  }

  const handleSearchClicked = async () => {
    if (!query) {
      return
    }

    setActivePrefab(null)
    setIsFetching(true)

    const correctLength = isQueryCorrectLength(query)

    if (correctLength) {
      const response = await getPrefabs(query)

      if (response.data && response.data.success) {
        setCategories(getCategories(response.data.data))

        if (selectedValues.length > 0) {
          const selectedPacks = selectedValues.map(x => x['value'] as string);
          const filteredPacks: PrefabsWrapper = {};
          const remainingPacks: PrefabsWrapper = {};

          Object.values(response.data.data).
            forEach((elem) => {
              selectedPacks.includes(elem.pack.identifier) ?
                filteredPacks[elem.pack.identifier] = elem :
                remainingPacks[elem.pack.identifier] = elem;
            });

          const combinedPacks = { ...filteredPacks, ...remainingPacks }
          setFilteredPackIdentifiers(Object.keys(filteredPacks));

          setPrefabs(combinedPacks)
          setFilteredPrefabs(combinedPacks);
        }
        else {
          setPrefabs(response.data.data)
          setFilteredPrefabs(response.data.data);
        }

      } else {
        handleNetworkError()
      }
    } else {
      handleQueryTooShort()
    }

    setIsFetching(false)
  }

  const handleQueryTooShort = () => {
    setErrorState({ hasError: true, errorMessage: 'Minimum characters for a query is 3' })
  }

  const handleNetworkError = () => {
    setErrorState({ hasError: true, errorMessage: 'There was an error with your request, please try again later' })
  }

  const onKeyPressedSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      handleSearchClicked()
      event.currentTarget.blur()
    } else if (!event.key.match(ALLOWED_CHARS_REGEX)) {
      event.preventDefault()
    }
  }

  const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const correctLength = isQueryCorrectLength(event.currentTarget.value)
    if (!correctLength) {
      handleQueryTooShort()
    } else {
      setErrorState({ hasError: false, errorMessage: '' })
    }

    setQuery(event.currentTarget.value)
  }

  const togglePrefabPack = (pack: string) => {
    if (prefabs) {
      const edited = { ...prefabs }
      edited[pack].active = !edited[pack].active

      setPrefabs(edited)
    }
  }

  const toggleCategory = (category: Category) => {
    if (categories) {
      const edited = { ...categories }

      if (category !== categories.active) {
        edited.active = category
      } else {
        edited.active = null
      }

      setCategories(edited)
    }
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
        {filteredPrefabs && categories &&
          <>
            <Home.Left>
              <Home.CategoriesWrapper>
                <Home.CategoriesTitle onClick={() => setCategoriesShown(!categoriesShown)}>
                  Category
                  {categoriesShown ? <Home.Icon icon={faMinus} /> : <Home.Icon icon={faPlus} />}
                </Home.CategoriesTitle>
                {
                  categoriesShown &&
                  categories.categories.map((category, index) =>
                    <Home.CategoryWrapper key={`category-wrapper-${index}`}>
                      <Home.CategoryLabel isActive={category.name === categories.active?.name} key={`category-label-${index}`} onClick={() => toggleCategory(category)}>{category.name}</Home.CategoryLabel>
                    </Home.CategoryWrapper>
                  )
                }
              </Home.CategoriesWrapper>
            </Home.Left>
            <Home.Right>
              {
                Object.entries(filteredPrefabs).map(([key, value]) =>
                  <Home.PrefabsWrapper key={`wrapper-${key}`} isActive={value.active}>
                    <Home.PrefabsPackWrapper isActive={value.active} onClick={() => togglePrefabPack(key)}>
                      <Home.PrefabsTypeTitle style={{
                        color: filteredPackIdentifiers.length > 0 ?
                          (filteredPackIdentifiers.includes(value.pack.identifier) ? theme.colors.black : theme.colors.grey)
                          : theme.colors.black
                      }} >{`${value.pack.name} (${value.prefabs.length})`}</Home.PrefabsTypeTitle>
                      <Home.PrefabsTypeChevron isActive={value.active}>
                        <Home.Icon icon={faChevronDown} />
                      </Home.PrefabsTypeChevron>
                    </Home.PrefabsPackWrapper>
                    <Home.PrefabsRow isActive={value.active}>
                      {
                        value.prefabs.map((prefab, index) =>
                          <Home.PrefabBox href={prefab.packStoreUrl} target='_blank' key={`prefab-${index}`} isActive={activePrefab === prefab}
                            imagePath={`http://localhost:4080/${prefab.imagePath}`}>
                            {/* <Home.PrefabLinksWrapper className='links'>
                                      <Home.Icon icon={faSlidersH} onClick={activePrefab === prefab ? () => setActivePrefab(null) : () => setActivePrefab(prefab)}/>
                                      <Home.Link >
                                        <Home.IconBigger icon={faExternalLinkAlt} size='lg' />
                                      </Home.Link>
                                    </Home.PrefabLinksWrapper> */}
                            <Home.PrefabMetaData>
                              <span>{prefab.type}</span>
                              <span>{prefab.name}</span>
                              <span>{value.pack.name}</span>
                            </Home.PrefabMetaData>
                          </Home.PrefabBox>
                        )
                      }
                    </Home.PrefabsRow>
                  </Home.PrefabsWrapper>
                )
              }
            </Home.Right>
          </>
        }
      </>
    )
  }

  return (
    <Home.Layout>
      <Home.Top>
        <Home.Title>Synty Search</Home.Title>
        <Home.Input
          value={query}
          hasError={errorState.hasError}
          onChange={(e) => onInputChanged(e)}
          onKeyDown={(e) => onKeyPressedSearch(e)} />
        {
          errorState.hasError &&
          <Home.InputError>{errorState.errorMessage}</Home.InputError>
        }
        <Home.MultiSelect
          options={packNames}
          value={selectedValues}
          onChange={handlePackSelectionChanges}
          labelledBy="Select"
          overrideStrings={{ 'selectSomeItems': "All Packs" }}
        />
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
              isFetching && prefabs
                ? renderLoader()
                : renderPrefabs()
            }
          </Home.Transition>
        </Home.SwitchTransition>
      </Home.Bottom>
      <Home.Footer>
        <Home.FooterRow>
          by community for community
        </Home.FooterRow>
        {/* <Home.FooterRow>
          you can show me some <Home.Icon icon={faHeart} /> and buy me a
          <Home.Link href={'https://www.paypal.com/donate/?business=novacik.daniel%40gmail.com&no_recurring=0&currency_code=EUR'} target='_blank'>
            <Home.Icon icon={faCoffee} />
          </Home.Link>
        </Home.FooterRow> */}
        <Home.FooterSignature>
          made with <Home.Icon icon={faHeart} color='red' /> by
          <Home.Link href={'https://cognision.eu'} target='_blank'>@ra6e</Home.Link>
          {' & '}
          <Home.Link href={'https://twitter.com/MegaMileyMakes'} target='_blank'>@MegaMiley</Home.Link>
          {' & '}
          <Home.Link href={'https://gamedevbits.com/'} target='_blank'>@Timps</Home.Link>
        </Home.FooterSignature>
      </Home.Footer>
      {
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
            {/* <Home.DetailsValue>{activePrefab.pack}</Home.DetailsValue> */}
          </Home.DetailsRow>
          <Home.DetailsRow>
            <Home.DetailsHeader>Prefab Type:</Home.DetailsHeader>
            <Home.DetailsValue>{activePrefab.type}</Home.DetailsValue>
          </Home.DetailsRow>
        </Home.Details>
      }
    </Home.Layout >
  );
};

const Home = {
  Layout: Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  position: relative;
  `,
  Top: Styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  transition: all .2s;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 1002;
  `,
  Bottom: Styled.div`
  margin-top: 200px;
  display: flex;
  width: 100%;
  height: calc(100vh - 325px);
  transition: all .2s;
  flex-direction: row;
  align-items: center;
  margin-bottom: 125px;
  `,
  Left: Styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100%;
  `,
  CategoriesWrapper: Styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  `,
  CategoryWrapper: Styled.div`
  display: flex;
  flex-direction: row;
  `,
  CategoriesTitle: Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: ${props => props.theme.font.size.small};
  font-weight: 500;
  cursor: pointer;
  `,
  CategoryLabel: Styled.label<IsActiveProps>`
  display: flex;
  font-size: ${props => props.theme.font.size.smallest};
  cursor: pointer;
  margin-left: 10px;

  ${props => props.isActive && css`
    font-weight: 600;
  `}
  `,
  Right: Styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 100%;
  overflow-y: scroll;
  `,
  Footer: Styled.div`
  display: flex;
  width: 100%;
  height: 125px;
  position: fixed;
  bottom: 0;
  left: 0;
  margin-top: 25px;
  background: #fff;
  z-index: 1002;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  `,
  FooterRow: Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${props => props.theme.font.size.smallest};
  `,
  FooterSignature: Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: ${props => props.theme.font.size.micro};
  `,
  Link: Styled.a`
  display: flex;
  margin: 0 3px;

  &:visited, :link, :active {
    text-decoration: none;
    color: ${props => props.theme.colors.black};
  }
  `,
  Icon: Styled(FontAwesomeIcon)`
  display: flex;
  width: 30px;
  height: 30px;
  margin: 0 5px;
  `,
  IconBigger: Styled(FontAwesomeIcon)`
  display: flex;
  width: 40px;
  height: 40px;
  margin: 0 5px;
  `,
  Details: Styled(ReactModal)`
  display: flex;
  width: 400px;
  height: 400px;
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
  Input: Styled.input<ErrorStateProps>`
  display: flex;
  width: 250px;
  height: 35px;
  border-radius: 5px;
  font-size: ${props => props.theme.font.size.smaller};
  outline: none;

  &:focus, :active, :focus-within, :focus-visible {
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.black};
    outline: none;
  }

  ${props => props.hasError && css`
    border-color: ${props => props.theme.colors.error};
    color: ${props => props.theme.colors.error};
    outline: none;
  `}
  `,
  InputError: Styled.span`
  display: flex;
  font-size: ${props => props.theme.font.size.smallest};
  color: ${props => props.theme.colors.error};
  `,
  Search: Styled.button`
  margin: 20px 0;
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
  MultiSelect: Styled(MultiSelect)`
  max-width:250px;
  width: 250px;
  padding-top: 10px;
  `,
  SwitchTransition: Styled(SwitchTransition)`
  display: flex;
  width: 100%;
  `,
  Transition: Styled(CSSTransition)`
  display: flex;
  width: 100%;
  `,
  PrefabsWrapper: Styled.div<IsActiveProps>`
  position: relative;
  display: flex;
  width: 90%;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.isActive ? '50px' : '0'};

  &:not(:last-of-type) {
    border-bottom: 1px solid ${props => props.theme.colors.black};
  }
  `,
  PrefabsPackWrapper: Styled.div<IsActiveProps>`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;

  ${props => props.isActive && css`
  `}
  `,
  PrefabsTypeTitle: Styled.h3`
  display: flex;
  color: ${props => props.theme.colors.black};
  margin: 0;
  align-self: center;
  cursor: pointer;
  `,
  PrefabsTypeChevron: Styled.div<IsActiveProps>`
  display: flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  transform-origin: center;
  transform: rotate(${props => props.isActive ? '0deg' : '180deg'});
  `,
  PrefabsRow: Styled.div<IsActiveProps>`
  display: flex;
  width: 100%;
  flex-direction: row;
  height: 0;
  flex-wrap: wrap;
  justify-content: flex-start;
  overflow: hidden;
  transition: all .2s;
  position: relative;
  align-items: center;

  ${props => props.isActive && css`
    height: auto;
  `}
  `,
  PrefabArrow: Styled.div<PrefabArrowProps>`
  position: absolute;
  cursor: pointer;
  width: 40px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  height: 0;
  overflow: hidden;
  bottom: 50px;

  ${props => props.isLeft && css`
    left: -15px;
  `};

  ${props => !props.isLeft && css`
    right: -15px;
  `};

  .arrow {
    display: flex;
    color: #fff;
    font-size: 44px;
  }

  ${props => props.isDisabled && css`
    cursor: default;
      .arrow {
        color: #000; 
      }
  `};

  ${props => !props.isDisabled && css`
    &: hover {
      background: rgba(0, 0, 0, 0.8);
    }
  `};

  ${props => props.isActive && css`
    height: calc(0.9 * 200px);
  `}
  `,
  PrefabBox: Styled.a<PrefabProps>`
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
  color: ${props => props.theme.colors.black};
  text-decoration: none;

  &:hover {
    filter: drop-shadow(0 0 0.75rem ${props => props.theme.colors.black});

    > .links {
      display: flex;
    }
  }

  &:visited, :active {
    text-decoration: none;
    color: ${props => props.theme.colors.black};
  }

  ${props => props.isActive && css`
    filter: drop-shadow(0 0 0.75rem ${props => props.theme.colors.black});
  `}

  @media only screen and ${props => props.theme.screenSizes.mobile} {
    width: 90%;
    margin: auto;
    margin-bottom: 30px;
    background-size: contain;
    background-position: center;
  }
  `,
  PrefabLinksWrapper: Styled.div`
  display: none;
  width: 100%;
  height: 50px;
  position: absolute;
  align-items: center;
  justify-content: flex-end;
  top: 0;
  right: 0;
  flex-direction: row;
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
  Loader: Styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
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