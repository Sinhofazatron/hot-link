import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { FaRegCopy } from "react-icons/fa6";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSelector } from "react-redux";

export default function ConvertLink() {
    
  const [targetLink, setTargetLink] = useState("");
  const [loading, setLoading] = useState("");
  const [shortLink, setShortLink] = useState("");
  const { accessToken, tokenType } = useSelector(
    (state) => state.user
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `https://front-test.hex.team/api/squeeze?link=${targetLink}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${accessToken}`,
          },
        }
      );
      const data = await res.json();

      if (data.detail) {
        setLoading(false);
        toast.error(data.detail[0].msg);
        return;
      }
      setShortLink(data.short);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const onCopy = useCallback(() => {
    toast.success('Ссылка скопирована!')
  }, []);

  return (
    <div className="text-center p-3 max-w-lg mx-auto mb-16">
      <p className="font-serif text-xl sm:text-2xl font-semibold text-teal-900 pt-5 pb-8 sm:px-2">
        Вставьте ссылку в поле
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Ваша ссылка"
          className="border p-3 rounded-lg focus:outline-slate-500"
          id="link"
          value={targetLink}
          onChange={(e) => setTargetLink(e.target.value)}
          required
        />

        <div className="shortLink relative text-center w-full  mx-auto">
          <input
            disabled
            type="text"
            placeholder="Здесь будет короткая ссылка"
            className={
              shortLink
                ? "p-3 w-full rounded-lg bg-gray-50 border border-gray-300 transition"
                : "p-3 w-full rounded-lg bg-gray-300 border"
            }
            id="shortLink"
            value={shortLink}
          />
          {shortLink ? (
            <CopyToClipboard onCopy={onCopy} text={shortLink}>
              <FaRegCopy
                size={20}
                className="absolute right-[2%] top-[20%] fill-slate-500 hover:cursor-pointer hover:fill-slate-700 transition"
              />
            </CopyToClipboard>
          ) : null}
        </div>

        <button
          disabled={loading}
          className=" mt-4 bg-slate-500 text-white p-3 rounded-lg uppercase hover:bg-slate-600 hover:shadow-lg transition min-w-[15rem] m-auto disabled:opacity-80 disabled:hover:bg-slate-500 disabled:hover:opacity-80 disabled:hover:shadow-none"
        >
          {loading ? "Загрузка..." : "Получить ссылку"}
        </button>
      </form>
    </div>
  );
}
