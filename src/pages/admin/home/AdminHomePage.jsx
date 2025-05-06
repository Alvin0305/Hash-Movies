import React from 'react'
import Users from '../user/Users'
import Movies from '../movie/Movies'
import Genres from '../genres/Genres'

const AdminHomePage = () => {
  return (
    <div>
      <Users />
      <Movies />
      <Genres />
    </div>
  )
}

export default AdminHomePage
