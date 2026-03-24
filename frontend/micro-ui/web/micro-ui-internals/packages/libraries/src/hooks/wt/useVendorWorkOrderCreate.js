import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useVendorWorkOrderCreate = (tenantId) => {
  return useMutation((data) => WTService.createWorkOrder(data, tenantId));
};

export default useVendorWorkOrderCreate;
