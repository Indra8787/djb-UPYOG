import React, { useMemo } from "react";
import { LabelFieldPair, CardLabel, Dropdown, CardLabelError } from "@djb25/digit-ui-react-components";
import { Controller } from "react-hook-form";
import { alphabeticalSortFunctionForTenantsBasedOnName } from "../../utils";

const SelectULB = ({ userType, t, setValue, onSelect, config, data, formData, register, errors, setError, clearErrors, formState, control }) => {
  // --- Exact same logic as Search.js (Inbox) ---
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const userInfo = Digit.UserService.getUser().info;
  const userUlbs = (ulbs || []).filter(ulb => userInfo?.roles?.some(role => role?.tenantId === ulb?.code)).sort(alphabeticalSortFunctionForTenantsBasedOnName);

  const selectedTenat = useMemo(() => {
    const filtered = (ulbs || []).filter((item) => item.code === tenantId);
    return filtered;
  }, [tenantId, ulbs]);

  return (
    <React.Fragment>
      <LabelFieldPair style={{ alignItems: 'start' }}>
        <CardLabel style={{ fontWeight: "bold" }}>{t("ES_COMMON_ULB") + " *"}</CardLabel>
        <div className="field">
          <Controller
            name={config.key}
            control={control}
            defaultValue={selectedTenat?.[0]}
            rules={{ required: true }}
            render={(props) => (
              <Dropdown
                option={userUlbs}
                optionKey={"i18nKey"}
                selected={props.value}
                select={props.onChange}
                t={t}
              />
            )}
          />
          {errors && errors[config.key] && <CardLabelError>{t(`EVENTS_TENANT_ERROR_REQUIRED`)}</CardLabelError>}
        </div>
      </LabelFieldPair>
    </React.Fragment>
  );
};

export default SelectULB;
