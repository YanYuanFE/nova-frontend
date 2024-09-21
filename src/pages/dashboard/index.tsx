import { useQuery } from '@tanstack/react-query';
import { NewProjectModal } from './components/CreateProject';
import { getProjects } from '@/services/project';
import { ProjectCard } from './components/ProjectCard';
import { Header } from '@/components/Header';

export default function Dashboard() {
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });
  console.log(projects);
  return (
    <div>
      <Header />
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Projects</h1>
          <NewProjectModal />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          {projects?.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
