"use client";

import { useState } from "react";
import {
  Formik,
  Form,
  Field,
  FieldArray,
  ErrorMessage,
  FieldArrayRenderProps,
} from "formik";

import * as Yup from "yup";

import { format } from "date-fns";

import { CalendarIcon, Upload, Plus, Trash2, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createAxiosInstance } from "@/lib/axios";
import { apis } from "@/lib/endpoints";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title is too long")
    .required("Campaign title is required"),

  overview: Yup.string()
    .min(30, "Overview should be more descriptive")
    .max(2000, "Overview is too long")
    .required("Campaign overview is required"),

  type: Yup.string().required("Campaign type is required"),

  sponsorName: Yup.string()
    .min(2, "Sponsor name is too short")
    .required("Sponsor name is required"),

  sponsorLogo: Yup.mixed().required("Sponsor logo is required"),

  bannerImage: Yup.mixed().required("Banner image is required"),

  totalPool: Yup.number()
    .typeError("Reward pool must be a number")
    .positive("Reward pool must be greater than 0")
    .required("Reward pool is required"),

  totalSpots: Yup.number()
    .typeError("Total spots must be a number")
    .integer("Total spots must be a whole number")
    .positive("Total spots must be greater than 0")
    .required("Total spots is required"),

  startDate: Yup.date().nullable().required("Start date is required"),

  endDate: Yup.date()
    .nullable()
    .min(Yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),

  requirements: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(3, "Requirement is too short")
        .required("Requirement cannot be empty"),
    )
    .min(1, "Add at least one requirement"),

  guidelines: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(3, "Guideline is too short")
        .required("Guideline cannot be empty"),
    )
    .min(1, "Add at least one guideline"),

  selectionCriteria: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(3, "Criteria is too short")
        .required("Selection criteria cannot be empty"),
    )
    .min(1, "Add at least one selection criteria"),

  howToSubmit: Yup.array()
    .of(
      Yup.string()
        .trim()
        .min(3, "Submission step is too short")
        .required("Submission step cannot be empty"),
    )
    .min(1, "Add at least one submission step"),
});

const initialValues = {
  title: "",
  overview: "",
  type: "",
  sponsorName: "",
  sponsorLogo: null,
  bannerImage: null,
  requirements: [""],
  guidelines: [""],
  selectionCriteria: [""],
  howToSubmit: [""],
  startDate: null,
  endDate: null,
  totalPool: "",
  totalSpots: "",
};

export default function CreateTaskPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const axiosInstance = createAxiosInstance();
  const router = useRouter();

  const renderArrayField = (
    label: string,
    name: string,
    values: any,
    errors: any,
    touched: any,
  ) => {
    return (
      <FieldArray name={name}>
        {({ push, remove }: FieldArrayRenderProps) => (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-[#111111]">
                  {label}
                </h3>

                <p className="text-sm text-[#666666]">
                  Add all necessary {label.toLowerCase()}
                </p>
              </div>

              <Button
                type="button"
                onClick={() => push("")}
                className="h-10 rounded-xl bg-[#5427D7] hover:bg-[#5427D7]/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {values[name].map((_: string, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#ECECEC] bg-[#FAFAFA] p-3">
                    <Field
                      as={Input}
                      name={`${name}.${index}`}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="h-11 border-[#E5E5E5] bg-white text-black placeholder:text-[#999999] focus-visible:ring-2 focus-visible:ring-[#5427D7]"
                    />

                    {values[name].length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => remove(index)}
                        className="h-11 w-11 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <ErrorMessage
                    name={`${name}.${index}`}
                    component="p"
                    className="pl-2 text-sm text-red-500"
                  />
                </div>
              ))}

              {typeof errors[name] === "string" && touched[name] && (
                <p className="text-sm text-red-500">{errors[name]}</p>
              )}
            </div>
          </div>
        )}
      </FieldArray>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA] px-4 py-10 text-black md:px-8">
      <div className="mx-auto max-w-full">
        {/* HEADER */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#5427D7]" />

            <p className="text-xs uppercase tracking-[0.3em] text-[#5427D7]">
              Create Campaign
            </p>
          </div>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-black md:text-5xl">
            Build and launch a
            <span className="text-[#5427D7]"> sponsored campaign</span>
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#666666]">
            Manage campaign details, sponsor assets, timelines, submission
            rules, rewards, and participant requirements from one modern
            dashboard.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange
          validateOnBlur
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const formData = new FormData();

              formData.append("title", values.title);
              formData.append("overview", values.overview);
              formData.append("type", values.type);
              formData.append("sponsorName", values.sponsorName);

              formData.append("totalPool", String(values.totalPool));
              formData.append("totalSpots", String(values.totalSpots));

              formData.append(
                "startDate",
                values.startDate
                  ? new Date(values.startDate).toISOString()
                  : "",
              );

              formData.append(
                "endDate",
                values.endDate ? new Date(values.endDate).toISOString() : "",
              );

              // arrays
              values.requirements.forEach((item) => {
                formData.append("requirements[]", item);
              });

              values.guidelines.forEach((item) => {
                formData.append("guidelines[]", item);
              });

              values.selectionCriteria.forEach((item) => {
                formData.append("selectionCriteria[]", item);
              });

              values.howToSubmit.forEach((item) => {
                formData.append("howToSubmit[]", item);
              });

              // files
              // VERY IMPORTANT
              if (values.sponsorLogo instanceof File) {
                formData.append("sponsorLogo", values.sponsorLogo);
              }

              if (values.bannerImage instanceof File) {
                formData.append("bannerImage", values.bannerImage);
              }

              const response = await axiosInstance.post(
                `${apis.task}/create`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                },
              );

              toast.success(response?.message);

              router.push("/tasks/task");

              resetForm();
              setLogoPreview(null);
              setBannerPreview(null);
            } catch (error: any) {
              toast.error(
                error?.response?.data ||
                  error.message ||
                  "Something went wrong",
              );
              console.error(
                error?.response?.data ||
                  error.message ||
                  "Something went wrong",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              {/* LEFT */}
              <div className="space-y-6">
                <Card className="rounded-3xl border border-[#ECECEC] bg-white shadow-sm">
                  <CardContent className="space-y-8 p-7">
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#555]">
                          Campaign Title
                        </label>

                        <Field
                          as={Input}
                          name="title"
                          placeholder="Enter campaign title"
                          className="h-12 rounded-xl border-[#E5E5E5] bg-[#FAFAFA]"
                        />

                        <ErrorMessage
                          name="title"
                          component="p"
                          className="text-sm text-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#555]">
                          Campaign Type
                        </label>

                        <Field
                          as={Input}
                          name="type"
                          placeholder="Hackathon, Giveaway..."
                          className="h-12 rounded-xl border-[#E5E5E5] bg-[#FAFAFA]"
                        />

                        <ErrorMessage
                          name="type"
                          component="p"
                          className="text-sm text-red-500"
                        />
                      </div>
                    </div>

                    {/* OVERVIEW */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#555]">
                        Campaign Overview
                      </label>

                      <Field
                        as={Textarea}
                        name="overview"
                        placeholder="Describe the campaign..."
                        className="min-h-[160px] rounded-2xl border-[#E5E5E5] bg-[#FAFAFA] resize-none"
                      />

                      <ErrorMessage
                        name="overview"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* SPONSOR */}
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#555]">
                          Sponsor Name
                        </label>

                        <Field
                          as={Input}
                          name="sponsorName"
                          placeholder="Nike"
                          className="h-12 rounded-xl border-[#E5E5E5] bg-[#FAFAFA]"
                        />

                        <ErrorMessage
                          name="sponsorName"
                          component="p"
                          className="text-sm text-red-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#555]">
                          Reward Pool (N)
                        </label>

                        <Field name="totalPool">
                          {({ field, form }: any) => (
                            <Input
                              {...field}
                              type="text"
                              inputMode="numeric"
                              placeholder="5,000"
                              autoComplete="off"
                              value={
                                field.value
                                  ? Number(field.value).toLocaleString("en-US")
                                  : ""
                              }
                              onChange={(e) => {
                                const rawValue = e.target.value.replace(
                                  /,/g,
                                  "",
                                );

                                // allow only digits
                                if (/^\d*$/.test(rawValue)) {
                                  // prevent multiple leading zeros like 0000
                                  const cleaned =
                                    rawValue === ""
                                      ? ""
                                      : String(Number(rawValue));

                                  form.setFieldValue("totalPool", cleaned);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              className="h-12 rounded-xl border-[#E5E5E5] bg-[#FAFAFA]"
                            />
                          )}
                        </Field>

                        <ErrorMessage
                          name="totalPool"
                          component="p"
                          className="text-sm text-red-500"
                        />
                      </div>
                    </div>

                    {/* SPOTS */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#555]">
                        Total Spots
                      </label>

                      <Field name="totalSpots">
                        {({ field, form }: any) => (
                          <Input
                            {...field}
                            type="text"
                            inputMode="numeric"
                            placeholder="50"
                            autoComplete="off"
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;

                              // only numbers
                              if (/^\d*$/.test(value)) {
                                // prevent leading zeros
                                const cleaned =
                                  value === "" ? "" : String(Number(value));

                                form.setFieldValue("totalSpots", cleaned);
                              }
                            }}
                            onKeyDown={(e) => {
                              // block e, E, +, -, .
                              if (["e", "E", "+", "-", "."].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            className="h-12 rounded-xl border-[#E5E5E5] bg-[#FAFAFA]"
                          />
                        )}
                      </Field>

                      <ErrorMessage
                        name="totalSpots"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* DATES */}
                    <div className="grid gap-5 md:grid-cols-2">
                      {/* START DATE */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#555]">
                          Start Date
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              className={cn(
                                "flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-[#E7E7E7] bg-white px-4 shadow-sm transition-all duration-200 hover:border-[#5427D7]",
                                values.startDate
                                  ? "text-black"
                                  : "text-[#9A9A9A]",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-[#5427D7]" />

                                {values.startDate ? (
                                  format(values.startDate, "PPP")
                                ) : (
                                  <span>Select start date</span>
                                )}
                              </div>
                            </div>
                          </PopoverTrigger>

                          <PopoverContent
                            align="start"
                            className="w-auto rounded-3xl border border-[#ECECEC] bg-white p-4 shadow-2xl"
                          >
                            <Calendar
                              mode="single"
                              selected={values.startDate}
                              onSelect={(date) =>
                                setFieldValue("startDate", date)
                              }
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              className="rounded-2xl"
                              classNames={{
                                months: "flex flex-col gap-4",
                                month: "space-y-4",
                                caption:
                                  "flex justify-center pt-1 relative items-center text-black font-semibold",
                                nav: "space-x-1 flex items-center",
                                nav_button:
                                  "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-[#F5F3FF] rounded-xl",
                                table: "w-full border-collapse",
                                head_row: "flex",
                                head_cell:
                                  "text-[#777] rounded-md w-9 font-medium text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal rounded-xl transition hover:bg-[#F5F3FF] hover:text-[#5427D7]",
                                day_selected:
                                  "bg-[#5427D7] text-white hover:bg-[#5427D7] hover:text-white",
                                day_today:
                                  "bg-[#F3F0FF] text-[#5427D7] font-semibold",
                                day_outside: "text-[#CFCFCF]",
                                day_disabled: "text-[#D1D1D1] opacity-50",
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <ErrorMessage
                          name="startDate"
                          component="p"
                          className="text-sm text-red-500"
                        />
                      </div>

                      {/* END DATE */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#555]">
                          End Date
                        </label>

                        <Popover>
                          <PopoverTrigger asChild>
                            <div
                              className={cn(
                                "flex h-12 w-full cursor-pointer items-center justify-between rounded-2xl border border-[#E7E7E7] bg-white px-4 shadow-sm transition-all duration-200 hover:border-[#5427D7]",
                                values.endDate
                                  ? "text-black"
                                  : "text-[#9A9A9A]",
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-[#5427D7]" />

                                {values.endDate ? (
                                  format(values.endDate, "PPP")
                                ) : (
                                  <span>Select end date</span>
                                )}
                              </div>
                            </div>
                          </PopoverTrigger>

                          <PopoverContent
                            align="start"
                            className="w-auto rounded-3xl border border-[#ECECEC] bg-white p-4 shadow-2xl"
                          >
                            <Calendar
                              mode="single"
                              selected={values.endDate}
                              onSelect={(date) =>
                                setFieldValue("endDate", date)
                              }
                              disabled={(date) =>
                                values.startDate
                                  ? date <= values.startDate
                                  : date <
                                    new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              className="rounded-2xl"
                              classNames={{
                                months: "flex flex-col gap-4",
                                month: "space-y-4",
                                caption:
                                  "flex justify-center pt-1 relative items-center text-black font-semibold",
                                nav: "space-x-1 flex items-center",
                                nav_button:
                                  "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-[#F5F3FF] rounded-xl",
                                table: "w-full border-collapse",
                                head_row: "flex",
                                head_cell:
                                  "text-[#777] rounded-md w-9 font-medium text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                day: "h-9 w-9 p-0 font-normal rounded-xl transition hover:bg-[#F5F3FF] hover:text-[#5427D7]",
                                day_selected:
                                  "bg-[#5427D7] text-white hover:bg-[#5427D7] hover:text-white",
                                day_today:
                                  "bg-[#F3F0FF] text-[#5427D7] font-semibold",
                                day_outside: "text-[#CFCFCF]",
                                day_disabled: "text-[#D1D1D1] opacity-50",
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <ErrorMessage
                          name="endDate"
                          component="p"
                          className="text-sm text-red-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ARRAY SECTIONS */}
                <Card className="rounded-3xl border border-[#ECECEC] bg-white shadow-sm">
                  <CardContent className="space-y-10 p-7">
                    {renderArrayField(
                      "Requirements",
                      "requirements",
                      values,
                      errors,
                      touched,
                    )}

                    {renderArrayField(
                      "Guidelines",
                      "guidelines",
                      values,
                      errors,
                      touched,
                    )}

                    {renderArrayField(
                      "Selection Criteria",
                      "selectionCriteria",
                      values,
                      errors,
                      touched,
                    )}

                    {renderArrayField(
                      "How To Submit",
                      "howToSubmit",
                      values,
                      errors,
                      touched,
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">
                <Card className="sticky top-6 rounded-3xl border border-[#ECECEC] bg-white shadow-sm">
                  <CardContent className="space-y-7 p-7">
                    <div>
                      <h2 className="text-xl font-semibold">Upload Assets</h2>

                      <p className="mt-1 text-sm text-[#777777]">
                        Add sponsor branding and campaign banners
                      </p>
                    </div>

                    {/* LOGO */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#555]">
                        Sponsor Logo
                      </label>

                      <label className="flex h-[190px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[#DADADA] bg-[#FAFAFA] transition hover:border-[#5427D7]/60">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="logo"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5427D7]/10">
                              <Upload className="h-6 w-6 text-[#5427D7]" />
                            </div>

                            <p className="font-medium">Upload Sponsor Logo</p>

                            <p className="mt-1 text-sm text-[#777777]">
                              PNG, JPG up to 5MB
                            </p>
                          </>
                        )}

                        <input
                          type="file"
                          hidden
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              setFieldValue("sponsorLogo", file);

                              setLogoPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>

                      <ErrorMessage
                        name="sponsorLogo"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* BANNER */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#555]">
                        Banner Image
                      </label>

                      <label className="flex h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-[#DADADA] bg-[#FAFAFA] transition hover:border-[#5427D7]/60">
                        {bannerPreview ? (
                          <img
                            src={bannerPreview}
                            alt="banner"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5427D7]/10">
                              <Upload className="h-6 w-6 text-[#5427D7]" />
                            </div>

                            <p className="font-medium">Upload Banner Image</p>

                            <p className="mt-1 text-sm text-[#777777]">
                              Recommended 1600 × 900
                            </p>
                          </>
                        )}

                        <input
                          type="file"
                          hidden
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file) {
                              setFieldValue("bannerImage", file);

                              setBannerPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </label>

                      <ErrorMessage
                        name="bannerImage"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* SUBMIT */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-2xl bg-[#5427D7] text-base font-semibold text-white hover:bg-[#5427D7]/90"
                    >
                      {isSubmitting ? "Creating..." : "Create Campaign"}
                    </Button>

                    {/* ERROR SUMMARY */}
                    {Object.keys(errors).length > 0 && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />

                          <div>
                            <p className="font-medium text-red-700">
                              Please fix the form errors
                            </p>

                            <p className="mt-1 text-sm text-red-500">
                              Some required fields are missing or invalid.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
