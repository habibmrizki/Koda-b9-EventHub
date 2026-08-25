import useFetch from "../hooks/useLocaleStorage";

const UserList = () => {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users",
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Daftar Name</h2>
      <ul>
        {data && data.map((user) => <li key={user.id}>{user.username}</li>)}
      </ul>
    </div>
  );
};

export default UserList;
