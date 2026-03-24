import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useUpdateFillPoint = (tenantId) => {
  return useMutation((data) => WTService.updateFillPoint(data, tenantId));
};

export default useUpdateFillPoint;
