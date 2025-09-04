type Subrow = {
  b: string;
  r: string;
  y: string;
  description: string;
};

type Section = {
  subrows: Subrow[];
};

export type Report = {
  id: number;
  report_date: string | null;
  next_date_of_filtriation: string | null;
  report_number: string;
  company_name: string;
  company_address: string;
  location: string;
  panel_no_feeder_name_plate: string;
  cb_type: string;
  voltage_amps_ka: string;
  vcb_sr_no_year: string;
  spring_charge_motor_volts: string;
  closing_coil_voltage: string;
  trip_coil_voltage: string;
  counter_reading: string;
  visual_inspection_for_damaged: string;
  replacement: string;
  through_cleaning: string;
  lubricant_oil_moving_parts: string;
  torque: string;
  on_off_operation_elect_manual: string;
  sp6_checking: string;
  rack_in_out_checking: string;
  shutter_movement_checking: string;
  drive_mechanism_checkin: string;
  checking_cb_door_interlock: string;
  contact_resistance: string;
  repair: string;
  remark: string;
  for_client: string;
  for_ok_agency: string;
  company_id: number;
  image_data: Record<string, any>; // since structure is not fixed
  insulation_resistance_check_using_5kv_insulation_tester: Section;
  checking_cb_timing: Section;
};

type Sort = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

type Pageable = {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  unpaged: boolean;
  paged: boolean;
};

export type ReportsResponse = {
  content: Report[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
};
