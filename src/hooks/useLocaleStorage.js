// import { useEffect, useState } from "react";

// const useFetch = (url) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(url);

//           throw new Error(`Error ${response.status}: ${response.statusText}`);
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [url]);

//   return { data, loading, error };
// };

// export default useFetch;
