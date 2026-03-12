import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const EkycService = {
    get_connection: (details, tenantId) =>
        Request({
            url: Urls.ekyc.get_connection,
            data: details,
            useCache: false,
            method: "POST",
            params: { tenantId },
            auth: true,
            userService: true,
        }),
    validate_user: (data, tenantId) =>
        Request({
            url: Urls.ekyc.validate_user,
            data: data,
            useCache: false,
            method: "POST",
            params: { tenantId },
            auth: true,
            userService: true,
        }),
};
