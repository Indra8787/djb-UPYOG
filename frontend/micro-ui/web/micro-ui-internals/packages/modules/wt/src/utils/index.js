export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};
export const checkForNotNull = (value = "") => {
  return value && value != null && value != undefined && value != "" ? true : false;
};

export const checkForNA = (value = "") => {
  return checkForNotNull(value) ? value : "NA";
};

export const convertTo12HourFormat = (time) => {
  if (!time) return "NA"; // Handle empty or invalid values

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "NA"; // Handle empty or invalid values

  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
};

// for replacing digit-ui
export const APPLICATION_PATH = "/digit-ui";

//Custom function which will return the formdata and inside formdata we are building the Payload.
export const waterTankerPayload = (data) => {
  const formdata = {
    waterTankerBookingDetail: {
      tenantId: data?.tenantId,
      tankerType: data?.requestDetails?.tankerType?.code,
      waterType: data?.requestDetails?.waterType?.code,
      tankerQuantity: data?.requestDetails?.tankerQuantity?.code,
      waterQuantity: data?.requestDetails?.waterQuantity?.code,
      description: data?.requestDetails?.description,
      deliveryDate: data?.requestDetails?.deliveryDate,
      deliveryTime: data?.requestDetails?.deliveryTime,
      extraCharge: data?.requestDetails?.extraCharge ? "Y" : "N",
      addressDetailId: data?.address?.addressDetailId || "",
      applicantDetail: {
        name: data?.owner?.applicantName,
        mobileNumber: data?.owner?.mobileNumber,
        alternateNumber: data?.owner?.alternateNumber,
        emailId: data?.owner?.emailId,
      },
      address: {
        addressType: data?.address?.addressType?.code,
        pincode: data?.address?.pincode,
        city: data?.address?.city?.city?.name,
        cityCode: data?.address?.city?.city?.code,
        addressLine1: data?.address?.addressLine1,
        addressLine2: data?.address?.addressLine2,
        locality: data?.address?.locality?.i18nKey,
        localityCode: data?.address?.locality?.code,
        streetName: data?.address?.streetName,
        houseNo: data?.address?.houseNo,
        landmark: data?.address?.landmark,
        latitude: data?.address?.latitude,
        longitude: data?.address?.longitude,
      },

      WTfileStoreId: data?.requestDetails?.fileStoreId,
      bookingStatus: "BOOKING_CREATED",
      workflow: {
        action: "APPLY",
        comments: "",
        businessService: "watertanker",
        moduleName: "request-service.water_tanker",
      },
    },
  };
  return formdata;
};
export const mobileToiletPayload = (data) => {
  const formdata = {
    mobileToiletBookingDetail: {
      tenantId: data?.tenantId,
      description: data?.toiletRequestDetails?.specialRequest,
      noOfMobileToilet: data?.toiletRequestDetails?.mobileToilet?.code,
      deliveryFromDate: data?.toiletRequestDetails?.deliveryfromDate,
      deliveryToDate: data?.toiletRequestDetails?.deliverytoDate,
      deliveryFromTime: data?.toiletRequestDetails?.deliveryfromTime,
      deliveryToTime: data?.toiletRequestDetails?.deliverytoTime,
      addressDetailId: data?.address?.addressDetailId || "",
      applicantDetail: {
        name: data?.owner?.applicantName,
        mobileNumber: data?.owner?.mobileNumber,
        alternateNumber: data?.owner?.alternateNumber,
        emailId: data?.owner?.emailId,
      },
      address: {
        addressType: data?.address?.addressType?.code,
        pincode: data?.address?.pincode,
        city: data?.address?.city?.city?.name,
        cityCode: data?.address?.city?.city?.code,
        addressLine1: data?.address?.addressLine1,
        addressLine2: data?.address?.addressLine2,
        locality: data?.address?.locality?.i18nKey,
        localityCode: data?.address?.locality?.code,
        streetName: data?.address?.streetName,
        houseNo: data?.address?.houseNo,
        landmark: data?.address?.landmark,
      },

      bookingStatus: "BOOKING_CREATED",
      workflow: {
        action: "APPLY",
        comments: "",
        businessService: "mobileToilet",
        moduleName: "request-service.mobile_toilet",
      },
    },
  };
  return formdata;
};

export const treePruningPayload = (data) => {
  const formdata = {
    treePruningBookingDetail: {
      tenantId: data?.tenantId,
      latitude: data?.treePruningRequestDetails?.latitude,
      longitude: data?.treePruningRequestDetails?.longitude,
      reasonForPruning: data?.treePruningRequestDetails?.reasonOfPruning?.code,
      applicantDetail: {
        name: data?.owner?.applicantName,
        mobileNumber: data?.owner?.mobileNumber,
        alternateNumber: data?.owner?.alternateNumber,
        emailId: data?.owner?.emailId,
      },
      documentDetails: [
        {
          documentType: "Site Photograph",
          fileStoreId: data?.treePruningRequestDetails?.supportingDocumentFile,
        },
      ],
      address: {
        addressType: data?.address?.addressType?.code,
        pincode: data?.address?.pincode,
        city: data?.address?.city?.city?.name,
        cityCode: data?.address?.city?.city?.code,
        addressLine1: data?.address?.addressLine1,
        addressLine2: data?.address?.addressLine2,
        locality: data?.address?.locality?.i18nKey,
        localityCode: data?.address?.locality?.code,
        streetName: data?.address?.streetName,
        houseNo: data?.address?.houseNo,
        landmark: data?.address?.landmark,
      },

      bookingStatus: "BOOKING_CREATED",
      workflow: {
        action: "APPLY",
        comments: "",
        businessService: "treePruning",
        moduleName: "request-service.tree_pruning",
      },
    },
  };
  return formdata;
};

export const fillingPointPayload = (data) => {
  return {
    RequestInfo: {
      userInfo: {
        uuid: Digit.UserService.getUser()?.info?.uuid || "user-123",
      },
    },
    fillingPoints: [
      {
        id: data?.id,
        bookingId: data?.bookingId,
        tenantId: data?.tenantId,
        fillingPointName: data?.owner?.fillingPointName,
        emergencyName: data?.owner?.emergencyName,
        eeName: data?.owner?.eeName,
        eeEmail: data?.owner?.eeEmail,
        eeMobile: data?.owner?.eeMobile,
        aeName: data?.owner?.aeName,
        aeEmail: data?.owner?.aeEmail,
        aeMobile: data?.owner?.aeMobile,
        jeName: data?.owner?.jeName,
        jeEmail: data?.owner?.jeEmail,
        jeMobile: data?.owner?.jeMobile,
        address: {
          houseNo: data?.address?.houseNo,
          streetName: data?.address?.streetName,
          addressLine1: data?.address?.addressLine1,
          addressLine2: data?.address?.addressLine2,
          landmark: data?.address?.landmark,
          city: data?.address?.city?.name || data?.address?.city || "",
          cityCode: data?.address?.cityCode || data?.address?.city?.code || "",
          locality: data?.address?.localityCode || data?.address?.locality?.code || "",
          localityCode: data?.address?.localityCode || data?.address?.locality?.code || "",
          pincode: data?.address?.pincode,
          latitude: data?.address?.latitude,
          longitude: data?.address?.longitude,
          type: "FILLING-POINT",
        },
      },
    ],
  };
};

export const fixedPointPayload = (data) => {
  return {
    waterTankerBookingDetail: {
      bookingId: data?.bookingId || "",
      bookingNo: data?.bookingNo || null,
      tenantId: data?.tenantId,
      mobileNumber: data?.owner?.mobileNumber || "",
      applicantDetail: {
        applicantId: data?.owner?.applicantId || null,
        bookingId: data?.bookingId || "",
        name: data?.owner?.name || data?.owner?.applicantName || "",
        mobileNumber: data?.owner?.mobileNumber || "",
        alternateNumber: data?.owner?.alternateNumber || "",
        emailId: data?.owner?.emailId || "",
        type: "FIXED-POINT",
      },

      address: {
        addressId: data?.address?.addressId || null,
        applicantId: data?.address?.applicantId || null,
        houseNo: data?.address?.houseNo || "",
        streetName: data?.address?.streetName || "",
        addressLine1: data?.address?.addressLine1 || "",
        addressLine2: data?.address?.addressLine2 || "",
        landmark: data?.address?.landmark || "",
        city: data?.address?.city?.name || data?.address?.city || "",
        cityCode: data?.address?.cityCode || data?.address?.city?.code || "DJB",
        locality: data?.address?.locality?.label || data?.address?.locality?.name || data?.address?.locality || "",
        localityCode: data?.address?.locality?.code || data?.address?.localityCode || "",
        latitude: data?.address?.latitude || "",
        longitude: data?.address?.longitude || "",
        pincode: data?.address?.pincode || "",
        type: "FIXED-POINT",
      },
    },
  };
};