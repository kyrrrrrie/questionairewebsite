import { createStore,applyMiddleware,combineReducers } from "redux";
import changeSearchResult from './reducer'

import {thunk} from 'redux-thunk'
const Allreducers=combineReducers(
    {
        changeSearchResult,
    }
)

export default createStore(Allreducers,applyMiddleware(thunk))