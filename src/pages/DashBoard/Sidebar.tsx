import { ChartBarStacked, LayoutDashboard, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";


interface Icon {
  children: React.ReactNode;
  title: string;
}
const IconComponent = ({ children, title }: Icon) => {
  return (
    <div className="flex gap-4 text-gray-800 cursor-pointer">
      <div>{children}</div>
      <h3>{title}</h3>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="w-3/12 flex flex-col gap-10 bg-white p-4">
      <div className="flex gap-4 text-2xl items-center">
        <LayoutDashboard />
        <span className="font-bold">Dashboard</span>
      </div>
      <ul className="flex flex-col gap-4">
        <Link to="/dashboard">
          <li>
            <IconComponent title="Categories">
              <ChartBarStacked />
            </IconComponent>
          </li>
        </Link>
        <li>
          <Link to="/dashboard/editProduct">
            {" "}
            <IconComponent title="Products">
              <PackageSearch />
            </IconComponent>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
