import { ModuleCard } from './ModuleCard';
import { useNavigate } from 'react-router-dom';
import { Building, ClipboardCheck, Users, BookOpen, Brain } from 'lucide-react';

interface ModuleGridProps {
  progress: {
    regulatory: number;
    startup: number;
    recruitment: number;
    training: number;
  };
}

export function ModuleGrid({ progress }: ModuleGridProps) {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'irb',
      title: 'IRB Materials',
      description: 'Generate comprehensive IRB submission documents',
      icon: <Building className="h-6 w-6" />,
      path: '/irb-materials',
      progress: progress.regulatory,
      status: 'In Progress',
      badge: 'Priority'
    },
    {
      id: 'startup',
      title: 'Study Startup',
      description: 'Track and manage study initiation tasks',
      icon: <ClipboardCheck className="h-6 w-6" />,
      path: '/startup-checklist',
      progress: progress.startup,
      status: 'Active',
      badge: 'New'
    },
    {
      id: 'recruitment',
      title: 'Recruitment',
      description: 'Design patient recruitment strategies',
      icon: <Users className="h-6 w-6" />,
      path: '/recruitment-materials',
      progress: progress.recruitment,
      status: 'Not Started'
    },
    {
      id: 'training',
      title: 'Training Materials',
      description: 'Create study-specific training content',
      icon: <BookOpen className="h-6 w-6" />,
      path: '/training-materials',
      progress: progress.training,
      status: 'Active'
    },
    {
      id: 'protocol',
      title: 'Protocol Analysis',
      description: 'AI-powered protocol optimization',
      icon: <Brain className="h-6 w-6" />,
      path: '/protocol-analysis',
      status: 'Ready',
      badge: 'AI Powered'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Study Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            {...module}
            onClick={() => navigate(module.path)}
          />
        ))}
      </div>
    </div>
  );
}