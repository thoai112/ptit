import React, { useState, useEffect } from 'react'

import API from "../../api/api"
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import useTable from "../../Table/useTable";
import NetworkForm from "./networkform";


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
    { id: 'Payload', label: 'Payload' },
    { id: 'SNI', label: 'SNI' },
    { id: 'Info', label: 'Info' },
    { id: 'isSSL', label: 'SSL' }, 
    { id: 'actions', label: 'Actions', disableSorting: true }
]

export default function Networks() {

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

    const GetNetworkData = () => {

        API.get("/network/getnetwork", { headers: {"Authorization" : `Bearer ${token}`} })
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
    const insertNetwork = (network) => {

        API.post("/network/addnetwork", network, { headers: {"Authorization" : `Bearer ${token}`} })
            .then(response => {
                
                    alert(response.data.message)
                    window.location.reload()
 
            })
            .catch(err => {
                console.log(err)
            })
    }

    const updateNetwork = (id,edit) =>{

        const network = JSON.stringify(edit)
        API.put(`/network/${id}`, network, { headers: {"Authorization" : `Bearer ${token}`} } )
        .then(response => {
            alert(response.data.message)
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
                
    }

    const addOrEdit = (network, resetForm) => {
        if (network.id === 0)
            insertNetwork(network)
        else
            updateNetwork(recordForEdit.id, network)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(GetNetworkData())
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const handleDelete = (id) =>{
        
        API.delete(`/network/${id}`,{ headers: {"Authorization" : `Bearer ${token}`} })
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
        setRecords(GetNetworkData())
        setNotify({
            isOpen: true,
            message: 'Deleted Successfully',
            type: 'error'
        })
    }

    useEffect(() => {
        GetNetworkData();
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
                                <TableCell>{item.Payload}</TableCell>
                                <TableCell>{item.SNI}</TableCell>
                                <TableCell>{item.Info}</TableCell>
                                <TableCell>{item.isSSL}</TableCell>
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
                title="Network Form"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <NetworkForm
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
