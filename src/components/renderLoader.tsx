import Styled, { css } from 'styled-components'

interface LoaderProps {
    fetching: boolean
}

interface InputProps {
    isFetching: boolean, 
    logo: string;
}

export default ({ isFetching, logo }: InputProps): JSX.Element => {
    return (
        <Layout.Loader>
            <Layout.Logo fetching={isFetching} src={logo} />
        </Layout.Loader>
    )
}

const Layout = {
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