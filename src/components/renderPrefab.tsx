import Styled, { css } from 'styled-components'
import { IPrefab } from '../models'

interface PrefabProps {
  imagePath: string
  isActive: boolean
}

interface InputProps {
  index: number,
  prefab: IPrefab,
  apiPath: string,
  active: boolean,
}

export default ({ prefab, active, index, apiPath }: InputProps): JSX.Element => {
  return <Prefab.Box key={`prefab-${index}`} isActive={active}
    imagePath={`${apiPath}/${prefab.imagePath}`}>
    <Prefab.MetaData>
      <span>{prefab.type}</span>
      <span>{prefab.name}</span>
      <Prefab.PackLink href={prefab.packStoreUrl} target='_blank'>{prefab.pack}</Prefab.PackLink>
    </Prefab.MetaData>
  </Prefab.Box>
}

const Prefab = {
  Box: Styled.div<PrefabProps>`
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
  MetaData: Styled.div`
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
  PackLink: Styled.a`
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
  `
}