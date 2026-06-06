export enum UserTypes {
  user = "user",
  admin = "admin",
  agent = "agent",
  super_admin = "super_admin",
}

export enum ProfileFor {
  self = "self",
  son = "son",
  daughter = "daughter",
  brother = "brother",
  sister = "sister",
  relative = "relative",
  friend = "friend",
}

export enum Gender {
  male = "male",
  female = "female",
}

export enum MaritalStatus {
  never_married = "never_married",
  divorced = "divorced",
  widowed = "widowed",
}

export enum Sects {
  sunni = "sunni",
  shia = "shia",
  other = "other",
}

export enum FamilyTypes {
  joint = "joint",
  single = "single",
  nuclear = "nuclear",
  blended = "blended",
  extended = "extended",
}

export enum InterestStatus {
  pending = "pending",
  accepted = "accepted",
  declined = "declined",
  cancelled = "cancelled",
}

export enum CompleteStatus {
  completed = "completed",
  pending = "pending",
}

export enum PlanDurationTypes {
  quarterly = "quarterly",
  half_yearly = "half_yearly",
  unlimited = "unlimited",
}

export enum PlanTypes {
  basic = "basic",
  silver = "silver",
  gold = "gold",
  assisted = "assisted",
  unlimited = "unlimited",
}

export enum ActiveStatus {
  active = "active",
  inactive = "inactive",
}

export enum HelpSupportStatus {
  pending = "pending",
  resolved = "resolved",
}

export enum ConfigValueTypes {
  text = "text",
  boolean = "boolean",
  number = "number",
}

export enum AgentRequestStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
}

export enum AttachmentTypes {
  ad_video = "ad_video",
  ad_banner = "ad_banner",
  profile_photo = "profile_photo",
  chat_image = "chat_image",
  chat_video = "chat_video",
}

export enum MetadataTypes {
  qualification = "qualification",
  occupation = "occupation",
  annual_income = "annual_income",
  caste = "caste",
  employed_in = "employed_in",
}
