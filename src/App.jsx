import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import UserData from './UserData';
import AddUser from './AddUser';
import { UserContext } from './UserContext';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  //fetching data using axios and implemented using useEffect.
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
        .then(response => {
            const data = response.data;
             // Data's fetched using Axios was stored in state variable.
            setUsers(data);
            // console.log(users);
        })
  }, []);
  
  return (
    <div>
      {/* Userdata and AddUser page navigated inside Router  */}
    <Router>
      {/* values are provided by using context */}
      <UserContext.Provider value={{users,setUsers}}>
      <Routes>
        <Route exact path='/' element={<UserData />}></Route>
        <Route exact path='/AddUser' element={<AddUser />}></Route>
      </Routes>
      </UserContext.Provider>
    </Router>
    </div>
  )
}

export default App
