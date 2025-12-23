import { ContactData } from "../types";

export const generateVCard = (contact: ContactData): string => {
  // VCard 3.0 Format
  const parts = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N;CHARSET=UTF-8:${contact.surname};${contact.givenName};;;`,
    `FN;CHARSET=UTF-8:${contact.givenName} ${contact.surname}`,
    `ORG;CHARSET=UTF-8:${contact.company}`,
    `TITLE;CHARSET=UTF-8:${contact.title}`,
  ];

  // Add Mobile Phones (iterate through all)
  if (contact.mobilePhones && contact.mobilePhones.length > 0) {
    contact.mobilePhones.forEach(phone => {
        if (phone) parts.push(`TEL;TYPE=CELL,VOICE:${phone}`);
    });
  }

  // Add Work Phone
  if (contact.workPhone) {
    parts.push(`TEL;TYPE=WORK,VOICE:${contact.workPhone}`);
  }
  // Add Fax
  if (contact.fax) {
    parts.push(`TEL;TYPE=WORK,FAX:${contact.fax}`);
  }

  // Add Emails
  contact.emails.forEach(email => {
    parts.push(`EMAIL;TYPE=WORK,INTERNET:${email}`);
  });

  // Add Address
  if (contact.address) {
    parts.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${contact.address.replace(/;/g, ',')};;;;`);
  }

  // Add Website
  if (contact.website) {
    parts.push(`URL:${contact.website}`);
  }

  // Add Notes with Timestamp and ID
  const timestamp = new Date(contact.scannedAt).toLocaleString();
  const note = `Scanned by CardScanner Pro on ${timestamp}.\nInternal Image Ref: ${contact.id}`;
  parts.push(`NOTE;CHARSET=UTF-8:${note}`);

  parts.push("END:VCARD");

  return parts.join("\n");
};

export const downloadVCard = (contact: ContactData) => {
  const vcardContent = generateVCard(contact);
  const blob = new Blob([vcardContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  // File name format: Surname_GivenName.vcf
  link.download = `${contact.surname || 'Contact'}_${contact.givenName || 'Card'}.vcf`;
  
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};