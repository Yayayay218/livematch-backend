import React from 'react';
import {
    Create,
    Edit,
    List,
    SimpleForm,
    DisabledInput,
    TextInput,
    DateInput,
    LongTextInput,
    ReferenceManyField,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    BooleanField,
    Filter,
    ReferenceInput,
    SelectInput
} from 'admin-on-rest';

import {required} from 'admin-on-rest'

export const NotificationsCreate = (props) => (
    <Create {...props} title={'Push Notification'}>
        <SimpleForm>
            <TextInput source="title" label='Notification Title' validate={[required]}/>
        </SimpleForm>
    </Create>
);