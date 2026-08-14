// app/account/address/add/page.js
import { Suspense } from "react";
import AddressCreateForm from "./AdressCreateForm";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddressCreateForm />
    </Suspense>
  );
}