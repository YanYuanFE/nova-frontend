import { EditorCore } from "@/components/Editor";
import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { getProject } from "@/services/project";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";


export default function Project() {
  const { projectId } = useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProject(projectId as string),
  });

  return (
    <Loading loading={!project || isLoading}>
      <Header/>
      <EditorCore project={project!} />
    </Loading>
  )
}