import { useQuery, useQueryClient, useMutation } from "react-query";

// get connection
export const useGetConnection = ({ tenantId, details }, config = {}) => {
    const client = useQueryClient();

    const { isLoading, error, data } = useQuery(
        ["ekycGetConnection", tenantId, details?.kno],
        () => Digit.EkycService.get_connection(details, tenantId),
        config
    );

    return {
        isLoading,
        error,
        data,
        revalidate: () =>
            client.invalidateQueries(["ekycGetConnection", tenantId, details?.kno]),
    };
};

// validate user
export const useValidateUser = (tenantId, config = {}) => {
    return useMutation((data) => Digit.EkycService.validate_user(data, tenantId), config);
};

// get connection type
export const useGetPropertyType = (tenantId, config = {}) => {
    return Digit.Hooks.useCustomMDMS(
        tenantId,
        "ws-services-calculation",
        [{ name: "propertyTypeV2" }],
        config
    );
};

// get connection category
export const useGetConnectionTypeV2 = (tenantId, config = {}) => {
    return Digit.Hooks.useCustomMDMS(
        tenantId,
        "ws-services-calculation",
        [{ name: "connectionTypeV2" }],
        config
    );
};

// get user type
export const useGetUserType = (tenantId, config = {}) => {
    return Digit.Hooks.useCustomMDMS(
        tenantId,
        "ws-services-calculation",
        [{ name: "userTypeV2" }],
        config
    );
};

// get floor count
export const useGetFloorCount = (tenantId, config = {}) => {
    return Digit.Hooks.useCustomMDMS(
        tenantId,
        "ws-services-calculation",
        [{ name: "floorCount" }],
        config
    );
};