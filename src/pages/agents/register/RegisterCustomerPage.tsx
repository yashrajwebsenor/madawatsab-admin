import ENDPOINTS from "@/api/endpoints";
import http from "@/api/http";
import FormHeading from "@/components/lib/FormHeading";
import MetadataDropdown from "@/components/shared/MetadataDropdown";
import PhotoUploadPlaceholder from "@/components/shared/PhotoUploadPlaceholder";
import Section from "@/components/shared/Section";
import useCountryCityStates from "@/hooks/useCountryCityStates";
import { heights } from "@/configs/data";
import {
  FamilyTypes,
  Gender,
  MaritalStatus,
  MetadataTypes,
  ProfileFor,
  Sects,
} from "@/types/enum";
import CommonUtils from "@/utils/common.utils";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  DatePicker,
  Input,
  InputOtp,
  Select,
  SelectItem,
} from "@heroui/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegUser } from "react-icons/fa6";
import { IoCameraOutline, IoClose } from "react-icons/io5";
import { LuGraduationCap } from "react-icons/lu";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";

const STEP_LABELS = [
  "Mobile",
  "Verify OTP",
  "Basic Info",
  "Background",
  "Photos",
  "Family",
  "Done",
];

const profileDefaultValues = {
  profileFor: "",
  fullName: "",
  gender: "",
  dob: null as string | null,
  height: "",
  country: "",
  state: "",
  city: "",
  isFamilyLivingWithUser: true,
  maritalStatus: "",
  sect: "",
  maslak: "",
  community: "",
  language: "",
  qualification: "",
  workSector: "",
  occupation: "",
  annualIncome: "",
};

const familyDefaultValues = {
  familyType: "",
  fatherName: "",
  fatherOccupation: "",
  fatherContact: "",
  motherName: "",
  motherOccupation: "",
  motherContact: "",
  country: "",
  state: "",
  city: "",
  aboutFamily: "",
};

const RegisterCustomerPage = () => {
  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [madaId, setMadaId] = useState<string | null>(null);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [savingStep, setSavingStep] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);

  const {
    countries,
    states,
    cities,
    fetchCountries,
    fetchStates,
    fetchCities,
  } = useCountryCityStates();

  const {
    countries: familyCountries,
    states: familyStates,
    cities: familyCities,
    fetchCountries: fetchFamilyCountries,
    fetchStates: fetchFamilyStates,
    fetchCities: fetchFamilyCities,
  } = useCountryCityStates();

  const profileForm = useForm({ defaultValues: profileDefaultValues });
  const familyForm = useForm({ defaultValues: familyDefaultValues });

  useEffect(() => {
    fetchCountries();
    fetchFamilyCountries();
  }, []);

  const resetWizard = () => {
    setStep(0);
    setMobile("");
    setOtp("");
    setDevOtp(null);
    setUserId(null);
    setMadaId(null);
    setProfilePhoto(null);
    setGalleryPhotos([]);
    profileForm.reset(profileDefaultValues);
    familyForm.reset(familyDefaultValues);
  };

  const handleSendOtp = async () => {
    if (!mobile || mobile.trim().length !== 10) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Enter a valid 10-digit mobile number",
      });
      return;
    }

    try {
      setSendingOtp(true);
      const res: any = await http.post(ENDPOINTS.AGENTS.REGISTER.SEND_OTP, {
        mobile,
      });
      setDevOtp(res?.data?.otp ?? null);
      setStep(1);
    } catch (error) {
      console.log(error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return;

    try {
      setVerifyingOtp(true);
      const res: any = await http.post(ENDPOINTS.AGENTS.REGISTER.VERIFY_OTP, {
        mobile,
        otp,
      });

      const newUserId = res?.data?.userId;
      setUserId(newUserId);
      setStep(2);

      // Resume support: prefill everything already saved for this customer
      // (agent may have dropped the flow midway on a previous attempt).
      try {
        const res2: any = await http.get(
          ENDPOINTS.AGENTS.REGISTER.GET(newUserId),
        );
        const details: any = res2?.data;

        setMadaId(details?.userId ?? null);

        if (details?.address?.countryId)
          await fetchStates(String(details.address.countryId));
        if (details?.address?.countryId && details?.address?.stateId)
          await fetchCities(
            String(details.address.countryId),
            String(details.address.stateId),
          );

        profileForm.reset({
          profileFor: details?.profileFor ?? "",
          fullName: details?.fullName ?? "",
          gender: details?.gender ?? "",
          dob: details?.dob ? dayjs(details.dob).format("YYYY-MM-DD") : null,
          height: details?.height ? String(details.height) : "",
          country: details?.address?.countryId
            ? String(details.address.countryId)
            : "",
          state: details?.address?.stateId
            ? String(details.address.stateId)
            : "",
          city: details?.address?.cityId
            ? String(details.address.cityId)
            : "",
          isFamilyLivingWithUser: details?.isFamilyLivingWithUser ?? true,
          maritalStatus: details?.maritalStatus ?? "",
          sect: details?.sect ?? "",
          maslak: details?.maslak ?? "",
          community: details?.community ?? "",
          language: details?.language ?? "",
          qualification: details?.qualification ?? "",
          workSector: details?.workSector ?? "",
          occupation: details?.occupation ?? "",
          annualIncome: details?.annualIncome ?? "",
        });

        if (details?.family) {
          const family = details.family;

          if (family?.address?.countryId)
            await fetchFamilyStates(String(family.address.countryId));
          if (family?.address?.countryId && family?.address?.stateId)
            await fetchFamilyCities(
              String(family.address.countryId),
              String(family.address.stateId),
            );

          familyForm.reset({
            familyType: family?.familyType ?? "",
            fatherName: family?.fatherName ?? "",
            fatherOccupation: family?.fatherOccupation ?? "",
            fatherContact: family?.fatherContact ?? "",
            motherName: family?.motherName ?? "",
            motherOccupation: family?.motherOccupation ?? "",
            motherContact: family?.motherContact ?? "",
            country: family?.address?.countryId
              ? String(family.address.countryId)
              : "",
            state: family?.address?.stateId
              ? String(family.address.stateId)
              : "",
            city: family?.address?.cityId
              ? String(family.address.cityId)
              : "",
            aboutFamily: family?.aboutFamily ?? "",
          });
        }
      } catch (err) {
        console.log(err);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSaveBasicInfo = profileForm.handleSubmit(async (data) => {
    if (!userId) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Session lost. Please restart from the mobile step.",
      });
      return;
    }

    if (!data.profileFor || !data.fullName || !data.gender || !data.dob) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Please fill profile for, name, gender and date of birth",
      });
      return;
    }

    try {
      setSavingStep(true);
      await http.put(ENDPOINTS.AGENTS.REGISTER.UPDATE_PROFILE(userId), {
        profileFor: data.profileFor,
        fullName: data.fullName,
        gender: data.gender,
        dob: dayjs(data.dob).toISOString(),
        height: data.height ? Number(data.height) : undefined,
        country: data.country ? Number(data.country) : undefined,
        state: data.state ? Number(data.state) : undefined,
        city: data.city ? Number(data.city) : undefined,
        isFamilyLivingWithUser: data.isFamilyLivingWithUser,
      });
      setStep(3);
    } catch (error) {
      console.log(error);
    } finally {
      setSavingStep(false);
    }
  });

  const handleSaveBackground = profileForm.handleSubmit(async (data) => {
    if (!userId) return;

    if (!data.maritalStatus) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Please select a marital status",
      });
      return;
    }

    try {
      setSavingStep(true);
      await http.put(ENDPOINTS.AGENTS.REGISTER.UPDATE_PROFILE(userId), {
        maritalStatus: data.maritalStatus,
        sect: data.sect || undefined,
        maslak: data.maslak || undefined,
        community: data.community || undefined,
        language: data.language || undefined,
        qualification: data.qualification || undefined,
        workSector: data.workSector || undefined,
        occupation: data.occupation || undefined,
        annualIncome: data.annualIncome || undefined,
      });
      setStep(4);
    } catch (error) {
      console.log(error);
    } finally {
      setSavingStep(false);
    }
  });

  const handleUploadPhotos = async () => {
    if (!userId) return;

    if (!profilePhoto) {
      addToast({
        title: "Error",
        color: "danger",
        description: "A profile photo is required",
      });
      return;
    }

    try {
      setSavingStep(true);

      const profileFd = new FormData();
      profileFd.append("photo", profilePhoto);
      await http.post(
        ENDPOINTS.AGENTS.REGISTER.UPLOAD_PROFILE_PHOTO(userId),
        profileFd,
      );

      for (const file of galleryPhotos) {
        const fd = new FormData();
        fd.append("photo", file);
        await http.post(
          ENDPOINTS.AGENTS.REGISTER.UPLOAD_GALLERY_PHOTO(userId),
          fd,
        );
      }

      setStep(5);
    } catch (error) {
      console.log(error);
    } finally {
      setSavingStep(false);
    }
  };

  const completeOnboarding = async () => {
    if (!userId) return;
    await http.put(ENDPOINTS.AGENTS.REGISTER.UPDATE_PROFILE(userId), {
      isOnboardingCompleted: true,
    });
    setStep(6);
    addToast({
      title: "Success",
      color: "success",
      description: "Customer registered successfully",
    });
  };

  const handleSaveFamily = familyForm.handleSubmit(async (data) => {
    if (!userId) return;

    try {
      setSavingStep(true);

      const hasFamilyData = Object.values(data).some((v) => !!v);
      if (hasFamilyData) {
        await http.put(ENDPOINTS.AGENTS.REGISTER.UPDATE_FAMILY(userId), {
          familyType: data.familyType || undefined,
          fatherName: data.fatherName || undefined,
          fatherOccupation: data.fatherOccupation || undefined,
          fatherContact: data.fatherContact || undefined,
          motherName: data.motherName || undefined,
          motherOccupation: data.motherOccupation || undefined,
          motherContact: data.motherContact || undefined,
          country: data.country ? Number(data.country) : undefined,
          state: data.state ? Number(data.state) : undefined,
          city: data.city ? Number(data.city) : undefined,
          aboutFamily: data.aboutFamily || undefined,
        });
      }

      await completeOnboarding();
    } catch (error) {
      console.log(error);
    } finally {
      setSavingStep(false);
    }
  });

  const handleSkipFamily = async () => {
    try {
      setSavingStep(true);
      await completeOnboarding();
    } catch (error) {
      console.log(error);
    } finally {
      setSavingStep(false);
    }
  };

  return (
    <div>
      <FormHeading
        title="Register Customer"
        description="Fully register a customer on their behalf — no entry fee or spin wheel, since they're onboarding through you."
      />

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {STEP_LABELS.map((label, i) => (
          <Chip
            key={label}
            size="sm"
            variant={i === step ? "solid" : "flat"}
            color={i < step ? "success" : i === step ? "primary" : "default"}
          >
            {i + 1}. {label}
          </Chip>
        ))}
      </div>

      {step === 0 && (
        <Section
          title="Customer Mobile Number"
          description="Enter the customer's mobile number to begin. If they already have a partial registration with you, it will resume automatically."
          icon={<MdOutlinePhoneAndroid size={20} className="text-primary" />}
        >
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <Input
              label="MOBILE NUMBER"
              labelPlacement="outside"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Button
              color="primary"
              className="font-medium"
              isLoading={sendingOtp}
              onPress={handleSendOtp}
            >
              Send OTP
            </Button>
          </div>
        </Section>
      )}

      {step === 1 && (
        <Section
          title="Verify OTP"
          description="Call the customer, ask for the OTP sent to their mobile, and enter it below."
          icon={<MdOutlinePhoneAndroid size={20} className="text-primary" />}
        >
          <div className="flex flex-col gap-4 items-start">
            {devOtp && (
              <Chip color="warning" variant="flat">
                Dev fallback (SMS not wired yet) — OTP: {devOtp}
              </Chip>
            )}
            <InputOtp length={6} value={otp} onValueChange={setOtp} />
            <div className="flex gap-3">
              <Button variant="flat" onPress={() => setStep(0)}>
                Back
              </Button>
              <Button
                color="primary"
                className="font-medium"
                isLoading={verifyingOtp}
                onPress={handleVerifyOtp}
              >
                Verify OTP
              </Button>
            </div>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section
          title="2. Basic Information"
          description={madaId ? `Customer ID: ${madaId}` : undefined}
          icon={<FaRegUser size={20} className="text-primary" />}
        >
          <div className="grid gap-4">
            <Controller
              control={profileForm.control}
              name="profileFor"
              render={({ field }) => (
                <Select
                  label="PROFILE FOR"
                  labelPlacement="outside"
                  placeholder="Who is this profile for?"
                  selectedKeys={new Set([field.value ?? ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Object.values(ProfileFor).map((item) => (
                    <SelectItem key={item}>
                      {CommonUtils.formatTitle(item)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <Controller
                control={profileForm.control}
                name="fullName"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="FULL NAME"
                    labelPlacement="outside"
                    placeholder="Enter full name"
                  />
                )}
              />
              <Controller
                control={profileForm.control}
                name="gender"
                render={({ field }) => (
                  <Select
                    label="GENDER"
                    labelPlacement="outside"
                    placeholder="Select gender"
                    selectedKeys={new Set([field.value ?? ""])}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {Object.values(Gender).map((item) => (
                      <SelectItem key={item}>
                        {CommonUtils.formatTitle(item)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={profileForm.control}
                name="dob"
                render={({ field }) => (
                  <DatePicker
                    label="DATE OF BIRTH"
                    labelPlacement="outside"
                    value={field.value ? parseDate(field.value) : null}
                    onChange={(date) =>
                      field.onChange(date ? date.toString() : null)
                    }
                    maxValue={today(getLocalTimeZone()).subtract({
                      years: 18,
                    })}
                  />
                )}
              />
            </div>

            <div className="grid sm:grid-cols-4 gap-4">
              <Controller
                control={profileForm.control}
                name="height"
                render={({ field }) => (
                  <Select
                    label="HEIGHT"
                    labelPlacement="outside"
                    placeholder="Select height"
                    selectedKeys={new Set([field.value ?? ""])}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    {heights.map((item) => (
                      <SelectItem key={String(item.key)}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                control={profileForm.control}
                name="country"
                render={({ field }) => (
                  <Autocomplete
                    label="COUNTRY"
                    labelPlacement="outside"
                    placeholder="Select country"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) => {
                      const val = (key as string) ?? "";
                      field.onChange(val);
                      profileForm.setValue("state", "");
                      profileForm.setValue("city", "");
                      if (val) fetchStates(val);
                    }}
                  >
                    {countries.map((item) => (
                      <AutocompleteItem key={String(item.id)}>
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
              <Controller
                control={profileForm.control}
                name="state"
                render={({ field }) => (
                  <Autocomplete
                    label="STATE"
                    labelPlacement="outside"
                    placeholder="Select state"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) => {
                      const val = (key as string) ?? "";
                      field.onChange(val);
                      profileForm.setValue("city", "");
                      if (val)
                        fetchCities(profileForm.getValues("country"), val);
                    }}
                  >
                    {states.map((item) => (
                      <AutocompleteItem key={String(item.id)}>
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
              <Controller
                control={profileForm.control}
                name="city"
                render={({ field }) => (
                  <Autocomplete
                    label="CITY"
                    labelPlacement="outside"
                    placeholder="Select city"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) =>
                      field.onChange((key as string) ?? "")
                    }
                  >
                    {cities.map((item) => (
                      <AutocompleteItem key={String(item.id)}>
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                color="primary"
                className="font-medium"
                isLoading={savingStep}
                onPress={() => handleSaveBasicInfo()}
              >
                Next
              </Button>
            </div>
          </div>
        </Section>
      )}

      {step === 3 && (
        <Section
          title="3. Background & Profession"
          icon={<LuGraduationCap size={20} className="text-primary" />}
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <Controller
              control={profileForm.control}
              name="maritalStatus"
              render={({ field }) => (
                <Select
                  label="MARITAL STATUS"
                  labelPlacement="outside"
                  placeholder="Select marital status"
                  selectedKeys={new Set([field.value ?? ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Object.values(MaritalStatus).map((item) => (
                    <SelectItem key={item}>
                      {CommonUtils.formatTitle(item)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              control={profileForm.control}
              name="sect"
              render={({ field }) => (
                <Select
                  label="SECT"
                  labelPlacement="outside"
                  placeholder="Select sect"
                  selectedKeys={new Set([field.value ?? ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Object.values(Sects).map((item) => (
                    <SelectItem key={item}>
                      {CommonUtils.formatTitle(item)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
            <Controller
              control={profileForm.control}
              name="language"
              render={({ field }) => (
                <Input
                  {...field}
                  label="MOTHER TONGUE"
                  labelPlacement="outside"
                  placeholder="e.g. Urdu"
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="community"
              render={({ field }) => (
                <Input
                  {...field}
                  label="COMMUNITY (OPTIONAL)"
                  labelPlacement="outside"
                  placeholder="e.g. Khan"
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="maslak"
              render={({ field }) => (
                <MetadataDropdown
                  label="MASLAK (OPTIONAL)"
                  labelPlacement="outside"
                  placeholder="Select maslak"
                  metadataType={MetadataTypes.caste}
                  selectedKey={field.value ? String(field.value) : ""}
                  onSelectionChange={(key) => field.onChange(key)}
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="qualification"
              render={({ field }) => (
                <MetadataDropdown
                  label="QUALIFICATION"
                  labelPlacement="outside"
                  placeholder="Select qualification"
                  metadataType={MetadataTypes.qualification}
                  selectedKey={field.value ? String(field.value) : ""}
                  onSelectionChange={(key) => field.onChange(key)}
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="workSector"
              render={({ field }) => (
                <MetadataDropdown
                  label="EMPLOYED IN"
                  labelPlacement="outside"
                  placeholder="Select work sector"
                  metadataType={MetadataTypes.employed_in}
                  selectedKey={field.value ? String(field.value) : ""}
                  onSelectionChange={(key) => field.onChange(key)}
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="occupation"
              render={({ field }) => (
                <MetadataDropdown
                  label="OCCUPATION"
                  labelPlacement="outside"
                  placeholder="Select occupation"
                  metadataType={MetadataTypes.occupation}
                  selectedKey={field.value ? String(field.value) : ""}
                  onSelectionChange={(key) => field.onChange(key)}
                />
              )}
            />
            <Controller
              control={profileForm.control}
              name="annualIncome"
              render={({ field }) => (
                <MetadataDropdown
                  label="ANNUAL INCOME"
                  labelPlacement="outside"
                  placeholder="Select annual income"
                  metadataType={MetadataTypes.annual_income}
                  selectedKey={field.value ? String(field.value) : ""}
                  onSelectionChange={(key) => field.onChange(key)}
                />
              )}
            />
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <Button variant="flat" onPress={() => setStep(2)}>
              Back
            </Button>
            <Button
              color="primary"
              className="font-medium"
              isLoading={savingStep}
              onPress={() => handleSaveBackground()}
            >
              Next
            </Button>
          </div>
        </Section>
      )}

      {step === 4 && (
        <Section
          title="4. Photos"
          description="First photo becomes the main profile photo. Gallery photos go through the usual admin review."
          icon={<IoCameraOutline size={20} className="text-primary" />}
        >
          <div className="grid sm:grid-cols-4 gap-5">
            <div className="flex flex-col items-center gap-2">
              {profilePhoto ? (
                <div className="relative group overflow-hidden rounded-lg w-full aspect-[4/5] bg-gray-100">
                  <img
                    alt="Profile"
                    src={URL.createObjectURL(profilePhoto)}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    radius="full"
                    variant="flat"
                    color="danger"
                    onPress={() => setProfilePhoto(null)}
                    className="absolute top-2 right-2 z-10"
                  >
                    <IoClose size={18} />
                  </Button>
                </div>
              ) : (
                <PhotoUploadPlaceholder onChange={setProfilePhoto} />
              )}
              <span className="text-xs text-default-500">Profile Photo</span>
            </div>

            {galleryPhotos.map((file, i) => (
              <div
                key={i}
                className="relative group overflow-hidden rounded-lg w-full aspect-[4/5] bg-gray-100"
              >
                <img
                  alt={`Gallery ${i + 1}`}
                  src={URL.createObjectURL(file)}
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  isIconOnly
                  size="sm"
                  radius="full"
                  variant="flat"
                  color="danger"
                  onPress={() =>
                    setGalleryPhotos((prev) =>
                      prev.filter((_, idx) => idx !== i),
                    )
                  }
                  className="absolute top-2 right-2 z-10"
                >
                  <IoClose size={18} />
                </Button>
              </div>
            ))}

            {galleryPhotos.length < 5 && (
              <div className="flex flex-col items-center gap-2">
                <PhotoUploadPlaceholder
                  onChange={(file) =>
                    setGalleryPhotos((prev) => [...prev, file])
                  }
                />
                <span className="text-xs text-default-500">
                  Gallery Photo
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end mt-5">
            <Button variant="flat" onPress={() => setStep(3)}>
              Back
            </Button>
            <Button
              color="primary"
              className="font-medium"
              isLoading={savingStep}
              onPress={handleUploadPhotos}
            >
              Next
            </Button>
          </div>
        </Section>
      )}

      {step === 5 && (
        <Section
          title="5. Family Details"
          description="Optional — the customer can also add these later from their own account."
          icon={<TbUsersGroup size={20} className="text-primary" />}
        >
          <div className="grid gap-4">
            <Controller
              control={familyForm.control}
              name="familyType"
              render={({ field }) => (
                <Select
                  label="FAMILY TYPE"
                  labelPlacement="outside"
                  placeholder="Select family type"
                  selectedKeys={new Set([field.value ?? ""])}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {Object.values(FamilyTypes).map((item) => (
                    <SelectItem key={item}>
                      {CommonUtils.formatTitle(item)}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <Controller
                control={familyForm.control}
                name="fatherName"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="FATHER'S NAME"
                    labelPlacement="outside"
                  />
                )}
              />
              <Controller
                control={familyForm.control}
                name="fatherOccupation"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="FATHER'S OCCUPATION"
                    labelPlacement="outside"
                  />
                )}
              />
              <Controller
                control={familyForm.control}
                name="fatherContact"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="FATHER'S CONTACT"
                    labelPlacement="outside"
                  />
                )}
              />
              <Controller
                control={familyForm.control}
                name="motherName"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="MOTHER'S NAME"
                    labelPlacement="outside"
                  />
                )}
              />
              <Controller
                control={familyForm.control}
                name="motherOccupation"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="MOTHER'S OCCUPATION"
                    labelPlacement="outside"
                  />
                )}
              />
              <Controller
                control={familyForm.control}
                name="motherContact"
                render={({ field }) => (
                  <Input
                    {...field}
                    label="MOTHER'S CONTACT"
                    labelPlacement="outside"
                  />
                )}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Controller
                control={familyForm.control}
                name="country"
                render={({ field }) => (
                  <Autocomplete
                    label="FAMILY COUNTRY"
                    labelPlacement="outside"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) => {
                      const val = (key as string) ?? "";
                      field.onChange(val);
                      familyForm.setValue("state", "");
                      familyForm.setValue("city", "");
                      if (val) fetchFamilyStates(val);
                    }}
                  >
                    {familyCountries.map((item) => (
                      <AutocompleteItem key={String(item.id)}>
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
              <Controller
                control={familyForm.control}
                name="state"
                render={({ field }) => (
                  <Autocomplete
                    label="FAMILY STATE"
                    labelPlacement="outside"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) => {
                      const val = (key as string) ?? "";
                      field.onChange(val);
                      familyForm.setValue("city", "");
                      if (val)
                        fetchFamilyCities(
                          familyForm.getValues("country"),
                          val,
                        );
                    }}
                  >
                    {familyStates.map((item) => (
                      <AutocompleteItem key={String(item.id)}>
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
              <Controller
                control={familyForm.control}
                name="city"
                render={({ field }) => (
                  <Autocomplete
                    label="FAMILY CITY"
                    labelPlacement="outside"
                    selectedKey={field.value || ""}
                    onSelectionChange={(key) =>
                      field.onChange((key as string) ?? "")
                    }
                  >
                    {familyCities.map((item) => (
                      <AutocompleteItem key={String(item.id)}>
                        {item.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
              />
            </div>

            <Controller
              control={familyForm.control}
              name="aboutFamily"
              render={({ field }) => (
                <Input
                  {...field}
                  label="ABOUT FAMILY"
                  labelPlacement="outside"
                  placeholder="Brief description of the family"
                />
              )}
            />
          </div>

          <div className="flex gap-3 justify-end mt-5">
            <Button variant="flat" onPress={() => setStep(4)}>
              Back
            </Button>
            <Button
              variant="flat"
              isLoading={savingStep}
              onPress={handleSkipFamily}
            >
              Skip
            </Button>
            <Button
              color="primary"
              className="font-medium"
              isLoading={savingStep}
              onPress={() => handleSaveFamily()}
            >
              Finish
            </Button>
          </div>
        </Section>
      )}

      {step === 6 && (
        <Section
          title="Customer Registered"
          description={
            madaId
              ? `Customer ID ${madaId} has been onboarded and linked to your account.`
              : "The customer has been onboarded and linked to your account."
          }
          icon={<FaRegUser size={20} className="text-primary" />}
        >
          <Button color="primary" className="font-medium" onPress={resetWizard}>
            Register Another Customer
          </Button>
        </Section>
      )}
    </div>
  );
};

export default RegisterCustomerPage;
