import type {
  CatalogCourse,
  CatalogFilters,
  CoursePlatform,
  ManualCourseDraft,
} from "@/lib/types";
import { defaultCatalogFilters } from "@/lib/types";

const MOCK_DELAY_MS = 300;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const MOCK_CATALOG: CatalogCourse[] = [
  {
    id: "cat-1",
    title: "Ultimate AWS Certified Solutions Architect Associate",
    instructor: "Stephane Maarek",
    platform: "udemy",
    rating: 4.7,
    reviewCount: 24000,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/c412f371-bb2d-4eaa-9d0c-456f3ac01e09",
  },
  {
    id: "cat-2",
    title: "Google Cloud Professional Cloud Architect",
    instructor: "Google Cloud Training",
    platform: "coursera",
    rating: 4.6,
    reviewCount: 12000,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/75d3f2b8-7278-43e5-9fa3-8adb30660232",
  },
  {
    id: "cat-3",
    title: "Kubernetes for the Absolute Beginners",
    instructor: "Mumshad Mannambeth",
    platform: "udemy",
    rating: 4.8,
    reviewCount: 89000,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/9e152699-67fa-4399-abaf-0eef94591b74",
  },
  {
    id: "cat-4",
    title: "ICEI Cloud Native Bootcamp",
    instructor: "ICEI",
    platform: "icei",
    rating: 4.5,
    reviewCount: 3200,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/93866fed-f1b8-4153-afbf-350c5f1fc1ab",
  },
  {
    id: "cat-5",
    title: "DevOps CI/CD with GitHub Actions",
    instructor: "TechWorld with Nana",
    platform: "youtube",
    rating: 4.4,
    reviewCount: 5600,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/e45068b3-c0e0-4392-a0c9-07816cfac99b",
  },
  {
    id: "cat-6",
    title: "Terraform Associate Certification",
    instructor: "Bryan Krausen",
    platform: "udemy",
    rating: 4.7,
    reviewCount: 15000,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/501d1299-df6f-4b5c-8608-57b80d1ab43f",
  },
  {
    id: "cat-7",
    title: "Docker Mastery: with Kubernetes +Swarm from a Docker Captain",
    instructor: "Bret Fisher",
    platform: "udemy",
    rating: 4.6,
    reviewCount: 42000,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/3dcba359-1a00-4d41-a2e8-d866a9f3f23e",
  },
  {
    id: "cat-8",
    title: "Site Reliability Engineering: Measuring and Managing Reliability",
    instructor: "Google Cloud",
    platform: "coursera",
    rating: 4.5,
    reviewCount: 2100,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/1c6dbcc7-d0f0-4b33-a24a-4e7d2f256ce8",
  },
  {
    id: "cat-9",
    title: "ICEI Linux Administration Practicum",
    instructor: "ICEI",
    platform: "icei",
    rating: 4.3,
    reviewCount: 900,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/28a5eb82-ecc7-4a52-b244-ea9cfa80093c",
  },
  {
    id: "cat-10",
    title: "Apache Kafka Series - Learn Apache Kafka for Beginners",
    instructor: "Stephane Maarek",
    platform: "udemy",
    rating: 4.7,
    reviewCount: 33000,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/48fd74e3-317a-49d4-905c-0597f3c1033f",
  },
  {
    id: "cat-11",
    title: "Cloud Architecture with GCP — Design Patterns",
    instructor: "Coursera Project Network",
    platform: "coursera",
    rating: 4.2,
    reviewCount: 4100,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/c412f371-bb2d-4eaa-9d0c-456f3ac01e09",
  },
  {
    id: "cat-12",
    title: "Network Security & Zero Trust Fundamentals",
    instructor: "ICEI Security Lab",
    platform: "icei",
    rating: 4.4,
    reviewCount: 1500,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/75d3f2b8-7278-43e5-9fa3-8adb30660232",
  },
];

/** Suggestions shown in Add Course dialog (catalog tab) */
export const MOCK_DIALOG_COURSES: CatalogCourse[] = [
  {
    id: "dlg-1",
    title: "Advanced Neural Networks v2",
    instructor: "Dr. Elena Vance",
    platform: "coursera",
    rating: 4.8,
    reviewCount: 1200,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/b89e2854-dc34-4906-8a78-4cff5886ca88",
  },
  {
    id: "dlg-2",
    title: "Ethics in Artificial Intelligence",
    instructor: "Oxford AI Labs",
    platform: "coursera",
    rating: 3.2,
    reviewCount: 890,
    thumbnailUrl:
      "https://www.figma.com/api/mcp/asset/34b3f69c-0c0d-4aff-8130-22473c3187e9",
  },
];

function matchesPlatform(
  course: CatalogCourse,
  platform: CoursePlatform,
): boolean {
  if (platform === "all") return true;
  return course.platform === platform;
}

function matchesFilters(course: CatalogCourse, filters: CatalogFilters): boolean {
  const anyRating = filters.rating45 || filters.rating40;
  if (anyRating) {
    if (filters.rating45 && filters.rating40) {
      if (course.rating < 4.0) return false;
    } else if (filters.rating45 && course.rating < 4.5) return false;
    else if (filters.rating40 && course.rating < 4.0) return false;
  }
  const anyDifficulty =
    filters.difficultyBeginner ||
    filters.difficultyIntermediate ||
    filters.difficultyAdvanced;
  if (anyDifficulty) {
    /* Stub: infer difficulty from rating for demo data */
    const beginner = course.rating < 4.5;
    const advanced = course.rating >= 4.7;
    const intermediate = !beginner && !advanced;
    const ok =
      (filters.difficultyBeginner && beginner) ||
      (filters.difficultyIntermediate && intermediate) ||
      (filters.difficultyAdvanced && advanced);
    if (!ok) return false;
  }
  return true;
}

export async function getCourses(
  query: string,
  platform: CoursePlatform,
  filters: CatalogFilters = defaultCatalogFilters,
): Promise<CatalogCourse[]> {
  await delay(MOCK_DELAY_MS);
  const q = query.trim().toLowerCase();
  return MOCK_CATALOG.filter(
    (c) =>
      matchesPlatform(c, platform) &&
      matchesFilters(c, filters) &&
      (q === "" ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)),
  );
}

export async function addCourseManual(
  pathId: string,
  draft: ManualCourseDraft,
): Promise<void> {
  await delay(MOCK_DELAY_MS);
  if (typeof window !== "undefined") {
    console.info("[courses stub] manual add", { pathId, draft });
  }
}
