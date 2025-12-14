function applyTheme() {
  const savedTheme = localStorage.getItem('p54_theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const isDark = savedTheme
    ? savedTheme === 'dark'
    : systemDark;

  document.body.classList.remove('dark', 'light');
  document.body.classList.add(isDark ? 'dark' : 'light');

  const logo = document.getElementById('pay54Logo');
  if (logo) {
    logo.src = isDark
      ? '../assets/img/logo/pay54-logo-dark.svg'
      : '../assets/img/logo/pay54-logo-light.svg';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('p54_theme', isDark ? 'light' : 'dark');
  applyTheme();
}

document.addEventListener('DOMContentLoaded', applyTheme);
