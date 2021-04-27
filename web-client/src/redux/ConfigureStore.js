import {createStore, combineReducers, applyMiddleware} from 'redux';
import { Auth } from './auth';
import { Users } from "./users";
import { Reagents } from "./reagents";
import { SecReagents } from "./secondaryReagents";
import { Tests } from "./tests";
import { TestTypes } from "./testTypes";
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            reagents: Reagents,
            secReagents: SecReagents,
            tests: Tests,
            testTypes: TestTypes,
            auth: Auth,
            users: Users
        }),
        // supply as args, once we do it they become available within the app
        applyMiddleware(thunk, logger)
    );

    return store;
}