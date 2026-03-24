import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useUpdateFixedPoint = (tenantId) => {
  return useMutation((data) => WTService.UpdateFixedPoint(data, tenantId));
};

export default useUpdateFixedPoint;
