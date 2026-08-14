"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductsHeader from "@/app/components/TittleAndBreadcrumb";
import AccountSidebar from "@/app/components/AccountSidebar";
import { useGetAddresses } from "@/app/api/hooks/customerAddress/useGetAddresses";
import { useDeleteAddress } from "@/app/api/hooks/customerAddress/useDeleteAddress";



// --- BRAND ACCENT ---
const ACCENT = "#8c1a3c";

const breadcrumbs = [
  
  { label: "Account", href: "/account" },
  { label: "Address Book", href: "/account/address" },
];

// ============================================================
// Confirmation popup — dikhta hai jab user delete pe click kare
// ============================================================
const DeleteConfirmPopup = ({ onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-[6px] w-full max-w-sm p-6 shadow-xl">
        <h3 className="text-[16px] font-bold font-hind-madurai text-[#333333] mb-2">
          Delete Address
        </h3>
        <p className="text-[13px] font-hind-madurai text-gray-500 mb-6">
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="bg-[#d9d9d9] text-[#333333] text-[12px] font-hind-madurai font-semibold tracking-[1px] uppercase px-5 py-2.5 rounded-[3px] hover:bg-[#c9c9c9] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-black text-white text-[12px] font-hind-madurai font-semibold tracking-[1px] uppercase px-5 py-2.5 rounded-[3px] hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Single address entry row — name + full address text on the
// left, Edit/Delete buttons on the right.
// ============================================================
const AddressRow = ({ address, onDelete, isDeleting }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#f5f5f5] rounded-[4px] px-5 py-5">
      <div className="text-[15px] font-hind-madurai text-[#333333] leading-[1.7]">
        <p className="font-semibold">
          {address.firstname} {address.lastname}
        </p>
        {address.company && <p>{address.company}</p>}
        <p>{address.address_1}</p>
        {address.address_2 && <p>{address.address_2}</p>}
        <p>
          {address.city}, {address.zone_name} {address.postcode}
        </p>
        <p>{address.country_name}</p>
        {address.is_default && (
          <span
            className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wide"
            style={{ color: ACCENT }}
          >
            Default Address
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link href={`/account/address/add?address_id=${address.address_id}`}>
          <button className="bg-[#d9d9d9] text-[#333333] text-[12px] font-hind-madurai font-semibold tracking-[1px] uppercase px-5 py-2.5 rounded-[3px] hover:bg-[#c9c9c9] transition-colors cursor-pointer">
            Edit
          </button>
        </Link>
        <button
          onClick={() => onDelete(address.address_id)}
          disabled={isDeleting}
          className="bg-black text-white text-[12px] font-hind-madurai font-semibold tracking-[1px] uppercase px-5 py-2.5 rounded-[3px] hover:bg-[#1a1a1a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

const AddressClient = () => {
  const router = useRouter();

  // Hook se real addresses fetch honge
  const { data: addresses = [], isLoading, isError, error } = useGetAddresses();

  // Delete mutation hook
  const { mutate: deleteAddress, isPending: isDeleting, variables: deletingId } = useDeleteAddress();

  // Popup ke liye state — kaunsa address_id delete ke liye confirm hona hai
  const [confirmAddressId, setConfirmAddressId] = useState(null);

  const handleDelete = (addressId) => {
    setConfirmAddressId(addressId);
  };

  const handleConfirmDelete = () => {
    deleteAddress(confirmAddressId, {
      onSuccess: () => {
        toast.success("Address deleted successfully");
        setConfirmAddressId(null);
      },
      onError: (error) => {
        toast.error(error?.data?.response?.message || "Failed to delete address");
        setConfirmAddressId(null);
      },
    });
  };

  const handleCancelDelete = () => {
    setConfirmAddressId(null);
  };

  return (
    <div className="font-['cambriaregular'] text-[#333333] w-full">
      {/* Light-gray banner + centered title + breadcrumb */}
      <ProductsHeader categoryName="Address Book Entries" breadcrumbs={breadcrumbs} />

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6 2xl:gap-8 w-full px-3 lg:px-3 2xl:px-32 mt-10 mb-14">
        {/* Address list + actions */}
        <div className="flex-1 min-w-0 w-full">
          {isLoading ? (
            <div className="w-full py-16 text-center text-gray-500 font-hind-madurai">
              Loading addresses...
            </div>
          ) : isError ? (
            <div className="w-full py-16 text-center text-red-500 font-hind-madurai">
              {error?.message || "Something went wrong while loading addresses."}
            </div>
          ) : addresses.length === 0 ? (
            <div className="w-full py-16 text-center text-gray-500 font-hind-madurai">
              You have no addresses saved yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {addresses.map((address) => (
                <AddressRow
                  key={address.address_id}
                  address={address}
                  onDelete={handleDelete}
                  isDeleting={isDeleting && deletingId === address.address_id}
                />
              ))}
            </div>
          )}

          {/* Back / New Address buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={() => router.push("/account")}
              className="flex-1 bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 rounded-[3px] transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer"
            >
              Back
            </button>
            <Link href="/account/address/add" className="flex-1">
              <button className="w-full bg-black text-white text-[13px] font-hind-madurai font-semibold tracking-[1.5px] uppercase py-3.5 rounded-[3px] transition-colors duration-300 hover:bg-[#1a1a1a] cursor-pointer">
                New Address
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <AccountSidebar />
      </div>

      {/* Delete confirmation popup */}
      {confirmAddressId && (
        <DeleteConfirmPopup
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default AddressClient;