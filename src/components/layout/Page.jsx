import { useEffect } from "react";

export default function Page({ title, children }) {
  useEffect(() => { document.title = `${title}: Ember & Root`; }, [title]);
  return children;
}