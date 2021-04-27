import * as ActionTypes from './ActionTypes';

export const InitialReagentInfo = {
    reagentName: '',
    supplier: '',
    lotNr: '',
    catNr: '',
    expiryDate: null,
    dateReceived: null,
    storageLocation: null,
}

export const InitialEditReagent = {
    reagentName: '',
    supplier: '',
    lotNr: '',
    catNr: '',
    expiryDate: '',
    dateReceived: null,
    condition: null,
    storageLocation: null,
    comment: '',
    action: '',
}

export const InitialAccountInfo = {
    fName: 'Anne',
    lName: 'Miller',
    email: 'anne.miller@gosh.nhs.com',
    role: 'Lab Supervisor',
    password: '1234',
    oldPassword: null,
    newPassword: null,
}

