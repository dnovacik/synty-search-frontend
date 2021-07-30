// libs
import React from 'react'
import { Route } from 'react-router-dom'

// views
import Home from './views/Home'

export const MainRouter = (): JSX.Element => {
  return (
    <>
      <Route path="/:searchParam?" component={Home} />
    </>
  )
}