import React, { useState, useEffect } from 'react'

import API from "../../api/api"
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../Table/useTable";
import ServerForm from "./serverform";


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
    { id: 'Name', label: 'Server Name' },
    { id: 'FLAG', label: 'Country' },
    { id: 'ServerIP', label: 'Server IP' },
    { id: 'ServerPort', label: 'ServerPort' },
    { id: 'SSLPort', label: 'SSL Port' },
    { id: 'ProxyIP', label: 'Proxy IP' },
    { id: 'ProxyPort', label: 'ProxyPort' },
    { id: 'sInfo', label: 'sInfo' },
    { id: 'ServerUser', label: 'ServerUser' },
    { id: 'ServerPass', label: 'ServerPass' },
    { id: 'Type', label: 'Type' },
    
    
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Servers() {

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

    const GetServerData = () => {

        API.get("/server/getserver", { headers: {"Authorization" : `Bearer ${token}`} })
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
                    return items.filter(x => x.Name.toLowerCase().includes(target.value))
            }
        })
    }
    const insertServer = (server) => {

        API.post("/server/addserver", server, { headers: {"Authorization" : `Bearer ${token}`} })
            .then(response => {
                
                    alert(response.data.message)
                    window.location.reload()
 
            })
            .catch(err => {
                console.log(err)
            })
    }

    const updateServer = (id,edit) =>{

        const server = JSON.stringify(edit)
        API.put(`/server/${id}`, server, { headers: {"Authorization" : `Bearer ${token}`} } )
        .then(response => {
            alert(response.data.message)
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
                
    }

    const addOrEdit = (server, resetForm) => {
        if (server.id === 0)
            insertServer(server)
        else
            updateServer(recordForEdit.id, server)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(GetServerData())
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const handleDelete = (id) =>{
        
        API.delete(`/server/${id}`,{ headers: {"Authorization" : `Bearer ${token}`} })
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
        setRecords(GetServerData())
        setNotify({
            isOpen: true,
            message: 'Deleted Successfully',
            type: 'error'
        })
    }

    useEffect(() => {
        GetServerData();
    }, [])
    return (
        <>
            <Paper className={classes.pageContent}>

                <Toolbar>
                    <Controls.Input
                        label="Search Server"
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
                                <TableCell>{item.Name}</TableCell>
                                <TableCell>{item.FLAG}</TableCell>
                                <TableCell>{item.ServerIP}</TableCell>
                                <TableCell>{item.ServerPort}</TableCell>
                                <TableCell>{item.SSLPort}</TableCell>
                                <TableCell>{item.ProxyIP}</TableCell>
                                <TableCell>{item.ProxyPort}</TableCell>
                                <TableCell>{item.sInfo}</TableCell>
                                <TableCell>{item.ServerUser}</TableCell>
                                <TableCell>{item.ServerPass}</TableCell>
                                <TableCell>{item.Type}</TableCell>
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
                title="Server Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <ServerForm
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
