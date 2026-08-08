
export default function TermsAndConditionsContent() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-[14px] text-black">Age Requirement</h3>
      <p>
        You must be at least 21 years of age to purchase wine or spirits. By
        placing an order through our website, you are representing yourself
        to us as at least 21 years of age. We reserve the right to ask for
        proof of identity before processing an order. An adult (over the age
        of 21) signature with proof of age verification is required at the
        time of delivery. Please be aware that someone over the age of 21
        must be available to sign for the package. If no one is available at
        the time of delivery, the package will not be left. We do not ship
        wine to PO Boxes or APO addresses.
      </p>

      <h3 className="font-bold text-[14px] text-black">
        Carrier and Delivery Times
      </h3>
      <p>
        We use UPS as our main shipper of alcoholic beverages outside of VA.
        We use their Ground, Next Day Air, and 2nd Day Air service:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Ground Service - approximately 1-7 business days in transit</li>
        <li>3 Day Select - 3 business days in transit</li>
      </ul>
      <p>
        All orders will be confirmed via e-mail and processed within 2
        business days. We will contact you by the end of the next business
        day if there are any problems with your order. You will be promptly
        notified by e-mail of any unexpected delays in processing and/or
        shipping. During times of bad weather (including excessive heat or
        cold), we recommend using 3 Day Select to avoid spoilage.
      </p>

      <h3 className="font-bold text-[14px] text-black">Shipping Notes</h3>
      <p>
        An adult signature (over the age of 21) with proof of age
        verification is required for delivery. Any request made to leave a
        package without the signature will be ignored, and no exceptions
        will be made. If you are unable to sign for your wine at the time of
        delivery you can arrange to pick up your package at your local UPS
        facility. UPS will generally hold a package for 5 business days for
        will-call pickup. All shipping charges are nonrefundable if packages
        are returned due to incorrect addresses or unavailable receivers (in
        both cases UPS will contact the receiver/sender to remedy the
        situation, it is the responsibility of the receiver to provide the
        correct shipping address and sign for the package). There will also
        be a reshipping fee if the package needs to be reshipped or a change
        of address must be made.
      </p>

      <h3 className="font-bold text-[14px] text-black">
        Delivery within DC &amp; VA
      </h3>
      <p>
        We try to deliver the product the same day as long as it is ordered
        by 2 PM. We charge $15 to $60 for delivery. An adult (over the age of
        21) signature is required for delivery.
      </p>

      <h3 className="font-bold text-[14px] text-black">Billing Information</h3>
      <p>
        Orders placed on this website are not final. Your credit card is not
        charged automatically. A charge is put on your credit card after the
        product has been packed and the order is deemed complete. Please
        note that all credit cards are verified. You must provide a billing
        address that corresponds to the credit card you are using. If the
        billing address does not match the credit card, you will be informed
        and the order will not be processed until we hear from you.
      </p>

      <h3 className="font-bold text-[14px] text-black">Questions?</h3>
      <p>
        If you have any further questions about our shipping policy, please
        feel free to{" "}
        <a
          href="https://www.dcwineandspirits.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1a73e8] hover:underline"
        >
          contact us
        </a>
        .
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          Phone:{" "}
          <a href="tel:202-459-8489" className="text-[#1a73e8] hover:underline">
            202-459-8489
          </a>
        </li>
        <li>
          E-mail:{" "}
          <a
            href="mailto:contact@dcwineandspirits.com"
            className="text-[#1a73e8] hover:underline"
          >
            contact@dcwineandspirits.com
          </a>
        </li>
      </ul>

      <p className="pt-2 border-t border-gray-100">
        <strong>Note</strong>: In the event that there is a seasonal shortage
        of any item(s), an item(s) of equal or greater value will be
        replaced.
      </p>
    </div>
  );
}