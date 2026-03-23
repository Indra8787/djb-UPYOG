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
  UpdateFixedPoint: (details, tenantId) =>
    Request({
      url: Urls.wt.updatefixedpoint,
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
  CreateFixedPointSchedule: (details, tenantId) =>
    Request({
      url: Urls.wt.createfixedpointschedule,
      data: details,
      useCache: false,
      setTimeParam: false,
      userService: true,
      method: "POST",
      params: { tenantId },
      auth: true,
    }),
  SearchFixedPointSchedule: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.wt.searchfixedpointschedule,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      params: { tenantId, ...filters },
    }),

  CreateFillPoint: (details, tenantId) =>
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
  SearchFillPoint: ({ tenantId, filters, auth }) =>
    Request({
      url: Urls.wt.searchfillpoint,
      useCache: false,
      method: "POST",
      auth: auth === false ? auth : true,
      userService: auth === false ? auth : true,
      data: { criteria: { tenantId, ...filters } },
    }),
};
