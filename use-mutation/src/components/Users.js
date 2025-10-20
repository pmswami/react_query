import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

async function fetchUsers() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

async function addUser(user) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to add user');
  return res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete user');
  return id;
}

export default function Users() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewName('');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching users</p>;

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">User List</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter name"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={() => addUserMutation.mutate({ name: newName })}
          disabled={addUserMutation.isPending || !newName.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {addUserMutation.isPending ? 'Adding...' : 'Add'}
        </button>
      </div>

      <ul className="divide-y">
        {users?.map((user) => (
          <li key={user.id} className="flex justify-between py-2">
            <span>{user.name}</span>
            <button
              onClick={() => deleteUserMutation.mutate(user.id)}
              className="text-red-600 hover:underline"
              disabled={deleteUserMutation.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
