import { useAppSelector } from "@/app/hooks";
import { AppDispatch } from "@/app/store";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import { fetchCompanyAsync } from "@/features/company/companySlice";
import { COLUMNS } from "@/features/contactus/column";
import {
  contactUsError,
  contactUsLoading,
  fetchContactUsAsync,
  selectContactUs,
} from "@/features/contactus/contactUsSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

function ContactUs() {
  const dispatch = useDispatch<AppDispatch>();

  const data = useAppSelector(selectContactUs);
  const loading = useAppSelector(contactUsLoading);
  const error = useAppSelector(contactUsError);

  useEffect(() => {
    !data && dispatch(fetchContactUsAsync());
  }, [data, dispatch]);

  return (
    <ShadcnTable
      //   api={true}
      name="Contact Us"
      data={data}
      columns={COLUMNS}
      loading={loading}
      error={error}
    />
  );
}

export default ContactUs;
