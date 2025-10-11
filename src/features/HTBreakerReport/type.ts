export type Report = {
  id: number;
  report_date: string;
  report_date_year: number;
  next_date_of_filtriation: string;
  report_number: string;
  company_name: string;
  company_address: string;
  location: string;
  panel_no_feeder_name_plate: string;
  circuit_breakertype: string;
  voltage_amps_ka: string;
  serial_no_manufactured_year: string;
  spring_charge_motor_volts: string;
  is_spring_charge_motor_volts: string; // could be boolean, but your JSON has "false" as string
  spring_charge_motor_volts_resistance: string;
  closing_coil_voltage: string;
  is_closing_coil_voltage: string;
  closing_coil_voltage_resistance: string;
  trip_coil_voltage: string;
  is_trip_coil_voltage: string;
  trip_coil_voltage_resistance: string;
  counter_reading_antipumping: string;
  visual_inspection_for_damaged: string;
  through_cleaning: string;
  lubricant_oil_moving_parts: string;
  on_off_operation_elect_manual: string;
  rack_in_out_checking: string;
  drive_mechanism_checking: string;
  checking_cb_door_interlock: string;
  replacement: string;
  repair: string;
  remark: string;
  for_client: string;
  for_ok_agency: string;
  panel_vc_spares: string;
  vaccum_bottle_test: string;
  company_id: number;
  image_data: {
    x: number;
  };
  insulation_resistance_check_using_5kv_insulation_tester: {
    subrows: {
      b: string;
      r: string;
      y: string;
      description: string;
    }[];
  };
  checking_cb_timing: {
    subrows: {
      b: string;
      r: string;
      y: string;
      description: string;
    }[];
  };
  contact_resistance: {
    subrows: {
      r: string;
      b: string;
      y: string;
    }[];
  };
  days_left: number;
  status: string;
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
