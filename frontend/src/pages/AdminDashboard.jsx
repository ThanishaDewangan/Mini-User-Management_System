import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { toast } from 'react-toastify'
import ConfirmModal from '../components/ConfirmModal'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10
  })
  const [actionModal, setActionModal] = useState({
    show: false,
    type: null,
    userId: null,
    userName: null
  })

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      fetchUsers()
    }
  }, [currentUser, pagination.currentPage])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/users?page=${pagination.currentPage}&limit=10`)
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async () => {
    try {
      await api.patch(`/users/${actionModal.userId}/activate`)
      toast.success('User activated successfully')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate user')
    } finally {
      setActionModal({ show: false, type: null, userId: null, userName: null })
    }
  }

  const handleDeactivate = async () => {
    try {
      await api.patch(`/users/${actionModal.userId}/deactivate`)
      toast.success('User deactivated successfully')
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate user')
    } finally {
      setActionModal({ show: false, type: null, userId: null, userName: null })
    }
  }

  const openModal = (type, userId, userName) => {
    setActionModal({ show: true, type, userId, userName })
  }

  const closeModal = () => {
    setActionModal({ show: false, type: null, userId: null, userName: null })
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }))
  }

  if (currentUser?.role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all users in the system</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">No users found</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.fullName}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {user.status === 'inactive' ? (
                            <button
                              className="btn-activate"
                              onClick={() => openModal('activate', user.id, user.fullName)}
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              className="btn-deactivate"
                              onClick={() => openModal('deactivate', user.id, user.fullName)}
                              disabled={user.id === currentUser?.id}
                            >
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn-secondary"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="btn-secondary"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        show={actionModal.show}
        type={actionModal.type}
        userName={actionModal.userName}
        onConfirm={actionModal.type === 'activate' ? handleActivate : handleDeactivate}
        onCancel={closeModal}
      />
    </div>
  )
}

export default AdminDashboard

