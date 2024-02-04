import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {  toast } from 'react-toastify';
import { signUpSuccess } from "../redux/user/userSlice";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `https://front-test.hex.team/api/register?username=${username}&password=${password}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (data.detail) {
        setLoading(false);
        toast.error(data.detail);
        return;
      }

      dispatch(signUpSuccess(data));
      toast.success('Пользователь успешно создан!')
      setLoading(false);
      navigate("/sign-in");
    } catch (error) {
      toast.error(error.message)
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Регистрация</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Имя пользователя"
          className="border p-3 rounded-lg focus:outline-slate-500"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          className="border p-3 rounded-lg focus:outline-slate-500"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className=" mt-4 bg-slate-500 text-white p-3 rounded-lg uppercase hover:bg-slate-600 hover:shadow-lg transition min-w-[15rem] m-auto disabled:opacity-80 disabled:hover:bg-slate-500 disabled:hover:opacity-80 disabled:hover:shadow-none"
        >
          {loading ? "Загрузка..." : "Регистрация"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 justify-center">
        <p>Уже зарегистрированы?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Войти</span>
        </Link>
      </div>
    </div>
  );
}
