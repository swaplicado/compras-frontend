import React from "react";
import axios from "axios";
import constants from "@/app/constants/constants";

interface getlFlowAuthorizationProps {
    setLFlowAuthorization: React.Dispatch<React.SetStateAction<any[]>>;
    showToast?: (type: 'success' | 'info' | 'warn' | 'error', message: string, summaryText?: string) => void;
    userExternalId: any;
}
export const getFlowAuthorizations = async ( props: getlFlowAuthorizationProps ) => {
    try {
        const route = constants.ROUTE_GET_FLOW_AUTHORIZATIONS;
        const response = await axios.get(constants.API_AXIOS_GET, {
            params: {
                route: route,
                id_external_system: constants.ID_EXTERNAL_SYSTEM,
                id_external_user: props.userExternalId,
                id_actor_type: 2,
                id_model_type: constants.ID_MODEL_TYPE_DPS,
                id_flow_type: 1,
                id_resource_type: constants.RESOURCE_TYPE_PUR_INVOICE
            }
        });

        if (response.status === 200) {
            const data = response.data.data || [];
            let lFlowAuthorization: any[] = [];
            
            for (const item of data.flow_models) {
                lFlowAuthorization.push({
                    id: item.id,
                    name: item.name,
                    description: item.description
                });
            }
            
            props.setLFlowAuthorization(lFlowAuthorization);
        } else {
            throw new Error(`${response.statusText}`);
        }
    } catch (error: any) {
        
    }
}