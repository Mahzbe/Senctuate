// Login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const username = document.getElementById('username-input').value;
  const password = document.getElementById('password-input').value;

  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Login successful') {
      // Login successful, fetch notifications
      fetch(`/api/notifications?user_id=${data.user_id}`)
      .then(response => response.json())
      .then(data => {
        // Update notification list
        const notificationList = document.getElementById('notification-list');
        notificationList.innerHTML = ''; // Clear existing notifications
        data.forEach(function(notification) {
          const notificationListItem = document.createElement('LI');
          notificationListItem.innerHTML = `
            <span>${notification.title}</span>
            <p>${notification.message}</p>
          `;
          notificationList.appendChild(notificationListItem);
        });
        document.getElementById('notification-counter').textContent = data.length;
      });
    } else {
      // Login failed, display error message
      console.error(data.message);
    }
  });
});

// Notification button functionality
document.getElementById('notification-button').addEventListener('click', function() {
  var notificationList = document.querySelector('.notification-list');
  if (notificationList.style.display === 'none') {
    notificationList.style.display = 'block';
  } else {
    notificationList.style.display = 'none';
  }
});
