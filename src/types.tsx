export interface User {
  id: number;
  username: string;
  nickname: string;
  email: string;
  createdAt: string;
}
export type PropertyImage = {
  id: number;
  propertyId: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};
export interface Property {
  id: number;
  listingTitle: string;
  sellerId: number;
  town: string;
  postalCode: string;
  bedroomNumber: number;
  bathroomNumber: number;
  block: string;
  streetName: string;
  storey: string;
  floorAreaSqm: number;
  topYear: number;
  flatModel: string;
  resalePrice: number;
  imageList: PropertyImage[];
  status: string; // 'Pending' | 'Approved' | 'Rejected'
  createdAt: string;
  updatedAt: string;
}
