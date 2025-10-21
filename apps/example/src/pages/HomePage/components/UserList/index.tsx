import { useGetUsers } from '@repo/api';

/**
 * 사용자 목록 컴포넌트
 *
 * @repo/api의 useGetUsers hook을 사용하여 사용자 목록을 조회합니다.
 */
export function UserList() {
  const {
    data: users,
    isLoading,
    error,
  } = useGetUsers({ params: { limit: 10 } });

  if (isLoading) {
    return (
      <div style={{ padding: '20px' }}>
        <p>사용자 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>에러가 발생했습니다: {error.message}</p>
      </div>
    );
  }

  // Handle case where users is not an array
  if (!users || !Array.isArray(users)) {
    return (
      <div style={{ padding: '20px', color: 'orange' }}>
        <p>유효하지 않은 데이터 형식입니다.</p>
        <p>받은 데이터: {JSON.stringify(users)}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>사용자 목록 (API 예시)</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>{user.name}</h3>
            <p style={{ margin: '4px 0', color: '#666' }}>
              <strong>Email:</strong> {user.email}
            </p>
            <p style={{ margin: '4px 0', color: '#666' }}>
              <strong>Username:</strong> {user.username}
            </p>
            {user.phone && (
              <p style={{ margin: '4px 0', color: '#666' }}>
                <strong>Phone:</strong> {user.phone}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
