import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import API from "../../api/api"
import useTable from "../../Table/useTable";


import Controls from "../../controls/Controls";

import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';

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
    { id: 'isSSL', label: 'SSL' }
]

export default function Networksuser() {

    const classes = useStyles();
    const [records, setRecords] = useState([])
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })

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
                            </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
        </>
    )
}
