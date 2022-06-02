import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import { Search } from "@material-ui/icons";
import AddIcon from '@material-ui/icons/Add';
import API from "../../api/api"
import useTable from "../../Table/useTable";
import Controls from "../../controls/Controls";

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

]

export default function Serversuser() {

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
                                </TableCell>
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
