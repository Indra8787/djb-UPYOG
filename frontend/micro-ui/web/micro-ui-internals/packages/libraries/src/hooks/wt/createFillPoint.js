import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useCreateFillPoint = (tenantId, type = true) => {
  return useMutation((data) => WTService.CreateFillPoint(data, tenantId));
};

export default useCreateFillPoint;
