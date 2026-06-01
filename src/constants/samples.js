export const SAMPLE_COMPLAINTS = {
  mnrega: {
    label: '🌾 Farmer Payment',
    text: 'My MNREGA wages for the last 3 months have not been credited despite completing assigned work at the Gram Panchayat level.',
  },
  ration: {
    label: '🪪 Ration Card',
    text: 'My ration card has not been updated for 6 months. Family members are missing and we cannot collect subsidized grains from the PDS shop.',
  },
  land: {
    label: '🏛 Land Dispute',
    text: 'Illegal encroachment on my agricultural land (Khasra No. XXXX). Revenue records do not match ground possession.',
  },
  electricity: {
    label: '⚡ Electricity',
    text: 'Incorrect electricity bills for 4 months showing 800 units consumption while actual usage is approximately 150 units.',
  },
};

export const DEFAULT_GENERATED_COMPLAINT = `To,
The District Supply Officer,
Food and Civil Supplies Department,
[Your District], Gujarat

Date: [Today's Date]

Subject: Non-updation of Ration Card for the past 6 months

Respected Sir/Madam,

I wish to bring to your attention that my ration card has not been updated for the past six months despite multiple visits to the local PDS office.

Due to this, my family members' names are not reflecting and we are denied our monthly food grain entitlement.

I humbly request your office to direct the concerned officials to update the ration card at the earliest.

Yours faithfully,
[Your Full Name]
Mobile: [Your Number]`;

export const DEPARTMENT_INFO = {
  name: 'Food & Civil Supplies',
  description: 'Handles ration card, PDS, and food security grievances in your district.',
  portal: 'CPGRAMS',
  priority: 'Medium',
};
