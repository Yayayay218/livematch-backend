import React from 'react';
import {
    Create,
    Edit,
    List,
    SimpleForm,
    FormTab,
    TabbedForm,
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
    ImageInput,
    ImageField,
    BooleanField,
    SelectInput,
    BooleanInput,
    ReferenceInput,
    ReferenceField,
    Filter
} from 'admin-on-rest';

import {required} from 'admin-on-rest'
import StatusField from '../channel/StatusField'
import ActiveButton from '../channel/ActiveButton'

const ChannelFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn/>
    </Filter>
)

export const ChannelList = (props) => (
    <List {...props} filters={<ChannelFilter/>}>
        <Datagrid>
            <ReferenceField label="Match" source="match._id" reference="matches" allowEmpty>
                <TextField source="name"/>
            </ReferenceField>
            <TextField source="name"/>
            <TextField source="link"/>
            <StatusField source="status" label="Status"/>
            <ActiveButton/>
            <EditButton/>
            <DeleteButton/>
        </Datagrid>
    </List>
);

export const ChannelCreate = (props) => (
    <Create {...props}>
        <SimpleForm label="Channel's Information">
            <TextInput source="name" label="Channel Name" validate={[required]}/>
            <TextInput source="link" validate={[required]}/>
            <SelectInput source="status" choices={[
                {id: '0', name: 'inactive'},
                {id: '1', name: 'active'}
            ]}/>
            <ReferenceInput label="Assign to" source="match" reference="matches" validate={[required]}
                            allowEmpty>
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
const ChannelTitle = ({record}) => {
    return <span>Channel {record ? `"${record.name}"` : ''}</span>;
};
export const ChannelEdit = (props) => (
    <Edit title={<ChannelTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput label="Channel Id" source="id"/>
            <TextInput source="name" label="Channel Name" validate={[required]}/>
            <TextInput source="link" validate={[required]}/>
            <SelectInput source="status" choices={[
                {id: '0', name: 'inactive'},
                {id: '1', name: 'active'}
            ]}/>
            <ReferenceInput label="Assign to" source="match._id" reference="matches" validate={[required]}
                            allowEmpty>
                <SelectInput optionText="name"/>
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);