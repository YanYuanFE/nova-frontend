import { EditorCore } from "@/components/Editor";
import { getProject } from "@/services/project";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";


export default function Project() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId as string),
  });

  if (!project || isLoading) return <div>Loading...</div>;

  return (
    <EditorCore project={project} />
  )
}