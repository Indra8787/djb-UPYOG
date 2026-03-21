import Urls from "../atoms/urls";
import { Request } from "../atoms/Utils/Request";

export const WTService = {
  create: (details, tenantId) =>
    Request({
      url: Urls.wt.create,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  update: (details, tenantId) =>
    Request({
      url: Urls.wt.update,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  search: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.wt.search,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),
  CreateFixedPoint: (details, tenantId) =>
    Request({
      url: Urls.wt.createfixedpoint,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  SearchFixedPoint: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.wt.searchfixedpoint,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),

  createFillPoint: (details, tenantId) =>
    Request({
      url: Urls.wt.createfillpoint,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: {},
      auth: true,
    }),
  searchFillPoint: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.wt.searchfillpoint,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),
};
