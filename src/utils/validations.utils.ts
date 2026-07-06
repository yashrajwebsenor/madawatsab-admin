import * as yup from "yup";
import REGEX from "./regex";
import dayjs from "dayjs";

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  password: yup
    .string()
    .trim()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export const roleSchema: any = {
  "0": yup.object({
    name: yup.string().trim().required("Role name is required"),
  }),

  "1": yup.object({
    permissions: yup.array().min(1, "At least one permission is required"),
  }),
};

export const adminUserSchema = yup.object({
  _id: yup.string(),
  fullName: yup.string().trim().required("Full name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  roleId: yup.string().trim().required("Role is required"),
  mobile: yup
    .string()
    .trim()
    .typeError("Mobile number must be a number")
    .required("Mobile number is required")
    .length(10, "Mobile number must be 10 digits"),
  password: yup
    .string()
    .trim()
    .when("_id", {
      is: (val: string) => !val || val.length === 0,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters long"),
      otherwise: (schema) => schema.notRequired(),
    }),

  confirmPassword: yup
    .string()
    .trim()
    .when("_id", {
      is: (val: string) => !val || val.length === 0,
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .min(6, "Confirm password must be at least 6 characters long")
          .oneOf([yup.ref("password")], "Passwords do not match"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const agentSchema: any = yup.object({
  _id: yup.string(),
  fullName: yup.string().trim().required("Full name is required"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email address"),
  mobile: yup
    .string()
    .trim()
    .typeError("Mobile number must be a number")
    .required("Mobile number is required")
    .length(10, "Mobile number must be 10 digits"),
  referralCode: yup
    .string()
    .trim()
    .required("Referral code is required")
    .matches(
      /^[A-Za-z0-9_-]+$/,
      "Referral code can only contain letters, numbers, hyphens and underscores",
    ),
  gender: yup.string().trim().required("Gender is required"),
  country: yup.string().trim().required("Country is required"),
  state: yup.string().trim().required("State is required"),
  city: yup.string().trim().required("City is required"),
  password: yup
    .string()
    .trim()
    .when("_id", {
      is: (val: string) => !val || val.length === 0,
      then: (schema) =>
        schema
          .required("Password is required")
          .min(6, "Password must be at least 6 characters long"),
      otherwise: (schema) => schema.notRequired(),
    }),

  confirmPassword: yup
    .string()
    .trim()
    .when("_id", {
      is: (val: string) => !val || val.length === 0,
      then: (schema) =>
        schema
          .required("Confirm password is required")
          .min(6, "Confirm password must be at least 6 characters long")
          .oneOf([yup.ref("password")], "Passwords do not match"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const planSchema: any = yup.object({
  name: yup.string().trim().required("Plan name is required"),
  type: yup.string().trim().required("Plan type is required"),
  tagline: yup.string().trim().required("Tagline is required"),
  features: yup
    .array()
    .of(yup.string().trim().required("Feature cannot be empty")),

  pricing: yup
    .array()
    .test(
      "unique-duration",
      "Each billing cycle can only be added once",
      (list) => {
        const durations = (list ?? [])
          .map((item: any) => item?.duration)
          .filter(Boolean);
        return new Set(durations).size === durations.length;
      },
    )
    .of(
    yup.object().shape({
      duration: yup.string().required("Duration is required"),
      originalPrice: yup
        .number()
        .typeError("Original price is required")
        .positive("Price must be positive")
        .required("Original price is required"),
      discountedPrice: yup
        .number()
        .typeError("Discount price is required")
        .positive("Price must be positive")
        .required("Discount price is required"),
      contactViewLimit: yup
        .number()
        .nullable()
        .notRequired()
        .transform((value, originalValue) =>
          originalValue === "" ? null : value,
        )
        .min(0, "Cannot be negative"),
      badgeText: yup.string().nullable().notRequired(),
    }),
  ),
});

export const cmsSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  content: yup.string().trim().required("Content is required"),
});

export const advertisementSchema: any = yup
  .object()
  .shape(
    {
      title: yup
        .string()
        .trim()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters long"),
      description: yup
        .string()
        .trim()
        .required("Description is required")
        .min(20, "Description must be at least 20 characters long"),
      startDate: yup
        .string()
        .trim()
        .required("Start date is required")
        .test(
          "start-date-before",
          "Start date must be before end date",
          function (value) {
            const { endDate } = this.parent;
            return !endDate || !value || dayjs(value).isBefore(dayjs(endDate));
          },
        ),
      endDate: yup
        .string()
        .trim()
        .required("End date is required")
        .test(
          "end-date-after",
          "End date must be after start date",
          function (value) {
            const { startDate } = this.parent;
            return (
              !startDate || !value || dayjs(value).isAfter(dayjs(startDate))
            );
          },
        ),

      ctaText: yup.string().trim().ensure(),
      ctaUrl: yup.string().trim().matches(REGEX.VALID_URL, "Invalid URL"),
      targetGendersInput: yup
        .string()
        .trim()
        .test(
          "valid-target-genders",
          "Use comma separated values from: male, female",
          (value) => {
            if (!value) return true;
            return value
              .split(",")
              .map((item) => item.trim().toLowerCase())
              .filter(Boolean)
              .every((gender) => ["male", "female"].includes(gender));
          },
        ),
      targetCityIdsInput: yup
        .string()
        .trim()
        .test(
          "valid-target-city-ids",
          "Use comma separated positive numbers (example: 101, 102)",
          (value) => {
            if (!value) return true;
            return value
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
              .every((item) => Number.isInteger(Number(item)) && Number(item) > 0);
          },
        ),
      banner: yup.mixed().required("Banner image is required"),
    },
    [["ctaText", "ctaUrl"]],
  )
  .shape({
    ctaText: yup.string().when("ctaUrl", {
      is: (url: string) => !!url && url.length > 0,
      then: (s) => s.required("CTA text is required when a URL is provided"),
      otherwise: (s) => s.notRequired(),
    }),
    ctaUrl: yup.string().when("ctaText", {
      is: (text: string) => !!text && text.length > 0,
      then: (s) => s.required("URL is required when CTA text is provided"),
      otherwise: (s) => s.notRequired(),
    }),
  });

export const sendNotificationSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  body: yup.string().trim().required("Description is required"),
});

export const createUserSchema: any = yup.object({
  photos: yup.array().min(1, "At least one photo is required"),

  fullName: yup
    .string()
    .trim()
    .required("Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .max(30, "Full name must be at most 30 characters"),
  mobile: yup
    .string()
    .trim()
    .required("Mobile number is required")
    .length(10, "Mobile number must be 10 digits"),
  dob: yup
    .string()
    .required("Date of birth is required")
    .test("is-18", "You must be at least 18 years old", (value) => {
      if (!value) return false;
      const age = dayjs().diff(dayjs(value), "year");
      return age >= 18;
    }),
  gender: yup.string().required("Gender is required"),
  height: yup.string().required("Height is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  sect: yup.string().required("Sect is required"),
});

export const createMetadataSchema: any = yup.object({
  names: yup.array().of(
    yup.object({
      value: yup.string().trim().required("Name is required"),
    }),
  ),
});
