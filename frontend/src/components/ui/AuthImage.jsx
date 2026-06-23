import { useEffect, useState } from "react";

function AuthImage({ url, className }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => setSrc(URL.createObjectURL(blob)));

    return () => src && URL.revokeObjectURL(src);
  }, [url]);

  if (!src) {
    return (
      <div className="w-20 h-20 bg-neutral-800 rounded-xl animate-pulse" />
    );
  }
  return <img src={src} className={className} alt="" />;
}

export default AuthImage;
