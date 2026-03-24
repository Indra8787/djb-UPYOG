import React, { useState, useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { CardLabel, TextInput, Dropdown, FormStep, Card } from "@djb25/digit-ui-react-components";

import { useLocation } from "react-router-dom";

const allOptions = [
  { name: "Correspondence", code: "CORRESPONDENCE", i18nKey: "COMMON_ADDRESS_TYPE_CORRESPONDENCE" },
  { name: "Permanent", code: "PERMANENT", i18nKey: "COMMON_ADDRESS_TYPE_PERMANENT" },
  { name: "Other", code: "OTHER", i18nKey: "COMMON_ADDRESS_TYPE_OTHER" },
];

const AddFixFillAddress = ({ t, config, formData, onSelect, isEdit, userDetails }) => {
  const { data: allCities } = Digit.Hooks.useTenants();
  const { control } = useForm();
  const location = useLocation();

  const usedAddressTypes = location.state?.usedAddressTypes || [];
  const user = Digit.UserService.getUser().info;

  const convertToObject = (val) => (val ? { i18nKey: val, code: val, value: val } : null);

  // ✅ STATES
  const [pincode, setPincode] = useState(formData?.address?.pincode || "");
  const [city, setCity] = useState(formData?.address?.city || null);
  const [locality, setLocality] = useState(formData?.address?.locality || null);
  const [houseNo, setHouseNo] = useState(formData?.address?.houseNo || "");
  const [streetName, setStreetName] = useState(formData?.address?.streetName || "");
  const [landmark, setLandmark] = useState(formData?.address?.landmark || "");
  const [addressLine1, setAddressLine1] = useState(formData?.address?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(formData?.address?.addressLine2 || "");
  const [addressType, setAddressType] = useState(formData?.address?.addressType || null);
  const [latitude, setLatitude] = useState(formData?.address?.latitude || "");
  const [longitude, setLongitude] = useState(formData?.address?.longitude || "");
  const [selectedAddress, setSelectedAddress] = useState("");
  const isInitialized = useRef(!isEdit);
  const lastSyncedAddress = useRef(null);
  const lastBookingId = useRef(null);

  // ✅ Address type filter
  const availableAddressTypeOptions = useMemo(() => {
    if (usedAddressTypes.length === 3) {
      return allOptions.filter((opt) => opt.code === "OTHER");
    }
    return allOptions.filter((opt) => !usedAddressTypes.includes(opt.code));
  }, [usedAddressTypes]);

  // ✅ Fetch localities
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(city?.code, "revenue", { enabled: !!city }, t);

  const structuredLocality =
    fetchedLocalities?.map((local) => ({
      i18nKey: local.i18nkey,
      code: local.code,
      label: local.label,
    })) || [];

  // ✅ Sync with formData if it changes (edit mode) - only run once or when externally changed
  useEffect(() => {
    // Reset if bookingId changes
    if (formData?.bookingId && lastBookingId.current !== formData.bookingId) {
      isInitialized.current = false;
      lastBookingId.current = formData.bookingId;
    }

    if (formData?.address && !isInitialized.current && allCities) {
      const addressData = formData.address;

      // Phase 1: Sync basic fields (City must be set for fetchedLocalities to trigger)
      const cityObj =
        allCities.find((c) => c.code === addressData.cityCode || c.code === addressData.city || c.name === addressData.city) || addressData.city;

      if (cityObj && (!city || (city.code !== cityObj.code && city !== cityObj))) {
        setCity(cityObj || null);
      }
      
      setPincode(addressData.pincode || "");
      setHouseNo(addressData.houseNo || "");
      setStreetName(addressData.streetName || "");
      setLandmark(addressData.landmark || "");
      setAddressLine1(addressData.addressLine1 || "");
      setAddressLine2(addressData.addressLine2 || "");
      setAddressType(allOptions.find((a) => a.code === addressData.addressType) || addressData.addressType || null);
      setLatitude(addressData.latitude || "");
      setLongitude(addressData.longitude || "");

      // Phase 2: Wait for fetchedLocalities or if there is no cityCode to wait for
      if (fetchedLocalities || !addressData.cityCode) {
        console.log("AddFixFillAddress: Initialization Phase 2 - Setting locality", { cityCode: addressData.cityCode, fetched: !!fetchedLocalities });
        if (fetchedLocalities) {
          const localityObj = fetchedLocalities.find(
            (l) => l.code === addressData.localityCode || l.code === addressData.locality || l.i18nkey === addressData.locality
          );
          setLocality(localityObj || addressData.locality || null);
        } else {
          setLocality(addressData.locality || null);
        }

        // Only mark as fully initialized once everything (locality included) is ready
        isInitialized.current = true;
        lastSyncedAddress.current = JSON.stringify(addressData);
        console.log("AddFixFillAddress: Fully Initialized");
      } else {
        console.log("AddFixFillAddress: Waiting for localities to load for city:", cityObj?.code);
      }
    }
  }, [formData?.address, city, allCities, fetchedLocalities]);

  // ✅ Get current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      },
      () => console.log("Location blocked")
    );
  }, []);

  // ✅ Auto-fill from selected address
  useEffect(() => {
    if (selectedAddress && Object.keys(selectedAddress).length) {
      setPincode(selectedAddress.pinCode);
      setCity(allCities?.find((c) => c.name === selectedAddress.city));
      setLocality(fetchedLocalities?.find((l) => l.i18nkey === selectedAddress.locality));
      setHouseNo(selectedAddress.houseNumber);
      setStreetName(selectedAddress.streetName);
      setLandmark(selectedAddress.landmark);
      setAddressLine1(selectedAddress.address);
      setAddressLine2(selectedAddress.address2);
      setLatitude(selectedAddress.latitude);
      setLongitude(selectedAddress.longitude);
      setAddressType(allOptions.find((a) => a.code === selectedAddress.addressType));
    }
  }, [selectedAddress]);

  // ✅ 🔥 MAIN SYNC (replaces onSelect)
  useEffect(() => {
    if (!onSelect || !isInitialized.current) return;

    const currentAddress = {
      pincode: pincode || "",
      city: city?.code || city || null,
      locality: locality?.code || locality || null,
      houseNo: houseNo || "",
      landmark: landmark || "",
      addressLine1: addressLine1 || "",
      addressLine2: addressLine2 || "",
      streetName: streetName || "",
      addressType: addressType?.code || addressType || null,
      latitude: latitude || "",
      longitude: longitude || "",
    };

    // Only call onSelect if data has actually changed from what we last received or sent
    const addressString = JSON.stringify(currentAddress);
    if (lastSyncedAddress.current !== addressString) {
      lastSyncedAddress.current = addressString;
      onSelect(config?.key || "address", currentAddress);
    }
  }, [pincode, city, locality, houseNo, landmark, addressLine1, addressLine2, streetName, addressType, latitude, longitude]);

  return (
    <Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "32px", rowGap: "8px" }}>
        {/* Existing Address */}
        {userDetails?.addresses?.length > 0 && (
          <div style={{ gridColumn: "span 2" }}>
            <CardLabel>{t("COMMON_ADDRESS_TYPE")}</CardLabel>
            <Dropdown
              selected={selectedAddress}
              select={setSelectedAddress}
              option={userDetails.addresses}
              optionKey="address"
              t={t}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* Address Type */}
        <div>
          <CardLabel>{t("COMMON_ADDRESS_TYPE")}</CardLabel>
          <Dropdown
            selected={addressType}
            select={setAddressType}
            option={availableAddressTypeOptions}
            optionKey="i18nKey"
            t={t}
            style={{ width: "100%" }}
          />
        </div>

        {/* House No */}
        <div>
          <CardLabel>{t("HOUSE_NO")}</CardLabel>
          <TextInput value={houseNo} onChange={(e) => setHouseNo(e.target.value)} />
        </div>

        {/* Street */}
        <div>
          <CardLabel>{t("STREET_NAME")}</CardLabel>
          <TextInput value={streetName} onChange={(e) => setStreetName(e.target.value)} />
        </div>

        {/* Address Line 1 */}
        <div>
          <CardLabel>{t("ADDRESS_LINE1")}</CardLabel>
          <TextInput value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
        </div>

        {/* Address Line 2 */}
        <div>
          <CardLabel>{t("ADDRESS_LINE2")}</CardLabel>
          <TextInput value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
        </div>

        {/* Landmark */}
        <div>
          <CardLabel>{t("LANDMARK")}</CardLabel>
          <TextInput value={landmark} onChange={(e) => setLandmark(e.target.value)} />
        </div>

        {/* City */}
        <div>
          <CardLabel>{t("CITY")}</CardLabel>
          <Controller
            control={control}
            name="city"
            render={() => <Dropdown selected={city} select={setCity} option={allCities} optionKey="i18nKey" t={t} />}
          />
        </div>

        {/* Locality */}
        <div>
          <CardLabel>{t("LOCALITY")}</CardLabel>
          <Controller
            control={control}
            name="locality"
            render={() => <Dropdown selected={locality} select={setLocality} option={structuredLocality} optionKey="i18nKey" t={t} />}
          />
        </div>

        {/* Latitude */}
        <div>
          <CardLabel>{t("LATITUDE")}</CardLabel>
          <TextInput value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>

        {/* Longitude */}
        <div>
          <CardLabel>{t("LONGITUDE")}</CardLabel>
          <TextInput value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>

        {/* Pincode */}
        <div>
          <CardLabel>{t("PINCODE")}</CardLabel>
          <TextInput value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} />
        </div>
      </div>
    </Card>
  );
};

export default AddFixFillAddress;
