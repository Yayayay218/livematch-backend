import React from 'react';
import {render} from 'react-dom';
import {
    Admin, Resource, fetchUtils, Delete
} from 'admin-on-rest';

import authClient from './authClient'
import {MatchList, MatchCreate, MatchEdit} from './matches/index';
import {FullMatchList, FullMatchEdit, FullMatchCreate} from './posts/FullMatch'
import {HighlightCreate, HighlightEdit, HighlightList } from "./posts/Highlight"
import {ChannelCreate, ChannelEdit, ChannelList} from "./channel/index"
import {NotificationsCreate} from "./notifications/index"
import {SettingList, SettingCreate, SettingEdit} from "./settings/index"
// import {Dashboard} from './dashboard';

//  Import REST APIs
import customRestClient from './rest/restClient';
import addUploadFeature from './rest/addUploadFeature';


const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' })
    }
    const token = localStorage.getItem('token');
    options.headers.set('Authorization', token);
    return fetchUtils.fetchJson(url, options);
};

const apiUrl = '/api';
const restClient = customRestClient(apiUrl, httpClient);
const uploadCapableClient = addUploadFeature(restClient);

render(
    <Admin authClient={authClient} restClient={uploadCapableClient} title="My Dashboard">
        <Resource name="matches" list={MatchList} edit={MatchEdit} create={MatchCreate} remove={Delete}/>
        <Resource name="fullMatches" list={FullMatchList} create={FullMatchCreate} edit={FullMatchEdit} options={{ label: 'Full Matches'}} remove={Delete}/>
        <Resource name="highlights" list={HighlightList} create={HighlightCreate} edit={HighlightEdit} options={{ label: 'Highlights'}} remove={Delete}/>
        <Resource name="channels" list={ChannelList} create={ChannelCreate} edit={ChannelEdit} remove={Delete}/>
        <Resource name="customNotification" list={NotificationsCreate} options={{label: 'Notifications'}}/>
        <Resource name="settings" list={SettingList} edit={SettingEdit} create={SettingCreate}/>
    </Admin>,
    document.getElementById('root')
);
