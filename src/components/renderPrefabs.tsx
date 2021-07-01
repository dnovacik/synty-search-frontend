import Styled from 'styled-components'
import { IPrefab } from '../models'
import renderPrefab from './renderPrefab'

interface InputProps {
    prefabs: { [key: string]: Array<IPrefab> } | null,
    activePrefab: IPrefab | null
}

export default ({ prefabs, activePrefab }: InputProps): JSX.Element => {
    return (
        <>
            {prefabs &&
                Object.entries(prefabs).map(([key, value]) =>
                    <Prefabs.Wrapper key={`wrapper-${key}`}>
                        <Prefabs.TypeTitle>{key}</Prefabs.TypeTitle>
                        <Prefabs.Row>{value.map((prefab, index) => renderPrefab({ prefab, active: prefab === activePrefab, index, apiPath: "http://95.179.162.143/api" }))}</Prefabs.Row>
                    </Prefabs.Wrapper>
                )
            }
        </>
    )
}

const Prefabs = {
    Wrapper: Styled.div`
    display: flex;
    width: 90%;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 50px;
    `,
    TypeTitle: Styled.h2`
    display: flex;
    color: ${props => props.theme.colors.black};
    margin-bottom: 20px;
    align-self: center;
    `,
    Row: Styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    `
}