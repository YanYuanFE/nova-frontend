import { Link } from "react-router-dom";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";


const Header = () => {
    return (
        <div className="h-16 px-4 w-full flex items-center justify-between border-b border-border">
            <div className="flex items-center space-x-4">
                <Link
                    to="/"
                    className="ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none rounded-sm"
                >
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Icons.logo className="mr-2 h-6 w-6" />
                        Nova
                    </div>
                </Link>
            </div>
            <div className="flex items-center space-x-4">
                {/* <DashboardNavbarSearch />
                <UserButton userData={userData} /> */}
            </div>
        </div>
    )
}

export default function Dashboard() {
    return (
        <div>
            <Header />
            <div className="max-w-4xl mx-auto p-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <Button>Create Project</Button>
                </div>
            </div>
        </div>
    );
}