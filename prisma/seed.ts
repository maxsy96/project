import { PrismaClient } from "@prisma/client";
import { slugify } from "../lib/utils";

const prisma = new PrismaClient();
const j = (items: string[]) => JSON.stringify(items);
const d = (value: string) => new Date(`${value}T09:00:00.000Z`);
const clubEmail = "Clubcavm@gmail.com";
const uaeuEmail = (studentId: string) => (studentId ? `${studentId}@uaeu.ac.ae` : "");

type OpportunitySeed = {
  title: string;
  organization: string;
  type: string;
  sectors: string[];
  location: string;
  isRemote?: boolean;
  isAbroad?: boolean;
  isGovernmentRelated?: boolean;
  paidStatus: string;
  deadline?: Date;
  description: string;
  eligibility: string;
  requirements: string;
  benefits: string;
  applicationUrl: string;
  contactEmail?: string;
  status: string;
  source: string;
  imageUrl: string;
};

type EventSeed = {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
  submissionStatus?: string;
  imageUrl: string;
  description: string;
  organizer?: string;
  registrationUrl?: string;
};

type AchievementSeed = {
  title: string;
  category: string;
  year: number;
  date: string;
  imageUrl: string;
  description: string;
  externalUrl?: string;
};

const opportunities: OpportunitySeed[] = [
  {
    title: "Yas SeaWorld Research & Rescue Internship",
    organization: "Yas SeaWorld Research & Rescue",
    type: "Internship",
    sectors: ["Veterinary Medicine", "Environment", "Research"],
    location: "Yas Island, Abu Dhabi",
    paidStatus: "Certificate provided",
    deadline: d("2026-07-15"),
    description:
      "A four-week marine research and rescue internship with exposure to marine ecology, aquaculture, rescue and rehabilitation, labs, and field professionals.",
    eligibility: "CAVM students with an updated CV, motivation letter, faculty reference, and interview readiness.",
    requirements: "Updated student CV, UAEU faculty reference letter, motivation letter written by the student, and a five-minute interview.",
    benefits: "Mentorship from marine scientists, access to industry labs and equipment, hands-on experience, and completion certificate.",
    applicationUrl: "/files/cavm-seaworld-internship.pdf",
    contactEmail: clubEmail,
    status: "closing soon",
    source: "CAVM @ SeaWorld proposal",
    imageUrl: "/images/external/seaworld-research-rescue.jpg",
  },
  {
    title: "Ektifa Integrated Organic Food System Visit",
    organization: "Ektifa / Sharjah agriculture projects",
    type: "Farm Visit",
    sectors: ["Agriculture", "Food Science", "Environment", "Government Sector"],
    location: "Sharjah",
    isGovernmentRelated: true,
    paidStatus: "Unpaid field learning",
    deadline: d("2026-09-10"),
    description:
      "A combined learning pathway across organic wheat, dairy, greenhouse crops, poultry, honey, and food-security production systems.",
    eligibility: "Open to CAVM students interested in organic farming, animal production, food systems, and national food security.",
    requirements: "Bring field notes, closed shoes, and readiness for practical workshops.",
    benefits: "Exposure to organic field production, dairy systems, greenhouse scouting, poultry biosecurity, and beekeeping safety.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "Fall 2026 proposed visits",
    imageUrl: "/images/external/ektifa-saba-sanabel.jpg",
  },
  {
    title: "Sharjah Marine Science Research Centre Workshop",
    organization: "Sharjah Marine Science Research Centre",
    type: "Training Program",
    sectors: ["Environment", "Research", "Agriculture"],
    location: "Khorfakkan, Sharjah",
    isGovernmentRelated: true,
    paidStatus: "Unpaid workshop",
    deadline: d("2026-09-22"),
    description:
      "A marine labs and blue-economy visit with a mini-workshop on marine sampling, water quality, aquaculture research, or GIS applications.",
    eligibility: "Students interested in marine ecosystems, water quality, fisheries, aquaculture, and sustainability.",
    requirements: "Basic lab-safety awareness and commitment to submit a short reflection.",
    benefits: "Wet-lab exposure, technical Q&A, and ideas for course projects or research questions.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "Fall 2026 proposed visits",
    imageUrl: "/images/external/smsrc-khorfakkan.jpg",
  },
  {
    title: "Wadi Tarabat Reserve Biodiversity Field Day",
    organization: "Al Ain Municipality",
    type: "Volunteering",
    sectors: ["Environment", "Agriculture", "Government Sector"],
    location: "Al Ain",
    isGovernmentRelated: true,
    paidStatus: "Unpaid volunteering",
    deadline: d("2026-10-01"),
    description:
      "A guided biodiversity field day focused on native plants, wildlife, arid ecosystem conservation, and student field worksheets.",
    eligibility: "Students interested in native flora, conservation awareness, horticulture, or public-sector pathways.",
    requirements: "Outdoor field readiness, sun protection, and respect for reserve safety rules.",
    benefits: "Native plant ID practice, conservation observation skills, and government-sector exposure.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "Fall 2026 proposed visits",
    imageUrl: "/images/external/wadi-tarabat.jpg",
  },
  {
    title: "Bustanica Hydroponics Technical Workshop",
    organization: "Bustanica",
    type: "Training Program",
    sectors: ["Agriculture", "Food Science", "Research"],
    location: "Dubai",
    paidStatus: "Unpaid workshop",
    deadline: d("2026-10-12"),
    description:
      "A controlled-environment agriculture workshop covering nutrient solution, LED lighting, hygiene protocols, harvest flow, and quality systems.",
    eligibility: "CAVM students interested in hydroponics, food safety, vertical farming, or sustainable production.",
    requirements: "Interest in technical Q&A and willingness to prepare one question before the visit.",
    benefits: "Exposure to high-tech production and project ideas in resource-efficient agriculture.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "Fall 2026 proposed visits",
    imageUrl: "/images/external/bustanica-vertical-farm.jpg",
  },
  {
    title: "Emirates Bio Farm Organic Production Visit",
    organization: "Emirates Bio Farm",
    type: "Farm Visit",
    sectors: ["Agriculture", "Environment", "Food Science"],
    location: "Al Ain",
    paidStatus: "Unpaid field learning",
    deadline: d("2026-10-25"),
    description:
      "A large-scale organic vegetable production visit focused on crop rotation, pest management, compost, soil health, and farm records.",
    eligibility: "Students interested in field production, soil health, organic systems, and farm-to-table learning.",
    requirements: "Field clothing and commitment to complete a short farm-record activity.",
    benefits: "Practical comparison with integrated organic systems and greenhouse/open-field practices.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "Fall 2026 proposed visits",
    imageUrl: "/images/external/emirates-bio-farm.jpg",
  },
  {
    title: "ADIFE Student Poster Competition Pathway",
    organization: "Abu Dhabi International Food Exhibition",
    type: "Competition",
    sectors: ["Food Science", "Research", "Agriculture"],
    location: "ADNEC, Abu Dhabi",
    paidStatus: "Recognition opportunity",
    deadline: d("2026-09-30"),
    description:
      "A scientific poster pathway for students working on food security, sustainable food systems, innovation, and applied agricultural research.",
    eligibility: "Students with research, course projects, or innovation concepts suitable for poster presentation.",
    requirements: "Poster abstract, supervisor review, and readiness to present professionally.",
    benefits: "Visibility with researchers, industry professionals, and food-system stakeholders.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "CAVM achievement archive",
    imageUrl: "/images/home-submitted/food-science-booth.jpeg",
  },
  {
    title: "Wheat Breeding and Genetic Improvement Training",
    organization: "Sharjah Department of Agriculture and Livestock / Ektifa",
    type: "Research Assistant Role",
    sectors: ["Agriculture", "Research", "Government Sector"],
    location: "Sharjah",
    isGovernmentRelated: true,
    paidStatus: "Training placement",
    deadline: d("2026-08-20"),
    description:
      "A practical placement connected to wheat breeding, genetic improvement, field data, and crop improvement pathways.",
    eligibility: "Students interested in plant breeding, field trials, genetics, and government agricultural programs.",
    requirements: "Basic research interest, attention to field-data accuracy, and faculty nomination where required.",
    benefits: "Exposure to strategic crop research and national food-security initiatives.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "CAVM achievement archive",
    imageUrl: "/images/external/ektifa-saba-sanabel.jpg",
  },
  {
    title: "Liwa Date Festival Student Ambassadors",
    organization: "Liwa Date Festival",
    type: "Volunteering",
    sectors: ["Agriculture", "Food Science", "Government Sector"],
    location: "Al Dhafra",
    isGovernmentRelated: true,
    paidStatus: "Volunteer recognition",
    deadline: d("2026-07-05"),
    description:
      "A student ambassador opportunity supporting heritage agriculture, date palm education, and engagement with farmers and visitors.",
    eligibility: "Students interested in date palm, local agriculture, heritage events, and public communication.",
    requirements: "Professional conduct, event availability, and willingness to support booth operations.",
    benefits: "Community visibility, farmer engagement, and experience representing CAVM in a national event.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "closing soon",
    source: "CAVM achievement archive",
    imageUrl: "/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-001.jpg",
  },
  {
    title: "AAIHEX and ADIHEX Exhibition Volunteers",
    organization: "CAVM Club Exhibition Team",
    type: "Volunteering",
    sectors: ["Veterinary Medicine", "Agriculture", "Environment"],
    location: "Al Ain and Abu Dhabi",
    paidStatus: "Volunteer recognition",
    deadline: d("2026-08-10"),
    description:
      "Support CAVM exhibition booths by explaining projects, welcoming guests, preparing displays, and documenting public engagement.",
    eligibility: "Students comfortable with public engagement and representing the college professionally.",
    requirements: "Briefing attendance, punctuality, and respect for media consent rules.",
    benefits: "Public-speaking practice, networking, and official club service hours.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "CAVM achievement archive",
    imageUrl: "/images/archive/official-exhibition-visit/official-exhibition-visit-001.jpg",
  },
  {
    title: "Future+ Cultural and Innovation Exchange",
    organization: "Future+ program",
    type: "Program Abroad",
    sectors: ["Government Sector", "Research", "Environment"],
    location: "Indonesia",
    isAbroad: true,
    isGovernmentRelated: true,
    paidStatus: "Program-dependent funding",
    deadline: d("2026-11-01"),
    description:
      "An abroad program pathway inspired by CAVM participation in Future+, connecting culture, innovation, technology, sustainability, and student diplomacy.",
    eligibility: "Students with strong academic standing, professional conduct, and interest in international exchange.",
    requirements: "Statement of interest, passport readiness, and faculty endorsement if requested.",
    benefits: "International exposure, cultural exchange, and confidence representing UAEU and CAVM abroad.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "CAVM achievement archive",
    imageUrl: "/images/archive/future-plus-2025/future-plus-2025-038.jpg",
  },
  {
    title: "Food Waste to Worth Campus Research Sprint",
    organization: "CAVM Club and faculty mentors",
    type: "Research Assistant Role",
    sectors: ["Food Science", "Environment", "Research"],
    location: "UAEU campus",
    paidStatus: "Unpaid research experience",
    deadline: d("2026-09-05"),
    description:
      "A short applied research sprint building on waste-management and food-waste audit activities to turn campus observations into practical recommendations.",
    eligibility: "Students interested in sustainability, food waste, data collection, and behavior-change campaigns.",
    requirements: "Availability for audit sessions, basic data organization, and team reporting.",
    benefits: "Applied research experience, publication-ready club recap, and sustainability impact.",
    applicationUrl: "/register-interest",
    contactEmail: clubEmail,
    status: "open",
    source: "CAVM events timeline",
    imageUrl: "/images/home-submitted/food-science-ai-talk.jpeg",
  },
];

const events: EventSeed[] = [
  {
    title: "Yas SeaWorld Research & Rescue Internship",
    date: "2026-07-28",
    time: "9:00 AM",
    location: "Yas Island, Abu Dhabi",
    category: "Research",
    status: "upcoming",
    imageUrl: "/images/external/seaworld-research-rescue.jpg",
    description:
      "A four-week CAVM internship pathway at Yas SeaWorld Research & Rescue with marine ecology, aquaculture, rescue, rehabilitation, and lab exposure.",
    registrationUrl: "/opportunities/yas-seaworld-research-and-rescue-internship",
  },
  {
    title: "Ektifa Integrated Organic Food System Visit",
    date: "2026-10-08",
    time: "8:00 AM",
    location: "Sharjah",
    category: "Field visit",
    status: "upcoming",
    imageUrl: "/images/external/ektifa-saba-sanabel.jpg",
    description:
      "A practical learning pathway across organic field production, dairy, greenhouse crops, poultry, and honey.",
    registrationUrl: "/register-interest",
  },
  {
    title: "Sharjah Marine Science Research Centre Workshop",
    date: "2026-10-22",
    time: "9:30 AM",
    location: "Khorfakkan",
    category: "Workshop",
    status: "upcoming",
    imageUrl: "/images/external/smsrc-khorfakkan.jpg",
    description: "Marine labs, water quality, aquaculture, and blue-economy learning for CAVM students.",
    registrationUrl: "/register-interest",
  },
  {
    title: "Wadi Tarabat Reserve Biodiversity Field Day",
    date: "2026-10-29",
    time: "8:00 AM",
    location: "Al Ain",
    category: "Field visit",
    status: "upcoming",
    imageUrl: "/images/external/wadi-tarabat.jpg",
    description: "Native biodiversity, desert ecosystem conservation, plant ID, and field-observation practice.",
    registrationUrl: "/register-interest",
  },
  {
    title: "Bustanica Hydroponics Technical Visit",
    date: "2026-11-05",
    time: "10:00 AM",
    location: "Dubai",
    category: "Field visit",
    status: "upcoming",
    imageUrl: "/images/external/bustanica-vertical-farm.jpg",
    description: "Controlled-environment agriculture, vertical farming, hygiene, harvest flow, and production systems.",
    registrationUrl: "/register-interest",
  },
  {
    title: "Emirates Bio Farm Organic Production Day",
    date: "2026-11-19",
    time: "8:30 AM",
    location: "Al Ain",
    category: "Field visit",
    status: "upcoming",
    imageUrl: "/images/external/emirates-bio-farm.jpg",
    description: "Crop rotation, pest management, compost, soil health, and farm-to-table learning.",
    registrationUrl: "/register-interest",
  },
  {
    title: "Liwa Date Festival Participation",
    date: "2025-07-14",
    time: "11:00 AM",
    location: "Al Dhafra",
    category: "Culture",
    status: "completed",
    imageUrl: "/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-029.jpg",
    description:
      "CAVM Club participated in one of the UAE's leading heritage and agricultural festivals, engaging visitors, farmers, and stakeholders around local date agriculture and food security.",
  },
  {
    title: "Official Exhibition Visit",
    date: "2025-07-14",
    time: "11:00 AM",
    location: "CAVM exhibition booth",
    category: "Leadership",
    status: "completed",
    imageUrl: "/images/archive/official-exhibition-visit/official-exhibition-visit-001.jpg",
    description:
      "A supplied official-visit photo set documenting CAVM representation, plant displays, and student booth engagement.",
  },
  {
    title: "Future+ International Exchange",
    date: "2025-11-01",
    time: "9:00 AM",
    location: "Indonesia",
    category: "Leadership",
    status: "completed",
    imageUrl: "/images/archive/future-plus-2025/future-plus-2025-001.jpg",
    description:
      "CAVM students participated in an international exchange program focused on culture, innovation, creativity, and cross-cultural learning.",
  },
  {
    title: "Al Foah Gathering",
    date: "2025-11-19",
    time: "12:00 PM",
    location: "Al Foah Farm",
    category: "Community",
    status: "completed",
    imageUrl: "/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-018.jpg",
    description:
      "A student gathering at Al Foah Farm highlighting the student farm project, hands-on learning, teamwork, and farm-based engagement.",
  },
  {
    title: "A Day for Earth Workshop",
    date: "2025-06-07",
    time: "10:00 AM",
    location: "UAEU",
    category: "Workshop",
    status: "completed",
    imageUrl: "/images/home-submitted/community-planting-workshop-01.jpeg",
    description:
      "A pot-planting summer workshop with the College of Education promoting practical agricultural skills and sustainability awareness among school students.",
  },
  {
    title: "SDG Inter-School Debate",
    date: "2025-11-11",
    time: "9:00 AM",
    location: "UAEU",
    category: "Conference",
    status: "completed",
    imageUrl: "/images/home-submitted/sustainability-forum-team.jpeg",
    description:
      "A student-organized debate encouraging school students to discuss sustainability, global challenges, and youth responsibility.",
  },
  {
    title: "CAVM Week Festival",
    date: "2026-02-10",
    time: "9:00 AM",
    location: "CAVM",
    category: "Leadership",
    status: "completed",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-01.jpeg",
    description:
      "Club members supported the organization, management, and stage performances for a major agriculture, food science, and veterinary medicine festival.",
  },
  {
    title: "Walaw Bishaq Tamrah Giving Initiative",
    date: "2026-01-15",
    time: "10:00 AM",
    location: "UAEU",
    category: "Community",
    status: "completed",
    imageUrl: "/images/archive/walaw-bishaq-tamrah-giving-initiative-2026/walaw-bishaq-tamrah-giving-initiative-2026-01.jpeg",
    description:
      "A CAVM Club giving initiative organized with Emirates Red Crescent and UAEU administration, promoting charity, date-palm culture, and student responsibility.",
  },
  {
    title: "Sun Yat-sen University Student Delegation Hosting",
    date: "2026-01-29",
    time: "9:00 AM",
    location: "UAEU",
    category: "International",
    status: "completed",
    imageUrl: "/images/archive/uaeu-china-delegation-2026/uaeu-china-delegation-2026-01.jpeg",
    description:
      "CAVM Club hosted a student delegation from Sun Yat-sen University, supporting cultural exchange and coordinated student engagement at UAEU.",
  },
  {
    title: "Youth in Sustainability Dialogue Session",
    date: "2026-02-12",
    time: "10:00 AM",
    location: "CAVM",
    category: "Conference",
    status: "completed",
    imageUrl: "/images/archive/youth-sustainability-dialogue-2026/youth-sustainability-dialogue-2026-09.jpeg",
    description:
      "A dialogue session during the CAVM festival program highlighting the role of youth in sustainability, environmental responsibility, food systems, and student leadership.",
  },
  {
    title: "UAE Agricultural Conference and Sector Exhibition 2026",
    date: "2026-04-22",
    time: "9:00 AM",
    location: "UAE Agricultural Conference and Sector Exhibition",
    category: "Conference",
    status: "completed",
    imageUrl: "/images/archive/agriculture-conference-exhibition-2026/agriculture-conference-exhibition-2026-09.jpeg",
    description:
      "CAVM Club represented student involvement in a national agricultural platform focused on innovation, sustainability, food security, product displays, and public engagement.",
  },
  {
    title: "CAVM Delegation Visit to China",
    date: "2026-05-25",
    time: "9:00 AM",
    location: "China",
    category: "International",
    status: "completed",
    imageUrl: "/images/archive/china-cavm-delegation-visit-2026/china-cavm-delegation-visit-2026-01.jpeg",
    description:
      "CAVM students and representatives joined an academic and cultural visit to China, documenting international exchange, institutional visits, and student representation.",
  },
  {
    title: "UAEU Chancellor's Visit to Al Foah Research Farm",
    date: "2026-06-08",
    time: "9:00 AM",
    location: "Al Foah Research Farm",
    category: "Leadership",
    status: "completed",
    imageUrl: "/images/archive/uaeu-chancellor-visit-2026/uaeu-chancellor-visit-2026-07.jpeg",
    description:
      "CAVM Club supported college representation during the UAEU Chancellor's visit to Al Foah Research Farm through project presentations, lab engagement, and student participation.",
  },
  {
    title: "Student Clubs Forum 2025",
    date: "2025-02-24",
    time: "9:00 AM",
    location: "UAEU",
    category: "Leadership",
    status: "completed",
    imageUrl: "/images/archive/student-clubs-forum-2025/student-clubs-forum-2025-01.jpeg",
    description:
      "CAVM Club joined the Student Clubs Forum to present initiatives, exchange ideas with other university clubs, and expand student-led collaboration.",
  },
  {
    title: "UAE National Day CAVM Booth and Workshops",
    date: "2025-11-18",
    time: "10:00 AM",
    location: "CAVM",
    category: "Culture",
    status: "completed",
    imageUrl: "/images/archive/uae-national-day-cavm-booth-2025/uae-national-day-cavm-booth-2025-01.jpeg",
    description:
      "CAVM Club prepared the National Day booth and organized cultural workshops, traditional activities, and student-led public engagement.",
  },
];

const achievements: AchievementSeed[] = [
  {
    title: "Teacher's Day Celebration",
    category: "Community impact",
    year: 2025,
    date: "2025-10-05",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-02.jpeg",
    description: "Organized an appreciation initiative recognizing faculty members and strengthening the relationship between students and academic staff.",
  },
  {
    title: "Walaw Bishaq Tamrah Giving Initiative",
    category: "Community impact",
    year: 2026,
    date: "2026-01-15",
    imageUrl: "/images/archive/walaw-bishaq-tamrah-giving-initiative-2026/walaw-bishaq-tamrah-giving-initiative-2026-01.jpeg",
    description:
      "Concluded the community initiative in collaboration with the Emirates Red Crescent and UAEU administration, promoting giving, charity, and student responsibility.",
    externalUrl: "/media#walaw-bishaq-tamrah-giving-initiative-2026",
  },
  {
    title: "AAIHEX Al Ain Exhibition Representation",
    category: "Media recognition",
    year: 2025,
    date: "2025-11-26",
    imageUrl: "/images/archive/official-exhibition-visit/official-exhibition-visit-003.jpg",
    description:
      "Represented CAVM at the first Al Ain edition of the International Hunting and Equestrian Exhibition and engaged stakeholders in agriculture, sustainability, heritage, and innovation.",
  },
  {
    title: "Abu Dhabi Global Food Week Scientific Participation",
    category: "Research",
    year: 2025,
    date: "2025-10-21",
    imageUrl: "/images/home-submitted/food-science-booth.jpeg",
    description:
      "Participated in food-security and sustainability conversations at ADNEC, including student research and expert engagement around future food systems.",
  },
  {
    title: "Sun Yat-sen University Student Delegation Hosting",
    category: "Partnerships",
    year: 2026,
    date: "2026-01-29",
    imageUrl: "/images/archive/uaeu-china-delegation-2026/uaeu-china-delegation-2026-01.jpeg",
    description:
      "Hosted a student delegation from Sun Yat-sen University, China, supporting cultural exchange through coordinated activities in Al Ain and Dubai.",
    externalUrl: "/media#uaeu-china-delegation-2026",
  },
  {
    title: "CAVM Delegation Visit to China",
    category: "Partnerships",
    year: 2026,
    date: "2026-05-25",
    imageUrl: "/images/archive/china-cavm-delegation-visit-2026/china-cavm-delegation-visit-2026-01.jpeg",
    description:
      "Represented CAVM and UAEU through an academic and cultural delegation visit to China, strengthening international exchange, professional exposure, and student confidence.",
    externalUrl: "/media#china-cavm-delegation-visit-2026",
  },
  {
    title: "Second Sustainability Forum",
    category: "Events",
    year: 2026,
    date: "2026-02-01",
    imageUrl: "/images/home-submitted/sustainability-forum-team.jpeg",
    description:
      "Participated in a national sustainability platform in partnership with the motherhood and childhood sector, focused on innovation, sustainability, and food security.",
  },
  {
    title: "Future+ International Exchange Program",
    category: "Partnerships",
    year: 2025,
    date: "2025-11-01",
    imageUrl: "/images/archive/future-plus-2025/future-plus-2025-038.jpg",
    description:
      "Participated in an international exchange program focused on culture, innovation, and education, showcasing UAE heritage and creativity through cross-cultural engagement.",
    externalUrl: "/media#future-plus-2025",
  },
  {
    title: "Student Clubs Forum 2025",
    category: "Events",
    year: 2025,
    date: "2025-02-24",
    imageUrl: "/images/archive/student-clubs-forum-2025/student-clubs-forum-2025-01.jpeg",
    description:
      "Joined the Student Club Forum to exchange ideas with other university clubs, present initiatives, and expand student-led collaboration.",
    externalUrl: "/media#student-clubs-forum-2025",
  },
  {
    title: "Youth in Sustainability Dialogue Session",
    category: "Events",
    year: 2026,
    date: "2026-02-12",
    imageUrl: "/images/archive/youth-sustainability-dialogue-2026/youth-sustainability-dialogue-2026-09.jpeg",
    description:
      "Organized a dialogue session during the CAVM festival on the role and importance of youth in sustainability and environmental responsibility.",
  },
  {
    title: "CAVM Week Festival Organization",
    category: "Events",
    year: 2026,
    date: "2026-02-10",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-04.jpeg",
    description:
      "Participated in the organization and management of the overall festival and stage performances, supporting student engagement across CAVM disciplines.",
    externalUrl: "/media#cavm-week-2026",
  },
  {
    title: "A Day for Earth Pot-Planting Workshop",
    category: "Community impact",
    year: 2025,
    date: "2025-06-07",
    imageUrl: "/images/home-submitted/community-planting-workshop-01.jpeg",
    description:
      "Conducted a summer pot-planting workshop with the College of Education, promoting practical agriculture and sustainability awareness among school students.",
  },
  {
    title: "UAE Agricultural Conference and Exhibition 2025",
    category: "Partnerships",
    year: 2025,
    date: "2025-05-28",
    imageUrl: "/images/home-submitted/agriculture-conference-team.jpeg",
    description:
      "Participated in the 2025 agricultural conference and exhibition, strengthening student exposure to agricultural technologies and industry connections.",
  },
  {
    title: "UAE Agricultural Conference and Sector Exhibition 2026",
    category: "Partnerships",
    year: 2026,
    date: "2026-04-22",
    imageUrl: "/images/archive/agriculture-conference-exhibition-2026/agriculture-conference-exhibition-2026-09.jpeg",
    description:
      "Represented student involvement in a national agricultural platform focused on innovation, sustainability, and food security.",
  },
  {
    title: "Liwa Date Festival Participation",
    category: "Media recognition",
    year: 2025,
    date: "2025-07-14",
    imageUrl: "/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-029.jpg",
    description:
      "Participated in one of the UAE's leading heritage and agricultural festivals, engaging visitors, farmers, and stakeholders around local date agriculture and food security.",
    externalUrl: "/media#liwa-date-festival-2025",
  },
  {
    title: "Al Dhafra Dates Festival and Auction",
    category: "Media recognition",
    year: 2025,
    date: "2025-10-17",
    imageUrl: "/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-020.jpg",
    description:
      "Participated in a major date-palm and heritage event, promoting agricultural awareness with farmers, visitors, and sector stakeholders.",
  },
  {
    title: "Al Wathba Plant Festival",
    category: "Events",
    year: 2026,
    date: "2026-02-02",
    imageUrl: "/images/home-submitted/community-planting-workshop-02.jpeg",
    description:
      "Participated in a plant-focused event promoting agriculture, sustainability, environmental awareness, and green initiatives.",
  },
  {
    title: "World Environment Day Event",
    category: "Community impact",
    year: 2025,
    date: "2025-06-16",
    imageUrl: "/images/home-submitted/community-planting-workshop-01.jpeg",
    description:
      "Celebrated environmental stewardship through educational activities connected to sustainability and student awareness.",
  },
  {
    title: "Waste Management Awareness Event",
    category: "Community impact",
    year: 2025,
    date: "2025-04-24",
    imageUrl: "/images/home-submitted/sustainability-forum-team.jpeg",
    description:
      "Raised awareness about recycling, waste reduction, and proper segregation through campus sustainability engagement.",
  },
  {
    title: "Turning Food Waste into Worth Talk",
    category: "Events",
    year: 2025,
    date: "2025-11-05",
    imageUrl: "/images/home-submitted/food-science-ai-talk.jpeg",
    description:
      "Hosted a talk at Abu Dhabi University on food-waste reduction and transforming food waste into environmental and social value.",
  },
  {
    title: "ADIHEX Abu Dhabi Participation",
    category: "Media recognition",
    year: 2025,
    date: "2025-08-30",
    imageUrl: "/images/archive/official-exhibition-visit/official-exhibition-visit-003.jpg",
    description:
      "Participated in one of Abu Dhabi's major cultural and heritage exhibitions, supporting CAVM representation in heritage, animals, sustainability, and community engagement.",
  },
  {
    title: "ADIFE 2025 / Global Food Week Engagement",
    category: "Research",
    year: 2025,
    date: "2025-10-21",
    imageUrl: "/images/home-submitted/food-science-booth.jpeg",
    description:
      "Engaged experts and stakeholders in food security, sustainability, and agricultural innovation during ADIFE 2025 / Global Food Week.",
  },
  {
    title: "Al Foah Farm Student Gathering",
    category: "Community impact",
    year: 2025,
    date: "2025-11-19",
    imageUrl: "/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-018.jpg",
    description:
      "Organized a student gathering at Al Foah Farm to highlight the student farm project, hands-on agricultural learning, teamwork, and farm-based involvement.",
    externalUrl: "/media#al-foah-gathering-2025",
  },
  {
    title: "SDG Inter-School Debate",
    category: "Competitions",
    year: 2025,
    date: "2025-11-11",
    imageUrl: "/images/home-submitted/sustainability-forum-team.jpeg",
    description:
      "Organized a debate focused on the Sustainable Development Goals, encouraging school students to discuss sustainability, global challenges, and youth responsibility.",
  },
  {
    title: "Iftar for Fasting Volunteering",
    category: "Community impact",
    year: 2025,
    date: "2025-03-24",
    imageUrl: "/images/archive/official-exhibition-visit/official-exhibition-visit-001.jpg",
    description:
      "Volunteered in an Iftar-for-fasting initiative connected to community giving and social responsibility.",
  },
  {
    title: "Spring 2026 Orientation Day",
    category: "Events",
    year: 2026,
    date: "2026-02-01",
    imageUrl: "/images/archive/cavm-week-2026/cavm-week-2026-05.jpeg",
    description:
      "Welcomed new students, introduced CAVM programs, and promoted student involvement, leadership opportunities, and club engagement.",
  },
  {
    title: "UAEU Chancellor's Visit to Al Foah Research Farm",
    category: "Partnerships",
    year: 2026,
    date: "2026-06-08",
    imageUrl: "/images/archive/uaeu-chancellor-visit-2026/uaeu-chancellor-visit-2026-07.jpeg",
    description:
      "Supported CAVM representation during the UAEU Chancellor's visit to the research farm station at Al Foah Farm.",
  },
  {
    title: "Date Palm Research and Products Showcase",
    category: "Research",
    year: 2026,
    date: "2026-06-08",
    imageUrl: "/images/home-submitted/date-palm-student-team.jpeg",
    description:
      "Presented date palm research and products with the General Secretariat of the Khalifa International Award for Date Palm and Agricultural Innovation.",
  },
  {
    title: "International Date Palm Conference 2026",
    category: "Research",
    year: 2026,
    date: "2026-04-28",
    imageUrl: "/images/home-submitted/date-palm-student-team.jpeg",
    description:
      "Participated in a date-palm-focused conference highlighting agricultural innovation, research, production, sustainability, and food security.",
  },
  {
    title: "Welcoming the UAEU Vice Chancellor at Al Foah",
    category: "Partnerships",
    year: 2026,
    date: "2026-02-13",
    imageUrl: "/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-024.jpg",
    description:
      "Welcomed the UAEU Vice Chancellor during his visit to the University facility at Al Foah Research Farm and presented important projects and programs.",
  },
  {
    title: "Dana Al Ain Farm and Nursery Visit",
    category: "Partnerships",
    year: 2026,
    date: "2026-02-11",
    imageUrl: "/images/home-submitted/date-harvest-team.jpeg",
    description:
      "Participated in a visit to Dana Al Ain Farm and Nursery with the UAEU Chancellor, highlighting student engagement in agricultural field visits.",
  },
  {
    title: "Wheat Breeding and Genetic Improvement Program",
    category: "Research",
    year: 2026,
    date: "2026-02-04",
    imageUrl: "/images/home-submitted/al-foah-field-visit-group.jpeg",
    description:
      "Participated in a program with Sharjah agriculture entities and Ektifa focused on wheat breeding, genetic improvement, agricultural development, and food security.",
  },
  {
    title: "UAE National Day CAVM Booth and Workshops",
    category: "Community impact",
    year: 2025,
    date: "2025-11-18",
    imageUrl: "/images/archive/uae-national-day-cavm-booth-2025/uae-national-day-cavm-booth-2025-01.jpeg",
    description:
      "Prepared and decorated the CAVM booth for UAE National Day and organized workshops including dukhoon making, Talli bracelets, traditional dolls, face painting, henna, and a photo corner.",
    externalUrl: "/media#uae-national-day-cavm-booth-2025",
  },
  {
    title: "Date Palm Conference Research Project Display",
    category: "Research",
    year: 2026,
    date: "2026-04-28",
    imageUrl: "/images/home-submitted/date-palm-student-team.jpeg",
    description:
      "Displayed student date-palm research projects at the eighth international date palm conference in Abu Dhabi.",
  },
];

const media: Array<[string, string, string, string, string, string]> = [
  ["UAEU Chancellor Visit 2026 Photo Archive", "Partnerships", "Photos", "/images/archive/uaeu-chancellor-visit-2026/uaeu-chancellor-visit-2026-07.jpeg", "Supplied photo album from the UAEU Chancellor's visit to Al Foah Research Farm.", "2026-06-08"],
  ["UAE Agricultural Conference and Sector Exhibition 2026 Photo Archive", "Partnerships", "Photos", "/images/archive/agriculture-conference-exhibition-2026/agriculture-conference-exhibition-2026-09.jpeg", "Supplied photo album from the UAE Agricultural Conference and Sector Exhibition 2026.", "2026-04-22"],
  ["Youth in Sustainability Dialogue Photo Archive", "Events", "Photos", "/images/archive/youth-sustainability-dialogue-2026/youth-sustainability-dialogue-2026-09.jpeg", "Supplied photo album from the Youth in Sustainability Dialogue session.", "2026-02-12"],
  ["CAVM Week Festival Photo Archive", "Events", "Photos", "/images/archive/cavm-week-2026/cavm-week-2026-01.jpeg", "Supplied CAVM Week festival album documenting student engagement, organization, booths, and event moments.", "2026-02-10"],
  ["Liwa Date Festival Photo Archive", "Culture", "Photos", "/images/archive/liwa-date-festival-2025/liwa-date-festival-2025-001.jpg", "Complete supplied photo archive from the Liwa Date Festival booth and recognition moments.", "2025-07-14"],
  ["Al Foah Farm Gathering Photo Archive", "Community", "Photos", "/images/archive/al-foah-gathering-2025/al-foah-gathering-2025-001.jpg", "Complete supplied Gatherings Cavm album from the Al Foah student farm gathering.", "2025-11-19"],
  ["Future+ Photo Archive", "International", "Photos", "/images/archive/future-plus-2025/future-plus-2025-001.jpg", "Complete supplied Future+ international exchange album.", "2025-11-01"],
  ["Official Exhibition Visit", "Events", "Photos", "/images/archive/official-exhibition-visit/official-exhibition-visit-001.jpg", "Supplied official-visit photo set with plant displays and CAVM booth representation.", "2025-07-14"],
  ["CAVM Accomplishments Deck", "Club archive", "PDF", "/images/brand/cavm-logo.png", "Updated accomplishment deck used to build the public achievement archive.", "2026-06-23"],
  ["SeaWorld Internship Proposal", "Opportunity deck", "PDF", "/images/external/seaworld-research-rescue.jpg", "Presentation material for a four-week Yas SeaWorld Research & Rescue internship.", "2026-06-01"],
  ["Fall 2026 Visits Plan", "Planning", "PDF", "/images/external/ektifa-saba-sanabel.jpg", "Field-learning proposal connecting organic farming, marine science, conservation, hydroponics, and food systems.", "2026-06-01"],
];

const members: Array<[string, string, string, string, string]> = [
  ["Mansoor Alhosani", "202101159", "President", "Presidents", "Executive leadership"],
  ["Fatima Alnaqbi", "202202035", "President", "Presidents", "Executive leadership"],
  ["Hamad Alshamsi", "201808909", "Vice President", "Vice Presidents", "Executive leadership"],
  ["Shamsa Alnuami", "202120777", "Vice President", "Vice Presidents", "Executive leadership"],
  ["Maktoum Alkaabi", "202323311", "Secretary", "Secretaries", "Records and coordination"],
  ["Alya Albedwawi", "202202035", "Secretary", "Secretaries", "Records and coordination"],
  ["Saif Al Alawi", "202106629", "Finance Officer", "Finance Officers", "Finance and operations"],
  ["Maitha Alsehhi", "202303454", "Finance Officer", "Finance Officers", "Finance and operations"],
  ["Mubarak Alshebli", "202113430", "Innovation & Strategy Officer", "Innovation & Strategy Officers", "Innovation and strategic planning"],
  ["Fatima Al Naqbi", "202213649", "Innovation & Strategy Officer", "Innovation & Strategy Officers", "Innovation and strategic planning"],
  ["Salem Al Alawi", "202106251", "Public & Alumni Relations", "Public & Alumni Relations", "Public engagement and alumni relations"],
  ["Wadima Alshamsi", "202209763", "Public & Alumni Relations", "Public & Alumni Relations", "Public engagement and alumni relations"],
  ["Hamad Al Kaabi", "202113199", "Media Coordinator", "Media Coordinators", "Media documentation"],
  ["Raneem Abudayeh", "700040298", "Media Coordinator", "Media Coordinators", "Media documentation"],
  ["Abeer Faisal", "201814734", "Media & Event Organizer", "Media & Event Organizers", "Event media and organization"],
  ["Fatma Alshamsi", "202009677", "Media & Event Organizer", "Media & Event Organizers", "Event media and organization"],
  ["Theyab Al Ketbi", "202108654", "Events Coordinator", "Events Coordinators", "Event coordination"],
  ["Shamsa Al Nuami", "202120777", "Events Coordinator", "Events Coordinators", "Event coordination"],
  ["Saoud Alshamsi", "202106882", "Head of Organizers", "Head of Organizers", "Organizer leadership"],
  ["Maitha Aljaberi", "202312903", "Head of Organizers", "Head of Organizers", "Organizer leadership"],
  ["Rashed Alketbi", "202103764", "Operations & Logistics Officer", "Operations & Logistics", "Operations and logistics"],
  ["Maryam Alshehhi", "202305431", "Training & Development Officer", "Training & Development - Fisheries & Animal Production", "Fisheries and animal production"],
  ["Rashed Abdulhakim", "202331374", "Training & Development Officer", "Training & Development - Horticulture", "Horticulture"],
  ["Ahmed Al Ansari", "202302837", "Training & Development Officer", "Training & Development - Veterinary Medicine", "Veterinary medicine"],
  ["Saud Alsarkal", "202417593", "Training & Development Officer", "Training & Development - Veterinary Medicine", "Veterinary medicine"],
];

async function main() {
  await prisma.contactSubmission.deleteMany();
  await prisma.partnerSubmission.deleteMany();
  await prisma.alumni.deleteMany();
  await prisma.member.deleteMany();
  await prisma.mediaItem.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.studentInterest.deleteMany();
  await prisma.opportunity.deleteMany();

  await prisma.opportunity.createMany({
    data: opportunities.map((opportunity) => ({
      ...opportunity,
      slug: slugify(opportunity.title),
      sectors: j(opportunity.sectors),
      contactEmail: opportunity.contactEmail || clubEmail,
      isRemote: opportunity.isRemote ?? false,
      isAbroad: opportunity.isAbroad ?? false,
      isGovernmentRelated: opportunity.isGovernmentRelated ?? false,
      approvalStatus: "approved",
    })),
  });

  await prisma.event.createMany({
    data: events.map((event) => ({
      title: event.title,
      slug: slugify(event.title),
      date: d(event.date),
      time: event.time,
      location: event.location,
      category: event.category,
      status: event.status,
      submissionStatus: event.submissionStatus || (event.status === "upcoming" || event.status === "closing soon" ? "open" : "closed"),
      imageUrl: event.imageUrl,
      description: event.description,
      organizer: event.organizer || "CAVM Club",
      registrationUrl: event.registrationUrl || "",
    })),
  });

  await prisma.achievement.createMany({
    data: achievements.map((achievement) => ({
      title: achievement.title,
      category: achievement.category,
      year: achievement.year,
      date: d(achievement.date),
      imageUrl: achievement.imageUrl,
      description: achievement.description,
      externalUrl: achievement.externalUrl || "",
    })),
  });

  await prisma.mediaItem.createMany({
    data: media.map(([title, category, mediaType, imageUrl, description, date]) => ({
      title,
      category,
      mediaType,
      imageUrl,
      description,
      videoUrl: "",
      date: d(date),
    })),
  });

  await prisma.member.createMany({
    data: members.map(([name, studentId, role, committee, areaOfInterest], index) => ({
      name,
      studentId,
      email: uaeuEmail(studentId),
      role,
      committee,
      areaOfInterest,
      bio: `${role} serving on the CAVM Club ${committee} team for the 2026 committee.`,
      imageUrl: "",
      socialUrl: "",
      order: index + 1,
      isActive: true,
    })),
  });

  await prisma.alumni.createMany({
    data: [
      {
        name: "Hamad Al Mazrouei",
        graduationYear: "2023",
        currentRole: "Veterinary intern",
        sector: "Veterinary Medicine",
        story: "Used club volunteering and exhibition work to build confidence before clinical training.",
        advice: "Say yes to field exposure early; it makes classroom learning more real.",
        imageUrl: "",
        socialUrl: "",
      },
      {
        name: "Latifa Al Ketbi",
        graduationYear: "2022",
        currentRole: "Food safety officer",
        sector: "Food Science",
        story: "Connected a student poster project to a food-systems career path.",
        advice: "Document your projects well because they become your portfolio.",
        imageUrl: "",
        socialUrl: "",
      },
      {
        name: "Omar Al Falasi",
        graduationYear: "2021",
        currentRole: "Agricultural research assistant",
        sector: "Research",
        story: "Started through farm visits and later joined applied crop research work.",
        advice: "Ask better questions on every visit and keep your field notes.",
        imageUrl: "",
        socialUrl: "",
      },
      {
        name: "Meera Al Darmaki",
        graduationYear: "2020",
        currentRole: "Sustainability program coordinator",
        sector: "Government Sector",
        story: "Moved from club sustainability campaigns into public-sector environmental programs.",
        advice: "Student leadership is real professional practice if you treat it seriously.",
        imageUrl: "",
        socialUrl: "",
      },
    ],
  });

  await prisma.partnerSubmission.createMany({
    data: [
      {
        organizationName: "Al Ain Veterinary Clinic",
        contactPerson: "Training Coordinator",
        email: "training@example.com",
        phone: "",
        opportunityTitle: "Small Animal Clinic Observation Day",
        opportunityType: "Training Program",
        sectors: j(["Veterinary Medicine"]),
        description: "Observation day for veterinary students interested in small animal clinical workflow and client communication.",
        location: "Al Ain",
        deadline: d("2026-08-15"),
        eligibility: "Veterinary medicine students in year three or above.",
        applicationUrl: "https://example.com/clinic-day",
        notes: "Pending club review before publication.",
        approvalStatus: "pending",
      },
      {
        organizationName: "Green Horizons NGO",
        contactPerson: "Volunteer Manager",
        email: "volunteer@example.org",
        phone: "",
        opportunityTitle: "Native Plant Restoration Weekend",
        opportunityType: "Volunteering",
        sectors: j(["Environment", "Agriculture"]),
        description: "Weekend restoration activity focused on native plant care and environmental awareness.",
        location: "Abu Dhabi",
        deadline: d("2026-09-01"),
        eligibility: "All CAVM students.",
        applicationUrl: "https://example.org/native-plants",
        notes: "Needs transport discussion.",
        approvalStatus: "pending",
      },
    ],
  });

  await prisma.studentInterest.create({
    data: {
      fullName: "Demo Student",
      studentId: "202600000",
      email: "student@example.edu",
      phone: "",
      academicYear: "Third year",
      major: "Veterinary Medicine",
      interests: j(["Veterinary Medicine", "Environment", "Research"]),
      opportunityPreferences: j(["Internships", "Research Assistant Roles", "Training Programs"]),
      preferredLocations: j(["Local", "On campus"]),
      availability: "Weekdays after 2 PM and selected weekends.",
      goals: "I want to build practical experience with animal care, marine rescue, and applied research.",
      consent: true,
    },
  });

  await prisma.contactSubmission.create({
    data: {
      name: "External Partner",
      email: "partner@example.com",
      subject: "Potential student training collaboration",
      message: `We would like to discuss a training pathway for CAVM students. Please contact ${clubEmail}.`,
    },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
