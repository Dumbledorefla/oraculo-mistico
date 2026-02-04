/**
 * Página de Detalhes do Curso - Oráculo Místico
 */

import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  Lock,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";

const LEVELS = {
  iniciante: { label: "Iniciante", color: "bg-green-500/20 text-green-400" },
  intermediario: { label: "Intermediário", color: "bg-yellow-500/20 text-yellow-400" },
  avancado: { label: "Avançado", color: "bg-red-500/20 text-red-400" },
};

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  const { data: course, isLoading } = trpc.courses.getBySlug.useQuery({ slug: slug || "" });
  const { data: modules } = trpc.courses.getModules.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id }
  );
  const { data: enrollments } = trpc.courses.getMyEnrollments.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: progress } = trpc.courses.getProgress.useQuery(
    { courseId: course?.id || 0 },
    { enabled: !!course?.id && isAuthenticated }
  );

  const enrollMutation = trpc.courses.enroll.useMutation({
    onSuccess: () => {
      toast.success("Matrícula realizada com sucesso!");
      setLocation(`/curso/${slug}/aula/1`);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar matrícula");
    },
  });

  const checkoutMutation = trpc.courses.checkout.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.info("Redirecionando para o pagamento...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao iniciar checkout");
    },
  });

  const isEnrolled = enrollments?.some(e => e.courseId === course?.id);
  const completedLessons = progress?.filter(p => p.isCompleted).length || 0;
  const totalLessons = course?.totalLessons || 0;
  const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleEnroll = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para se matricular");
      return;
    }
    if (!course?.id) return;

    // If course is free, enroll directly
    if (course.isFree) {
      enrollMutation.mutate({ courseId: course.id });
    } else {
      // If course is paid, redirect to checkout
      checkoutMutation.mutate({
        courseId: course.id,
        courseSlug: course.slug,
        courseName: course.title,
        courseDescription: course.description || "",
        price: course.price || "0",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Curso não encontrado</h1>
          <Link href="/cursos">
            <Button>Voltar aos Cursos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = LEVELS[course.level as keyof typeof LEVELS] || LEVELS.iniciante;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/cursos">
              <a className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </a>
            </Link>
            <Link href="/">
              <a className="flex items-center gap-2 text-amber-400 font-serif text-xl">
                <Sparkles className="w-6 h-6" />
                Oráculo Místico
              </a>
            </Link>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={course.imageUrl || "https://images.unsplash.com/photo-1601065638984-7f1c2e0d4c9a?w=1200"}
            alt={course.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/50 via-gray-950/80 to-gray-950" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  <Badge className={levelInfo.color}>{levelInfo.label}</Badge>
                  {course.isFree && (
                    <Badge className="bg-green-500/90 text-white">Grátis</Badge>
                  )}
                  {course.isFeatured && (
                    <Badge className="bg-amber-500/90 text-white">Destaque</Badge>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                  {course.title}
                </h1>

                <p className="text-gray-400 text-lg mb-6">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-lg">
                      {course.instructorName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{course.instructorName}</p>
                    <p className="text-gray-500 text-sm">Instrutor</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-gray-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span>{course.totalLessons || 0} aulas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span>
                      {course.totalDuration 
                        ? `${Math.floor(course.totalDuration / 60)}h ${course.totalDuration % 60}min`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    <span>{course.enrollmentCount || 0} alunos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    <span>4.8 (120 avaliações)</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gray-900/80 border-purple-500/20 sticky top-24">
                  <CardContent className="p-6">
                    {/* Preview Image */}
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                      <img
                        src={course.imageUrl || "https://images.unsplash.com/photo-1601065638984-7f1c2e0d4c9a?w=800"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-16 h-16 bg-amber-500/90 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      {course.isFree ? (
                        <span className="text-4xl font-bold text-green-400">Grátis</span>
                      ) : (
                        <span className="text-4xl font-bold text-amber-400">
                          R$ {parseFloat(course.price || "0").toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>

                    {/* Progress (if enrolled) */}
                    {isEnrolled && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Seu progresso</span>
                          <span>{completedLessons}/{totalLessons} aulas</span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    )}

                    {/* CTA Button */}
                    {isEnrolled ? (
                      <Link href={`/curso/${slug}/aula/1`}>
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-6 text-lg">
                          <Play className="w-5 h-5 mr-2" />
                          Continuar Curso
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={handleEnroll}
                        disabled={enrollMutation.isPending}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-6 text-lg"
                      >
                        {enrollMutation.isPending ? (
                          "Matriculando..."
                        ) : course.isFree ? (
                          "Começar Agora - Grátis"
                        ) : (
                          "Comprar Curso"
                        )}
                      </Button>
                    )}

                    {/* Features */}
                    <div className="mt-6 space-y-3 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Acesso vitalício</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Certificado de conclusão</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Suporte do instrutor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Acesso em qualquer dispositivo</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="lg:max-w-3xl">
            <h2 className="text-2xl font-serif text-white mb-6">
              Conteúdo do Curso
            </h2>

            <div className="space-y-4">
              {modules?.map((module, moduleIndex) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  moduleIndex={moduleIndex}
                  isExpanded={expandedModules.includes(module.id)}
                  onToggle={() => toggleModule(module.id)}
                  courseSlug={slug || ""}
                  isEnrolled={isEnrolled || false}
                  completedLessons={progress?.filter(p => p.isCompleted).map(p => p.lessonId) || []}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModuleCard({
  module,
  moduleIndex,
  isExpanded,
  onToggle,
  courseSlug,
  isEnrolled,
  completedLessons,
}: {
  module: any;
  moduleIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  courseSlug: string;
  isEnrolled: boolean;
  completedLessons: number[];
}) {
  const { data: lessons } = trpc.courses.getLessons.useQuery(
    { moduleId: module.id },
    { enabled: isExpanded }
  );

  return (
    <Card className="bg-gray-900/50 border-purple-500/20">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer hover:bg-purple-500/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-purple-400 font-bold">{moduleIndex + 1}</span>
              </div>
              <div className="text-left">
                <CardTitle className="text-white text-lg">{module.title}</CardTitle>
                <p className="text-gray-500 text-sm">{module.description}</p>
              </div>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-2 pl-14">
              {lessons?.map((lesson: any, lessonIndex: number) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = !lesson.isFree && !isEnrolled;

                return (
                  <Link
                    key={lesson.id}
                    href={isLocked ? "#" : `/curso/${courseSlug}/aula/${lesson.id}`}
                  >
                    <div
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isLocked
                          ? "bg-gray-800/30 cursor-not-allowed"
                          : "bg-gray-800/50 hover:bg-purple-500/10 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : isLocked ? (
                          <Lock className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Play className="w-5 h-5 text-purple-400" />
                        )}
                        <span className={isLocked ? "text-gray-500" : "text-gray-300"}>
                          {lessonIndex + 1}. {lesson.title}
                        </span>
                        {lesson.isFree && !isEnrolled && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            Grátis
                          </Badge>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">
                        {lesson.duration} min
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
