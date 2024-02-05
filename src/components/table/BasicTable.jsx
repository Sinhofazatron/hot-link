import { useMemo } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useTable, usePagination } from "react-table";
import "./table.css";
import { COLUMNS } from "./columns";
import {
  GrCaretNext,
  GrChapterNext,
  GrChapterPrevious,
  GrCaretPrevious,
} from "react-icons/gr";
import { FaSort } from "react-icons/fa6";

export default function BasicTable() {
  const [sortByShort, setSortByShort] = useState("asc_short");
  const [sortByTarget, setSortByTarget] = useState("asc_target");
  const [sortByCounter, setSortByCounter] = useState("asc_counter");
  const [totalCount, setTotalCount] = useState(0);
  const [allLinks, setAllLinks] = useState([]);
  const { accessToken, tokenType, toggleGetLink } = useSelector(
    (state) => state.user
  );

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => allLinks, [allLinks]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    usePagination
  );

  const { pageIndex, pageSize } = state;

  useEffect(() => {
    const handleSubmit = async () => {
      try {
        const res = await fetch(
          `https://front-test.hex.team/api/statistics?order=${sortByShort}&order=${sortByTarget}&order=${sortByCounter}&offset=0&limit=0`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${tokenType} ${accessToken}`,
            },
          }
        );
        const data = await res.json();

        if (data.detail) {
          toast.error(data.detail[0].msg);
          return;
        }

        setTotalCount(res.headers.get("X-Total-Count"));
        setAllLinks(data);
      } catch (error) {
        toast.error(error.message);
      }
    };

    handleSubmit();
  }, [
    toggleGetLink,
    accessToken,
    tokenType,
    sortByShort,
    sortByTarget,
    sortByCounter,
  ]);

  const handleSort = (sortItem) => {
    switch (sortItem) {
      case "Target Link":
        setSortByTarget(
          sortByTarget === "asc_target" ? "desc_target" : "asc_target"
        );
        break;
      case "Short Link":
        setSortByShort(
          sortByShort === "asc_short" ? "desc_short" : "asc_short"
        );
        break;
      case "Counter":
        setSortByCounter(
          sortByCounter === "asc_counter" ? "desc_counter" : "asc_counter"
        );
        break;
    }
  };

  if (!+totalCount) {
    return null;
  }

  return (
    <div className="flex text-center flex-col w-[80%] m-auto gap-4">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={headerGroup.id}
                  {...column.getHeaderProps()}
                  className={
                    column.Header !== "Id"
                      ? "relative cursor-pointer"
                      : "cursor-default"
                  }
                  onClick={() => handleSort(column.Header)}
                >
                  {column.Header !== "Id" ? (
                    <FaSort className="absolute right-4 top-4 " />
                  ) : null}
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      key={row.id}
                      {...cell.getCellProps()}
                      className="text-center"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <GrChapterPrevious
              className={
                !canPreviousPage
                  ? "invisible"
                  : "stroke-blue-700 hover:stroke-blue-900 transition"
              }
            />
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <GrCaretPrevious
              className={
                !canPreviousPage
                  ? "invisible"
                  : "stroke-blue-700 hover:stroke-blue-900 transition"
              }
            />
          </button>
          <span className="mx-3">
            <strong>
              {pageIndex + 1} из {pageOptions.length}
            </strong>
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <GrCaretNext
              className={
                !canNextPage
                  ? "invisible"
                  : "stroke-blue-700 hover:stroke-blue-900 transition"
              }
            />
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <GrChapterNext
              className={
                !canNextPage
                  ? "invisible"
                  : "stroke-blue-700 hover:stroke-blue-900 transition"
              }
            />
          </button>
        </div>
        <div className="flex items-center justify-center">
          <span className="mr-2">Перейти на: </span>
          <input
            className="w-[40px] h-[26px] border border-slate-400 rounded p-1"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
          />

          <span className="ml-4 mr-2">Показывать по: </span>
          <select
            className="border border-slate-400 rounded p-1 h-[27px] text-sm text-center"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
