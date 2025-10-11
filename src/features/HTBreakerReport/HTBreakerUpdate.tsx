import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchCompanyAsync,
  selectCompany,
} from "@/features/company/companySlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseISO, format } from "date-fns";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { CheckIcon, ChevronDownIcon, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { PreLoader } from "@/components/ui/Preloader";
import { addOneYear } from "../oilReport/column";
import { Switch } from "@/components/ui/switch";

// Zod schema (unchanged)
export const reportFormSchema = z.object({
  report_date: z.string(),
  report_number: z.string(),
  next_date_of_filtriation: z.string(),
  location: z.string(),
  for_client: z.string(),
  for_ok_agency: z.string(),
  panel_no_feeder_name_plate: z.string(),
  circuit_breakertype: z.string(),
  voltage_amps_ka: z.string(),
  SERIALNO_MANUFACTURED_YEAR: z.string(),
  spring_charge_motor_volts: z.string(),
  is_spring_charge_motor_volts: z.boolean(),
  spring_charge_motor_volts_resistance: z.string(),
  closing_coil_voltage: z.string(),
  is_closing_coil_voltage: z.boolean(),
  closing_coil_voltage_resistance: z.string(),
  trip_coil_voltage: z.string(),
  is_trip_coil_voltage: z.boolean(),
  trip_coil_voltage_resistance: z.string(),
  counter_reading_antipumping: z.string(),
  visual_inspection_for_damaged: z.string(),
  through_cleaning: z.string(),
  lubricant_oil_moving_parts: z.string(),
  on_off_operation_elect_manual: z.string(),
  rack_in_out_checking: z.string(),
  drive_mechanism_checking: z.string(),
  checking_cb_door_interlock: z.string(),
  replacement: z.string(),
  repair: z.string(),
  remark: z.string(),
  company_id: z.string(),
  panel_vc_spares: z.string(),
  vaccum_bottle_test: z.string(),
  insulation_resistance_check_using_5kv_insulation_tester: z.object({
    subrows: z.array(
      z.object({
        description: z.string(),
        r: z.string(),
        y: z.string(),
        b: z.string(),
      })
    ),
  }),
  checking_cb_timing: z.object({
    subrows: z.array(
      z.object({
        description: z.string(),
        r: z.string(),
        y: z.string(),
        b: z.string(),
      })
    ),
  }),
  contact_resistance: z.object({
    subrows: z.array(
      z.object({
        r: z.string(),
        y: z.string(),
        b: z.string(),
      })
    ),
  }),
});

export type ReportType = z.infer<typeof reportFormSchema>;

export function convertReportDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, "MM.dd.yyyy");
  } catch (error) {
    console.error("Invalid date:", dateStr);
    return "";
  }
}

// Updated inspectionData with fieldName mappings
const inspectionData = [
  {
    srNo: 1,
    description: "PANEL NO/FEEDER NAME PLATE",
    fieldName: "panel_no_feeder_name_plate",
    observationReport: "01 / 100s FTL II",
  },
  {
    srNo: 2,
    description: "CIRCUIT BREAKERTYPE",
    fieldName: "circuit_breakertype",
    observationReport: "HPA 24 / 1225C ( SF6)",
  },
  {
    srNo: 3,
    description: "VOLTAGE/AMPS/KA",
    fieldName: "voltage_amps_ka",
    observationReport: "24KV / 1250A / 26.3KA",
  },
  {
    srNo: 4,
    description: "SERIALNO./MANUFACTURED YEAR",
    fieldName: "SERIALNO_MANUFACTURED_YEAR",
    observationReport: "1VYN020411001007 / 2011",
  },
  {
    srNo: 5,
    description: "SPRING CHARGING MOTOR VOLTS",
    fieldName: "spring_charge_motor_volts",
    hide: "is_spring_charge_motor_volts",
    fieldName1: "spring_charge_motor_volts_resistance",
    observationReport: "special1",
    desciption1: "Motar Resistance",
  },
  {
    srNo: 6,
    description: "CLOSING COIL VOLTAGE/RESISTANCE",
    fieldName: "closing_coil_voltage",
    hide: "is_closing_coil_voltage",
    fieldName1: "closing_coil_voltage_resistance",
    observationReport: "special1",
    desciption1: "Resistance",
  },
  {
    srNo: 7,
    description: "TRIP COIL VOLTAGE/ RESISTANCE",
    fieldName: "trip_coil_voltage",
    hide: "is_trip_coil_voltage",
    fieldName1: "trip_coil_voltage_resistance",
    observationReport: "special1",
    desciption1: "Resistance",
  },
  {
    srNo: 8,
    description: "COUNTER READING/ ANTIPUMPING(K1)",
    fieldName: "counter_reading_antipumping",
    observationReport: "0382",
  },
  {
    srNo: 9,
    description: "VISUALINSPECTION FOR DAMAGED",
    fieldName: "visual_inspection_for_damaged",
    observationReport: "OK",
  },
  {
    srNo: 11,
    description: "THOROUGH CLEANING",
    fieldName: "through_cleaning",
    observationReport: "YES DONE CRC SPRAY / SCOTCH BRITE",
  },
  {
    srNo: 12,
    description: "LUBRICATION OF MOVING PARTS/COIL",
    fieldName: "lubricant_oil_moving_parts",
    observationReport: "Done to all moving parts",
  },
  {
    srNo: 14,
    description: "ON/OFF OPERATION ELECT/MANUAL",
    fieldName: "on_off_operation_elect_manual",
    observationReport: "Manual and Electrical Operation checked OK",
  },
  {
    srNo: 15,
    description: "RACK IN/OUT CHECKING",
    fieldName: "rack_in_out_checking",
    observationReport: "OK",
  },
  {
    srNo: 16,
    description: "DRIVE MECHANISM CHECKING",
    fieldName: "drive_mechanism_checking",
    observationReport: "OK",
  },
  {
    srNo: 17,
    description: "CHECKING C.B./DOOR INTERLOCK",
    fieldName: "checking_cb_door_interlock",
    observationReport: "OK",
  },
  {
    srNo: 18,
    description: "INSULATION RESISTANCE CHECK(Ω)",
    fieldName: "insulation_resistance_check_using_5kv_insulation_tester",
    observationReport: "special",
    subRows: [
      {
        description: "BETWEEN UPPER AND LOWER CONTACT",
        r: "1 TΩ",
        y: "1 TΩ",
        b: "1 TΩ",
      },
      { description: "PHASE TO EARTH", r: "1 TΩ", y: "1 TΩ", b: "1 TΩ" },
      { description: "PHASE TO PHASE", r: ">1 TΩ", y: ">1 TΩ", b: ">1 TΩ" },
    ],
  },
  {
    srNo: 19,
    description: "CHECKING CB TIMING",
    fieldName: "checking_cb_timing",
    observationReport: "special",
    subRows: [
      { description: "CLOSE (ms)", r: "60", y: "59", b: "62" },
      { description: "OPEN (ms)", r: "46", y: "44", b: "44" },
    ],
  },
  {
    srNo: 20,
    description: "CONTACT RESISTANCE ( MICRO OHM )",
    fieldName: "contact_resistance",
    subRows: [{ r: "60", y: "59", b: "62" }],
  },
  {
    srNo: 21,
    description: "REPLACEMENT",
    fieldName: "replacement",
    observationReport: "NIL",
  },
  {
    srNo: 22,
    description: "REPAIR",
    fieldName: "repair",
    observationReport: "NIL",
  },
  {
    srNo: 23,
    description: "REMARK",
    fieldName: "remark",
    observationReport: "Breaker found working satisfactory.",
  },
  {
    srNo: 24,
    description: "Panel/VCB Spares Required",
    fieldName: "panel_vc_spares",
    observationReport: "Panel/VCB Spares Required.",
  },
  {
    srNo: 25,
    description: "Vaccum Bottle Test",
    fieldName: "vaccum_bottle_test",
    observationReport: "Vaccum Bottle Test.",
  },
];

export default function HTBreakerReportupdate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      const imgWidth = imgRect.width;
      const imgHeight = imgRect.height;
      let newX = initialX + (moveEvent.clientX - startX);
      let newY = initialY + (moveEvent.clientY - startY);
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

  const form = useForm({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      report_date: "",
      report_number: "",
      next_date_of_filtriation: "",
      location: "",
      for_client: "",
      for_ok_agency: "",
      panel_no_feeder_name_plate: "",
      circuit_breakertype: "",
      voltage_amps_ka: "",
      SERIALNO_MANUFACTURED_YEAR: "",
      spring_charge_motor_volts: "",
      is_spring_charge_motor_volts: true,
      spring_charge_motor_volts_resistance: "",
      closing_coil_voltage: "",
      is_closing_coil_voltage: true,
      closing_coil_voltage_resistance: "",
      trip_coil_voltage: "",
      is_trip_coil_voltage: true,
      trip_coil_voltage_resistance: "",
      counter_reading_antipumping: "",
      visual_inspection_for_damaged: "",
      through_cleaning: "",
      lubricant_oil_moving_parts: "",
      on_off_operation_elect_manual: "",
      rack_in_out_checking: "",
      drive_mechanism_checking: "",
      checking_cb_door_interlock: "",
      replacement: "",
      contact_resistance: {
        subrows: [
          {
            r: "",
            y: "",
            b: "",
          },
        ],
      },
      repair: "",
      remark: "",
      company_id: "",
      panel_vc_spares: "",
      vaccum_bottle_test: "",
      insulation_resistance_check_using_5kv_insulation_tester: {
        subrows: [
          {
            description: "BETWEEN UPPER AND LOWER CONTACT",
            r: "",
            y: "",
            b: "",
          },
          { description: "PHASE TO EARTH", r: "", y: "", b: "" },
          { description: "PHASE TO PHASE", r: "", y: "", b: "" },
        ],
      },
      checking_cb_timing: {
        subrows: [
          { description: "CLOSE (ms)", r: "", y: "", b: "" },
          { description: "OPEN (ms)", r: "", y: "", b: "" },
        ],
      },
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "insulation_resistance_check_using_5kv_insulation_tester.subrows",
  });

  const checkingCBTimingFieldArray = useFieldArray({
    control: form.control,
    name: "checking_cb_timing.subrows",
  });
  const contact_resistance = useFieldArray({
    control: form.control,
    name: "contact_resistance.subrows",
  });

  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
  }, [company, dispatch]);

  async function onSubmit(data: z.infer<typeof reportFormSchema>) {
    data.is_closing_coil_voltage == false &&
      (data.closing_coil_voltage_resistance = "");
    data.is_spring_charge_motor_volts == false &&
      (data.spring_charge_motor_volts_resistance = "");
    data.is_trip_coil_voltage == false &&
      (data.trip_coil_voltage_resistance = "");
    try {
      const res = await axios.post(BASE_URL + "API/Update/Service/Report", {
        ...data,
        id: id,
        image_data: { x: position.x },
        next_date_of_filtriation: addOneYear(data.report_date),
      });
      if (res.status === 200) {
        toast.success("Report updated successfully!");
        form.reset();
        navigate("/ht-breaker-report");
      }
    } catch (error) {
      toast.error("Failed to update report. Please try again.");
      console.error("Error updating report:", error);
    }
  }

  const { id } = useParams();

  const fetchReport = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}API/GetById/ServiceReport`, {
        id: id,
      });
      if (res.status === 200) {
        form.setValue("report_date", res.data.report_date);
        form.setValue("report_number", res.data.report_number);
        form.setValue(
          "next_date_of_filtriation",
          res.data.next_date_of_filtriation
        );
        form.setValue("location", res.data.location);
        form.setValue("for_client", res.data.for_client);
        form.setValue("for_ok_agency", res.data.for_ok_agency);
        form.setValue(
          "panel_no_feeder_name_plate",
          res.data.panel_no_feeder_name_plate
        );
        form.setValue("circuit_breakertype", res.data.circuit_breakertype);
        form.setValue("voltage_amps_ka", res.data.voltage_amps_ka);
        form.setValue(
          "SERIALNO_MANUFACTURED_YEAR",
          res.data.SERIALNO_MANUFACTURED_YEAR
        );
        form.setValue(
          "spring_charge_motor_volts",
          res.data.spring_charge_motor_volts
        );
        form.setValue(
          "is_spring_charge_motor_volts",
          res.data.is_spring_charge_motor_volts == "true" ? true : false
        );
        form.setValue(
          "spring_charge_motor_volts_resistance",
          res.data.spring_charge_motor_volts_resistance
        );
        form.setValue("closing_coil_voltage", res.data.closing_coil_voltage);
        form.setValue("closing_coil_voltage", res.data.closing_coil_voltage);
        form.setValue(
          "is_closing_coil_voltage",
          res.data.is_closing_coil_voltage == "true" ? true : false
        );
        form.setValue(
          "closing_coil_voltage_resistance",
          res.data.closing_coil_voltage_resistance
        );
        form.setValue("trip_coil_voltage", res.data.trip_coil_voltage);
        form.setValue(
          "is_trip_coil_voltage",
          res.data.is_trip_coil_voltage == "true" ? true : false
        );
        form.setValue(
          "trip_coil_voltage_resistance",
          res.data.trip_coil_voltage_resistance
        );
        form.setValue(
          "counter_reading_antipumping",
          res.data.counter_reading_antipumping
        );
        form.setValue(
          "visual_inspection_for_damaged",
          res.data.visual_inspection_for_damaged
        );
        form.setValue("through_cleaning", res.data.through_cleaning);
        form.setValue(
          "SERIALNO_MANUFACTURED_YEAR",
          res.data.serial_no_manufactured_year
        );
        form.setValue(
          "lubricant_oil_moving_parts",
          res.data.lubricant_oil_moving_parts
        );
        form.setValue(
          "on_off_operation_elect_manual",
          res.data.on_off_operation_elect_manual
        );
        form.setValue("rack_in_out_checking", res.data.rack_in_out_checking);
        form.setValue(
          "drive_mechanism_checking",
          res.data.drive_mechanism_checking
        );
        form.setValue(
          "checking_cb_door_interlock",
          res.data.checking_cb_door_interlock
        );
        form.setValue("replacement", res.data.replacement);
        form.setValue("repair", res.data.repair);
        form.setValue("company_id", `${res.data.company_id}`);
        form.setValue("remark", `${res.data.company_id}`);
        form.setValue("panel_vc_spares", res.data.panel_vc_spares);
        form.setValue("vaccum_bottle_test", res.data.vaccum_bottle_test);
        fieldArray.replace(
          res.data.insulation_resistance_check_using_5kv_insulation_tester
            .subrows
        );
        checkingCBTimingFieldArray.replace(res.data.checking_cb_timing.subrows);
        contact_resistance.replace(res.data.contact_resistance.subrows);
      }
    } catch (error) {
      toast.error("Failed to fetch report data. Please try again.");
      console.error("Error fetching report:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  if (loading) {
    return <PreLoader messages={["Loading", "Just there"]} dotCount={3} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="h-fit">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">
              Create HT Breaker Report
            </h2>
            <p className="text-gray-600">
              Fill in the details below to create a new report
            </p>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="report_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="report_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report No</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
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
                                  value={c.name}
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
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="panel_no_feeder_name_plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Panel No./Feeder Name Plate</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter panel no./feeder name plate"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="circuit_breakertype"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CIRCUIT BREAKERTYPE</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter CB type" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="voltage_amps_ka"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voltage / Amps / KA</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter voltage / amps / KA"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="SERIALNO_MANUFACTURED_YEAR"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SERIALNO./MANUFACTURED YEAR</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter serial no. / manufactured year"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="spring_charge_motor_volts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SPRING CHARGING MOTOR VOLTS</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter spring charge motor volts"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                  >
                    <Switch
                      className="order-1 h-4 w-6  after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      checked={form.watch("is_spring_charge_motor_volts")}
                      onCheckedChange={(value) =>
                        form.setValue("is_spring_charge_motor_volts", value)
                      }
                    />
                    <div className="grid grow gap-2">
                      <Label>MOTOR RESISTANCE</Label>
                      <p className="">
                        <FormField
                          control={form.control}
                          name="spring_charge_motor_volts_resistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Motor Resistance"
                                  {...field}
                                  disabled={
                                    !form.watch("is_spring_charge_motor_volts")
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="closing_coil_voltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CLOSING COIL VOLTAGE/RESISTANCE</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter closing coil voltage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                  >
                    <Switch
                      className="order-1 h-4 w-6  after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      checked={form.watch("is_closing_coil_voltage")}
                      onCheckedChange={(value) =>
                        form.setValue("is_closing_coil_voltage", value)
                      }
                    />
                    <div className="grid grow gap-2">
                      <Label>RESISTANCE</Label>
                      <p className="">
                        <FormField
                          control={form.control}
                          name="closing_coil_voltage_resistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Closing Coil Resistance"
                                  {...field}
                                  disabled={
                                    !form.watch("is_closing_coil_voltage")
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="trip_coil_voltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TRIP COIL VOLTAGE/ RESISTANCE</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter trip coil voltage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none"
                  >
                    <Switch
                      className="order-1 h-4 w-6  after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                      checked={form.watch("is_trip_coil_voltage")}
                      onCheckedChange={(value) =>
                        form.setValue("is_trip_coil_voltage", value)
                      }
                    />
                    <div className="grid grow gap-2">
                      <Label>RESISTANCE</Label>
                      <p className="">
                        <FormField
                          control={form.control}
                          name="trip_coil_voltage_resistance"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Trip Coil Resistance"
                                  {...field}
                                  disabled={!form.watch("is_trip_coil_voltage")}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="counter_reading_antipumping"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>COUNTER READING/ ANTIPUMPING(K1)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter counter reading"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="visual_inspection_for_damaged"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VISUALINSPECTION FOR DAMAGED</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter visual inspection details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="through_cleaning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>THOROUGH CLEANING</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter through cleaning details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lubricant_oil_moving_parts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LUBRICATION OF MOVING PARTS/COIL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter lubricant oil details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="on_off_operation_elect_manual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ON/OFF OPERATION ELECT/MANUAL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter on/off operation details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rack_in_out_checking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RACK IN/OUT CHECKING</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter rack in/out checking"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drive_mechanism_checking"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DRIVE MECHANISM CHECKING</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter drive mechanism checking"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="checking_cb_door_interlock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Checking CB Door Interlock</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter checking CB door interlock"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Insulation Resistance Check</CardTitle>
                    <CardDescription>
                      Enter details for each insulation resistance check
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {fieldArray.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`insulation_resistance_check_using_5kv_insulation_tester.subrows.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-full">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., LT, ST, GF"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`insulation_resistance_check_using_5kv_insulation_tester.subrows.${index}.r`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>R</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter R value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`insulation_resistance_check_using_5kv_insulation_tester.subrows.${index}.y`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Y</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter Y value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`insulation_resistance_check_using_5kv_insulation_tester.subrows.${index}.b`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>R</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter B value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Check CB Timing</CardTitle>
                    <CardDescription>
                      Enter details for each circuit breaker timing check
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {checkingCBTimingFieldArray.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`checking_cb_timing.subrows.${index}.description`}
                              render={({ field }) => (
                                <FormItem className="col-span-full">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., LT, ST, GF"
                                      {...field}
                                      readOnly
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`checking_cb_timing.subrows.${index}.r`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>R</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter R value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`checking_cb_timing.subrows.${index}.y`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Y</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter Y value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`checking_cb_timing.subrows.${index}.b`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>B</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter B value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>CONTACT RESISTANCE</CardTitle>
                    <CardDescription>
                      Enter details for CONTACT RESISTANCE
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {contact_resistance.fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`contact_resistance.subrows.${index}.r`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>R</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter R value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`contact_resistance.subrows.${index}.y`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Y</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter Y value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`contact_resistance.subrows.${index}.b`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>B</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter B value"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <FormField
                  control={form.control}
                  name="replacement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Replacement</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter replacement details"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repair"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repair</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter repair details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed remarks about the filtration process..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panel_vc_spares"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel/VCB Spares Required</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vaccum_bottle_test"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vaccum_Bottle_Test</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="for_client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>For Client</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Mr. Sakharam Parab"
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
                        <FormLabel>For Ok Agencies</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., M/s. OK AGENCIES"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" />
                      <span>Submitting... Report</span>
                    </div>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card className="h-auto overflow-auto">
          <div className="max-w-[2480px] max-h-[3508px] px-8 mx-auto flex flex-col">
            <div className="border border-gray-300">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="w-[40%]">
                    <img src="/oka.png" alt="Logo" className="w-full" />
                  </div>
                  <div className="text-right text-xs w-[40%]">
                    <img src="/l&k.jpeg" alt="Logo" className="w-full" />
                    <p className="text-blue-600 font-bold">
                      LK AUTHORIZED SERVICE CENTER
                    </p>
                  </div>
                </div>
                <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
                <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
              </div>
              <div className="px-6 py-1" ref={containerRef}>
                <div className="flex-col flex-wrap justify-between mx-auto tinos-regular">
                  <div className="flex justify-between font-bold text-md ">
                    <div className="flex gap-3">
                      Client:-{" "}
                      {form.watch("company_id") ? (
                        <>
                          <span>
                            {
                              company?.find(
                                (i) =>
                                  `${i.id}` == `${form.watch("company_id")}`
                              )?.name
                            }
                          </span>
                          <span className="ml-2 ">
                            {
                              company?.find(
                                (i) =>
                                  `${i.id}` == `${form.watch("company_id")}`
                              )?.address
                            }
                          </span>
                        </>
                      ) : (
                        <span>
                          <span>-</span>
                          <span>-</span>
                        </span>
                      )}
                    </div>
                    <div>
                      <span>
                        Report No.: {form.watch("report_number") && "HTCB"}
                      </span>
                      <span className="ml-1">
                        {form.watch("report_number") || "--"}
                      </span>
                    </div>
                    <>
                      Service Date:-{" "}
                      {convertReportDate(form.watch("report_date")) ||
                        "--/--/----"}
                    </>
                  </div>
                  <div>Location:- {form.watch("location") || "--"}</div>
                </div>
                <table className="w-full border-collapse border border-black">
                  <thead>
                    <tr>
                      <th className="border border-black py-1 text-center font-semibold text-sm text-nowrap">
                        Sr No.
                      </th>
                      <th className="border border-black px-1 py-1 text-center font-semibold text-sm">
                        Description
                      </th>
                      <th className="border border-black px-3 py-1 text-center font-semibold text-sm">
                        Observation Report
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionData.map((item, index) => {
                      if (item.fieldName === "contact_resistance") {
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td
                                className="border border-black px-3 text-sm text-center align-middle"
                                rowSpan={2}
                              >
                                {item.srNo}
                              </td>
                              <td
                                className="border border-black px-3 text-sm font-medium text-"
                                rowSpan={2}
                              >
                                {item.description}
                              </td>
                              <td className="border border-black px-0 py-0 text-sm">
                                <div className="flex h-full text-center justify-center align-middle">
                                  <div className="flex-1 px-2 border-r border-black text-center font-semibold">
                                    R
                                  </div>
                                  <div className="flex-1 px-1 border-r border-black text-center font-semibold">
                                    Y
                                  </div>
                                  <div className="flex-1 px-2 text-center font-semibold">
                                    B
                                  </div>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className="border border-black px-0 py-0 text-sm">
                                {item.fieldName === "contact_resistance" &&
                                  form
                                    .watch("contact_resistance.subrows")
                                    ?.map((subRow, subIndex) => (
                                      <div className="flex h-full">
                                        <div className="flex-1 px-2 border-r border-black text-center font-semibold">
                                          {subRow.r || "--"}
                                        </div>
                                        <div className="flex-1 px-1 border-r border-black text-center font-semibold">
                                          {subRow.y || "--"}
                                        </div>
                                        <div className="flex-1 px-2 text-center font-semibold">
                                          {subRow.b || "--"}
                                        </div>
                                      </div>
                                    ))}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      }
                      if (item.fieldName === "spring_charge_motor_volts") {
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="border border-black px-3 text-sm text-center align-middle">
                                {item.srNo}
                              </td>
                              <td className="border border-black px-3 text-sm font-medium text-">
                                {item.description}
                              </td>
                              <div
                                className={`flex ${
                                  form.watch("is_spring_charge_motor_volts")
                                    ? "justify-between"
                                    : "justify-center"
                                } px-2 border-b border-black `}
                              >
                                <div>
                                  {(() => {
                                    const value = form.watch(
                                      item.fieldName as keyof ReportType
                                    );
                                    return typeof value === "string"
                                      ? value || "--"
                                      : "--";
                                  })()}
                                </div>
                                {form.watch("is_spring_charge_motor_volts") && (
                                  <div className="flex  border-l w-[60%] px-1 text-sm border-black gap-1">
                                    <div>{item.desciption1}:</div>
                                    <div>
                                      {typeof item.fieldName1 === "string"
                                        ? (() => {
                                            const value = form.watch(
                                              item.fieldName1 as keyof ReportType
                                            );
                                            return typeof value === "string" ||
                                              typeof value === "number" ||
                                              typeof value === "boolean"
                                              ? value + "Ω" || "--"
                                              : "--";
                                          })()
                                        : "--"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </tr>
                          </React.Fragment>
                        );
                      }
                      if (item.fieldName === "closing_coil_voltage") {
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="border border-black px-3 text-sm text-center align-middle">
                                {item.srNo}
                              </td>
                              <td className="border border-black px-3 text-sm font-medium text-">
                                {item.description}
                              </td>
                              <div
                                className={`flex justify-between px-2   border-black border-b ${
                                  form.watch("is_closing_coil_voltage")
                                    ? "justify-between"
                                    : "justify-center"
                                }`}
                              >
                                <div>
                                  {(() => {
                                    const value = form.watch(
                                      item.fieldName as keyof ReportType
                                    );
                                    return typeof value === "string"
                                      ? value || "--"
                                      : "--";
                                  })()}
                                </div>
                                {form.watch("is_closing_coil_voltage") && (
                                  <div className="flex border-l w-[60%] px-1 text-sm border-black gap-1">
                                    <div>{item.desciption1}:</div>
                                    <div>
                                      {typeof item.fieldName1 === "string"
                                        ? (() => {
                                            const value = form.watch(
                                              item.fieldName1 as keyof ReportType
                                            );
                                            return typeof value === "string" ||
                                              typeof value === "number" ||
                                              typeof value === "boolean"
                                              ? value + "Ω" || "--"
                                              : "--";
                                          })()
                                        : "--"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </tr>
                          </React.Fragment>
                        );
                      }
                      if (item.fieldName === "trip_coil_voltage") {
                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td className="border border-black px-3 text-sm text-center align-middle">
                                {item.srNo}
                              </td>
                              <td className="border border-black px-3 text-sm font-medium text-">
                                {item.description}
                              </td>
                              <div
                                className={`flex justify-between px-2 ${
                                  form.watch("is_trip_coil_voltage")
                                    ? "justify-between"
                                    : "justify-center"
                                }`}
                              >
                                <div>
                                  {(() => {
                                    const value = form.watch(
                                      item.fieldName as keyof ReportType
                                    );
                                    return typeof value === "string"
                                      ? value || "--"
                                      : "--";
                                  })()}
                                </div>
                                {form.watch("is_trip_coil_voltage") && (
                                  <div className="flex  border-l w-[60%] px-1 text-sm border-black gap-1">
                                    <div>{item.desciption1}:</div>
                                    <div>
                                      {typeof item.fieldName1 === "string"
                                        ? (() => {
                                            const value = form.watch(
                                              item.fieldName1 as keyof ReportType
                                            );
                                            return typeof value === "string" ||
                                              typeof value === "number" ||
                                              typeof value === "boolean"
                                              ? value + "Ω" || "--"
                                              : "--";
                                          })()
                                        : "--"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </tr>
                          </React.Fragment>
                        );
                      }
                      return (
                        <React.Fragment key={index}>
                          <tr>
                            <td className="border border-black px-3 text-sm text-center align-center">
                              {item.srNo}
                            </td>
                            <td className="border border-black px-3 text-sm font-medium align-center">
                              {item.description}
                            </td>
                            <td className="border border-black w-[45%] py-0 text-sm align-center text-center">
                              {item.observationReport === "special" ? (
                                <div className="flex h-full">
                                  <div className="flex-1 px-1 border-r border-black text-center font-semibold">
                                    R
                                  </div>
                                  <div className="flex-1 border-r border-black text-center font-semibold">
                                    Y
                                  </div>
                                  <div className="flex-1 px-1 border- border-black text-center font-semibold">
                                    B
                                  </div>
                                </div>
                              ) : (
                                <div className="">
                                  {(() => {
                                    const value = form.watch(
                                      item.fieldName as keyof ReportType
                                    );
                                    return typeof value === "string"
                                      ? value || "--"
                                      : "--";
                                  })()}
                                </div>
                              )}
                            </td>
                          </tr>
                          {/* Sub-rows for special items */}
                          {item.fieldName ===
                            "insulation_resistance_check_using_5kv_insulation_tester" &&
                            form
                              .watch(
                                "insulation_resistance_check_using_5kv_insulation_tester.subrows"
                              )
                              ?.map((subRow, subIndex) => (
                                <tr key={subIndex}>
                                  <td className="border border-black px-3 text-sm"></td>
                                  <td className="border border-black px-3 text-sm pl-6">
                                    {subRow.description}
                                  </td>
                                  <td className="border border-black px-0 py-0 text-sm">
                                    <div className="flex h-full">
                                      <div className="flex-1 px-3 border-r border-black text-center">
                                        {subRow.r || "--"}
                                      </div>
                                      <div className="flex-1 px-2 border-r border-black text-center">
                                        {subRow.y || "--"}
                                      </div>
                                      <div className="flex-1 px-3 text-center">
                                        {subRow.b || "--"}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          {item.fieldName === "checking_cb_timing" &&
                            form
                              .watch("checking_cb_timing.subrows")
                              ?.map((subRow, subIndex) => (
                                <tr key={subIndex}>
                                  <td className="border border-black px-3 text-sm"></td>
                                  <td className="border border-black px-3 text-sm pl-6">
                                    {subRow.description}
                                  </td>
                                  <td className="border border-black px-0 py-0 text-sm">
                                    <div className="flex h-full">
                                      <div className="flex-1 px-3 border-r border-black text-center">
                                        {subRow.r || "--"}
                                      </div>
                                      <div className="flex-1 px-2 border-r border-black text-center">
                                        {subRow.y || "--"}
                                      </div>
                                      <div className="flex-1 px-3 text-center">
                                        {subRow.b || "--"}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          {item.fieldName === "contact_resistance" && (
                            <>
                              <tr>
                                <td
                                  className="border border-black px-3 text-sm text-center align-middle"
                                  rowSpan={2}
                                >
                                  {item.srNo}
                                </td>
                                <td
                                  className="border border-black text-sm font-medium "
                                  rowSpan={2}
                                >
                                  {item.description}
                                </td>
                                <td className="border border-black px-0 py-0 text-sm">
                                  <div className="flex h-full">
                                    <div className="flex-1 px-1 border-r border-black text-center font-semibold">
                                      R
                                    </div>
                                    <div className="flex-1 px-1 border-r border-black text-center font-semibold">
                                      Y
                                    </div>
                                    <div className="flex-1 px-2 text-center font-semibold">
                                      B
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="border border-black px-0 py-0 text-sm">
                                  <div className="flex h-full text-center justify-center align-middle"></div>
                                </td>
                              </tr>
                            </>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
                <div className="w-full flex justify-between items-center font-bold text-lg">
                  <div className="flex flex-col">
                    <span className="">For Client :</span>
                    <span>{form.watch("for_client") || "--"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="">For Ok Agencies :</span>
                    <span>{form.watch("for_ok_agency") || "--"}</span>
                  </div>
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
              <div className="border-t-8 tinos-regular border-[#fcae08] text-center p-3 text-md mt-auto">
                <p>
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
    </div>
  );
}
