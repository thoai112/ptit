import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../controls/Controls";
import { useForm, Form } from '../../Table/useForm';



const initialFValues = {
    id: 0,
    Name : '', 
    FLAG : '', 
    ServerIP: '', 
    ServerPort: '', 
    SSLPort: '',
    ProxyIP: '',
    ProxyPort: '',
    sInfo: '', 
    ServerUser: '',
    ServerPass: '', 
    Type:'',
}

export default function ServerForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('Name' in fieldValues)
            temp.Name = fieldValues.Name ? "" : "This field is required."
        if ('ServerIP:' in fieldValues)
            temp.ServerIP = fieldValues.ServerIP ? "" : "This field is required."
        if ('ServerPort' in fieldValues)
            temp.ServerPort = fieldValues.ServerPort ? "" : "This field is required."
        
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }
    
    const getType = () => ([
        { id: 'Free', title: 'Free' },
        { id: 'Pro', title: 'Pro' }
    ])

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])
    return (
        <Form onSubmit={handleSubmit}>
        <Grid container>
            <Grid item xs={6}>
                <Controls.Input
                    name="Name"
                    label="Name Server"
                    value={values.Name}
                    onChange={handleInputChange}
                    error={errors.Name}
                />
                <Controls.Input
                    label="FLAG"
                    name="FLAG"
                    value={values.FLAG}
                    onChange={handleInputChange}
                    error={errors.FLAG}
                />
                <Controls.Input
                    label="ServerIP"
                    name="ServerIP"
                    value={values.ServerIP}
                    onChange={handleInputChange}
                    error={errors.ServerIP}
                />
                <Controls.Input
                    label="ServerPort"
                    name="ServerPort"
                    value={values.ServerPort}
                    onChange={handleInputChange}
                    error={errors.ServerPort}
                />
                <Controls.Input
                    label="sInfo"
                    name="sInfo"
                    value={values.sInfo}
                    onChange={handleInputChange}
                    error={errors.sInfo}
                />
                <Controls.Input
                    label="SSLPort"
                    name="SSLPort"
                    value={values.SSLPort}
                    onChange={handleInputChange}
                    error={errors.SSLPort}
                />

            </Grid>
            <Grid item xs={6}>
            <Controls.Input
                    name="ProxyIP"
                    label="ProxyIP"
                    value={values.ProxyIP}
                    onChange={handleInputChange}
                    error={errors.ProxyIP}
                />
                <Controls.Input
                    label="ProxyPort"
                    name="ProxyPort"
                    value={values.ProxyPort}
                    onChange={handleInputChange}
                    error={errors.ProxyPort}
                />
                <Controls.Input
                    label="ServerUser"
                    name="ServerUser"
                    value={values.ServerUser}
                    onChange={handleInputChange}
                    error={errors.ServerUser}
                />
                <Controls.Input
                    label="ServerPass"
                    name="ServerPass"
                    value={values.ServerPass}
                    onChange={handleInputChange}
                    error={errors.ServerPass}
                />
                <Controls.Select
                    name="Type"
                    label="Type"
                    value={values.Type}
                    onChange={handleInputChange}
                    options={getType()}
                    error={errors.Type}
                />

                <div>
                    <Controls.Button
                        type="submit"
                        text="Submit" />
                    <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={resetForm} />
                </div>
            </Grid>
        </Grid>
    </Form>
    )
}
