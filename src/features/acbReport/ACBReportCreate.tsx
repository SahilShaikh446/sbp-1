import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  fetchCompanyAsync,
  selectCompany,
} from "@/features/company/companySlice";
import { fetchOilReportAsync } from "@/features/oilReport/oilReportSlice";
import { BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  Loader,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { PDFViewer } from "@react-pdf/renderer";
import ACBReport from "@/components/template/ACBReport";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { convertReportDate } from "@/features/oilReport/OilReportCreate";
import { fetchACBReportAsync } from "./acbReportSlice";
import { addOneYear } from "../oilReport/column";

export const acbReleaseTestingSchema = z.object({
  protection: z.string().min(1, "Protection type is required"),
  setting_1: z.string().optional(),
  characteristics: z.string().optional(),
  tms_as_per_relay_setting: z.string().optional(),
  actual_tms: z.string().optional(),
  result: z.string().optional(),
});

export const acbInspectionSchema = z.object({
  // Basic Information
  report_date: z.string(),
  next_date_of_filtriation: z.string().optional(),
  report_number: z.string(),
  location: z.string(),

  // ACB Details
  type_of_acb: z.string(),
  acb_sr_no: z.string(),
  feeder_designation: z.string().optional(),
  current_rating: z.string(),

  // Voltage & Release Settings
  closing_coil_voltage: z.string().optional(),
  motor_voltage: z.string().optional(),
  shunt_release: z.string().optional(),
  u_v_release: z.string().optional(),
  type_of_release: z.string().optional(),
  setting: z.string().optional(),

  // Operations & Electrical
  on_off_operations_manual: z.string().optional(),
  electrical: z.string().optional(),

  // Contact Conditions
  condition_of_main_contacts_fixed: z.string().optional(),
  condition_of_main_contacts_moving: z.string().optional(),
  condition_of_arcing_contacts_fixed: z.string().optional(),
  condition_of_arcing_contacts_moving: z.string().optional(),
  condition_of_sic_fixed: z.string().optional(),
  condition_of_sic_moving: z.string().optional(),
  condition_of_jaw_contact: z.string().optional(),
  condition_of_cradle_terminals: z.string().optional(),
  condition_of_earthing_terminals: z.string().optional(),

  // Physical Conditions
  arcing_contact_gap: z.string().optional(),
  condition_of_arc_chute: z.string().optional(),
  dusty_housing: z.string().optional(),
  broken_housing: z.string().optional(),
  clean: z.string().optional(),

  // Testing & Maintenance
  operation_of_auxiliary_contacts: z.string().optional(),
  condition_of_current_transformers: z.string().optional(),
  check_control_wiring_of_acb_for_proper_connections: z.string().optional(),
  greasing_of_moving_parts_in_pole_assembly: z.string().optional(),
  greasing_of_moving_parts_of_mechanism_and_rails: z.string().optional(),

  // Final Details
  recommended_spares_for_replacement: z.string().optional(),
  remarks: z.string().optional(),
  for_client: z.string().optional(),
  for_ok_agency: z.string().optional(),
  company_id: z.string().min(1, "Company is Required"),

  // ACB Release Testing Array
  acb_release_testing: z
    .array(acbReleaseTestingSchema)
    .min(1, "At least one release test is required"),
});

export type ACBInspectionForm = z.infer<typeof acbInspectionSchema>;

const conditionOptions = [
  { value: "OK", label: "OK" },
  { value: "N/A", label: "N/A" },
];

const resultOptions = [
  { value: "OK", label: "OK" },
  { value: "N/A", label: "N/A" },
];

function ABCReportCreate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = position.x;
    const initialY = position.y;
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current || !imgRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      // Get size of image without translation effect
      const imgWidth = imgRect.width;
      const imgHeight = imgRect.height;

      // Calculate the delta
      let newX = initialX + (moveEvent.clientX - startX);
      let newY = initialY + (moveEvent.clientY - startY);

      // Clamp so it stays inside container
      const minX = 0;
      const minY = 0;
      const maxX = containerRect.width - imgWidth - 100;
      const maxY = containerRect.height - imgHeight;

      newX = Math.min(Math.max(newX, minX), maxX);
      newY = Math.min(Math.max(newY, minY), maxY);

      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const form = useForm<ACBInspectionForm>({
    resolver: zodResolver(acbInspectionSchema),
    defaultValues: {
      report_date: "",
      next_date_of_filtriation: "",
      report_number: "",
      location: "",
      type_of_acb: "",
      acb_sr_no: "",
      feeder_designation: "",
      current_rating: "",
      closing_coil_voltage: "",
      motor_voltage: "",
      shunt_release: "",
      u_v_release: "",
      type_of_release: "",
      setting: "",
      on_off_operations_manual: "",
      electrical: "",
      condition_of_main_contacts_fixed: "",
      condition_of_main_contacts_moving: "",
      condition_of_arcing_contacts_fixed: "",
      condition_of_arcing_contacts_moving: "",
      condition_of_sic_fixed: "",
      condition_of_sic_moving: "",
      condition_of_jaw_contact: "",
      condition_of_cradle_terminals: "",
      condition_of_earthing_terminals: "",
      arcing_contact_gap: "",
      condition_of_arc_chute: "",
      dusty_housing: "",
      broken_housing: "",
      clean: "",
      operation_of_auxiliary_contacts: "",
      condition_of_current_transformers: "",
      check_control_wiring_of_acb_for_proper_connections: "",
      greasing_of_moving_parts_in_pole_assembly: "",
      greasing_of_moving_parts_of_mechanism_and_rails: "",
      recommended_spares_for_replacement: "",
      remarks: "",
      for_client: "",
      for_ok_agency: "",
      company_id: "",
      acb_release_testing: [
        {
          protection: "LT",
          setting_1: "",
          characteristics: "",
          tms_as_per_relay_setting: "",
          actual_tms: "",
          result: "",
        },
        {
          protection: "ST",
          setting_1: "",
          characteristics: "",
          tms_as_per_relay_setting: "",
          actual_tms: "",
          result: "",
        },
        {
          protection: "GF",
          setting_1: "",
          characteristics: "",
          tms_as_per_relay_setting: "",
          actual_tms: "",
          result: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "acb_release_testing",
  });

  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
  }, [company]);

  async function onSubmit(data: ACBInspectionForm) {
    try {
      const res = await axios.post(BASE_URL + "API/Add/ACB/Report", {
        ...data,
        image_data: { x: position.x },
        next_date_of_filtriation: addOneYear(data.report_date),
        name_of_client: "",
      });
      if (res.status === 201) {
        toast.success("Report submitted successfully!");
        form.reset();
        dispatch(fetchACBReportAsync("page=0"));
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    }
    // You can also make an API POST request here
  }

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
  }, [company]);

  return (
    <div className="grid grid-cols-2 gap-3 overflow-auto p-3">
      {/* Form Section */}
      <Card className="relative  overflow-hidden">
        <CardHeader>
          <h1 className="text-3xl font-bold text-foreground">
            ACB Inspection Report
          </h1>
          <p className="text-muted-foreground mt-2">
            Air Circuit Breaker Inspection and Testing Form
          </p>
        </CardHeader>
        <CardContent className="max-h-[1010px] overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    General details about the inspection
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="report_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Report Date </FormLabel>
                        <Popover modal={true}>
                          <PopoverTrigger>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left ",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}

                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd") : ""
                                )
                              }
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="report_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Number</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            placeholder="Enter report number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="*:not-first:mt-2">
                    <Label>Company</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger className="w-full">
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          className={`bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] ${
                            form.formState.errors.company_id
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          <span
                            className={cn(
                              "truncate",
                              !form.watch("company_id") &&
                                "text-muted-foreground"
                            )}
                          >
                            {form.watch("company_id")
                              ? company?.find(
                                  (c) => `${c.id}` === form.watch("company_id")
                                )?.name || "Select company"
                              : "Select company"}
                          </span>
                          <ChevronDownIcon
                            size={16}
                            className="text-muted-foreground/80 shrink-0"
                            aria-hidden="true"
                          />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Search Company..." />
                          <CommandList>
                            <CommandEmpty>No company found.</CommandEmpty>
                            <CommandGroup>
                              {company?.map((c) => (
                                <CommandItem
                                  key={c.id}
                                  value={c.name} // search works by name
                                  onSelect={() => {
                                    form.setValue("company_id", `${c.id}`, {
                                      shouldValidate: true,
                                    });
                                    setOpen(false);
                                  }}
                                >
                                  {c.name}
                                  {`${c.id}` === form.watch("company_id") && (
                                    <CheckIcon size={16} className="ml-auto" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type_of_acb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of ACB</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ACB type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="closing_coil_voltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Coil Voltage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter voltage (V)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acb_sr_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ACB Serial Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter serial number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shunt_release"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shunt Release</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter shunt release setting"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="feeder_designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feeder Designation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter feeder designation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motor_voltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Motor Voltage</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter motor voltage (V)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="current_rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Rating</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter current rating (A)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="u_v_release"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>U/V Release</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter under voltage release"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type_of_release"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Release</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter release type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="setting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setting</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter setting value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>INSPECTION</CardTitle>
                  <CardDescription>
                    Enter inspection details for the ACB
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "on_off_operations_manual",
                      label: "ON/OFF Operations Manual:",
                    },
                    {
                      name: "electrical",
                      label: "Electrical:",
                    },
                    {
                      name: "condition_of_main_contacts_fixed",
                      label: "Condition of Main Contacts (Fixed):",
                    },
                    {
                      name: "condition_of_main_contacts_moving",
                      label: "Condition of Main Contacts (Moving):",
                    },
                    {
                      name: "condition_of_arcing_contacts_fixed",
                      label: "Condition of Arcing Contacts (Fixed):",
                    },
                    {
                      name: "condition_of_arcing_contacts_moving",
                      label: "Condition of Arcing Contacts (Moving):",
                    },
                    {
                      name: "condition_of_sic_fixed",
                      label: "Condition of SIC (Fixed):",
                    },
                    {
                      name: "condition_of_sic_moving",
                      label: "Condition of SIC (Moving):",
                    },
                  ].map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof ACBInspectionForm}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {conditionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormField
                    control={form.control}
                    name="condition_of_jaw_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition of Jaw Contact:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter operation count"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition_of_cradle_terminals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition of Cradle Terminals:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter operation count"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="condition_of_earthing_terminals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition of Earthing Terminals:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter operation count"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="arcing_contact_gap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arcing Contact Gap</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter gap measurement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition_of_arc_chute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition of Arc Chute</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {conditionOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {[
                    { name: "dusty_housing", label: "Dusty Housing" },
                    { name: "broken_housing", label: "Broken Housing" },
                    { name: "clean", label: "Clean" },
                    {
                      name: "operation_of_auxiliary_contacts",
                      label: "Operation of Auxiliary Contacts",
                    },
                    {
                      name: "condition_of_current_transformers",
                      label: "Condition of Current Transformers",
                    },
                    {
                      name: "check_control_wiring_of_acb_for_proper_connections",
                      label:
                        "Check control wiring of ACB for proper connections :",
                    },
                  ].map((item) => (
                    <FormField
                      key={item.name}
                      control={form.control}
                      name={item.name as keyof ACBInspectionForm}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{item.label}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="OK">OK</SelectItem>
                              <SelectItem value="N/A">N/A</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>GREASING SCHEDULE</CardTitle>
                  <CardDescription>
                    Enter greasing schedule details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="greasing_of_moving_parts_in_pole_assembly"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Greasing of moving parts in pole assembly
                          </FormLabel>
                          <Input placeholder="Enter details" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="greasing_of_moving_parts_of_mechanism_and_rails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Greasing of moving parts of mechanism & rails
                          </FormLabel>
                          <Input placeholder="Enter details" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ACB Release Testing</CardTitle>
                  <CardDescription>
                    Enter details for each ACB release test
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Test {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`acb_release_testing.${index}.protection`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Protection Type</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., LT, ST, GF"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`acb_release_testing.${index}.setting_1`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Setting 1</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter setting"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`acb_release_testing.${index}.characteristics`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Characteristics</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter characteristics"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`acb_release_testing.${index}.tms_as_per_relay_setting`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>TMS (Relay Setting)</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter TMS value"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`acb_release_testing.${index}.actual_tms`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Actual TMS</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter actual TMS"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`acb_release_testing.${index}.result`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Result</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value as string}
                                >
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select result" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {resultOptions.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        append({
                          protection: "",
                          setting_1: "",
                          characteristics: "",
                          tms_as_per_relay_setting: "",
                          actual_tms: "",
                          result: "",
                        })
                      }
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Test
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Final Details</CardTitle>
                  <CardDescription>Enter final details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="recommended_spares_for_replacement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Recommended Spares for Replacement
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List recommended spare parts for replacement..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter any additional remarks or observations..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="for_client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Representative</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter client representative name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="for_ok_agency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Representative</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter service representative name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset Form
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Submitting..."
                    : "Submit Report"}
                </Button>
              </div>
            </form>
          </Form>
          {/* <PDFViewer width="100%" height="600px" className="w-full">
            <ACBReport
              reportData={{
                ...form.getValues(),
                image_data: { x: position.x },
              }}
              companyData={company || []}
            />
          </PDFViewer> */}
        </CardContent>
      </Card>

      <Card className="">
        <div className="max-w-[2480px] max-h-[3508px]  px-8 mx-auto tinos-regular flex flex-col">
          {/* Header */}
          <div className="border border-grayd q-300">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div className="w-[40%]">
                  <img src="/oka.png" alt="Logo" className="w-full" />
                </div>
                <div className="text-right text-xs w-[40%]">
                  <img src="/l&k.jpeg" alt="Logo" className="w-full" />
                  <p className="text-blue-600 font-bold">
                    L&K AUTHORIZED SERVICE CENTER
                  </p>
                </div>
              </div>
              <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
              <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
            </div>

            <div className="px-9 py-2" ref={containerRef}>
              <div className=" border border-black">
                <table className="w-full text-center table-fixed">
                  <tr className="border-b border-black">
                    <td className="font-bold text-2xl underline text-center align-middle">
                      ACB SERVICE REPORT
                    </td>
                  </tr>
                  <div className="text-sm">
                    <tr className=" flex justify-between pr-8 pl-4">
                      <td className="font-bold  text-left">
                        Test Report No. {form.watch("report_number") || "--"}
                      </td>
                      <td className="font-bold  text-left">
                        Date:-{" "}
                        {convertReportDate(form.watch("report_date")) ||
                          "--/--/----"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className="font-bold  text-left">
                        Name of Client:{" "}
                        {
                          company?.find(
                            (i) => `${i.id}` == `${form.watch("company_id")}`
                          )?.name
                        }
                        {
                          company?.find(
                            (i) => `${i.id}` == `${form.watch("company_id")}`
                          )?.address
                        }
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className="font-bold  text-left">
                        <span className="font-bold mr-21">Location: </span>
                        {form.watch("location") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-15">Type of ACB: </span>
                        {form.watch("type_of_acb") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-2">
                          Closing Coil Voltage:{" "}
                        </span>
                        {form.watch("closing_coil_voltage") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-16">ACB Sr. No.: </span>
                        {form.watch("acb_sr_no") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-9">Shunt Release: </span>
                        {form.watch("shunt_release") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-5">
                          Feeder Designation:{" "}
                        </span>
                        {form.watch("feeder_designation") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-9">Motor Voltage: </span>
                        {form.watch("motor_voltage") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-11">
                          Current Rating:{" "}
                        </span>
                        {form.watch("current_rating") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-12">U/V Release: </span>
                        {form.watch("u_v_release") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-11">
                          Type of Release:{" "}
                        </span>
                        {form.watch("type_of_release") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold">
                          Setting- {form.watch("setting") || "--"}{" "}
                        </span>
                      </td>
                    </tr>
                  </div>
                  <tr className="border-t border-b border-black">
                    <td className="font-bold text-2xl  text-center align-middle">
                      INSPECTION
                    </td>
                  </tr>
                  <div className="text-sm">
                    <tr className=" flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-32">
                          ON/OFF Operations Manual:{" "}
                        </span>
                        {form.watch("on_off_operations_manual") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-12">Electrical:</span>
                        {form.watch("electrical") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-20">
                          Condition of Main Contacts (Fixed):{"           "}
                        </span>
                        {form.watch("condition_of_main_contacts_fixed") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-11">Moving: </span>
                        {form.watch("condition_of_main_contacts_moving") ||
                          "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-20">
                          Condition of Arcing Contacts (Fixed):{" "}
                        </span>
                        {form.watch("condition_of_arcing_contacts_fixed") ||
                          "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-11">Moving: </span>
                        {form.watch("condition_of_arcing_contacts_moving") ||
                          "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex justify-between pr-8 pl-4">
                      <td className=" text-left w-2/2 border-r border-black">
                        <span className="font-bold mr-39">
                          Condition of SIC (Fixed):
                        </span>
                        {form.watch("condition_of_sic_fixed") || "--"}
                      </td>
                      <td className=" text-left w-1/2 px-2">
                        <span className="font-bold mr-11">Moving: </span>
                        {form.watch("condition_of_sic_moving") || "--"}
                      </td>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold  text-left w-[60%]">
                        Condition of Jaw Contact:
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch("condition_of_jaw_contact") || "--"}{" "}
                        </td>
                      </div>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Condition of Cradle Terminals:
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch("condition_of_cradle_terminals") || "--"}
                        </td>
                      </div>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Condition of Earthing Terminals:
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch("condition_of_earthing_terminals") ||
                            "--"}
                        </td>
                      </div>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Arcing Contact Gap:
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {" "}
                          {form.watch("arcing_contact_gap") || "--"}
                        </td>
                      </div>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Condition of Arc Chute:
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch("condition_of_arc_chute") || "--"}
                        </td>
                      </div>
                    </tr>

                    <tr className="border-t border-black gap-16 flex   pr-8 pl-4">
                      <td className="font-bold text-left">
                        <span className="font-bold mr-3">
                          a) Dusty Housing:
                        </span>{" "}
                        <span className="text-left">
                          {form.watch("dusty_housing") || "--"}
                        </span>
                      </td>
                      <td className="text-left">
                        <span className="font-bold mr-3">
                          b) Broken Housing:
                        </span>{" "}
                        <span className="text-left">
                          {form.watch("broken_housing") || "--"}
                        </span>
                      </td>
                      <td className="text-left">
                        <span className="font-bold mr-3">c) Clean:</span>{" "}
                        <span className="text-left">
                          {form.watch("clean") || "--"}
                        </span>
                      </td>
                    </tr>

                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Operation Of Auxiliary Contacts :
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch("operation_of_auxiliary_contacts") ||
                            "--"}
                        </td>
                      </div>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Condition of Current Transformers :
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch("condition_of_current_transformers") ||
                            "--"}
                        </td>
                      </div>
                    </tr>
                    <tr className="border-t border-black flex   pr-8 pl-4">
                      <td className="font-bold w-[60%]  text-left">
                        Check control wiring of ACB for proper connections :
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {form.watch(
                            "check_control_wiring_of_acb_for_proper_connections"
                          ) || "--"}
                        </td>
                      </div>
                    </tr>
                  </div>
                  <tr className="border-t border-b border-black">
                    <td className="font-bold text-2xl  text-center align-middle">
                      GREASING SCHEDULE
                    </td>
                  </tr>
                  <div className="text-sm">
                    <tr className=" flex   pr-8 pl-4 gap-2">
                      <td className="font-bold text-left">
                        Greasing of moving parts in pole assembly:-
                      </td>
                      <div className="text-left">
                        <td className="text-left">
                          {" "}
                          {form.watch(
                            "greasing_of_moving_parts_in_pole_assembly"
                          ) || "--"}
                        </td>
                      </div>
                    </tr>
                    <tr className=" flex border-t border-black   pr-8 pl-4 gap-2">
                      <td className="text-left">
                        <span className="font-bold mr-3">
                          Greasing of moving parts of mechanism & rails:-
                        </span>
                        <span className="text-left">
                          {form.watch(
                            "greasing_of_moving_parts_of_mechanism_and_rails"
                          ) || "--"}
                        </span>
                      </td>
                    </tr>
                  </div>
                  <tr className="border-t border-b border-black">
                    <td className="font-bold text-2xl  text-center align-middle">
                      ACB RELEASE TESTING
                    </td>
                  </tr>
                  <table className="w-full text-sm table-fixed border-collapse">
                    <thead>
                      <tr className="">
                        <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                          Protection
                        </th>
                        <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                          Setting
                        </th>
                        <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                          Characteristics
                        </th>
                        <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                          TMS as per Relay setting
                        </th>
                        <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                          Actual TMS (Sec.)
                        </th>
                        <th className="w-1/6 font-bold text-md text-center border border-b-black px-2 py-1">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.watch("acb_release_testing").map((item, index) => (
                        <tr key={index}>
                          <td className="text-center border border-r-black border-b-black px-2 py-1">
                            {item.protection}
                          </td>
                          <td className="text-center border border-x-black border-b-black px-2 py-1">
                            {item.setting_1}
                          </td>
                          <td className="text-center border border-x-black border-b-black px-2 py-1">
                            {item.characteristics}
                          </td>
                          <td className="text-center border border-x-black border-b-black px-2 py-1">
                            {item.tms_as_per_relay_setting}
                          </td>
                          <td className="text-center border border-x-black border-b-black px-2 py-1">
                            {item.actual_tms}
                          </td>
                          <td className="text-center border border-l-black border-b-black px-2 py-1">
                            {item.result}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <tr className=" border-b border-black">
                    <td className=" pl-4 font-bold text-left align-middle">
                      Recommended Spares for Replacement:{" "}
                      {form.watch("recommended_spares_for_replacement") || "--"}
                    </td>
                  </tr>
                  <tr className="border-t border-b border-black">
                    <td className=" pl-4  text-left align-middle">
                      <span className="font-bold">Remarks:</span>{" "}
                      {form.watch("remarks") || "--"}
                    </td>
                  </tr>
                  <tr className="flex justify-between">
                    <td className=" pl-4 pr-8 text-left align-middle">
                      <span className="font-bold">For Client:</span>{" "}
                      {form.watch("for_client") || "--"}
                    </td>
                    <td className=" pl-4 pr-8 text-left align-middle">
                      <span className="font-bold">For Ok Agencies.:-</span> M/s.
                      {form.watch("for_ok_agency") || "--"}
                    </td>
                  </tr>
                </table>
              </div>
              <img
                ref={imgRef}
                className="object-contain max-h-[150px] max-w-[150px]  bottom-0 cursor-grab"
                src="/stamp.jpg"
                onMouseDown={handleMouseDown}
                style={{
                  transform: `translateX(${position.x}px)`,
                }}
                alt="Stamp"
              />
            </div>

            <div className="border-t-8 border-[#fcae08] text-center p-3 text-md mt-auto">
              <p className="">
                <span className="font-bold">Address for correspondence:</span>{" "}
                101, Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
              </p>
              <p>
                Mumbai-400081, <span className="font-bold">Contact</span> -
                9619866401, <span className="font-bold">Email</span> -{" "}
                <span className="text-blue-900 font-bold">
                  ok_agencies@yahoo.com,
                </span>
              </p>
              <p>
                <span className="font-bold">Website</span>{" "}
                <span className="text-blue-900 font-bold">
                  – www.okagencies.in;
                </span>{" "}
                <span className="font-bold">GST NO.: 27ABDPJ0462B1Z9</span>
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ABCReportCreate;
