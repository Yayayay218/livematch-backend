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
    NumberInput
} from 'admin-on-rest';

import {required} from 'admin-on-rest'
import StatusField from "./StatusField";
import DateTimeInput from './DateTimeInput'
import EmbeddedManyInput from './AddManyChannels';

export const TimeFormat = v => {
    // console.log("OpenTimeFormat: ", v);
    if (typeof v != 'undefined') {
        return parseInt(v / 100) + ":" + (v % 100 ? v % 100 : '00');
    } else {
        return '00:00';
    }
}

export const TimeParse = v => {
    var ar = v.split(":");
    return ar[0] + ar[1]
}

export const MatchList = (props) => (
    <List {...props} sort={{field: 'index', order: 'ASC'}}>
        <Datagrid>
            <TextField source="index" label="Order Number"/>
            <TextField source="name" label="Match"/>
            <TextField source="date" label="Date"/>
            {/*<TimeField source="time" label="Time"/>*/}
            <StatusField source="status" label="Status"/>
            <BooleanField source="isRequired" label="Premium Required"/>
            <EditButton/>
            <DeleteButton/>
        </Datagrid>
        {/*<CustomDragGrid/>*/}
    </List>
);

export const MatchCreate = (props) => (
    <Create {...props}>
        <SimpleForm label="Match's Information">
            <NumberInput source="index" label="Order Number"/>
            <TextInput source="name" label="Match Name" validate={[required]}/>
            <TextInput source="description" validate={[required]}/>
            <DateTimeInput source="date"/>
            <SelectInput source="status" choices={[
                {id: '0', name: 'Unpublished'},
                {id: '1', name: 'Postponed'},
                {id: '2', name: 'Upcoming'},
                {id: '3', name: 'Live'}
            ]}/>
            <EmbeddedManyInput source="channels">
                <TextInput source="name" label="Channel Name" validate={[required]}/>
                <TextInput source="link" validate={[required]}/>
                <SelectInput source="status" choices={[
                    {id: '0', name: 'inactive'},
                    {id: '1', name: 'active'}
                ]}/>
                <BooleanInput label="Show Link" source="isShow"/>
                <BooleanInput label="Show Dis" source="showDis"/>
            </EmbeddedManyInput>
            <BooleanInput label="Premium Required" source="isRequired"/>
            {/*<Channel/>*/}
        </SimpleForm>
    </Create>
);
const MatchTitle = ({record}) => {
    return <span>Match {record ? `"${record.name}"` : ''}</span>;
};
export const MatchEdit = (props) => (
    <Edit title={<MatchTitle/>} {...props}>
        <SimpleForm>
            <DisabledInput label="Match Id" source="id"/>
            <NumberInput source="index" label="Order Number"/>
            <TextInput source="name" validate={[required]}/>
            <TextInput source="description"/>
            <DateTimeInput source="date"/>
            <EmbeddedManyInput source="channels">
                <TextInput source="name" label="Channel Name" validate={[required]}/>
                <TextInput source="link" validate={[required]}/>
                <SelectInput source="status" choices={[
                    {id: '0', name: 'inactive'},
                    {id: '1', name: 'active'}
                ]}/>
                <BooleanInput label="Show Link" source="isShow"/>
                <BooleanInput label="Show Dis" source="showDis"/>

            </EmbeddedManyInput>
            <SelectInput source="status" choices={[
                {id: '0', name: 'Unpublished'},
                {id: '1', name: 'Postponed'},
                {id: '2', name: 'Upcoming'},
                {id: '3', name: 'Live'}
            ]} optionText="name"/>
            <BooleanInput label="Premium Required" source="isRequired"/>
        </SimpleForm>
    </Edit>
);