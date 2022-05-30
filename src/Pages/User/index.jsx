import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalTitle } from 'react-bootstrap'
import API from '../../api/api'
const User = () => {
    const [Data, setData] = useState([]);
    const [RowData, SetRowData] = useState([])
    const [ViewShow, SetViewShow] = useState(false)
    const handleViewShow = () => { SetViewShow(true) }
    const hanldeViewClose = () => { SetViewShow(false) }
    //FOr Edit Model
    const [ViewEdit, SetEditShow] = useState(false)
    const handleEditShow = () => { SetEditShow(true) }
    const hanldeEditClose = () => { SetEditShow(false) }
    //FOr Delete Model
    const [ViewDelete, SetDeleteShow] = useState(false)
    const handleDeleteShow = () => { SetDeleteShow(true) }
    const hanldeDeleteClose = () => { SetDeleteShow(false) }
    //FOr Add New Data Model
    const [ViewPost, SetPostShow] = useState(false)
    const handlePostShow = () => { SetPostShow(true) }
    const hanldePostClose = () => { SetPostShow(false) }

    //Define here local state that store the form Data
    const [fullName, setname] = useState("")
    const [username, setuser] = useState("")
    const [password, setpassword] = useState("")
    const [role, setrole] = useState("")
    //const [address, setaddress] = useState("")

    const [Delete,setDelete] = useState(false)
    //Id for update record and Delete
    const [id,setId] = useState("");
    //Set pages

    const token = localStorage.getItem("token");
    // let config = {
    //     headers:{
    //         'Authorization': 'Bearer ' + token
    //     }
	// };

    const GetEmployeeData = () => {
        //here we will get all employee data

        API.get("/api/", { headers: {"Authorization" : `Bearer ${token}`} })
            .then(response => {
                setData(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleSubmite = () => {

        const Credentials = { fullName, username, password, role }
        API.post("/api/register", Credentials)
            .then(response => {
                
                    alert(response.data.message)
                    window.location.reload()
 
            })
            .catch(err => {
                console.log(err)
            })
    }

    const checknull= (x) =>{
        if (x ==='')
            return true;
    }
    const handleEdit = () =>{
        const edit = {};
        const Credentials = { fullName, username, password, role }
        if(!checknull(fullName)){
            edit.fullName = fullName;
        }
        if(!checknull(username)){
            edit.username=username;
        }
        if(!checknull(password)){
            edit.password = password;
        }
        if(!checknull(role)){
            edit.role = role;
        }
        const user = JSON.stringify(edit)
        API.put(`/api/${id}`, user)
        .then(response => {
            alert(response.data.message)
            window.location.reload()
        
        })
        .catch(err => {
            console.log(err)
        })
                
        }
    //handle Delete Function 
    const handleDelete = () =>{
        
        API.delete(`/api/${id}`)
            .then(response => {
                alert(response.data.message)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
    }
    //call this function in useEffect
    console.log(ViewShow, RowData)
    
    useEffect(() => {
        GetEmployeeData();
    }, [])
    return (
        <div>
            <div className='row'>
                <div className='mt-5 mb-4'>
                    <Button variant='primary' onClick={() => { handlePostShow() }}><i className='fa fa-plu'></i>
                        Add New Employee
                    </Button>
                </div>
            </div>
            <div className='row'>
                <div className='table-responsive'>
                    <table className='table table-striped table-hover table-bordered'>
                        <thead>
                            <tr>
                               
                                <th>FULL NAME</th>
                                <th>USERNAME</th>
                                <th>ROLE</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Data.map((item) =>
                                <tr key={item.id}>
                                    <td>{item.fullName}</td>
                                    <td>{item.username}</td>
                                    <td>{item.role}</td>
                                    <td style={{ minWidth: 190 }}>
                                        <Button size='sm' variant='primary' onClick={() => { handleViewShow(SetRowData(item)) }}>View</Button>|
                                        <Button size='sm' variant='warning' onClick={()=> {handleEditShow(SetRowData(item),setId(item.id))}}>Edit</Button>|
                                        <Button size='sm' variant='danger' onClick={() => {handleViewShow(SetRowData(item),setId(item.id), setDelete(true))}}>Delete</Button>|
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* View Modal */}
            <div className='model-box-view'>
                <Modal
                    show={ViewShow}
                    onHide={hanldeViewClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>View Employee Data</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className='form-group'>
                                <input type="text" className='form-control' value={RowData.fullName} readOnly />
                            </div>
                            <div className='form-group mt-3'>
                                <input type="username" className='form-control' value={RowData.username} readOnly />
                            </div>
                            <div className='form-group mt-3'>
                                <input type="text" className='form-control' value={RowData.password} readOnly />
                            </div>
                            <div className='form-group mt-3'>
                                <input type="text" className='form-control' value={RowData.role} readOnly />
                            </div>
                           
                            {
                                Delete && (
                                    <Button type='submit' className='btn btn-danger mt-4' onClick={handleDelete}>Delete Employee</Button>
                                )
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={hanldeViewClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/* Modal for submit data to database */}
            <div className='model-box-view'>
                <Modal
                    show={ViewPost}
                    onHide={hanldePostClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add new Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className='form-group'>
                                <input type="text" className='form-control' onChange={(e) => setname(e.target.value)} placeholder="Please enter Name" />
                            </div>
                            <div className='form-group mt-3'>
                                <input type="username" className='form-control' onChange={(e) => setuser(e.target.value)} placeholder="Please enter username" />
                            </div>
                            <div className='form-group mt-3'>
                                <input type="text" className='form-control' onChange={(e) => setpassword(e.target.value)} placeholder="Please enter password" />
                            </div>
                            <div className='form-group mt-3'>
                                <input type="text" className='form-control' onChange={(e) => setrole(e.target.value)} placeholder="Please enter role" />
                            </div>
                           
                            <Button type='submit' className='btn btn-success mt-4' onClick={handleSubmite}>Add Employee</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={hanldePostClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            {/* Modal for Edit employee record */}
            <div className='model-box-view'>
                <Modal
                    show={ViewEdit}
                    onHide={hanldeEditClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className='form-group'>
                                <label>Name</label>
                                <input type="text" className='form-control' onChange={(e) => setname(e.target.value)} placeholder="Please enter Name" defaultValue={RowData.fullName}/>
                            </div>
                            <div className='form-group mt-3'>
                                <label>Username</label>
                                <input type="username" className='form-control'  onChange={(e) => setuser(e.target.value)} placeholder="Please enter username" defaultValue={RowData.username} />
                            </div>
                            <div className='form-group mt-3'>
                                <label>Password</label>
                                <input type="text" className='form-control'  onChange={(e) => setpassword(e.target.value)} placeholder="Please enter Password" defaultValue={RowData.password}/>
                            </div>
                            <div className='form-group mt-3'>
                                <label>Role</label>
                                <input type="text" className='form-control'  onChange={(e) => setrole(e.target.value)} placeholder="Please enter Role" defaultValue={RowData.role}/>
                            </div>

                            <Button type='submit' className='btn btn-warning mt-4' onClick={handleEdit}>Edit Employee</Button>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={hanldeEditClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default User;