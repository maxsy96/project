import {
  Award,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  HandHeart,
  Leaf,
  MapPinned,
  Microscope,
  Plane,
  Sprout,
  Stethoscope,
  Trophy,
  UsersRound,
} from "lucide-react";

export const opportunityTypes = [
  "Internship",
  "Volunteering",
  "Research Assistant Role",
  "Farm Visit",
  "Job Opening",
  "Training Program",
  "Scholarship",
  "Competition",
  "Conference",
  "Government Opportunity",
  "Program Abroad",
] as const;

export const sectors = [
  "Veterinary Medicine",
  "Agriculture",
  "Food Science",
  "Environment",
  "Research",
  "Government Sector",
] as const;

export const preferredLocations = [
  "On campus",
  "Local",
  "Abroad",
  "Remote/hybrid",
] as const;

export const academicYears = [
  "Foundation",
  "First year",
  "Second year",
  "Third year",
  "Fourth year",
  "Fifth year",
  "Graduate student",
] as const;

export const achievementCategories = [
  "Awards",
  "Competitions",
  "Community impact",
  "Research",
  "Events",
  "Partnerships",
  "Media recognition",
] as const;

export const eventCategories = [
  "Field visit",
  "Workshop",
  "Conference",
  "Community",
  "Research",
  "Culture",
  "Leadership",
  "International",
] as const;

export const eventStatuses = [
  "upcoming",
  "closing soon",
  "completed",
  "closed",
  "cancelled",
] as const;

export const submissionStatuses = [
  "open",
  "closing soon",
  "closed",
] as const;

export const officialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/cavmclub.uaeu", note: "Club updates and highlights" },
  { label: "TikTok", href: "https://www.tiktok.com/@cavmclub.uaeu", note: "Short videos and student moments" },
  { label: "Email", href: "mailto:Clubcavm@gmail.com", note: "Official club mailbox" },
  { label: "Opportunity Hub", href: "/opportunities", note: "Browse internships, visits, roles, and programs" },
  { label: "Register Interest", href: "/register-interest", note: "Receive matched opportunities" },
  { label: "Events", href: "/events", note: "Upcoming and past CAVM activities" },
  { label: "Alumni & Achievements", href: "/achievements", note: "Alumni stories and club impact" },
  { label: "Partner With Us", href: "/partners", note: "Submit student opportunities" },
  { label: "Contact", href: "/contact", note: "Questions and collaboration requests" },
];

export const categoryIcons = {
  Internship: BriefcaseBusiness,
  Volunteering: HandHeart,
  "Research Assistant Role": Microscope,
  "Farm Visit": Sprout,
  "Job Opening": BriefcaseBusiness,
  "Training Program": GraduationCap,
  Scholarship: Award,
  Competition: Trophy,
  Conference: CalendarDays,
  "Government Opportunity": Building2,
  "Program Abroad": Plane,
  "Veterinary Medicine": Stethoscope,
  Agriculture: Leaf,
  "Food Science": FlaskConical,
  Environment: MapPinned,
  Research: Microscope,
  "Government Sector": Building2,
  Members: UsersRound,
};

export const partnerExamples = [
  "Clinics and animal hospitals offering observation days or student training.",
  "Farms, food producers, and sustainability projects sharing practical field visits.",
  "Research labs, government entities, NGOs, and universities abroad opening pathways for CAVM students.",
];
