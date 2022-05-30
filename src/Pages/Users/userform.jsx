import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../controls/Controls";
import { useForm, Form } from '../../Table/useForm';
// import * as employeeService from "../../services/employeeService";



const initialFValues = {
    id: 0,
    fullName: '',
    username: '',
    password: '',
    role: '',
}

export default function EmployeeForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullName' in fieldValues)
            temp.fullName = fieldValues.fullName ? "" : "This field is required."
        if ('username' in fieldValues)
            temp.username = fieldValues.username ? "" : "Username is not valid."
        if ('username' in fieldValues)
            temp.username = fieldValues.username.length > 6 ? "" : "Minimum 6 required."
        // if ('departmentId' in fieldValues)
        //     temp.departmentId = fieldValues.departmentId.length != 0 ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }
    
    const getrole = () => ([
        { id: 'Admin', title: 'Admin' },
        { id: 'User', title: 'User' }
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

            <Controls.Input
                name="fullName"
                label="Full Name"
                value={values.fullName}
                onChange={handleInputChange}
                error={errors.fullName}
            />
            <Controls.Input
                label="username"
                name="username"
                value={values.username}
                onChange={handleInputChange}
                error={errors.username}
            />
            <Controls.Input
                label="password"
                name="password"
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
            />
            <Controls.Select
                name="role"
                label="Role"
                value={values.role}
                onChange={handleInputChange}
                options={getrole()}
                error={errors.role}
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
        </Form>
    )
}
