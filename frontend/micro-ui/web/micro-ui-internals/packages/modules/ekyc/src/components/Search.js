import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Label, LinkLabel, Dropdown, SubmitBar } from "@djb25/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SearchApplication = ({ onSearch, searchFields, searchParams }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, reset, watch, control } = useForm({
        defaultValues: searchParams,
    });

    const onSubmitInput = (data) => {
        onSearch(data);
    };

    function clearSearch() {
        const resetValues = searchFields.reduce((acc, field) => ({ ...acc, [field?.name]: "" }), {});
        reset(resetValues);
        onSearch({ ...resetValues });
    }

    return (
        <form onSubmit={handleSubmit(onSubmitInput)} className="ekyc-search-container">
            <div className="search-inner">
                <div className="search-field-wrapper">
                    <div className="search-fields-container">
                        {searchFields?.map((input) => (
                            <div key={input.name} className="search-field">
                                <Label>{input.label}</Label>
                                {input.type === "dropdown" ? (
                                    <Controller
                                        control={control}
                                        name={input.name}
                                        render={(props) => (
                                            <Dropdown
                                                selected={props.value}
                                                select={(val) => {
                                                    props.onChange(val);
                                                }}
                                                onBlur={props.onBlur}
                                                option={input.options}
                                                optionKey={input.optionsKey}
                                                t={t}
                                            />
                                        )}
                                    />
                                ) : (
                                    <TextInput
                                        {...input}
                                        inputRef={register}
                                        watch={watch}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="search-action-container">
                        <SubmitBar
                            label={t("ES_COMMON_SEARCH")}
                            submit={true}
                        />
                        <LinkLabel onClick={clearSearch}>
                            {t("ES_COMMON_CLEAR_ALL")}
                        </LinkLabel>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SearchApplication;
