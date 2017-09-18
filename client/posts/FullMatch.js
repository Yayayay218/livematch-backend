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
    BooleanInput,
    BooleanField
} from 'admin-on-rest';

import {required, minValue, maxValue} from 'admin-on-rest';
import StatusField from '../posts/StatusField'

export const FullMatchList = (props) => (
    <List {...props} filter={{type: 0}}>
        <Datagrid>
            <ReferenceField label="Match" source="match._id" reference="matches" allowEmpty>
                <TextField source="name"/>
            </ReferenceField>
            <TextField source="name" label="Full Match Name"/>
            <TextField source="label"/>
            <TextField source="link" label="URL"/>
            <StatusField source="status"/>
            <BooleanField source="isRequired" label="Premium Required"/>
            <EditButton/>
            <DeleteButton/>
        </Datagrid>
    </List>
);

export const FullMatchCreate = (props) => {
    return (
        <Create {...props}>
            <TabbedForm>
                <FormTab label="Information">
                    <TextInput source="name" label="Full Match Name" validate={[required]}/>
                    <TextInput source="description" validate={[required]}/>
                    <TextInput source="link" validate={[required]}/>
                    <TextInput source="label" validate={[required]}/>
                    <ReferenceInput label="Assign to" source="match" reference="matches" validate={[required]}
                                    allowEmpty>
                        <SelectInput optionText="name"/>
                    </ReferenceInput>
                    <SelectInput source="status" allowEmpty choices={[
                        {id: '0', name: 'unpublished'},
                        {id: '1', name: 'published'}
                    ]}/>
                    <NullableBooleanInput source="isRequired" label="Premium required" validate={[required]}/>
                </FormTab>

                <FormTab label="Cover Photo">
                    <ImageInput source="file" label="Cover Photo" accept="image/*">
                        <ImageField source="src" title="title"/>
                    </ImageInput>
                </FormTab>
            </TabbedForm>
        </Create>
    );
};


const FullMatchTitle = ({record}) => {
    return <span>FullMatch {record ? `"${record.name}"` : ''}</span>;
};
export const FullMatchEdit = (props) => (
    <Edit title={<FullMatchTitle/>} {...props}>
        <TabbedForm>
            <FormTab label="Information">
                <TextInput source="name" label="Full Match Name" validate={[required]}/>
                <TextInput source="description" validate={[required]}/>
                <TextInput source="link" validate={[required]}/>
                <TextInput source="label" validate={[required]}/>
                <ReferenceInput label="Assign to" source="match._id" reference="matches" validate={[required]}
                                allowEmpty>
                    <SelectInput optionText="name"/>
                </ReferenceInput>
                <SelectInput source="status" allowEmpty choices={[
                    {id: '0', name: 'unpublished'},
                    {id: '1', name: 'published'}
                ]}/>
                <NullableBooleanInput source="isRequired" label="Premium required" validate={[required]}/>
            </FormTab>
            <FormTab label="Cover Photo">
                <ImageField source='coverPhoto' title='title'/>
                <ImageInput source="file" label="Cover Photo" accept="image/*">
                    <ImageField source="src" title="title"/>
                </ImageInput>
            </FormTab>
        </TabbedForm>
    </Edit>
);
