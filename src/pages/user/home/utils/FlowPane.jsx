import React from 'react'
import MovieTile from '../components/MovieTile'

const FlowPane = ({ movies, user }) => {
  return (
    <div className='flow-pane'>
      {movies.map((movie, index) => (<MovieTile movie={movie} key={index} user={user}/>))}
    </div>
  )
}

export default FlowPane
