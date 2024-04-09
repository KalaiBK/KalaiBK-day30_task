import React, { useContext,useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

function UserData() {
    // values passed from App component by context provider was declared to access in this component.
    const { users, setUsers } = useContext(UserContext);

    //selected target id was set to state variable
    const [selectedId, setSelectedId] = useState(0);

    //editUser page was navigated using useNavigate
    const navigate = useNavigate();

    //generateId function used to generate id for newuser dynamically
    const generateId = () => {
        if (users.length > 0) {
            return users[users.length - 1].id + 1;
        }
        return 0;
    }

    const handleDelete = (e) => {
        // to delete the existing user in data filter function was implemented and updated in users state variable
        setUsers(users.filter((user) => user.id != e.target.id))
    }

    const handleEdit = (e) => {
        //selected users id was picked  and set to 'setselectedId' state variable 
        setSelectedId(e.target.id)
        //to edit the user data 'clicked target' was filtered and passed as a state to Adduser component in useNavigate
        navigate("/AddUser", { state:{ data: users.filter((user) => user.id == e.target.id) }})
     }

    return (
        <div>
            <div className='bg-black d-flex justify-content-between p-2'>
                <header className='d-flex align-items-center text-white fs-3 fw-bold'>Manage Users</header>
                {/* link element used to navigate the page from userData to addUdser page and also new id for user also generated and passed as a state in the element*/}
                <Link to='/AddUser' state={{ id: generateId() }}>
                    <button className="btn btn-light"><i className="bi bi-plus-circle"></i> Add User</button>
                </Link>
            </div>
            <div className='container mt-3'>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr className='table-secondary'>
                            {/* object keys in fetched data was assinged as table head to understand */}
                            <th>ID</th>
                            <th>NAME</th>
                            <th>USERNAME</th>
                            <th>EMAIL</th>
                            <th>ADDRESS</th>
                            <th>PHONE</th>
                            <th>WEBSITE</th>
                            <th colSpan={3}>COMPANY</th>
                        </tr>
                    </thead>
                    <tbody>
                         {/* stored data in users state variable was implemented by using map function in table dynamically */}
                        {users.map((res, index) => {
                            return (
                                <tr>
                                    <td>{res.id}</td>
                                    <td>{res.name}</td>
                                    <td>{res.username}</td>
                                    <td>{res.email}</td>
                                    <td>{res.address.city}</td>
                                    <td>{res.phone}</td>
                                    <td>{res.website}</td>
                                    <td>{res.company.name}</td>
                                    <td> 
                                        {/* to edit and update user data from list 'e.target' was send as a argument in handleEdit function*/}
                                        {/* id was setted dynamically to each users edit button to get data's */}
                                        <button onClick={(e) => handleEdit(e)}><i className="bi bi-pencil" id={res.id}></i></button>
                                    </td>
                                    {/* to delete user data from list */}
                                    <td><button onClick={(e) => handleDelete(e)}><i className="bi bi-trash" id={res.id}></i></button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserData