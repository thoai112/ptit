import React, { useState, useEffect } from 'react'
import Controls from "../../controls/Controls";
import { useForm, Form } from '../../Table/useForm';


const initialFValues = {
    id: 0,
    Name: '',
    Payload: '',
    SNI: '',
    Info: '',
    isSSL: false,
}

export default function NetworkForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('Name' in fieldValues)
            temp.Name = fieldValues.Name ? "" : "This field is required."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }
    
    const getInfo = () => ([
        { id: 'direct', title: 'Direct Connect' },
        { id: 'web', title: 'Web' },
        { id: 'sslpay', title: 'SSLPay' },
        { id: 'ssl', title: 'SSL' }
    ])

    const getisSSL =() => ([
        {id: 'true', title: 'True'},
        {id: 'false', title: 'False'}
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
                name="Name"
                label="Network Name"
                value={values.Name}
                onChange={handleInputChange}
                error={errors.Name}
            />
            <Controls.Input
                label="Payload"
                name="Payload"
                value={values.Payload}
                onChange={handleInputChange}
                error={errors.Payload}
            />
            <Controls.Input
                label="SNI"
                name="SNI"
                value={values.SNI}
                onChange={handleInputChange}
                error={errors.SNI}
            />
            <Controls.Select
                name="Info"
                label="Info"
                value={values.Info}
                onChange={handleInputChange}
                options={getInfo()}
                error={errors.Info}
            />
             <Controls.Select
                name="isSSL"
                label="SSL"
                value={values.isSSL}
                onChange={handleInputChange}
                options={getisSSL()}
                error={errors.isSSL}
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
