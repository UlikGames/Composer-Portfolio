export interface Movement {
  title: string;
  duration?: string;
  audioUrl?: string;
}

export interface ScoreLink {
  title: string;
  url: string;
}

export interface Work {
  id: string;
  title: string;
  year: number | string;
  duration: number | string;
  artist?: string;
  instrumentation: string[];
  tags: string[];
  audioUrl?: string;
  scoreUrl?: string;
  scores?: ScoreLink[];
  scoreAvailability?: "free" | "request";
  imageUrl?: string;
  thumbnailUrl?: string;
  performanceNote?: string;
  isNew?: boolean;
  newOrder?: number;
  isFeatured?: boolean;
  movements?: Movement[];
}

export interface Track {
  title: string;
  workTitle?: string;
  src: string;
  workId?: string;
  artwork?: string;
}
