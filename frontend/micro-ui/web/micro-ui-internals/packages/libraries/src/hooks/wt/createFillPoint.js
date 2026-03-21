import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useCreateFillPoint = (tenantId, type = true) => {
  return useMutation((data) => WTService.CreateFixedPoint(data, tenantId));
};

export default useCreateFillPoint;
