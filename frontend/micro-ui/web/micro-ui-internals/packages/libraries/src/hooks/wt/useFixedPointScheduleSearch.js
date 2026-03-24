import { useQuery } from "react-query";
import { WTService } from "../../services/elements/WT";

const useFixedPointScheduleSearch = (tenantId, filters, config = {}) => {
  return useQuery(["FIXED_POINT_SCHEDULE_SEARCH", tenantId, filters], () => WTService.SearchFixedPointSchedule({ tenantId, filters }), config);
};

export default useFixedPointScheduleSearch;
