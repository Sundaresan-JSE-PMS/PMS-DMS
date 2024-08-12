import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface NotificationBoxProps {
  notifications: string[];
  clearNotifications: () => void;
}

export const NotificationBox: React.FC<NotificationBoxProps> = ({ notifications, clearNotifications }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        width: '300px',
        backgroundColor: '#333',
        color: '#FFF',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Typography variant="h6" sx={{ borderBottom: '1px solid #FFF', marginBottom: '10px' }}>
        Notifications
      </Typography>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Typography key={index} sx={{ marginBottom: '5px' }}>
            {notification}
          </Typography>
        ))
      ) : (
        <Typography>No notifications</Typography>
      )}
      {notifications.length > 0 && (
        <Button
          variant="contained"
          color="secondary"
          onClick={clearNotifications}
          sx={{ marginTop: '10px' }}
        >
          Clear All
        </Button>
      )}
    </Box>
  );
};
