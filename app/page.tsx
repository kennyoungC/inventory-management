import HeaderBar from "./ui/headerBar";
import SideBar from "./ui/sideBar";

export default function Home() {
  return (
      <div className="relative">
      <div className="absolute right-0 top-0">
        <HeaderBar />
      </div>
      <SideBar Page="inventory-management" />
    </div>
  );
}
