type ImageData = {
  x: number;
};

export type Report = {
  id: number;
  report_date: string;
  report_number: string;
  company_name: string;
  company_address: string;
  report_description: string;
  kva: string;
  voltage: string;
  make: string;
  sr_no: string;
  transformer_oil_quantity: string;
  transformer_before_filtration: string;
  transformer_after_filtration: string;
  oltc_oil_quantity: string;
  oltc_before_filtration: string;
  oltc_after_filtration: string;
  remark: string;
  clients_representative: string;
  tested_by: string;
  manufacturing_year: string;
  oltc_make_type: string;
  company_id: number;
  image_data: ImageData;
};

type Pageable = {
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

export type ApiResponse = {
  content: Report[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};
