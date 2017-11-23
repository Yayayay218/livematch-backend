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

export const HighlightList = (props) => (
    <List {...props} filter={{type: 1}}>
        <Datagrid>
            <ReferenceField label="Match" source="match._id" reference="matches" allowEmpty>
                <TextField source="name"/>
            </ReferenceField>
            <TextField source="name" label="Highlight Name"/>
            <TextField source="label"/>
            <TextField source="link" label="URL"/>
            <StatusField source="status"/>
            <BooleanField source="isRequired" label="Premium Required"/>
            <EditButton/>
            <DeleteButton/>
        </Datagrid>
    </List>
);

export const HighlightCreate = (props) => {
    return (
        <Create {...props}>
            <TabbedForm>
                <FormTab label="Information">
                    <TextInput source="name" label="Highlight Name" validate={[required]}/>
                    <TextInput source="description" validate={[required]}/>
                    <TextInput source="link" validate={[required]}/>
                    <TextInput source="label" validate={[required]}/>
                    <TextInput source="coverPhoto" label="Cover Photo" />

                    <ReferenceInput label="Assign to" source="match" reference="matches"
                                    allowEmpty>
                        <SelectInput optionText="name"/>
                    </ReferenceInput>
                    <SelectInput source="status" allowEmpty choices={[
                        {id: '0', name: 'unpublished', key:'1'},
                        {id: '1', name: 'published', key:'2'}
                    ]}/>
                    <BooleanInput label="Show Link" source="isShow"/>
                    <BooleanInput label="Show Dis" source="showDis"/>

                    <BooleanInput source="isRequired" label="Premium required" />
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


const HighlightTitle = ({record}) => {
    return <span>Highlight {record ? `"${record.name}"` : ''}</span>;
};
export const HighlightEdit = (props) => (
    <Edit title={<HighlightTitle/>} {...props}>
        <TabbedForm>
            <FormTab label="Information">
                <TextInput source="name" label="Highlight Name" validate={[required]}/>
                <TextInput source="description" validate={[required]}/>
                <TextInput source="link" validate={[required]}/>
                <TextInput source="label" validate={[required]}/>
                <TextInput source="coverPhoto" label="Cover Photo" />
                <ReferenceInput label="Assign to" source="match._id" reference="matches"
                                allowEmpty>
                    <SelectInput optionText="name"/>
                </ReferenceInput>
                <SelectInput source="status" allowEmpty choices={[
                    {id: '0', name: 'unpublished'},
                    {id: '1', name: 'published'}
                ]}/>
                <BooleanInput label="Show Link" source="isShow"/>
                <BooleanInput label="Show Dis" source="showDis"/>

                <BooleanInput source="isRequired" label="Premium required" />
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
