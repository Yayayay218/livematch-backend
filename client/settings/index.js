import React from 'react';
import {
    Create,
    Edit,
    List,
    SimpleForm,
    DisabledInput,
    TextInput,
    DateInput,
    NumberInput,
    LongTextInput,
    ReferenceField,
    ReferenceManyField,
    ReferenceInput,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    SelectInput,
    ImageInput,
    ImageField,
    FormTab,
    TabbedForm,
    NullableBooleanInput,
    BooleanField,
    BooleanInput
} from 'admin-on-rest';

import {required, minValue, maxValue} from 'admin-on-rest';

export const SettingList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <BooleanField source="status" />
            <EditButton/>
        </Datagrid>
    </List>
);

//export const PostCreate = (props) =>  {return ()}
export const SettingCreate = (props) => {
    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="name"/>
                <BooleanInput source="status" label="Status"/>
            </SimpleForm>
        </Create>
    );
};

export const SettingEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name"/>
            <BooleanInput source="status" label="Status"/>
        </SimpleForm>
    </Edit>
);
