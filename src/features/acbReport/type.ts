type ACBTesting = {
  id: number;
  report_id: number;
  protection: string;
  setting: string;
  characteristics: string;
  tms_as_per_relay_setting: string;
  actual_tms: string;
  result: string;
};

type ImageDate = {
  x: number;
};

type ACBReport = {
  id: number;
  report_date: string;
  company_name: string;
  company_address: string;
  name_of_client: string;
  location: string;
  type_of_acb: string;
  closing_coil_voltage: string;
  acb_sr_no: string;
  shunt_release: string;
  feeder_designation: string;
  motor_voltage: string;
  current_rating: string;
  u_v_release: string;
  type_of_release: string;
  setting: string;
  on_off_operations_manual: string;
  electrical: string;
  condition_of_main_contacts_fixed: string;
  condition_of_main_contacts_moving: string;
  condition_of_arcing_contacts_fixed: string;
  condition_of_arcing_contacts_moving: string;
  condition_of_sic_fixed: string;
  condition_of_sic_moving: string;
  condition_of_jaw_contact: string;
  condition_of_cradle_terminals: string;
  condition_of_earthing_terminals: string;
  arcing_contact_gap: string;
  condition_of_arc_chute: string;
  dusty_housing: string;
  broken_housing: string | null;
  clean: string;
  operation_of_auxiliary_contacts: string;
  condition_of_current_transformers: string;
  check_control_wiring_of_acb_for_proper_connections: string;
  greasing_of_moving_parts_in_pole_assembly: string;
  greasing_of_moving_parts_of_mechanism_and_rails: string;
  recommended_spares_for_replacement: string;
  remarks: string;
  client_repres: string;
  service_repres: string;
  company_id: number;
  acb_testing_list: ACBTesting[];
  image_date: ImageDate;
};

export type ACBReportResponse = ACBReport;
