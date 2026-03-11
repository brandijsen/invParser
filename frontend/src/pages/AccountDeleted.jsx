import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const AccountDeleted = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const hasError = searchParams.get("error") === "invalid";

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="pt-24 pb-24 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        {hasError ? (
          <>
            <FiAlertCircle className="mx-auto text-5xl text-amber-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Link non valido o scaduto</h1>
            <p className="text-slate-600 text-sm mb-6">
              Il link per confermare l'eliminazione non è valido o è scaduto (24 ore).{" "}
              <Link to="/profile" className="text-emerald-600 hover:underline font-medium">
                Vai al profilo
              </Link>{" "}
              per richiedere un nuovo link.
            </p>
          </>
        ) : (
          <>
            <FiCheckCircle className="mx-auto text-5xl text-emerald-500 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 mb-2">Account eliminato</h1>
            <p className="text-slate-600 text-sm mb-6">
              Il tuo account e tutti i dati associati sono stati eliminati in modo permanente.
            </p>
          </>
        )}
        <Link
          to="/"
          className="inline-block px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
        >
          Torna alla home
        </Link>
      </div>
    </div>
  );
};

export default AccountDeleted;
