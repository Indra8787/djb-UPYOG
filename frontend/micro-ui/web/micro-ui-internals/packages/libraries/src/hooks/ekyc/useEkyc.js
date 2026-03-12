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