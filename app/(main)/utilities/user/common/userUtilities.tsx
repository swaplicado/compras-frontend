import React from "react";
import Cookies from 'js-cookie';
import constants from '@/app/constants/constants';

export const getFunctionalArea = () => {
    let areas = Cookies.get('functional_areas') ? JSON.parse(Cookies.get('functional_areas') || '[]') : [];
    areas = Array.isArray(areas) ? areas : [areas];
    if (areas.length == 1) {
        return areas[0];
    } else {
        return areas;
    }
};

export const getOUser = () => {
    const userId = Cookies.get('userId') ? JSON.parse(Cookies.get('userId') || '') : null;
    const userName = Cookies.get('nameUser') ? Cookies.get('nameUser') || '' : null;
    const userExternalId = Cookies.get('userExternalId') ? JSON.parse(Cookies.get('userExternalId') || '') : null;
    const userGroups = Cookies.get('groups') ? JSON.parse(Cookies.get('groups') || '[]') : [];
    const functional_areas = getFunctionalArea();
    const partnerId = Cookies.get('partnerId') ? JSON.parse(Cookies.get('partnerId') || '') : null;
    const partnerName = Cookies.get('partnerName') ? JSON.parse(Cookies.get('partnerName') || '') : null;
    const partnerCountry = Cookies.get('partnerCountry') ? JSON.parse(Cookies.get('partnerCountry') || '') : null;

    let groups = [];
    if (!Array.isArray(userGroups)) {
        groups = [userGroups];
    } else {
        groups = userGroups;
    }

    if (groups.includes(constants.ROLES.COMPRADOR_ID)) {
        return { 
            isInternalUser: true,
            isProvider: false,
            oUser: { id: userId, external_id: userExternalId, name: userName, functional_areas: functional_areas, groups: groups },
            oProvider: {id: null, external_id: null, name: '', country: null, isProviderMexico: null}
        }
    }

    if (groups.includes(constants.ROLES.PROVEEDOR_ID)) {
        return { 
            isInternalUser: false,
            isProvider: true,
            oUser: { id: userId, external_id: userExternalId, name: userName, functional_areas: functional_areas, groups: groups },
            oProvider: {id: partnerId, external_id: userExternalId, name: partnerName, country: partnerCountry, isProviderMexico: partnerCountry == constants.COUNTRIES.MEXICO_ID}
        }
    }
}