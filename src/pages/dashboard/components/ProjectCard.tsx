import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom";
import { Clock, Globe, Lock } from "lucide-react"



export const ProjectCard = ({project}:{project: any}) => {
    const navigate = useNavigate();
    return (
        <Card
      tabIndex={0}
      onClick={() => navigate(`/project/${project.id}`)}
      className={`group/canvas-card cursor-pointer p-4 h-48 flex flex-col justify-between items-start hover:border-muted-foreground/50 relative overflow-hidden transition-all`}
    >

      <div className="space-x-2 flex items-center justify-start w-full z-10">
        <img
          alt=""
          src={
            "/cairo.png"
          }
          width={20}
          height={20}
        />
        <div className="font-medium static whitespace-nowrap w-full text-ellipsis overflow-hidden">
          {project.name}
        </div>
        {/* <ProjectCardDropdown
          sandbox={sandbox}
          onVisibilityChange={onVisibilityChange}
          onDelete={onDelete}
        /> */}
      </div>
      <div className="flex flex-col text-muted-foreground space-y-0.5 text-sm z-10">
        <div className="flex items-center">
          {project.visibility === "private" ? (
            <>
              <Lock className="w-3 h-3 mr-2" /> Private
            </>
          ) : (
            <>
              <Globe className="w-3 h-3 mr-2" /> Public
            </>
          )}
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-2" /> {project.createdAt}
        </div>
      </div>
    </Card>
    )
}