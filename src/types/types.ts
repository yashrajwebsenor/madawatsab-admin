import {
  AgentRequestStatus,
  AttachmentStatus,
  AttachmentTypes,
  ConfigValueTypes,
  HelpSupportStatus,
  MetadataTypes,
  ProfileFor,
  UserTypes,
} from "./enum";

export interface User {
  _id: string;
  mobile: string;
  userType: UserTypes;
  email: string;
  roleId: {
    _id: string;
    name: string;
    permissions: string[];
  };
  isOnboardingCompleted: boolean;
  isPrivate: boolean;
  isVerified?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  appLanguage: string;
  createdAt: string;
  updatedAt: string;
  annualIncome: string;
  community: string;
  dob: string;
  fullName: string;
  gender: string;
  height: number;
  isFamilyLivingWithUser: boolean;
  language: string;
  maritalStatus: string;
  maslak: string;
  profileFor: ProfileFor;
  qualification: string;
  sect: string;
  workSector: string;
  profilePhoto?: Photo;
  photos: Photo[];
  isEntryFeePaid: boolean;
  address: Address;
  family: Family | null;
  userId: string;
  contactViewBalance?: number;
  contactViewLifetime?: number;
  subscription: {
    hasActivePlan: boolean;
    planName: string;
    planType: string | null;
    planDuration: string | null;
    expiryDate: string | null;
    capabilities: {
      canMessage: boolean;
      hasAdvancedFilters: boolean;
      canBlock: boolean;
      hasProfileBoost: boolean;
      hasRelationshipManager: boolean;
    };
    contactViewBalance: number;
    contactViewLifetime: number;
    viewCountRemaining: number;
  };
}

export interface Address {
  countryId: number;
  stateId: number;
  cityId: number;
  pincode: number;
  countryName: string;
  stateName: string;
  cityName: string;
}

export interface Family {
  aboutFamily: string;
  familyType: string;
  fatherName: string;
  fatherOccupation: string;
  fatherContact: string;
  motherName: string;
  motherOccupation: string;
  motherContact: string;
}

export interface Photo {
  _id: string;
  url: string;
  type: AttachmentTypes;
  status?: AttachmentStatus;
}

export interface PendingPhotoUser {
  userId: string;
  pendingCount: number;
  fullName: string | null;
  mobile: string | null;
  profilePhoto?: Photo | null;
}

export interface ReviewPhoto {
  _id: string;
  url: string;
  status: AttachmentStatus;
  createdAt: string;
}

export interface UserPhotosReview {
  user: {
    _id: string;
    fullName: string;
    mobile: string;
    gender?: string | null;
    profilePhoto?: Photo | null;
  };
  photos: ReviewPhoto[];
}

export interface DialogProps {
  isOpen: boolean;
  data?: any;
  onClose: () => void;
  refetch?: () => void;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

export interface Plan {
  _id: string;
  name: string;
  type: string;
  tagline: string;
  features: string[];
  hasAdvancedFilters: boolean;
  canMessage: boolean;
  canBlock: boolean;
  hasProfileBoost: boolean;
  hasRelationshipManager: boolean;
  pricing: {
    duration: string;
    originalPrice: number;
    discountedPrice: number;
    contactViewLimit: number;
    badgeText: string;
  }[];
  isActive: boolean;
  createdAt: string;
}

export interface CMS {
  _id: string;
  name: string;
  slug: string;
  content: string;
  updatedAt: string;
}

export interface Advertisement {
  title: string;
  description: string;
  ctaUrl: string;
  targetGenders?: string[];
  targetCityIds?: number[];
  banner: {
    url: string;
    type: AttachmentTypes;
    thumbnailUrl?: string;
  };
  ctaText: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  clicks: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface HelpSupport {
  _id: string;
  user: User;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: HelpSupportStatus;
  adminResponse?: string;
}

export interface Config {
  _id: string;
  key: string;
  value: string;
  title: string;
  description: string;
  updatedAt: string;
  valueType: ConfigValueTypes;
}

export interface AgentRequest {
  _id: string;
  userId: User;
  status: AgentRequestStatus;
  createdAt: string;
}

export interface Metadata {
  _id: string;
  name: string;
  type: MetadataTypes;
  isActive: boolean;
  createdAt: string;
}
