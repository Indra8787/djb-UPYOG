import { useMutation } from "react-query";
import { WTService } from "../../services/elements/WT";

export const useCreateFixedPointSchedule = (tenantId) => {
  return useMutation((data) => WTService.CreateFixedPointSchedule(data, tenantId));
};

export default useCreateFixedPointSchedule;
