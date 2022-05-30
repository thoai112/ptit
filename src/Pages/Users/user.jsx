import React, { useState, useEffect } from 'react'
// import EmployeeForm from "./EmployeeForm";
//import PageHeader from "../../Table/PageHeader";
import API from "../../api/api"
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../Table/useTable";
import EmployeeForm from "./userform";
// import * as employeeService from "../../services/employeeService";

import Controls from "../../controls/Controls";

import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import Popup from "../../Table/Popup";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Notification from "../../Table/Notification";
import ConfirmDialog from "../../Table/ConfirmDialog";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id: 'fullName', label: 'Employee Name' },
    { id: 'username', label: 'Username (Personal)' },
    { id: 'role', label: 'Role' },
    
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Employees() {

    const classes = useStyles();
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);


    const token = localStorage.getItem("token");

    const GetEmployeeData = () => {

        API.get("/api/", { headers: {"Authorization" : `Bearer ${token}`} })
            .then(response => {
                setRecords(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.username.toLowerCase().includes(target.value))
            }
        })
    }
    const insertEmployee = (employee) => {

        API.post("/api/register", employee)
            .then(response => {
                
                    alert(response.data.message)
                    window.location.reload()
 
            })
            .catch(err => {
                console.log(err)
            })
    }

    const updateEmployee = (id,edit) =>{

        const user = JSON.stringify(edit)
        API.put(`/api/${id}`,  user, { headers: {"Authorization" : `Bearer ${token}`} })
        .then(response => {
            alert(response.data.message)
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
                
    }

    const addOrEdit = (employee, resetForm) => {
        if (employee.id === 0)
            insertEmployee(employee)
        else
            updateEmployee(recordForEdit.id, employee)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(GetEmployeeData())
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const handleDelete = (id) =>{
        
        API.delete(`/api/${id}`,{ headers: {"Authorization" : `Bearer ${token}`} })
            .then(response => {
                alert(response.data.message)
                window.location.reload()
            })
            .catch(err => {
                console.log(err)
            })
    }

    const onDelete = id => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        handleDelete(id);
        setRecords(GetEmployeeData())
        setNotify({
            isOpen: true,
            message: 'Deleted Successfully',
            type: 'error'
        })
    }

    useEffect(() => {
        GetEmployeeData();
    }, [])
    return (
        <>
            {/* <PageHeader
                title="New Employee"
                subTitle="Form design with validation"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            /> */}
            <Paper className={classes.pageContent}>

                <Toolbar>
                    <Controls.Input
                        label="Search Employees"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <Controls.Button
                        text="Add New"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        className={classes.newButton}
                        onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
                    />
                </Toolbar>
                <TblContainer>
                    <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item =>
                                (<TableRow key={item.id}>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>{item.role}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(item) }}>
                                            <EditOutlinedIcon fontSize="small" />
                                        </Controls.ActionButton>

                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => {
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: 'Are you sure to delete this record?',
                                                    subTitle: "You can't undo this operation",
                                                    onConfirm: () => { onDelete(item.id) }
                                                })
                                            }}>
                                            <CloseIcon fontSize="small" />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Employee Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EmployeeForm
                    recordForEdit={recordForEdit} 
                    addOrEdit={addOrEdit} />
            </Popup>
            <Notification
                notify={notify}
                setNotify={setNotify}
            />
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    )
}
