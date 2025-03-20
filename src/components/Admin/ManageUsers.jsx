import { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!userInfo || !userInfo.token) {
          setError("Unauthorized: No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get("https://bazario-backend-iqac.onrender.com/api/users", config);
        setUsers(data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        setError(error.response?.data?.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Promote to Vendor
  const promoteToVendor = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.put(`https://bazario-backend-iqac.onrender.com/api/users/${userId}/promote`, {}, config);

      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: "vendor" } : user
      ));

      alert("✅ User promoted to Vendor!");
    } catch (error) {
      console.error("❌ Error promoting user:", error);
      alert("Failed to promote user.");
    }
  };

  // Demote Vendor to Customer
  const demoteToCustomer = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.put(`https://bazario-backend-iqac.onrender.com/api/users/${userId}/demote`, {}, config);

      setUsers(users.map(user =>
        user._id === userId ? { ...user, role: "customer" } : user
      ));

      alert("✅ Vendor demoted to Customer!");
    } catch (error) {
      console.error("❌ Error demoting user:", error);
      alert("Failed to demote user.");
    }
  };

  // Delete User
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.delete(`https://bazario-backend-iqac.onrender.com/api/users/${userId}`, config);

      setUsers(users.filter(user => user._id !== userId));
      alert("✅ User deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Manage Users</h3>
      {error && <p className="text-danger">{error}</p>}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`badge ${user.role === "admin" ? "bg-danger" : user.role === "vendor" ? "bg-primary" : "bg-info"}`}>
                  {user.role}
                </span>
              </td>
              <td>
                {user.role === "customer" && (
                  <button className="btn btn-sm btn-warning me-2" onClick={() => promoteToVendor(user._id)}>
                    Promote to Vendor
                  </button>
                )}
                {user.role === "vendor" && (
                  <button className="btn btn-sm btn-secondary me-2" onClick={() => demoteToCustomer(user._id)}>
                    Demote to Customer
                  </button>
                )}
                {user.role !== "admin" && (
                  <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                )}
                {user.role === "admin" && (
                  <span className="text-muted">Cannot delete admin</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
