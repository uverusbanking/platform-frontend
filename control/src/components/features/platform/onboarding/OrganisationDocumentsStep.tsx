"use client";

import { DocumentRow } from "./DocumentRow";

export const ORGANISATION_DOCUMENTS = [
  {
    label: "CAC Certificate",
    key: "cacCertificate",
    desc: "Certificate of Incorporation",
  },
  {
    label: "Memorandum of Association",
    key: "memorandum",
    desc: "MEMART & Shareholder details",
  },
  {
    label: "Board Resolution",
    key: "boardResolution",
    desc: "Signed resolution for account opening",
  },
  {
    label: "Proof of Business Address",
    key: "proofOfAddress",
    desc: "Utility bill or lease agreement",
  },
  {
    label: "UBO Declaration",
    key: "uboDeclaration",
    desc: "Ultimate Beneficial Owners form",
  },
];

export function OrganisationDocumentsStep() {
  return (
    <div className="space-y-4">
      {ORGANISATION_DOCUMENTS.map((doc) => (
        <DocumentRow key={doc.key} doc={doc} />
      ))}
    </div>
  );
}
