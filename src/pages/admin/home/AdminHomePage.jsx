import React from 'react'
import Users from '../user/Users'
import Movies from '../movie/Movies'
import Genres from '../genres/Genres'
import Platforms from '../platforms/Platforms'

const AdminHomePage = () => {
  return (
    <div>
      <Users />
      <Movies />
      <Genres />
      <Platforms />
    </div>
  )
}

export default AdminHomePage
