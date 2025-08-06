export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  createdAt: string;
}

export interface Property {
  id: number;
  listingTitle: string;
  town: string;
  block: string;
  streetName: string;
  postalCode: string;
  bedroomNumber: number;
  bathroomNumber: number;
  resalePrice: number;
  status: string; // 'Pending' | 'Approved' | 'Rejected'
}
