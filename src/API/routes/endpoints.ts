export const marcasEndpoints = {
  auth: {
    login: "/auth/login",
  },

  notifications: {
    forAdmin: (userId: number) =>
      \`/notifications/notifications/for-admin/\${userId}\`,

    markAsRead: (notificationId: number) =>
      \`/notifications/update-notify/\${notificationId}\`,

    clearAllAdmin: (userId: number) =>
      \`/notifications/delete-all-notifications-admin/\${userId}\`,
  },
} as const;
