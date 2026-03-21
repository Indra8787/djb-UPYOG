import { useQuery, useQueryClient } from "react-query";

const useFillPointSearch = ({ tenantId, filters, auth }, config = {}) => {
  const client = useQueryClient();

  const args = tenantId ? { tenantId, filters, auth } : { filters, auth };

  const defaultSelect = (data) => {
    return data;
  };

  const { isLoading, error, data, isSuccess, refetch } = useQuery(
    ["wtFixedPointSearchList", tenantId, filters, auth, config],
    () => Digit.WTService.SearchFixedPoint(args),
    {
      select: defaultSelect,
      ...config,
    }
  );

  return {
    isLoading,
    error,
    data,
    isSuccess,
    refetch,
    revalidate: () => client.invalidateQueries(["wtFixedPointSearchList", tenantId, filters, auth]),
  };
};

export default useFillPointSearch;
