import { FaLink } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signOutUserSuccess } from "../redux/user/userSlice";
import { toast } from "react-toastify";

export default function Header() {
  const { currentUserName, accessToken } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    dispatch(signOutUserSuccess());
    toast.success("Вы успешно вышли");
  };

  return (
    <header className="flex justify-between items-center py-2 px-4 bg-slate-200 shadow-md">
      <div className="">
        <Link to="/" className="flex items-center gap-2">
          <FaLink size={24} className="fill-blue-900" />
          <h1 className="text-lg font-semibold">
            <span>Hot</span>
            <span className="text-blue-900">Link</span>
          </h1>
        </Link>
      </div>
      <div className="flex gap-4 text-slate-700">
        <p>{currentUserName ? currentUserName : ""}</p>
        { accessToken ? (
          <button
            onClick={handleSignOut}
            className="rounded bg-slate-500 hover:bg-slate-600 px-2 transition text-white"
          >
            Выйти
          </button>
        ) : (
          <Link to="/sign-in">
            <button className="rounded bg-slate-500 hover:bg-slate-600 px-2 transition text-white">
              Войти
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
