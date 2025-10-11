export interface ApiResponse {
  content: Report[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  empty: boolean;
}

export interface Report {
  id: number;
  report_date: string;
  report_date_year: number;
  next_date_of_filtriation: string;
  report_number: string;
  company_name: string;
  company_address: string;
  weather_condition: string;
  soil: string;
  for_client: string;
  for_ok_agency: string;
  show_location: boolean;
  show_open_connected: boolean;
  company_id: number;
  remark: number;
  image_data: {
    x: number;
  };
  earth_pit_list: EarthPit[];
}

interface EarthPit {
  remark: string;
  location: string;
  description: string;
  earth_resistance: {
    open_pit: string;
    Connected: string;
    combined: string;
  };
}
