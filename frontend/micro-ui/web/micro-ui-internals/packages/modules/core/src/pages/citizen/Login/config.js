export const loginSteps = [
  {
    label: "CORE_REGISTRATION_STEP_1",
    texts: {
      header: "CS_LOGIN_PROVIDE_MOBILE_NUMBER",
      cardText: "CS_LOGIN_TEXT",
      nextText: "CS_COMMONS_NEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
    inputs: [
      {
        label: "CORE_COMMON_MOBILE_NUMBER",
        type: "text",
        name: "mobileNumber",
        error: "CORE_COMMON_INVALID_MOBILE",
        validation: {
          required: true,
          minLength: 10,
          maxLength: 10,
        },
      },
    ],
  },
  {
    label: "CORE_REGISTRATION_STEP_2",
    texts: {
      header: "CS_LOGIN_OTP",
      cardText: "CS_LOGIN_OTP_TEXT",
      nextText: "CS_COMMONS_NEXT",
      submitBarLabel: "CS_COMMONS_NEXT",
    },
  },
  {
    label: "CORE_REGISTRATION_STEP_3",
    texts: {
      header: "CORE_REGISTER_HEADER",
      cardText: "CORE_REGISTER_DESC",
      nextText: "CORE_COMPLETE_REGISTRATION",
      submitBarLabel: "CORE_COMPLETE_REGISTRATION",
    },
    inputs: [
      {
        label: "CORE_COMMON_NAME",
        type: "text",
        name: "name",
        error: "CORE_COMMON_INVALID_NAME",
        validation: {
          required: true,
          minLength: 1,
          pattern: "^[a-zA-Z ]{1,50}$",
        },
      },
      {
        label: "CORE_COMMON_DOB",
        type: "date",
        name: "dob",
        error: "CORE_COMMON_INVALID_DOB",
        validation: {
          required: true,
        },
      },
    ],
  },
];
