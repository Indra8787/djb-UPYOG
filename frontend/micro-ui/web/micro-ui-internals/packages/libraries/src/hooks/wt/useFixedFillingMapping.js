import { useMutation, useQueryClient } from "react-query";
import { WTService } from "../../services/elements/WT";

const useFixedFillingMapping = (tenantId, config = {}) => {
  const queryClient = useQueryClient();
  return useMutation((details) => WTService.fixedFillingMapping(details, tenantId), {
    ...config,
    onSuccess: () => {
      queryClient.invalidateQueries(["FIXED_POINT_SEARCH", tenantId]);
    },
  });
};

export default useFixedFillingMapping;
