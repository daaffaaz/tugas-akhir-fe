import type {
  LearningPathCourseItem,
  LearningPathDetail,
  LearningPathStats,
  LearningPathSummary,
} from "@/lib/types";

const MOCK_DELAY_MS = 350;

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const MOCK_LEARNING_PATHS: LearningPathSummary[] = [
  {
    id: "path-backend",
    title: "Backend Engineering",
    difficulty: "ADVANCED",
    progressPercent: 72,
    lastActivityLabel: "Aktivitas terakhir: 2 jam sebelumnya",
    iconKey: "monitor",
    description:
      "Mastering the server-side ecosystem: APIs, databases, messaging, and scaling patterns.",
    completionTarget: "Q3 2024 (September)",
    modules: [
      {
        id: "m1",
        title: "Microservices Patterns",
        status: "completed",
        badge: "SELESAI",
      },
      {
        id: "m2",
        title: "SQL Deep Dive",
        status: "completed",
        badge: "SELESAI",
      },
      {
        id: "m3",
        title: "Distributed Caching",
        status: "in_progress",
        progressPercent: 45,
        coursesRemaining: 5,
        badge: "FOKUS SEKARANG",
      },
      {
        id: "m4",
        title: "Message Queues (Kafka)",
        status: "locked",
        badge: "PERSYARATAN DIPERLUKAN",
      },
    ],
  },
  {
    id: "path-cloud",
    title: "Cloud Security Architect",
    difficulty: "EXPERT",
    progressPercent: 15,
    iconKey: "shield",
    modules: [],
  },
  {
    id: "path-ai",
    title: "AI Integration Specialist",
    difficulty: "BEGINNER",
    progressPercent: 5,
    subtitle: "Baru Dimulai",
    iconKey: "brain",
    modules: [],
  },
  {
    id: "path-data",
    title: "Data Engineering Fundamentals",
    difficulty: "INTERMEDIATE",
    progressPercent: 22,
    iconKey: "monitor",
    modules: [],
  },
];

const PATH_DETAILS: Record<string, LearningPathDetail> = {
  "path-backend": {
    id: "path-backend",
    title: "Backend Engineering",
    courseCount: 4,
    courses: [
      {
        id: "c1",
        order: 1,
        title: "Introduction to Distributed Systems",
        level: "Foundations",
        duration: "2h 30m",
      },
      {
        id: "c2",
        order: 2,
        title: "Database Consistency & Replication",
        level: "Intermediate",
        duration: "4h 15m",
      },
      {
        id: "c3",
        order: 3,
        title: "Message Queues and Async Processing",
        level: "Intermediate",
        duration: "3h 00m",
      },
      {
        id: "c4",
        order: 4,
        title: "Scaling Web Applications to Millions",
        level: "Advanced",
        duration: "2h 15m",
      },
    ],
  },
};

export async function getLearningPaths(): Promise<LearningPathSummary[]> {
  await delay(MOCK_DELAY_MS);
  return structuredClone(MOCK_LEARNING_PATHS);
}

export async function getLearningPathStats(): Promise<LearningPathStats> {
  await delay(MOCK_DELAY_MS);
  return {
    activePaths: MOCK_LEARNING_PATHS.length,
    overallProgressPercent: 68,
  };
}

export async function getLearningPathDetail(
  id: string,
): Promise<LearningPathDetail> {
  await delay(MOCK_DELAY_MS);
  const detail = PATH_DETAILS[id];
  if (detail) return structuredClone(detail);
  const summary = MOCK_LEARNING_PATHS.find((p) => p.id === id);
  if (summary) {
    return {
      id: summary.id,
      title: summary.title,
      courseCount: 0,
      courses: [],
    };
  }
  return {
    id,
    title: "Learning path baru",
    courseCount: 0,
    courses: [],
  };
}

export async function createLearningPath(topic: string): Promise<string> {
  await delay(MOCK_DELAY_MS);
  if (typeof window !== "undefined") {
    console.info("[learning-path stub] create", { topic });
  }
  return `path-${Date.now()}`;
}

export async function updateLearningPath(
  id: string,
  courses: LearningPathCourseItem[],
): Promise<void> {
  await delay(MOCK_DELAY_MS);
  if (typeof window !== "undefined") {
    console.info("[learning-path stub] update", { id, count: courses.length });
  }
}
