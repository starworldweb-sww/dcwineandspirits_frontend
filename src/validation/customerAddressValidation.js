import * as Yup from "yup";

export const addressValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(1, "First Name must be between 1 and 32 characters!")
    .max(32, "First Name must be between 1 and 32 characters!")
    .required("First Name is required"),
  lastname: Yup.string()
    .min(1, "Last Name must be between 1 and 32 characters!")
    .max(32, "Last Name must be between 1 and 32 characters!")
    .required("Last Name is required"),
  address_1: Yup.string()
    .min(3, "Address 1 must be between 3 and 128 characters!")
    .max(128, "Address 1 must be between 3 and 128 characters!")
    .required("Address 1 is required"),
  city: Yup.string()
    .min(2, "City must be between 2 and 128 characters!")
    .max(128, "City must be between 2 and 128 characters!")
    .required("City is required"),
  country_id: Yup.string().required("Please select a country!"),
  telephone: Yup.string().required("Mobile number is required"),
  zone_id: Yup.string().required("Please select a region / state!"),
});
export const addressCreateValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(1, "First Name must be between 1 and 32 characters!")
    .max(32, "First Name must be between 1 and 32 characters!")
    .required("First Name is required"),
  lastname: Yup.string()
    .min(1, "Last Name must be between 1 and 32 characters!")
    .max(32, "Last Name must be between 1 and 32 characters!")
    .required("Last Name is required"),
  address_1: Yup.string()
    .min(3, "Address 1 must be between 3 and 128 characters!")
    .max(128, "Address 1 must be between 3 and 128 characters!")
    .required("Address 1 is required"),
  city: Yup.string()
    .min(2, "City must be between 2 and 128 characters!")
    .max(128, "City must be between 2 and 128 characters!")
    .required("City is required"),
  country_id: Yup.string().required("Please select a country!"),
  zone_id: Yup.string().required("Please select a region / state!"),
});
