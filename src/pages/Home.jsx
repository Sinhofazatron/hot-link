import BasicTable from "../components/table/BasicTable";
import ConvertLink from "../components/ConvertLink";
import { useSelector } from "react-redux";

export default function Home() {
  const { accessToken } = useSelector((state) => state.user);

  if (!accessToken) {
    return (
      <div className="flex mt-40 items-center justify-center h-full w-full">
        <p className="text-2xl font-semibold">Войдите в систему</p>
      </div>
    );
  }

  return (
    <div>
      <ConvertLink />
      <BasicTable />
    </div>
  );
}
