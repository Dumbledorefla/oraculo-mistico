/**
 * Página de Aula do Curso - Oráculo Místico
 */

import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  Clock, 
  CheckCircle,
  Play,
  Lock,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function CourseLesson() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const { data: course } = trpc.courses.getBySlug.useQuery({ slug: slug || "" });
  const { data: lesson, isLoading } = trpc.courses.getLesson.useQuery(
    { lessonId: parseInt(lessonId || "0") },
    { enabled: !!lessonId }
  );
  const { data: modules } = trpc.courses.getModules.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id }
  );
  const { data: progress, refetch: refetchProgress } = trpc.courses.getProgress.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id && isAuthenticated }
  );

  const updateProgressMutation = trpc.courses.updateProgress.useMutation({
    onSuccess: () => {
      refetchProgress();
    },
  });

  const completedLessons = progress?.filter(p => p.isCompleted).map(p => p.lessonId) || [];
  const isCurrentLessonCompleted = completedLessons.includes(parseInt(lessonId || "0"));

  // Get all lessons for navigation
  const allLessons: any[] = [];
  modules?.forEach(module => {
    // We'll need to fetch lessons for each module
  });

  const handleMarkComplete = () => {
    if (!course?.id || !lessonId) return;
    
    updateProgressMutation.mutate({
      lessonId: parseInt(lessonId),
      courseId: course.id,
      isCompleted: true,
    });
    toast.success("Aula marcada como concluída!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Aula não encontrada</h1>
          <Link href={`/curso/${slug}`}>
            <Button>Voltar ao Curso</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (lesson.locked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl text-white mb-4">Aula Bloqueada</h1>
          <p className="text-gray-400 mb-6">
            Esta aula está disponível apenas para alunos matriculados no curso.
          </p>
          <Link href={`/curso/${slug}`}>
            <Button className="bg-purple-500 hover:bg-purple-600">
              Ver Detalhes do Curso
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link href={`/curso/${slug}`}>
                <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden md:inline">Voltar ao Curso</span>
                </a>
              </Link>
            </div>
            <Link href="/">
              <a className="flex items-center gap-2 text-purple-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                <span className="hidden md:inline">Oráculo Místico</span>
              </a>
            </Link>
            <div className="flex items-center gap-2">
              {!isCurrentLessonCompleted && (
                <Button
                  onClick={handleMarkComplete}
                  disabled={updateProgressMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Marcar como Concluída</span>
                </Button>
              )}
              {isCurrentLessonCompleted && (
                <Badge className="bg-green-500/20 text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Concluída
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-r border-purple-500/20 bg-gray-950/50 h-[calc(100vh-73px)] sticky top-[73px]">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-white font-medium mb-4">{course?.title}</h3>
                
                {modules?.map((module, moduleIndex) => (
                  <ModuleSidebar
                    key={module.id}
                    module={module}
                    moduleIndex={moduleIndex}
                    courseSlug={slug || ""}
                    currentLessonId={parseInt(lessonId || "0")}
                    completedLessons={completedLessons}
                  />
                ))}
              </div>
            </ScrollArea>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? "" : "w-full"}`}>
          <div className="max-w-4xl mx-auto py-8 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Lesson Title */}
              <h1 className="text-3xl font-serif text-white mb-4">{lesson.title}</h1>
              <p className="text-gray-400 mb-8">{lesson.description}</p>

              {/* Video Content */}
              {lesson.contentType === "video" && lesson.videoUrl && (
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-8">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Text Content */}
              {lesson.contentType === "text" && lesson.textContent && (
                <Card className="bg-gray-900/50 border-purple-500/20 mb-8">
                  <CardContent className="p-8 prose prose-invert max-w-none">
                    <Streamdown>{lesson.textContent}</Streamdown>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-8 border-t border-purple-500/20">
                <Button
                  variant="outline"
                  className="border-purple-500/30 text-gray-400 hover:text-white"
                  disabled
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Aula Anterior
                </Button>
                <Button
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                  disabled
                >
                  Próxima Aula
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ModuleSidebar({
  module,
  moduleIndex,
  courseSlug,
  currentLessonId,
  completedLessons,
}: {
  module: any;
  moduleIndex: number;
  courseSlug: string;
  currentLessonId: number;
  completedLessons: number[];
}) {
  const { data: lessons } = trpc.courses.getLessons.useQuery({ moduleId: module.id });

  return (
    <div className="mb-6">
      <h4 className="text-gray-400 text-sm font-medium mb-2">
        Módulo {moduleIndex + 1}: {module.title}
      </h4>
      <div className="space-y-1">
        {lessons?.map((lesson: any, lessonIndex: number) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;

          return (
            <Link key={lesson.id} href={`/curso/${courseSlug}/aula/${lesson.id}`}>
              <div
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-purple-500/20 text-white"
                    : "hover:bg-gray-800/50 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Play className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="text-sm truncate">
                  {lessonIndex + 1}. {lesson.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
